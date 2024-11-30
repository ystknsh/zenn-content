---
title: "Fullstack Al Dev & Raycast Summit イベントレポート（2024-11-23開催）"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [ai, llm, raycast, graphai]
publication_name: raycast_jp
published: false
---

2024年11月23日(土)、東京・大崎にあるファインディ株式会社様のイベントスペースにて「Fullstack AI Dev & Raycast Summit feat. Satoshi Nakajima」を開催いたしました。
DevX/Raycast Community Japan、シンギュラリティ・ソサエティ 初の大規模イベントとして、Fullstack AI ツール「GraphAI」、生産性向上ツール「Raycast」、LLMアプリケーション開発フレームワーク「LangChain」等をテーマに、第一線で活躍する登壇者をお迎えし、多くの参加者の皆様にご来場いただきました。

# 1. イベントの目的・成果
本イベントは以下の目的で企画しました。

- GraphAI や Raycastなど最新のAIツールの可能性を探る
- AIエージェント開発に関する知見の共有
- エンジニアコミュニティの交流促進

参加者の方々からは「大変豪華なゲストに素敵なスポンサー、とても貴重なイベントにオフラインで参加できて光栄でした」「講演の内容も多様かつ技術的に尖ったものが多く勉強になりました。」など、多くの好評価をいただきました。

# 2. イベントの様子
本イベントレポートでは基調講演、パネルディスカッションの様子をご紹介いたします。  
スポンサー/トークセッションでの発表については別記事にてご紹介いたします。

## 2.1. アーカイブ動画 / Toggeter
アーカイブ動画は YouTubeにて、参加者の皆さんの声は Toggeter にて公開しております。

- YouTube: https://www.youtube.com/live/sPTnyuO9OCA?feature=shared
- Toggeter: https://togetter.com/li/2470205

## 2.2. 基調講演: 中島聡氏 Declarative Dataflow Programming For Agentic Workflow (AI Agents)
中島氏より アイディアソン/ハッカソンの紹介、GraphAI プロジェクトの紹介がありました。  
[YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=727)

### 2.2.1. AGIの時代が目前に
中島氏は冒頭、AI研究者たちの間で「3年後にはAGIの時代が来る」という予測が共有されていることを指摘。ほとんどの人が「それはないだろう」と感じているこの予測について、「実際にAIを作っている人たちが言い始めているということがすごく重要」と強調されました。  

また、このAI革命による社会変革について、過去のインターネット革命を例に挙げながら説明。Amazonが既存の書店チェーンからビジネスを奪い、さらに書籍以外の分野へと拡大していったように、AIによって「そういうバリューマイグレーション（価値の移行）が、あらゆる業種で起こるだろう」と予測されました。

### 2.2.2. GraphAI について
オープンソースプロジェクトとして開発が進められている GraphAI の紹介とその効果について説明がありました。
- 宣言型の非同期データフロー実行エンジン（オープンソースプロジェクト）
  https://github.com/receptron/graphai
- JSONやYAMLで記述可能なデータフローグラフ
- 非同期処理の最適化が特徴
  - 複雑な依存関係を持つタスクを効率的に実行
  - OpenAI API等の制限に対する自動的な制御機能
- Static Node と Computed Node で構成
- ループ機能による複雑な処理の実現

### 2.2.3. アイディアソン / ハッカソン
一般向けのアイディアソン、エンジニア向けのハッカソンの紹介がありました。  
詳細なルールについては以下の GitHub にて公開されております。みなさん奮って参加ください。

- 2024年12月 アイディアソン開催
  https://github.com/snakajima/life-is-beautiful?tab=readme-ov-file#アイデアソン締め切り2024年12月31日
- 2025年3月頃　ハッカソンを開催予定
  https://github.com/snakajima/life-is-beautiful?tab=readme-ov-file#ハッカソン締め切り2025年3月中旬
  - お題
    - 1. AI-native 音声版 Instagram（プロダクト開発）
    - 2. GraphAIのWebインターフェイス（オープンソース・プロジェクト）
    - 3. GraphAIアプリを自動生成するGraphAIアプリ（研究）
    - 4. AI-native辞書（プロダクト開発）

## 2.3. パネルディスカッション: 中島聡氏 x 小飼弾氏
中島氏、小飼氏によるパネルディスカッションを行いました。
[YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=15060)

