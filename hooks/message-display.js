#!/usr/bin/env node
// MessageDisplay hook:顯示層術語正規化(中國用語 → 台灣用語)。
// 只改「螢幕上顯示」的文字;transcript 與模型看到的內容不變。
// hook 失敗或逾時,Claude Code 自動顯示原文 — 天然安全降級。
//
// 保護規則:
// 1. /zh-mode off 時完全靜默(讀 progress.json 的 mode)。
// 2. fenced code block(``` / ~~~)內容不動;記住開啟的 delimiter,
//    只有同型 delimiter 才會關閉(跨批次狀態存於 tmp,10 分鐘 TTL)。
// 3. 行內 code span(單/多反引號)以 NUL 哨兵遮罩後不動。
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const TERMS = require('./terms-zh-tw.json');
const PROGRESS = path.join(os.homedir(), '.claude', 'zh-tw-guide', 'progress.json');
const STATE_TTL_MS = 10 * 60 * 1000;
const NUL = String.fromCharCode(0); // 正常文字不會出現,placeholder 不怕撞衫

function modeIsOff() {
  try {
    const p = JSON.parse(fs.readFileSync(PROGRESS, 'utf8'));
    return p && p.mode === 'off';
  } catch (e) { return false; }
}

function stateFileFor(data) {
  const id = (String(data.session_id || '') + '-' + String(data.message_id || 'x'))
    .replace(/[^a-zA-Z0-9-]/g, '');
  return path.join(os.tmpdir(), 'zhtw-guide-fence-' + id);
}

function readFenceState(file) {
  try {
    const st = fs.statSync(file);
    if (Date.now() - st.mtimeMs > STATE_TTL_MS) { fs.unlinkSync(file); return ''; }
    const v = fs.readFileSync(file, 'utf8');
    return v === '```' || v === '~~~' ? v : '';
  } catch (e) { return ''; }
}

function applyTerms(text) {
  let changed = false;
  for (const pair of TERMS) {
    if (text.indexOf(pair[0]) !== -1) {
      text = text.split(pair[0]).join(pair[1]);
      changed = true;
    }
  }
  return { text: text, changed: changed };
}

function transformLine(line) {
  // 遮罩行內 code span(支援多反引號,如雙反引號包單反引號)
  const spans = [];
  const masked = line.replace(/(`+)[^`]*?\1/g, function (m) {
    spans.push(m);
    return NUL + (spans.length - 1) + NUL;
  });
  const r = applyTerms(masked);
  const unmaskRe = new RegExp(NUL + '(\\d+)' + NUL, 'g');
  const restored = r.text.replace(unmaskRe, function (_, i) { return spans[+i]; });
  return { text: restored, changed: r.changed };
}

function main(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (e) { return; }

  const stateFile = stateFileFor(data);
  const delta = data.delta;

  if (modeIsOff() || !delta) {
    if (data && data.final) { try { fs.unlinkSync(stateFile); } catch (e) {} }
    return;
  }

  let fence = readFenceState(stateFile); // '' | '```' | '~~~'
  let changed = false;
  const outLines = [];

  for (const line of delta.split('\n')) {
    const m = line.match(/^\s*(```|~~~)/);
    if (m) {
      if (!fence) fence = m[1];            // 開啟
      else if (fence === m[1]) fence = ''; // 同型 delimiter 才關閉
      outLines.push(line);
      continue;
    }
    if (fence) { outLines.push(line); continue; }
    const r = transformLine(line);
    if (r.changed) changed = true;
    outLines.push(r.text);
  }

  if (data.final) {
    try { fs.unlinkSync(stateFile); } catch (e) {}
  } else {
    try { fs.writeFileSync(stateFile, fence || '0'); } catch (e) {}
  }

  if (changed) {
    process.stdout.write(JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'MessageDisplay',
        displayContent: outLines.join('\n')
      }
    }));
  }
}

let buf = '';
process.stdin.on('data', function (c) { buf += c; });
process.stdin.on('end', function () { main(buf); });
