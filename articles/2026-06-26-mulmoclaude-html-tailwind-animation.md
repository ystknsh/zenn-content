---
title: "コードを書かずに、MulmoClaude で note 記事をアニメーション付き動画にする"
emoji: "🎬"
type: "idea"
topics: [mulmoclaude, mulmocast, animation, 動画生成, claudecode]
published: true
publication_name: singularity
---

:::message
この記事は、[MulmoClaude](https://github.com/receptron/mulmoclaude) を使って note の記事を 1 本のプレゼン動画に仕立てた記録です。記事そのものも、MulmoClaude と一緒に書きました。
:::

## はじめに

気になった note の記事を、MulmoClaude でナレーション付きのプレゼン動画にしてみました。日本語で指示しながら、スライドが動く動画まで仕上げていった過程をまとめます。

そもそも MulmoClaude とは何か。中島聡主導で開発が進む MulmoClaude は、従来の「各アプリに LLM を組み込む」やり方ではなく、『人間の言葉を理解する AI がいることを前提に、AI ネイティブなコンピュータのインターフェイスはどうあるべきか』という発想の転換から生まれたプラットフォームです。だからこそ、特別な操作を覚えなくても、**ふだんの言葉で頼むだけ**で動きます。

この記事では、「どう頼めばこういう動画ができるのか」を、実際のやり取りに沿って紹介します。

## 完成物

クラシルさん（dely）の決算・新ビジョンを語った note 記事を題材に、約 3 分・8 枚のダイジェスト動画ができました。タイトルもスライドも、MulmoClaude が記事を読んでデザインしてくれたものです。実際にできあがった動画がこちらです。

https://www.youtube.com/watch?v=YnW6X4DITpA

![タイトルスライド](/images/2026-06-26-mulmoclaude-html-tailwind-animation/01-title.png)

できあがった動画の中身は、MulmoClaude の**キャンバス**で確認できます。動画は「ビート」という単位を順番につなげたもので、**1 つのビートが、1 枚のスライドと、その読み上げ（ナレーション）1 つ**にあたります。キャンバスにはこのビートが縦に並び、左にスライド、右に読み上げ原稿が表示されます。今回は 8 ビート、つまり 8 枚のスライドで 1 本の動画です。

![MulmoClaude のキャンバス。左にスライド、右に読み上げ原稿が並ぶ](/images/2026-06-26-mulmoclaude-html-tailwind-animation/07-storyboard.png)

スライドをクリックすると拡大表示になり、**スライド・読み上げ原稿（テキスト）・音声（TTS）をまとめて確認**できます。その場で読み上げを再生して、声やテンポをチェックすることもできます。

![拡大表示。スライド・読み上げ原稿・音声をまとめて確認できる](/images/2026-06-26-mulmoclaude-html-tailwind-animation/08-slide-zoom.png)

一覧（キャンバス）の各スライドからも、ビートごとに再生して確認できます。いろいろな角度で仕上がりをチェックできるようになっています。

こだわったのは、**note のスライドを丸ごと貼らない**こと。きちんとデザインし直したスライドの中に、記事の図版を「**出典つきの図**」として置いてもらいました。

![記事の図版を「出典つきの図」として自作スライドに配置](/images/2026-06-26-mulmoclaude-html-tailwind-animation/02-venn-embed.png)

## やったことは「お願いするだけ」

### 1. 記事の URL と「条件」を渡す

最初に送ったのは、記事の URL と条件です。

> https://note.com/yusukehorie/n/ned652c8c02b0
> これを読んで、プレゼン動画を作成してください。
>
> 条件
> 1 mulmoscript で作成する
> 2 スライドは html tailwind をベースで作成する
> 3 html tailwind でアニメーションを作っても良い。
> 4 挿入画像は note から取得する
> 5 画像生成は使わない
>
> そのほか気になることは聞いてください。

### 2. 聞かれたことを選ぶだけ

作る上で足りない情報は、MulmoClaude が選択フォームで聞いてくれます。

- **長さ**：ダイジェスト（約 8 枚）／標準／フル → ダイジェストを選択
- **語り口**：中立な解説ナレーション／本人の一人称 → 一人称を選択
- **動画にするタイミング**：先に構成を確認／一気に動画まで → 一気に作成を選択

![MulmoClaude が出してきた選択フォーム。クリックで選ぶだけ](/images/2026-06-26-mulmoclaude-html-tailwind-animation/06-form.png)

さらに、ひと言だけ好みを伝えました。

> ダイジェストだけど、note のスライドをそのままはやめてね

**仕上がりの好みは、思いついたまま日本語で伝えればOK**です。

### 3. できた動画を見て「動きが欲しい」と追加で頼む

じつは最初のお願いの中でも「アニメーションを付けてもOK」とは伝えていたつもりでした。ところが 1 回目はうまく反映されず、**静止画のスライドが切り替わるだけ**の動画に。つまり、**最初のプロンプトだけで思いどおりにするには、まだ工夫が必要そう**だ、というのが正直なところです。

そこで、あらためてもうひと言。

> これ、スライドに動きがあるといいね。アニメーションを付けて。

すると MulmoClaude が、スライドが**実際に動く**バージョンを作り直してくれました。数字がスルスルとカウントアップしたり、見出しやカードがふわっと順番に出てきたり、という動きです。

:::message
むずかしい設定は MulmoClaude が裏側でやってくれます。「アニメーションを付けて」と頼むだけで、スライドを 1 枚絵から**動く映像**に切り替える設定を自動でやってくれました。こちらは仕上がりを見て「いいね」「ここを直して」と言うだけです。
:::

## できあがった台本（MulmoScript）

ここまでの動画の中身を組み立てている台本（MulmoScript）です。MulmoClaude が記事を読んで自動で作ってくれたもので、ふだんは見る必要はありませんが、興味のある方向けに置いておきます。スライドの HTML、読み上げ原稿、アニメーションの指定までが 1 つの JSON にまとまっています。

:::details MulmoScript（JSON・クリックで展開）

```json
{
  "$mulmocast": {
    "version": "1.1"
  },
  "canvasSize": {
    "width": 1280,
    "height": 720
  },
  "speechParams": {
    "speakers": {
      "Narrator": {
        "displayName": {
          "ja": "堀江裕介"
        },
        "voiceId": "Charon",
        "provider": "gemini"
      }
    }
  },
  "imageParams": {
    "provider": "openai",
    "images": {}
  },
  "movieParams": {
    "provider": "replicate"
  },
  "soundEffectParams": {
    "provider": "replicate"
  },
  "audioParams": {
    "introPadding": 1,
    "padding": 0.3,
    "closingPadding": 0.8,
    "outroPadding": 1,
    "bgmVolume": 0.2,
    "audioVolume": 1,
    "suppressSpeech": false
  },
  "title": "クラシル：AI Supply Chain OS Company への決断（アニメ版）",
  "description": "note記事『AIで産業のあり方を変え、80億人の暮らしに幸せを届ける』のダイジェスト。html_tailwind＋data-animationでスライドに動きを付与。",
  "lang": "ja",
  "beats": [
    {
      "speaker": "Narrator",
      "text": "クラシルは、レシピ動画の会社として10年前に生まれました。そして今、私たちは「AI Supply Chain OS Company」になる、という決断をしました。AIで産業のあり方そのものを変え、80億人の暮らしに幸せを届ける。その10年目の挑戦を、お話しします。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:linear-gradient(135deg,#F15A2B,#FF7A45 60%,#FF9466);font-family:sans-serif'><div class='absolute rounded-full' data-animation='animate' data-opacity='0,0.6' data-scale='0.6,1' data-start='0' data-end='0.9' data-easing='easeOut' style='right:-160px;top:-160px;width:520px;height:520px;background:rgba(255,255,255,.16)'></div><div class='absolute rounded-full' data-animation='animate' data-opacity='0,0.6' data-scale='0.6,1' data-start='0.2' data-end='1.1' data-easing='easeOut' style='left:-100px;bottom:-150px;width:360px;height:360px;background:rgba(255,255,255,.16)'></div><div class='absolute inset-0 flex flex-col justify-center' style='padding:0 96px'><div data-animation='animate' data-opacity='0,1' data-translate-y='-12,0' data-start='0' data-end='0.5' data-easing='easeOut' class='font-bold' style='color:rgba(255,255,255,.9);font-size:26px;letter-spacing:.3em;margin-bottom:28px'>クラシル ｜ 10年目の決断</div><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.25' data-end='0.95' data-easing='easeOut' class='font-black' style='color:#fff;font-size:62px;line-height:1.15'>AIで産業のあり方を変え、</div><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.45' data-end='1.15' data-easing='easeOut' class='font-black' style='color:#fff;font-size:62px;line-height:1.15;margin-bottom:44px'>80億人の暮らしに幸せを届ける。</div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.9' data-end='1.6' data-easing='easeOut' class='flex items-center' style='gap:16px'><span class='font-bold' style='background:#fff;color:#F15A2B;padding:10px 24px;border-radius:9999px;font-size:24px'>レシピ動画の会社</span><span style='color:#fff;font-size:34px'>→</span><span class='font-bold' style='background:#14233D;color:#fff;padding:10px 24px;border-radius:9999px;font-size:24px'>AI Supply Chain OS Company</span></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "2026年3月期、売上高は170億円、前年比プラス29.8%。購買事業は85.7%成長し、全社をけん引しました。レシピ動画から始まったクラシルは、いまや月間3,500万人、食品・飲料ナショナルブランドの93%、3.5万の小売店を、データでつなぐ存在へと進化しています。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#FBF7F2;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:36px'>10年目の決算 — いまの現在地</div><div data-animation='animate' data-opacity='0,1' data-start='0.2' data-end='0.7' class='font-black' style='margin-left:auto;color:#F15A2B;font-size:24px'>クラシル</div></div><div class='flex' style='padding:28px 48px 0;gap:36px'><div style='width:40%'><div data-animation='animate' data-opacity='0,1' data-translate-y='18,0' data-start='0.1' data-end='0.6' data-easing='easeOut' class='font-bold' style='color:#14233D;font-size:24px;line-height:1.6;margin-bottom:24px'>レシピ動画から、<span style='color:#F15A2B'>データで産業をつなぐ</span>プラットフォームへ。</div><div data-animation='animate' data-opacity='0,1' data-translate-y='22,0' data-start='0.3' data-end='0.85' data-easing='easeOut' class='flex items-baseline' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><span style='color:#888;font-size:14px;width:72px'>売上高</span><span class='font-black' style='color:#14233D;font-size:30px'><span data-animation='counter' data-from='0' data-to='170' data-decimals='1' data-start='0.35' data-end='1.5' data-easing='easeOut'>0</span><span style='font-size:15px'>億円</span></span><span class='font-bold' style='margin-left:auto;color:#F15A2B;font-size:18px'>+29.8%</span></div><div data-animation='animate' data-opacity='0,1' data-translate-y='22,0' data-start='0.45' data-end='1.0' data-easing='easeOut' class='flex items-baseline' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><span style='color:#888;font-size:14px;width:72px'>購買事業</span><span class='font-black' style='color:#14233D;font-size:30px'><span data-animation='counter' data-from='0' data-to='60.2' data-decimals='1' data-start='0.5' data-end='1.6' data-easing='easeOut'>0</span><span style='font-size:15px'>億円</span></span><span class='font-bold' style='margin-left:auto;color:#F15A2B;font-size:18px'>+85.7%</span></div><div data-animation='animate' data-opacity='0,1' data-translate-y='22,0' data-start='0.6' data-end='1.15' data-easing='easeOut' class='flex items-baseline' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px'><span style='color:#888;font-size:14px;width:72px'>営業利益</span><span class='font-black' style='color:#14233D;font-size:30px'><span data-animation='counter' data-from='0' data-to='36.2' data-decimals='1' data-start='0.65' data-end='1.7' data-easing='easeOut'>0</span><span style='font-size:15px'>億円</span></span><span style='margin-left:auto;color:#aaa;font-size:12px'>Non-GAAP</span></div></div><div style='width:60%'><div data-animation='animate' data-opacity='0,1' data-scale='0.94,1' data-start='0.45' data-end='1.1' data-easing='easeOut' style='background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:12px'><img src='https://assets.st-note.com/img/1777616068-c6n2XlR3P7oMgAQGwNmv0DaI.png?width=1200' style='width:100%;border-radius:8px;display:block'/></div><div style='color:#aaa;font-size:11px;margin-top:8px;text-align:right'>出典：クラシル 2026年3月期 決算説明資料</div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "なぜ、今このタイミングなのか。AIの性能は毎月、指数関数的に進化しています。一方で日本の消費財産業は、2031年に644万人もの労働力不足が見込まれている。「労働力不足」と「AIの実用化」が交差するこの瞬間こそ、私たちが踏み込むべきベストタイミングだと考えています。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#FBF7F2;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:36px'>なぜ、いま踏み込むのか</div><div data-animation='animate' data-opacity='0,1' data-start='0.2' data-end='0.7' class='font-black' style='margin-left:auto;color:#F15A2B;font-size:24px'>クラシル</div></div><div class='flex items-center' style='padding:26px 48px 0;gap:36px'><div style='width:58%'><div data-animation='animate' data-opacity='0,1' data-scale='0.94,1' data-start='0.35' data-end='1.0' data-easing='easeOut' style='background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:12px'><img src='https://assets.st-note.com/img/1777616646-k9JF8Lw6p0f54CZcUdrVte37.png?width=1200' style='width:100%;border-radius:8px;display:block'/></div><div style='color:#aaa;font-size:11px;margin-top:8px;text-align:right'>出典：クラシル 決算説明資料</div></div><div style='width:42%'><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.25' data-end='0.8' data-easing='easeOut' style='background:#14233D;color:#fff;border-radius:12px;padding:16px 24px;margin-bottom:14px'><div style='color:rgba(255,255,255,.7);font-size:14px;margin-bottom:4px'>需要</div><div class='font-black' style='font-size:24px;line-height:1.35'>2031年に<span data-animation='counter' data-from='0' data-to='644' data-decimals='0' data-start='0.45' data-end='1.4' data-easing='easeOut' style='color:#FF8A5C'>0</span><span style='color:#FF8A5C'>万人</span>の労働力不足</div></div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.45' data-end='1.0' data-easing='easeOut' style='background:#F15A2B;color:#fff;border-radius:12px;padding:16px 24px;margin-bottom:18px'><div style='color:rgba(255,255,255,.85);font-size:14px;margin-bottom:4px'>技術</div><div class='font-black' style='font-size:24px;line-height:1.35'>AIの性能は毎月、指数関数的に進化</div></div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.65' data-end='1.2' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:24px;line-height:1.55'>2つが<span style='color:#F15A2B'>交差する</span>いまが、ベストな参入タイミング。</div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "ところが現場の意思決定は、いまだにExcel、紙、FAX、そして口頭で動いています。理由は2つ。1つは、ベテランの判断ロジックが会社の壁の中に閉じ、退職とともに消えてしまうこと。もう1つは、取引条件やリベートといった重要情報が、そもそもシステムの外にあること。この2つを同時に解いて初めて、産業全体の生産性が上がります。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#14233D;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#fff;font-size:33px'>AIが進むほど、現場の課題が浮き彫りになる</div></div><div style='padding:22px 48px 0'><div data-animation='animate' data-opacity='0,1' data-translate-y='16,0' data-start='0.15' data-end='0.7' data-easing='easeOut' style='color:rgba(255,255,255,.8);font-size:20px;margin-bottom:22px'>消費財のサプライチェーンは、いまも<span class='font-bold' style='color:#FF8A5C'>Excel・紙・FAX・口頭</span>で動いている。原因は2つの構造的な制約。</div><div class='flex' style='gap:28px'><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.35' data-end='0.95' data-easing='easeOut' style='width:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:26px'><div class='font-black' style='color:#F15A2B;font-size:44px;margin-bottom:10px'>01</div><div class='font-black' style='color:#fff;font-size:23px;margin-bottom:8px'>業界知が会社の壁の中に閉じる</div><div style='color:rgba(255,255,255,.7);font-size:17px;line-height:1.6'>ベテラン20年分の判断ロジックが、退職とともに消える。隣の会社が同じ問題を、別々に解いている。</div></div><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.55' data-end='1.15' data-easing='easeOut' style='width:50%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:26px'><div class='font-black' style='color:#F15A2B;font-size:44px;margin-bottom:10px'>02</div><div class='font-black' style='color:#fff;font-size:23px;margin-bottom:8px'>重要情報がシステムの外にある</div><div style='color:rgba(255,255,255,.7);font-size:17px;line-height:1.6'>取引条件・リベート・棚割りの文脈は、紙やFAX、暗黙知のまま。データにならず流れ去る。</div></div></div><div data-animation='animate' data-opacity='0,1' data-translate-y='16,0' data-start='0.85' data-end='1.4' data-easing='easeOut' class='font-black' style='color:#fff;font-size:24px;margin-top:24px;text-align:center'>この2つを<span style='color:#FF8A5C'>同時に</span>解いて初めて、産業全体の生産性が上がる。</div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "私たちの勝ち筋は、3つの掛け算にあります。日々更新される「基盤モデル」、10年かけて積み上げた「独自データ」、そして最も模倣されにくい「業界コンテキスト」。この3つが重なるスイートスポットこそ、クラシルにしか設計できないAIエージェントの源泉です。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#FBF7F2;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:36px'>クラシルの勝ち筋</div><div data-animation='animate' data-opacity='0,1' data-start='0.2' data-end='0.7' class='font-black' style='margin-left:auto;color:#F15A2B;font-size:24px'>クラシル</div></div><div class='flex items-center' style='padding:26px 48px 0;gap:36px'><div style='width:40%'><div data-animation='animate' data-opacity='0,1' data-translate-y='18,0' data-start='0.1' data-end='0.6' data-easing='easeOut' class='font-bold' style='color:#14233D;font-size:24px;line-height:1.6;margin-bottom:20px'>3つの掛け算が重なる<span style='color:#F15A2B'>スイートスポット</span>。</div><div data-animation='animate' data-opacity='0,1' data-translate-x='-24,0' data-start='0.3' data-end='0.85' data-easing='easeOut' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><div class='font-black' style='color:#F15A2B'>独自データ</div><div style='color:#666;font-size:14px'>10年分のレシピ・購買・移動データ</div></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-24,0' data-start='0.45' data-end='1.0' data-easing='easeOut' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><div class='font-black' style='color:#E0A200'>業界コンテキスト</div><div style='color:#666;font-size:14px'>商習慣・ワークフロー・暗黙知を熟知</div></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-24,0' data-start='0.6' data-end='1.15' data-easing='easeOut' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px'><div class='font-black' style='color:#14233D'>基盤モデル</div><div style='color:#666;font-size:14px'>毎月進化する最高水準を活用</div></div></div><div style='width:60%'><div data-animation='animate' data-opacity='0,1' data-scale='0.94,1' data-start='0.5' data-end='1.15' data-easing='easeOut' style='background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:12px'><img src='https://assets.st-note.com/img/1777616198-QdnpD3VhCiuaBt67gqleXNWI.png?width=1200' style='width:100%;border-radius:8px;display:block'/></div><div style='color:#aaa;font-size:11px;margin-top:8px;text-align:right'>出典：クラシル 決算説明資料</div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "私たちがつくるのは、消費財サプライチェーンの共通基盤、Kurashiru AI Supply Chain OSです。バラバラのデータを意味でつなぐ情報レイヤーとオントロジー、その上で業務を実行するAIエージェント。重要なのは、既存の基幹システムを置き換えるのではなく、その上に立つ業界共通のOSとして機能することです。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#FBF7F2;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:34px'>Kurashiru AI Supply Chain OS</div><div data-animation='animate' data-opacity='0,1' data-start='0.2' data-end='0.7' class='font-black' style='margin-left:auto;color:#F15A2B;font-size:24px'>クラシル</div></div><div style='padding:18px 48px 0'><div data-animation='animate' data-opacity='0,1' data-translate-y='14,0' data-start='0.15' data-end='0.65' data-easing='easeOut' style='color:#666;font-size:20px;margin-bottom:18px'>既存の基幹システムは<span class='font-bold' style='color:#14233D'>置き換えない</span>。その上に立つ、業界共通のOS。</div><div data-animation='animate' data-opacity='0,1' data-translate-x='-44,0' data-start='0.7' data-end='1.3' data-easing='easeOut' class='flex items-center' style='background:#F15A2B;color:#fff;border-radius:16px;padding:18px 28px;margin-bottom:12px;box-shadow:0 8px 20px rgba(241,90,43,.3)'><div class='font-bold' style='font-size:13px;background:rgba(255,255,255,.2);border-radius:6px;padding:4px 12px;margin-right:20px'>TOP</div><div><div class='font-black' style='font-size:23px'>AI Agentレイヤー</div><div style='color:rgba(255,255,255,.85)'>セールス＆販促・受発注・サプライチェーン・経営管理</div></div></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-44,0' data-start='0.5' data-end='1.1' data-easing='easeOut' class='flex items-center' style='background:#E8A02B;color:#fff;border-radius:16px;padding:18px 28px;margin-bottom:12px;box-shadow:0 8px 20px rgba(232,160,43,.3)'><div class='font-bold' style='font-size:13px;background:rgba(255,255,255,.2);border-radius:6px;padding:4px 12px;margin-right:20px'>MID</div><div><div class='font-black' style='font-size:23px'>オントロジーレイヤー</div><div style='color:rgba(255,255,255,.9)'>バラバラのデータに共通の意味と関係性を与える</div></div></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-44,0' data-start='0.3' data-end='0.9' data-easing='easeOut' class='flex items-center' style='background:#14233D;color:#fff;border-radius:16px;padding:18px 28px;box-shadow:0 8px 20px rgba(20,35,61,.3)'><div class='font-bold' style='font-size:13px;background:rgba(255,255,255,.2);border-radius:6px;padding:4px 12px;margin-right:20px'>BASE</div><div><div class='font-black' style='font-size:23px'>情報レイヤー</div><div style='color:rgba(255,255,255,.8)'>レシピ・レシート・チラシ × POS・EDI・紙・FAX・暗黙知</div></div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "クラシルの役割は、「広告」から「販促」、そして「業務の根幹」へと進化します。市場はメディアの3,000億円から、販促の2兆円、そしてAIエージェントが代替する11.5兆円へ。サービス開始からわずか2ヶ月で、基本合意済みのARRは約1億円。社内ではAIツール利用率100%、Claude Codeの利用は99%、開発生産性は6倍に高まっています。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:#FBF7F2;font-family:sans-serif'><div class='flex items-center' style='gap:12px;padding:32px 48px 0'><div data-animation='animate' data-opacity='0,1' data-scale='0.3,1' data-start='0' data-end='0.4' data-easing='easeOut' style='width:8px;height:36px;background:#F15A2B;border-radius:4px'></div><div data-animation='animate' data-opacity='0,1' data-translate-x='-16,0' data-start='0.05' data-end='0.5' data-easing='easeOut' class='font-black' style='color:#14233D;font-size:36px'>「広告」から「業務の根幹」へ</div><div data-animation='animate' data-opacity='0,1' data-start='0.2' data-end='0.7' class='font-black' style='margin-left:auto;color:#F15A2B;font-size:24px'>クラシル</div></div><div class='flex' style='padding:24px 48px 0;gap:36px'><div style='width:58%'><div data-animation='animate' data-opacity='0,1' data-scale='0.94,1' data-start='0.45' data-end='1.1' data-easing='easeOut' style='background:#fff;border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,.12);padding:12px'><img src='https://assets.st-note.com/img/1777617279-I8HzAVX4pGyEM9k3O2Y76JFw.png?width=1200' style='width:100%;border-radius:8px;display:block'/></div><div style='color:#aaa;font-size:11px;margin-top:8px;text-align:right'>出典：クラシル 決算説明資料</div></div><div style='width:42%'><div data-animation='animate' data-opacity='0,1' data-translate-y='16,0' data-start='0.15' data-end='0.65' data-easing='easeOut' class='flex items-center font-bold' style='gap:8px;color:#14233D;font-size:16px;margin-bottom:16px'><span style='padding:4px 10px;border-radius:6px;background:#e5e5e5'>広告 3,000億</span><span>→</span><span style='padding:4px 10px;border-radius:6px;background:#F5C26B'>販促 2兆</span><span>→</span><span style='padding:4px 10px;border-radius:6px;background:#F15A2B;color:#fff'>11.5兆</span></div><div data-animation='animate' data-opacity='0,1' data-translate-y='16,0' data-start='0.3' data-end='0.8' data-easing='easeOut' style='color:#666;font-size:17px;margin-bottom:18px'>より大きく、より切り替えにくい予算へ領域を拡張する。</div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.45' data-end='1.0' data-easing='easeOut' class='flex items-center' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><span class='font-black' style='color:#F15A2B;font-size:30px;margin-right:14px'>約1億円</span><span style='color:#666;font-size:14px'>開始2ヶ月で基本合意済みARR</span></div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.6' data-end='1.15' data-easing='easeOut' class='flex items-center' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px;margin-bottom:12px'><span class='font-black' style='color:#14233D;font-size:30px;margin-right:14px'><span data-animation='counter' data-from='0' data-to='99' data-decimals='0' data-start='0.65' data-end='1.5' data-easing='easeOut'>0</span>%</span><span style='color:#666;font-size:14px'>社内のClaude Code利用率</span></div><div data-animation='animate' data-opacity='0,1' data-translate-y='20,0' data-start='0.75' data-end='1.3' data-easing='easeOut' class='flex items-center' style='background:#fff;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.06);padding:12px 20px'><span class='font-black' style='color:#14233D;font-size:30px;margin-right:14px'><span data-animation='counter' data-from='0' data-to='6' data-decimals='0' data-start='0.8' data-end='1.6' data-easing='easeOut'>0</span>倍</span><span style='color:#666;font-size:14px'>開発生産性の向上（1年で）</span></div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    },
    {
      "speaker": "Narrator",
      "text": "私たちのビジョンは、10年前から変わりません。80億人に、1日3回の幸せを届ける。レシピ動画から始まり、販促を変え、いま産業のインフラそのものをつくる。クラシルは、AI Supply Chain OS Companyになる。次の10年で、この産業をさらに前へ進めます。",
      "image": {
        "type": "html_tailwind",
        "html": "<div class='relative w-full h-full overflow-hidden' style='background:linear-gradient(135deg,#F15A2B,#FF7A45 60%,#FF9466);font-family:sans-serif'><div class='absolute rounded-full' data-animation='animate' data-opacity='0,0.6' data-scale='0.6,1' data-start='0' data-end='0.9' data-easing='easeOut' style='left:-130px;top:-130px;width:480px;height:480px;background:rgba(255,255,255,.16)'></div><div class='absolute rounded-full' data-animation='animate' data-opacity='0,0.6' data-scale='0.6,1' data-start='0.2' data-end='1.1' data-easing='easeOut' style='right:-120px;bottom:-160px;width:420px;height:420px;background:rgba(255,255,255,.16)'></div><div class='absolute inset-0 flex flex-col justify-center' style='padding:0 96px'><div data-animation='animate' data-opacity='0,1' data-translate-y='-12,0' data-start='0' data-end='0.5' data-easing='easeOut' class='font-bold' style='color:rgba(255,255,255,.9);font-size:24px;margin-bottom:24px'>ビジョンは、10年前から変わらない。</div><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.25' data-end='0.95' data-easing='easeOut' class='font-black' style='color:#fff;font-size:56px;line-height:1.15;margin-bottom:10px'>80億人の暮らしに、</div><div data-animation='animate' data-opacity='0,1' data-translate-y='28,0' data-start='0.45' data-end='1.15' data-easing='easeOut' class='font-black' style='color:#fff;font-size:56px;line-height:1.15;margin-bottom:40px'>1日3回の幸せを届ける。</div><div data-animation='animate' data-opacity='0,1' data-scale='0.9,1' data-start='0.9' data-end='1.55' data-easing='easeOut' style='align-self:flex-start;background:#fff;border-radius:16px;padding:20px 32px;box-shadow:0 10px 30px rgba(0,0,0,.18)'><div class='font-black' style='color:#F15A2B;font-size:34px'>クラシルは、AI Supply Chain OS Company になる。</div></div></div></div>",
        "animation": {
          "fps": 24
        }
      }
    }
  ]
}
```

:::

## まとめ

- note の記事から、ナレーション付きの**動く**プレゼン動画まで、**日本語のお願いだけ**で作れました
- 最初は、**記事の URL とやりたいこと**を伝えるだけです
- 「元スライドを丸ごと使わないで」「数字を強調して」など、**仕上がりの好みは感覚的に伝えるだけで大丈夫です**
- 物足りなければ「動きを付けて」「ここをゆっくり」と、**後から何度でも頼めます**
- 一度で思いどおりにならないこともあります（今回も「アニメOK」と最初に書いたつもりが反映されず、頼み直しました）。**最初のプロンプトにはまだ工夫の余地があります**。見て直すつもりで頼むのがコツです
- むずかしい設定は MulmoClaude が裏側でやってくれます。こちらは**選んで、見て、ひと言いうだけ**です

「動画作りは大変そう」と思っている方こそ、まずは気になる記事の URL を貼って、ひと言お願いしてみてください。

https://github.com/receptron/mulmoclaude

https://mulmocast.com
