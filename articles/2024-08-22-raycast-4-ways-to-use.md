---
title: "今日から使える！Raycast 4つの活用法"
emoji: "⏳"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [raycast]
published: false
publication_name: raycast_jp
---

2024年8月22日に開催された [Raycast Meetup Japan #0](https://raycast.connpass.com/event/326949/) の発表「今日から始める Happy Hacking Raycast Life」から Raycast の4つの活用方法を抜粋して紹介します。

この記事では発表資料から抜粋して紹介するため、詳細については当日の発表資料を参考にしていただけると幸いです。

## 発表資料
@[slideshare](1Y9U74QH5nb9nv)

**目次**
1. Intro
2. Settings
3. Basic Commands
4. Clipboard History
5. Window Management
6. Snippets
7. QuickLinks
8. Summery
9. Q&A

## Clipboard History - p.23〜
コピーした項目を自動的に保存し、簡単にアクセスできるようにする機能です。テキストだけでなく、画像、ファイルなども対象です。Type（テキスト、画像ファイル等）を絞って素早く検索することができます。

**まとめ（スライドより抜粋）**
- 検索機能: 任意のテキストで絞り込み
- Type機能: テキスト、ファイル、画像、リンク、色で絞り込み

## Window Management - p.30〜
キーボードショートカットでアプリケーションウィンドウを素早く整理できます。ディスプレイの特定の位置や大きさにウィンドウをスナップさせたり、複数のウィンドウを同時に並べたりすることが可能です。これにより、デスクトップを整理し、マルチタスクの効率を高めることができます。

**まとめ（スライドより抜粋）**
- Window Management: 指定した幅、位置にWindow を移動
- Cycling: 繰り返しで1/2,2/3,1/3分割

## Snippets - p.36〜
頻繁に使用するテキストや画像を保存し、すぐに呼び出すことができます。
例えば、メールの署名、コードの一部、よく使うフレーズなどを保存しておけば、タイピング時間を節約し、一貫性がある文章を書くことができます。変数を使用して動的なスニペットを作成することも可能です。

**まとめ（スライドより抜粋）**
- Snippets: 任意の key-value を登録し、呼び出せる
- 基本機能: 繰り返しや覚えるのが面倒な静的な値を登録
  - 正式名称
    - key: aivia
    - value： 株式会社 AIVIA
  - メールアドレス
    - key: sample
    - value: sample@gmail.com
  - 電話番号
    - key: 080
    - value: 08012345678
  - その他、PRコメントのラベル、横線（メール等で利用）の例がスライドで紹介されています。
- 応用機能: シーンに合わせて内容が変わる動的な値を登録
  - スライド 41-42 ページを参照
  - 日付
    - key: /date
    - value: 2024/08/23
  - その他、時刻、メール、commit message、SQL の例がスライドで紹介されています。

## QuickLinks - p.45〜
よく訪れるウェブサイトやアプリケーション内の特定のページに素早くアクセスできます。
ブックマークのようなものですが、Raycast から直接起動できるため、ブラウザを開いてブックマークを探す手間が省けます。
また、選択した部分をGoogle で検索する、よく使うフォルダを Finder で開く、特定のリポジトリを VS Code で開くといったこともできます。

**まとめ（スライドより抜粋）**
- QuickLinks: 任意のLink、アプリ、ディレクトリへ遷移
- 基本: 任意のブラウザ、LLM等にクエリと選択した値で検索
  - Google 検索
    - Link: `https://google.com/search?q=f{Query}`
  - 英語で検索
    - Link: `https://www.google.com/search?q={argument name="keyword"}&gl=us&hl=en&gws_rd=cr&pws=0`
  - 選択した文字
    - `{Query}` → `{selection}` に変更
- 応用: アプリで特定のフォルダを開く
  - フォルダを設定
    - ダウンロードフォルダ を Finder で開く
      - Link：`~/Downloads`
      - Open with: `Finder`
  - 特定のリポジトリを開く
    - Link：`適当なリポジトリのディレクトリ`
    - Open with: `Visual Studio Code` 等のIDE

## そのほかの発表資料はこちら
https://zenn.dev/raycast_jp/articles/2024-08-22-raycast-japan-presentaion-material
