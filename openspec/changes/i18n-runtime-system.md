---
title: i18n Runtime 系統建置
type: feature
status: completed
created: 2026-03-30
---

# i18n Runtime 系統建置

## 背景

locale 檔案（zh-TW/en/ja）已存在且有 300+ key，但整個 app 沒有 i18n runtime — 所有 UI 字串都是硬編碼中文。store 的 `locale` 只傳給 API 的 `lang` 參數，前端介面不會跟著切換。

## 變更內容

| 項目 | 說明 |
|------|------|
| i18n Provider | 建立 `useTranslation()` hook + React Context，從 store.locale 讀取 |
| Locale 載入 | dynamic import locale JSON，避免三語言全部打包 |
| 全站改寫 | 300+ 硬編碼字串改為 `t('key')` 呼叫 |
| Navbar 連動 | LocaleSwitcher 切換後 UI 即時更新 |
| 缺 key 補齊 | 新元件（company/calendar/pair-lucky-days）的字串補進 3 份 locale |

## 影響範圍

- `src/lib/i18n.tsx` — 新增 Provider + hook
- `src/app/layout.tsx` — 包 Provider
- `src/app/**/*.tsx` — 全部頁面（~17 頁）
- `src/components/**/*.tsx` — 全部元件（~20 個）
- `src/locales/*.ts` — 補齊缺 key

## 測試計畫

1. 切換語言後所有頁面文字即時更新
2. 重新整理後語言偏好保留（localStorage）
3. API 回傳語言與 UI 語言一致
4. 無 key 時 fallback 到 zh-TW
5. 建構零錯誤

## 預估規模

- 修改檔案：~40 個
- 新增檔案：1-2 個（provider + hook）
- 修改比例：~5%（大量但機械式替換）
