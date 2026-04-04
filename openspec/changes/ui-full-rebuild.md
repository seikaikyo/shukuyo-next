---
title: 宿曜道前端 UI 全面重建
type: refactor
status: completed
created: 2026-04-04
---

# 宿曜道前端 UI 全面重建

## 變更內容
砍掉 src/app/ 和 src/components/ 全部重做，依 wireframe + CIS v2 設計規範重建 16 頁 UI。

## 原因
前版 hydration 問題（skeleton 卡住）疑似架構性 bug，與其修補直接重建。
同時清理非原典內容（五行/四象/六害宿），統一用 CIS CSS 變數取代 hardcode 色。

## 保留
- src/hooks/ — Go API hooks
- src/types/ — TypeScript 型別
- src/stores/profile.ts — Zustand persist
- src/locales/ — i18n 三語翻譯
- src/lib/ — i18n.tsx, utils.ts, logto.ts
- src/config/api.ts — API fetch helper
- src/data/ — JSON 資料檔
- src/utils/ — date, ics-generator 等工具
- src/constants/ — kuyou.ts

## 砍掉重做
- src/app/ — 全部頁面
- src/components/ — 全部元件

## 設計依據
- wireframes/index.html — 16 頁 wireframe（和風/黒金雙主題）
- wireframes/cis-design-tokens.html — CIS v2（C1-C7 token）
- globals.css 已定義完整 oklch 色彩系統（保留不動）

## 影響範圍
- src/app/**
- src/components/**

## 實作順序
1. Phase 1: layout.tsx + shared components (navbar/footer/bottom-tabs) + 首頁
2. Phase 2: fortune 子頁（daily/weekly/monthly/yearly/decade）
3. Phase 3: fortune 子頁（lucky/calendar/startup）
4. Phase 4: compatibility + company + headhunter + hr
5. Phase 5: knowledge + about + tech
6. Phase 6: error boundaries + API routes (保留既有 logto routes)

## 測試計畫
1. 每完成一頁 `npx next build` 驗證
2. 確認 hydration 正常（無 mismatch warning）
3. 三尺寸截圖驗證（375/768/1280）

## Checklist
- [x] Phase 1: layout + 首頁
- [x] Phase 2: fortune 日/週/月/年/十年
- [x] Phase 3: fortune 吉日/日曆/創業
- [x] Phase 4: 相性/企業/HR/獵頭
- [x] Phase 5: 知識庫/關於/技術
- [x] Phase 6: error + API routes (Phase 1 已含)
