---
title: "Fullstack Al Dev & Raycast Summit イベントレポート トークセッション1（2024-11-23開催）"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [ai, llm, raycast, graphai]
publication_name: raycast_jp
published: true
# published_at: 2024-12-02 11:45
---

2024年11月23日(土)、東京・大崎にあるファインディ株式会社様のイベントスペースにて「Fullstack AI Dev & Raycast Summit feat. Satoshi Nakajima」を開催いたしました。本記事ではトークセッション1 および スポンサートークについて紹介いたします。

イベントレポートはメイン記事 1本、トークセッション 4本 の合計5本です。  
各レポートは以下の表からご覧ください。

|メイン|セッション1|セッション2|セッション3|セッション4|
|:---:|:---:|:---:|:---:|:---:|
|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-main)|本記事|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk2)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk3)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk4)|

# 1. 有本勇氏 / GraphAI: Full-Stack TypeScript Tool for AI Applications
:::message
**有本勇氏 プロフィール**  
所属：Singularity Society / 職種：ソフトウェアエンジニア
フルスタックエンジニアとして、さまざまな開発をしています。最近はTypeScriptを中心に、2019年頃からFirebase + Vue.jsをメインにしています。一昨年はSolidityに挑戦し、昨年はPythonでSlashGPTを、今年はGraphAIで新たな可能性を探求しています。
Zenn: https://zenn.dev/isamua
GitHub: https://github.com/isamu
:::

## 1.1. 登壇概要 (Claude による要約をベースに編集)
### 1.1.1. GraphAI の特徴
GraphAIは非同期処理を効率よく簡単に実装するためのツールです。これまでのAI/ML開発では、Pythonを使用してサーバに直接実装するケースが主流でしたが、OpenAIなどのツールの登場によりAPI経由での利用が増加しています。この状況の中で、Web開発者にとって馴染みのあるTypeScriptを使用し、フルスタックでの開発が可能なツールとしてGraphAIは設計されています。

GraphAIの内部構造は、グラフ理論に基づく依存関係の管理を行い、制御部分とエージェント部分を明確に分離しています。エージェントフィルターによる処理の拡張も可能で、HTTPによる呼び出しやサーバ/クライアント間での分散実行にも対応しています。APIキーの管理なども考慮した設計となっており、セキュリティ面でも安心してご利用いただけます。

エージェントの実装についても柔軟性を重視しており、JavaScriptのAPI直接呼び出しだけでなく、HTTP経由での呼び出しも可能で、HTTP経由で呼び出すことによりTypeScript以外の言語（PythonやGoなど）での実装にも対応しています。分散システムへの対応も充実しており、モノリシック構成からの段階的な移行が可能で、ローカルLLMへの接続やイントラネット/パブリッククラウドの混在環境にも対応しています。

ストリーミング機能も実装しており、複雑な依存関係を持つ処理でも簡単に実装することができます。CLIやサーバでの利用シーンを想定した機能も備えています。

### 1.1.2. 試用方法と将来のビジョン
GraphAIは様々な方法で試用していただくことができます。CodePen/HTMLでの簡易試用、npmパッケージによるCLIツール、HTML版の提供、GitHubでのサンプル提供など、用途に応じて選択いただけます。

> - CodePen/html
>   - 11/14から対応中。ちょっと動く。jsdelivrでumd配布: https://codepen.io/isamua/pen/YzmgRYg
>   - html: https://github.com/receptron/graphai/tree/main/packages/samples/htmlSample
>     - openAIFetchAgent
> - cli: npm package + sample graph file
> - web: Vue.js での実装サンプル
> - TypeScript
>   - GraphAIレポジトリのtest/sample: https://github.com/receptron/graphai
>   - Zennの記事: https://zenn.dev/topics/graphai?order=latest

将来的なビジョンとしては、メタチャット機能で実験をした、自動的なワークフローの生成に力を入れていきます。プログラムの自動生成や世界中のエージェントの連携を可能にすることを目指しています。また、AI エージェント検索の仕組みやWeb3 テクノロジーをベースとした、事前に認証情報などを共有しないエージェント同士の信頼性評価、課金などの仕組みをつくり、真の自律・分散したエージェント社会に構築など、新たな課題にも積極的に取り組んでいく予定です。

