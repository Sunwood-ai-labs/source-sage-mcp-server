import * as fs from 'fs';
import * as path from 'path';
import { TreeNode } from '../types/types.js';
import { normalizeSlashes } from '../utils/file-utils.js';

export class TreeBuilder {
  /**
   * ファイルリストからツリー構造を構築する
   */
  public buildTree(basePath: string, files: string[]): TreeNode {
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

  /**
   * ツリー構造を文字列として出力する
   */
  public printTree(node: TreeNode, prefix: string = '', isLast: boolean = true): string[] {
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
}
