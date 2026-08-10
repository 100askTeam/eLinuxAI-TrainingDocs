import {readdir, readFile, stat} from 'node:fs/promises';
import path from 'node:path';

const DOCUMENT_EXTENSIONS = new Set(['.md', '.mdx']);
const MAX_SNIPPET_LENGTH = 320;

export class DocumentIndex {
  constructor({docsRoot, publicBaseUrl, refreshIntervalMs = 30000}) {
    this.docsRoot = path.resolve(docsRoot);
    this.publicBaseUrl = publicBaseUrl;
    this.refreshIntervalMs = refreshIntervalMs;
    this.documents = [];
    this.aliases = new Map();
    this.indexedAt = null;
    this.lastRefreshAttempt = 0;
    this.refreshPromise = null;
  }

  async initialize() {
    await this.refresh({force: true});
    return this.status();
  }

  async refresh({force = false} = {}) {
    const now = Date.now();
    if (!force && this.indexedAt && now - this.lastRefreshAttempt < this.refreshIntervalMs) {
      return this.status();
    }
    if (this.refreshPromise) return this.refreshPromise;

    this.lastRefreshAttempt = now;
    this.refreshPromise = this.#buildIndex();
    try {
      return await this.refreshPromise;
    } finally {
      this.refreshPromise = null;
    }
  }

  async search(query, {limit = 8, scope} = {}) {
    await this.refresh();
    const normalizedQuery = normalizeSearchText(query);
    if (!normalizedQuery) return [];

    const terms = tokenizeQuery(normalizedQuery);
    const normalizedScope = normalizeLookupKey(scope || '');
    const results = [];

    for (const document of this.documents) {
      if (normalizedScope && !matchesScope(document, normalizedScope)) continue;
      const match = scoreDocument(document, normalizedQuery, terms);
      if (match.score <= 0) continue;
      results.push({
        id: document.id,
        title: document.title,
        description: document.description,
        url: document.url,
        section: match.section,
        snippet: createSnippet(document.plainText, normalizedQuery, match.matchedTerms),
        score: Math.round(match.score * 100) / 100,
      });
    }

    return results
      .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title, 'zh-CN'))
      .slice(0, limit);
  }

  async fetch(id, {offset = 0, maxChars = 120000} = {}) {
    await this.refresh();
    const document = this.#findDocument(id);
    if (!document) return null;

    const safeOffset = Math.min(offset, document.content.length);
    const end = Math.min(safeOffset + maxChars, document.content.length);
    return {
      id: document.id,
      title: document.title,
      description: document.description,
      url: document.url,
      sourcePath: document.sourcePath,
      content: document.content.slice(safeOffset, end),
      offset: safeOffset,
      returnedChars: end - safeOffset,
      totalChars: document.content.length,
      truncated: end < document.content.length,
      nextOffset: end < document.content.length ? end : null,
    };
  }

  async list({prefix, offset = 0, limit = 50} = {}) {
    await this.refresh();
    const normalizedPrefix = normalizeLookupKey(prefix || '');
    const matched = normalizedPrefix
      ? this.documents.filter((document) => matchesScope(document, normalizedPrefix))
      : this.documents;
    const items = matched.slice(offset, offset + limit).map((document) => ({
      id: document.id,
      title: document.title,
      description: document.description,
      url: document.url,
    }));
    return {
      total: matched.length,
      offset,
      limit,
      nextOffset: offset + items.length < matched.length ? offset + items.length : null,
      items,
    };
  }

  status() {
    return {
      documentCount: this.documents.length,
      indexedAt: this.indexedAt,
      refreshIntervalMs: this.refreshIntervalMs,
    };
  }

  async #buildIndex() {
    const docsRootStat = await stat(this.docsRoot).catch(() => null);
    if (!docsRootStat?.isDirectory()) {
      throw new Error(`Documentation directory does not exist: ${this.docsRoot}`);
    }

    const files = await collectDocumentFiles(this.docsRoot);
    const documents = [];
    const aliases = new Map();
    const canonicalIds = new Set();

    for (const absolutePath of files) {
      const source = await readFile(absolutePath, 'utf8');
      const sourcePath = toPosixPath(path.relative(this.docsRoot, absolutePath));
      const parsed = parseFrontMatter(source);
      const sourceId = sourcePath.replace(/\.(?:md|mdx)$/iu, '');
      let id = buildCanonicalId(sourceId, parsed.attributes.slug);

      if (canonicalIds.has(normalizeLookupKey(id))) {
        id = sourceId;
      }
      canonicalIds.add(normalizeLookupKey(id));

      const headings = extractHeadings(parsed.body);
      const title = parsed.attributes.title || headings[0]?.text || titleFromId(id);
      const description = parsed.attributes.description || '';
      const plainText = markdownToPlainText(parsed.body);
      const url = buildPublicUrl(this.publicBaseUrl, id, parsed.attributes.slug);
      const document = {
        id,
        title,
        description,
        url,
        sourcePath,
        content: parsed.body.trim(),
        plainText,
        headings,
        searchable: {
          id: normalizeSearchText(id),
          sourcePath: normalizeSearchText(sourcePath),
          title: normalizeSearchText(title),
          description: normalizeSearchText(description),
          headings: normalizeSearchText(headings.map((heading) => heading.text).join(' ')),
          body: normalizeSearchText(plainText),
        },
      };

      documents.push(document);
      registerAliases(aliases, document, sourceId, parsed.attributes.slug);
    }

    documents.sort((left, right) => left.id.localeCompare(right.id, 'en'));
    this.documents = documents;
    this.aliases = aliases;
    this.indexedAt = new Date().toISOString();
    return this.status();
  }

  #findDocument(id) {
    for (const key of lookupCandidates(id, this.publicBaseUrl)) {
      const document = this.aliases.get(key);
      if (document) return document;
    }
    return null;
  }
}

