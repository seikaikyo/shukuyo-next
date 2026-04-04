---
title: React UI/UX 重新設計（基於 CIS + 原典校正）
type: refactor
status: in-progress
created: 2026-04-04
---

# React UI/UX 重新設計

## 已完成
- [x] 16 頁 wireframe (wireframes/index.html)
- [x] CIS Design Tokens v2 (wireframes/cis-design-tokens.html)
- [x] 非原典內容清理（五行/四象/六害宿/幸運方位色數）
- [x] 七曜全名化（禁止五行單字）
- [x] 特殊日色彩定義（甘露金/金剛紫/羅刹紅/凌犯橘）
- [x] 九曜流年等級修正（dashai-go 已 push）
- [x] CIS skill + hook 建立

## 待實作 — React 前端

### Phase 1: 核心頁面（首頁 + 日運）
- `src/app/page.tsx` — 移除幸運方位/色/數，改為宜忌卡片 + 三九秘法
- `src/app/fortune/daily/page.tsx` — 同上 + 領域分析改為宜忌
- `src/components/shared/` — 新增 SankiCard / AuspiciousCard
- 修正七曜顯示（全名化）
- 特殊日 badge 色彩（kanro/kongou/rasetsu/ryouhan tokens）

### Phase 2: 運勢系列
- weekly / monthly / yearly / decade — 移除四領域，改用原典內容
- lucky / calendar / startup — 調整特殊日色彩
- 統一四等級色（移除 neutral/平）

### Phase 3: 相性 + 企業
- compatibility — 六關係色統一引用 CIS
- company / hr / headhunter — Tier 色統一

### Phase 4: 知識庫 + 靜態頁
- knowledge — 移除四象、修正七曜全名
- about / tech — 更新原典描述

## 影響範圍
- `src/app/**/*.tsx` — 所有頁面
- `src/components/**/*.tsx` — 共用元件
- `src/app/globals.css` — 新增 kanro/kongou/ryouhan CSS 變數
- `src/locales/*.ts` — i18n 鍵值調整

## 測試計畫
1. 每 Phase 完成後 `npx next build` 驗證
2. 深/淺模式切換驗證
3. 三語系切換驗證
4. CIS audit 比對
