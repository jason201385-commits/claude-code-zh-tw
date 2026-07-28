#!/usr/bin/env node
// 最小回歸測試:hooks 行為 + 詞表產物完整性。零相依,node tests/run-tests.js 直接跑。
// 涵蓋:R1 envelope、R2 code span+哨兵、R3 fence 型別、R4 mode off、
//       R5 progress 壞值修復、R6 術語誤傷、R7 詞表 QA(檔案存在+條目數+禁用詞)。
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = path.join(__dirname, '..');
const PROGRESS = path.join(os.homedir(), '.claude', 'zh-tw-guide', 'progress.json');
let pass = 0, fail = 0;

function runHook(script, input, env) {
  return execFileSync('node', [path.join(ROOT, 'hooks', script)], {
    input: input, encoding: 'utf8',
    env: Object.assign({}, process.env, env || {})
  });
}
function md(payload) { return runHook('message-display.js', JSON.stringify(payload)); }
function check(name, cond, detail) {
  if (cond) { pass++; console.log('PASS ' + name); }
  else { fail++; console.log('FAIL ' + name + (detail ? ' — ' + detail : '')); }
}
function setMode(mode) {
  fs.mkdirSync(path.dirname(PROGRESS), { recursive: true });
  let p = {};
  try { p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8')); } catch (e) {}
  p.version = 1; p.mode = mode;
  if (p.tourDone === undefined) p.tourDone = false;
  fs.writeFileSync(PROGRESS, JSON.stringify(p, null, 2));
}

// 備份使用者的 progress,測完還原
const hadProgress = fs.existsSync(PROGRESS);
const backup = hadProgress ? fs.readFileSync(PROGRESS, 'utf8') : null;

try {
  setMode('guided');

  // R1 envelope:displayContent 必須在 hookSpecificOutput 內
  let out = JSON.parse(md({ session_id: 't', message_id: 'r1', index: 0, final: true, delta: '這個软件很棒\n' }));
  check('R1 官方 envelope', out.hookSpecificOutput
    && out.hookSpecificOutput.hookEventName === 'MessageDisplay'
    && out.hookSpecificOutput.displayContent.indexOf('軟體') !== -1);

  // R2 code span 保護 + 數字不被哨兵吃
  out = JSON.parse(md({ session_id: 't', message_id: 'r2', index: 0, final: true, delta: '改 `软件` 外的软件,120 ms 3 個\n' }));
  let t = out.hookSpecificOutput.displayContent;
  check('R2 code span + 哨兵', t.indexOf('`软件`') !== -1 && t.indexOf('120 ms 3 個') !== -1 && t.indexOf('軟體') !== -1, t);

  // R3 fence 型別:~~~ 內出現 ``` 不關閉
  let o1 = md({ session_id: 't', message_id: 'r3', index: 0, final: false, delta: '開始\n~~~\n软件\n```\n还是软件\n' });
  let o2 = JSON.parse(md({ session_id: 't', message_id: 'r3', index: 1, final: true, delta: '~~~\n出塊软件\n' }));
  check('R3 fence 型別追蹤', o1 === '' && o2.hookSpecificOutput.displayContent.indexOf('出塊軟體') !== -1, o1 || '');

  // R4 mode=off 靜默
  setMode('off');
  out = md({ session_id: 't', message_id: 'r4', index: 0, final: true, delta: '软件\n' });
  check('R4 off 模式靜默', out === '');
  setMode('guided');

  // R5 mode 壞值 → session-start 修復為 guided 且不當首次
  setMode('banana');
  runHook('session-start.js', '', { CLAUDE_PLUGIN_ROOT: ROOT });
  let p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
  check('R5 mode 壞值修復', p.mode === 'guided');

  // R6 台灣正常語句零誤傷(codex 例句)
  out = md({ session_id: 't', message_id: 'r6', index: 0, final: true, delta: '物體質量為 2 公斤,聯絡窗口,登錄體溫,民主化進程,日光標準,櫃內存放備品\n' });
  check('R6 誤傷防護', out === '', out);

  // R7 詞表產物:存在、條目數、禁用詞抽查
  const cli = JSON.parse(fs.readFileSync(path.join(ROOT, 'patcher', 'out', 'cli-translations.zh-TW.json'), 'utf8'));
  const verbs = JSON.parse(fs.readFileSync(path.join(ROOT, 'patcher', 'out', 'verbs.zh-TW.json'), 'utf8'));
  const banned = ['軟件', '視頻', '賬號', '實時', '郵箱', '響應', '蹦迪', '搬磚'];
  const dirty = cli.filter(e => banned.some(w => e.zh.indexOf(w) !== -1));
  check('R7 詞表完整性', cli.length >= 1800 && verbs.verbs.length === 187 && dirty.length === 0,
    'entries=' + cli.length + ' dirty=' + dirty.length);

  // guided 模式 session-start 應含三狗規則
  const ctx = JSON.parse(runHook('session-start.js', '', { CLAUDE_PLUGIN_ROOT: ROOT }));
  check('R8 三狗規則注入', ctx.hookSpecificOutput.additionalContext.indexOf('三狗溝通層') !== -1);
} finally {
  if (hadProgress) fs.writeFileSync(PROGRESS, backup);
  else { try { fs.unlinkSync(PROGRESS); } catch (e) {} }
}

console.log('\n' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
