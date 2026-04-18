# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Leaf Record はメモをGitHubのプライベートリポジトリにコミットできる草生やしアプリ。フロント(Next.js) / バック(Rails API) の分離構成で、Docker Compose で開発する。

## 開発環境の起動

```bash
# 全サービス起動（DB + back:3000 + front:8000）
docker compose up

# 個別起動
docker compose up db back
docker compose up front
```

## コマンド

### バックエンド

バックエンドはDockerコンテナ内で実行する。

```bash
docker compose exec back bundle exec rspec                           # 全テスト
docker compose exec back bundle exec rspec spec/models/user_spec.rb # 単一ファイル
docker compose exec back bundle exec rspec spec/models/user_spec.rb:17 # 単一テスト
docker compose exec back bundle exec rails db:migrate
docker compose exec back bundle exec rails db:schema:load           # テストDBのセットアップ
```

### フロントエンド

フロントエンドもDockerコンテナ内で実行する。

```bash
docker compose exec front yarn dev        # 開発サーバー（ポート8000）
docker compose exec front yarn build
docker compose exec front yarn test       # Vitest（単体テスト）
docker compose exec front yarn test:watch
docker compose exec front yarn test:e2e  # Playwright（E2E）
docker compose exec front yarn lint
```

## Git ワークフロー

ブランチ名は `type/#issuenum_description` の形式。

```
feat/#12_add_login
fix/#15_token_refresh
chore/#26_remove_unused_deps
```

## アーキテクチャ

### 認証フロー

1. フロントの「GitHubでログイン」ボタン → `window.location.href = /auth/github`
2. `Auth::OmniauthCallbacksController#redirect_callbacks` でGitHub OAuthを処理
3. DeviseTokenAuthのトークン（uid / token / client / expiry）をクエリパラメータに乗せて `FRONT_URL/record?uid=...` にリダイレクト
4. フロントの `/record` ページがクエリパラメータを受け取り `localStorage` に保存
5. 以降のAPIリクエストは `authClient`（`src/api/auth.ts`）のインターセプターが localStorage からヘッダーに付加

GitHubトークンはDBに保存する前に `Encryptor` で AES-256-CBC 暗号化。API呼び出し時に `Decryptor` で復号して `Octokit::Client` を初期化する。暗号化キーは環境変数 `GITHUB_TOKEN_ENCRYPT_KEY`（Base64エンコードされた32バイト値）。

### バックエンド構造

- `app/controllers/api/v1/` — APIエンドポイント。`BasesController` が `authenticate_user!` を `before_action` で強制
- `app/services/github.rb` — Octokit ラッパー。ファイルのCRUDはすべてGit Treeを直接操作（blob → tree → commit → ref update）
- `app/services/encryptor.rb` / `decryptor.rb` — GitHubトークンの暗号化/復号

### フロントエンド構造

- `src/api/auth.ts` — `authClient`（axios インスタンス）と `useAuth` フックを定義。全認証済みAPIリクエストはこの `authClient` を使う
- `src/recoil/index.ts` — グローバル状態は `userState`（ログインユーザー）と `recordsState`（リポジトリ一覧）のみ
- `src/app/record/page.tsx` — リポジトリ一覧。クエリパラメータ経由のログイン処理も兼ねる
- `src/app/record/[name]/page.tsx` — ファイルエディタ。ファイルの作成・編集・削除・リネームをすべてこのページで扱い、保存時に一括コミット

### 環境変数

**バック**
| 変数 | 用途 |
|---|---|
| `GITHUB_TOKEN_ENCRYPT_KEY` | GitHubトークン暗号化キー（Base64, 32バイト） |
| `FRONT_URL` | OAuth後のリダイレクト先（例: `http://localhost:8000`） |
| `DB_HOST` / `DB_USERNAME` / `DB_PASSWORD` | テストDBの接続情報 |

**フロント**
| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_API_URL` | バックエンドURL（例: `http://localhost:3000`） |

## E2Eテスト

認証済みページのテストは `page.route()` でAPIをインターセプト、`page.addInitScript()` で localStorage にトークンをセットする方式（GitHub OAuthを回避）。
