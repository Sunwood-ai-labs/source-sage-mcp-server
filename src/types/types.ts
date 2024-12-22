/**
 * ディレクトリ構造生成のための引数インターフェース
 */
export interface GenerateStructureArgs {
  path: string;
  ignorePath?: string;
}

/**
 * ディレクトリツリーのノードを表すインターフェース
 */
export interface TreeNode {
  name: string;
  isDirectory: boolean;
  children: TreeNode[];
}

/**
 * ファイル統計情報を表すインターフェース
 */
export interface FileStats {
  path: string;
  lineCount: number;
}
