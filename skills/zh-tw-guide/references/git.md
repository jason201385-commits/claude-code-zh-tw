# Git:反悔的能力

> 不會 git 也能用 Claude Code,但有 git 的人永遠能反悔。這頁只教「跟 Claude Code 協作最需要的 20%」。

## 為什麼新手更需要 git

Claude 會直接改你的檔案。git 讓每次修改都有「存檔點」——改壞了,一句話就能回去。

## 全部讓 Claude 代勞(推薦新手路線)

你不用背指令,直接用中文說:

| 你說 | 它做 |
|---|---|
| 「幫這個專案啟用版本控制」 | `git init` + 第一次 commit |
| 「存檔」「幫我 commit」 | 檢視變更、寫 commit 訊息、commit |
| 「剛剛改了什麼?」 | `git diff` 並解釋 |
| 「回到上一個存檔點」 | 引導你安全復原(先看狀態再動作) |
| 「開一個分支來試這個想法」 | `git branch` + `git checkout` |

## 自己看得懂的三個指令

```bash
git status    # 現在有哪些檔案被改了
git diff      # 具體改了什麼(+ 是新增,- 是刪除)
git log --oneline -5   # 最近五個存檔點
```

## 新手鐵律

1. **開工前確認有 commit**:請 Claude「先 commit 目前狀態再開始改」。
2. **一個任務一個 commit**:小步存檔,反悔才有細顆粒度。
3. 看到 `push --force`、`reset --hard` 這類字眼先停下問清楚——這兩個會「覆蓋歷史」,是少數真的危險的操作。
