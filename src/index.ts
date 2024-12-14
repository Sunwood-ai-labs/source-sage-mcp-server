#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import ignore from 'ignore';

interface GenerateStructureArgs {
  path: string;
  ignorePath?: string;
}

interface TreeNode {
  name: string;
  isDirectory: boolean;
  children: TreeNode[];
}

const isGenerateStructureArgs = (args: unknown): args is GenerateStructureArgs => {
  if (typeof args !== 'object' || args === null) return false;
  const obj = args as Record<string, unknown>;
  return typeof obj.path === 'string' && 
         (obj.ignorePath === undefined || typeof obj.ignorePath === 'string');
};

const normalizeSlashes = (filePath: string): string => {
  return filePath.replace(/\\/g, '/');
};

class SourceSageServer {
  private server: Server;

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

    this.setupToolHandlers();
    
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private buildTree(basePath: string, files: string[]): TreeNode {
    const root: TreeNode = {
      name: path.basename(basePath),
      isDirectory: true,
      children: [],
    };

    const nodes: { [key: string]: TreeNode } = { '': root };

    files.sort((a, b) => {
      const aIsDir = fs.statSync(path.join(basePath, a)).isDirectory();
      const bIsDir = fs.statSync(path.join(basePath, b)).isDirectory();
      if (aIsDir && !bIsDir) return -1;
      if (!aIsDir && bIsDir) return 1;
      return a.localeCompare(b);
    }).forEach(file => {
      const normalizedFile = normalizeSlashes(file);
      const parts = normalizedFile.split('/');
      let parentPath = '';

      parts.forEach((part, index) => {
        const currentPath = index === 0 ? part : path.join(parentPath, part).replace(/\\/g, '/');
        if (!nodes[currentPath]) {
          const isDirectory = fs.statSync(path.join(basePath, currentPath)).isDirectory();
          const node: TreeNode = {
            name: part,
            isDirectory,
            children: [],
          };
          nodes[currentPath] = node;
          nodes[parentPath].children.push(node);
        }
        parentPath = currentPath;
      });
    });

    return root;
  }

  private printTree(node: TreeNode, prefix: string = '', isLast: boolean = true): string[] {
    const output: string[] = [];
    const marker = isLast ? '└─' : '├─';
    const newPrefix = prefix + (isLast ? '   ' : '│  ');

    output.push(`${prefix}${marker} ${node.name}${node.isDirectory ? '/' : ''}`);

    node.children.forEach((child, index) => {
      output.push(...this.printTree(
        child,
        newPrefix,
        index === node.children.length - 1
      ));
    });

    return output;
  }

  private async generateFileContents(targetPath: string, files: string[]): Promise<string[]> {
    const output: string[] = [];
    output.push('\n## 📄 ファイル内容\n');

    for (const file of files) {
      if (!fs.statSync(path.join(targetPath, file)).isDirectory()) {
        const relativePath = normalizeSlashes(file);
        const content = fs.readFileSync(path.join(targetPath, file), 'utf-8');
        const extension = path.extname(file).toLowerCase();
        
        output.push(`### 📝 \`${relativePath}\`\n`);
        
        // ファイルの種類に応じた説明を追加
        if (extension === '.py') {
          output.push('**Type**: Python Source File\n');
        } else if (extension === '.md') {
          output.push('**Type**: Markdown Documentation\n');
        } else if (extension === '.svg') {
          output.push('**Type**: Scalable Vector Graphics\n');
        }

        // ファイルの内容をコードブロックで表示
        output.push('```' + extension.slice(1));
        output.push(content);
        output.push('```\n');
      }
    }

    return output;
  }

  private async generateStructure(args: GenerateStructureArgs): Promise<string> {
    const targetPath = path.resolve(args.path);
    if (!fs.existsSync(targetPath)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Directory not found: ${targetPath}`
      );
    }

    const ig = ignore.default();
    // デフォルトの除外パターンを追加
    ig.add([
      '.git',
      'node_modules',
      '__pycache__',
      '*.pyc',
      '.DS_Store',
      '.SourceSageAssets'
    ]);

    if (args.ignorePath) {
      const ignorePath = path.resolve(args.ignorePath);
      if (fs.existsSync(ignorePath)) {
        const ignoreContent = fs.readFileSync(ignorePath, 'utf-8');
        ig.add(ignoreContent);
      }
    }

    const files = await glob('**/*', {
      cwd: targetPath,
      dot: true,
      nodir: false,
      absolute: false,
      windowsPathsNoEscape: true,
    });

    const normalizedFiles = files.map(normalizeSlashes);
    const filteredFiles = normalizedFiles.filter(file => {
      const parts = file.split('/');
      return !parts.some(part => ig.ignores(part)) && !ig.ignores(file);
    });

    const tree = this.buildTree(targetPath, filteredFiles);

    const output = [
      `# 📁 Project: ${path.basename(targetPath)}`,
      '',
      '## 🌳 ディレクトリ構造',
      '',
      '```plaintext',
      `OS: ${process.platform}`,
      `Directory: ${targetPath}`,
      '',
      ...this.printTree(tree),
      '```',
    ];

    // ファイル内容を追加
    output.push(...await this.generateFileContents(targetPath, filteredFiles));

    const content = output.join('\n');

    // .SourceSageAssetsフォルダを作成して保存
    const assetsDir = path.join(targetPath, '.SourceSageAssets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(assetsDir, 'Repository_summary.md'), content, 'utf-8');

    return content;
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'generate_structure',
          description: 'プロジェクトのディレクトリ構造を生成します',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: '構造を生成するディレクトリのパス',
              },
              ignorePath: {
                type: 'string',
                description: '.SourceSageignoreファイルのパス（オプション）',
              },
            },
            required: ['path'],
          },
        },
      ],
    }));

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

      const structure = await this.generateStructure(request.params.arguments);

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

  public async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SourceSage MCP server running on stdio');
  }
}

const server = new SourceSageServer();
server.run().catch(console.error);
