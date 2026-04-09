---
title: "MulmoCast v1.0.13 リリース"
emoji: "🎉"
type: "idea"
topics: [mulmocast, kenburns, animation, video]
published: true
publication_name: singularity
---

:::message
**この記事について**

この記事は、[MulmoCast](https://mulmocast.com)を活用して、MulmoScriptから動画とテキストを同時生成したガイドです。動画とテキストの両方で同じ内容をご覧いただけます。動画で見たい方は記事内のリンクからご覧ください。
:::

# 🎉 MulmoCast v1.0.13 Released!

マルモキャスト バージョン1.0.13をリリースしました！今回のアップデートでは、静止画にモーションを付けるImage Effect UIや、ビート間を素早く移動できるBeat Navigatorを追加しました。さらに、新しい動画生成モデルが追加されています。

## 1. Image Effect UI

![image-effect-video](/images/release_v1_0_13_script/image-effect-video.png)

1：Image Effect UIを追加しました。静止画にズームやパンのモーションを付けるKen Burnsエフェクトを、UIから簡単に設定できます。

![01-02_image_effect_materials](/images/release_v1_0_13_script/01-02_image_effect_materials.png)

まず、エフェクトを適用したい画像をMaterialsに登録します。

![01-03_image_effect_params](/images/release_v1_0_13_script/01-03_image_effect_params.png)

デュレーションやズーム倍率、移動の開始位置と終了位置など、パラメータを細かく調整できます。

![01-04_image_effect_dropdown](/images/release_v1_0_13_script/01-04_image_effect_dropdown.png)

エフェクトのプリセットはドロップダウンから選択できます。ズームインやズームアウト、上下左右への移動など6種類が用意されています。

## 2. Beat Navigator

![02-02_beat_navigator_button](/images/release_v1_0_13_script/02-02_beat_navigator_button.png)

2：Beat Navigator機能を追加しました。スクリプトエディタのTEXTタブとMEDIAタブに、Beat Navigatorボタンが追加されました。

![02-03_beat_navigator_dialog](/images/release_v1_0_13_script/02-03_beat_navigator_dialog.png)

ダイアログを開くと、ビートカードがサムネイル付きのグリッドで一覧表示されます。カードをクリックすると該当ビートにジャンプできます。

## 3. 新しい動画生成モデル

![03-01_movie_model_dropdown](/images/release_v1_0_13_script/03-01_movie_model_dropdown.png)

3：新しい動画生成モデルが追加されました。

![03-02_movie_model_google_dropdown](/images/release_v1_0_13_script/03-02_movie_model_google_dropdown.png)

Googleの Veo 3.1 LiteとVeo 3.1 Fastが追加されました。

また、Replicate経由でGrok、Kling、RunwayMLなどの新しい動画生成モデルが利用可能になりました。

## その他の改善

その他、macOSの自動アップデート修正など、軽微な改善を行いました。起動中のアプリに更新通知が届きます。ダウンロードは公式サイトから行えます。

マルモキャスト バージョン1.0.13をお楽しみください！

## 動画で見る

**日本語版**
https://youtu.be/d4dq3IWzy24

**英語版**
https://youtu.be/N5r0vT1Uipk
