# 術語表:一個名詞一句話

新手看到不懂的詞,查這裡。英文保留原文——你在官方文件與社群看到的就是這些字。

## 核心概念

| 術語 | 繁中 | 一句話 |
|---|---|---|
| context / context window | 上下文(視窗) | Claude 的短期記憶容量;對話越長佔越滿,滿了會變笨 → `/compact` |
| token | token(不翻) | 文字的計量單位,約 1 個中文字 ≈ 1~2 token;額度與長度都用它算 |
| prompt | 提示(詞) | 你打給 Claude 的話 |
| CLAUDE.md | (檔名不翻) | 專案的「給 Claude 的說明書」,每次啟動自動載入 |
| memory | 記憶 | Claude 跨對話記住的事;`#` 開頭輸入可快速新增 |
| plan mode | 規劃模式 | 只出計畫不動手;`Shift+Tab` 切換 |
| permission | 權限 | Claude 動手前徵求你同意的機制 |

## 擴充機制

| 術語 | 繁中 | 一句話 |
|---|---|---|
| skill | 技能 | 教 Claude 特定工作流程的說明書包,放在 `.claude/skills/` |
| slash command | 斜線指令 | `/` 開頭的快速指令,可自訂 |
| hook | 掛鉤 | 在特定時機(啟動、工具執行前後)自動跑的腳本 |
| plugin | 外掛 | skill+指令+hook 的打包安裝單位(本專案就是一個) |
| subagent / agent | 子代理 | Claude 派出去獨立做事的分身,各有自己的 context |
| MCP | MCP(不翻) | Model Context Protocol,讓 Claude 連外部工具(資料庫、瀏覽器…)的標準 |
| output style | 輸出風格 | 控制 Claude 回覆風格的設定檔 |

## 工具動作(畫面上會看到的)

| 術語 | 意思 |
|---|---|
| Read / Write / Edit | 讀檔/寫檔/改檔 |
| Bash | 跑終端機指令 |
| Glob / Grep | 找檔案/搜內容 |
| WebFetch / WebSearch | 抓網頁/搜網路 |
| Task / Agent | 派子代理做事 |

## 兩岸用語對照(你可能在簡中教學看到的)

| 簡中教學寫 | 台灣說法 |
|---|---|
| 終端/命令行 | 終端機/命令列 |
| 文件夾、文檔 | 資料夾、文件 |
| 配置 | 設定 |
| 內存 | 記憶體 |
| 調用 | 呼叫 |
| 上下文窗口 | 上下文視窗 |
