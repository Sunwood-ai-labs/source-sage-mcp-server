import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import ignore from 'ignore';

/**
 * ファイルパスのスラッシュを正規化する
 */
export const normalizeSlashes = (filePath: string): string => {
  return filePath.replace(/\\/g, '/');
};

/**
 * デフォルトの.SourceSageignoreテンプレート内容を取得する
 */
export const getDefaultIgnoreTemplate = (): string => {
  return `# バージョン管理システム関連
.git
.gitignore

# キャッシュファイル
__pycache__
.pytest_cache
**/__pycache__/**
*.pyc

# ビルド・配布関連
build
dist
*.egg-info
node_modules

# 一時ファイル・出力
output
output.md
test_output
.SourceSageAssets
.SourceSageAssetsDemo

# アセット
*.png
*.svg
assets

# その他
LICENSE
example
folder
package-lock.json
.DS_Store
`;
};

/**
 * デフォルトの無視パターンを取得する
 */
export const getDefaultIgnorePatterns = (): string[] => {
  return [
    '.git',
    'node_modules',
    '__pycache__',
    '*.pyc',
    '.DS_Store',
    '.SourceSageAssets',
    'package-lock.json'
  ];
};

/**
 * .SourceSageignoreファイルを作成または取得する
 */
export const ensureIgnoreFile = (targetPath: string): string => {
  const defaultIgnorePath = path.join(targetPath, '.SourceSageignore');
  
  if (!fs.existsSync(defaultIgnorePath)) {
    fs.writeFileSync(defaultIgnorePath, getDefaultIgnoreTemplate(), 'utf-8');
    console.log(`Created default .SourceSageignore at ${defaultIgnorePath}`);
  }
  
  return defaultIgnorePath;
};

/**
 * ファイルリストを取得する
 */
export const getFileList = async (
  targetPath: string,
  ignorePath?: string
): Promise<string[]> => {
  const ig = ignore.default();
  ig.add(getDefaultIgnorePatterns());

  // ignorePath が指定されていない場合、デフォルトのパスを使用
  const effectiveIgnorePath = ignorePath || ensureIgnoreFile(targetPath);
  
  if (fs.existsSync(effectiveIgnorePath)) {
    const ignoreContent = fs.readFileSync(effectiveIgnorePath, 'utf-8');
    ig.add(ignoreContent);
  }

  const files = await glob('**/*', {
    cwd: targetPath,
    dot: true,
    nodir: false,
    absolute: false,
    windowsPathsNoEscape: true,
  });

  const normalizedFiles = files.map(normalizeSlashes);
  return normalizedFiles.filter(file => {
    const parts = file.split('/');
    return !parts.some(part => ig.ignores(part)) && !ig.ignores(file);
  });
};

/**
 * ファイルの種類に基づいた説明を取得する
 */
export const getFileTypeDescription = (extension: string): string => {
  switch (extension.toLowerCase()) {
    case '.py':
      return 'Python Source File';
    case '.md':
      return 'Markdown Documentation';
    case '.svg':
      return 'Scalable Vector Graphics';
    default:
      return '';
  }
};
