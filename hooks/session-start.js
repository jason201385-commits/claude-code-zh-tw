#!/usr/bin/env node
// SessionStart hook:繁中輸出指示 + 首次使用偵測 + 新手引導脈絡。
// 失敗或逾時不影響 Claude Code 運作(hook 失敗只是少了脈絡)。
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const DATA_DIR = path.join(os.homedir(), '.claude', 'zh-tw-guide');
const PROGRESS = path.join(DATA_DIR, 'progress.json');

const VALID_MODES = ['guided', 'basic', 'off'];

function readProgress() {
  try {
    const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
    if (!p || typeof p !== 'object' || Array.isArray(p)) return null;
    // 結構合法但 mode 值壞掉 → 修回 guided,不當成首次使用
    if (VALID_MODES.indexOf(p.mode) === -1) {
      p.mode = 'guided';
      try { fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2)); } catch (e) {}
    }
    return p;
  } catch (e) { return null; }
}

let progress = readProgress();
const firstRun = !progress;
if (firstRun) {
  progress = {
    version: 1,
    firstSeen: new Date().toISOString(),
    mode: 'guided',
    tourDone: false,
    steps: {}
  };
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(PROGRESS, JSON.stringify(progress, null, 2));
  } catch (e) { /* 寫不進去就下次再試,不擋啟動 */ }
}

// off 模式:使用者明確關閉,一句脈絡都不加
if (progress.mode === 'off') process.exit(0);

const root = process.env.CLAUDE_PLUGIN_ROOT || '';
const refs = root
  ? path.join(root, 'skills', 'zh-tw-guide', 'references')
  : '(zh-tw-guide plugin 的 skills/zh-tw-guide/references 目錄)';

const lines = [
  '【zh-tw-guide】使用者偏好台灣繁體中文。',
  '- 一律以繁體中文(台灣用語)回覆;指令、旗標、檔名、程式識別字保留英文原文,必要時附繁中說明。',
  '- 教學資源目錄:' + refs,
  '- 新手進度檔:' + PROGRESS + '(mode: ' + progress.mode + ')',
  '- 零指令入口(重要):新手不必背斜線指令。使用者說「開始」「教我」「帶我上手」→ 直接依 plugin 的 commands/zh-start.md 流程帶首航;說「看不懂這個錯誤」→ 依 commands/zh-explain.md 的三段格式解讀;說「這個畫面是什麼」「介面看不懂」「◯◯ 是什麼」(指螢幕上的英文)→ 依 commands/zh-screen.md + references/screen-map.md 給畫面繁中對照卡;說「不要狗/安靜」→ 依 commands/zh-mode.md 切模式。斜線指令只是捷徑,中文就是介面。'
];

if (progress.mode === 'guided') {
  lines.push('- 新手引導模式:執行工具前用一句話說明目的;高風險動作(刪除、覆寫、git push、安裝套件)先解釋並徵求同意;錯誤發生時給可直接複製執行的修復指令。');
  lines.push('- 三狗溝通層(僅 guided 模式):高風險動作徵求同意前,可加一行「🐕 芝麻提醒:這步會◯◯,看清楚再答應」;解釋錯誤時開頭可加一句「🐶 湯圓:別怕,◯◯很常見」;首航導覽由花生領航。每個回覆最多一句狗語、放在正文外,不影響技術內容;basic/off 模式一律不用。');
  if (!progress.tourDone) {
    lines.push('- 使用者尚未完成首航導覽。若使用者在打招呼或不知道要做什麼,提醒可輸入 /zh-start 進行五分鐘入門(整個 session 最多提一次,不要重複推銷)。');
  }
}

if (firstRun) {
  lines.push('- 這是本機第一次啟用本外掛:以三句話內的繁中歡迎詞開場,說明你會用繁體中文回覆,並提到 /zh-start(入門導覽)與 /zh-help(主題說明)。');
}

// 畫面對照卡:第一次啟用時主動秀一次(看不懂英文介面的人最需要的第一份東西)
if (progress.mode === 'guided' && !progress.screenMapShown) {
  lines.push('- 使用者還沒看過「畫面繁中對照卡」。這個 session 的第一次回覆結尾,主動用一行提一次:「看不懂畫面上的英文?跟我說「這個畫面是什麼」,我給你中文對照卡。」提過就用 Write/Edit 把進度檔的 screenMapShown 設為 true(保留其他欄位),整個 session 只提一次。');
}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join('\n')
  }
}));
