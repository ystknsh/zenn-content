---
title: "npm, npx, yarn の違いと macOS での使い分け"
emoji: "📦"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [macos, nodejs, npm, yarn, homebrew]
published: true
---

ちゃんと理解せずに npm / yarn 等を実施していたので生成AI を活用して整理したものです。記事の最後に Perplexity Sonar Pro によるファクトチェックを入れております。
特にどこにインストールされて、どのフォルダに適用されているのか等に焦点をあてました。

## 1. npm と npx の違い

### 1.1. npm (Node Package Manager)
npm は Node.js のパッケージ管理ツールで、JavaScript のライブラリやツールをインストール・管理するために使われます。

**主な特徴:**
- パッケージのインストール、アンインストール、更新を管理
- `package.json` に依存関係を記録
- グローバルまたはローカルにパッケージをインストール可能

**基本的な使い方:**
```bash
# グローバルインストール
npm install -g パッケージ名

# ローカルインストール
npm install パッケージ名
```

### 1.2. npx (Node Package Execute)
npx は npm 5.2.0 から同梱されたコマンドラインツールで、パッケージを一時的に実行するために使われます。

**主な特徴:**
- パッケージをインストールせずに一時的に実行できる
- ローカルにインストールされたパッケージのバイナリを簡単に実行
- 異なるバージョンのパッケージを一時的に試すのに便利

**基本的な使い方:**
```bash
# インストールせずに一度だけ実行
npx create-react-app my-app
```

### 1.3. npx の動作の仕組み
npx を実行すると、以下の順序で動作します：

1. ローカルの `node_modules/.bin` ディレクトリで指定されたパッケージを探す
2. 見つからない場合、グローバルにインストールされたパッケージを探す
3. それでも見つからない場合、パッケージを一時的にダウンロードして実行し、実行後に削除

頻繁に使用するツールは npm でインストールし、一度だけ使うツールは npx で実行するという使い分けが効率的です。

## 2. npm のプロジェクト管理

### 2.1. package.json の役割
npm はプロジェクトごとに依存関係を管理します。その中心となるのが `package.json` ファイルです。

**package.json の主な役割:**
- プロジェクトの依存関係を記録・管理
- スクリプトを定義（npm run コマンドで実行）
- プロジェクトのメタデータ（名前、バージョン、説明など）を保存
- 他の開発者がプロジェクトを簡単に再現できるようにする

### 2.2. 新しいプロジェクトの始め方
```bash
# 新しいプロジェクトを初期化
npm init

# パッケージのインストール
npm install express
```

`npm init` を実行すると package.json が作成され、その後 `npm install パッケージ名` を実行すると、パッケージが自動的に package.json の dependencies に追加されます。

### 2.3. ダウンロードしたプロジェクトの使い方
GitHub などから package.json を含むプロジェクトをダウンロードした場合：

```bash
# プロジェクトディレクトリに移動
cd プロジェクト名

# 依存関係をインストール
npm install
```

これだけで package.json に記載されているすべての依存関係がインストールされます。

## 3. npm と yarn の違い

yarn は Facebook, Google などが開発した npm の代替パッケージマネージャーです。

**主な違い:**

| 機能 | npm | yarn |
|------|-----|------|
| パッケージのインストール | `npm install` | `yarn` または `yarn install` |
| パッケージの追加 | `npm install パッケージ名` | `yarn add パッケージ名` |
| 開発依存関係の追加 | `npm install --save-dev パッケージ名` | `yarn add --dev パッケージ名` |
| グローバルインストール | `npm install -g パッケージ名` | `yarn global add パッケージ名` |
| パッケージの削除 | `npm uninstall パッケージ名` | `yarn remove パッケージ名` |
| 依存関係の更新 | `npm update` | `yarn upgrade` |
| スクリプト実行 | `npm run スクリプト名` | `yarn スクリプト名` |

当初、yarn は npm より高速で信頼性が高いという利点がありましたが、現在の npm も大幅に改良されており、差は縮まっています。

## 4. macOS でのパッケージ管理ツールの使い分け

macOS には複数のパッケージ管理ツールがあり、混乱しやすいですが、それぞれに役割があります。

### 4.1. Homebrew (brew)
macOS 全般のパッケージ管理に使用します。

