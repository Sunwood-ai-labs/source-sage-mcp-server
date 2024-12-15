<div align="center">
<img src="https://raw.githubusercontent.com/Sunwood-ai-labs/source-sage-mcp-server/refs/heads/master/assets/sourcesage-magical.svg" width="100%">

# 🌟 SourceSage

<p align="center">
<img alt="GitHub" src="https://img.shields.io/github/license/sunwood-ai-labs/source-sage-mcp-server">
<img alt="GitHub package.json version" src="https://img.shields.io/github/package-json/v/sunwood-ai-labs/source-sage-mcp-server">
<img alt="GitHub issues" src="https://img.shields.io/github/issues/sunwood-ai-labs/source-sage-mcp-server">
<img alt="GitHub pull requests" src="https://img.shields.io/github/issues-pr/sunwood-ai-labs/source-sage-mcp-server">
<img alt="npm" src="https://img.shields.io/npm/v/@sunwood-ai-labs/source-sage-mcp-server">
<img alt="npm" src="https://img.shields.io/npm/dt/@sunwood-ai-labs/source-sage-mcp-server">
</p>

## 📖 概要

SourceSageは、プロジェクトのディレクトリ構造を美しいマークダウン形式で可視化するMCPサーバーです。TypeScriptで実装され、高度なカスタマイズ性と柔軟な除外パターン機能を提供します。また、各ファイルの内容を自動的にドキュメント化し、プロジェクトの全体像を把握しやすくします。

</div>


## 🎯 主な特徴

- 📁 ディレクトリ構造のマークダウン形式での出力
- 🎨 美しい木構造表示（ASCII art）
- 📝 ファイル内容の自動ドキュメント化（言語別のシンタックスハイライト付き）
- 🔍 柔軟な除外パターン（.SourceSageignore）
- 🚀 ES2022とNode16モジュールシステムによる最新の実装
- 💫 厳格な型チェックによる高い信頼性

## 🛠️ 技術スタック

- 🔷 TypeScript (ES2022ターゲット)
- 📦 Model Context Protocol SDK (v0.6.0)
- 🌐 Node.js (Node16モジュールシステム)
- 📚 glob (v11.0.0) - ファイルパターンマッチング
- 🎭 ignore (v6.0.2) - 柔軟なファイル除外機能

## 📂 プロジェクト構造

```plaintext
source-sage/
├── assets/
│   └── header.svg          # プロジェクトヘッダー画像
├── src/
│   └── index.ts           # メインサーバー実装
├── build/                 # コンパイル済みJavaScriptファイル
├── .gitignore            # Gitの除外設定
├── .SourceSageignore     # SourceSage固有の除外設定
├── package.json          # プロジェクト設定・依存関係
├── package-lock.json     # 依存関係のロックファイル
├── README.md            # プロジェクトドキュメント
└── tsconfig.json        # TypeScript設定
```

## ⚙️ TypeScript設定

```json
{
  "compilerOptions": {
    "target": "ES2022",        // 最新のECMAScript機能を活用
    "module": "Node16",        // Node.js 16の最新モジュールシステムを使用
    "moduleResolution": "Node16",
    "outDir": "./build",      // コンパイル済みファイルの出力先
    "rootDir": "./src",       // ソースファイルのルートディレクトリ
    "strict": true,           // 厳格な型チェックを有効化
    "esModuleInterop": true,  // CommonJSモジュールとの相互運用性を確保
    "skipLibCheck": true,     // 型定義ファイルのチェックをスキップ
    "forceConsistentCasingInFileNames": true  // ファイル名の大文字小文字を厳格に管理
  }
}
```

## ⚙️ インストール

### npmからインストール
```bash
npm install -g @sunwood-ai-labs/source-sage-mcp-server
```

### ソースからビルド
```bash
git clone https://github.com/sunwood-ai-labs/source-sage-mcp-server.git
cd source-sage-mcp-server
npm install
npm run build
```

## 🔧 使用方法

### MCPサーバーとしての設定

1. MCPの設定ファイルに以下を追加:

```json
{
  "mcpServers": {
    "source-sage": {
      "command": "node",
      "args": ["path/to/source-sage/build/index.js"]
    }
  }
}
```

