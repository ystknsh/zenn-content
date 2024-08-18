---
title: "指定したプロファイル(Google Chrome)でURLを開く方法（Mac & Raycast & Chrome）"
emoji: "🔰"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["Raycast", "googlechrome", "mac"]
published: true
publication_name: raycast_jp
---

Raycast[^1] を利用して、指定したプロファイル(Google Chrome)でURLを開く方法を紹介します。 
この方法を使えば、複数のChromeプロファイルを使い分けている場合でも、ワンアクションで目的のウェブページを開くことができます。

[^1]: Raycast (Mac 向け Launcher アプリ)
      https://www.raycast.com

# スクリプト概要
Raycast の Scripts Commands 機能を利用します。  
まずは、スクリプトの全体を紹介します。

```bash
#!/bin/bash

# Required parameters:
# @raycast.schemaVersion 1
# @raycast.title Open Toggl wih Chrome
# @raycast.mode silent

# Optional parameters:
# @raycast.icon 🌐

# Set Chrome URL and Profile name for launching
URL="https://track.toggl.com/timer"
PROFILE="Profile 2"

open -na "Google Chrome" --args --profile-directory="$PROFILE" "$URL"
```

# ポイント
## Raycast コマンド名 
この部分が Raycast でのコマンド名になります。

```bash
# @raycast.title Open Toggl wih Chrome
```

![](/images/raycast_chrome/raycast_command.png)

## URLとプロファイル
開きたいURLとプロファイルを設定します。

```bash
# Set Chrome URL and Profile name for launching
URL="https://track.toggl.com/timer"
PROFILE="Profile 2"
```
## プロファイルの確認方法
指定したいプロファイルのChrome の検索窓に `chrome://version/` と入力します。  
`プロフィールパス`の最後が目的のプロファイル番号です。えこの図では `Profile 2` となっております。

![](/images/raycast_chrome/chrome_profile.png)

## Chrome 起動コマンド
この行が実際にChromeを起動するコマンドです。  

```bash
open -na "Google Chrome" --args --profile-directory="$PROFILE" "$URL"
```
# 参考文献
## Scripts Commands の設定方法
https://qiita.com/caslinden/items/7c7834df2cdb2e2e2c99#raycastでのスクリプトコマンド