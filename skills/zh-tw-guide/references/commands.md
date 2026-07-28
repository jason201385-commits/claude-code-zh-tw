# 常用指令與快捷鍵

> 完整清單以官方為準:<https://code.claude.com/docs/zh-TW/commands>(指令會隨版本增減,以下只列高頻穩定的)

## 斜線指令(輸入 `/` 開頭)

| 指令 | 用途(繁中說明) |
|---|---|
| `/help` | 官方說明(英文);要繁中版用 `/zh-help` |
| `/clear` | 清空對話重新開始(專案不受影響) |
| `/compact` | 壓縮對話歷史,釋放 context 空間 |
| `/init` | 讓 Claude 分析專案、產生 `CLAUDE.md` |
| `/config` | 開設定面板(模型、語言等) |
| `/resume` | 接續上次的對話 |
| `/powerup` | 官方互動教學(英文動畫版;繁中入門用 `/zh-start`) |
| `/plugin` | 管理外掛 |

本 plugin 加的:`/zh-start`(首航)、`/zh-help`(主題說明)、`/zh-explain`(錯誤解讀)、`/zh-mode`(模式切換)。

## 快捷鍵

| 按鍵 | 用途 |
|---|---|
| `Esc` | 中斷 Claude 目前的動作 |
| `Esc` 兩下 | 跳回歷史訊息重改 |
| `Shift+Tab` | 切換 default / auto-accept / plan 模式 |
| `Ctrl+C` | 取消輸入或離開 |
| `#` 開頭輸入 | 快速把一條規則存進 CLAUDE.md(記憶) |
| `!` 開頭輸入 | 直接跑終端機指令不經過 Claude |

## 給它任務的技巧

- 具體勝過禮貌:「幫 `login.js` 加上錯誤處理,失敗時顯示繁中訊息」優於「可以幫我改善程式嗎」。
- 大任務先 plan mode(`Shift+Tab` 切到 plan),看完計畫再放行。
- 引用檔案用 `@檔名`,它會直接讀取。
