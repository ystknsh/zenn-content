---
title: "世界モデル（World Model）ベンチマーク結果2024 - o1 & Grok2 "
emoji: "🌏"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: ["o1", "grok", "世界モデル", "ai"]
published: true
publication_name: singularity
---

# はじめに

世界モデル（World Model）ベンチマークを OpenAI o1, Grok2 で評価してみました。利用したベンチマークはこちらです。

https://github.com/SingularitySociety/WorldModels

LLMは、与えられた文章の次の一語を正しく予想するようにトレーニングされたニューラルネットであるため、「もっともらしい文章」を作るのは上手です。 しかし、LLMが人間に匹敵する、もしくは人間を超える働きをするには、「世界モデル（World Model）」を 持つ必要があります。

世界モデル（World Model）ベンチマークは、「重いものは下に落ちる」など、人間だけでなく、動物までもが直感的に把握している世界モデルを測定することを目的に Singularity Society にて作成している評価項目です。

今回はこの世界モデルベンチーマークを利用して、3つの比較を行いました。
項番2 では o1 でも誤る、または Grok2 に劣る回答をすることがあったためプロンプトエンジニアリングで性能向上するかを確認しました。

1. o1 vs Grok2
2. o1 に「いつもより注意して答えるように指示」
3. 2 の回答に対して人間が評価

# 1. o1 vs Grok2

両モデルの特徴的な違いは以下の点で見られました。
これら例からも分かるように、o1は論理的な判断に徹する一方、Grok2は現実世界の知識も組み込んだ回答を提供する傾向があると思われます。

## アプローチの違い
- o1: 問題を細かく分解して論理的に解答を導く傾向
- Grok2: データ駆動型で、より柔軟な発想で解答する傾向|

## 具体的な回答例
|質問|o1|Grok2|
|:--|:--|:--|
|前人未到のジャングルに、人喰い虎は住んでいるか？|確認されていないため不明です。存在するとも存在しないとも言えません。|人喰い虎の存在は特定の条件下でのみ確認されており、一般的なジャングルにはいないことが多いです。仮にいたとしても、極めて稀です。|
|東京から大阪までの距離は400kmです。太郎君は陸上部の選手なので、100mを11秒で走ることが出来ます。大阪まで走るとどのくらい時間がかかりますか？|400km＝400,000m。100m/11秒 →1mあたり0.11秒。400,000m×0.11秒＝44,000秒＝約12.22時間(約12時間13分)。|400,000m / 100m * 11秒 = 44,000秒。44,000秒 ÷ 60 = 約733.33分。733.33分 ÷ 60 = 約12.22時間。ノンストップで走り続けると、約12時間22分かかります。休憩や他の要因を考えると、もっと時間がかかるでしょう。|
|ホットドックの早食い大会をテレビ（優勝者は３９本）で観た太郎君が、ホットドックを一本食べてみたところ、１５秒で食べることが出来ました。太郎君は、１０分間で何本食べることが出来るでしょう？|10分は600秒。600秒÷15秒=40本食べられます。|600秒 / 15秒 = 40本。ただし、連続で食べることの物理的な制約や疲労を考慮すると、実際にはこの数に達するのは難しいかもしれません。|

# 2. o1 に「いつもより注意して答えるように指示」
o1に`あなたの能力をチェックするための質問です。いつもより注意深く質問を解析して答えてください。`という指示を与えると、回答の正確性が向上したものもありました。
これは、o1 は標準でChain of Thoughtを利用しているが、o1 でもプロンプトエンジニアリングが有効であることを示唆します。

|質問|o1|o1+prompt|
|:--|:--|:--|
|「引く」と書いてあるドアを反対側から押すとどうなりますか？|通常は開きません。ドアは引いて開ける用に作られているため、反対側から押しても開かない場合がほとんどです。|反対側からは「押す」方向が正しく、普通に開きます。|
|テーブルの上のコップの中にビー玉を入れ、逆さにしました。それからコップを電子レンジの中に移動しました。ビー玉はどこにありますか？|コップを逆さにしたまま移動した場合、ビー玉はコップの内側でテーブル側（つまりコップの中の底側）に留まっています。電子レンジ内でも同様です。|コップを持ち上げた時点でビー玉はテーブル上に残り、電子レンジ内にはありません。|
|身長170センチの人は、手を伸ばせば２メートルのところに届きます。同じく１７０センチの人を肩車で担ぐと、２メートル５０センチのところに届きます。何人肩車すれば、１０メートルのところに届きますか？|1人で2m、2人で2.5mとすると、追加1人ごとに0.5mアップと仮定。10mに届くには(10m-2m)=8m分/0.5m=16人追加+最初の1人=17人程度必要です。|実際には安定性などから不可能で、単純計算で積み上げることも現実的ではありません。要するに不可能です。|

一方で考え過ぎたせいかpromptを与えた方が誤ることもありました。
|質問|o1|o1+prompt|
|:--|:--|:--|
|扇風機の前に風船を置いたところ、全く動きません。なぜでしょう？|扇風機が作動していないか、風船が風を受ける位置にないため、風による力が加わっていないからです。|風が当たっていない位置か、気流が遮られているため、風船に力が加わらず動かないからです。|

# 3. 2 の回答に対して人間が評価
人間の評価者2名（A氏とB氏）による採点結果は、問題解釈の多様性を示す興味深い事例となりました。
これらの違いは、同じ問題でも評価者の視点や経験、重視する要素によって正解の解釈が大きく異なることを示しています。

