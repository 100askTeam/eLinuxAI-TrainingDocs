import {timingSafeEqual} from 'node:crypto';
import {createServer} from 'node:http';
import {
  hostHeaderValidation,
  originValidation,
  toNodeHandler,
} from '@modelcontextprotocol/node';
import {createDocsMcpHandler} from './mcp-server.js';

export function createDocsHttpServer({documentIndex, config, logger = console}) {
  const reportError = (error) => logger.error('[mcp]', error);
  const mcpHandler = createDocsMcpHandler(documentIndex, {onerror: reportError});
  const nodeMcpHandler = toNodeHandler(mcpHandler, {onerror: reportError});
  const validateHost = hostHeaderValidation(config.allowedHosts);
  const validateOrigin = originValidation(config.allowedOrigins);

  const httpServer = createServer((request, response) => {
    void handleRequest(request, response).catch((error) => {
      reportError(error);
      if (!response.headersSent) {
        writeJson(response, 500, {error: 'Internal server error'});
      } else if (!response.writableEnded) {
        response.end();
      }
    });
  });

  async function handleRequest(request, response) {
    if (!validateHost(request, response) || !validateOrigin(request, response)) return;

    const pathname = new URL(request.url || '/', 'http://localhost').pathname.replace(/\/+$/u, '') || '/';
    if (request.method === 'GET' && pathname === '/health') {
      writeJson(response, 200, {status: 'ok', ...documentIndex.status()});
      return;
    }

    if (pathname !== config.endpointPath) {
      writeJson(response, 404, {error: 'Not found', mcpEndpoint: config.endpointPath});
      return;
    }

    if (!isAuthorized(request, config.apiKey)) {
      response.setHeader('WWW-Authenticate', 'Bearer realm="eLinuxAI Docs MCP"');
      writeJson(response, 401, {
        jsonrpc: '2.0',
        error: {code: -32001, message: 'Unauthorized'},
        id: null,
      });
      return;
    }

    await nodeMcpHandler(request, response);
  }

  return {
    rawServer: httpServer,
    mcpHandler,
    async listen() {
      await new Promise((resolve, reject) => {
        const onError = (error) => {
          httpServer.off('listening', onListening);
          reject(error);
        };
        const onListening = () => {
          httpServer.off('error', onError);
          resolve();
        };
        httpServer.once('error', onError);
        httpServer.once('listening', onListening);
        httpServer.listen(config.port, config.host);
      });
      return httpServer.address();
    },
    async close() {
      await mcpHandler.close();
      if (!httpServer.listening) return;
      await new Promise((resolve, reject) => {
        httpServer.close((error) => error ? reject(error) : resolve());
      });
    },
  };
}

function isAuthorized(request, expectedKey) {
  if (!expectedKey) return true;
  const authorization = Array.isArray(request.headers.authorization)
    ? request.headers.authorization[0]
    : request.headers.authorization;
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/iu);
  const headerKey = Array.isArray(request.headers['x-api-key'])
    ? request.headers['x-api-key'][0]
    : request.headers['x-api-key'];
  const providedKey = bearerMatch?.[1] || headerKey || '';
  const expected = Buffer.from(expectedKey);
  const provided = Buffer.from(providedKey);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

function writeJson(response, statusCode, body) {
  response.writeHead(statusCode, {'content-type': 'application/json; charset=utf-8'});
  response.end(JSON.stringify(body));
}
