# Layer 2:UI 全面中文化(實驗性,選配)

> ⚠️ **這層不是必需品**。Layer 0+1(plugin 本體)已提供繁中回覆與新手引導,**不碰 Claude Code 本體**。
> 這層會 patch Claude Code 的執行檔字串,屬於實驗性功能:版本更新可能暫時失效(引擎會自動降級,不會弄壞 CLI)。

## 這裡有什麼

| 檔案 | 內容 |
|---|---|
| `out/cli-translations.zh-TW.json` | 1,895 條 UI 字串英→繁中對照(選單、提示、錯誤訊息…) |
| `out/verbs.zh-TW.json` | 187 個台灣口語 spinner 動詞(跑趴中、摸魚中、賣肝中…) |
| `out/tips.zh-TW.json` | 41 條啟動提示繁中版 |
| `out/build-report.json` | 生成報告:翻譯來源統計 + OpenCC 轉換抽查樣本 |
| `build_zh_tw_table.py` | 詞表生成器(要重新生成時才需要) |

翻譯來源優先序:cc-i18n 人工繁中(777 條)→ OpenCC s2twp + 台灣術語修正表(1,118 條)→ 全條目台灣用語正規化 + 大陸梗改寫。

## 怎麼用(站在 taekchef 引擎上)

繁中詞表設計為與 [taekchef/claude-code-zh-cn](https://github.com/taekchef/claude-code-zh-cn)(MIT)的四層引擎相容——該引擎有版本支援矩陣、自動降級(翻不了的保持英文,CLI 絕不會壞)、更新後自動修復。

```bash
# 1. 取得引擎
git clone https://github.com/taekchef/claude-code-zh-cn.git
cd claude-code-zh-cn

# 2. 換入繁中詞表(檔名沿用引擎預期路徑,內容已是繁中)
cp ../claude-code-zh-tw/patcher/out/cli-translations.zh-TW.json cli-translations.json
cp ../claude-code-zh-tw/patcher/out/verbs.zh-TW.json verbs/zh-CN.json
cp ../claude-code-zh-tw/patcher/out/tips.zh-TW.json tips/zh-CN.json

# 3. 依引擎 README 安裝(注意其版本支援矩陣 docs/support-matrix.md)
```

Windows 用 `install.ps1`,macOS/Linux 用 `install.sh`,細節與疑難排解以引擎的 README 為準。

## 重新生成詞表

```bash
pip install opencc-python-reimplemented
git clone --depth 1 https://github.com/taekchef/claude-code-zh-cn vendor/claude-code-zh-cn
git clone --depth 1 https://github.com/joshchaotang/claude-code-i18n vendor/claude-code-i18n
python build_zh_tw_table.py --vendor vendor
```

## 法律邊界(重要)

- 本目錄**只包含翻譯文字與生成腳本**(MIT),不包含 Anthropic 的任何程式碼。
- Claude Code 本體為 © Anthropic PBC,All rights reserved。patch 只能發生在**你自己的機器**上;
  **不得散布 patch 後的 `cli.js` / 執行檔**。
- Anthropic 條款如有變動,以官方為準;正式商用發行前請自行做法律確認。
