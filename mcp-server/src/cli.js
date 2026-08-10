import process from 'node:process';
import dotenv from 'dotenv';
import {paths, loadConfig} from './config.js';
import {DocumentIndex} from './document-index.js';
import {createDocsHttpServer} from './http-server.js';

dotenv.config({path: `${paths.serverRoot}/.env`, quiet: true});

async function main() {
  const config = loadConfig();
  const documentIndex = new DocumentIndex(config);
  const status = await documentIndex.initialize();
  const service = createDocsHttpServer({documentIndex, config});
  const address = await service.listen();
  const actualPort = typeof address === 'object' && address ? address.port : config.port;

  console.log(`[mcp] 已索引 ${status.documentCount} 篇文档`);
  console.log(`[mcp] 服务地址：http://${displayHost(config.host)}:${actualPort}${config.endpointPath}`);
  console.log(`[mcp] 健康检查：http://${displayHost(config.host)}:${actualPort}/health`);
  if (!config.apiKey) {
    console.warn('[mcp] MCP_API_KEY 未设置；公网部署前请设置访问密钥。');
  }

  let shuttingDown = false;
  const shutdown = async (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`[mcp] 收到 ${signal}，正在停止服务…`);
    await service.close();
  };

  process.once('SIGINT', () => void shutdown('SIGINT'));
  process.once('SIGTERM', () => void shutdown('SIGTERM'));
}

function displayHost(host) {
  if (host === '0.0.0.0' || host === '::' || host === '[::]') return 'localhost';
  return host.includes(':') && !host.startsWith('[') ? `[${host}]` : host;
}

main().catch((error) => {
  console.error('[mcp] 启动失败：', error);
  process.exitCode = 1;
});