### 1.1.3. まとめ
GraphAIは非同期処理だけでなく、サーバ/クライアント間で自由に使えるツールとして設計しています。様々な試用方法を用意していますので、ぜひお試しいただき、皆様からのフィードバックをお待ちしています。

## 1.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?si=petQpxa9Jv8t44J_&t=3968

## 1.3. 登壇資料
@[speakerdeck](f5519758ad30489cb65fab62ad172309)

# 2. 上野彰大氏 / LLMマルチエージェントアプリケーションの設計のコツ
:::message
**上野彰大氏 プロフィール**  
所属：PharmaX株式会社 / 職種：取締役・CTO
PharmaX共同創業者。かかりつけオンライン薬局サービス「YOJO」を運営している。2023年からは積極的なLLMの活用によって、オペレーションの自動化を主導してる。エンジニアリング勉強会コミュニティStudyCoを運営している。
X: https://x.com/ueeeeniki
:::

## 2.1. 登壇概要 (登壇資料抜粋に加えて、Claude による要約)
PharmaXにおけるLLMマルチエージェントアプリケーションの実装事例と、そこから得られた設計のコツについて解説します。具体的には、漢方薬のオンライン薬局サービスにおける薬剤師-患者間のチャットシステムの自動化事例を中心に説明します。

### 2.1.1. サービス概要
薬剤師にチャットの返答をサジェッションするためにLLMを活用しています。
- ユーザーからのメッセージを受信したタイミングでLLMによる返信のサジェストが作られ、一部のメッセージは自動送信＆必要があれば薬剤師が確認・修正して送る
  - 自動で送る場合は当然精度が重要
  - サジェストされる場合も、そのまま送信することができれば、返信速度が速くなる＆生産性が高くなるので精度が高いことはやはり重要
- 管理画面上でボタンを押す（ショートカットキーをタイプする）ことでもチャットがサジェストされる

### 2.1.2. システム設計の特徴
システムはLangChain、LangSmith、LangGraph等を活用し、以下のような段階的な処理フローを実装しています。
1. ルールベースでLLM処理可能かを判定
2. LLMで会話を分類しLLM処理可能かを判定
3. LLMで次のフェーズに移るべきかどうかを判定
4. LLMでメッセージを作成
5. LLMで作成されたメッセージを評価（LLM-as-a-Judge）し、一定の水準を下回ったら再生成して、クリアしたもののみをサジェストする

### 2.1.3. LLMエージェントの設計原則まとめ
1. LLMエージェントがこなすタスクはできる限り小さく単一にする
    → タスクを細かく分けて分割するパターンをフローエンジニアリングと呼ぶ
2. RAGは本当に必要な時のみ使う
3. LMエージェントの出力を次のLLMの入力に使う直列構造はできる限り避ける
4. 無理してLLMでやり切ろうせず、必要があれば人を介在させる

### 2.1.4. チャットアプリケーションにおける返信速度の重要性
チャットアプリケーションでは、LLMを活用して返信速度を向上できればポジティブな影響があります。
- LINEで薬剤師が返答するというサービスの特性上、数分〜10分程度の待ち時間は許容されると考えていた
  - アンケートでも返信速度に対する不満は多くはなかった
- 実際には、LLMのサジェスト機能を導入して返信速度が早くなった結果、ユーザーからの返信率・返信速度、さらには購入率までもが向上した
  - 感覚的には、ユーザーは10秒以内でLINEを閉じず、30秒以内でスマホを閉じないという境界があるのではないか？
  - レスポンス速度の担保の重要性を悟った

### 2.1.5. まとめ
マルチエージェントLLMチャットボットの設計のコツと未来&速度向上戦略について話しました。
- LLMアプリケーションでは精度とレスポンス速度を高次元で両立させることは重要
- フローエンジニアリングを実践することで、精度は向上するが、処理系全体のレスポンス速度は遅くなってしまう可能性がある
- LLMが賢くなればエージェント数を減らすことはできるが、フローエンジニアリングの発想は今後も有用
- 投機的な並列処理を行うことで処理時間を短縮することができる
  - 投機的な処理を行うことで、コストは割高になるので、リリース後にデータセットを収集し、一部の処理のML化、あるいは安価のモデルのfine-tuningを行うことでコストダウンも狙う

## 2.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?si=p6kbsl-N9VQgb_im&t=2495

## 2.3. 登壇資料
@[speakerdeck](d420310f2eed40c3a7c447d2d5ce4289)

