---
title: "Claude Code Plugin の作り方と配布方法"
emoji: "📦"
type: "tech"
topics: ["claudecode", "claude", "ai", "開発環境"]
published: true
publication_name: singularity
---

:::message
公式ドキュメントをもとに Claude Code を活用して整理しました。公式ドキュメントと挙動が異なる場合は公式を優先してください。
:::

Claude Code の Plugin を作成し、GitHub 経由でチームに配布する方法をまとめました。

## Plugin とは

Skills / Agents / Hooks / MCP サーバーをまとめて**配布可能なパッケージ**にしたもの。GitHub リポジトリとして管理し、チームの各プロジェクトにインストールできる。

| アプローチ | Skill 名 | 向いているケース |
|---|---|---|
| スタンドアロン（`.claude/` 直置き） | `/hello` | 個人ワークフロー、実験 |
| Plugin | `/plugin-name:hello` | チーム共有、複数プロジェクト横断 |

:::message
Plugin の Skill はネームスペース付き（`/plugin-name:skill-name`）になる。複数 Plugin 間の名前衝突を防ぐ仕組み。
:::

## Plugin のディレクトリ構造

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        ← Plugin のメタデータ（必須）
├── skills/
│   └── review/
│       └── SKILL.md       ← Skill 定義
├── agents/
│   └── reviewer.md        ← カスタム Agent 定義
├── hooks/
│   └── hooks.json         ← Hooks 定義
├── .mcp.json              ← MCP サーバー設定
└── .lsp.json              ← LSP サーバー設定
```

:::message
`skills/`, `agents/`, `hooks/` は `.claude-plugin/` の**外**（Plugin ルート直下）に置く。`.claude-plugin/` の中に入れるのは `plugin.json` のみ。
:::

## Plugin の信頼性について

公式 Marketplace（`claude-plugins-official`）は Claude Code 起動時に自動で利用可能になり、`/plugin` の **Discover** タブからブラウズできる。ただし、公式 Marketplace にはコミュニティからの Plugin も含まれており、**Anthropic はその中身を検証していない**と明言している。

> Make sure you trust a plugin before installing it. Anthropic does not control what MCP servers, files, or other software are included in plugins and cannot verify that they work as intended.

| Marketplace | 利用方法 | Anthropic による検証 |
|---|---|---|
| 公式（`claude-plugins-official`） | 最初から利用可能 | **されていない** |
| サードパーティ（チーム作成含む） | `marketplace add` で手動追加 | されていない |

Plugin は MCP サーバーや Hooks（シェルコマンド実行）を含められるため、**信頼できないソースの Plugin はインストールしないこと**。チームで Plugin を自作する場合は内容を把握できるので安全だが、外部の Plugin を導入する際は中身を確認してからインストールすべき。

## Step 1: GitHub リポジトリに Plugin を作る

例として、チーム共通のレビュー Skill・Agent・Hooks を持つ Plugin を作る。

```bash
# GitHub にリポジトリを作成（例: my-org/my-team-plugin）
gh repo create my-org/my-team-plugin --private
git clone git@github.com:my-org/my-team-plugin.git
cd my-team-plugin
```

### ディレクトリ構造を作る

```bash
mkdir -p .claude-plugin skills/review-pr agents hooks
```

### plugin.json（必須）

```json
// .claude-plugin/plugin.json
{
  "name": "my-team-plugin",
  "description": "チーム共通の Skill・Agent・Hooks",
  "version": "1.0.0",
  "author": {
    "name": "Team Name"
  }
}
```

| フィールド | 説明 |
|---|---|
| `name` | Plugin の ID。Skill のネームスペースにもなる |
| `description` | Plugin 管理画面に表示される説明 |
| `version` | セマンティックバージョニング |

### Skill を追加する例

```markdown
<!-- skills/review-pr/SKILL.md -->
---
name: review-pr
description: PR のコードレビューを実行する
allowed-tools: Read, Grep, Glob, Bash, Write
context: fork
agent: code-reviewer
model: sonnet
maxTurns: 15
disable-model-invocation: true
---
現在のブランチの差分をレビューしてください。
```

### Agent を追加する例

```markdown
<!-- agents/code-reviewer.md -->
---
name: code-reviewer
description: コードレビュー専門
tools: Read, Grep, Glob
model: sonnet
maxTurns: 15
---
あなたはシニアコードレビュアーです。
セキュリティ、パフォーマンス、可読性の観点でレビューしてください。
結果はファイルに書き出し、返答は最小限にしてください。
```

### Hooks を追加する例

```json
// hooks/hooks.json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "yarn lint --fix || true"
          }
        ]
      }
    ]
  }
}
```

### push する

```bash
git add -A && git commit -m "Initial plugin setup"
git push origin main
```

これで `my-org/my-team-plugin` リポジトリに Plugin が完成。

## Step 2: ローカルでテストする

push 前にローカルでテストしたい場合は、`--plugin-dir` フラグで直接読み込める。

```bash
claude --plugin-dir ./my-team-plugin
```

動作確認:

```
/my-team-plugin:review-pr    ← Skill の実行
/agents                      ← Agent が表示されるか確認
```

複数 Plugin を同時にテストする場合:

```bash
claude --plugin-dir ./plugin-one --plugin-dir ./plugin-two
```

## Step 3: Marketplace を作って配布する

Plugin を他の人にインストールしてもらうには、**Marketplace**（Plugin のカタログ）が必要。

### Marketplace のディレクトリ構造

```
my-marketplace/                  ← GitHub リポジトリ
├── .claude-plugin/
│   └── marketplace.json         ← カタログ定義
└── plugins/
    ├── review-plugin/           ← Plugin A
    │   ├── .claude-plugin/
    │   │   └── plugin.json
    │   ├── skills/
    │   └── agents/
    └── lint-plugin/             ← Plugin B
        ├── .claude-plugin/
        │   └── plugin.json
        └── hooks/