### 🎮 使用可能なツール

#### generate_structure

プロジェクトのディレクトリ構造を生成し、ファイル内容も含めた詳細なドキュメントを作成します。

```typescript
interface GenerateStructureArgs {
  // 構造を生成するディレクトリのパス（必須）
  path: string;
  // .SourceSageignoreファイルのパス（オプション）
  ignorePath?: string;
}
```

### 使用例

```typescript
// 相対パスでの使用
const result = await mcpClient.callTool('source-sage', 'generate_structure', {
  path: './your-project',
		ignorePath: './.SourceSageignore'
});

// 絶対パスでの使用（推奨）
const result = await mcpClient.callTool('source-sage', 'generate_structure', {
		path: 'c:/Users/your-name/path/to/your-project',
		ignorePath: 'c:/Users/your-name/path/to/your-project/.SourceSageignore'
});
```

### 出力サンプル

実際のプロジェクト構造の出力例：

```plaintext
# 📁 Project: source-sage

## 🌳 ディレクトリ構造

OS: win32
Directory: c:\Users\your-name\source-sage

└─ source-sage/
			├─ src/
			│  └─ index.ts          # MCPサーバーの主要な実装
			├─ package.json         # プロジェクトの依存関係と設定
			├─ README.md           # プロジェクトの詳細な説明
			└─ tsconfig.json       # TypeScriptのコンパイル設定
```

この出力には以下の情報が含まれます：

- 📁 プロジェクト名とOS情報
- 🌳 ディレクトリツリー構造
- 📝 各ファイルの役割と説明
- 🔍 .SourceSageignoreによる不要ファイルの除外

## 📝 .SourceSageignoreの設定

プロジェクトのルートに`.SourceSageignore`ファイルを作成し、除外したいパターンを記述します。デフォルトで以下のような除外パターンが含まれています：

```plaintext
# バージョン管理システム関連
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
```

## 🔄 出力例

```plaintext
  # 📁 Project: my-project

  ## 🌳 ディレクトリ構造

  OS: linux
  Directory: /path/to/my-project

  └─ my-project/
    ├─ src/
    │  ├─ index.ts
    │  └─ utils/
    │     └─ helper.ts
    └─ package.json

  ## 📄 ファイル内容

  ### 📝 `src/index.ts`
  **Type**: TypeScript Source File

```


## 👨‍💻 開発者向け情報

### 主要な実装詳細

- **Server Class**: `SourceSageServer`クラスがMCPサーバーの中核機能を提供
- **Tree Building**: 
  - `buildTree`メソッドが再帰的にディレクトリ構造を解析
  - ディレクトリとファイルを適切にソートして表示
- **File Filtering**: 
  - `ignore`パッケージを使用して柔軟なファイル除外を実現
  - 豊富なデフォルト除外パターンとカスタム設定をサポート
- **Content Generation**:
  - ファイルタイプに応じた適切なシンタックスハイライト
  - ファイルの種類に基づく追加情報の提供
- **Async Processing**: 
  - `glob`パッケージを使用した効率的なファイル走査
  - 非同期処理による大規模プロジェクトのサポート

### 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/sunwood-ai-labs/source-sage-mcp-server.git

# 依存関係のインストール
npm install

# 開発用ビルド
npm run build

# 開発サーバーの起動
npm run inspector
```

### 利用可能なnpmスクリプト

- `npm run build`: TypeScriptのコンパイルと実行権限の設定
- `npm run prepare`: インストール時の自動ビルド
- `npm run watch`: 開発時の自動コンパイル
- `npm run inspector`: MCPインスペクターの起動

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. 新しいブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m '✨ feat: 素晴らしい機能を追加'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) ファイルを参照してください。

## 🔗 関連リンク

- [npm package](https://www.npmjs.com/package/@sunwood-ai-labs/source-sage-mcp-server)
- [GitHub repository](https://github.com/sunwood-ai-labs/source-sage-mcp-server)
- [バグ報告](https://github.com/sunwood-ai-labs/source-sage-mcp-server/issues)

## 👥 メンテナー

- Sunwood AI Labs Team

---

<p align="center">Made with ❤️ by Sunwood AI Labs</p>
