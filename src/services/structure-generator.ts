import * as fs from 'fs';
import * as path from 'path';
import { McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { GenerateStructureArgs } from '../types/types.js';
import { getFileList, getFileTypeDescription } from '../utils/file-utils.js';
import { TreeBuilder } from './tree-builder.js';

export class StructureGenerator {
  private treeBuilder: TreeBuilder;

  constructor() {
    this.treeBuilder = new TreeBuilder();
  }

  /**
   * ファイルの内容を生成する
   */
  private async generateFileContents(targetPath: string, files: string[]): Promise<string[]> {
    const output: string[] = [];
    output.push('\n## 📄 ファイル内容\n');

    for (const file of files) {
      if (!fs.statSync(path.join(targetPath, file)).isDirectory()) {
        const content = fs.readFileSync(path.join(targetPath, file), 'utf-8');
        const extension = path.extname(file).toLowerCase();
        const fileTypeDesc = getFileTypeDescription(extension);
        
        output.push(`### 📝 \`${file}\`\n`);
        
        if (fileTypeDesc) {
          output.push(`**Type**: ${fileTypeDesc}\n`);
        }

        output.push('```' + extension.slice(1));
        output.push(content);
        output.push('```\n');
      }
    }

    return output;
  }

  /**
   * プロジェクト構造を生成する
   */
  public async generateStructure(args: GenerateStructureArgs): Promise<string> {
    const targetPath = path.resolve(args.path);
    if (!fs.existsSync(targetPath)) {
      throw new McpError(
        ErrorCode.InvalidParams,
        `Directory not found: ${targetPath}`
      );
    }

    const files = await getFileList(targetPath, args.ignorePath);
    const tree = this.treeBuilder.buildTree(targetPath, files);

    const output = [
      `# 📁 Project: ${path.basename(targetPath)}`,
      '',
      '## 🌳 ディレクトリ構造',
      '',
      '```plaintext',
      `OS: ${process.platform}`,
      `Directory: ${targetPath}`,
      `Ignore File: ${args.ignorePath || '.SourceSageignore (auto-generated)'}`,
      '',
      ...this.treeBuilder.printTree(tree),
      '```',
    ];

    // ファイル内容を追加
    output.push(...await this.generateFileContents(targetPath, files));

    const content = output.join('\n');

    // .SourceSageAssetsフォルダを作成して保存
    const assetsDir = path.join(targetPath, '.SourceSageAssets');
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }
    fs.writeFileSync(path.join(assetsDir, 'Repository_summary.md'), content, 'utf-8');

    return content;
  }
}
