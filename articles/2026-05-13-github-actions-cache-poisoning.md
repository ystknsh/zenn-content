---
title: "「PRを出しただけ」で本番環境が汚染される——GitHub Actions Cache Poisoning攻撃を理解する"
emoji: "🛡️"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [githubactions, security, supplychain, npm, ci]
published: false
publication_name: singularity
---

:::message
2026年5月に発生した TanStack の npm パッケージ改ざん事件について、調べた内容を Claude を活用して整理しました。
:::

## はじめに

2026年5月11日、JavaScript エコシステムで広く使われている TanStack の公式 npm パッケージが改ざんされる事件が発生しました。攻撃名は **「Mini Shai-Hulud（小さな砂虫）」** です。

驚くべきことに、攻撃者は TanStack の本家リポジトリのコードを一行も変えていません。**外部から PR を出しただけ**で、本番リリースに悪意あるコードを混入させることに成功しました。

実際に 42 パッケージ × 84 バージョンが npm に publish され、検出後すぐに deprecate されたものの、tarball が削除されるまでの数時間は install 可能な状態が続きました。その間に `npm install` した環境では、AWS / GCP / GitHub PAT / SSH キー等の credential が窃取され、Worm によって他パッケージへの感染拡大にも利用されました。

この記事では、その仕組みと防ぎ方を丁寧に解説します。

この記事は、**GitHub Actions で CI/CD を運用している方、OSS リポジトリのメンテナー、Supply Chain 攻撃の最新動向に関心のある方**を対象にしています。

## 被害の概要

- **初期被害**: TanStack の 42 パッケージ・84 バージョンが改ざん
- **最終被害**: Worm 機能により 169 パッケージ・373 バージョンに拡大（@mistralai、@uipath 等を含む）
- **特徴**: npm 史上初の「SLSA provenance 付き正当署名」で公開された悪意バージョン
- **ペイロード**: AWS / GCP / GitHub PAT / SSH 等の credential を窃取し、自動で他パッケージに感染拡大

## 前提知識: GitHub Actions の 2 種類の PR トリガー

この攻撃を理解するには、まず `pull_request` と `pull_request_target` の違いを押さえる必要があります。

### `pull_request`（通常のトリガー）

外部の fork から PR が来たとき、**fork 側の環境**でワークフローが動きます。

```yaml
on:
  pull_request:
```

- 実行環境: PR のブランチ（fork 側）
- secrets へのアクセス: ❌ できない
- 安全性: ✅ 高い

外部コントリビューターのコードが secrets にアクセスできないため、安全です。

### `pull_request_target`（特殊なトリガー）

外部の fork から PR が来たとき、**ベースリポジトリ（本家）の環境**でワークフローが動きます。

```yaml
on:
  pull_request_target:
```

- 実行環境: ベースブランチ（本家側）
- secrets へのアクセス: ✅ できる
- 安全性: ⚠️ 使い方次第で危険

## なぜ `pull_request_target` が存在するのか

外部コントリビューターの PR に対して、**本家の権限が必要な処理**をしたいケースがあるからです。

代表的なユースケース:

- 外部 PR に自動でラベルを付ける
- 外部 PR に計測結果をコメントする
- bundle size を計測して PR にコメントを投稿する ← **TanStack のケース**

bundle size の計測には「PR のコードでビルドした結果」が必要です。そのため、本家のワークフローが意図的に fork 側のコードを checkout して実行していました。

## 攻撃の仕組み

### 危険な条件: 2 つが同時に揃うとき

| 条件 | 状態 | 結果 |
|---|---|---|
| `pull_request` ＋ fork 側 checkout | ✅ 安全 | secrets が見えない環境で動く |
| `pull_request_target` ＋ checkout なし | ✅ 安全 | fork 側コードが動かない |
| `pull_request_target` ＋ fork 側 checkout | 💥 **危険** | secrets が見える環境で fork 側コードが動く |

**この最後のパターンだけが危険です。**

### TanStack のワークフローはこうなっていた

```yaml
on:
  pull_request_target:          # ← 本家環境で動く（secretsが見える）

jobs:
  build:
    steps:
      - uses: actions/checkout@v4
        with:
          ref: ${{ github.event.pull_request.head.ref }}  # ← fork側をcheckout
      - run: pnpm install       # ← fork側のコードが実行される 💥
      - uses: actions/cache/save@v4  # ← 汚染されたcacheを保存
```

