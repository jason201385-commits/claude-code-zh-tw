#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
繁中詞表生成器:把 taekchef/claude-code-zh-cn 的簡中翻譯表轉成台灣繁中版。

翻譯優先序(每一條 en 字串):
  1. cc-i18n 的 zh-TW-technical(人工繁中,字面風格)— en 原文完全相符才用
  2. cc-i18n 的 zh-TW(人工繁中,口語風格)
  3. OpenCC s2twp(簡→繁+台灣用語)轉換 taekchef 的簡中,再套術語修正表

輸出(schema 與 taekchef 相同;覆蓋進 fork 時需改成引擎預期的檔名,
見 patcher/README.md 的 cp 指令):
  out/cli-translations.zh-TW.json  → 引擎的 cli-translations.json
  out/verbs.zh-TW.json             → 引擎的 verbs/zh-CN.json
  out/tips.zh-TW.json              → 引擎的 tips/zh-CN.json
  out/build-report.json(來源統計,供人工抽查)

用法:
  python build_zh_tw_table.py --vendor <含兩個上游 repo 的目錄> [--out out]
"""
import argparse
import json
import sys
from pathlib import Path

try:
    from opencc import OpenCC
except ImportError:
    sys.exit("需要 opencc:pip install opencc-python-reimplemented")

CC = OpenCC("s2twp")

# s2twp 轉完後的台灣術語再修正(補 s2twp 不處理的詞)。
# ⚠️ 依序套用,長詞在前。
# 注意:file/document(文件/文檔/文件名)不要在這裡做全域替換——
# s2twp 的片語庫已依上下文正確分辨(打开文件→開啟檔案、查看文档→檢視文件、文件名→檔名),
# 全域規則反而會把 documentation 誤殺成「檔案」(QA 實測抓到 7 條)。
TERM_FIXES = [
    # 長詞優先
    ("配置檔案", "設定檔"), ("的設定檔案", "的設定檔"),
    ("源代碼", "原始碼"), ("字符串", "字串"),
    # 一般術語
    ("代碼", "程式碼"), ("字符", "字元"),
    ("視頻", "影片"), ("音頻", "音訊"),
    ("用戶", "使用者"), ("登錄", "登入"),
    ("函數", "函式"), ("變量", "變數"),
    ("組件", "元件"), ("插件", "外掛"),
    ("回調", "回呼"), ("異步", "非同步"),
    ("緩存", "快取"), ("鏈接", "連結"),
    ("接口", "介面"), ("端口", "連接埠"),
    ("窗口", "視窗"), ("菜單", "選單"),
    ("默認", "預設"), ("設置", "設定"),
    ("配置", "設定"), ("會話", "工作階段"),
    ("撤銷", "復原"),
    ("跟蹤", "追蹤"), ("加載", "載入"),
    ("刷新", "重新整理"), ("保存", "儲存"),
    ("創建", "建立"), ("查找", "尋找"),
    ("運行", "執行"), ("重命名", "重新命名"),
    ("拷貝", "複製"), ("粘貼", "貼上"),
    ("剪切", "剪下"), ("單擊", "點選"),
    ("雙擊", "按兩下"),
]


# 最終正規化:套用在「所有」輸出條目(含 cc-i18n 人工翻譯來源),
# 修 s2twp 與人工翻譯都會殘留的中國味。長詞在前。
NORMALIZE_ALL = [
    ("請訪問", "請前往"), ("訪問", "存取"),
    ("許可權", "權限"), ("倉庫", "儲存庫"),
    ("沙箱", "沙盒"), ("當前", "目前"),
    ("只讀", "唯讀"), ("退出", "離開"),
    ("點擊", "點選"), ("自定義", "自訂"),
    ("想象", "想像"),
]

# spinner 動詞的台灣口語改寫(大陸網路梗 → 台灣說法),套用在 to_tw 之後
VERB_OVERRIDES = {
    "犯暈中": "放空中", "焯水ing": "川燙中", "蹦迪中": "跑趴中",
    "瞎忙活中": "瞎忙中", "沏茶中": "泡茶中", "掘進中": "挖礦中",
    "膩歪中": "耍廢中", "磨磨唧唧中": "拖拖拉拉中", "幹活中": "上工中",
    "磨洋工中": "摸魚中", "忽悠中": "唬爛中", "嘰裡呱啦中": "嘰哩呱啦中",
    "懵圈中": "傻眼中", "撲稜中": "振翅中", "撒歡中": "玩瘋中",
    "掛霜中": "裹糖霜中", "到處溜達中": "到處閒晃中", "比劃中": "比手畫腳中",
    "跳吉特巴中": "跳恰恰中", "溜溜達達中": "慢慢晃中", "瞎琢磨中": "東想西想中",
    "磨蹭中": "慢吞吞中", "花裡胡哨中": "花俏中", "聯網中": "連線中",
    "搬磚中": "賣肝中", "蹦躂中": "蹦蹦跳跳中", "搞事情中": "搞怪中",
    "鼓搗中": "敲敲打打中", "那個啥來著中": "想不起來中", "磨嘰中": "拖戲中",
    "搞事業中": "拚事業中",
}


def normalize(text: str) -> str:
    for a, b in NORMALIZE_ALL:
        if a in text:
            text = text.replace(a, b)
    return text


def to_tw(text: str) -> str:
    out = CC.convert(text)
    for a, b in TERM_FIXES:
        if a != b and a in out:
            out = out.replace(a, b)
    return out


def flatten(d, prefix=""):
    out = {}
    for k, v in d.items():
        if k == "_meta":
            continue
        if isinstance(v, dict):
            out.update(flatten(v, prefix + k + "."))
        elif isinstance(v, str):
            out[prefix + k] = v
    return out


def bridge(en_path: Path, tw_path: Path):
    """cc-i18n 的兩份檔案 → {en 原文: zh-TW 譯文}。同一 en 原文對到多種譯文時保留第一個並計數。"""
    en = flatten(json.loads(en_path.read_text(encoding="utf-8")))
    tw = flatten(json.loads(tw_path.read_text(encoding="utf-8")))
    out, conflicts = {}, 0
    for k in en:
        if k not in tw:
            continue
        if en[k] in out:
            if out[en[k]] != tw[k]:
                conflicts += 1
            continue
        out[en[k]] = tw[k]
    if conflicts:
        print(f"  (bridge {en_path.name}: {conflicts} 個同文異譯衝突,保留首見譯文)")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--vendor", required=True, help="含 claude-code-zh-cn 與 claude-code-i18n 的目錄")
    ap.add_argument("--out", default=str(Path(__file__).parent / "out"))
    args = ap.parse_args()

    vendor = Path(args.vendor)
    tk = vendor / "claude-code-zh-cn"
    cc = vendor / "claude-code-i18n" / "src" / "translations"
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    cc_tech = bridge(cc / "en-technical.json", cc / "zh-TW-technical.json")
    cc_std = bridge(cc / "en.json", cc / "zh-TW.json")

    # --- cli-translations ---
    entries = json.loads((tk / "cli-translations.json").read_text(encoding="utf-8"))
    result, stats = [], {"cc_technical": 0, "cc_standard": 0, "opencc": 0}
    samples = []
    for e in entries:
        en, zh = e["en"], e["zh"]
        if en in cc_tech:
            tw, src = cc_tech[en], "cc_technical"
        elif en in cc_std:
            tw, src = cc_std[en], "cc_standard"
        else:
            tw, src = to_tw(zh), "opencc"
        stats[src] += 1
        final = normalize(tw)
        result.append({"en": en, "zh": final})
        if len(samples) < 40 and src == "opencc" and final != zh:
            samples.append({"en": en, "zh_cn": zh, "zh_tw": final})

    (out_dir / "cli-translations.zh-TW.json").write_text(
        json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # --- verbs(趣味 spinner 動詞)---
    verbs = json.loads((tk / "verbs" / "zh-CN.json").read_text(encoding="utf-8"))
    converted = [normalize(to_tw(v)) for v in verbs.get("verbs", [])]
    # 台灣口語改寫的鍵是「轉換後」字串,OpenCC 版本差異可能讓鍵對不上 →
    # 一定要 fail-loud,不允許靜默漏改(QA 建議)
    missed = [k for k in VERB_OVERRIDES if k not in converted]
    if missed:
        sys.exit(f"VERB_OVERRIDES 有 {len(missed)} 個鍵未命中(OpenCC 版本差異?):{missed}")
    verbs["verbs"] = [VERB_OVERRIDES.get(v, v) for v in converted]
    (out_dir / "verbs.zh-TW.json").write_text(
        json.dumps(verbs, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    # --- tips ---
    tips = json.loads((tk / "tips" / "zh-CN.json").read_text(encoding="utf-8"))
    for t in tips.get("tips", []):
        t["text"] = normalize(to_tw(t["text"]))
    (out_dir / "tips.zh-TW.json").write_text(
        json.dumps(tips, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    report = {
        "total_cli_entries": len(result),
        "source_breakdown": stats,
        "verbs": len(verbs.get("verbs", [])),
        "tips": len(tips.get("tips", [])),
        "opencc_samples_for_review": samples,
    }
    (out_dir / "build-report.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"cli-translations: {len(result)} 條 | 來源: {stats}")
    print(f"verbs: {report['verbs']} | tips: {report['tips']}")
    print(f"輸出目錄: {out_dir}")


if __name__ == "__main__":
    main()
