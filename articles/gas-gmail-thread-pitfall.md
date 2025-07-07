---
title: "同じ件名のメールが処理されない？Gmailスレッド処理の落とし穴を解決"
emoji: "🧵"
type: "tech" # tech: 技術記事 / idea: アイデア
topics: [gas, gmail]
published: true
published_at: 2025-07-08 06:00
---

:::message
筆者の実体験をもとに Claude 4 Sonnet を活用して再編集しました。
:::

## はじめに

この記事は、**Google Apps Scriptを少し触ったことがある方**を対象にしています。

Gmail自動化スクリプトを作成中に「**同じ件名のメールが複数あるのに、1通しか処理されない**」という問題に遭遇しました。原因はGmailの**スレッド機能**にありました。

この記事では、**スレッド処理の落とし穴**と、その解決法について実体験をもとに詳しく解説します。

## 完成したシステムの概要

```javascript
function sendEmailsAsPDF() {
  var label = GmailApp.getUserLabelByName("send to freee");
  var lastRun = PropertiesService.getScriptProperties().getProperty('last_run');
  var currentTime = new Date().toISOString();
  
  var threads = label.getThreads();
  var processedCount = 0;
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    
    // 🔥 重要：スレッド内の全メッセージを処理
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var date = message.getDate();
      
      if (lastRun && new Date(lastRun) >= date) {
        continue;
      }
      
      var subject = message.getSubject();
      
      try {
        var htmlBody = message.getBody();
        var timestamp = Utilities.formatDate(date, "Asia/Tokyo", "yyyyMMdd_HHmmss");
        var blob = HtmlService.createHtmlOutput(htmlBody)
          .getBlob()
          .getAs('application/pdf')
          .setName(subject + "_" + timestamp + ".pdf");

        var emailTo = PropertiesService.getScriptProperties().getProperty('EMAIL_TO');

        MailApp.sendEmail({
          to: emailTo,
          subject: "SendToFreee: " + subject,
          body: "こちらのメールに添付されているPDFファイルをご覧ください。",
          attachments: [blob]
        });
        
        processedCount++;
        
      } catch (error) {
        console.log("❌ エラー (" + subject + "): " + error.toString());
      }
    }
  }
  
  PropertiesService.getScriptProperties().setProperty('last_run', currentTime);
}
```

:::message
**コード内の PropertiesService について**

このコードでは、転送先メールアドレス(`EMAIL_TO`)や最終実行時間(`last_run`)を保存するために `PropertiesService` を利用しています。  
「プロジェクトの設定 > スクリプトプロパティ」から設定できます。
:::

## スレッド処理の落とし穴と解決法

### 問題の発見

最初のコードでは、このような処理をしていました：

```javascript
// ❌ 問題のあるコード
for (var i = 0; i < threads.length; i++) {
  var messages = threads[i].getMessages();
  var message = messages[messages.length - 1]; // 最新のメッセージのみ取得
  
  // 処理...
}
```

**結果：同じ件名のメールが複数あるのに、1通しか処理されない**

### 原因の調査

デバッグ用コードで詳細を確認：

```javascript
function debugSubscriptionEmails() {
  var label = GmailApp.getUserLabelByName("send to freee");
  var threads = label.getThreads();
  
  for (var i = 0; i < threads.length; i++) {
    var messages = threads[i].getMessages();
    
    for (var j = 0; j < messages.length; j++) {
      var message = messages[j];
      var subject = message.getSubject();
      var date = message.getDate();
      
      if (subject.includes("サブスクリプション更新")) {
        console.log("📨 サブスクメール発見:");
        console.log("  スレッド: " + (i+1) + ", メッセージ: " + (j+1) + "/" + messages.length);
        console.log("  件名: " + subject);
        console.log("  受信日時: " + date);
        console.log("  最新メッセージ?: " + (j === messages.length - 1 ? "Yes" : "No"));
      }
    }
  }
}
```

**実行結果：**
```
📨 サブスクメール発見:
  スレッド: 3, メッセージ: 1/2
  件名: サブスクリプション更新のお知らせ
  受信日時: Tue Jul 01 2025 10:56:09 GMT+0900
  最新メッセージ?: No

📨 サブスクメール発見:
  スレッド: 3, メッセージ: 2/2
  件名: サブスクリプション更新のお知らせ
  受信日時: Tue Jul 01 2025 12:14:14 GMT+0900
  最新メッセージ?: Yes
```

**判明した事実：**
- 同じ件名のメールが1つのスレッドにまとめられている
- 最新メッセージのみを処理していたため、古いメールが無視されていた

### 解決策：二重ループによる全メッセージ処理

```javascript
// ✅ 解決後のコード
for (var i = 0; i < threads.length; i++) {
  var messages = threads[i].getMessages();
  
  // スレッド内の全メッセージを処理
  for (var j = 0; j < messages.length; j++) {
    var message = messages[j];
    // 各メッセージを個別に処理
  }
}
```

**学んだこと：**
- Gmailのスレッド機能により、同じ件名のメールは1つのスレッドにまとめられる
- `getMessages()`で取得できる配列には、スレッド内の全メッセージが含まれる
- 全てのメールを処理したい場合は、二重ループが必要

## 実装時のベストプラクティス

### 1. エラーハンドリング

```javascript
var emailTo = PropertiesService.getScriptProperties().getProperty('EMAIL_TO');

if (!emailTo) {
  console.log("❌ エラー: EMAIL_TO が設定されていません");
  continue; // または return
}
```

### 2. 重複処理防止

```javascript
var lastRun = PropertiesService.getScriptProperties().getProperty('last_run');
var currentTime = new Date().toISOString();

// 処理対象の判定
if (lastRun && new Date(lastRun) >= date) {
  continue; // 前回実行後に受信したメールのみ処理
}

// 処理完了後に実行時刻を更新
PropertiesService.getScriptProperties().setProperty('last_run', currentTime);
```

### 3. デバッグ機能の充実

```javascript
function debugAllEmails() {
  console.log("=== 全メール確認 ===");
  
  var label = GmailApp.getUserLabelByName("send to freee");
  var threads = label.getThreads();
  var lastRun = PropertiesService.getScriptProperties().getProperty('last_run');
  
  console.log("総スレッド数: " + threads.length);
  console.log("前回実行時刻: " + lastRun);
  
  // 処理対象メールの一覧表示
  // ...
}
```

## まとめ

Gmail自動化における **スレッド処理の落とし穴** は、頭の痛い問題でしたが、AI を使うことでサクッと解決までいけました。

### 重要なポイント
- **Gmailのスレッド機能を理解する**：同じ件名のメールは1つのスレッドにまとめられる
- **`messages[messages.length - 1]`の罠**：最新メッセージのみでは不十分
- **二重ループの必要性**：スレッド内の全メッセージを処理するため

この知識があれば、Gmail処理で「なぜか一部のメールが処理されない」という問題を回避できます。
