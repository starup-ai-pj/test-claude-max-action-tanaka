# 旅行費用精算アプリケーション

友人との旅行で発生した費用を簡単に精算できるWebアプリケーションです。

## 機能

### 必要要件（国内旅行）
- ✅ 人を追加（旅行参加者）
- ✅ 支払い費用の追加（誰がいくら何に払ったのか）
- ✅ 精算（総費用を割り勘して、誰が誰にいくら払えば良いのかを計算）

### 追加要件（海外旅行）
- ✅ 複数の通貨で支払いを行った場合への対応
- ✅ ExchangeRate-API を使用したリアルタイム為替レート取得

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Docker**

## セットアップ

### 開発環境での起動

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

### Dockerを使用した起動

```bash
# Dockerイメージのビルドと起動
docker-compose up --build
```

### 本番環境用ビルド

```bash
# ビルド
npm run build

# 本番サーバーの起動
npm start
```

## 使い方

1. **参加者の追加**: 左側のパネルから旅行参加者を追加します
2. **支払いの記録**: 
   - 説明（例：夕食代）を入力
   - 金額と通貨を選択
   - 支払者を選択
   - 割り勘する人を選択
3. **通貨設定**: 海外旅行の場合は、使用する通貨を追加し、為替レートを設定
4. **精算確認**: 「精算」タブで誰が誰にいくら支払うべきかを確認

## プロジェクト構造

```
.
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # ルートレイアウト
│   │   ├── page.tsx      # メインページ
│   │   └── globals.css   # グローバルスタイル
│   ├── components/       # Reactコンポーネント
│   │   ├── ParticipantList.tsx
│   │   ├── ExpenseForm.tsx
│   │   ├── ExpenseList.tsx
│   │   ├── SettlementView.tsx
│   │   └── CurrencySettings.tsx
│   └── types/           # TypeScript型定義
│       └── index.ts
├── public/              # 静的ファイル
├── Dockerfile          # Docker設定
├── docker-compose.yml  # Docker Compose設定
├── package.json        # プロジェクト依存関係
├── tsconfig.json       # TypeScript設定
├── tailwind.config.ts  # TailwindCSS設定
└── next.config.js      # Next.js設定
```

## ライセンス

MIT