### 攻撃の流れ（ステップバイステップ）

```
① 攻撃者が TanStack/router を fork

② fork に vite_setup.mjs（約30,000行の悪意コード）を commit
   ※ PRの差分には含めない、fork内に置くだけ

③ 無害に見えるPRを作成
   タイトル: "WIP: simplify history build"
   差分: 普通のコード変更のみ

④ pull_request_target がトリガーされる
   → fork ごと checkout（vite_setup.mjs も一緒に落ちてくる）
   → pnpm install 実行時に vite_setup.mjs が動く
   → pnpm store cache を 1.1GB の悪意データで上書き
   → cache は「mainブランチ向け」として保存される

⑤ PRはマージしなくてよい（攻撃はもう完了している）

⑥ 後日、メンテナーが別の正常なPRをマージ
   → release.yml が起動
   → 「mainブランチ向け」の汚染済みcache を復元
   → 悪意バージョンが npm に公開される 💥
```

### ポイント: PR をマージしなくても汚染される

GitHub Actions の cache は**リポジトリ単位で共有**されています。

攻撃者がやったのは「PR を出して本家のワークフローを起動させ、main 向け cache 領域に書き込ませる」ことだけです。PR のコード自体を main に取り込む必要は一切ありませんでした。

さらに重要なのは、**ワークフローが一度走った時点で cache 汚染は完了している**という点です。PR をその後 close しても、放置しても、汚染された cache はリポジトリ側に残り続けます。汚染を解消するには、GitHub Actions の cache を手動で削除する必要があります（`gh cache delete` または Settings → Actions → Caches から）。

### ポイント: レビューをパスしても防げない

PR の差分には `vite_setup.mjs` は含まれていません。レビュワーが diff を丁寧に確認しても気づけない設計になっています。fork 側のリポジトリを丸ごと確認しなければ、悪意コードの存在には気づけませんでした。

## secrets として狙われるもの

GitHub secrets とは「CI が自動で外部サービスに書き込む」ための認証情報を保管する金庫です。中身は何でもありえます。

```
GitHub secrets（金庫）の中身の例
├── npm token              → npmにパッケージを公開するため
├── AWS / GCP keys         → クラウドにデプロイするため
├── GitHub PAT             → GitHubに書き込むため
├── SSH keys               → サーバーにアクセスするため
└── AIサービスのAPIキー    → ← ここが見落とされがち
    ├── OPENAI_API_KEY
    ├── ANTHROPIC_API_KEY
    └── その他LLM系APIキー
```

### 自動コードレビューの API キーも標的になる

近年、PR に対して AI が自動でコードレビューを行う CI 構成が増えています。

```
PR が作成される
      ↓
GitHub Actions が起動
      ↓
OpenAI / Claude / Codex API を呼んでレビュー実行
      ↓
結果をPRにコメント投稿
```

この構成では `OPENAI_API_KEY` や `ANTHROPIC_API_KEY` を secrets に入れる必要があります。さらに AI コードレビュー用ワークフローは構造上、**「PR のコードを読む（= fork 側 checkout）」＋「PR にコメントを返す（= secrets が必要）」** の両方を満たすため、今回と同じ `pull_request_target` ＋ fork 側 checkout のパターンになりやすく、**API キー窃取の標的になります**。

### サービス型 vs 自前 API 呼び出し型

| 方式 | 例 | API キーの管理 | リスク |
|---|---|---|---|
| サービス型（アプリとして動く） | CodeRabbit、Sourcery | サービス側が管理 | ✅ 自分の secret に入れない |
| 自前 API 呼び出し型 | Actions 内で API を直接呼ぶ | 自分で secret に入れる | 💥 窃取対象になる |

**API キーを GitHub secrets に入れている構成は、今回の攻撃の標的になります。** Copilot、Codex、Claude API などを自前の Actions ワークフローから呼んでいる場合は特に注意が必要です。

サービス型（CodeRabbit や Sourcery のような外部サービスとして動くもの）であれば、API キーはそのサービス側が管理しているため、自分の secret には入らず比較的安全です。

## なぜ「正当な署名付き」で公開できたのか

通常、npm への公開には認証が必要です。しかし今回の悪意バージョンは **SLSA provenance 付きの正当署名**で公開されました。

