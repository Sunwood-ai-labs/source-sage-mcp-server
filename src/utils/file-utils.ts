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
    'package-lock.json'  // package-lock.jsonを追加
  ];
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

  if (ignorePath) {
    const resolvedIgnorePath = path.resolve(ignorePath);
    if (fs.existsSync(resolvedIgnorePath)) {
      const ignoreContent = fs.readFileSync(resolvedIgnorePath, 'utf-8');
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
