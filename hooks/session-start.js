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
  '- 新手進度檔:' + PROGRESS + '(mode: ' + progress.mode + ')'
];

if (progress.mode === 'guided') {
  lines.push('- 新手引導模式:執行工具前用一句話說明目的;高風險動作(刪除、覆寫、git push、安裝套件)先解釋並徵求同意;錯誤發生時給可直接複製執行的修復指令。');
  if (!progress.tourDone) {
    lines.push('- 使用者尚未完成首航導覽。若使用者在打招呼或不知道要做什麼,提醒可輸入 /zh-start 進行五分鐘入門(整個 session 最多提一次,不要重複推銷)。');
  }
}

if (firstRun) {
  lines.push('- 這是本機第一次啟用本外掛:以三句話內的繁中歡迎詞開場,說明你會用繁體中文回覆,並提到 /zh-start(入門導覽)與 /zh-help(主題說明)。');
}

process.stdout.write(JSON.stringify({
  hookSpecificOutput: {
    hookEventName: 'SessionStart',
    additionalContext: lines.join('\n')
  }
}));
