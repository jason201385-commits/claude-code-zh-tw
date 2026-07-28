---
description: 切換引導模式:guided(新手)/ basic(只繁中)/ off(關閉)
argument-hint: "guided | basic | off"
---

使用者想切換的模式:$ARGUMENTS

處理 `~/.claude/zh-tw-guide/progress.json` 的 `mode` 欄位:

1. **沒給參數**:讀進度檔,回報目前模式,並用一行說明三種模式的差別,問要切到哪個。
2. **給了參數**(guided / basic / off):
   - 用 Edit 或 Write 工具更新進度檔的 `mode` 欄位(保留其他欄位;檔案不存在就建立完整結構:`{"version":1,"mode":"<新值>","tourDone":false,"steps":{}}`)。
   - 確認訊息一行:「已切換到 X 模式,下個 session 生效(SessionStart 時讀取)」。

三種模式:
- **guided**:繁中回覆 + 新手保護(動作前解釋、高風險先問、錯誤給修復指令)+ 首航提醒 + 三狗溝通層(芝麻守門/花生領航/湯圓安撫,每回覆最多一句)
- **basic**:只保留繁中回覆與術語規則,不做新手提示
- **off**:hooks 全靜默(不注入脈絡、不做顯示層正規化);`/zh-*` 指令與 skill 仍可主動使用。繁中輸出可改用 `settings.json` 的 `language` 設定維持

參數不是這三個值就列出選項請使用者重選,不要猜。
