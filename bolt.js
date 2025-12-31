// Description:
//   todoを管理できるbotです
// Commands:
//   bot名 add        - todoを作成
//   bot名 done       - todoを完了にする
//   bot名 del        - todoを消す
//   bot名 list       - todoの一覧表示
//   bot名 doneList   - 完了済みtodoを表示する

'use strict';
const bolt = require('@slack/bolt');
const dotenv = require('dotenv');
dotenv.config();
const todo = require('todo');

const app = new bolt.App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: 'debug',
});

// addの繋ぎこみ
app.message(/add (.+)/i, ({context, say}) => {
  const taskName = context.matches[1].trim();
  todo.add(taskName);
  say(`追加しました：${taskName}`);
});

// doneの繋ぎこみ
app.message(/done (.+)/i, ({context, say}) => {
  const taskName = context.matches[1].trim();
  todo.done(taskName);
  say(`完了にしました：${taskName}`);
});

// delの繋ぎこみ
app.message(/del (.+)/i, ({context, say}) => {
  const taskName = context.matches[1].trim();
  todo.del(taskName);
  say(`削除しました：${taskName}`);
});

// listの繋ぎこみ
app.message(/^list/i, ({context, say}) => {
  let taskList = todo.list();
  if (taskList.length === 0) {
    say("（TODO はありません）");
  } else {
    say(taskList.join('\n'));
  }
});

// doneListの繋ぎこみ
app.message(/^donelist/i, ({context, say}) => {
  let sendMessage = todo.donelist().join('\n')
  if (sendMessage === "") {
    say("（完了した TODO はありません）");
  } else {
    say(sendMessage);
  }
});

(async () => {
  await app.start();
  console.log(`⚡️ Slack bot is running`);
})();