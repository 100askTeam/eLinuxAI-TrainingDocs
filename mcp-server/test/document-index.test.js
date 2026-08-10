import assert from 'node:assert/strict';
import {mkdtemp, mkdir, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {DocumentIndex, parseFrontMatter} from '../src/document-index.js';

test('parseFrontMatter extracts quoted Chinese metadata', () => {
  const parsed = parseFrontMatter("---\ntitle: '课程介绍'\ndescription: \"测试文档\"\n---\n\n# 正文\n");
  assert.equal(parsed.attributes.title, '课程介绍');
  assert.equal(parsed.attributes.description, '测试文档');
  assert.match(parsed.body, /# 正文/u);
});

test('DocumentIndex searches Chinese text and fetches canonical document IDs', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture, {recursive: true, force: true}));
  const index = createIndex(fixture);

  const status = await index.initialize();
  assert.equal(status.documentCount, 2);

  const results = await index.search('人脸检测模型部署', {limit: 5});
  assert.equal(results[0].id, 'K230/face-detection');
  assert.equal(results[0].title, '人脸检测模型部署实战');
  assert.match(results[0].snippet, /人脸检测/u);

  const document = await index.fetch('https://docs.example/K230/face-detection', {maxChars: 1000});
  assert.equal(document.title, '人脸检测模型部署实战');
  assert.match(document.content, /K230 上部署模型/u);
  assert.equal(document.truncated, false);
});

test('DocumentIndex supports prefixes, pagination, and automatic refresh', async (t) => {
  const fixture = await createFixture();
  t.after(() => rm(fixture, {recursive: true, force: true}));
  const index = createIndex(fixture);
  await index.initialize();

  const listed = await index.list({prefix: 'K230', limit: 1});
  assert.equal(listed.total, 2);
  assert.equal(listed.items.length, 1);
  assert.equal(listed.nextOffset, 1);

  const firstPage = await index.fetch('K230/face-detection', {maxChars: 1000});
  assert.equal(firstPage.offset, 0);
  assert.ok(firstPage.returnedChars > 0);

  await writeFile(path.join(fixture, '03-new-document.md'), '# 新增资料\n\n这是自动刷新后可搜索的内容。\n', 'utf8');
  const refreshed = await index.search('自动刷新', {limit: 5});
  assert.equal(refreshed[0].id, 'new-document');
});

function createIndex(docsRoot) {
  return new DocumentIndex({
    docsRoot,
    publicBaseUrl: 'https://docs.example/',
    refreshIntervalMs: 0,
  });
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'elinuxai-mcp-index-'));
  await mkdir(path.join(root, 'K230'), {recursive: true});
  await writeFile(
    path.join(root, 'K230', '01-face-detection.md'),
    [
      '---',
      "title: '人脸检测模型部署实战'",
      "description: '在 K230 上部署人脸检测模型'",
      '---',
      '',
      '# 人脸检测模型部署实战',
      '',
      '本文介绍如何在 K230 上部署模型，包括预处理、推理和后处理。',
    ].join('\n'),
    'utf8',
  );
  await writeFile(
    path.join(root, 'K230', '02-materials.md'),
    '# 资料下载\n\n课程资料和开发工具下载地址。\n',
    'utf8',
  );
  return root;
}
