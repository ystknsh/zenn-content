---
title: "Fullstack Al Dev & Raycast Summit イベントレポート トークセッション4（2024-11-23開催）"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [ai, llm, raycast, graphai]
publication_name: raycast_jp
published: true
published_at: 2025-02-12 
---

2024年11月23日(土)、東京・大崎にあるファインディ株式会社様のイベントスペースにて「Fullstack AI Dev & Raycast Summit feat. Satoshi Nakajima」を開催いたしました。本記事ではトークセッション4 および スポンサートークについて紹介いたします。
※ トークセッション4の後のパネルディスカッション 中島聡氏 x 小飼弾氏 はメイン記事に掲載しております。

イベントレポートはメイン記事 1本、トークセッション 4本 の合計5本です。  
各レポートは以下の表からご覧ください。

|メイン|セッション1|セッション2|セッション3|セッション4|
|:---:|:---:|:---:|:---:|:---:|
|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-main)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk1)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk2)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk3)|本記事|

# 1. r.kagaya氏 / デザインパターンで理解するLLMエージェントの設計
:::message
**r.kagaya氏 プロフィール**  
所属：BtoB SaaSスタートアップ / 職種：エンジニア
新卒で入社したヤフー株式会社でID連携システムの開発に従事したのち、2022年に現職に入社。ソフトウェアエンジニアとしてSaaSプロダクト開発、開発生産性向上に取り組む。その後生成AI/LLMチームを立ち上げ、複数の機能をリリース。現在は新規事業に従事。
X: https://x.com/ry0_kaga
:::

## 1.1. 登壇概要 (Claude による要約をベースに登壇資料抜粋および編集)
### 1.1.1. はじめに

本稿では、LLMエージェントの設計において重要となるデザインパターンについて解説します。特に「Agentic Workflow」と呼ばれる手法に焦点を当て、その実装アプローチと効果について詳しく説明していきます。

### 1.1.2. Agentic Workflow の概要と効果

LLMエージェントは、反復的、段階的、自律的にタスクをこなすことができます。このような処理の流れを「Agentic Workflow」と呼びます。単一のプロンプトで処理を行うのではなく、ワークフローとして組み立てることで、より高い効果が得られることが知られています。例えば、GPT-3.5 Agentic Workflowで実装した場合、GPT-4 ゼロショットよりも高い精度（95.1%対67.0%）を達成した事例があります。