async function collectDocumentFiles(directory) {
  const entries = await readdir(directory, {withFileTypes: true});
  const nested = await Promise.all(entries.map(async (entry) => {
    if (entry.name.startsWith('.')) return [];
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectDocumentFiles(absolutePath);
    if (!entry.isFile() || !DOCUMENT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) return [];
    if (entry.name.startsWith('_')) return [];
    return [absolutePath];
  }));
  return nested.flat().sort((left, right) => left.localeCompare(right, 'en'));
}

export function parseFrontMatter(source) {
  const normalized = source.replace(/^\uFEFF/u, '');
  const match = normalized.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/u);
  if (!match) return {attributes: {}, body: normalized};

  const attributes = {};
  for (const line of match[1].split(/\r?\n/u)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/u);
    if (!field) continue;
    attributes[field[1]] = parseScalar(field[2]);
  }
  return {attributes, body: normalized.slice(match[0].length)};
}

function parseScalar(value) {
  if (!value) return '';
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/gu, "'");
  }
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }
  if (value === 'true') return true;
  if (value === 'false') return false;
  return value.replace(/\s+#.*$/u, '').trim();
}

function buildCanonicalId(sourceId, slug) {
  if (typeof slug === 'string' && slug.trim()) {
    return normalizeRouteId(slug);
  }
  const segments = sourceId.split('/').map(stripNumberPrefix).filter(Boolean);
  if (segments.at(-1)?.toLowerCase() === 'index') segments.pop();
  return segments.join('/') || 'index';
}

function stripNumberPrefix(segment) {
  const stripped = segment.replace(/^\d+[-_.\s]+/u, '');
  return stripped || segment;
}

function normalizeRouteId(value) {
  const normalized = toPosixPath(String(value)).replace(/^\/+|\/+$/gu, '');
  return normalized || 'index';
}

function buildPublicUrl(baseUrl, id, slug) {
  const route = typeof slug === 'string' && slug.trim() ? normalizeRouteId(slug) : id;
  return new URL(route.split('/').map(encodeURIComponent).join('/'), baseUrl).toString();
}

function registerAliases(aliases, document, sourceId, slug) {
  const values = [document.id, sourceId, document.sourcePath, `/${document.id}`, document.url];
  if (typeof slug === 'string') values.push(slug);
  for (const value of values) {
    const key = normalizeLookupKey(value);
    if (key && !aliases.has(key)) aliases.set(key, document);
  }
}

function lookupCandidates(value, publicBaseUrl) {
  const raw = String(value || '').trim();
  const candidates = new Set([normalizeLookupKey(raw)]);
  try {
    const url = new URL(raw, publicBaseUrl);
    candidates.add(normalizeLookupKey(decodeURIComponent(url.pathname)));
  } catch {
    // Keep the raw lookup candidate when this is not a URL.
  }
  return [...candidates].filter(Boolean);
}

function normalizeLookupKey(value) {
  return toPosixPath(String(value || ''))
    .replace(/^https?:\/\/[^/]+/iu, '')
    .replace(/\.(?:md|mdx)$/iu, '')
    .replace(/^\/+|\/+$/gu, '')
    .toLocaleLowerCase('en-US');
}

