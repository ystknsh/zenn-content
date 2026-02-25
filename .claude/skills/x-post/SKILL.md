---
name: x-post
description: "Zenn記事をXにポストする。記事の published を true に変更した後に自動提案する。手動で /x-post <記事ファイル名> でも実行可能。"
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
argument-hint: "<記事ファイル名（省略時は最近変更された記事を自動検出）>"
---

Zenn記事を公開した後に、Xにポストする。

## 前提条件

- `.env` に `X_API_KEY`, `X_API_SECRET`, `X_ACCESS_TOKEN`, `X_ACCESS_TOKEN_SECRET`, `ZENN_USERNAME` が設定済み
- `npm install` 済み（`tsx` が必要）

## 手順

### Step 1: 記事の特定

- `$ARGUMENTS` が指定されている場合: `articles/$ARGUMENTS` を使用（`.md` がなければ補完）
- 指定がない場合: `git diff --name-only HEAD` や `git diff --name-only --cached` で最近変更された `articles/*.md` を探す
- それでも見つからない場合: `ls -t articles/*.md | head -1` で最新の記事を使用

### Step 2: 記事の読み取り

YAML frontmatter から以下を取得:
- `title`: 記事タイトル
- `emoji`: 絵文字
- `topics`: トピック一覧
- `publication_name`: パブリケーション名（あれば）
- `published`: `true` であることを確認（`false` なら警告）

### Step 3: URL の組み立て

- slug = ファイル名から `.md` を除いたもの
- `publication_name` がある場合: `https://zenn.dev/{publication_name}/articles/{slug}`
- ない場合: `.env` の `ZENN_USERNAME` を使って `https://zenn.dev/{ZENN_USERNAME}/articles/{slug}`

### Step 4: ハッシュタグの生成

`topics` から最大4個のハッシュタグを生成し、末尾に `#zenn` を固定で付ける（計最大5個）。

マッピングは `CLAUDE.md` の「topics 一覧」のハッシュタグ列を参照する。一覧にない topic は `#` + そのまま（先頭大文字化）。

### Step 5: リード文の生成

記事本文を読み、1〜2文の短いリード文を生成する。読者が「読んでみたい」と思える内容にする。

**ルール:**
- 記事の要点や読者にとってのメリットを簡潔にまとめる
- 280文字制限があるため、50〜80文字程度に収める
- 「〜をまとめました」「〜を紹介しています」など自然な語尾にする

### Step 6: ポスト内容の組み立て

```
{emoji} {title}

{リード文}

{url}

{hashtags} #zenn
```

例:
```
🔌 Claude Code プラグイン開発時にローカルで動作確認する方法

--plugin-dir を使ったローカルプラグインの動作確認手順をまとめました。グローバル版との競合回避のポイントも紹介しています。

https://zenn.dev/singularity/articles/2026-02-24-claude-code-plugin-local-testing

#ClaudeCode #Plugin #AgentSkills #zenn
```

### Step 7: ユーザー確認

組み立てたポスト内容を表示し確認を取る。280文字以内であること。修正があれば反映する。

### Step 8: 投稿実行

**重要**: ユーザー確認後に実行すること。

```bash
npx tsx scripts/x-post.ts "ポスト内容"
```

成功したら返されたポスト URL を表示する。

## 重要なルール

- **認証情報は `.env` から取得** — ハードコード禁止
- **280文字制限を守る** — 超える場合はハッシュタグ削減やタイトル短縮を提案
- **投稿前にユーザー確認必須**