- 定義の解釈による違い
  - 人喰い虎問題：「人を食べたことのある虎」vs「人を見たら餌だと思う虎」という定義の違いで評価が分かれる
  - 高跳びの問題：「走り高跳び」か「垂直跳び」か不明確で評価保留に
  - テーブルの花瓶問題：「テーブルが回転 / 観察者が移動」vs 「右に90度移動」だと人間でも解釈が分かれるので問題設定が良くない

- 現実世界の考慮
  - 猿小屋のリンゴ問題：「単純計算で17個」vs「現実では猿に全て食べられる」
  - 氷を運ぶ問題：「船に積んで往復」vs「紐で繋いで浮かべれば1回で済む」

- 安全性の考慮
  - 台風時の川渡り：単純な計算vs「そもそも泳ぐべきでない」
  - 詐欺師との取引：期待値計算vs「初対面の人は信用できない」

# 考察：世界モデルの観点から
この実験から、世界モデルに関して以下のことが考えられます。

1. AIの物理的直感の限界
   - 「コップを逆さにしたときのビー玉の位置」や「風船と扇風機の関係」など、物理的な因果関係の理解に課題
   - 単純な論理的思考では解けない、実世界の経験に基づく判断の難しさ

2. prompt/設問の重要性
   - 「注意深く」という指示により、AIはより慎重に世界モデルを適用
   - 設問や指示を正しく書くことで、o1の能力を最大限引き出すことが出来る
     - o1が間違えた部分は人間でも間違えやすく、曖昧な設問でした
     - ミスリードがないように設問を修正したところ良い結果を得られた (1例としてテーブルの花瓶問題の例を脚注に示します[^1])
   - LLMを評価する場合は、設問がとても重要

[^1]: 
    以下では、「テーブルの中心を軸として真上から見たときに、テーブルを“右回り（時計回り）“に90度回転させたらどうなるか」を考えます。
    元の配置は
    - **手前（正面側）** に赤い花瓶
    - **向こう側（奥側）** に黄色い花瓶
    - **右側** に緑の花瓶

    とします。
    **回転前の座標イメージ**
    説明をわかりやすくするため、テーブルを真上から見た2次元の座標に置き換えます。
    - テーブルの中心を原点 (0,0)
    - **手前(正面)** = 下(マイナス方向) ⇒ 赤い花瓶: (0, -1)
    - **奥(向こう側)** = 上(プラス方向) ⇒ 黄色い花瓶: (0, +1)
    - **右側** = 右(プラス方向) ⇒ 緑の花瓶: (+1, 0)
    (数値の「1」は適当な距離のイメージです)

    **テーブルを時計回りに90度回転**
    2次元平面で、座標 (x,y)(x, y) を**時計回り**に90度回転させると、(x′,y′)(x’, y’) は
    x′=y,y′=−x, x’ = y, y’ = -xとなります。

    1. 赤い花瓶（手前）
    - 元: (0,−1)(0, -1)
    - 回転後: (−1,−0)=(−1,0)( -1, -0 ) = (-1, 0)
    -  → **テーブルの左側** へ移動

    2. 黄色い花瓶（奥）
    - 元: (0,+1)(0, +1)
    - 回転後: (+1,0)(+1, 0)
    -  → **テーブルの右側** へ移動

    3. 緑の花瓶（右側）
    - 元: (+1,0)(+1, 0)
    - 回転後: (0,−1)(0, -1)
    -  → **テーブルの手前（正面）** へ移動

    **まとめ**
    - **赤い花瓶**：手前 → **左側**
    - **黄色い花瓶**：奥 → **右側**
    - **緑の花瓶**：右側 → **手前**

    すなわち、テーブルを右回り（時計回り）に90度回転させると、各花瓶は上記のように配置が変わって見えることになります。

1. モデル間の差異
   - 論理的アプローチ（o1）と経験的アプローチ（Grok2）で異なる強みと弱み
     - この違いは開発方針の違い、学習データの違いが影響していると思われる
     - その結果、LLMモデルも人間社会と同様にロジカルに考えて行動する人(モデル)と感覚的に判断する人(モデル)のように性格が現れる可能性がある
     - この性格の違いはプロンプトエンジニアリングで獲得できるのかは今後検証が必要と思われる
   - どちらのアプローチも、完全な世界モデルの獲得には至っていない

2. 評価の難しさ
   - 世界モデルの評価には、物理法則、社会常識、安全性など多面的な観点が必要
   - 人間の評価者間でも解釈が分かれる問題が多い

# まとめ

AIの世界モデルに関する論理的思考能力は、適切な指示とコンテキストの提供により大きく向上する可能性があります。もちろん、人間よりもLLMの方が得意な分野もあります。一方で、人間の評価者間でも解釈が分かれる問題も多く、人間で評価が別れないような問題設定が必要です。さらに、AI開発の方向性の違いが、異なる特性を持つAIの出現につながっている点にも注目が必要です。

o1を評価して精度がでない、思ったより使えないという話を聞きますが、その場合はまずはその設問を人間に出してみて、曖昧な部分がないか調査し修正し、ブラッシュアップすることで多くの場合改善されると思われます。

:::message
この分析は実験的なものであり、より詳細な検証が必要です。
:::

---


# 世界モデルベンチーマーク結果
https://github.com/KenichiNogami/LifeTime/blob/7b7438446597703d5220711159f31229f0c092a0/o1trial.md