理由は、GitHub Actions の OIDC トークンを直接使用したからです。攻撃者は secrets（npm token）を窃取し、それを使って本物のリリースフローと同じ方法でパッケージを公開しました。これが npm 史上初の手法として注目されています。

## Worm 型拡散の仕組み

このマルウェアが特に危険な理由は **Worm 機能**を持っていることです。

```
被害者のCI環境で実行
      ↓
credential（GitHub PAT、npm token等）を窃取
      ↓
窃取したnpm tokenで管理パッケージを検索
      ↓
同じpayloadを注入して再公開
      ↓
次の被害者のCI環境に感染 → 繰り返し
```

さらに悪質なのが **Dead-man's switch** の存在です。窃取した GitHub トークンが 60 秒以内に revoke されると、`rm -rf ~/` でホームディレクトリを完全削除し、systemd / LaunchAgent で常駐します。

## 対策

### まず確認: 自分のリポジトリは影響を受けるか

```bash
grep -r "pull_request_target" .github/workflows/
```

**ヒットしなければ、今回の攻撃ベクターとは無関係です。**

### 対策 ①: トリガーを変える（最もシンプル）

secrets へのアクセスが不要なら、`pull_request` に変更するだけで安全になります。

```yaml
# ❌ Before（危険）
on:
  pull_request_target:

# ✅ After（安全）
on:
  pull_request:
```

### 対策 ②: 2 ジョブに分離する（GitHub 公式推奨）

bundle size の計測のように「fork 側コードのビルド結果」が必要な場合は、処理を 2 つのジョブに分けます。

```yaml
# ジョブ1: secrets なし環境でビルド（pull_request トリガー）
on:
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4  # fork側をcheckout（secretsなし環境）
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: build-result
          path: ./dist
```

```yaml
# ジョブ2: secrets あり環境でコメント投稿（workflow_run トリガー）
on:
  workflow_run:
    workflows: ["build"]
    types: [completed]

jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4  # fork側コードは実行しない
        with:
          name: build-result
      - name: PRにコメント
        uses: actions/github-script@v7
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}  # ここでsecretsを使う
          script: |
            // コメント投稿処理
```

このパターンでは、secrets が使える環境では fork 側のコードを一切実行しません。

### 対策 ③: Branch Protection の設定見直し

Settings → Actions → **"Require approval for first-time contributors"** を有効にすることで、外部コントリビューターの初回 PR は Actions が自動実行されなくなります。

:::message alert
**「初回のみ承認」では不十分です。** 攻撃者は無害な PR を 1 回マージしてもらって「信用された contributor」になり、2 回目以降で攻撃を仕掛けられます。2 回目以降は Actions が自動実行されるため、ここを狙うのは典型的な手口です。
:::

そのため OSS リポジトリでは **"Require approval for all outside collaborators"** にして、org member 以外は毎回承認が必要な設定にすることを推奨します。

## まとめ

今回の攻撃から学べる教訓は 4 つです。

1. **`pull_request_target` ＋ fork 側 checkout の組み合わせは危険**。この 2 つが揃うと、外部 PR が secrets にアクセスできる環境で動く。
2. **PR をマージしなくても汚染できる**。cache はリポジトリ単位で共有されているため、ワークフローを実行させるだけで本番リリースフローを汚染できる。
3. **差分レビューだけでは防げない**。悪意コードは fork 内の別ファイルに隠されており、PR の diff には現れない。
4. **AI の API キーも標的になる**。npm token や AWS keys だけでなく、OpenAI・Claude・Codex 等の API キーを secret に入れている場合も窃取対象。自前の Actions から AI API を呼ぶ構成は特に要注意。

OSS 開発者や CI/CD を管理する方は、まず `grep -r "pull_request_target" .github/workflows/` で自分のリポジトリを確認することをお勧めします。

## 参考リンク

- [TanStack 公式 Postmortem](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem)
- [GitHub Issue #7383（影響パッケージリスト）](https://github.com/TanStack/router/issues/7383)
- [Socket.dev 影響追跡](https://socket.dev/supply-chain-attacks/mini-shai-hulud)
- [GitHub 公式ドキュメント: pull_request_target の安全な使い方](https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows#pull_request_target)
- [TanStack の npm パッケージ改ざん事件まとめ（note）](https://note.com/zephel01/n/n7a96947c0b6e)
