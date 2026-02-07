---
title: "Claude Code 拡張機能の整理（Skills / Agents / Plugins / Agent Teams）"
emoji: "🔧"
type: "idea"
topics: ["claudecode", "claude", "ai", "開発環境"]
published: true
---

:::message
筆者の実体験をもとに Claude Code を活用して整理しました。公式ドキュメントと挙動が異なる場合は公式を優先してください。
:::

Claude Code の拡張機能（Slash Commands, Skills, Agents, Plugins）の違いがわかりにくかったので、実際に触りながら整理したメモです。

## 拡張機能の全体像

```
Plugin（配布パッケージ）
  ├── Skills（コマンドの上位互換）
  ├── Agents（カスタムエージェント）
  ├── Hooks（ライフサイクルフック）
  └── MCP サーバー

Agent Teams（実験的機能）
  └── 複数の Claude Code インスタンスが協調動作

それぞれ単体でも使える：
  ~/.claude/skills/        … 個人 Skill（全リポジトリ共通）
  ~/.claude/agents/        … 個人 Agent（全リポジトリ共通）
  .claude/skills/          … プロジェクト Skill
  .claude/agents/          … プロジェクト Agent
```

## Slash Commands vs Skills

| | Slash Commands | Skills |
|---|---|---|
| 場所 | `.claude/commands/name.md` | `.claude/skills/name/SKILL.md` |
| `/name` で手動呼び出し | ✅ | ✅ |
| Claude が自動判断で発動 | ❌ | ✅（`disable-model-invocation: true` で無効化可） |
| サポートファイル | なし（単一ファイル） | 同ディレクトリにリファレンス資料等を置ける |
| YAML frontmatter | サポート | サポート |
| Plugin に含められるか | ❌ | ✅ |

**結論: Skill を使うべき。** Slash Commands でできることは Skill ですべてできる上に、Plugin 化を見据えるなら最初から Skill で作っておくのが正解。

:::message
以前は Skill はユーザーが明示的に呼び出せず自動発動のみだったが、現在は `/name` で手動呼び出しも可能になっている。
:::

## YAML frontmatter

Skill（SKILL.md）に設定できる主なフィールド：

```yaml
---
name: translate-insights
description: レポートを日本語に翻訳しファイルに保存する
allowed-tools: Read, Write, Bash
model: sonnet
context: fork
maxTurns: 10
disable-model-invocation: true
---
```

| フィールド | 説明 |
|---|---|
| `description` | 何をするか。Claude の自動トリガー判断にも使われる |
| `allowed-tools` | この Skill 内で許可するツール |
| `model` | 使用モデル: `sonnet`, `opus`, `haiku` |
| `context` | `fork` で Sub-agent（別コンテキスト）実行 |
| `maxTurns` | 最大ターン数。`context: fork` 時の暴走防止に必須 |
| `disable-model-invocation` | `true` で自動発動を無効化（手動 `/name` のみ） |
| `hooks` | Skill がアクティブな間だけ有効な Hooks を定義（詳細は Hooks セクション参照） |

## Sub-agent とコンテキスト

### Sub-agent とは

**メインとは別のコンテキストで動くエージェント**のこと。バックグラウンドかどうかとは無関係。

```
メイン会話
  ├── Sub-agent（フォアグラウンド）→ 完了まで待つ。別コンテキスト。
  └── Sub-agent（バックグラウンド）→ 待たない。別コンテキスト。
```

### コンテキスト消費の仕組み

ここが一番重要なポイント。

| | メインのコンテキスト消費 |
|---|---|
| Sub-agent の内部処理（ファイル読み込み等） | **なし** |
| Sub-agent の戻り値 | **あり** |

つまり「大きなファイルを読んで処理し、結果だけ返す」場合にメインのコンテキストを大幅に節約できる。

**最も効率的なパターン: 結果をファイルに書き出して、返答は最小限に。**

### フォアグラウンド vs バックグラウンド

| 方式 | 待機 | コンテキスト消費 |
|---|---|---|
| フォアグラウンド | 完了まで待つ | 戻り値のみ |
| バックグラウンド（`run_in_background: true`） | 待たない | 戻り値のみ |
| 複数 Task 並列呼び出し | 全部完了まで待つ | 各戻り値 |