また、[Translating Step-by-Step: Decomposing the Translation Process for Improved Translation Quality of Long-Form Texts](https://arxiv.org/abs/2409.06790) によると、翻訳プロセスを「事前調査」「ドラフト」「リファインメント」「校正」の4段階に分解。Zero-shot Promptingによる翻訳と比較して、各ステップで翻訳品質が段階的に向上することが報告されています。

### 1.1.3. Agentic Workflow / LLMエージェント構築の4つのデザインパターン

1. Reflection: 自己改善プロセス  
    -  LLMが自身の出力を批評的に検証・評価するプロセス
    -  シンプルながら、出力品質を大幅に改善可能
    -  自動化された自己改善メカニズム

2. Tool Use: LLMの能力拡張のためのツール活用  
    - 外部ツールの呼び出しによるLLMエージェントのケイパビリティ拡張
    - タスクに適したツールを自律的に選択
    - 情報収集・アクション実行・データ操作等が可能に

3. Planning: 目標達成のための多段階計画の立案・実行
    - 複雑なタスクの自律的な分割と計画立案
    - 動的なサブタスク生成と実行順序の決定

4. Multi-agent collaboration: 複数AIの協調によるタスク解決
    - 複数LLMエージェントの協調による問題解決
    - 専門性を活かした役割分担
    - 単一エージェントを超える解決能力

### 1.1.4. Agentic Design Patternの使い方

これらのデザインパターンは、約1年前から徐々に普及し始め、現在では多くの実装で複数のパターンを組み合わせて使用されています。Reflection、Tool Use は比較的実装が容易で、多くの用途に適用できます。

エージェント間の連携方法としては、単純な出力の受け渡しだけでなく、YAMLやXMLを用いた構造化ドキュメントの定義や、PubSubの仕組みを応用した実装など、様々なアプローチが存在します。最近では、LangChainがエージェントプロトコルという標準インターフェースを提案するなど、企業間を超えたエージェントの連携に向けた取り組みも進んでいます。

### 1.1.5. 事例 / 発展的話題
事例/発展的話題として以下についてスライドで説明がありました。
- 事例
  - Sakana.ai: [「AIサイエンティスト」： AIが自ら研究する時代へ](https://sakana.ai/ai-scientist-jp/)
  - Microsoft: [Magentic-One: A Generalist Multi-Agent System for Solving Complex Tasks](https://www.microsoft.com/en-us/research/articles/magentic-one-a-generalist-multi-agent-system-for-solving-complex-tasks/)
- 発展的話題
  - [AI Agentic Design Patterns with AutoGen](https://www.deeplearning.ai/short-courses/ai-agentic-design-patterns-with-autogen/)
  - [Agent Design Pattern Catalogue](https://arxiv.org/html/2405.10467v4)
  - [AFlow: Automating Agentic Workflow Generation](https://arxiv.org/abs/2410.10762)
  - [Agent-as-a-Judge: Evaluate Agents with Agents](https://arxiv.org/abs/2410.10934)
  

### 1.1.6. まとめ

今後は、プロンプトの自動生成やエージェントの自動チューニングなど、より高度な自動化技術が発展していくと予想されます。また、各ドメインやプロダクトに特化したデータセットを整備し、それを元にプロンプトを自動生成する取り組みも増えていくでしょう。

LLMを用いたワークフローやパイプライン処理の設計は、エンジニアの重要なスキルとなっていきます。これらのデザインパターンは、言語やフレームワークに依存せず、長期的に適用可能な知見として活用できます。

## 1.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?si=RdxnvAj9s5m6DkSR&t=12448

## 1.3. 登壇資料
@[speakerdeck](4b3b8eb767e14d96bf94490f1ac5966c)


# 2. 大嶋勇樹氏 / LangChain/LangGraphの進化からみるLLMベースのAIエージェントの開発
:::message
**大嶋勇樹氏 プロフィール**  
所属：株式会社ジェネラティブエージェンツ/職種：取締役CTO/Co-founder
大規模言語モデルを組み込んだアプリケーションやAIエージェントの開発を実施。「ChatGPT/LangChainによるチャットシステム構築[実践]入門」「LangChainとLangGraphによるRAG・AIエージェント［実践］入門」共著。勉強会コミュニティStudyCo運営。
X: https://x.com/oshima_123
近著紹介: [LangChainとLangGraphによるRAG・AIエージェント［実践］入門 ](https://www.amazon.co.jp/dp/4297145308)(技術評論社、2024年11月) 
:::

## 2.1. 登壇概要 (登壇資料抜粋に加えて、Claude による要約)
### 2.1.1. はじめに
LLMを組み込んだアプリケーション（LLMアプリケーション）の開発という分野が登場し、そして今、LLMベースのAIエージェントが盛り上がり始めています。LLMベースのAIエージェントを開発するためのフレームワークも次々と開発されていますが、新しい分野のフレームワークからは、その分野に対する試行錯誤を感じとることができます。私はLangChain/LangGraphというフレームワークに注目して追いかけてきましたが、その進化の過程にはまさにLLMベースのAIエージェントに対する試行錯誤がありました。

本セッションでは、LangChain/LangGraphの進化も踏まえつつ、LLMベースのAIエージェントの開発の変遷をふりかえっていきます。

### 2.1.2. LLMによる AIエージェントの変遷

LLMを活用したAIエージェントの開発は、プログラムで解析しやすい形式での出力を可能にし、プログラムの分岐判断や状況に応じたパラメータ生成をLLMで実現する試みとして始まりました。
- [WebGPT](https://arxiv.org/abs/2112.09332) (2021年12月): Web 検索の能力
- [MRKL](https://arxiv.org/abs/2205.00445) (2022年5月): Web 検索に限らず、LLM が様々な Action を選択して呼び出そうとする汎用的なアーキテクチャ
- [ReAct](https://arxiv.org/abs/2210.03629)（2022年10月: Action と Chain-of-Thought を組み合わせ、Action の前に Reason を出力することで性能向上

LangChain の当初のエージェントは、MRKL や ReAct の概念を取り入れ、アクションを繰り返すものでした。LLMが判断して外部ツールを使ってアクションする様子はそれだけでも衝撃的でしたが、LLMエージェントはさらに進化していきました。

- [Plan-and-Solve](https://arxiv.org/abs/2305.04091)（2023年5月）: LLMに「計画を立てて（タスクをサブタスクに分割して）から、計画に従ってサブタスクを実行してください」と指示するプロンプトエンジニアリングの手法
- [BabyAGI](https://github.com/yoheinakajima/babyagi_archive) (2023年4月)：計画を管理しながら動作する汎用LLMエージェント

しかし、汎用エージェントが本当に仕事をなんでもこなしてくれるかというと、そうではありませんでした。

### 2.1.3. 現状の課題と今後の展望

現在のAIエージェントには、以下のような課題があります：

- LLMに与えられるツールの不足 (プログラムにとって使いやすいAPIの不足)
- 記憶(Memory) を適切に扱う難しさ
- 自律的に動作しているように見えて、実は同じ思考をループしてしまっている

これらの課題から、エージェントの動作判断を完全にLLMに任せることは現時点では困難であることが分かってきました。そのため、現在は「エージェントらしく振る舞うワークフロー」を組み立てる方向性が主流となっています。

AIエージェントの本質は「人間がいちいち指示しなくても、自分でやることを考えて、様々なツールを活用して目標に向かってタスクをこなしていくAIの仕組み」です。OpenAI のホワイトペーパーでは、「現在の通常のAI」と「AIエージェント」の間に明確な境界線はないとされており、以下のような特性が強いほど「AIエージェントらしい」とされています：

- 目標の複雑さ: 複雑で広範な目標を達成できるほどエージェントらしい
- 環境の複雑さ: 多くの環境、利害関係者、外部ツールの関係が必要なほどエージェントらしい
- 適応性: ルールベースの対応だけでなく、予期しない状況に対応できるほどエージェントらしい
- 独立した実行: 目標の達成までの人間の加入が少ないほどエージェントらしい

今後、LLMの進化に伴い、エージェントにより多くの判断を委ねられるようになり、エージェントらしさがさらに強化されていくことが期待されています。

## 2.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?si=1vkAoQ5PPQv3uOQy&t=13626

## 2.3. 登壇資料
@[speakerdeck](ed629d9d28e94b689bbb9d95b088cb41)

# 3. 株式会社スタジオユリグラフ様 / スポンサートーク
:::message
**株式会社スタジオユリグラフ様 会社情報**  
■ スタジオユリグラフのご紹介
SEO記事制作から小説まで書けるライティングアシスタントAIサービス「Xaris」を運営する株式会社スタジオユリグラフです。
ライターに寄り添い、ライターが使いやすいライターのためのプロダクトを作っています。
プロダクト開発を積極的に行なっており、プロダクトの立ち上げが進行中です！
CTO候補を募集しておりますので、ぜひご興味ある方はお話しさせてください！

■ 下記要件にビビッとたら、ぜひスタジオユリグラフについてカジュアルにお話しさせてください！！
技術スタック：
ライブラリ
・SvelteKit - JavaScript フレームワーク
・UnoCSS - CSS ライブラリ
・daisyUI - UI コンポーネントライブラリ
・ProseMirror - エディタを実装できるライブラリ
API
・生成AI
　・OpenAI
　・Anthropic
　・Gemini
・Stripe - サブスク、決済
・SendGrid - メール配信
インフラ
・Supabase - データベース
・Cloudflare Pages - デプロイ先

採用条件：
・年収600～800万
・フルリモOK
・沖縄県名護市に移住する場合は家賃全額補助
・SO付与

[HP](https://studioeurygraph.com)
:::

## 3.1. 登壇概要  (登壇資料抜粋)
### 本日伝えたいこと
1. 私、DJやってます！YouTube登録してください！！ [登録はこちら](https://www.youtube.com/@DJKesuno)
2. AIの会社でCTOの募集をしてます！興味ある方話しましょう！！

### 3.1.1. 会社紹介

株式会社スタジオユリグラフは、「書くこと」に特化したAI技術と創作活動を展開する企業です。代表の森石氏は編集プロダクション出身の小説家・ライターであり、その経験を活かして「書く」という創造活動を支援するサービスを展開しています。

「次世代の文化の土壌を作る」というビジョンのもと、テクノロジーを活用して創造的なアイデアを実現することを目指しています。将来的には小説、漫画、映画、アニメなどのコンテンツ制作分野でクリエイティブエージェンシーとしての成長を目指しています。

### 3.1.2. 事業
**AIライティングアシスタント「Xaris」**

記事制作会社やライター向けに特化したAIライティングアシスタント「Xaris」を開発・提供しています。ChatGPTキャンバスに類似したサービスですが、2022年から開発を開始し、日本では最も早い段階でリリースされたAIライティング支援ツールの一つです。チャット画面とエディターを併用した独自のインターフェースを特徴とし、特許出願も行っています。

**思い出書店**

"思い出"がつづられた本を交換する本屋。「交換でつながる」新しい形の古書サービス（2024年グッドデザイン賞受賞）

**その他の事業**

- 受託開発、記事制作代行、出版事業
- 自社オウンドメディアをはじめ、オリジナルコンテンツを出版・流通

### 3.1.3. 採用要件
現在、CTOポジションを募集しています。
自由な社風と柔軟な働き方。成長中のベンチャー企業ながら、競争力のある待遇を提供。

![](/images/20241123-raycast/20241123-studioeurygraph3.png)

## 3.2. YouTube Link

https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=19043

----
# イベントレポートリンク
イベントレポートはメイン記事 1本、トークセッション 4本 の合計5本です。  
各レポートは以下の表からご覧ください。

|メイン|セッション1|セッション2|セッション3|セッション4|
|:---:|:---:|:---:|:---:|:---:|
|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-main)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk1)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk2)|[Zenn Link](https://zenn.dev/raycast_jp/articles/2024-11-23-fullstack-ai-dev-n-raycast-summit-talk3)|本記事|