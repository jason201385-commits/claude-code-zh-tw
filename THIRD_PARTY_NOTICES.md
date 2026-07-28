# 第三方來源聲明(THIRD_PARTY_NOTICES)

本專案的繁中詞表(`patcher/out/`)由以下開源專案的內容衍生。兩者皆為 MIT 授權,原始 copyright 聲明如下。

## 1. taekchef/claude-code-zh-cn

- 來源:<https://github.com/taekchef/claude-code-zh-cn>
- 授權:MIT
- 取用 commit:`07ea085a6838868c6817eeba78f9b416c5ceedf6`(2026-07 snapshot)
- 使用方式:**修改後衍生**——以其 `cli-translations.json`(1,895 條英中對照)、`verbs/zh-CN.json`(187 條)、`tips/zh-CN.json`(41 條)為基底,經 OpenCC s2twp 簡轉繁、台灣術語修正與台灣口語改寫,產出 `patcher/out/` 下的繁中版。
- 本專案未包含其引擎程式碼;Layer 2 使用方式為使用者自行 clone 該引擎(見 `patcher/README.md`)。

## 2. joshchaotang/claude-code-i18n(cc-i18n)

- 來源:<https://github.com/joshchaotang/claude-code-i18n>
- 授權:MIT
- 取用 commit:`cab6f7e02be49d5228050fa16fc5dcf14b3a3cf3`(2026-07 snapshot)
- 使用方式:**部分引用(修改後衍生)**——其 `src/translations/{en,en-technical,zh-TW,zh-TW-technical}.json` 的人工繁中翻譯,經橋接比對後有 777 條進入 `patcher/out/cli-translations.zh-TW.json`,並套用本專案的台灣用語正規化。

## 3. OpenCC(轉換工具)

- 來源:<https://github.com/BYVoid/OpenCC>(經 opencc-python-reimplemented 使用)
- 授權:Apache-2.0
- 使用方式:**建置工具**——僅在生成詞表時使用(s2twp 設定),產出物不包含其程式碼。

## 4. Anthropic Claude Code(非本專案之一部分)

- Claude Code 本體 © Anthropic PBC,All rights reserved(受 Anthropic Commercial Terms 約束)。
- 本專案不包含、不散布 Claude Code 的任何程式碼或其修改版;Layer 2 的 patch 僅發生在使用者本機。
- 教學內容引用之官方文件連結(code.claude.com/docs)版權屬 Anthropic。

## 設計參考(未複製內容)

以下專案提供結構與作法上的啟發,本專案未複製其文字或程式碼:

- [FlorianBruniaux/claude-code-ultimate-guide](https://github.com/FlorianBruniaux/claude-code-ultimate-guide)(CC-BY-SA-4.0)— onboarding 流程結構
- [lhfer/claude-howto-zh-cn](https://github.com/lhfer/claude-howto-zh-cn)(MIT)— 中文新手學習路徑
