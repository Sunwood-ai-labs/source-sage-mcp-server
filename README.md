<p align="center">
<img src="assets/header.svg" width="100%">
</p>

# 🌟 SourceSage

## 📖 概要

SourceSageは、プロジェクトのディレクトリ構造を美しいマークダウン形式で可視化するMCPサーバーです。TypeScriptで実装され、高度なカスタマイズ性と柔軟な除外パターン機能を提供します。また、各ファイルの内容を自動的にドキュメント化し、プロジェクトの全体像を把握しやすくします。

## 🎯 主な特徴

- 📁 ディレクトリ構造のマークダウン形式での出力
- 🎨 美しい木構造表示（ASCII art）
- 📝 ファイル内容の自動ドキュメント化（言語別のシンタックスハイライト付き）
- 🔍 スマートな除外パターン（.SourceSageignore）
- 🚀 非同期処理による高速な構造解析
- 💫 OS情報を含む詳細な出力フォーマット

## 🛠️ 技術スタック

- 🔷 TypeScript
- 📦 Model Context Protocol SDK (v0.6.0)
- 🌐 Node.js
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
├── package.json          # プロジェクト設定・依存関係
├── package-lock.json     # 依存関係のロックファイル
├── README.md            # プロジェクトドキュメント
└── tsconfig.json        # TypeScript設定
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
const result = await mcpClient.callTool('source-sage', 'generate_structure', {
  path: '/path/to/your/project',
  ignorePath: '/path/to/.SourceSageignore'
});
```

## 📝 .SourceSageignoreの設定

プロジェクトのルートに`.SourceSageignore`ファイルを作成し、除外したいパターンを記述します：

```plaintext
# デフォルトで除外されるパターン
.git/
node_modules/
__pycache__/
*.pyc
.DS_Store
.SourceSageAssets

# カスタム除外パターン
dist/
coverage/
*.log
*.tmp
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

```typescript
// ファイル内容がここに表示されます
```
```

## 👨‍💻 開発者向け情報

### 主要な実装詳細

- **Server Class**: `SourceSageServer`クラスがMCPサーバーの中核機能を提供
- **Tree Building**: 
  - `buildTree`メソッドが再帰的にディレクトリ構造を解析
  - ディレクトリとファイルを適切にソートして表示
- **File Filtering**: 
  - `ignore`パッケージを使用して柔軟なファイル除外を実現
  - デフォルトとカスタムの除外パターンをサポート
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
