import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { isGenerateStructureArgs } from '../utils/validation.js';
import { StructureGenerator } from '../services/structure-generator.js';

export class ToolHandlers {
  private structureGenerator: StructureGenerator;

  constructor(private server: Server) {
    this.structureGenerator = new StructureGenerator();
    this.setupHandlers();
  }

  /**
   * ツールハンドラーを設定する
   */
  private setupHandlers(): void {
    this.setupListToolsHandler();
    this.setupCallToolHandler();
  }

  /**
   * 利用可能なツール一覧を返すハンドラーを設定
   */
  private setupListToolsHandler(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_structure',
          description: 'プロジェクトのディレクトリ構造を生成し、ファイル内容も含めた詳細なドキュメントを作成します。プロジェクトやリポジトリ、フォルダの内容を理解するときに使用します。',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '構造を生成するディレクトリの絶対パス',
              },
              ignorePath: {
                type: 'string',
                description: '.SourceSageignoreファイルの絶対パス（オプション）',
              },
            },
            required: ['path'],
          },
        },
      ],
    }));
  }

  /**
   * ツール実行ハンドラーを設定
   */
  private setupCallToolHandler(): void {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name !== 'generate_structure') {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      if (!isGenerateStructureArgs(request.params.arguments)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          'Invalid arguments for generate_structure'
        );
      }

      const structure = await this.structureGenerator.generateStructure(request.params.arguments);

      return {
        content: [
          {
            type: 'text',
            text: structure,
          },
        ],
      };
    });
  }
}
