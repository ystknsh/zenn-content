---
title: "GitHub Pages のドキュメントにデモ動画を埋め込む際の注意点（captions / poster）"
emoji: "🎬"
type: "tech"
topics: [github, video, 字幕]
published: true
publication_name: singularity
---

:::message
筆者の実体験をもとに Claude Code を活用して整理しました。ffmpeg の挙動は手元で実測した結果を載せています。
:::

[MulmoTerminal](https://github.com/receptron/mulmoterminal) は、複数の AI コーディングエージェントを並列に動かすターミナルアプリです。その 90 秒のデモ動画を、リポジトリの README と、GitHub Pages で公開しているユーザーガイドの両方に載せました。

同じ動画なのに、置き方は最後まで揃いませんでした。README は URL を 1 行貼るだけで終わり、Pages 側は mp4 をリポジトリにコミットして `<video>` タグを手で書くことになりました。

GitHub が README で描画するプレイヤーには、属性を渡す手段がありません。プレイヤー内字幕もサムネイルも指定できないので、そのどちらかが要るなら、動画ファイルは自分のリポジトリに置くことになります。この記事は、**GitHub Pages 等の静的サイトに動画を埋め込む人**を対象に、その分かれ目と、Pages 側でやることになった作業をまとめたものです。

## 2 つの置き方の違い

| | README | GitHub Pages のガイド |
|---|---|---|
| 書き方 | `https://github.com/user-attachments/assets/<uuid>` を 1 行だけ書く | Markdown 内に `<video>` タグを直書き |
| 動画ファイルの置き場所 | GitHub のアタッチメント置き場 | リポジトリ内（`docs/guide/videos/`） |
| プレイヤー内字幕（`<track>`） | 指定できない | 指定できる |
| サムネイル（`poster`） | 指定できない | 指定できる |
| ファイルの中身の調整 | 制御できない | できる（`+faststart` など） |
| ナレーションの読み物 | `<details>` にテキストで併記 | `<track>` に加えて `<details>` も併記 |

MulmoTerminal ではガイドが英語版と日本語版に分かれているので、mp4 と字幕も言語ごとに 2 本ずつ用意しました。README に載せているのは英語版の 1 本だけです。

## README 側: URL を 1 行貼るだけ

GitHub は、`https://github.com/user-attachments/assets/...` という形式の URL が Markdown の行に単独で置かれていると、それをインラインのプレイヤーとして描画します。README の `## Demo` はこれだけです。

```markdown
## Demo

https://github.com/user-attachments/assets/0b8dd582-6c0d-4be3-b0b4-3740ad0bdba6
```

この URL は、issue や PR のコメント欄に動画ファイルをドラッグ＆ドロップすると発行されます。楽な代わりに、運用で気をつけることが 2 つ出てきました。

1 つは、**発行された URL の控えを残しておかないと後から追跡できなくなる**ことです。MulmoTerminal では、動画を貼るために起票した issue（`docs(readme): embed the launch demo videos (en/ja)`）をそのまま URL の保管場所にしています。クローズはしていますが削除はしていません。英語版・日本語版 2 本の URL がその本文に並んでいます。

もう 1 つは、プレイヤーとして描画されるのが GitHub 上で表示したときだけ、という点です。同じ Markdown を npm のパッケージページやローカルの Markdown ビューアで開けば、ただのリンクとして表示されます。README を他所でも読ませる前提なら、ここは織り込んでおく必要があります。

## 字幕（`<track>`）を付けられるのは Pages 側だけ

GitHub が描画するプレイヤーには、`<track kind="captions">` を渡す手段がありません。裸の URL を 1 行置くだけの記法なので、属性を差し込む場所がありません。

では自分で `<video>` タグを書けばよさそうなものですが、これも通りません。GitHub の Markdown API（`POST /markdown`）に通すと、サニタイズで丸ごと消えます。

```
入力:
<video src="a.mp4" controls poster="p.png"><track kind="captions" src="a.vtt" srclang="en"></video>
<img src="p.png" alt="poster">

出力:
<p></p>
<p><a href="p.png"><img src="p.png" alt="poster" style="max-width: 100%;"></a></p>
```

`<video>` と `<track>` は空の `<p>` になり、`<img>` は残ってリンクまで付きます。README で動画の見た目を制御する手段は無い、ということです。

一方 GitHub Pages は自前の HTML をそのまま配信します。MulmoTerminal のガイドは GitHub Actions 上の Jekyll 4 + just-the-docs でビルドしていますが、特別なことはしていません。Markdown ファイル（`docs/guide/en/index.md`）の中に `<video>` タグをそのまま書いています。

```html
<video controls playsinline preload="metadata" poster="../videos/launch-demo-poster.png" style="width: 100%; max-width: 900px; border-radius: 6px;">
  <source src="../videos/launch-demo-en.mp4" type="video/mp4">
  <track kind="captions" src="../videos/launch-demo-en.vtt" srclang="en" label="English">
  <a href="../videos/launch-demo-en.mp4">Watch the demo (MP4, 3.3 MB)</a> — this browser can't play it inline.
</video>
```

`src` が `../videos/...` の相対パスなのは、このページが `guide/en/` に置かれているからです。ページの階層を動かせばリンクが切れるので、動画は言語ページの隣ではなく共通の 1 箇所（`docs/guide/videos/`）にまとめました。

| ファイル | サイズ | 用途 |
|---|---|---|
| `launch-demo-en.mp4` | 3.3 MB | 英語ナレーション（1:32） |
| `launch-demo-en.vtt` | 1.4 KB | 上の WebVTT 字幕 |
| `launch-demo-ja.mp4` | 3.4 MB | 日本語ナレーション（1:34、映像は同一） |
| `launch-demo-ja.vtt` | 1.8 KB | 上の WebVTT 字幕 |
| `launch-demo-poster.png` | 315 KB | 両言語共通のサムネイル |

WebVTT は難しい形式ではありません。先頭行が `WEBVTT` で、あとは「開始 --> 終了」と本文の繰り返しです。

```
WEBVTT

1
00:00:01.000 --> 00:00:05.992
When you ran one coding agent, the slowest thing in the room was the agent.
```

字幕を付けられない README 側では、ナレーションの全文を `<details>` ブロックにテキストで併記しました。プレイヤーに載らないなら、折りたたみの読み物として置けばいい、という割り切りです。Pages 側にも同じ `<details>` があるので、こちらは字幕とテキストの両方が読めます。

:::message
`<track>` の `src` は、原則として**その HTML ページと同一オリジン**である必要があります（`<video>` に `crossorigin` を付ければ例外はあります）。動画本体を外部の URL から読む構成にする場合でも、字幕だけはページと同じ場所に置くことになります。
:::

## `poster` が無いと、再生前はただの灰色の箱になる

`<video preload="metadata">` と書いておけば「先頭フレームくらいは自動で描画されるはず」と思っていたのですが、少なくとも Safari ではそうなりませんでした。`preload` は仕様上あくまでブラウザへのヒントで、先頭フレームの描画を保証するものではありません。しかもこのデモの最初のフレームは暗い単一セルの画面なので、仮に描画されても何の動画かは伝わりません。結果、ページを開いた瞬間は灰色の箱が出るだけで、動画だと気づかれにくい状態でした。

直し方は、動画から代表的な 1 フレームを抜き出して `poster` に指定するだけです。以降のコマンドは `ffmpeg` を使うので、無ければ先に入れてください（macOS なら `brew install ffmpeg`）。コマンドはリポジトリのルートで実行しています。

```bash
# -ss は -i の「後ろ」に置く（理由は下記）
ffmpeg -i docs/guide/videos/launch-demo-ja.mp4 -ss 24 -frames:v 1 docs/guide/videos/launch-demo-poster.png
```

`-ss` の位置で結果が変わります。`-i` の後ろに置くと出力側シークになり、指定した秒数のフレームが正確に得られます。逆に `-i` の前に置く入力側シークは高速です。ただしキーフレームの位置やタイムスタンプの都合で、狙ったフレームからずれることがあります。素材として使う 1 枚を正確に狙うなら後置、大量のフレームを見て捨てるだけのプレビュー用途なら前置、という使い分けが安全です。

どのフレームを選ぶかは、候補を並べて見比べました。数秒刻みで抜いた候補を 1 枚のコンタクトシート（`ffmpeg` の `tile` フィルタ等）にまとめてから、色分けされたグリッドとタイトルカードが同時に見えている 24 秒地点を採用しています。1 枚ずつ開いて確認すると比較になりません。

なお、動画を作り直したら poster も抜き直す必要があります。タイトルカードの位置が動くと、24 秒地点が別の絵になるためです。

### 補足: `+faststart` は付けておく

mp4 は、再生に必要な索引（`moov` atom）がファイルの末尾に書かれることがあります。この並びだとブラウザは再生の前にいったんファイル末尾を取りに行くので、その往復のぶん待たされます。ffmpeg の既定がこの並びなので、Web に置くなら `-c copy -movflags +faststart` で先頭側へ移します。Web 配信の定型で、目新しい話ではありません。

```bash
# 再エンコードはせず、atom の並びだけ変える
ffmpeg -i <元の cut>.mp4 -c copy -movflags +faststart docs/guide/videos/launch-demo-en.mp4

# どちらの並びかは ffprobe で確認できる（moov が mdat より先に出れば対応済み）
ffprobe -v trace -i docs/guide/videos/launch-demo-en.mp4 2>&1 | grep -oE "type:'[a-z0-9]{4}'" | head -6
```

覚えておきたいのは、この remux をかけたリポジトリ側のコピーが、**GitHub のアタッチメントとバイト列で一致しなくなる**ことです。映像も音声も同じで、手元で試した限りファイルサイズも変わりませんでしたが、atom の並びとそれが指すオフセットは別物になります。同じ動画に見えるからと片方をコピーしてもう片方に上書きすると、この調整が失われます。


## おまけ: 動画の「直前」に一文を置く

技術的な話ではありませんが、同じ作業で一番効いたのはこれでした。

当初、ガイドの冒頭にはリリースのたびに書き換わる告知バナーがあり、そのすぐ下に前置きなしで動画を置いていました。自分で見返したときに「これは何の動画で、なぜここにあるのか」が一瞬わからず、動画の下にあるキャプションを読んで初めて気づく状態でした。原因は 2 つです。

- 動画の直前に前置きの文章がないので、バナーの続きなのか無関係な埋め込みなのか判別できない
- 説明文が動画の下にあるため、動画を見ている間はそれが何であるかの手がかりが無い

直した後は、getting-started のブロックの下に動かしたうえで、動画の前に「何が・何秒・どういう内容か」を書いた太字の一文を置き、あわせてアンカーも振りました。

```markdown
**Rather see it running first?** Ninety seconds, with sound — one agent, then a grid of them.
{: #demo }

<video controls playsinline preload="metadata" poster="../videos/launch-demo-poster.png" ...>
```

変化する要素（リリース告知バナー）の直後に、恒久的なコンテンツを前置きなしで置かない。動画に限らず、埋め込みコンテンツ全般に言えることだと思います。

## まとめ

README と GitHub Pages で置き方が分かれるのは、GitHub が描画するプレイヤーに属性を渡す手段が無いからです。

| 必要なもの | README で制御できるか | 対応 |
|---|---|---|
| プレイヤー内字幕 | 不可 | Pages 側は `<track>`、README 側は `<details>` にテキストで併記 |
| サムネイル | 不可 | `ffmpeg -i <mp4> -ss <秒> -frames:v 1` で抜いて `poster` に指定 |
| ファイルの中身 | 不可 | `-c copy -movflags +faststart`。リポジトリ側のコピーとアタッチメントはバイト列が一致しなくなる |

両方に載せると、同じ動画のコピーが 2 つできます。作り直すたびに両方を差し替えることになり、字幕とナレーションのテキストもそれに付いてきます。

MulmoTerminal ではこれを `docs/guide/videos/README.md` に集約しました。ファイルの一覧、poster の抽出コマンド、remux のコマンド、作り直したときに何を一緒に直すかを、動画と同じディレクトリに置いてあります。

## 参考リンク

- [MulmoTerminal](https://github.com/receptron/mulmoterminal)
- [ユーザーガイド（GitHub Pages）](https://receptron.github.io/mulmoterminal/guide/en/)
- issue #1827 — README への動画埋め込み（アタッチメント URL の保管場所）: https://github.com/receptron/mulmoterminal/issues/1827
- issue #1839 — 動画の位置とリード文の改善: https://github.com/receptron/mulmoterminal/issues/1839
- issue #1842 — 動画に poster を追加: https://github.com/receptron/mulmoterminal/issues/1842
- [MDN `<track>`](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/track)
- [MDN `<video>`](https://developer.mozilla.org/ja/docs/Web/HTML/Reference/Elements/video)
