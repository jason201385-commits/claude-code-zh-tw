# 疑難排解

> 版本相關問題以官方為準:<https://code.claude.com/docs/zh-TW/quickstart>;回報 bug 用 `/bug`。

## 安裝與啟動

| 症狀 | 最可能原因 | 處理 |
|---|---|---|
| `claude` 不是內部或外部指令 | 沒裝成功或 PATH 沒更新 | 重開終端機;照官方安裝頁重跑安裝指令 |
| 啟動後要求登入 | 尚未認證 | 依畫面指示用瀏覽器登入(用你訂閱 Claude 的帳號) |
| Windows 顯示亂碼 | 終端機編碼不是 UTF-8 | 用 Windows Terminal;或 PowerShell 先執行 `chcp 65001` |
| 一直卡在 thinking | 網路或服務壅塞 | `Esc` 中斷重試;`/status` 看連線狀態 |

## 使用中

| 症狀 | 說明 | 處理 |
|---|---|---|
| 「context low」或回覆變笨 | 對話太長,context 快滿 | `/compact` 壓縮;或 `/clear` 開新對話(專案檔案不會消失) |
| 它改了我不想改的檔案 | 權限放太寬或指令太模糊 | `git diff` 看變更 → 請 Claude 還原;下次指令寫明「只改 X 檔」 |
| 回覆變成英文 | 語言設定未生效 | 確認 `settings.json` 有 `"language"`;或直接說「用繁體中文」 |
| 權限一直問很煩 | 預設安全模式 | 熟悉後用 `Shift+Tab` 切 auto-accept;見 `permissions.md` |
| 指令打了沒反應 | 打錯或該版本沒有 | `/help` 看實際存在的指令(以你的版本為準) |

## 卡住時的萬用三步

1. `Esc` 中斷 → 用中文問 Claude:「剛剛發生什麼事?」
2. 讓它自己診斷:「為什麼會出現這個錯誤?先解釋,不要動手修。」(或直接 `/zh-explain`)
3. 還是不行:`/clear` 開新對話,把問題與錯誤訊息一次貼清楚。

## 求助資源

- 官方繁中文件:<https://code.claude.com/docs/zh-TW/quickstart>
- 回報問題:對話內輸入 `/bug`,或 GitHub `anthropics/claude-code` 開 issue(英文)
