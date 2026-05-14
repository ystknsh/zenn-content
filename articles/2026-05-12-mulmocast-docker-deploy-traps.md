---
title: "MulmoCast CLI を Web サービスに組み込むためのベストプラクティス（Docker / Puppeteer / EC2）"
emoji: "🐳"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [mulmocast, docker, puppeteer, ec2, nodejs]
published: false
publication_name: singularity
---

:::message
MulmoCast CLI の開発チームとして、自分たちで CLI を Web サービスに組み込んだときの知見を Claude を活用してまとめました。
:::

## はじめに
[MulmoCast CLI](https://github.com/receptron/mulmocast-cli) は、JSON 形式の台本（MulmoScript）から、AI が自動でプレゼンテーション動画やポッドキャストを生成するツールです（[公式サイト](https://mulmocast.com)）。

この記事は、**MulmoCast CLI を Web サービスに組み込みたい方**を対象にしています。

MulmoCast CLI (`mulmo audio` / `mulmo movie` コマンド) を Express サーバーから `child_process.spawn` で呼び出し、Cloudflare Pages + EC2 Docker で本番運用するときの推奨構成と、設計上の注意点をまとめました。Puppeteer・アセットコピー・ボリュームマウント・タイムアウト・EC2 ホストのリソースなど、設定すべき項目が複数レイヤーに分散しているため、最初から正解の構成で始めるための指針として参考にしてください。

MulmoCast CLI 固有の話だけでなく、**Puppeteer + 外部生成 API + Docker** の組み合わせで動画生成サービスを作るときにも応用できる内容です。

## 構成のおさらい

- フロント: Vue 3 + Vite（Cloudflare Pages）
- サーバー: Express 5 + TypeScript（EC2 + Docker）
- 動画生成: `mulmo audio` → `mulmo movie` を `child_process.spawn` で実行
- ジョブ ID: スクリプト内容の SHA256 ハッシュ（同じ選択 → 同じ ID → キャッシュヒット）

ベースイメージは `node:24-slim`。

## 推奨構成（先に結論）

詳細に入る前に、まずは全体像です。各設定の理由は後続のセクションで解説します。

### Dockerfile

```dockerfile
FROM node:24-slim

# Puppeteer (Chrome) dependencies for caption rendering
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    chromium \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
    libpango-1.0-0 libcairo2 libasound2 libxshmfence1 fonts-noto-cjk && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

WORKDIR /app

# Puppeteer は自動 DL せず、apt の chromium を使う（arm64/amd64 両対応 + キャッシュ問題回避）
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build && \
    cp -r server/mulmo/templates dist/server/mulmo/templates && \
    cp -r server/mulmo/bgm dist/server/mulmo/bgm && \
    cp -r server/mulmo/images dist/server/mulmo/images && \
    mkdir -p dist/server/mulmo/news && \
    cp -r server/mulmo/news/data dist/server/mulmo/news/data && \
    cp -r server/mulmo/news/scripts dist/server/mulmo/news/scripts

# 非 root で起動（Chrome の root 拒否を回避、セキュリティ的にも正解）
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 3001
ENV NODE_ENV=production
# CI=true で mulmocast 側が --no-sandbox を付与（Docker の seccomp 回避）
ENV CI=true
CMD ["node", "dist/server/index.js"]
```

### docker-compose.yml

```yaml
services:
  app:
    build: .
    ports:
      - "3001:3001"
    volumes:
      - ./server/output:/app/dist/server/output   # コンパイル後パスに合わせる
    env_file: .env
    restart: unless-stopped
```

### ホスト側（EC2）

- **swap を設定する**（swap = メモリ不足時にディスクを補助メモリとして使う OS の仕組み。t3.small/medium はデフォルトで swap なし）
- **EBS（EC2 のディスクボリューム）は 30〜50GB 以上**を確保（chromium + 各種 lib でディスクをすぐ使う）
- デプロイスクリプトに `docker system prune -f` を入れて古いイメージを削る

---

ここから、各設定の理由と、よくあるつまずきポイントを順番に解説します。

## 1. Puppeteer (Chrome) の設定

字幕焼き込みモード `mulmo movie -c <lang>` は内部で Puppeteer (Chrome) を起動して HTML をレンダリングします。`node:slim` には Chrome が入っていないため、以下の 4 つの設定が必要です。

### 1.1. Chrome の共有ライブラリと CJK フォントを入れる

Chrome が要求する system shared library 群を `apt-get install` で入れます。日本語以外の字幕も焼くので CJK フォントも必要です。

```dockerfile
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    libnss3 libnspr4 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 \
    libpango-1.0-0 libcairo2 libasound2 libxshmfence1 fonts-noto-cjk && \
    rm -rf /var/lib/apt/lists/*
```

これを入れずに起動すると、次のようなエラーが出ます。

```
error while loading shared libraries: libnspr4.so: cannot open shared object file
```

:::message alert
**実行 NG パターン: シェル継続行の途中にコメントを置く**

```dockerfile
RUN apt-get update && \
    apt-get install -y ffmpeg \
    # Puppeteer (Chrome) dependencies   ← これが原因でビルドが失敗
    libnss3 libnspr4 ...
```

バックスラッシュ継続行の途中にコメントを挟むと、シェルはそこで一旦切ってしまい、`libnss3 libnspr4 ...` 以下が「別コマンド扱い」になります。**コメントは継続行の前の行に置く**のが正解です。
:::

### 1.2. 非 root ユーザーで起動する

Chrome は root 実行時にサンドボックスが壊れることを前提に、デフォルトで root 起動を拒否します。`--no-sandbox` で逃げるよりも、非 root ユーザーを作るのがセキュリティ的に正解です。

```dockerfile
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser
```

非 root ユーザーを作らずに起動すると、次のエラーで止まります。

```
Running as root without --no-sandbox is not supported.
```

### 1.3. Puppeteer の自動 DL を切り、apt の chromium を使う

Puppeteer の自動ダウンロードに任せると、2 つの問題に当たります。

- **キャッシュパスのズレ**: 自動ダウンロードは `/root/.cache/puppeteer` に入りますが、非 root ユーザー（`appuser`）は `/home/appuser/.cache/...` を見に行きます。
- **アーキテクチャ不一致**: Mac (arm64) で `docker build` すると x64 バイナリが落ちてきて `ld-linux-x86-64.so.2` エラーになります。

どちらも **Puppeteer の自動 DL を切って、apt の `chromium` を使う**ことでまとめて解決できます。

```dockerfile
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_CACHE_DIR=/app/.cache/puppeteer
```

副次効果として、`docker-compose.yml` に `platform` を固定する必要がなくなり、amd64 (EC2) / arm64 (M1 Mac) 両環境で同じ Dockerfile が動きます。

### 1.4. CI=true で --no-sandbox を有効化する

Docker のデフォルト seccomp プロファイルは Chrome の user namespace 作成を弾くため、ここまでの設定だけだと次のエラーが出ます。

```
Failed to move to new namespace: PID namespaces supported, Network namespace supported,
but failed: errno = Operation not permitted
```

MulmoCast 内部の `html_render.js` は **`process.env.CI === "true"` のときだけ `--no-sandbox` を付ける**実装になっているので、Dockerfile に一行入れるだけで解決します。

```dockerfile
ENV CI=true
```

**`--no-sandbox` のトレードオフ**: Chrome のサンドボックスを外すと、ブラウザ側の脆弱性に対する防御層が一つ減ります。本構成で許容しているのは、レンダリング対象が **自前の HTML（外部ユーザー入力を直接 eval しない）** に限定されており、かつ Docker コンテナ自体が隔離境界として機能しているためです。逆に言うと、**任意の外部 URL を Puppeteer で開く構成ではこの判断は成り立ちません**（CI 環境で `--no-sandbox` が慣例なのと同じ前提です）。

### 1.5. 外部依存を含まない検証スクリプトを用意する

動画生成パイプラインは複数の外部 API（Replicate / Gemini / OpenAI 等）に依存しているため、エラーが出たときに「Puppeteer なのか、それとも外部 API なのか」切り分けに時間がかかります。

そこで、lip-sync を使わず `imagePrompt` だけで生成する caption 専用テストスクリプトを 1 本用意しておくと、**Puppeteer / Chrome 周りだけを純粋に検証できる**ようになります。本番デプロイ後の sanity check にも使えるので、プロジェクトに常備しておくことを推奨します。

## 2. アセットコピー — `tsc` だけでは足りない

TypeScript のサーバーは `tsc` で `dist/` にコンパイルされますが、**JSON / mp3 / png はコピーされません**。`mulmo audio` / `mulmo movie` は実行時にこれらを相対パスで参照するので、コピーが漏れると次のようなエラーになります。

```
Error: AddBGMAgent musicFile not exist: /app/dist/server/mulmo/bgm/bgm-battle.mp3
GET /api/news → []   # ニュース一覧が空
```

推奨は、build ステップで明示的にコピーする形です。

```dockerfile
RUN yarn build && \
    cp -r server/mulmo/templates dist/server/mulmo/templates && \
    cp -r server/mulmo/bgm dist/server/mulmo/bgm && \
    cp -r server/mulmo/images dist/server/mulmo/images && \
    mkdir -p dist/server/mulmo/news && \
    cp -r server/mulmo/news/data dist/server/mulmo/news/data && \
    cp -r server/mulmo/news/scripts dist/server/mulmo/news/scripts
```

ポイント: **「`tsc` 後に追加コピーが必要なディレクトリ」を Dockerfile の build ステップに集約する**。明示的な `cp` の方が「コピー漏れに気づきやすい」という意味で扱いやすいです。

## 3. ボリュームマウントのパスは「コンパイル後のパス」に合わせる

これは見落としやすいポイントです。`runner.ts` で:

```ts
const OUTPUT_DIR = path.resolve(import.meta.dirname, "..", "output");
```

ローカル dev だと `server/output` ですが、本番では **コンパイル後の `dist/server/runner.js` から `..` で見るので `dist/server/output`** になります。コンテナ側のマウント先を `/app/server/output` にしてしまうと、コンテナ内のキャッシュがホストの `./server/output` に永続化されません。

:::message alert
**実行 NG パターン: マウント先をソースツリーのパスにする**

```bash
# NG: コンテナ内では /app/dist/server/output に書き込まれるためマウント先がズレる
docker run -v "$(pwd)/server/output:/app/server/output" ...
```

**正解**:

```bash
docker run -v "$(pwd)/server/output:/app/dist/server/output" ...
```
:::

このズレが厄介なのは、**`docker compose restart` で運用している間は問題が表面化しない**点です。コンテナを作り直さない限り、コンテナ内の `/app/dist/server/output/` は残るため、キャッシュは効いているように見えます。`docker compose down && up` や `up -d --build` でコンテナを作り直したタイミングで、初めて「ホストにキャッシュが残っていない」ことに気付きます。

ポイント: **`import.meta.dirname` / `__dirname` ベースで相対パスを組んでいる場合、本番でのパスは「コンパイル後の物理パス」になります**。volume マウントも `dist/` 配下を指すのが正解です。

### 補足: docker compose で rebuild してもキャッシュは消えない

「コードを直して `docker compose build` しただけで生成済み動画が全部消えるんじゃないか」という不安を持ちやすいですが、上記の正しいマウント設定をしていれば消えません。

```yaml
volumes:
  - ./server/output:/app/dist/server/output
```

ホスト側の `./server/output` を直接コンテナにマウントしているだけなので、`docker compose build` も `docker compose up -d --build` も **コンテナを作り直すだけでホスト側のファイルには触りません**。

:::message alert
**実行注意: `docker compose down -v` は named volume を削除する**

`-v` は named volume を消すフラグです。本構成はバインドマウントなので影響しませんが、別プロジェクトで named volume を使うときに混同しがちなので注意してください。
:::

## 4. CLI のタイムアウトは現実的な値に設定する

`child_process.spawn` の `timeout` オプションを使うとき、楽観的に 10 分などで切ると **本番のジョブが完了前に中断されることがあります**。

```ts
const TIMEOUT_MS = 600_000; // 10 minutes ← 短すぎ
```

### 1 ジョブの実時間内訳（4 beat ニュースの場合）

| ステージ | 内容 | 1 回の所要時間 | 回数 |
|---------|------|----------------|------|
| audio | OpenAI TTS で各 beat の音声生成 | 数秒〜30 秒 | 1 ジョブ |
| image | Gemini で各 beat の参照画像生成 | 10〜30 秒 | 4 beat |
| lipSync | Replicate `bytedance/omni-human` でアンカーが喋る動画 | **3〜10 分** | 3 beat |
| movie (B-roll) | Veo / Kling 等で挿入動画生成 | 1〜3 分 | 1 beat |
| compose | ffmpeg で字幕焼き込み + 連結 | 30〜60 秒 | 1 ジョブ |

**支配的なのは lip-sync**。Replicate のキュー待ちが乗ると 1 セグメントだけで 5〜10 分かかることもあり、4 beat 中 3 つで lip-sync を使うと **15〜30 分** が普通のレンジになります。10 分タイムアウトでは半数のジョブが失敗する計算です。

推奨は **30 分**です。

```ts
const TIMEOUT_MS = 1_800_000; // 30 minutes
```

### タイムアウトの兆候を見分ける

タイムアウトで中断されたときは、ログに次のようなパターンが出ます。

```
mulmo movie ... exited with code null: < audio > audio < image
  text2image: provider=google model=gemini-3-pro-image-preview
  { image __index__0 } image __index__0
  { movie __index__0
```

ここに 3 つの決定的なシグナルがあります。

1. **`exited with code null`** — Node.js `child_process.spawn` の `timeout` オプションは、設定時間で **SIGTERM を送って子プロセスを終了**させます。SIGTERM で終了すると exit code は `null` になります。
2. **ログが `{ movie __index__0` で途切れている** — Replicate の動画生成 API を呼び出した瞬間に止まっています。
3. **発生時刻が 10 分前後に集中している** — コード上の `TIMEOUT_MS = 600_000` と一致。

**勘違いしがちな切り分け**:

- ❌ Express のリクエストタイムアウト → Express は jobId を返した時点で HTTP レスポンス完了済み
- ❌ Replicate API 側のタイムアウト → mulmo が `await` で待っている限り Replicate はタイムアウトせず待ち続ける
- ❌ ALB（AWS Application Load Balancer）の idle timeout → HTTP レイヤなので生成プロセスとは別軸
- ✅ `child_process.spawn` の `timeout` オプション → これだけが該当

### 本番コンテナで動いているコミットを確認できるようにする

Docker イメージにビルドされたコードと、リポジトリ上の最新コードが一致しているとは限りません（push 漏れ、ビルドキャッシュ、デプロイスクリプトの不具合等）。次の仕組みを入れておくと、「直したのに直っていない」を素早く切り分けられます。

- デプロイスクリプトで `git rev-parse HEAD` を取り、Docker イメージの ENV や `/build-info.txt` に焼き込む
- `/api/health` 等で commit hash を返し、本番が今どのコミットで動いているか即座に確認できるようにする
- `git status` がクリーンでない時はデプロイをブロックする

### ポイント

- **`exited with code null` + 途中ログで停止 = `child_process.spawn` の timeout による中断**。レイヤを取り違えると、Express や ALB のタイムアウト設定を疑って無駄に時間を使うことになります。
- **外部生成 API を直列で呼ぶ系は 30 分が現実的な下限**。API 側のキュー待ちが運悪く重なると、平均の 3 倍以上かかることがあります。
- タイムアウトで中断されたジョブも外部 API の課金は発生しているため、**短すぎる timeout は無駄なコストになります**。

## 5. EC2 ホスト側のリソース設定

ここからは Dockerfile ではなく **EC2 ホスト側** の話です。主に 2 つあります。

### 5.1. swap を設定する

t3.small / t3.medium クラスのインスタンスは **メモリが 2〜4GB しかなく、Amazon Linux 2 のデフォルトでは swap が設定されていません**。Node.js のビルド + Chromium 起動 + ffmpeg + 外部 API レスポンスのバッファが同時に走るとメモリが不足し、OOM Killer によってコンテナが停止することがあります。

swap ファイルを作っておきます。

```bash
# 4GB の swap ファイルを作成
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永続化（再起動後も有効）
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

ポイント: **メモリの小さいインスタンスで Docker + headless Chrome + Node を動かす場合、swap の設定を本番運用前に確認します**。ただし swap は遅いので、頻繁に使われるなら本来はインスタンスサイズを上げるべきサインです。

### 5.2. EBS の空き容量と、定期的なイメージクリーンアップ

chromium + libxxx 群はインストールサイズがかなり大きい（数百 MB 単位）ので、ビルドを重ねると EBS の空きをすぐに消費します。古い Docker イメージレイヤーが残ったまま新しいビルドを重ねていると、本番でだけ次のエラーが出ます。

```
ERROR: failed to solve: process "/bin/sh -c apt-get update && apt-get install -y ffmpeg chromium ..."
did not complete successfully: exit code: 100
→ No space left on device
```

ローカルでは通るのに本番でだけ落ちる典型的なパターンです。

```bash
# 不要イメージ・停止コンテナ・ダングリングレイヤーをまとめて削除
docker system prune -a -f
docker builder prune -a -f
```

推奨設定（**単一サービスを動かしているホストを前提**）:

- `scripts/deploy-backend.sh` 等の **デプロイスクリプトに `docker system prune -f` を入れて、毎回ビルド前に古いものを削る**
- EBS のサイズを増やす（8GB デフォルトはこの種のアプリには小さいので、**最低 30〜50GB** は欲しい）

:::message
**同一ホストで複数サービスを動かしている場合の注意**: `docker system prune -a -f` は他サービスの未使用イメージやキャッシュも削除します。共用ホストでは、対象のイメージタグを指定した `docker image prune` や、対象プロジェクトに絞ったクリーンアップに切り替えてください。
:::

ポイント: **「ローカルは通って本番だけ失敗する Docker build」では、最初にディスク容量を確認します**。次に CPU アーキテクチャ、続いてプロキシ・DNS・rate limit です。

## 6. CORS エラーが出たらサーバー生存確認を最初にする

これは Docker というより本番運用の話ですが、知っておくと運用デバッグの時間を節約できます。

本番デプロイ直後にブラウザで次のエラーが出ることがあります。

```
Origin https://mulmo-demo.pages.dev is not allowed by Access-Control-Allow-Origin.
Status code: 504
```

このケースでは CORS 設定を見直しても解決しません。原因は **「サーバーが 504 でタイムアウトしているので CORS ヘッダ自体が返っていない」** ためです。

ブラウザのフェッチ API は仕様上、**プリフライトを含むレスポンスに `Access-Control-Allow-Origin` が無いと「CORS エラー」として報告**します。サーバーがダウンしている / ALB やリバースプロキシが 504 を返している場合も、エラー文言は CORS の形をとります。

ポイント: **CORS エラーが突然出始めたら、まずはサーバー側の生存確認を疑う**。CORS 設定を弄り始めるのはその後です。

## まとめ — チェックリスト

MulmoCast CLI を Web サービスに組み込むときに確認したい項目をまとめました。

- [ ] Chrome 共有ライブラリ群 + `fonts-noto-cjk` を apt で入れた
- [ ] Dockerfile のシェル継続行の途中にコメントを書いていない
- [ ] 非 root ユーザーで起動している（`useradd -m appuser` + `USER appuser`）
- [ ] Puppeteer の自動 DL を切り、apt の `chromium` を使っている
- [ ] `ENV CI=true` で MulmoCast に `--no-sandbox` を付けさせている
- [ ] `tsc` 後にテンプレート / BGM / 画像 / news data / news scripts を `dist/` にコピーしている
- [ ] volume マウント先が `/app/dist/server/output`（コンパイル後パス）になっている
- [ ] CLI の timeout が外部 API 込みの現実的な値（30 分前後）になっている
- [ ] 本番コンテナで動いている commit hash が確認できる（`/api/health` で返す等）
- [ ] EC2 ホストに swap を設定している（t3.small/medium クラスはデフォルトで swap なし）
- [ ] EBS が十分に空いている（最低 30〜50GB 推奨）+ デプロイスクリプトに `docker system prune -f` を入れている
- [ ] CORS エラーが出たらまずサーバー生存確認（504 が CORS 風に見えるため）
- [ ] 外部依存（Replicate / OpenAI 等）を含まない最小再現スクリプトをプロジェクトに常備している

MulmoCast CLI を Web サービスに組み込む際は、この構成をベースに始めることを推奨します。Puppeteer + 外部生成 API + Docker の組み合わせ全般に応用できる内容なので、類似のサービスを作るときの参考にもなるはずです。

## 参考リンク

- [MulmoCast CLI (GitHub)](https://github.com/receptron/mulmocast-cli)
- [MulmoCast 公式サイト](https://mulmocast.com)
