import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ToolHandlers } from './tool-handlers.js';

export class SourceSageServer {
  private server: Server;
  private toolHandlers: ToolHandlers;

  constructor() {
    this.server = new Server(
      {
        name: 'source-sage',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.toolHandlers = new ToolHandlers(this.server);
    
    this.setupErrorHandling();
  }

  /**
   * エラーハンドリングを設定
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * サーバーを起動
   */
  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SourceSage MCP server running on stdio');
  }
}
