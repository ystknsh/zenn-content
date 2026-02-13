---
title: "MulmoCast v1.0.11 リリース"
emoji: "🎉"
type: "idea"
topics: [mulmocast, azure, vertexai, tts, llm]
published: true
publication_name: singularity
---

:::message
**この記事について**

この記事は、[MulmoCast](https://mulmocast.com)を活用して、MulmoScriptから動画とテキストを同時生成したガイドです。動画とテキストの両方で同じ内容をご覧いただけます。動画で見たい方は記事内のリンクからご覧ください。
:::

# 🎉 MulmoCast v1.0.11 Released!

マルモキャスト バージョン1.0.11をリリースしました！このバージョンでは、Azure OpenAIサービス対応、Vertex AI対応、字幕分割機能などの更新があります。

## 1. Azure OpenAIサービスに対応

![settings_azure_openai](/images/release_v1_0_11_script/settings_azure_openai.png)

Azure経由でOpenAIの画像生成、音声合成、翻訳機能を利用できます。設定画面でサービスごとにAPIキーとベースURLを個別に設定できます。

## 2. Google Cloud Vertex AIに対応

![settings_vertex_ai](/images/release_v1_0_11_script/settings_vertex_ai.png)

Imagenによる画像生成と、Veoによる動画生成を設定画面から利用できます。デフォルトのプロジェクトIDとロケーションを設定できます。

![style_image_params_vertexai](/images/release_v1_0_11_script/style_image_params_vertexai.png)

画像パラメータでプロバイダーにGoogleを選択すると、Vertex AIトグルが表示されます。プロジェクト単位やビート単位で異なる設定を指定できます。

## 3. 字幕分割機能を追加

![style_caption_split](/images/release_v1_0_11_script/style_caption_split.png)

これまで1ビートにつき1つの字幕でしたが、句読点や記号で自動分割して複数行表示が可能になりました。

## 4. Nijivoice TTS 削除

にじボイスのサービス終了に伴い、TTSプロバイダーから削除しました。利用可能なTTSプロバイダーは、OpenAI、ElevenLabs、Gemini、Google、Kotodamaです。

## その他の改善

その他、軽微な改善を行いました。起動中のアプリに更新通知が届きます。ダウンロードは公式サイトから行えます。

マルモキャスト バージョン1.0.11をお楽しみください！

## 動画で見る

**日本語版**
https://youtu.be/GCRszBL5ZZU

**英語版**
https://youtu.be/gb4g3EbCgec