### テーマ1: 今、AI分野で起業や事業を立ち上げるならどんな事業ドメインでどんなサービスを作るか
中島氏は、AIを前提としたサービス設計、つまり「AIネイティブ」な発想での事業展開を提案しました。既存のサービスをAI化するのではなく、最初からAIを組み込んだ形でサービスをデザインすることで、全く新しい価値を生み出せると指摘しました。例として、AIネイティブな辞書や音声版インスタグラム、AIネイティブな冷蔵庫などが挙がりました。

一方、小飼氏は異なるアプローチを提案しました。AIではないものの価値を見出す方向性を重視し、クイックソートのような確実に正しい結果が得られるアルゴリズムの重要性を強調しています。AIの限界を理解した上で、人間の能力を活かせる領域を探求することが重要だと述べました。

### テーマ2: LLMの推論手法について
LLMの推論についての議論では、システム1（直感的・反射的な思考）とシステム2（論理的・分析的な思考）という観点から分析が行われました。現状のLLMはシステム1的な思考が主体となっており、システム2的な思考の実現可能性について検討が必要ではないかと議論が深まりました。

特に注目すべき点として、GPUの増強だけでAGIが実現可能かという問題提起がなされました。また、人間の脳の仕組みの解明が、この課題解決のブレークスルーになる可能性も指摘されました。

### テーマ3: AGI/ASIについて
AGI/ASIの実現による社会への影響として、まずインターフェースがGUIから自然言語へと変化することが予想されました。また、雇用構造の変化や失業率の上昇、貧富の差の拡大といった社会的な課題も指摘されました。

特徴的な議論として、人間がAGIの「手足」として機能する可能性や、「APIとしての人間」の役割という概念が提示されました。実現に向けた課題としてエネルギー問題や、労働概念の再定義の必要性についても言及されました。

### 質疑応答
質疑では、日本のAI産業の可能性について、高齢化社会における介護ロボットの活用や健康寿命の延伸へのAI活用といった具体的な提案がありました。

AIへの危機感については、AIの誤作動への対応や、人間の判断力の低下への懸念が示されました。

プログラミング学習に関しては、AI活用以前の基礎的な理解の重要性が指摘され、「裸の状態」を知ることの必要性が強調されました。


## 2.4. 登壇者様の発表（別記事にてご紹介予定）
- 有本勇氏
  - GraphAI: Full-Stack TypeScript Tool for AI Applications
- 上野彰大氏
  - LLMマルチエージェントアプリケーションの設計のコツ
- 宮田大督氏
  - マルチエージェントとドメインスペシャリストが切り開く次世代サービス開発：旅行事業領域での実践と未来
- 山室友樹氏
  - LLMとPlaywrightで実現する非定型なデータの収集
- 草間一人氏
  - AI x インシデント管理で拡げるサービスオーナーシップ
- 矢野通寿氏
  - GraphAI x Raycastで自然言語で様々なワークフローの実行できるようにする試み
- しょっさん氏
  - Raycast Proで、あらゆるコンテンツをすばやく解読する
- r.kagaya氏
  - デザインパターンで理解するLLMエージェントの設計
- 大嶋 勇樹氏
  - LangChain/LangGraphの進化からみるLLMベースのAIエージェントの開発

# 3. 謝辞
本イベントは、多くの企業様のご支援により実現することができました。

- 会場スポンサー：
  - ファインディ株式会社様
- 企業スポンサー：
  - BASE株式会社様
  - 株式会社スタジオユリグラフ様
  - 株式会社Macbee Planet様
  - 株式会社ドール様
  - 株式会社技術評論社様

また、スタッフとして運営を支えていただいた皆様、そして何より、休日にも関わらずご参加いただいた参加者の皆様に、心より感謝申し上げます。

# 4. 次回イベントに向けて
次回イベントの詳細は、Connpass / 各種SNS にて随時お知らせいたします。引き続き、コミュニティの発展にご協力いただけますと幸いです。

Connpass: https://raycast.connpass.com/event/335759/

Raycast Community Japan の Slackは、こちらから参加できます！
https://join.slack.com/t/raycastcommunityjapan/shared_invite/zt-2o0futx5u-BMDYt7shHqAT2Fa82SPLfQ

Xのフォローもよろしくお願いします！！
- Raycast Community JapanのX: https://x.com/Raycast0731/
- Singularity SocietyのX: https://x.com/SingularitySoci