**フォアグラウンドでもバックグラウンドでもコンテキスト消費は同じ。** 違いは「待つかどうか」だけ。

## 組み込み Agent vs カスタム Agent

| | 組み込み Agent | カスタム Agent |
|---|---|---|
| 作る人 | Anthropic | ユーザー |
| 例 | Explore, Plan, general-purpose, Bash | `.claude/agents/*.md` に自分で定義 |
| できること | 汎用的 | 専用のプロンプト・ツール制限を設定可能 |

どちらも Sub-agent として動く。カスタム Agent は Skill の frontmatter で `context: fork` + `agent: my-agent` と指定して呼び出せる。

## Skill vs カスタム Agent の使い分け

どちらも `.claude/` 配下に `.md` ファイルで定義するが、役割が異なる。

| | Skill | カスタム Agent |
|---|---|---|
| 何を定義するか | **ワークフロー**（何をするか） | **人格・専門性**（どう振る舞うか） |
| 呼び出し方 | `/name` で直接実行 | Skill や Task から `agent: name` で指定 |
| 単体で使えるか | ✅ | ❌（Skill や Task 経由で呼び出す） |
| 自動発動 | ✅（`disable-model-invocation` で制御） | ❌ |
| 例 | `/session-review`, `/translate-insights` | `code-reviewer`, `debugger` |

**Skill = タスクの定義、Agent = 実行者の定義。**

実用的な組み合わせ例：

```
Skill: /review-pr（ワークフロー）
  └── Agent: code-reviewer（実行者）を context: fork で呼び出す

Skill: /debug-issue（ワークフロー）
  └── Agent: debugger（実行者）を context: fork で呼び出す
```

同じ Agent を複数の Skill から使い回せる点がポイント。Agent は「この専門家に聞きたい」、Skill は「この手順を実行したい」と考えるとわかりやすい。

### 実例: Agent を定義して Skill から呼ぶ

まず Agent を定義：

