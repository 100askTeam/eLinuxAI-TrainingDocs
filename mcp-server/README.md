# eLinuxAI 文档 MCP 服务

这是当前文档仓库的独立、只读 MCP 服务。它扫描 `docs/**/*.md` 和 `docs/**/*.mdx`，让支持 MCP 的 AI 客户端搜索并读取文档，不会改变 Docusaurus 页面或构建流程。

服务使用官方 TypeScript/JavaScript SDK 的 Streamable HTTP 协议，同时保留 2025 版无状态请求兼容性，可直接供 `Docs-AIAgent` 当前的 `docs_search` / `docs_fetch` 调用方式使用。

## 已提供的工具

| 工具 | 用途 |
| --- | --- |
| `docs_search` | 搜索中文或英文关键词，返回文档 ID、原文链接和相关片段 |
| `docs_fetch` | 按 ID、相对路径或线上 URL 读取 Markdown 原文，支持长文档分页 |
| `docs_list` | 按目录前缀分页列出文档 |
| `docs_index_status` | 查看文档数量和最近索引时间 |

所有工具都被声明为只读、非破坏性操作。

## 本地启动

要求 Node.js 20 或更高版本。首次使用先安装服务自己的依赖：

```powershell
npm --prefix mcp-server install
npm run mcp:start
```

默认地址：

- MCP：`http://127.0.0.1:3100/mcp`
- 健康检查：`http://127.0.0.1:3100/health`

服务启动时建立索引，之后默认每 30 秒检查并重新读取文档，因此普通文档更新不需要改 MCP 代码。

## 配置

复制 `mcp-server/.env.example` 为 `mcp-server/.env` 后修改。主要配置如下：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `MCP_HOST` | `127.0.0.1` | 监听地址；服务器或容器部署通常使用 `0.0.0.0` |
| `MCP_PORT` | `3100` | 监听端口 |
| `MCP_PATH` | `/mcp` | MCP URL 路径 |
| `MCP_ALLOWED_HOSTS` | 本机域名 | 允许的 Host 域名；监听全部网卡时必填，不包含端口 |
| `MCP_ALLOWED_ORIGINS` | 与允许的 Host 相同 | 可选的浏览器 Origin 域名白名单 |
| `MCP_API_KEY` | 空 | 可选访问密钥；设置后要求 Bearer Token 或 `X-API-Key` |
| `MCP_DOCS_ROOT` | 仓库的 `docs` | 被索引的文档目录 |
| `DOCS_PUBLIC_BASE_URL` | `https://eai.100ask.net` | 搜索结果中的线上原文地址 |
| `MCP_INDEX_REFRESH_MS` | `30000` | 自动刷新间隔，单位毫秒；`0` 表示每次调用都刷新 |

公网配置示例：

```dotenv
MCP_HOST=0.0.0.0
MCP_PORT=3100
MCP_ALLOWED_HOSTS=mcp.example.com
MCP_API_KEY=请替换为足够长的随机密钥
DOCS_PUBLIC_BASE_URL=https://eai.100ask.net
```

客户端连接信息为：

```text
Transport: Streamable HTTP
URL: https://mcp.example.com/mcp
Authorization: Bearer <MCP_API_KEY>
```

如果使用 Nginx、Caddy 或云平台反向代理，应允许 `POST`，保留 `Authorization` 请求头，并关闭该路径的响应缓冲，以兼容 SSE 响应。

## 接入 Docs-AIAgent

未设置 `MCP_API_KEY` 时，只需让 `Docs-AIAgent` 使用本服务地址：

```dotenv
DOCS_MCP_URL=http://127.0.0.1:3100/mcp
```

`Docs-AIAgent` 当前不会发送 MCP 鉴权头。如果公网服务启用了 `MCP_API_KEY`，需要在它的 MCP 请求代码中补充 Bearer Token，或由受信任的网关完成鉴权。

## 直接验证

健康检查：

```powershell
Invoke-RestMethod http://127.0.0.1:3100/health
```

兼容调用 `docs_search`：

```powershell
$body = @{
  jsonrpc = '2.0'
  id = 1
  method = 'tools/call'
  params = @{
    name = 'docs_search'
    arguments = @{query = 'K230 人脸检测'}
  }
} | ConvertTo-Json -Depth 5

Invoke-RestMethod `
  -Uri http://127.0.0.1:3100/mcp `
  -Method Post `
  -ContentType 'application/json' `
  -Headers @{Accept = 'application/json, text/event-stream'} `
  -Body $body
```

## 测试

```powershell
npm run mcp:test
```

测试覆盖中文检索、文档 ID、分页、自动刷新、官方 MCP 客户端连接、`Docs-AIAgent` 兼容调用和 API Key 鉴权。
