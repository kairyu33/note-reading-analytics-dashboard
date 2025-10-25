# Note Reading Analytics Dashboard

note読了時間予想アプリの統計情報を可視化するダッシュボード

## 機能

- リアルタイム統計表示
- 30日間の推移グラフ
- サンプルテキスト使用状況
- 平均文字数・難易度・読了時間の表示

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. ローカル開発

```bash
npm run dev
```

http://localhost:3000 でアクセス可能

### 3. デプロイ (Vercel)

```bash
# Vercel CLIでログイン
npx vercel login

# デプロイ
npx vercel --prod
```

## 使い方

1. ダッシュボードにアクセス
2. Analytics API URLを入力（例: `https://your-api.vercel.app`）
3. 統計情報が自動的に表示されます

## 環境変数

不要（クライアントサイドで設定）

## 技術スタック

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Chart.js & react-chartjs-2

## ライセンス

MIT