```markdown
<!-- .claude/agents/code-reviewer.md -->
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

次に Skill から呼び出す：

```markdown
<!-- .claude/skills/review-pr/SKILL.md -->
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
`git diff main...HEAD` で差分を取得し、レビュー結果を `.claude/reviews/` に保存してください。
```

`/review-pr` を実行すると、`code-reviewer` Agent が Sub-agent として起動し、メインコンテキストを消費せずにレビューが走る。

## Plugin を構成する4つの機能

Plugin に含められる4つの機能を、それぞれ詳しく見ていく。

### 1. Skills

前述の通り、Slash Commands の上位互換。YAML frontmatter でツール制限、モデル指定、Sub-agent 実行などを制御できる。詳細は上のセクションを参照。

### 2. Agents（カスタムエージェント）

`.claude/agents/*.md` に定義する専門化された AI アシスタント。組み込みの `general-purpose` や `Explore` では足りないときに、専用のシステムプロンプトやツール制限を付けて作る。

```yaml
---
name: code-reviewer
description: コードレビュー専門
tools: Read, Grep, Glob
model: sonnet
maxTurns: 15
---
あなたはシニアコードレビュアーです。
セキュリティ、パフォーマンス、可読性の観点でレビューしてください。
```

Skill から `context: fork` + `agent: code-reviewer` で呼び出せる。

### 3. Hooks（ライフサイクルフック）

特定のイベント発生時にシェルコマンドや LLM プロンプトを自動実行する仕組み。

**3つの hook タイプ：**

| タイプ | 説明 |
|---|---|
| `command` | シェルコマンドを実行 |
| `prompt` | LLM にプロンプトを送り yes/no 判定を取得 |
| `agent` | 複数ターンのツール利用ができる Sub-agent を起動 |

**主なイベント：**

| イベント | 発火タイミング | ブロック可能 |
|---|---|---|
| `SessionStart` | セッション開始時・再開時（matcher: `compact` でコンパクション後の再開を検知） | - |
| `UserPromptSubmit` | ユーザーがプロンプト送信時 | ✅ |
| `PreToolUse` | ツール呼び出し実行前 | ✅ |
| `PermissionRequest` | パーミッションダイアログ表示時 | - |
| `PostToolUse` | ツール呼び出し成功後 | - |
| `PostToolUseFailure` | ツール呼び出し失敗後 | - |
| `Notification` | 通知送信時 | - |
| `SubagentStart` | Sub-agent 起動時 | - |
| `SubagentStop` | Sub-agent 完了時 | - |
| `Stop` | Claude が応答終了時 | ✅ |
| `PreCompact` | コンテキストコンパクション前（matcher: `manual` or `auto`） | - |
| `TeammateIdle` | Agent Teams のチームメイトがアイドル時 | - |
| `TaskCompleted` | タスク完了時 | - |
| `SessionEnd` | セッション終了時 | - |

:::message
`PreCompact` は auto compact（コンテキスト満杯時の自動コンパクション）と `/compact` コマンドの両方で発火する。matcher で `auto` / `manual` を区別可能。コンパクション後のセッション再開は `SessionStart`（matcher: `compact`）で検知できる。
:::

**定義できる場所：**

| 場所 | スコープ |
|---|---|
| `~/.claude/settings.json` | 全プロジェクト |
| `.claude/settings.json` | プロジェクト |
| Skill の frontmatter | その Skill がアクティブな間だけ |
| Agent の frontmatter | その Agent がアクティブな間だけ |
| Plugin の `hooks/hooks.json` | Plugin が有効な間 |

```json
// settings.json での定義例
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit",
        "hooks": [
          {
            "type": "command",
            "command": "yarn lint --fix && yarn format || true"
          }
        ]
      }
    ]
  }
}
```

#### Hooks の深掘り: SessionEnd

SessionEnd はセッション終了時に発火するイベント。入力として以下の JSON を受け取る：

```json
{
  "session_id": "abc123",
  "transcript_path": "/path/to/transcript.jsonl",
  "cwd": "/current/working/dir",
  "permission_mode": "default",
  "hook_event_name": "SessionEnd",
  "reason": "prompt_input_exit"
}
```

**終了理由（reason）:**

| reason | トリガー |
|---|---|
| `prompt_input_exit` | `/exit` や Ctrl+D で終了 |
| `clear` | `/clear` でセッションクリア |
| `logout` | ログアウト |
| `bypass_permissions_disabled` | バイパスパーミッション無効化 |
| `other` | その他 |

**SessionEnd の制限:**

- **使えるフックタイプは `command` のみ**。`prompt` や `agent` は SessionEnd では動作しない
- セッション終了を**ブロックできない**（クリーンアップ用途のみ）
- デフォルトタイムアウトは 600秒（`timeout` フィールドで変更可）

**実用的な使い方:**

```bash
#!/bin/bash
# セッションログの記録
INPUT=$(cat)
SESSION_ID=$(echo "$INPUT" | jq -r '.session_id')
TRANSCRIPT=$(echo "$INPUT" | jq -r '.transcript_path')
REASON=$(echo "$INPUT" | jq -r '.reason')

{
  echo "Session: $SESSION_ID"
  echo "Reason: $REASON"
  echo "Turns: $(wc -l < "$TRANSCRIPT")"
  echo "Date: $(date)"
  echo "---"
} >> ~/.claude/session-log.txt
```

:::message
`transcript_path` にはセッション全体の JSONL ファイルのパスが入るので、セッションのターン数記録やアーカイブに使える。ただし SessionEnd から `claude -p`（headless mode）で AI 要約を生成する方法は、プロセス終了のタイミングや認証の有効性が不確定なため、現時点では非推奨。セッション要約は `/session-review` のような Skill で手動実行する方が確実。
:::

### 4. MCP サーバー

Model Context Protocol に準拠した外部サービス連携。Claude Code に外部ツール（DB 接続、API 呼び出し等）を追加できる。Plugin 内に `.mcp.json` として含められる。

## Plugin としてパッケージ化

上記4つをまとめて**配布可能な形にパッケージ化**したのが Plugin。

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/
│   └── review/SKILL.md
├── agents/
│   └── debugger.md
├── hooks/
│   └── hooks.json
└── .mcp.json
```

| | 個人 Skill（`~/.claude/skills/`） | Plugin |
|---|---|---|
| 管理場所 | ホームディレクトリに直置き | 独立したパッケージ |
| 共有 | 手動コピー | インストールで配布 |
| バージョン管理 | なし | あり |
| 含められるもの | Skill のみ | Skill + Agent + Hooks + MCP |

### Plugin 化の気づき

チームで共有したい設定は、**Plugin として GitHub リポジトリで管理**するのが良い。

- **組織用 Plugin repo** を作り、各リポジトリでインストール
  - 共通の PR レビュー Skill、lint hook、共通 Agent 等
- **個人用 Plugin repo** も作れば、マシン間の同期も楽
- Slash Commands は Plugin に含められないので、**最初から Skill で作っておく**

## Skill 作成の運用ルール

実際に運用してみてわかったこと：

1. **最初はフォアグラウンド**で作る（`context: fork` なし）
2. 動作確認・デバッグ
3. **安定したら Sub-agent 化**（`context: fork` + `maxTurns` 追加）
4. Sub-agent には「**結果はファイルに書き出し、返答は最小限に**」と指示する
5. `maxTurns` を必ず設定する

:::message
`maxTurns` を設定しないと、Sub-agent がタスク完了後に不要な確認作業を続けて暴走することがあった。10ターン程度で十分なケースが多い。
:::

## Agent Teams（実験的機能）

複数の Claude Code インスタンスがチームとして協調動作する新機能。デフォルトでは無効。

### 有効化

`settings.json` に環境変数を追加：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

表示モードも設定可能：

```json
{
  "teammateMode": "auto"
}
```

| モード | 動作 |
|---|---|
| `auto`（デフォルト） | tmux 内なら split panes、それ以外は in-process |
| `in-process` | メインターミナル内で全チームメイトを実行 |
| `tmux` | split-pane モードを強制 |

### Sub-agent との違い

| | Sub-agent | Agent Teams |
|---|---|---|
| 構造 | メイン → 子 の階層 | Team Lead + Teammates の対等構造 |
| コミュニケーション | 戻り値のみ | 共有タスクリスト + エージェント間メッセージング |
| コンテキスト | 親のコンテキストから fork | 各エージェントが独立したコンテキスト |
| コスト | 低い | 高い（複数インスタンス分のトークン消費） |

### 向いているユースケース

- **並列コードレビュー**: 複数ファイルを別々のエージェントが同時にレビュー
- **競合仮説デバッグ**: 異なるアプローチで同時に原因調査
- **大規模リファクタ**: モジュールごとに担当を分けて並列作業

### 制限事項

- セッションの再開（resume）不可
- 1セッションにつき1チームのみ
- 実験的機能のため API が変更される可能性あり

:::message
現時点では実験的機能。多くのケースでは Sub-agent で十分であり、Agent Teams は「エージェント同士が独立して判断しながら協調する必要がある」場合に検討する。
:::

## まとめ

| 使いたい場面 | 使うもの |
|---|---|
| 個人で定型操作を自動化 | Skill |
| 専門的な AI アシスタントを定義 | カスタム Agent |
| ツール実行時に自動で処理を走らせたい | Hooks |
| 外部サービスと連携したい | MCP サーバー |
| チームで共有・各リポジトリに適用 | Plugin（GitHub 管理） |
| コンテキスト節約が必要な重い処理 | `context: fork` で Sub-agent 化 |
| エージェント同士の独立した協調作業 | Agent Teams（実験的） |

## 参考

- [Claude Code Skills ドキュメント](https://code.claude.com/docs/en/skills.md)
- [Claude Code Sub-agents ドキュメント](https://code.claude.com/docs/en/sub-agents.md)
- [Claude Code Plugins ドキュメント](https://code.claude.com/docs/en/plugins.md)
- [Claude Code Agent Teams ドキュメント](https://code.claude.com/docs/en/agent-teams)
