import path from 'node:path';
import {fileURLToPath} from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(serverRoot, '..');

export const paths = Object.freeze({serverRoot, repositoryRoot});

export function loadConfig(env = process.env) {
  const host = (env.MCP_HOST || '127.0.0.1').trim();
  const configuredHosts = splitList(env.MCP_ALLOWED_HOSTS);
  const isWildcardHost = host === '0.0.0.0' || host === '::' || host === '[::]';

  if (isWildcardHost && configuredHosts.length === 0) {
    throw new Error('MCP_ALLOWED_HOSTS is required when MCP_HOST listens on all interfaces.');
  }

  const localHosts = ['localhost', '127.0.0.1', '[::1]'];
  const allowedHosts = configuredHosts.length > 0
    ? configuredHosts
    : (localHosts.includes(host) ? localHosts : [host]);

  return {
    host,
    port: parseInteger(env.MCP_PORT, 3100, {name: 'MCP_PORT', min: 0, max: 65535}),
    endpointPath: normalizeEndpointPath(env.MCP_PATH || '/mcp'),
    docsRoot: path.resolve(env.MCP_DOCS_ROOT || path.join(repositoryRoot, 'docs')),
    publicBaseUrl: normalizeBaseUrl(env.DOCS_PUBLIC_BASE_URL || 'https://eai.100ask.net'),
    refreshIntervalMs: parseInteger(env.MCP_INDEX_REFRESH_MS, 30000, {
      name: 'MCP_INDEX_REFRESH_MS',
      min: 0,
      max: 86400000,
    }),
    apiKey: env.MCP_API_KEY || '',
    allowedHosts,
    allowedOrigins: splitList(env.MCP_ALLOWED_ORIGINS).length > 0
      ? splitList(env.MCP_ALLOWED_ORIGINS)
      : allowedHosts,
  };
}

function splitList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseInteger(value, fallback, {name, min, max}) {
  if (value === undefined || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < min || parsed > max) {
    throw new Error(`${name} must be an integer between ${min} and ${max}.`);
  }
  return parsed;
}

function normalizeEndpointPath(value) {
  const endpointPath = String(value).trim();
  if (!endpointPath.startsWith('/') || endpointPath.includes('?') || endpointPath.includes('#')) {
    throw new Error('MCP_PATH must be an absolute URL path such as /mcp.');
  }
  return endpointPath.length > 1 ? endpointPath.replace(/\/+$/u, '') : endpointPath;
}

function normalizeBaseUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error('DOCS_PUBLIC_BASE_URL must use http or https.');
  }
  url.hash = '';
  url.search = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';
  return url.toString();
}
