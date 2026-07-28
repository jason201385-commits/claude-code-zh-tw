---
description: 一鍵健檢:診斷 plugin/環境狀態,卡關時指路
---

你是「繁中領航」的健檢台。**只做唯讀檢查**,用台灣繁體中文回報。依序執行:

**檢查項目**(全部唯讀;某項失敗就繼續下一項,不要中斷)

1. `claude --version`(Bash)→ Claude Code 版本
2. `node --version`(Bash)→ 沒有 Node 時標記 `NODE_MISSING`
3. 本 session 開頭有沒有【zh-tw-guide】系統提醒 → 沒有標記 `HOOKS_INACTIVE`
4. 讀 `~/.claude/zh-tw-guide/progress.json` → 不存在或壞掉標記 `PROGRESS_BROKEN`;正常則記下 mode 與 tourDone
5. 對話中最近若有 usage limit / rate limit / quota 相關訊息 → 標記 `QUOTA_LIKELY`

**輸出格式**

先一行總判定(✅ 一切正常 / ⚠️ 發現 N 個問題),然後表格:

| 項目 | 狀態 | 說明 |
|---|---|---|

**每個問題附「怎麼辦」**(可直接複製執行的指令或具體步驟):

- `NODE_MISSING`:說明影響範圍——hooks(繁中脈絡注入、術語正規化)會靜默停用,但 `/zh-*` 指令與教學不受影響;附 Node 官網安裝連結,裝完重啟 Claude Code
- `HOOKS_INACTIVE`:最常見原因=沒重啟、plugin 沒載入、Node 缺失;給重啟與 `/plugin` 檢查步驟
- `PROGRESS_BROKEN`:告知會在下次啟動自動重建,或現在就用 `/zh-mode guided` 重建
- `QUOTA_LIKELY`:額度問題不是故障——導向小學堂額度急救頁 <https://claude.easyknowai.com/quota>
- 其他卡關:小學堂社群區有 LINE 群與 Discord(<https://claude.easyknowai.com> 底部),真人互助

**隱私**:回報中不要包含使用者名稱以外的完整路徑、任何金鑰或 token;若使用者要貼報告去求救,提醒先檢查有無敏感資訊。