```

### marketplace.json

```json
{
  "name": "my-team-tools",
  "owner": {
    "name": "Team Name"
  },
  "plugins": [
    {
      "name": "review-plugin",
      "source": "./plugins/review-plugin",
      "description": "コードレビュー Skill と Agent"
    },
    {
      "name": "lint-plugin",
      "source": "./plugins/lint-plugin",
      "description": "ファイル編集時の自動 lint"
    }
  ]
}
```

Plugin を別リポジトリで管理している場合は、`source` に GitHub リポジトリを指定できる:

```json
{
  "name": "review-plugin",
  "source": {
    "source": "github",
    "repo": "my-org/review-plugin"
  }
}
```

### GitHub に push する

Marketplace リポジトリを GitHub に push すれば配布準備完了。

## Step 4: チームメンバーがインストールする

### 手動インストール

`/plugin marketplace add` の引数は GitHub の `owner/repo` 形式。

```
/plugin marketplace add my-org/my-marketplace
```

これにより GitHub リポジトリをクローンし、`.claude-plugin/marketplace.json` を読んでカタログに登録する（この時点では Plugin はまだインストールされない）。

次に、カタログから個別の Plugin をインストールする:

```
/plugin install review-plugin@my-team-tools
```

### Plugin の更新

Marketplace の GitHub リポジトリを更新しても、各ユーザーの環境には**自動では反映されない**。

| 方法 | やり方 |
|---|---|
| 手動更新 | `/plugin marketplace update marketplace-name` |
| 自動更新 | `/plugin` → Marketplaces タブ → 対象を選択 → **Enable auto-update** |

:::message
自動更新（auto-update）は各ユーザーが自分の環境で Marketplace ごとに有効化する設定。Anthropic 公式 Marketplace はデフォルト有効だが、**チームが作った Marketplace を含むサードパーティはデフォルト無効**。チームでは「Marketplace 追加後に auto-update を有効にする」と周知しておくのが良い。
:::

### プロジェクト単位で自動化する

各リポジトリの `.claude/settings.json` に Marketplace と Plugin を設定できる。チームメンバーがリポジトリを trust した時点で自動的にインストールを促される。

**リポジトリごとに異なる Plugin を指定できる**ため、プロジェクト固有のワークフローを Plugin として配布できる。

```json
// repo-a/.claude/settings.json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "my-org/my-marketplace"
      }
    }
  },
  "enabledPlugins": {
    "review-plugin@my-team-tools": true,
    "frontend-tools@my-team-tools": true
  }
}
```

```json
// repo-b/.claude/settings.json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": {
        "source": "github",
        "repo": "my-org/my-marketplace"
      }
    }
  },
  "enabledPlugins": {
    "review-plugin@my-team-tools": true,
    "backend-tools@my-team-tools": true
  }
}
```

| 設定 | 説明 |
|---|---|
| `extraKnownMarketplaces` | Marketplace の登録。trust 時にインストールを促す |
| `enabledPlugins` | デフォルトで有効にする Plugin。リポジトリごとに変えられる |

同じ Marketplace から、リポジトリに応じて必要な Plugin だけを選んで有効化できる。

## 既存の .claude/ 設定を Plugin に変換する

既にプロジェクトの `.claude/` に Skill や Agent がある場合、そのまま Plugin 化できる。

```bash
# 1. Plugin ディレクトリ作成
mkdir -p my-plugin/.claude-plugin

# 2. plugin.json 作成
echo '{
  "name": "my-plugin",
  "description": "Migrated from standalone configuration",
  "version": "1.0.0"
}' > my-plugin/.claude-plugin/plugin.json

# 3. 既存ファイルをコピー
cp -r .claude/skills my-plugin/
cp -r .claude/agents my-plugin/

# 4. Hooks を移行（settings.json → hooks/hooks.json）
mkdir my-plugin/hooks
# settings.json の "hooks" オブジェクトを hooks/hooks.json にコピー

# 5. テスト
claude --plugin-dir ./my-plugin
```

| 移行前（`.claude/`） | 移行後（Plugin） |
|---|---|
| 1プロジェクトでのみ利用可能 | Marketplace 経由で配布可能 |
| `.claude/skills/` | `plugin-name/skills/` |
| `settings.json` 内の Hooks | `hooks/hooks.json` |
| 手動コピーで共有 | `/plugin install` でインストール |

## 運用パターン

### 組織用 Marketplace リポジトリ

```
my-org/claude-plugins/           ← Marketplace リポジトリ
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    ├── review-plugin/           ← 全プロジェクト共通のレビュー
    ├── lint-plugin/             ← 共通の lint hooks
    └── onboarding-plugin/       ← 新メンバー向け Skill
```

### 個人用 Marketplace リポジトリ

```
my-user/my-claude-plugins/       ← 個人の Marketplace
├── .claude-plugin/
│   └── marketplace.json
└── plugins/
    ├── session-tools/           ← session-review, session-to-zenn
    └── translate-tools/         ← translate-insights
```

マシン間の同期も GitHub 経由で楽になる。

## 参考

- [Create plugins](https://code.claude.com/docs/en/plugins)
- [Discover and install plugins](https://code.claude.com/docs/en/discover-plugins)
- [Create and distribute a plugin marketplace](https://code.claude.com/docs/en/plugin-marketplaces)
- [Plugins reference](https://code.claude.com/docs/en/plugins-reference)
