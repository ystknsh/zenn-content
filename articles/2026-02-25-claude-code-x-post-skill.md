---
title: "Claude Code の Skill で Zenn 記事を X に自動投稿する仕組みを作った"
emoji: "🐦"
type: "tech"
topics: [claudecode, zenn, cli, development, 自動化]
published: false
publication_name: singularity
---

:::message
筆者の実体験をもとに Claude Code を活用して作成・整理しました。
:::

Zenn に記事を公開した後、X にもポストしたい。でも毎回ブラウザを開いて URL をコピーしてハッシュタグを考えて……という手間を省くために、Claude Code の Skill と TypeScript スクリプトで自動化しました。

この記事では、Skill の設計から X API（OAuth 1.0a）の実装まで、一通りの仕組みを紹介します。

## 完成したもの

`/x-post` と打つだけで、直近の記事から投稿文を自動生成し、X に投稿できます。

```
🔌 Claude Code プラグイン開発時にローカルで動作確認する方法

--plugin-dir を使ったローカルプラグインの動作確認手順をまとめました。
グローバル版との競合回避のポイントも紹介しています。

https://zenn.dev/singularity/articles/2026-02-24-claude-code-plugin-local-testing

#ClaudeCode #Plugin #AgentSkills #zenn
```

`published: true` に変更したタイミングで Claude Code が自動で提案してくれるようにもなっています。

実際に投稿したポストがこちらです:

https://x.com/ystknsh/status/2026484248056864996

## 全体のアーキテクチャ

```
Claude Code Skill (.claude/skills/x-post/SKILL.md)
  ├── 記事の frontmatter を解析（タイトル、topics、URL）
  ├── ハッシュタグ・リード文を生成
  ├── ユーザーに確認
  └── TypeScript スクリプトを実行
        └── scripts/x-post.ts（OAuth 1.0a で X API v2 に POST）
```

Skill が「何を投稿するか」を組み立て、スクリプトが「どう投稿するか」を担当する分離構成です。

## 1. X API のセットアップ

### Developer Portal でアプリを作成

