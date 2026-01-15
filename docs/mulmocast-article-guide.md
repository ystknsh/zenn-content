# MulmoCast生成記事の編集手順

MulmoCastで生成されたマークダウンをZenn記事として公開する際の編集手順です。

---

## 1. 画像パスの変更

MulmoCastが生成するマークダウンでは、画像パスが `../images/` の相対パスになっています。
Zennで正しく表示されるよう、絶対パスに変更します。

**変更前:**
```markdown
![Beat 2](../images/gemini_api_00_08.png)
```

**変更後:**
```markdown
![Beat 2](/images/mulmocast_gemini_api/gemini_api_00_08.png)
```

### 手順
1. 画像ファイルを `/images/{記事名}/` ディレクトリに配置
2. 記事内の全ての画像パスを `/images/{記事名}/ファイル名.png` 形式に変更

---

## 2. 冒頭に注釈を追加

MulmoCastで生成された記事であることを読者に伝えるため、フロントマターの直後に以下の注釈を追加します。

```markdown
:::message
**この記事について**

この記事は、[MulmoCast](https://mulmocast.com)を活用して、MulmoScriptから動画とテキストを同時生成したガイドです。動画とテキストの両方で同じ内容をご覧いただけます。動画で見たい方は記事内のリンクからご覧ください。
:::
```

---

## 3. 不要な要素の削除

### セクション区切り用のdivタグを削除

MulmoCastが生成するセクション区切り用のdivタグは、Zenn記事では不要なので削除します。

**削除対象:**
```html
<div style='display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center;'>

# セクションタイトル

## サブタイトル

</div>
```

**変更後:**
```markdown
# セクションタイトル

## サブタイトル
```

### クレジット画像の削除

記事末尾にあるMulmoCastクレジット画像は削除します。

**削除対象:**
```markdown
![Beat 27](images/guide05_api_script/mulmo_credit.png)
```

---

## 4. YouTube動画リンクの追加

記事の末尾に、MulmoCastで生成した動画のYouTubeリンクを追加します。

```markdown
https://youtu.be/xxxxxxxxxx
```

ZennはYouTube URLを自動的に埋め込みプレイヤーとして表示します。

---

## 5. フロントマターの設定

```yaml
---
title: "記事タイトル"
emoji: "適切な絵文字"
type: "tech"
topics: [llm, mulmocast, その他関連トピック]
published: true
publication_name: singularity  # または適切なパブリケーション
---
```

---

## チェックリスト

- [ ] 画像パスを `/images/{記事名}/` 形式に変更
- [ ] 冒頭にMulmoCast注釈を追加
- [ ] セクション区切り用divタグを削除（または適切な見出しに変換）
- [ ] クレジット画像を削除
- [ ] YouTube動画リンクを末尾に追加
- [ ] フロントマター（title, emoji, topics等）を設定
