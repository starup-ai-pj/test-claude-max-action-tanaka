# 旅行費用精算アプリケーション

友人との旅行で発生した費用を簡単に精算できるWebアプリケーションです。

## 機能

### 必要要件（国内旅行）
- ✅ 参加者の追加・削除
- ✅ 支払い費用の記録（支払者、金額、割り勘対象者）
- ✅ 精算計算（誰が誰にいくら払うか）

### 追加要件（海外旅行）
- ✅ 複数通貨対応
- ✅ ExchangeRate-API による為替レート自動取得

## 技術スタック

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Container**: Docker

## セットアップ

### 開発環境での起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### Dockerでの起動

```bash
# Dockerイメージのビルド
docker build -t travel-expense-app .

# コンテナの起動
docker run -p 3000:3000 travel-expense-app
```

## 使い方

1. **参加者の追加**: 「参加者」セクションで旅行メンバーを追加
2. **支払い記録**: 「支払い記録」セクションで、誰が何にいくら払ったかを記録
3. **精算確認**: 「精算」セクションで、誰が誰にいくら払えばよいかを確認

### 海外旅行モード

- 「海外旅行モード」をONにすると、複数通貨での支払いに対応
- 為替レートは自動取得、または手動入力が可能
- 基準通貨を変更して、好きな通貨で精算結果を表示

## Claude Code Integration

このプロジェクトはClaude Code GitHub Actionsと統合されています：
- Issue や PR で `@claude` をメンションすることでAIアシスタンスを受けられます
- 自動コードレビューや実装支援が可能です

## Contributing

Issue作成時に `@claude` をメンションして、機能追加や改善提案をお寄せください！