# 3. BASE株式会社様 / オフラインでもTypeScriptから使えるAI ~ Chromeに搭載されるGemini Nanoとは ~
:::message
**BASE株式会社様 会社情報**  
■ BASE BANKチームのご紹介
ネットショップ作成サービス「BASE」を運営するBASE株式会社のFinTech事業部です。
"AI与信"を活用して、個人や中小企業の資金繰り課題を解決をするプロダクトを作っています。
新規プロダクト開発を積極的に行なっており、
4つのプロダクトをリリース済み、さらに2つのプロダクトの立ち上げが進行中です！

■ 1つでも当てはまったら、ぜひ BASE BANK についてカジュアルにお話しさせてください！
・企画、デザイン、開発からグロースまで一貫して携わる"フルサイクル開発"をしたい
・バックエンド/フロントエンド/インフラと幅広く開発したい
・新規プロダクトの立ち上げに0から関わりたい
・エンジニア出身の事業部長の組織でプロダクト作りをしたい

[採用情報](https://open.talentio.com/r/1/c/binc/homes/4380?group_ids=9203)
[チーム紹介資料](https://speakerdeck.com/base/basebank)
[テックブログ](https://devblog.thebase.in/archive/category/BASE%20BANK)
[Podcast](https://open.spotify.com/show/17BZXigCHZtF3KD1HIIOrX)
[即座に資金調達ができる「YELL BANK」](https://yellbank-lp.thebase.com/)
[BASEがAIを活用した将来債権ファクタリングサービスをグループ事業に初展開](https://binc.jp/press-room/news/press-release/pr_20240618)
:::

## 3.1. 登壇概要  (登壇資料抜粋に加えて、Claude による要約)
当日の登壇の様子はBASE様にて公開しているのでこちらもぜひご覧ください。
https://devblog.thebase.in/entry/2024/11/28/180000

### 3.1.1. AIおよび機械学習の活用状況
- BASE
  - 社内のChatGPTハッカソンで生まれた機能を2023年にリリース
- BASE BANK
  - 2018年より売上予測から資金調達できるサービスを提供中

### 3.1.2. Small Language Model(SLM) の可能性
Small Language Model(SLM)は、従来のLarge Language Model(LLM)と比較して小規模なモデルで、以下のような特徴があります。

- 応答速度が速い（アクセスするデータ範囲が狭く、応答が速くなりやすい）
- 開発者目線：特定のタスクに対しての精度が高くしやすい
- モデルを使う時に必要なコンピュータリソースが少ない
- なので、デバイス上におくことができる。

また、小規模言語モデルをデバイス上に置くメリットとして以下が挙げられます。

- オフラインでも動き高速である
- 利用上限がない
- セキュアである

### 3.1.3. Gemini Nano in Chrome 実装状況と制約
小規模言語モデルは Gemini Nano in Chrome として、使える状態にはなっています。
現在は実験的機能として提供されており、以下の制約があります：
- Chrome ver.131 
- Chrome フラグ（実験的機能を使うかの設定）をONにする
- ストレージ要件: 22GB以上の空き容量
- 現時点(2024年11月)では英語のみ対応

一方で、API Key を用意しなくてもTypeScript / JavaScript から気軽にAIが使えるというメリットもあります。

### 3.1.4. まとめ
- iOS/Androidにデバイス上で動く小規模の AIが来るように、Chromeにも小規模AIが来る！
- ただ、モデルサイズは一定大きく、制約も多いので銀の弾丸にはならない
- 小規模モデルは 非構造な自然言語を扱うのが上手なので（それ以外のチューニングは今後に期待）翻訳／言語判定／要約の機能などが早期にプロダクトに組み込みやすそう
- AIモデルをデバイスにあらかじめアプリのように落としておく未来もそう遠くはなさそう
- RaycastからGemini Nano in ChromeをChrome拡張経由で使えないかな？ってちょびっと調べてみたけどダメだった

## 3.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=5289

## 3.3. 登壇資料
@[docswell](https://www.docswell.com/s/gatchan0807/ZN1V6G-2024-11-23-110000)

----
# イベントレポートリンク
イベントレポートはメイン記事 1本、トークセッション 4本 の合計5本です。  
各レポートは以下の表からご覧ください。

|メイン|セッション1|セッション2|セッション3|セッション4|
|:---:|:---:|:---:|:---:|:---:|
|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-main)|本記事|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk2)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk3)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk4)|