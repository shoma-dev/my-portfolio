# 🚀 Shoma's Portfolio — AIチャットボット付きポートフォリオサイト

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Claude API](https://img.shields.io/badge/Claude-Haiku-D97706?style=flat-square&logo=anthropic&logoColor=white)](https://www.anthropic.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> データエンジニア・コンサルタント **Shoma** のポートフォリオサイト。
> 訪問者が Shoma のスキル・実績・料金について **Claude AI に直接質問できる**チャットボットを搭載。

**🌐 ライブデモ → [my-portfolio-six-fawn-44.vercel.app](https://my-portfolio-six-fawn-44.vercel.app/)**

---

## 📋 目次

- [プロジェクト概要](#-プロジェクト概要)
- [機能一覧](#-機能一覧)
- [使用技術](#-使用技術)
- [ディレクトリ構成](#-ディレクトリ構成)
- [ローカルセットアップ](#-ローカルセットアップ)
- [Vercel デプロイ](#-vercel-デプロイ)
- [環境変数](#-環境変数)
- [作者](#-作者)

---

## 📌 プロジェクト概要

副業・フリーランスとして活動する際の**一次接点**となるポートフォリオサイトです。

従来の静的なポートフォリオと異なり、右下のチャットボットから **Claude AI（Haiku）** に話しかけることで、訪問者が自分のペースでShomaのスキル・料金・実績を確認できます。APIキーはサーバーサイドで管理するため、フロントエンドに露出しない設計になっています。

| セクション | 内容 |
|---|---|
| Hero | インタラクティブな背景グラデーション、キャッチコピー |
| Services | Web制作・RPA・AIエージェント・データ分析の4スキル |
| Works | クラウドワークス受注実績 3件 |
| Pricing | 要相談スタイルの料金案内 |
| Contact | メール・クラウドワークスへの導線 |
| AI Chat | Claude API を使ったフローティングチャットボット |

---

## ✨ 機能一覧

- 🤖 **AIチャットボット** — Claude Haiku を使用。Shomaの情報をシステムプロンプトに埋め込み、スキル・料金・納期・実績などの質問に自動回答
- 🖱️ **カスタムカーソル** — マウスに追従する2層カーソル（dot + ring）
- 🌈 **インタラクティブ背景** — マウス位置に連動して動くグラデーション（ヒーローセクション）
- 📜 **スクロールアニメーション** — IntersectionObserver による左右交互フェードイン
- 📱 **レスポンシブデザイン** — モバイル対応（900px / 600px ブレークポイント）
- 🔒 **APIキーの安全管理** — `/api/chat` サーバーサイドルートで処理。クライアントにキーが露出しない

---

## 🛠 使用技術

| カテゴリ | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router） |
| 言語 | TypeScript 5 |
| スタイリング | グローバルCSS（CSS変数・アニメーション） |
| AI | Anthropic Claude API（`claude-haiku-4-5-20251001`） |
| SDK | `@anthropic-ai/sdk` |
| デプロイ | Vercel |
| フォント | Google Fonts（Space Grotesk / Noto Sans JP） |

---

## 📁 ディレクトリ構成

```
my-portfolio/
├── app/
│   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ）
│   ├── page.tsx            # メインページ（クライアントコンポーネント）
│   ├── globals.css         # グローバルスタイル
│   └── api/
│       └── chat/
│           └── route.ts    # チャットAPIルート（サーバーサイド）
├── .env.local              # 環境変数（Git管理外）
├── .gitignore
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## 🚀 ローカルセットアップ

### 1. リポジトリをクローン

```bash
git clone https://github.com/shoma-dev/my-portfolio.git
cd my-portfolio
```

### 2. 依存関係をインストール

```bash
npm install
```

### 3. 環境変数を設定

`.env.local` をプロジェクトルートに作成し、Anthropic APIキーを設定します。

```bash
cp .env.example .env.local   # または手動で作成
```

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxx
```

> **APIキーの取得方法**
> 1. [console.anthropic.com](https://console.anthropic.com/) にアクセス
> 2. 「API Keys」→「Create Key」でキーを発行
> 3. 発行されたキー（`sk-ant-...`）を上記に貼り付け

### 4. 開発サーバーを起動

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) でサイトが立ち上がります。

---

## 🌍 Vercel デプロイ

### GitHub 連携でデプロイ（推奨）

1. [vercel.com](https://vercel.com/) にログイン
2. 「Add New Project」→ `shoma-dev/my-portfolio` をImport
3. **Environment Variables** に以下を追加

| Name | Value |
|---|---|
| `ANTHROPIC_API_KEY` | `sk-ant-xxxxxxxxxx` |

4. 「Deploy」をクリック

> ⚠️ **環境変数を忘れるとチャットボットが動きません。**
> Vercel Dashboard → Settings → Environment Variables から後から追加することも可能です。

---

## 🔑 環境変数

| 変数名 | 説明 | 必須 |
|---|---|---|
| `ANTHROPIC_API_KEY` | Anthropic の APIキー（`sk-ant-...`） | ✅ |

> `.env.local` は `.gitignore` に含まれており、Gitにコミットされません。

---

## 👤 作者

**Shoma（吉田 翔馬）**
データエンジニア・コンサルタント

- 📧 Email: [shoma.yoshida0011@gmail.com](mailto:shoma.yoshida0011@gmail.com)
- 💼 Crowdworks: [クラウドワークスのプロフィール](https://crowdworks.jp/)
- 🌐 Portfolio: [my-portfolio-six-fawn-44.vercel.app](https://my-portfolio-six-fawn-44.vercel.app/)

---

<p align="center">Built with ♥ and Claude API</p>
