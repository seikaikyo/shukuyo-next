---
title: Vue 大改同步 — yosei 改名 + 假分數移除 + 工具/元件補齊
type: refactor
status: in-progress
created: 2026-03-31
---

# Vue 大改同步 — yosei 改名 + 假分數移除 + 工具/元件補齊

## 背景

shukuyo (Vue) 近期完成數項重大重構：
1. `element` 全面改名為 `yosei`（七曜）
2. 移除所有數字分數系統，回歸原典定性判讀 (daikichi/kichi/shokyo/kyo)
3. 新增多個工具函式與共用元件

shukuyo-next (Next.js) 尚未同步這些變更，需分階段對齊。

## Phase 1 — Types + yosei 改名 (資料層對齊)

### 變更內容

| 項目 | 說明 |
|------|------|
| types/fortune.ts | `element` → `yosei`，移除 `overall/career/love/health/wealth` 數字欄位 |
| types/compatibility.ts | `element` → `yosei`，`element_reading` → `yosei_reading` |
| types/mansion.ts | `element` → `yosei`，`element_reading` → `yosei_reading`，`element_traits` → `yosei_traits` |
| types/company.ts | `element` → `yosei` |
| types/calendar.ts | `element` → `yosei` |
| types/lucky-days.ts | `element` → `yosei` |
| types/startup.ts | 檢查是否有 element/score 欄位 |

### 分數欄位移除清單

| 型別 | 移除欄位 | 替代 |
|------|---------|------|
| FortuneScores | `overall`, `career`, `love`, `health`, `wealth` (number) | 保留 `level`, `level_name` 等定性欄位 |
| WeeklyFortune.daily_overview[] | `score` | `level: string` |
| MonthlyStrategyDay | `score` | `level: string` |
| MonthlyActionWindow | `avg_score` | 移除，用 description |
| YearlySafeHaven | `avg_score` | 移除 |
| YearlyBestMonth / YearlyCautionMonth | `score` | `level: string` |
| YearlyStrategy.yearly_rhythm | `first_half_avg`, `second_half_avg` | 移除，用 description |
| MonthlyFortune.weekly[] | `score` | `level: string` |
| YearlyFortune.monthly_trend[] | `score` | `level: string` |

### 影響範圍
- `src/types/*.ts` (7 檔案)
- `src/locales/*.ts` (3 檔案，`element*` → `yosei*`)

### 測試計畫
- [x] tsc --noEmit 零錯誤
- [x] 所有引用 element/score 的元件編譯通過

---

## Phase 2 — 工具函式移植 + score-colors 替換

### 變更內容

| 項目 | 來源 (Vue) | 說明 |
|------|-----------|------|
| fortune-helpers.ts | utils/fortune-helpers.ts | `getLevelClass()`, `getFortuneLevel()` 等級 → CSS 映射 |
| t21-citations.ts | utils/t21-citations.ts | 原典出處引用 + CBETA 連結 |
| linkify.ts | utils/linkify.ts | T21 頁碼轉 CBETA 超連結 |
| initiative-tone.ts | utils/initiative-tone.ts | 方向感知語氣分類 |
| relation-mode.ts | utils/relation-mode.ts | 紅旗/間隔指引關係映射 |
| text-helpers.ts | utils/text-helpers.ts | 多語言文字替換 (`replaceOtherPerson`) |

### 移除
- `src/utils/score-colors.ts` — 被 `fortune-helpers.ts` 取代

### 影響範圍
- `src/utils/` (新增 6 檔、刪除 1 檔)
- 引用 `scoreColor()` 等的元件需改用 `getLevelClass()`

### 測試計畫
- [ ] 新工具函式可正常 import
- [ ] 原有引用 score-colors 的元件改用 fortune-helpers

---

## Phase 3 — 共用元件補齊

### 變更內容

| 元件 | 來源 (Vue) | 說明 |
|------|-----------|------|
| FortuneBadge | shared/FortuneBadge.vue | 運勢等級彩色標籤，核心 UI 元件 |
| YoseiTag | shared/YoseiTag.vue | 七曜色彩標籤 (火/水/木/金/土/日/月) |
| RedFlagFlow | shared/RedFlagFlow.vue | 紅旗互動流程 (判斷→健康→紅旗→對治) |
| DirectionNarrativeBlock | shared/DirectionNarrativeBlock.vue | 方向指引敘事區塊 + 原典引用 |

### CSS 變數
- globals.css 新增 `--yosei-fire/water/wood/metal/earth/sun/moon` (明暗主題各一組)

### 影響範圍
- `src/components/shared/` (新增 4 檔)
- `src/app/globals.css` (新增 CSS 變數)

### 測試計畫
- [ ] 各元件可獨立渲染
- [ ] 明暗主題切換正常

---

## Phase 4 — 頁面元件更新 (分數顯示 → 等級顯示)

### 變更內容

| 頁面 | 改動 |
|------|------|
| fortune/daily/page.tsx | 移除分數圓環/進度條，改用 FortuneBadge |
| fortune/weekly/page.tsx | 長條圖從分數改為 4 級高度 (100%/66%/40%/20%) |
| fortune/monthly/page.tsx | 移除分數標示，改用等級標籤 |
| fortune/yearly/page.tsx | 移除 avg_score，用 level + description |
| fortune/decade/page.tsx | 同上 |
| compatibility/ 各頁 | `element` 顯示改用 YoseiTag |
| company/ 各頁 | `element` 顯示改用 YoseiTag |
| page.tsx (首頁) | 分數相關顯示改為等級 |

### 影響範圍
- `src/app/` 下約 10 個頁面檔案
- `src/components/fortune/`, `compatibility/`, `company/`

### 測試計畫
- [ ] tsc --noEmit 零錯誤
- [ ] next build 零錯誤
- [ ] 各頁面可正常載入顯示

---

## Phase 5 — Hooks 功能補齊 (選做，視需求)

### 變更內容

| Hook | 說明 | 優先度 |
|------|------|--------|
| useUserSync | Logto 登入後資料同步 | 等 Phase 3 雲端同步再做 |
| useFeatureTips | 功能提示/導覽系統 | 低 |
| useMansion | 本命宿查詢 | 中 |
| useCompany 擴充 | HR/獵頭/GCIS 搜尋 | 中 |
| useFortune 擴充 | fetchAllForToday, retry | 低 |

### 影響範圍
- `src/hooks/` (新增/擴充 5 檔)

### 測試計畫
- [ ] 各 hook 可正常呼叫 API
- [ ] 錯誤處理與 loading 狀態正確

---

## Checklist

- [x] Phase 1: Types + yosei 改名 (2026-03-31 完成)
- [x] Phase 2: 工具函式移植 — fortune-helpers.ts (2026-03-31 完成，與 Phase 1 合併)
- [ ] Phase 3: 共用元件補齊 (FortuneBadge, YoseiTag, RedFlagFlow, DirectionNarrativeBlock)
- [x] Phase 4: 頁面元件更新 (2026-03-31 完成，與 Phase 1 合併)
- [ ] Phase 5: Hooks 功能補齊 (選做)
