# claude-code-zh-tw ・ Claude Code 繁中領航

**讓 Claude Code 說台灣話,讓新手五分鐘上手。**

[「Claude Code 新手小學堂」](https://claude.easyknowai.com)畢業後的**繁中護航包**:繁中回覆、`/zh-start` 首航導覽、`/zh-help` 主題教學、`/zh-doctor` 一鍵健檢、三狗溝通層(花生/芝麻/湯圓),以及選配的 UI 中文化詞表。MIT 授權。

> 還沒碰過 Claude Code?先去[小學堂](https://claude.easyknowai.com)走 6 課零終端機教學(免費、有狗狗助教),畢業再回來裝這包。

## 為什麼需要這個

- Claude Code 官方**沒有中文介面**(i18n feature request 長期未排入),只有 `language` 設定管模型回覆語言。
- 官方的 `/powerup` 互動教學是英文;繁中教學資源散落各處。
- 簡中社群有 UI 漢化方案,但**繁中(台灣用語)+ 新手引導的一體包不存在**——這個專案補上這塊。

## 四層架構(風險由低到高,預設只開安全層)

| 層 | 做什麼 | 動到什麼 | 預設 |
|---|---|---|---|
| 0 | 模型回覆繁中化 | `settings.json` 的 `language`(官方設定,建議搭配) | 建議開 |
| 1 | 新手引導 + 繁中脈絡 | 本 plugin(hooks + 指令 + skill),**不碰 CC 本體** | ✅ 開 |
| 1.5 | 顯示層術語正規化 | 只改螢幕顯示(軟件→軟體),transcript 不變 | ✅ 開 |
| 2 | UI 選單/提示全繁中 | patch CC 執行檔字串(實驗性,見 `patcher/`) | ❌ 選配 |

## 安裝

### 方式一:官方 plugin marketplace(推薦)

在 Claude Code 裡輸入兩行,全程有官方信任提示、可更新可移除:

```
/plugin marketplace add jason201385-commits/claude-code-zh-tw
/plugin install claude-code-zh-tw@easyknowai
```

### 方式二:開發者免安裝載入

clone 到 `~/.claude/skills/`(全域)或專案 `.claude/skills/`(單一專案),重啟 Claude Code 即自動載入:

```bash
git clone https://github.com/jason201385-commits/claude-code-zh-tw ~/.claude/skills/claude-code-zh-tw
```

> - 需要 Node.js(hooks 用;沒有 Node 時 hooks 靜默停用,指令與教學仍可用——跑 `/zh-doctor` 會告訴你現在的狀態)。
> - 指令在選單顯示為 `/claude-code-zh-tw:zh-start` 形式;沒有撞名時直接打 `/zh-start` 也通(Claude Code v2.1.216+)。

## 提供的指令

| 指令 | 用途 |
|---|---|
| `/zh-start` | 五分鐘新手首航:認識畫面 → 唯讀任務 → 第一個修改 → 安全網 → 繁中 CLAUDE.md |
| `/zh-help [主題]` | 繁中主題說明:快速開始/權限/指令/Git/錯誤/術語 |
| `/zh-explain` | 用繁中解釋剛才的錯誤(只解釋,不自動修) |
| `/zh-doctor` | 一鍵健檢:版本/Node/hooks/進度檔/額度,問題附修法與求助管道 |
| `/zh-mode guided\|basic\|off` | 切換引導強度(新手保護/只繁中/完全關閉) |

## 三狗溝通層 🐕

Jason 家三隻真狗(在[小學堂](https://claude.easyknowai.com)當 AI 助教的同一批),在終端機裡輕量登場——**只在 guided 模式出聲、每次最多一句、永遠不擋技術內容**:

| 狗 | 職能 | 出場時機 |
|---|---|---|
| 花生 | 領航 | `/zh-start` 首航導覽 |
| 芝麻 | 守門 | 高風險動作前的一句提醒 |
| 湯圓 | 安撫 | `/zh-explain` 與錯誤解讀的開場 |

不想要?`/zh-mode basic` 一秒安靜,只留繁中。

## 搭配官方設定(建議)

`~/.claude/settings.json`:

```json
{ "language": "traditional chinese" }
```

## 進度與模式

新手進度存在 `~/.claude/zh-tw-guide/progress.json`(完成首航、目前模式)。
guided 模式下 Claude 會:動作前說明目的、高風險動作先徵求同意、錯誤時給可複製的修復指令。老手用 `/zh-mode basic` 或 `off` 關掉提示。

## UI 全面中文化(Layer 2,選配)

`patcher/out/` 內含 1,895 條 UI 字串繁中對照 + 187 個台灣口語 spinner(跑趴中、摸魚中、賣肝中…)+ 41 條繁中提示,與 [taekchef/claude-code-zh-cn](https://github.com/taekchef/claude-code-zh-cn) 的四層 patch 引擎相容。用法與法律邊界見 [patcher/README.md](patcher/README.md)。

## 常見問題

**會多花 token 嗎?** Layer 1 的 SessionStart 脈絡約數百 token/session;術語正規化與 Layer 2 是本機字串處理,零 token。

**會弄壞 Claude Code 嗎?** Layer 0/1 完全不碰 CC 本體;hooks 失敗時 CC 自動顯示原文、正常運作。Layer 2 沿用 taekchef 引擎的自動降級設計,並可隨時 unpatch。

**跟官方文件會脫節嗎?** 教學內容只放「高頻穩定」的部分,版本相關細節一律深連結官方繁中文件(code.claude.com/docs/zh-TW)。

## 授權

- 本專案:MIT(見 [LICENSE](LICENSE))
- 詞表衍生來源與工具:見 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)
- Claude Code 本體 © Anthropic PBC——本專案不包含其任何程式碼

---

Made in Taiwan 🇹🇼 by [Jason Chiu(魯班)/ easyknowai](https://github.com/jason201385-commits)