1. [X Developer Portal](https://developer.x.com/) にアクセス
2. 「Projects & Apps」→「Create App」でアプリを作成
3. 「User authentication settings」で以下を設定:
   - **App permissions**: Read and Write
   - **Type of App**: Web App, Automated App or Bot
   - **OAuth 1.0a**: 有効にする
4. 「Keys and Tokens」タブで以下を取得:

| Developer Portal の表示 | 用途 |
|---|---|
| API Key (Consumer Key) | アプリの認証 |
| API Key Secret (Consumer Secret) | アプリの認証 |
| Access Token | アカウントの認証 |
| Access Token Secret | アカウントの認証 |

### 環境変数の設定

プロジェクトルートの `.env` に保存します。

```bash
# .env
X_API_KEY=your_api_key
X_API_SECRET=your_api_secret
X_ACCESS_TOKEN=your_access_token
X_ACCESS_TOKEN_SECRET=your_access_token_secret
ZENN_USERNAME=your_zenn_username
```

`.gitignore` に `.env` を追加することを忘れずに。

### OAuth 1.0a と OAuth 2.0 の違い

X API では OAuth 1.0a と OAuth 2.0 の両方がサポートされています。

| | OAuth 1.0a | OAuth 2.0 (PKCE) |
|---|---|---|
| セットアップ | キー4つを `.env` に置くだけ | ブラウザで認証フロー + トークン更新処理が必要 |
| トークン期限 | なし（永続） | 2時間で失効、refresh token で更新が必要 |
| スクリプトの複雑さ | 署名生成のみ | 認証フロー + トークン管理 |

CLI ツールのような自動化用途には OAuth 1.0a が適しています。一度キーを設定すればずっと使えます。

## 2. TypeScript スクリプト（scripts/x-post.ts）

外部ライブラリなしで、Node.js 標準の `crypto` モジュールだけで OAuth 1.0a 署名を生成しています。

### OAuth 1.0a 署名の仕組み

X API v2 にリクエストを送るには、`Authorization` ヘッダーに OAuth 署名を含める必要があります。

```typescript
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string,
): string {
  // 1. パラメータをソートしてエンコード
  const sortedParams = Object.keys(params)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");

  // 2. Base String を構築: METHOD&URL&PARAMS
  const baseString = `${method}&${percentEncode(url)}&${percentEncode(sortedParams)}`;

  // 3. Signing Key: ConsumerSecret&TokenSecret
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`;

  // 4. HMAC-SHA1 で署名
  return crypto.createHmac("sha1", signingKey).update(baseString).digest("base64");
}
```

署名の流れは以下の通りです:

1. OAuth パラメータ（`oauth_consumer_key`, `oauth_nonce`, `oauth_timestamp` 等）をソート
2. `POST&エンコード済みURL&エンコード済みパラメータ` の Base String を作成
3. Consumer Secret と Access Token Secret を `&` で連結した Signing Key で HMAC-SHA1 署名

:::message
**JSON body の扱い**: OAuth 1.0a の署名対象に JSON body のパラメータは含めません。署名に含めるのは OAuth パラメータのみです。
:::

### 投稿処理

```typescript
async function postTweet(text: string): Promise<void> {
  const url = "https://api.x.com/2/tweets";

  // OAuth パラメータを生成
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: apiKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  // 署名を生成して Authorization ヘッダーを構築
  const signature = generateOAuthSignature("POST", url, oauthParams, apiSecret, accessTokenSecret);
  oauthParams.oauth_signature = signature;

  const authHeader = "OAuth " + Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}="${percentEncode(oauthParams[k])}"`)
    .join(", ");

  // X API v2 に POST
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const data = await response.json();
  console.log(`Posted: https://x.com/i/status/${data.data.id}`);
}
```

### 文字数カウント

X の文字数制限（280文字）は単純な文字列長ではなく、重み付きカウントです。

```typescript
function countWeightedLength(str: string): number {
  const urlRegex = /https?:\/\/[^\s]+/g;
  const withoutUrls = str.replace(urlRegex, "");
  const urlCount = (str.match(urlRegex) || []).length;

  let count = urlCount * 23; // URL は長さに関係なく 23 文字
  for (const char of withoutUrls) {
    const code = char.codePointAt(0) || 0;
    // CJK、絵文字等のワイド文字は 2 文字としてカウント
    count += isWideCharacter(code) ? 2 : 1;
  }
  return count;
}
```

| 文字種 | カウント |
|---|---|
| ASCII | 1 |
| URL | 23（長さに関係なく固定） |
| CJK・絵文字 | 2 |

## 3. Claude Code Skill（.claude/skills/x-post/SKILL.md）

Skill は Claude Code に「何をどの手順でやるか」を教えるマークダウンファイルです。

### YAML Frontmatter

```yaml
---
name: x-post
description: "Zenn記事をXにポストする。記事の published を true に変更した後に自動提案する。"
allowed-tools: Read, Bash, Glob, Grep, AskUserQuestion
argument-hint: "<記事ファイル名（省略時は最近変更された記事を自動検出）>"
---
```

- `description` にトリガー条件を書くことで、`published: true` に変更した際に Claude Code が自動で提案してくれます
- `allowed-tools` でスクリプト実行に必要なツールを許可しています

### Skill の処理フロー

Skill 本文には 8 つのステップを記述しています。

```
Step 1: 記事の特定（引数 or git diff で最近の変更を検出）
Step 2: frontmatter の読み取り（title, emoji, topics, publication_name）
Step 3: URL の組み立て
Step 4: ハッシュタグの生成（topics からマッピング）
Step 5: リード文の生成（記事本文から 1〜2 文の要約）
Step 6: ポスト内容の組み立て
Step 7: ユーザー確認
Step 8: 投稿実行（scripts/x-post.ts を呼び出し）
```

### ハッシュタグの自動生成

記事の `topics` からハッシュタグへのマッピングテーブルを Skill 内に定義しています。

```markdown
| topic | ハッシュタグ |
|-------|------------|
| `claudecode` | `#ClaudeCode` |
| `ai` | `#AI` |
| `mulmocast` | `#MulmoCast` |
| その他 | `#` + そのまま（先頭大文字化） |
```

topics から最大 4 個を選び、固定の `#zenn` を加えて計最大 5 個にしています。

### リード文の生成

ハッシュタグと URL だけのポストだと読者の興味を引きにくいため、記事本文から 1〜2 文のリード文を生成するステップを追加しました。Claude Code が記事を読んで要約してくれます。

## 4. プロジェクトの設定

### package.json

```json
{
  "scripts": {
    "x-post": "tsx scripts/x-post.ts",
    "format": "prettier --write 'scripts/**/*.ts'",
    "lint": "eslint scripts"
  },
  "devDependencies": {
    "@eslint/js": "^10.0.1",
    "@types/node": "^22.0.0",
    "eslint": "^10.0.2",
    "eslint-config-prettier": "^10.1.8",
    "prettier": "^3.8.1",
    "tsx": "^4.19.0",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.33.0"
  }
}
```

`tsx` を使うことで TypeScript をビルドなしに直接実行できます。ESLint と Prettier も導入し、スクリプトの品質を保てるようにしています。

### ディレクトリ構成

```
zenn-content/
├── .claude/
│   └── skills/
│       └── x-post/
│           └── SKILL.md        # Skill 定義
├── scripts/
│   └── x-post.ts              # X API 投稿スクリプト
├── articles/                   # Zenn 記事
├── .env                        # API キー（.gitignore 対象）
├── .env.example                # 環境変数テンプレート
├── tsconfig.json
├── eslint.config.mjs
└── .prettierrc
```

## まとめ

- Claude Code の Skill でポスト内容の組み立て（記事解析・ハッシュタグ・リード文）を自動化
- TypeScript スクリプトで X API v2 への OAuth 1.0a 投稿を実装（外部ライブラリ不要）
- `published: true` にすると自動で提案、手動で `/x-post` でも実行可能

Skill が「考える」部分、スクリプトが「実行する」部分を担当する分離構成にしたことで、投稿テンプレートの変更は Skill だけ、API の変更はスクリプトだけで対応できます。

ソースコードは以下のリポジトリで公開しています。

https://github.com/ystknsh/zenn-content
