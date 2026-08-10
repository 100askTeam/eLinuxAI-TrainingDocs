import {McpServer, createMcpHandler} from '@modelcontextprotocol/server';
import {z} from 'zod/v4';

const readOnlyAnnotations = Object.freeze({
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
});

export function createDocsMcpServer(documentIndex) {
  const server = new McpServer(
    {name: 'elinuxai-docs', version: '1.0.0'},
    {
      instructions: [
        '这是 eLinuxAI 技术文档的只读检索服务。',
        '先调用 docs_search 查找相关文档，再使用返回的 id 调用 docs_fetch 获取原文。',
        '回答技术问题时应以获取到的文档内容和 URL 为依据。',
      ].join(' '),
    },
  );

  server.registerTool(
    'docs_search',
    {
      title: '搜索 eLinuxAI 文档',
      description: '按中文或英文关键词搜索文档，返回相关文档 ID、标题、原文链接和片段。',
      inputSchema: z.object({
        query: z.string().trim().min(1).max(200).describe('要搜索的问题或关键词'),
        limit: z.number().int().min(1).max(20).default(8).describe('最多返回多少条结果'),
        scope: z.string().trim().max(200).optional().describe('可选的文档 ID 前缀，例如 K230FullStackManual'),
      }),
      annotations: readOnlyAnnotations,
    },
    async ({query, limit, scope}) => {
      const results = await documentIndex.search(query, {limit, scope});
      const output = {query, count: results.length, results};
      return {
        content: [{type: 'text', text: JSON.stringify(output, null, 2)}],
        structuredContent: output,
      };
    },
  );

  server.registerTool(
    'docs_fetch',
    {
      title: '读取 eLinuxAI 文档',
      description: '根据 docs_search 返回的文档 ID 读取 Markdown 原文；长文档可通过 offset 分页。',
      inputSchema: z.object({
        id: z.string().trim().min(1).max(500).describe('文档 ID、相对路径或线上文档 URL'),
        offset: z.number().int().min(0).default(0).describe('从第几个字符开始读取'),
        max_chars: z.number().int().min(1000).max(500000).default(120000).describe('本次最多读取的字符数'),
      }),
      annotations: readOnlyAnnotations,
    },
    async ({id, offset, max_chars: maxChars}) => {
      const document = await documentIndex.fetch(id, {offset, maxChars});
      if (!document) {
        return {
          content: [{type: 'text', text: `未找到文档：${id}。请先调用 docs_search 或 docs_list 获取有效的文档 ID。`}],
          isError: true,
        };
      }

      const pagination = document.truncated
        ? `\n\n> 本次返回字符 ${document.offset}-${document.offset + document.returnedChars - 1}，全文共 ${document.totalChars} 字符；继续读取时设置 offset=${document.nextOffset}。`
        : '';
      const text = [
        `# ${document.title}`,
        '',
        `- 文档 ID：${document.id}`,
        `- 原文链接：${document.url}`,
        `- 仓库路径：docs/${document.sourcePath}`,
        '',
        '---',
        '',
        document.content,
        pagination,
      ].join('\n');
      return {content: [{type: 'text', text}]};
    },
  );

  server.registerTool(
    'docs_list',
    {
      title: '列出 eLinuxAI 文档',
      description: '分页列出可读取的文档，可使用文档 ID 前缀限制目录范围。',
      inputSchema: z.object({
        prefix: z.string().trim().max(200).optional().describe('可选的文档 ID 前缀'),
        offset: z.number().int().min(0).default(0),
        limit: z.number().int().min(1).max(100).default(50),
      }),
      annotations: readOnlyAnnotations,
    },
    async ({prefix, offset, limit}) => {
      const output = await documentIndex.list({prefix, offset, limit});
      return {
        content: [{type: 'text', text: JSON.stringify(output, null, 2)}],
        structuredContent: output,
      };
    },
  );

  server.registerTool(
    'docs_index_status',
    {
      title: '查看文档索引状态',
      description: '查看当前已索引的文档数量和最近索引时间。',
      annotations: readOnlyAnnotations,
    },
    async () => {
      await documentIndex.refresh();
      const output = documentIndex.status();
      return {
        content: [{type: 'text', text: JSON.stringify(output, null, 2)}],
        structuredContent: output,
      };
    },
  );

  return server;
}

export function createDocsMcpHandler(documentIndex, {onerror} = {}) {
  return createMcpHandler(
    () => createDocsMcpServer(documentIndex),
    {
      legacy: 'stateless',
      responseMode: 'auto',
      onerror,
    },
  );
}
