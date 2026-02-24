---
title: "Claude Code プラグイン開発時にローカルで動作確認する方法"
emoji: "🔌"
type: "tech"
topics: [claudecode, plugin, cli, development, agentskills]
published: true
publication_name: singularity
---

:::message
筆者の実体験をもとに Claude を活用して整理しました。
:::

Claude Code のプラグイン（Skill）を開発しているとき、変更を main にマージする前にローカルで動作確認したいことがあります。`--plugin-dir` オプションを使えばローカルのプラグインを読み込めますが、マーケットプレイスからインストールした同名プラグインと競合する問題に遭遇したので、対処法をまとめました。

## 前提

- Claude Code CLI がインストール済み
- プラグインをマーケットプレイスからインストール済み
- 同じプラグインのソースコードをローカルに持っている

## `--plugin-dir` だけでは正しく動かないケース

Claude Code にはプラグインをローカルディレクトリから読み込む `--plugin-dir` オプションがあります。

```bash
claude --plugin-dir /path/to/my-plugin
```

しかし、マーケットプレイスから同名のプラグインを既にインストールしている場合、**ローカル版とグローバル版の両方が読み込まれてしまいます**。

スラッシュコマンドの一覧を見ると、同じ Skill が2つ表示されます。

```
/story  (mulmocast) Create high-quality MulmoScript...
/story  (mulmocast) Create high-quality MulmoScript...
```

これではどちらの `/story` が実行されるか不明確で、古いグローバル版が使われる可能性があります。

## 対処法：グローバル版を一時的に無効化する

`~/.claude/settings.json` の `enabledPlugins` で該当プラグインを `false` に設定してから `--plugin-dir` で起動します。

### 手順

**1. `~/.claude/settings.json` を編集**

```json
{
  "enabledPlugins": {
    "mulmocast@mulmocast-plugins": false
  }
}
```

`true` → `false` に変更します。

**2. ローカル版で起動**

```bash
claude --plugin-dir /path/to/my-plugin
```

これでローカルのプラグインだけが読み込まれ、`/story` が1つだけ表示されます。

**3. 確認後、元に戻す**

```json
{
  "enabledPlugins": {
    "mulmocast@mulmocast-plugins": true
  }
}
```

## まとめ

| 状況 | 方法 |
|------|------|
| マーケットプレイス版を使う（通常） | そのまま `claude` を起動 |
| ローカル版で確認したい | グローバル版を `false` → `--plugin-dir` で起動 → 確認後に `true` に戻す |

ちょっとした手間ですが、PR マージ前に Skill の動作を確認できるので、プラグイン開発時には覚えておくと便利です。
