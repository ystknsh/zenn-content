---
title: "MulmoCast v1.0.14 リリース"
emoji: "🎉"
type: "idea"
topics: [mulmocast, ai, imagegeneration, video]
published: true
publication_name: singularity
---

:::message
**この記事について**

この記事は、[MulmoCast](https://mulmocast.com)を活用して、MulmoScriptから動画とテキストを同時生成したガイドです。動画とテキストの両方で同じ内容をご覧いただけます。動画で見たい方は記事内のリンクからご覧ください。
:::

# 🎉 MulmoCast v1.0.14 Released!

マルモキャスト バージョン1.0.14をリリースしました！今回のアップデートでは、新たに19種類のAIモデルを利用可能にしました。さらに、並列実行数を設定するUIを追加し、ご利用のAPIプランに合わせた調整ができるようになっています。

## 1. 新しいAIモデルの追加

19種類のAIモデルを新たに利用可能にしました。画像生成モデルが13種類、動画生成モデルが6種類追加されています。

### OpenAI · 画像モデル

- gpt-image-2
- gpt-image-1-mini

OpenAIには、最新の画像生成モデルが追加されています。

### Replicate · 画像モデル

- Black Forest Labs · Flux 2 Pro / Dev
- Black Forest Labs · Flux 1.1 Pro / Pro Ultra
- Black Forest Labs · Flux Pro / Dev / Schnell
- Ideogram V3 · Turbo / Balanced / Quality
- Recraft V3
- Stable Diffusion 3.5 Large
- Luma Photon

Replicate経由でも、Flux、Ideogram、Recraft、Stable Diffusion、Luma Photonなど、画像モデルの選択肢が大きく広がります。

### Replicate · 動画モデル

- ByteDance Seedance 2.0 / 2.0 Fast
- Alibaba HappyHorse 1.0
- MiniMax Hailuo 2.3 / 2.3 Fast
- PixVerse v5

動画生成モデルは、Replicate経由で6種類を新たに追加しました。

### 生成サンプル

![sample_gpt_image_2](/images/release_v1_0_14_script/misc_sample_gpt_image_2.png)

gpt-image-2 で生成した画像です。この画像を元に Seedance 2.0 で生成した映像は、末尾の動画からご覧いただけます。

## 2. 並列実行数の設定UI

![03-01_settings_concurrency](/images/release_v1_0_14_script/03-01_settings_concurrency.png)

並列実行数を設定するUIを追加しました。画像・動画・音声の同時生成数を、設定画面からデフォルト値として指定できます。

![03-02_project_style_concurrency](/images/release_v1_0_14_script/03-02_project_style_concurrency.png)

プロジェクトごとに上書きも可能で、ご利用のAPIプランのレート制限に合わせて、生成スピードを調整できます。

## 3. 利用可能モデルの更新

**No longer available**

- dall-e-3 (OpenAI)
- Imagen 4.0 (Google)

提供元のサポート終了に伴い、いくつかの画像モデルが選択肢から外れました。dall-e-3とImagen 4.0が利用できなくなり、オンボーディングのデフォルトはgpt-image-1-miniに切り替えています。

## その他の改善

その他、軽微な改善を行いました。起動中のアプリに更新通知が届きます。ダウンロードは公式サイトから行えます。

マルモキャスト バージョン1.0.14をお楽しみください！

## 動画で見る

**日本語版**
https://youtu.be/wZwWezMWfGo

**英語版**
https://youtu.be/QvxLlqE63ew
