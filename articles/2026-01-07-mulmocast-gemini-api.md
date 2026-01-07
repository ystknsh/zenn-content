---
title: "Gemini API キー取得 & 課金設定ガイド"
emoji: "🔑"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [llm, mulmocast, gemini, ai, 生成AI]
published: true
publication_name: singularity
---

:::message
**この記事について**

この記事は、[MulmoCast](https://mulmocast.com)を活用して、MulmoScriptから動画とテキストを同時生成したガイドです。動画とテキストの両方で同じ内容をご覧いただけます。動画で見たい方は記事内のリンクからご覧ください。
:::

# Gemini API キー取得 & 課金設定ガイド

Google AI StudioでGemini APIキーを取得し、有料プランの課金設定を行う手順を解説します

# Gemini API Key Setup & Billing Configuration

## Google AI Studio Guide

このガイドでは、Google AI StudioでGemini APIキーを取得し、有料プランを利用するための課金設定方法を解説します。

![Beat 2](/images/mulmocast_gemini_api/gemini_api_00_08.png)

まず、APIキーの新規作成から始めます。[Google AI Studio](https://aistudio.google.com)を開き、左側メニューから「Get API key」をクリックします。

![Beat 3](/images/mulmocast_gemini_api/gemini_api_00_17.png)

画面右上の「Create API key」ボタンをクリックして、キー作成を開始します。

![Beat 4](/images/mulmocast_gemini_api/gemini_api_00_23.png)

「Name your key」欄に任意のキー名を入力します。ここでは「MulmoCast」と入力しています。

![Beat 5](/images/mulmocast_gemini_api/gemini_api_00_30.png)

「Choose an imported project」のプルダウンから「Create project」を選択します。

![Beat 6](/images/mulmocast_gemini_api/gemini_api_00_37.png)

新しいプロジェクト名を入力し、「Create project」をクリックします。

![Beat 7](/images/mulmocast_gemini_api/gemini_api_00_50.png)

「Create key」をクリックすると、無料枠のAPIキーが生成されます。無料枠のAPIキーでご利用の方は、ここで終了となります。

# Create Billing Account

## Setting Up Payment

続いて、請求先アカウントの作成を行います。

![Beat 9](/images/mulmocast_gemini_api/gemini_api_01_02.png)

APIキー一覧の該当キーの横にある「Set up billing」をクリックします。

# Enable 2-Step Verification

## ※ If Prompted Only

次に、2段階認証の設定を行います。この画面が表示された場合のみ対応してください。Google Cloudプロジェクトを使用するため、アカウントのセキュリティ設定が必要です。

![Beat 11](/images/mulmocast_gemini_api/gemini_api_01_25.png)

「Google Cloud access blocked」と表示された場合、「Go to settings」をクリックします。

![Beat 12](/images/mulmocast_gemini_api/gemini_api_01_32.png)

パスキーや認証アプリなどを設定し、2段階認証を有効化します。

![Beat 13](/images/mulmocast_gemini_api/gemini_api_01_45.png)

再度「Set up billing」を押します。

# Create Billing Account

## Continue Setup

2段階認証の設定が完了したら、請求先アカウントの作成に進みます。

![Beat 15](/images/mulmocast_gemini_api/gemini_api_01_51.png)

Google Cloud画面で「Link a billing account」を押します。

![Beat 16](/images/mulmocast_gemini_api/gemini_api_01_58.png)

次の画面で「Manage billing accounts」を選択します。

![Beat 17](/images/mulmocast_gemini_api/gemini_api_02_03.png)

「Create account」へ進みます。

![Beat 18](/images/mulmocast_gemini_api/gemini_api_02_09.png)

アカウント名、国、通貨を設定します。ここでは、アカウント名「My Billing Account」、国「Japan」、通貨「JPY」に設定します。設定後に「Continue」をクリックします。

![Beat 19](/images/mulmocast_gemini_api/gemini_api_02_23.png)

クレジットカード情報などのプロファイルを確認し、「Submit and enable billing」をクリックしてアカウントを作成します。

# Link Billing Account

## Connect to Project

最後に、プロジェクトと請求先アカウントの紐付けを行います。請求先アカウントを作っただけでは課金は有効になりません。必ずプロジェクトとリンクする必要があります。

![Beat 21](/images/mulmocast_gemini_api/gemini_api2_00_01.png)

再度、Google AI Studioの一覧から「Set up billing」をクリックします。

![Beat 22](/images/mulmocast_gemini_api/gemini_api2_00_12.png)

「This project has no billing account」と表示されるので、「Link a billing account」をクリックします。

![Beat 23](/images/mulmocast_gemini_api/gemini_api2_00_15.png)

「Set the billing account」ポップアップのプルダウンメニューを開き、先ほど作成した請求先アカウントを選択します。ここでは「My Billing Account」を選択しています。

![Beat 24](/images/mulmocast_gemini_api/gemini_api2_00_17.png)

「Set account」ボタンをクリックして設定を確定します。

![Beat 25](/images/mulmocast_gemini_api/gemini_api2_00_24.png)

画面左上が「Paid account」と表示されていることを確認します。

![Beat 26](/images/mulmocast_gemini_api/gemini_api2_00_37.png)

AI Studioに戻ると「Set up billing」のリンクが消え、設定完了となります。初回セットアップの場合、しばらく時間を置くと「Tier 1」と表示されます。以上でGemini APIキーの取得と課金設定が完了しました！

https://youtu.be/sEBUBCVPWIc

