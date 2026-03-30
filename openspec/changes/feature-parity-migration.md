---
title: Vue → Next.js 功能完整度補齊
type: feature
status: in-progress
created: 2026-03-30
---

# Vue → Next.js 功能完整度補齊

## 背景

shukuyo-next (Next.js 16 + React 19 + shadcn/ui) 平行遷移版與舊版 (Vue 3 + PrimeVue) 功能落差過大。
本提案規劃分階段補齊所有核心功能，確保遷移後使用者體驗不退步。

**設計原則：**
- 宿曜道核心精神 = 二十七宿 + 六種關係，不混入五行等其他命理體系
- 不搬 V2 preview 頁面（新版本身就是 V2）
- 不搬 Logto 認證/雲端同步（Phase 3 再評估）
- 舊版有但設計不佳的功能，趁遷移一併改良

## Phase 0 — 相性頁深度內容 (已部分完成，補齊)

> 新版 pair-result.tsx 已有角色指南和經典解讀，但缺配對吉日和雙方透視

### 變更內容

| 項目 | 說明 | 對應舊版元件 |
|------|------|-------------|
| PairLuckyDays | 雙人吉日查詢（約會/合作/避開日） | PairLuckyDays.vue |
| PairPerspectives | 甲看乙 vs 乙看甲的雙向分析卡片 | PairPerspectives.vue |
| ScenePicker | 情境切換（個人/職場/面試） | ScenePicker.vue |

### 影響範圍

- `src/app/compatibility/page.tsx` — 加入 PairLuckyDays tab 或 section
- `src/components/compatibility/pair-result.tsx` — 整合 PairPerspectives
- `src/components/compatibility/scene-picker.tsx` — 新增
- `src/hooks/use-compatibility.ts` — 加入 pair lucky days API 呼叫
- `src/types/lucky-days.ts` — 加入 PairLuckyDaysResult type

### API 端點

- `GET /lucky-days/pair/{date1}/{date2}?relation=X&lang=X`
- `GET /lucky-days/pair-calendar/{date1}/{date2}/{year}/{month}?relation=X&lang=X`

---

## Phase 1 — 首頁強化 + 日常體驗提升

> 舊版首頁資訊密度高很多，新版目前只有設定卡 + 簡易日運摘要

### 變更內容

| 項目 | 說明 | 對應舊版元件 |
|------|------|-------------|
| WeekPreview | 首頁七日運勢預覽條 | WeekPreview.vue |
| TodaySpecialDays | 今日特殊日標記（甘露/金剛/羅刹） | TodaySpecialDays.vue |
| TodayActions | 今日行動建議卡片 | TodayActions.vue |
| InfoHint | 術語 glossary tooltip | InfoHint.vue |
| Breadcrumb | 麵包屑導覽（子頁面） | RouteBreadcrumb.vue |
| ICS 匯出按鈕 | 吉日/運勢匯出 .ics（utils 已有，缺 UI） | IcsDownloadButton.vue |

### 影響範圍

- `src/app/page.tsx` — 加入 WeekPreview, TodaySpecialDays, TodayActions
- `src/components/shared/info-hint.tsx` — 新增
- `src/components/shared/breadcrumb.tsx` — 新增
- `src/components/shared/ics-download-button.tsx` — 新增（串接現有 utils/ics-generator.ts）
- `src/app/fortune/daily/page.tsx` — 加入 InfoHint, Breadcrumb
- `src/app/fortune/lucky/page.tsx` — 加入 ICS 匯出按鈕
- `src/utils/glossary.ts` — 確認內容完整度

---

## Phase 2 — 公司分析模組 (求職核心)

> 整個公司分析模組在新版完全不存在，這是求職使用者的核心功能

### 變更內容

| 項目 | 說明 | 對應舊版元件 |
|------|------|-------------|
| CompanyForm | 新增/編輯公司表單 | CompanyForm.vue |
| CompanyList | 公司清單管理 | CompanyList.vue |
| CompanyCard | 公司詳情卡片 | CompanyCard.vue |
| CompanyBatch | 批次公司分析 | CompanyBatch.vue |
| CompanyComparison | 多公司比較 | CompanyComparison.vue |
| InterviewDates | 面試日期選擇 | InterviewDates.vue |
| KuyouTimeline | 公司九曜時間軸 | KuyouTimeline.vue |
| DirectionGuidanceBlock | 方向指引區塊 | DirectionGuidanceBlock.vue |

### 影響範圍

- `src/app/company/page.tsx` — 新增頁面（或整合進 compatibility）
- `src/components/company/*.tsx` — 新增整個模組
- `src/hooks/use-company.ts` — 新增
- `src/types/company.ts` — 擴充（目前檔案存在但內容不明）
- `src/stores/profile.ts` — 加入 companies[], 相關 CRUD
- `src/locales/*.ts` — company 段翻譯已存在，確認完整度

### API 端點

- `POST /company-batch-analysis`
- `POST /company-comparison`
- `POST /company-search/global`
- `GET /proxy/gcis/{apiId}` (需 Next.js API route 或 edge function 代理)

---

## Phase 3 — 104 整合 + HR/獵頭模式

> 進階職場功能，依使用者回饋決定是否全搬

### 變更內容

| 項目 | 說明 | 對應舊版元件 |
|------|------|-------------|
| 104 職缺查詢 | 查 104.com 職缺 | CompanyJobsList.vue + JobSearch.vue |
| HR 模式 | 人資選才流程 | HrMode/Guide/Result.vue |
| 獵頭模式 | 獵頭跨矩陣分析 | HeadhunterMode/Guide/CompanyView.vue |
| 團隊矩陣 | N*N 團隊相容矩陣 | TeamMatrix.vue |
| 跨矩陣 | 求職者 x 公司矩陣 | CrossMatrix.vue |
| 求職者管理 | 多求職者管理 | SeekerManager.vue |
| 候選人管理 | HR 候選人清單 | CandidateList.vue |