**使いどころ:**
- Node.js 自体のインストール
- データベース (MySQL, PostgreSQL など)
- 開発ツール (Git, Docker など)
- macOS アプリケーション

```bash
# Node.js のインストール
brew install node
```

### 4.2. npm/yarn
JavaScript/Node.js プロジェクトの依存関係管理に使用します。

**使いどころ:**
- プロジェクト固有のライブラリ
- Node.js ベースのツール

```bash
# プロジェクト依存関係のインストール
npm install
# または
yarn
```

### 4.3. 混乱を避けるための基本原則

1. **Node.js 自体は Homebrew でインストール**
2. **npm と yarn は併用しない** - プロジェクトごとに一貫して使用
3. **グローバルツールのインストール優先順位**
   - Homebrew で提供されているなら Homebrew を使う
   - Node.js ツールなら npm/yarn のどちらか一方を使う

## 5. インストールツールの確認方法

どのツールでインストールしたかを確認する方法をいくつか紹介します。

### 5.1. Homebrew でインストールしたパッケージの確認
```bash
# インストール済みのパッケージ一覧
brew list

# 特定のパッケージがインストールされているか確認
brew list | grep パッケージ名
```

### 5.2. npm でグローバルインストールしたパッケージの確認
```bash
# グローバルインストール済みのパッケージ一覧
npm list -g --depth=0
```

### 5.3. yarn でグローバルインストールしたパッケージの確認
```bash
# グローバルインストール済みのパッケージ一覧
yarn global list
```

### 5.4. Node.js のインストール元を確認
```bash
# Node.js のパス確認
which node

# Node.js のバージョン確認
node -v
```

以上の情報を参考に、最適なツールを選んで効率的な開発環境を構築してください。各ツールの役割を理解し、適切に使い分けることで、macOS での開発作業がよりスムーズになります。

## ファクトチェック by Perplexity Sonar Pro
|元文章|チェック結果|説明|ソース|修正提案|
|---|---|---|---|---|
|npm は Node.js のパッケージ管理ツールで、JavaScript のライブラリやツールをインストール・管理するために使われます。|正確|npmの基本的な説明として正確です。| [^1] [^2]|変更不要|
|npx は npm 5.2.0 から同梱されたコマンドラインツールで、パッケージを一時的に実行するために使われます。|正確|npxの説明として正確です。| [^1] [^3]|変更不要|
|yarn は Facebook, Google などが開発した npm の代替パッケージマネージャーです。|部分的に正確|Yarnの開発元は正確ですが、現在はnpmとの差が縮まっています。| [^2] [^4] [^5]|yarn は Facebook が中心となって開発した npm の代替パッケージマネージャーですが、現在は npm との機能差が小さくなっています。|
|当初、yarn は npm より高速で信頼性が高いという利点がありましたが、現在の npm も大幅に改良されており、差は縮まっています。|正確|現在のnpmとyarnの関係を適切に説明しています。| [^4] [^5]|変更不要|
|macOS には複数のパッケージ管理ツールがあり、混乱しやすいですが、それぞれに役割があります。|正確|macOSのパッケージ管理ツールの状況を適切に説明しています。| [^2] [^6]|変更不要|
|Node.js 自体は Homebrew でインストール|正確|macOSでのNode.jsのインストール方法として適切です。| [^2] [^6]|変更不要|
|npm と yarn は併用しない - プロジェクトごとに一貫して使用|正確|プロジェクト管理の best practice として適切です。| [^4] [^5]|変更不要|

全体として、この文章は npm、npx、yarn、および macOS でのパッケージ管理ツールの使い分けについて正確に説明しています。特に大きな修正は必要ありませんが、Yarn の説明に関して、現在の npm との関係をより明確にする修正を提案しました。

[^1]: https://zenn.dev/88888888_kota/scraps/fe077dc170f93e
[^2]: https://ics.media/entry/13838/
[^3]: https://qiita.com/kohta9521/items/ee3ed4a2360add80ad79
[^4]: https://ja.unixlinux.online/ou/1007001045.html
[^5]: https://blog.morimorig3.com/npm-yarn-npx/
[^6]: https://memoribuka-lab.com/?p=982

