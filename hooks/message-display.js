#!/usr/bin/env node
// MessageDisplay hook:顯示層術語正規化(中國用語 → 台灣用語)。
// 只改「螢幕上顯示」的文字;transcript 與模型看到的內容不變。
// hook 失敗或逾時,Claude Code 自動顯示原文 — 天然安全降級。
//
// 保護規則:
// 1. fenced code block(``` / ~~~)內的內容完全不動,跨批次狀態存於 tmp。
// 2. 行內 code span(反引號內)不動。
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

const TERMS = require('./terms-zh-tw.json');

function stateFileFor(messageId) {
  return path.join(os.tmpdir(), 'zhtw-guide-fence-' + String(messageId || 'x').replace(/[^a-zA-Z0-9-]/g, ''));
}

function main(raw) {
  let data;
  try { data = JSON.parse(raw); } catch (e) { return; }

  const stateFile = stateFileFor(data.message_id);
  const delta = data.delta;

  if (!delta) {
    if (data.final) { try { fs.unlinkSync(stateFile); } catch (e) {} }
    return;
  }

  let fenceOpen = false;
  try { fenceOpen = fs.readFileSync(stateFile, 'utf8') === '1'; } catch (e) {}

  let changed = false;
  const outLines = [];
  const partsIn = delta.split('\n');

  for (const line of partsIn) {
    if (/^\s*(```|~~~)/.test(line)) {
      fenceOpen = !fenceOpen;
      outLines.push(line);
      continue;
    }
    if (fenceOpen) {
      outLines.push(line);
      continue;
    }
    // 反引號切段:偶數索引在 code span 外,才做替換
    const segs = line.split('`');
    for (let s = 0; s < segs.length; s += 2) {
      for (const pair of TERMS) {
        if (segs[s].indexOf(pair[0]) !== -1) {
          segs[s] = segs[s].split(pair[0]).join(pair[1]);
          changed = true;
        }
      }
    }
    outLines.push(segs.join('`'));
  }

  if (data.final) {
    try { fs.unlinkSync(stateFile); } catch (e) {}
  } else {
    try { fs.writeFileSync(stateFile, fenceOpen ? '1' : '0'); } catch (e) {}
  }

  if (changed) {
    process.stdout.write(JSON.stringify({ displayContent: outLines.join('\n') }));
  }
}

let buf = '';
process.stdin.on('data', function (c) { buf += c; });
process.stdin.on('end', function () { main(buf); });
