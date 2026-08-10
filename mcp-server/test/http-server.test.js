import assert from 'node:assert/strict';
import {mkdtemp, rm, writeFile} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {Client, StreamableHTTPClientTransport} from '@modelcontextprotocol/client';
import {DocumentIndex} from '../src/document-index.js';
import {createDocsHttpServer} from '../src/http-server.js';

test('serves health checks and the current MCP Streamable HTTP protocol', async (t) => {
  const fixture = await createFixture();
  const running = await startFixtureServer(fixture);
  t.after(async () => {
    await running.service.close();
    await rm(fixture, {recursive: true, force: true});
  });

  const health = await fetch(`${running.origin}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), {
    status: 'ok',
    documentCount: 1,
    indexedAt: running.index.status().indexedAt,
    refreshIntervalMs: 30000,
  });

  const client = new Client({name: 'integration-test', version: '1.0.0'});
  const transport = new StreamableHTTPClientTransport(new URL(`${running.origin}/mcp`));
  t.after(() => client.close());
  await client.connect(transport);

  const tools = await client.listTools();
  assert.deepEqual(
    tools.tools.map((tool) => tool.name).sort(),
    ['docs_fetch', 'docs_index_status', 'docs_list', 'docs_search'],
  );

  const result = await client.callTool({name: 'docs_search', arguments: {query: 'K230'}});
  assert.match(result.content[0].text, /K230 入门/u);
});

test('accepts Docs-AIAgent compatible stateless tools/call requests', async (t) => {
  const fixture = await createFixture();
  const running = await startFixtureServer(fixture);
  t.after(async () => {
    await running.service.close();
    await rm(fixture, {recursive: true, force: true});
  });

  const response = await fetch(`${running.origin}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {name: 'docs_search', arguments: {query: '开发环境'}},
    }),
  });

  assert.equal(response.status, 200);
  const payload = parseJsonOrSse(await response.text());
  assert.equal(payload.id, 1);
  assert.match(payload.result.content[0].text, /开发环境/u);
});

test('enforces the optional API key', async (t) => {
  const fixture = await createFixture();
  const running = await startFixtureServer(fixture, 'secret-key');
  t.after(async () => {
    await running.service.close();
    await rm(fixture, {recursive: true, force: true});
  });

  const unauthorized = await fetch(`${running.origin}/mcp`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'tools/list'}),
  });
  assert.equal(unauthorized.status, 401);

  const authorized = await fetch(`${running.origin}/mcp`, {
    method: 'POST',
    headers: {
      accept: 'application/json, text/event-stream',
      authorization: 'Bearer secret-key',
      'content-type': 'application/json',
    },
    body: JSON.stringify({jsonrpc: '2.0', id: 2, method: 'tools/list'}),
  });
  assert.equal(authorized.status, 200);
  const payload = parseJsonOrSse(await authorized.text());
  assert.equal(payload.id, 2);
  assert.equal(payload.result.tools.length, 4);
});

async function startFixtureServer(docsRoot, apiKey = '') {
  const config = {
    host: '127.0.0.1',
    port: 0,
    endpointPath: '/mcp',
    docsRoot,
    publicBaseUrl: 'https://docs.example/',
    refreshIntervalMs: 30000,
    apiKey,
    allowedHosts: ['localhost', '127.0.0.1', '[::1]'],
    allowedOrigins: ['localhost', '127.0.0.1', '[::1]'],
  };
  const index = new DocumentIndex(config);
  await index.initialize();
  const silentLogger = {error() {}};
  const service = createDocsHttpServer({documentIndex: index, config, logger: silentLogger});
  const address = await service.listen();
  return {service, index, origin: `http://127.0.0.1:${address.port}`};
}

async function createFixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'elinuxai-mcp-http-'));
  await writeFile(
    path.join(root, '01-k230-start.md'),
    "---\ntitle: 'K230 入门'\n---\n\n# 开发环境\n\n配置 Ubuntu 开发环境。\n",
    'utf8',
  );
  return root;
}

function parseJsonOrSse(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed);
  const data = trimmed.split(/\r?\n/u).find((line) => line.startsWith('data:'));
  if (!data) throw new Error(`Unexpected MCP response: ${trimmed}`);
  return JSON.parse(data.slice(5).trim());
}
