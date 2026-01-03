# Testing Guide

本文檔說明如何對 Checkinly 進行全面測試，確保系統品質符合驗收標準。

## 目錄

- [測試策略](#測試策略)
- [功能測試](#功能測試)
- [視覺回歸測試](#視覺回歸測試)
- [無障礙測試](#無障礙測試)
- [效能測試](#效能測試)
- [瀏覽器相容性測試](#瀏覽器相容性測試)
- [測試清單](#測試清單)

---

## 測試策略

### 測試金字塔

```
        /\
       /UI\        ← 端對端測試（手動/自動）
      /────\
     /整合測\      ← 組件整合測試
    /────────\
   /  單元測試 \   ← 工具函數測試
  /────────────\
```

### 當前測試範圍

Checkinly 目前專注於：
1. **手動功能測試**: 完整使用者流程驗證
2. **視覺驗收測試**: 對比設計稿的視覺一致性
3. **無障礙測試**: WCAG 2.1 AA 標準符合性
4. **效能測試**: Lighthouse 評分和載入時間
5. **瀏覽器測試**: 主流瀏覽器相容性

---

## 功能測試

### 1. 上傳功能測試

#### 測試目標
驗證檔案上傳、解析、錯誤處理流程

#### 測試步驟

**測試案例 1.1: 成功上傳 Excel 檔案**

1. 開啟應用: http://localhost:5175
2. 點擊「選擇檔案」按鈕
3. 選擇 `data/11401出勤明細.xlsx`
4. 觀察載入動畫
5. 驗證結果:
   - ✅ 顯示 KPI 卡片（總工時、加班時數、異常、人數）
   - ✅ 顯示趨勢圖表
   - ✅ 顯示部門排行圖
   - ✅ 顯示智能建議
   - ✅ 顯示狀態分佈圓餅圖
   - ✅ 顯示 Top 5 加班員工表格

**測試案例 1.2: 上傳 CSV 檔案**

1. 清除當前數據（點擊「清除資料重選」）
2. 準備 CSV 測試檔案
3. 上傳 CSV 檔案
4. 驗證解析成功且數據正確

**測試案例 1.3: 錯誤檔案格式**

1. 清除數據
2. 嘗試上傳 .txt 或 .pdf 檔案
3. 驗證結果:
   - ✅ 顯示錯誤訊息: "不支援的檔案格式，請上傳 CSV 或 Excel 檔"
   - ✅ 錯誤訊息為紅色背景
   - ✅ 顯示 AlertCircle 圖標

**測試案例 1.4: 大型檔案解析**

1. 準備 > 1000 筆記錄的測試檔案
2. 上傳並觀察效能
3. 驗證:
   - ✅ 載入時間 < 3 秒
   - ✅ 圖表渲染流暢
   - ✅ 無記憶體洩漏（使用 Chrome DevTools 監控）

### 2. 數據展示測試

#### 測試目標
驗證所有數據正確計算和展示

#### 測試步驟

**測試案例 2.1: KPI 卡片數值**

1. 上傳測試檔案
2. 手動計算預期值:
   - 總工時 = Σ 所有工時
   - 加班時數 = Σ 所有加班
   - 異常 = Σ 遲到 + 早退
   - 人數 = 唯一員工編號數量
3. 對比顯示值
4. 驗證:
   - ✅ 數值正確無誤
   - ✅ 趨勢指示器顯示（如有）
   - ✅ 圖標和配色符合語義（工時=primary, 加班=warning, 異常=error, 人數=success）

**測試案例 2.2: 圖表數據**

1. 檢查趨勢圖:
   - ✅ 日期軸正確（格式: MM-DD）
   - ✅ 正常工時線（藍色 #1890ff）
   - ✅ 加班線（橘色 #faad14）
   - ✅ Tooltip 顯示正確數值
2. 檢查部門排行圖:
   - ✅ 部門名稱完整顯示
   - ✅ 正常工時條（藍色）
   - ✅ 加班條（紅色 #f5222d）
   - ✅ 數值疊加正確
3. 檢查圓餅圖:
   - ✅ 各狀態比例正確
   - ✅ 中央總人次顯示
   - ✅ 圖例顯示完整

### 3. 互動體驗測試

#### 測試目標
驗證所有互動反饋正常

#### 測試步驟

**測試案例 3.1: Hover 效果**

1. Hover 以下元素並驗證:
   - ✅ 按鈕: 背景變深 + 陰影加深
   - ✅ KPI 卡片: 陰影加深 + 向上浮動 2px
   - ✅ 導航項目: 背景變色
   - ✅ 表格行: 背景變 neutral-50
   - ✅ 上傳區域: 邊框變藍 + 背景變 primary-50

**測試案例 3.2: 動畫效果**

1. 刷新頁面觀察:
   - ✅ 上傳區域 fade-slide-up 進場
2. 上傳檔案觀察:
   - ✅ 全局載入動畫（中央 spinner）
   - ✅ KPI 卡片逐一 fade-slide-up 進場
   - ✅ 圖表平滑渲染（800ms 動畫）

**測試案例 3.3: Loading 狀態**

1. 上傳檔案時觀察:
   - ✅ 全局 spinner 顯示
   - ✅ 上傳按鈕變 disabled
   - ✅ 按鈕文字變「資料解析中...」
   - ✅ 頁面其他區域可正常瀏覽（非阻塞）

### 4. 響應式功能測試

#### 測試目標
驗證各斷點下佈局正確

#### 測試步驟

**測試案例 4.1: 移動端 (375px)**

1. 調整瀏覽器寬度至 375px
2. 驗證:
   - ✅ Sidebar 預設隱藏
   - ✅ 點擊 Menu 按鈕顯示 Sidebar（抽屜效果）
   - ✅ Sidebar 有遮罩層（半透明黑）
   - ✅ 點擊遮罩關閉 Sidebar
   - ✅ Header 縮小至合適高度
   - ✅ KPI 卡片單列顯示（grid-cols-1）
   - ✅ 圖表正常縮放
   - ✅ 表格橫向可滾動

**測試案例 4.2: 平板端 (768px)**

1. 調整寬度至 768px
2. 驗證:
   - ✅ KPI 卡片雙列顯示（grid-cols-2）
   - ✅ Sidebar 仍為抽屜模式
   - ✅ 圖表適當縮放

**測試案例 4.3: 桌面端 (1280px)**

1. 調整寬度至 1280px
2. 驗證:
   - ✅ Sidebar 固定顯示（不可收合）
   - ✅ MainContent 左間距 256px (ml-64)
   - ✅ Header 左間距 256px (left-64)
   - ✅ KPI 卡片四列顯示（grid-cols-4）
   - ✅ 所有元素佈局合理

---

## 視覺回歸測試

### 測試目標
確保 UI 符合設計系統規範，視覺相似度 ≥ 95%

### 測試工具
- 瀏覽器開發者工具（檢查元素樣式）
- 截圖對比工具（如 Percy, Chromatic）

### 測試步驟

**測試案例: 視覺對比**

1. 開啟設計稿（如有）或參考 `DESIGN_SYSTEM.md`
2. 截圖當前頁面
3. 使用測量工具檢查:
   - ✅ 間距符合 4px 網格（4, 8, 12, 16, 24, 32...）
   - ✅ 配色符合設計系統（Primary: #1890ff, Success: #52c41a...）
   - ✅ 字體大小正確（Heading-1: 24px, Body: 14px...）
   - ✅ 圓角正確（Button: 6px, Card: 12px...）
   - ✅ 陰影正確（Card: shadow-card, Hover: shadow-dropdown...）

**使用開發者工具檢查**:

```javascript
// 在 Console 執行以檢查某元素
const el = document.querySelector('.your-element');
window.getComputedStyle(el).padding; // 檢查間距
window.getComputedStyle(el).borderRadius; // 檢查圓角
window.getComputedStyle(el).boxShadow; // 檢查陰影
```

---

## 無障礙測試

### 測試目標
符合 WCAG 2.1 AA 標準

### 測試工具
- [Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse/)
- [NVDA 螢幕閱讀器](https://www.nvaccess.org/) (Windows)
- [VoiceOver](https://www.apple.com/accessibility/voiceover/) (macOS)
- [axe DevTools](https://www.deque.com/axe/devtools/)

### 測試步驟

**測試案例 1: 鍵盤導航**

1. 使用 Tab 鍵遍歷所有互動元素
2. 驗證:
   - ✅ 所有按鈕可被 focus
   - ✅ Focus 樣式清晰可見（藍色外框）
   - ✅ Tab 順序符合邏輯（從上到下，從左到右）
   - ✅ Shift+Tab 可反向導航
   - ✅ Enter/Space 可觸發按鈕
3. 測試 Sidebar 導航:
   - ✅ Tab 可進入 Sidebar
   - ✅ 方向鍵可在導航項目間移動（如有實作）
   - ✅ Enter 可選擇項目

**測試案例 2: 螢幕閱讀器**

1. 啟動 NVDA 或 VoiceOver
2. 使用螢幕閱讀器瀏覽頁面
3. 驗證:
   - ✅ 頁面標題被朗讀
   - ✅ 導航區域有 `role="navigation"` 和 `aria-label`
   - ✅ 主內容區域有 `role="main"`
   - ✅ 按鈕有清晰的標籤（`aria-label` 或文字內容）
   - ✅ 圖標按鈕有 `aria-label`（如 Menu 按鈕）
   - ✅ 載入狀態有 `aria-busy` 和 `role="status"`
   - ✅ 錯誤訊息有 `role="alert"`

**測試案例 3: Lighthouse 評分**

1. 開啟 Chrome DevTools
2. 切換至 Lighthouse 頁籤
3. 選擇「Accessibility」分類
4. 點擊「Analyze page load」
5. 驗證:
   - ✅ Accessibility 評分 ≥ 90
   - ✅ 無紅色錯誤項目
   - ✅ 黃色警告項目已知且可接受

**測試案例 4: 色彩對比度**

1. 使用 [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
2. 測試所有文字與背景組合:
   - ✅ Primary text (rgba(0,0,0,0.85)) on white: 13.6:1 (AAA)
   - ✅ Primary-600 (#096dd9) on white: 6.46:1 (AAA)
   - ✅ Success-600 on white: ≥ 4.5:1 (AA)
   - ✅ Warning-600 on white: ≥ 4.5:1 (AA)
   - ✅ Error-600 on white: ≥ 4.5:1 (AA)

---

## 效能測試

### 測試目標
確保應用快速且流暢，Lighthouse Performance ≥ 90

### 測試工具
- Chrome Lighthouse
- Chrome DevTools Performance
- [WebPageTest](https://www.webpagetest.org/)

### 測試步驟

**測試案例 1: Lighthouse 效能評分**

1. 開啟 Chrome DevTools → Lighthouse
2. 選擇「Performance」分類
3. 切換至「Desktop」模式
4. 點擊「Analyze page load」
5. 驗證:
   - ✅ Performance: ≥ 90
   - ✅ First Contentful Paint (FCP): < 1.8s
   - ✅ Largest Contentful Paint (LCP): < 2.5s
   - ✅ Time to Interactive (TTI): < 3.8s
   - ✅ Total Blocking Time (TBT): < 200ms
   - ✅ Cumulative Layout Shift (CLS): < 0.1

**測試案例 2: 載入時間**

1. 開啟 Chrome DevTools → Network
2. 清除快取（Disable cache）
3. 重新載入頁面
4. 驗證:
   - ✅ DOMContentLoaded: < 1s
   - ✅ Load: < 3s
   - ✅ 總資源大小: < 1MB
   - ✅ 請求數量: < 30

**測試案例 3: 動畫幀率**

1. 開啟 Chrome DevTools → Performance
2. 點擊「Record」
3. 上傳檔案並觀察動畫
4. 停止錄製
5. 驗證:
   - ✅ FPS 曲線穩定在 60fps
   - ✅ 無明顯掉幀（綠色柱狀圖無紅色標記）
   - ✅ Main thread 無長時間阻塞

**測試案例 4: 記憶體洩漏**

1. 開啟 Chrome DevTools → Memory
2. 執行以下操作 10 次:
   - 上傳檔案 → 查看結果 → 清除數據
3. 在每次循環後拍攝 Heap snapshot
4. 驗證:
   - ✅ 記憶體使用量穩定（無持續增長）
   - ✅ Detached DOM nodes < 10

---

## 瀏覽器相容性測試

### 測試目標
確保主流瀏覽器都能正常使用

### 測試瀏覽器
- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

### 測試步驟

**在每個瀏覽器執行以下測試**:

1. **基本功能測試**:
   - ✅ 頁面正常載入
   - ✅ 上傳功能正常
   - ✅ 圖表正常渲染
   - ✅ 所有互動功能正常

2. **樣式測試**:
   - ✅ 佈局無錯位
   - ✅ 字體正確顯示
   - ✅ 圓角和陰影正確
   - ✅ 顏色無異常

3. **Console 檢查**:
   - ✅ 無 JavaScript 錯誤
   - ✅ 無 CSS 警告
   - ✅ 無 404 資源錯誤

### 已知瀏覽器差異

**Safari**:
- 某些 CSS 屬性需要 `-webkit-` 前綴
- Tailwind 自動處理，無需手動添加

**Firefox**:
- 滾動條樣式可能與 Chrome 不同
- 已透過標準 CSS 處理

---

## 測試清單

### 上傳前檢查清單

提交代碼或部署前，確認以下項目：

#### 功能測試
- [ ] 上傳 Excel 檔案成功
- [ ] 上傳 CSV 檔案成功
- [ ] 錯誤檔案格式顯示錯誤訊息
- [ ] 所有 KPI 數值正確
- [ ] 所有圖表渲染正確
- [ ] 智能建議顯示
- [ ] 清除數據功能正常

#### 響應式測試
- [ ] 375px (mobile): 佈局正常
- [ ] 768px (tablet): 佈局正常
- [ ] 1280px (desktop): 佈局正常
- [ ] Sidebar 收合/展開正常

#### 無障礙測試
- [ ] Tab 鍵可遍歷所有互動元素
- [ ] Focus 樣式清晰可見
- [ ] 所有按鈕有清晰標籤
- [ ] Lighthouse Accessibility ≥ 90

#### 效能測試
- [ ] Lighthouse Performance ≥ 90
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] 動畫 60fps

#### 視覺測試
- [ ] 間距符合 4px 網格
- [ ] 配色符合設計系統
- [ ] 圓角和陰影正確

#### 瀏覽器測試
- [ ] Chrome 正常
- [ ] Firefox 正常
- [ ] Safari 正常
- [ ] Edge 正常
- [ ] Console 無錯誤

#### 代碼質量
- [ ] 無 TypeScript/ESLint 錯誤
- [ ] 無 console.log（除必要日誌）
- [ ] `npm run build` 成功

---

## 自動化測試（未來規劃）

### 單元測試

使用 Vitest + React Testing Library:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

範例測試:
```javascript
// src/utils/__tests__/statsCalculator.test.js
import { describe, it, expect } from 'vitest';
import { calculateStats } from '../statsCalculator';

describe('calculateStats', () => {
  it('should calculate total work hours correctly', () => {
    const data = [
      { workHours: 8, otHours: 2 },
      { workHours: 7, otHours: 1 }
    ];
    const stats = calculateStats(data);
    expect(stats.totalWorkHours).toBe(15);
    expect(stats.totalOTHours).toBe(3);
  });
});
```

### E2E 測試

使用 Playwright:

```bash
npm install -D @playwright/test
```

範例測試:
```javascript
// e2e/upload.spec.js
import { test, expect } from '@playwright/test';

test('should upload file and display dashboard', async ({ page }) => {
  await page.goto('http://localhost:5175');

  // 上傳檔案
  const fileInput = await page.locator('input[type="file"]');
  await fileInput.setInputFiles('data/11401出勤明細.xlsx');

  // 等待載入完成
  await page.waitForSelector('.stat-card');

  // 驗證 KPI 卡片顯示
  const kpiCards = await page.locator('.stat-card').count();
  expect(kpiCards).toBe(4);
});
```

---

**維護者**: Claude Code (Anthropic)
**最後更新**: 2025-12-10
