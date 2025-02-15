---
title: "Fullstack Al Dev & Raycast Summit イベントレポート（2024-11-23開催）"
emoji: "🚀"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [ai, llm, raycast, graphai]
publication_name: raycast_jp
published: true
published_at: 2024-12-02 11:45
---

2024年11月23日(土)、東京・大崎にあるファインディ株式会社様のイベントスペースにて「Fullstack AI Dev & Raycast Summit feat. Satoshi Nakajima」を開催いたしました。

[DevX/Raycast Community Japan](https://devx.jp)、[シンギュラリティ・ソサエティ](https://singularitysociety.org) 初の大規模イベントとして、Fullstack AI ツール「GraphAI[^1]」、生産性向上ツール「Raycast[^2]」、LLMアプリケーション開発フレームワーク「LangChain[^3]」等をテーマに、第一線で活躍する登壇者をお迎えし、多くの参加者の皆様にご来場いただきました。

[^1]: GraphAI: https://github.com/receptron/graphai  
        TypeScriptで書かれた単機能のAgentと呼ばれるプログラムを、YAMLやJSONファイルに書かれたデータフローグラフの法則に従って順次非同期に実行するプログラムのエンジンです。オープンソースプロジェクトとして開発が進められています。詳しい説明は本イベントの基調講演を参照。

[^2]: Raycast: https://www.raycast.com
        Y Combinator発のMacでの作業効率を最大化する次世代生産性向上ツールです。

[^3]: 人気のAI開発ツール「LangChain」をより使いやすく進化させた「LangGraph」がある。
        LangChain: LLMアプリケーション開発のためのPythonフレームワーク
        LangGraph: LangChainを拡張した有向グラフベースのフレームワーク

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

https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=113
https://togetter.com/li/2470205

## 2.2. 基調講演: 中島聡氏 Declarative Dataflow Programming For Agentic Workflow (AI Agents)
中島氏より アイディアソン/ハッカソンの紹介、GraphAI プロジェクトの紹介がありました。  
[YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=727)

:::message
**中島聡氏 プロフィール**  
工学修士（早稲田大学）、MBA（ワシントン大学）。1989年に渡米し、ソフトウェアアーキテクトとしてMicrosoft本社で Windows 95、Internet Explorer 3.0/4.0 を開発。2000年に UIEvolution を起業、04年にスクウェア・エニックスに売却。07年に MBO で買い戻したのち、車載機向けのソフトウェア会社 Xevo Inc. として成功させ19年に Lear に売却。主な著書に「なぜ、あなたの仕事は終わらないのか」（15万部）。メルマガ「週刊 Life is Beautiful」を発行。現在は、GraphAIの開発に従事。一般社団法人シンギュラリティ・ソサエティ代表理事
:::

### 2.2.1. AGIの時代が目前に
中島氏は冒頭、AI研究者たちの間で「3年後にはAGIの時代が来る」という予測が共有されていることを指摘。ほとんどの人が「それはないだろう」と感じているこの予測について、「実際にAIを作っている人たちが言い始めているということがすごく重要」と強調されました。  

また、このAI革命による社会変革について、過去のインターネット革命を例に挙げながら説明。Amazonが既存の書店チェーンからビジネスを奪い、さらに書籍以外の分野へと拡大していったように、AIによって「そういうバリューマイグレーション（価値の移行）が、あらゆる業種で起こるだろう」と予測されました。

### 2.2.2. GraphAI について
オープンソースプロジェクトとして開発が進められている [GraphAI](https://github.com/receptron/graphai) の紹介とその効果について説明がありました。
- 宣言型の非同期データフロー実行エンジン（オープンソースプロジェクト）
- JSONやYAMLで記述可能なデータフローグラフ
- 非同期処理の最適化が特徴
  - 複雑な依存関係を持つタスクを効率的に実行
  - OpenAI API等の制限に対する自動的な制御機能
- Static Node と Computed Node で構成
- ループ機能による複雑な処理の実現

### 2.2.3. アイディアソン / コントリビューション・フェス
一般向けのアイディアソン、エンジニア向けのコントリビューション・フェス (注: 11/23のイベント中ではハッカソンと紹介していましたが、2024/11/30 名称の変更、お題の追加、ルール詳細の追加等がありました。)の紹介がありました。  
詳細なルールについては以下の GitHub にて公開されております。みなさん奮って参加ください。

- 2024年12月 アイディアソン開催 [詳細はこちら(GitHub)](https://github.com/snakajima/life-is-beautiful?tab=readme-ov-file#アイデアソン締め切り2024年12月31日)
- 2025年3月頃 コントリビューション・フェスを開催予定 [詳細はこちら(GitHub)](https://github.com/snakajima/life-is-beautiful?tab=readme-ov-file#ハッカソンコントリビューションフェス締め切り2025年3月中旬)
  - お題
    - 1. GraphAI（オープンソース・プロジェクト）
    - 2. AI-native 音声版 Instagram（プロダクト開発）
    - 3. GraphAIのWebインターフェイス（オープンソース・プロジェクト）
    - 4. AI-native辞書（プロダクト開発）
    - 5. GraphAIアプリを自動生成するGraphAIアプリ（研究）
  
## 2.3. パネルディスカッション: 中島聡氏 x 小飼弾氏
中島氏、小飼氏によるパネルディスカッションを行いました。  
[YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?feature=shared&t=15060)

:::message
**小飼弾氏 プロフィール**  
株式会社オン・ザ・エッヂ(後のライブドア)の取締役最高技術責任者(CTO)を務め、同社の上場に貢献。著書に『小飼弾の「仕組み」進化論』(日本実業出版社)、『「中卒」でもわかる科学入門』『子供の科学完全読本 1924-1945』(誠文堂新光社)など。ニコニコチャンネル「小飼弾の論弾」で、毎月2回、時事ニュース解説や科学・IT解説などをライブ配信中。  

公式ブログ: [404 Blog Not Found](https://dankogai.livedoor.blog)  
近著紹介: [『子供の科学完全読本 1924-1945: 大正から昭和へ 100年前から読み直して学ぶ 教養としての科学史』](https://www.amazon.co.jp/dp/4416723369)(誠文堂新光社、2024年9月) 
:::

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


## 2.4. 登壇者様の発表
- イベントレポート トークセッション1
  - 有本勇氏
    - GraphAI: Full-Stack TypeScript Tool for AI Applications ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=p6kbsl-N9VQgb_im&t=2495))
  - 上野彰大氏 ([X Link](https://x.com/ueeeeniki))
    - LLMマルチエージェントアプリケーションの設計のコツ ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=petQpxa9Jv8t44J_&t=3968))

- イベントレポート トークセッション2
  - 宮田大督氏 ([X Link](https://x.com/miyatti))
    - AI旅行記事生成PJから学んだマルチエージェントの本質と可能性 ~旅行スタートアップの生成AI開発ナレッジシェア~ ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=yw5qbPAb3Cw0OUrG&t=5944))
  - 山室友樹氏 ([X Link](https://x.com/__y_ymmr__))
    - LLMとPlaywrightで実現する非定型なデータの収集 ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=7pwmLScSAGDotjiQ&t=6961))
- イベントレポート トークセッション3
  - 草間一人氏  ([X Link](https://x.com/jacopen))
    - AI x インシデント管理で拡げるサービスオーナーシップ ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=mB0baCU17859UCWb&t=8777))

  - 矢野通寿氏 ([X Link](https://x.com/nagauta_jp))
    - GraphAI x Raycastで自然言語で様々なワークフローの実行できるようにする試み ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=n2jQc5I9bp73d0Hi&t=9844))
  - しょっさん氏 ([X Link](https://x.com/sho7650))
    - Raycast Proで、あらゆるコンテンツをすばやく解読する ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=FOU8SEgVRWL6JO-r&t=11111))

- イベントレポート トークセッション4
  - r.kagaya氏 ([X Link](https://x.com/ry0_kaga))
    - デザインパターンで理解するLLMエージェントの設計 ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=RdxnvAj9s5m6DkSR&t=12448))
  - 大嶋 勇樹氏 ([X Link](https://x.com/oshima_123))
    - LangChain/LangGraphの進化からみるLLMベースのAIエージェントの開発 ([YouTube Link](https://www.youtube.com/live/sPTnyuO9OCA?si=1vkAoQ5PPQv3uOQy&t=13626))

# 3. 謝辞
本イベントは、多くの企業様のご支援により実現することができました。

- 会場スポンサー：
  - ファインディ株式会社様 ([ホームページ](https://findy.co.jp))
- 企業スポンサー：
  - BASE株式会社様 ([BASE BANKチーム紹介資料](https://speakerdeck.com/base/basebank?slide=52))
  - 株式会社スタジオユリグラフ様 ([ホームページ](https://studioeurygraph.com))
  - 株式会社Macbee Planet様 ([株式会社Macbee Planet 採用情報](https://hrmos.co/pages/macbeeplanet/jobs))
  - 株式会社ドール様 ([オフィス向け定期配達サービス 「Office de Dole もったいないバナナ」](https://www.dole.co.jp/news/241004))
  - 株式会社技術評論社様 ([ホームページ](https://gihyo.jp))

![](/images/20241123-raycast/20241123-sponsors.png)

また、スタッフとして運営を支えていただいた皆様、そして何より、休日にも関わらずご参加いただいた参加者の皆様に、心より感謝申し上げます。

# 4. 次回イベントに向けて
次回イベントの詳細は、connpass / 各種SNS にて随時お知らせいたします。引き続き、コミュニティの発展にご協力いただけますと幸いです。

- conpass

https://raycast.connpass.com

- Slack
Raycast Community Japan の Slackは、[こちら(Slack)](https://join.slack.com/t/raycastcommunityjapan/shared_invite/zt-2o0futx5u-BMDYt7shHqAT2Fa82SPLfQ) から参加できます！

- X
Xのフォローもよろしくお願いします！！
  - Raycast Community Japan [こちら(X)](https://x.com/Raycast0731/)
  - Singularity Society [こちら(X)](https://x.com/SingularitySoci)
