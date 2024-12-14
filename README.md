<p align="center">
<img src="assets/header.svg" width="100%">
</p>

# 🌟 SourceSage

## 📖 概要

SourceSageは、プロジェクトのディレクトリ構造を美しいマークダウン形式で可視化するMCPサーバーです。.SourceSageignoreファイルを使用して、特定のファイルやディレクトリを除外することができます。

## 🚀 インストール

```bash
npm install @sunwood-ai-labs/source-sage-mcp-server
```

## 🛠️ 機能

- 📁 ディレクトリ構造のマークダウン形式での出力
- 🎯 .SourceSageignoreによるファイル/ディレクトリの除外
- 🎨 カスタマイズ可能な出力フォーマット
- 💫 ワイルドカードパターンのサポート

## 🔧 使用方法

### MCPサーバーとしての使用

1. MCPの設定ファイルに以下を追加:

```json
{
  "mcpServers": {
    "source-sage": {
      "command": "source-sage",
      "args": []
    }
  }
}
```

### 🎮 使用可能なツール

#### generate_structure
プロジェクトのディレクトリ構造を生成します。

```typescript
{
  "type": "object",
  "properties": {
    "path": {
      "type": "string",
      "description": "構造を生成するディレクトリのパス"
    },
    "ignorePath": {
      "type": "string",
      "description": ".SourceSageignoreファイルのパス（オプション）"
    }
  },
  "required": ["path"]
}
```

## 📝 .SourceSageignoreの例

```plaintext
# コメント
node_modules/
*.log
dist/
.git/
```

## 🚀 開発者向け情報

### 環境構築

```bash
npm install
npm run build
```

### 開発用サーバーの起動

```bash
npm run inspector
```

## 📄 ライセンス

MIT License

## 👥 コントリビューション

プルリクエストや課題の報告は大歓迎です！

## 🔗 関連リンク

- [npm package](https://www.npmjs.com/package/@sunwood-ai-labs/source-sage-mcp-server)
- [GitHub repository](https://github.com/sunwood-ai-labs/source-sage-mcp-server)
