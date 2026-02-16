---
title: "Claude Code Skills でリリースノートから告知まで自動化"
emoji: "📋"
type: "idea"
topics: ["claudecode", "claude", "ai", "自動化"]
published: true
publication_name: singularity
---

:::message
筆者の実体験をもとに Claude Code を活用して整理しました。
:::

[MulmoCast](https://mulmocast.com)（デスクトップアプリ）のリリースノート作成から X・Discord・YouTube・Zenn への告知まで、Claude Code の Skills[^1] で自動化しました。本記事では、作成したスキルの構成と、手順書を書く際のポイントを紹介します。

[^1]: Skills の詳細は前回の記事を参照: [Claude Code 拡張機能の整理](https://zenn.dev/singularity/articles/2026-02-07-claude-code-extensibility-memo)

# 1. リリース作業の概要

MulmoCast のリリースでは毎回以下の作業が発生します。

1. PR 一覧の調査とリリースノート作成
2. X（Twitter）投稿ドラフトの作成とスクリーンショット撮影
3. リリース紹介動画用の MulmoScript 作成
4. Discord への告知投稿
5. GitHub Release の作成
6. YouTube メタデータの準備
7. Zenn 記事の生成

手順は決まっていますが、ファイル命名規則やフォーマット、環境変数の確認など細かいルールがあり、手動だと抜け漏れが起きやすい作業です。

# 2. 作成したスキル

リリースワークフロー用に 8 つのスキルを作成しました。

| スキル | 役割 |
|--------|------|
| `/release` | オーケストレーター（全体の進行管理） |
| `/release-notes` | PR要約 + リリースノート作成 |
| `/release-xpost` | X投稿ドラフト + スクリーンショット撮影 |
| `/release-script` | 動画用 MulmoScript 作成 |
| `/release-tag` | GitHub Release 作成 |
| `/discord-release` | Discord webhook 投稿 |
| `/release-youtube` | YouTube メタデータ作成 |
| `/release-zenn` | Zenn 記事生成 |

オーケストレーターの `/release` が以下の順で各スキルを実行します。

```
Phase 1: リリースノート作成    → /release-notes
Phase 2: X投稿ドラフト作成    → /release-xpost
Phase 3 (並行):
  ├─ MulmoScript作成         → /release-script
  ├─ Discord 投稿            → /discord-release
  ├─ GitHub Release作成      → /release-tag
  ├─ YouTube メタデータ作成  → /release-youtube
  └─ Zenn 記事作成           → /release-zenn
Phase 4: アーカイブ（zip化）
```

`/release 1.0.11` と実行すると、Phase 1 から順に進みます。各フェーズの完了後にユーザー確認を挟むため、勝手に次へ進むことはありません。

# 3. スキルの書き方

Skills は `.claude/skills/スキル名/SKILL.md` にマークダウンで手順を書きます。

書き方のコツは、後輩や後任に業務を引き継ぐときの手順書と同じです。「前回のリリースタグを確認して」「PR一覧を取得して」「カテゴリに分類して」——普段自分がやっている作業をそのまま書き出すだけで、AI がその通りに実行してくれます。

## 3.1. release-notes の例（抜粋）

```markdown
### Step 1: 前回リリースのタグを特定
gh release list --limit 5

### Step 2: PR一覧の取得
gh pr list --search "is:merged merged:>2026-01-01" --json title,number,body

### Step 3: カテゴリ分類
PRをカテゴリに分類し、ユーザー向けリリースノートを作成する:
- 新機能
- 改善
- バグ修正
- 内部改善
```

プログラミングは不要で、日本語の手順書がそのまま AI への指示になります。

## 3.2. discord-release の例（抜粋）

```markdown
### Step 1: 環境変数の確認
echo "${DISCORD_WEBHOOK_URL:?DISCORD_WEBHOOK_URL is not set}"

設定されていない場合は **STOP** してユーザーに設定を依頼する。

### Step 5: Discord webhook で投稿
JSON=$(jq -n \
  --arg title "MulmoCast v<version>" \
  --arg url "$RELEASE_URL" \
  --arg desc "$MESSAGE" \
  '{embeds: [{title: $title, url: $url, description: $desc, color: 5814783}]}')

curl -s -o /dev/null -w "%{http_code}" \
  -H "Content-Type: application/json" \
  -d "$JSON" \
  "$DISCORD_WEBHOOK_URL"
```

# 4. ポイント

## 4.1. 確認ポイントの明示

AI に任せきりにしない箇所を手順書に書いておきます。

```markdown
**ユーザー確認ポイント**:
- PR要約のカテゴリ分類は正しいか
- リリースノートの内容は正確か

✅ 確認が取れたら Phase 2 へ進む。
```

## 4.2. 環境変数の利用

webhook URL やディレクトリパスはスキル内にハードコードせず、環境変数から取得します。

```bash
echo "${DISCORD_WEBHOOK_URL:?DISCORD_WEBHOOK_URL is not set}"
echo "${ZENN_CONTENT_DIR:?ZENN_CONTENT_DIR is not set}"
```

`.env` で管理し、設定されていない場合は早期に停止させます。

## 4.3. 過去の成果物をテンプレートにする

毎回ゼロから作るのではなく、前回の成果物を参照させます。

```markdown
### Step 2: 既存スクリプトの参照
ls docs/release_notes/v*/release_v*_script.json

最新のスクリプトを読み込み、パラメータ部分をテンプレートとして使用する。
```

## 4.4. ファイル命名規則の明文化

暗黙のルールを手順書に書き出しておきます。

```markdown
**ファイル名ルール**: バージョンのドットをアンダースコアに変換
（例: 1.0.11 → release_v1_0_11_script.json）
```

# 5. 実行しながら改善する

最初から完璧な手順書は書けません。v1.0.11 のリリース作業中に以下の改善をスキルに反映しました。

- 動画スクリプトの冒頭が機能の羅列になりがちだったため、サマリーの書き方ガイドを追加
- Zenn 記事の生成手順を `/release-zenn` として切り出し
- 出力ファイルの zip アーカイブを Phase 4 として追加

手順書を書く → 実行する → 改善する、のサイクルで回していきます。

# 6. まとめ

8 つのスキルを作成し、`/release 1.0.11` でリリースノート作成から Zenn 記事生成まで一連の作業を進められるようになりました。Skills はマークダウンで手順を書くだけなので、繰り返し行う定型作業があれば試してみてください。