function extractHeadings(markdown) {
  const headings = [];
  for (const match of markdown.matchAll(/^(#{1,6})\s+(.+?)\s*#*\s*$/gmu)) {
    headings.push({level: match[1].length, text: cleanInlineMarkdown(match[2])});
  }
  return headings;
}

function markdownToPlainText(markdown) {
  return markdown
    .replace(/^import\s.+$/gmu, ' ')
    .replace(/^export\s.+$/gmu, ' ')
    .replace(/```[^\n]*\n([\s\S]*?)```/gu, '$1')
    .replace(/~~~[^\n]*\n([\s\S]*?)~~~/gu, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, ' ')
    .replace(/^:::.+$/gmu, ' ')
    .replace(/^#{1,6}\s+/gmu, '')
    .replace(/[`*_~>|]/gu, ' ')
    .replace(/\s+/gu, ' ')
    .trim();
}

function cleanInlineMarkdown(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/[`*_~]/gu, '')
    .replace(/<[^>]+>/gu, '')
    .trim();
}

function normalizeSearchText(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLocaleLowerCase('zh-CN')
    .replace(/\s+/gu, ' ')
    .trim();
}

function tokenizeQuery(query) {
  const terms = new Set();
  for (const match of query.matchAll(/[\p{Script=Han}]+|[\p{L}\p{N}][\p{L}\p{N}_.+-]*/gu)) {
    const token = match[0];
    if (/^[\p{Script=Han}]+$/u.test(token)) {
      terms.add(token);
      if (token.length > 2) {
        for (let index = 0; index < token.length - 1; index += 1) {
          terms.add(token.slice(index, index + 2));
        }
      }
    } else if (token.length > 1 || /^\d+$/u.test(token)) {
      terms.add(token);
    }
  }
  if (terms.size === 0) terms.add(query);
  return [...terms].sort((left, right) => right.length - left.length);
}

function scoreDocument(document, query, terms) {
  const fields = document.searchable;
  let score = 0;
  const matchedTerms = [];

  if (fields.title === query) score += 180;
  else if (fields.title.includes(query)) score += 100;
  if (fields.headings.includes(query)) score += 55;
  if (fields.description.includes(query)) score += 35;
  if (fields.id.includes(query) || fields.sourcePath.includes(query)) score += 28;
  if (fields.body.includes(query)) score += 24;

  for (const term of terms) {
    let matched = false;
    const lengthBoost = Math.min(term.length, 8);
    if (fields.title.includes(term)) {
      score += 16 + lengthBoost * 2;
      matched = true;
    }
    if (fields.headings.includes(term)) {
      score += 9 + lengthBoost;
      matched = true;
    }
    if (fields.description.includes(term)) {
      score += 5 + lengthBoost / 2;
      matched = true;
    }
    if (fields.id.includes(term) || fields.sourcePath.includes(term)) {
      score += 4 + lengthBoost / 2;
      matched = true;
    }
    const occurrences = countOccurrences(fields.body, term, 5);
    if (occurrences > 0) {
      score += occurrences * (2 + lengthBoost / 3);
      matched = true;
    }
    if (matched) matchedTerms.push(term);
  }

  const section = findBestSection(document.headings, query, matchedTerms);
  return {score, matchedTerms, section};
}

function countOccurrences(text, term, cap) {
  if (!term) return 0;
  let count = 0;
  let fromIndex = 0;
  while (count < cap) {
    const index = text.indexOf(term, fromIndex);
    if (index < 0) break;
    count += 1;
    fromIndex = index + Math.max(term.length, 1);
  }
  return count;
}

function findBestSection(headings, query, terms) {
  const candidates = [query, ...terms];
  for (const candidate of candidates) {
    const heading = headings.find((item) => normalizeSearchText(item.text).includes(candidate));
    if (heading) return heading.text;
  }
  return headings[0]?.text || null;
}

function createSnippet(text, query, terms) {
  if (!text) return '';
  const normalized = normalizeSearchText(text);
  const needles = [query, ...terms].filter(Boolean);
  let matchIndex = -1;
  for (const needle of needles) {
    matchIndex = normalized.indexOf(needle);
    if (matchIndex >= 0) break;
  }
  if (matchIndex < 0) return truncate(text, MAX_SNIPPET_LENGTH);

  const start = Math.max(0, matchIndex - Math.floor(MAX_SNIPPET_LENGTH / 3));
  const end = Math.min(text.length, start + MAX_SNIPPET_LENGTH);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

function truncate(value, maxLength) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength).trim()}…`;
}

function matchesScope(document, normalizedScope) {
  return normalizeLookupKey(document.id).startsWith(normalizedScope)
    || normalizeLookupKey(document.sourcePath).startsWith(normalizedScope);
}

function titleFromId(id) {
  return id.split('/').at(-1)?.replace(/[-_]+/gu, ' ') || id;
}

function toPosixPath(value) {
  return value.replace(/\\/gu, '/');
}
