---
title: Phase 4 基礎設施整合（Sentry + Logto + Analytics）
type: feature
status: completed
created: 2026-03-30
---

# Phase 4 基礎設施整合

## 背景

功能遷移 Phase 0-4 已完成，但基礎設施尚未接線：
- Sentry 錯誤追蹤（未安裝）
- Logto 認證（已安裝 @logto/next 未接線）
- Vercel Analytics + Speed Insights（已安裝未接線）
- next-intl（已安裝但用自建 i18n，確認是否需要）

## 變更內容

| 項目 | 說明 |
|------|------|
| Sentry | 安裝 @sentry/nextjs，設定 DSN + instrumentation |
| Logto | 接線 @logto/next，API route + middleware + provider |
| Analytics | layout.tsx 加入 Analytics + SpeedInsights 元件 |
| i18n 確認 | 自建 i18n 已運作，next-intl 未使用，評估是否移除 |
| 功能驗證 | 每個 API endpoint 回應與 Vue 版一致 |
| 效能比對 | Lighthouse >= 85 |

## 影響範圍

- `next.config.ts` — Sentry plugin 包裝
- `src/instrumentation.ts` — Sentry server-side init (Next.js 16 convention)
- `src/app/global-error.tsx` — Sentry error boundary
- `src/app/layout.tsx` — Analytics + SpeedInsights 元件
- `src/app/api/logto/[action]/route.ts` — Logto callback route
- `src/lib/logto.ts` — Logto config
- `src/middleware.ts` — Logto session middleware (評估需求)

## 測試計畫

1. `npx next build` 零錯誤
2. Sentry: 手動觸發錯誤確認 DSN 連通
3. Logto: OAuth flow 完整（login → callback → session → logout）
4. Analytics: build 後確認 script 注入
5. 三尺寸截圖驗證
6. Lighthouse >= 85
