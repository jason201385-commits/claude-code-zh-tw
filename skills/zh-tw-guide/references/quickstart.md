# 快速開始(五分鐘版)

> 官方完整版:<https://code.claude.com/docs/zh-TW/quickstart>

## Claude Code 是什麼

在終端機裡工作的 AI 工程師:你用中文描述要做什麼,它會自己讀檔案、改程式、跑指令——每一步都先經過你同意。

## 第一次使用的三件事

1. **移到專案資料夾再啟動**:Claude Code 以「目前資料夾」為工作範圍。
   ```bash
   cd 你的專案 && claude
   ```
2. **先問再改**:第一個任務用唯讀的,例如「這個專案的結構是什麼?」「`index.js` 在做什麼?」——安全、又能看出它的實力。
3. **記住三個保命符**:
   - `Esc`:隨時中斷 Claude 正在做的事
   - 權限詢問可以說「不」:它要動檔案前都會先問
   - git:有 commit 就永遠能反悔(見 `git.md`)

## 新手常見的第一天路線

| 階段 | 做什麼 | 例句 |
|---|---|---|
| 1 | 問專案 | 「這個專案是做什麼的?」 |
| 2 | 唯讀分析 | 「找出處理登入的程式碼並解釋」 |
| 3 | 小修改 | 「幫 `app.js` 的 main 函式加繁中註解」 |
| 4 | 跑測試 | 「跑一下測試,失敗的話解釋原因」 |
| 5 | 存檔 | 「幫我 commit,訊息用繁中」 |

## 讓它每次都說中文

`~/.claude/settings.json` 加一行(這是官方設定,管模型回覆語言):

```json
{ "language": "traditional chinese" }
```

本 plugin 已透過 SessionStart 提示繁中回覆;兩者疊加最穩。

## 下一步

- `/zh-help 指令`:常用指令表
- `/zh-help 權限`:搞懂它為什麼一直問你
- 專案加 `CLAUDE.md`(範本:plugin 的 `templates/CLAUDE.zh-TW.md`):讓 Claude 記住你的專案規則