### 影響範圍

- `src/app/company/hr/page.tsx` — 新增
- `src/app/company/headhunter/page.tsx` — 新增
- `src/components/company/hr/*.tsx` — 新增
- `src/components/company/headhunter/*.tsx` — 新增
- `src/hooks/use-company.ts` — 擴充 104/HR/獵頭 API
- `src/stores/profile.ts` — 加入 jobSeekers[], hrCandidates[], hrCompany
- `src/types/company.ts` — 加入 JobSeeker, HrCandidate 等型別

### API 端點

- `POST /104/company-jobs`
- `POST /104/company-url`

---

## Phase 4 — 運勢月曆 + 體驗增強

> 互動式月曆和新手引導

### 變更內容

| 項目 | 說明 | 對應舊版元件 |
|------|------|-------------|
| FortuneCalendar | 互動式運勢月曆 | FortuneCalendar.vue |
| CalendarDayCell | 日曆格子渲染 | CalendarDayCell.vue |
| OnboardingTour | 新手導覽 | OnboardingTour.vue |
| FeatureTips | 新功能提示 | useFeatureTips.ts |
| PartnerMatrix | 多人比較矩陣 | PartnerMatrix.vue |

### 影響範圍

- `src/components/calendar/*.tsx` — 新增
- `src/components/shared/onboarding-tour.tsx` — 新增
- `src/hooks/use-calendar.ts` — 新增
- `src/hooks/use-feature-tips.ts` — 新增
- `src/components/compatibility/partner-matrix.tsx` — 新增

### API 端點

- `GET /calendar/monthly/{year}/{month}?birth_date=X&lang=X`

---

## Phase 5 — 認證 + 雲端同步 (評估後決定)

> Logto 認證和 Neon DB 同步，視使用者需求決定

### 變更內容

| 項目 | 說明 |
|------|------|
| Logto 整合 | @logto/next OAuth 登入 |
| 雲端同步 | profile/partners/companies 同步到 Neon |
| 衝突解決 | 本地 vs 雲端合併邏輯 |
| 離線佇列 | 離線操作排隊上傳 |

### 影響範圍

- `src/app/api/user/*` — Next.js API routes
- `src/hooks/use-user-sync.ts` — 新增
- `src/stores/profile.ts` — 加入 sync 相關狀態

---

## Phase 0.5 — 七曜命名修正 (技術債)

> locale 和 fortune-helpers.ts 把七曜用五行語義翻譯，嚴重誤導

### 問題

- `elements: { wood: '木', metal: '金', ... }` — 木曜是 Jupiter 不是 Wood，金曜是 Venus 不是 Metal
- `ELEMENT_KEY_MAP` 把「木」映射成 `wood` 而非 `jupiter`
- 七曜正確翻譯：日(Sun)、月(Moon)、火(Mars)、水(Mercury)、木(Jupiter)、金(Venus)、土(Saturn)

### 變更內容

| 項目 | 修正 |
|------|------|
| `src/locales/*.ts` 頂層 `elements` | wood→jupiter, fire→mars, earth→saturn, metal→venus, water→mercury |
| `src/utils/fortune-helpers.ts` ELEMENT_KEY_MAP | 同步修正 key 映射 |
| `src/utils/ics-generator.ts` | 確認 element 顯示用七曜名而非五行名 |
| 英文 locale | Jupiter/Mars/Saturn/Venus/Mercury 而非 Wood/Fire/Earth/Metal/Water |

### 影響範圍

- `src/locales/zh-TW.ts` — elements 區塊
- `src/locales/ja.ts` — elements 區塊
- `src/locales/en.ts` — elements 區塊
- `src/utils/fortune-helpers.ts` — ELEMENT_KEY_MAP
- 所有引用 `getElementKey()` 的地方

---

## 明確不搬的功能

| 項目 | 原因 |
|------|------|
| 五行系統 (ElementTag, /elements API) | 違反宿曜道核心精神，五行屬中國命理體系 |
| V2 Preview 頁面 | 新版本身就是重寫版 |
| Legacy 重導向 | 新版用新 URL 結構 |
| PractitionerLevel (修行者等級) | 過於小眾，Phase 5 再評估 |
| LearningPath (學習路徑) | 可用知識庫頁面取代 |

---

## 測試計畫

### 每個 Phase 完成後

1. `npx next build` 零錯誤
2. 三尺寸截圖驗證 (375/768/1280)
3. curl 測試所有新增 API 呼叫
4. 與舊版同功能頁面截圖比對，確認資訊完整度
5. i18n 三語言切換確認

### 整體驗收

- 舊版所有主要使用流程在新版都能完成
- Lighthouse Performance >= 85
- Sentry 無新增 unresolved error

## Checklist

- [x] Phase 0.5: 七曜命名修正（清除五行語義殘留）
- [x] Phase 0: 相性頁深度內容（PairLuckyDays + 紅旗/差距分析）
- [x] Phase 1: 首頁強化（WeekPreview + SpecialDays + Actions + InfoHint + Breadcrumb + ICS 按鈕）
- [x] Phase 2: 公司分析模組（CompanyForm/List/Batch/Comparison + store + hook + nav）
- [x] Phase 3: 104 + HR/獵頭（use104Jobs + useTeamMatrix + HR 頁面 + 獵頭頁面 + store 擴充）
- [x] Phase 4: 運勢月曆 + 體驗增強（FortuneCalendar + useCalendar + calendar 頁面）
- [ ] Phase 5: 認證 + 雲端同步 (待評估)
