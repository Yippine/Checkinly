# INC-006 & INC-007 驗收測試指南
## Acceptance Testing Guide

**版本**: 1.0.0-MVP
**測試日期**: 2026-01-07
**驗收範圍**: INC-006（倦怠趨勢圖）+ INC-007（測試文件）

---

## 目錄

1. [準備工作](#準備工作)
2. [INC-006 功能驗收](#inc-006-功能驗收)
3. [INC-007 文件驗收](#inc-007-文件驗收)
4. [整合驗收](#整合驗收)
5. [驗收檢查表](#驗收檢查表)

---

## 準備工作

### Step 1: 啟動開發伺服器

```bash
# 進入專案目錄
cd /mnt/c/Users/user/Documents/Yippine/Program/Checkinly

# 確認當前分支
git branch
# 應該顯示 * dev

# 確認最新提交
git log --oneline | head -3
# 應該看到：
# 8bd838e docs: Complete INC-007 integration testing and user documentation
# d8c469a feat: Add burnout trend visualization and risk statistics (INC-006)
# 08fabee feat: Implement comprehensive employee health monitoring dashboard...

# 啟動開發伺服器
npm run dev
```

**預期輸出**:
```
VITE v7.2.6  ready in XXX ms

➜  Local:   http://localhost:3004/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 2: 開啟瀏覽器

1. 開啟 Chrome 或 Edge 瀏覽器
2. 訪問 `http://localhost:3004/`
3. 開啟開發者工具（F12）→ Console 標籤
4. 確認無紅色錯誤訊息

---

## INC-006 功能驗收

### 驗收目標

驗證倦怠趨勢圖與統計功能是否正確顯示假資料，並確保視覺化組件運作正常。

---

### Test Case 1: 導航至倦怠評估頁面

**步驟**:
1. 在左側 Sidebar 找到「倦怠評估」選項
2. 點擊「倦怠評估」

**預期結果**:
- ✅ 頁面順利切換
- ✅ 顯示問卷選擇按鈕（Stanford / CBI / OLBI）
- ✅ 顯示資訊提示卡片（Info Banner）
- ✅ **新增！顯示「統計卡片」區塊**
- ✅ **新增！顯示「倦怠趨勢圖」**

**驗收標準**:
- 無 JavaScript 錯誤
- 所有組件正常渲染

**截圖建議**: `acceptance/INC-006-01-burnout-page.png`

---

### Test Case 2: 驗證 Stanford 問卷統計卡片

**步驟**:
1. 確認當前選擇的是「Stanford」問卷（預設）
2. 檢查頁面頂部的「統計卡片」區塊

**預期結果**:
應顯示 **3 張卡片**，從左到右：

**卡片 1: 低風險**
- 標題: "低風險" 或 "Low Risk"
- 顏色: 綠色背景（bg-success-50）
- 內容:
  - 顯示人數（例如：2 人）
  - 顯示百分比（例如：33.3%）
  - 顯示部門列表（例如：行政部、資訊部）

**卡片 2: 中度風險**
- 標題: "中度風險" 或 "Moderate Risk"
- 顏色: 橙色背景（bg-warning-50）
- 內容:
  - 顯示人數（例如：2 人）
  - 顯示百分比（例如：33.3%）
  - 顯示部門列表（例如：檢驗部、藥劑部）

**卡片 3: 高風險**
- 標題: "高風險" 或 "High Risk"
- 顏色: 紅色背景（bg-error-50）
- 內容:
  - 顯示人數（例如：2 人）
  - 顯示百分比（例如：33.3%）
  - 顯示部門列表（例如：護理部、醫療部）

**驗收標準**:
- ✅ 總人數 = 6 個部門
- ✅ 百分比總和 = 100%
- ✅ 部門名稱顯示正確
- ✅ 顏色編碼正確（綠/橙/紅）

**截圖建議**: `acceptance/INC-006-02-stanford-stats.png`

---

### Test Case 3: 驗證 Stanford 趨勢圖

**步驟**:
1. 繼續在 Stanford 問卷頁面
2. 向下捲動，檢查「倦怠趨勢圖」區塊

**預期結果**:

**圖表標題**:
- 顯示 "倦怠分數趨勢" 或 "Burnout Trend"

**圖表內容**:
- **X 軸**: 顯示月份（2025-01 ~ 2025-10，共 10 個月）
- **Y 軸**: 顯示分數（範圍 0-5，Stanford 5 點量表）
- **圖例（Legend）**: 顯示 6 個部門名稱
  - 護理部（紅色線）
  - 醫療部（橙色線）
  - 檢驗部（金色線）
  - 藥劑部（綠色線）
  - 行政部（藍色線）
  - 資訊部（紫色線）

**趨勢線特徵**:
- 高壓部門（護理、醫療）: 分數在 3.0-4.0 之間
- 中壓部門（檢驗、藥劑）: 分數在 2.5-3.0 之間
- 正常部門（行政、資訊）: 分數在 1.5-2.5 之間
- 所有線條應有輕微上升趨勢（模擬倦怠累積）

**互動功能**:
1. 滑鼠懸停在任一資料點上
2. 應顯示自訂 Tooltip:
   - 部門名稱
   - 月份
   - 分數（例如：3.2）

**驗收標準**:
- ✅ 圖表正確渲染
- ✅ 6 條趨勢線都顯示
- ✅ 顏色與圖例對應
- ✅ Tooltip 顯示正確資訊
- ✅ 圖表響應式（調整視窗大小仍正常）

**截圖建議**: `acceptance/INC-006-03-stanford-trend.png`

---

### Test Case 4: 切換至 CBI 問卷

**步驟**:
1. 點擊頁面頂部的「CBI」按鈕
2. 等待資料更新（應該是即時的）

**預期結果**:

**統計卡片變化**:
- 風險等級閾值改變（CBI 使用 0-100 分制）
- 高風險閾值: ≥ 75 分
- 中度風險閾值: 50-74 分
- 低風險閾值: < 50 分

**趨勢圖變化**:
- **Y 軸範圍**: 改為 0-100
- **分數範圍**:
  - 高壓部門: 70-85 分
  - 中壓部門: 55-70 分
  - 正常部門: 35-50 分

**驗收標準**:
- ✅ 資料即時更新（無需重新載入頁面）
- ✅ Y 軸刻度正確（0-100）
- ✅ 分數範圍合理
- ✅ 統計卡片人數分布重新計算

**截圖建議**: `acceptance/INC-006-04-cbi-visualization.png`

---

### Test Case 5: 切換至 OLBI 問卷

**步驟**:
1. 點擊頁面頂部的「OLBI」按鈕
2. 檢查資料更新

**預期結果**:

**統計卡片變化**:
- OLBI 使用 1-4 分制
- 高風險閾值: ≥ 3.0 分
- 中度風險閾值: 2.25-2.99 分
- 低風險閾值: < 2.25 分

**趨勢圖變化**:
- **Y 軸範圍**: 改為 1-4
- **分數範圍**:
  - 高壓部門: 2.8-3.5 分
  - 中壓部門: 2.3-2.8 分
  - 正常部門: 1.5-2.3 分

**驗收標準**:
- ✅ Y 軸刻度正確（1-4）
- ✅ 分數範圍符合 OLBI 量表
- ✅ 切換流暢無延遲

**截圖建議**: `acceptance/INC-006-05-olbi-visualization.png`

---

### Test Case 6: 響應式設計測試

**步驟**:
1. 保持在倦怠評估頁面
2. 按 F12 開啟開發者工具
3. 點擊「Toggle device toolbar」（手機圖示）或按 Ctrl+Shift+M
4. 選擇不同裝置尺寸測試

**測試裝置**:
- **手機**: iPhone 12 Pro (390px)
- **平板**: iPad Air (820px)
- **桌面**: 1920px

**預期結果**:

**手機版 (390px)**:
- 統計卡片: 垂直排列（1 欄）
- 趨勢圖: 寬度自適應，高度維持
- 圖例: 可能移至圖表下方

**平板版 (820px)**:
- 統計卡片: 2 欄排列
- 趨勢圖: 寬度自適應

**桌面版 (1920px)**:
- 統計卡片: 3 欄排列（理想佈局）
- 趨勢圖: 充分利用寬度

**驗收標準**:
- ✅ 無水平滾動條
- ✅ 所有文字可讀
- ✅ 圖表不變形
- ✅ 按鈕可點擊

**截圖建議**:
- `acceptance/INC-006-06-mobile.png`
- `acceptance/INC-006-07-tablet.png`

---

### Test Case 7: Console 檢查（無錯誤）

**步驟**:
1. 開啟開發者工具 Console 標籤
2. 執行以下操作：
   - 切換三種問卷
   - 滑鼠懸停趨勢圖
   - 捲動頁面

**預期結果**:
- ✅ **無紅色錯誤訊息**
- ⚠️ 黃色警告可接受（例如：chunk size warning）
- ℹ️ 藍色資訊可忽略

**常見可接受的警告**:
```
(!) Some chunks are larger than 500 kB after minification.
```

**不可接受的錯誤範例**:
```
❌ Uncaught TypeError: Cannot read property 'map' of undefined
❌ Failed to compile
❌ Module not found
```

**驗收標準**:
- ✅ Console 乾淨無錯誤

---

## INC-007 文件驗收

### 驗收目標

驗證文件完整性、準確性與可用性。

---

### Test Case 8: README.md 更新驗證

**步驟**:
1. 在 VS Code 或文字編輯器開啟 `README.md`
2. 搜尋「員工健康監測」或「Employee Health Monitoring」

**預期結果**:

應包含以下章節：

**1. Bradford Factor 缺勤分析**
- ✅ 公式說明：Bradford Factor = S² × D
- ✅ 風險等級表格（< 50 / 50-100 / > 100）
- ✅ 應用場景說明

**2. 排班合規檢查**
- ✅ 七休一法規說明
- ✅ 醫療變形工時說明
- ✅ 即時警示功能

**3. 心情指數追蹤**
- ✅ 欄位支援說明
- ✅ 趨勢分析功能
- ✅ 設定指南連結

**4. 倦怠評估系統**
- ✅ 三種問卷說明（Stanford / CBI / OLBI）
- ✅ 匿名化與隱私保護

**5. 心情指數欄位設定**
- ✅ Excel 操作步驟（開啟 → 插入欄位 → 命名 → 填入資料）
- ✅ 支援欄位名稱列表
- ✅ 資料範圍說明（1-10）

**6. 學術基礎與參考文獻**
- ✅ Bradford Factor 參考文獻（至少 2 個 URL）
- ✅ Stanford 問卷來源
- ✅ CBI 官方網站連結
- ✅ OLBI 參考連結

**驗收標準**:
- ✅ 章節完整
- ✅ 連結有效
- ✅ 格式正確（Markdown 語法）
- ✅ 無錯別字

**檢查方法**:
```bash
# 檢查特定章節是否存在
grep -n "Bradford Factor" README.md
grep -n "心情指數欄位設定" README.md
grep -n "學術基礎" README.md
```

---

### Test Case 9: USER_GUIDE.md 完整性驗證

**步驟**:
1. 開啟 `docs/USER_GUIDE.md`
2. 檢查目錄結構

**預期結果**:

**必須包含 6 大章節**:

**1. 系統概述**
- ✅ 系統目的
- ✅ 目標使用者
- ✅ 核心功能清單

**2. 快速開始**
- ✅ 5 分鐘上手指南
- ✅ 步驟化操作說明
- ✅ 截圖或範例（可選）

**3. 資料上傳與解析**
- ✅ 支援格式說明
- ✅ 上傳步驟
- ✅ 欄位映射規則
- ✅ 常見錯誤處理

**4. 功能使用說明**
- ✅ Bradford Factor 分析（公式、範例、管理建議）
- ✅ 排班合規檢查（法規、檢查規則、警示處理）
- ✅ 心情指數追蹤（設定、圖表、解讀）
- ✅ 倦怠評估系統（問卷選擇、填寫、分數解讀）

**5. 常見問題 (FAQ)**
- ✅ 至少 10 個 FAQ
- ✅ 涵蓋資料上傳、功能使用、疑難排解

**6. 故障排除**
- ✅ Excel 解析失敗處理
- ✅ 圖表不顯示處理
- ✅ localStorage 清除方法
- ✅ 效能問題處理

**驗收標準**:
- ✅ 文件長度 ≥ 400 行
- ✅ 目錄連結有效
- ✅ 內容詳盡易懂
- ✅ 格式一致

**檢查方法**:
```bash
# 統計行數
wc -l docs/USER_GUIDE.md

# 檢查章節標題
grep "^## " docs/USER_GUIDE.md

# 檢查 FAQ 數量
grep -c "^### " docs/USER_GUIDE.md
```

---

### Test Case 10: TEST_REPORT.md 驗證

**步驟**:
1. 開啟 `docs/testing/TEST_REPORT.md`
2. 檢查測試結果記錄

**預期結果**:

**執行摘要**:
- ✅ Overall Status: PASS (MVP)
- ✅ Pass Rate: 100%
- ✅ Critical Issues Found: 0

**測試涵蓋範圍**:
- ✅ Bradford Factor Calculation: PASS
- ✅ Compliance Check: PASS
- ✅ Mood Index Parsing: PASS
- ✅ Burnout Questionnaires: PASS
- ✅ Burnout Trends: PASS
- ✅ Performance Testing: PASS (Basic validation)

**測試環境記錄**:
- ✅ Browser 資訊
- ✅ OS 資訊
- ✅ Test Data 路徑

**詳細測試案例** (應包含):
- Bradford Factor 測試（7 cases）
- 排班合規測試（5 cases）
- 心情指數測試（7 cases）
- 倦怠問卷測試（10 cases）
- 倦怠趨勢測試（4 cases）
- 效能測試（4 cases）

**驗收標準**:
- ✅ 所有測試案例有記錄
- ✅ 通過/失敗狀態明確
- ✅ 問題追蹤清楚（若有）

---

### Test Case 11: DEPLOYMENT_CHECKLIST.md 驗證

**步驟**:
1. 開啟 `docs/DEPLOYMENT_CHECKLIST.md`
2. 檢查檢查表完整性

**預期結果**:

**7 大驗證類別**:

1. **Functional Verification（功能驗證）**
   - ✅ 所有核心功能測試通過
   - ✅ 無 P0/P1 阻擋性問題
   - ✅ 效能指標符合預期

2. **Documentation Completeness（文件完整性）**
   - ✅ README.md 更新完成
   - ✅ USER_GUIDE.md 撰寫完成
   - ✅ TEST_REPORT.md 記錄完整
   - ✅ DEPLOYMENT_CHECKLIST.md 本身存在

3. **Code Quality（程式碼品質）**
   - ✅ ESLint 無錯誤
   - ✅ Console 無警告
   - ✅ 程式碼審查完成

4. **Build & Bundle（建置與打包）**
   - ✅ `npm run build` 成功
   - ✅ dist/ 目錄生成
   - ✅ 靜態資源正確

5. **Environment Configuration（環境配置）**
   - ✅ .env 設定檢查
   - ✅ API endpoints 確認
   - ✅ CORS 設定（若適用）

6. **Version Control（版本控制）**
   - ✅ 所有變更已提交
   - ✅ Git tag 準備
   - ✅ Branch 狀態正確

7. **Data Files（資料檔案）**
   - ✅ 範例檔案存在
   - ✅ 資料結構文件
   - ✅ .gitignore 設定正確

**部署步驟**:
- ✅ 詳細步驟說明
- ✅ 回滾計畫
- ✅ 簽核流程

**驗收標準**:
- ✅ 檢查表可執行
- ✅ 步驟清晰明確
- ✅ 涵蓋所有風險點

---

### Test Case 12: 範例資料檔案驗證

**步驟**:
1. 檢查檔案是否存在
2. 嘗試在系統中載入

**檢查指令**:
```bash
# 確認檔案存在
ls -lh data/examples/*.xlsx

# 應顯示：
# sample-with-mood.xlsx (約 7-8 MB)
# sample-boundary.xlsx (約 1-2 MB)
```

**功能測試**:
1. 在 Checkinly 系統中點擊「上傳檔案」
2. 選擇 `data/examples/sample-with-mood.xlsx`
3. 上傳並解析

**預期結果**:
- ✅ 檔案成功解析
- ✅ 顯示出勤資料
- ✅ 包含「心情指數」欄位
- ✅ 所有圖表正常顯示

**驗收標準**:
- ✅ 範例檔案可用
- ✅ 涵蓋多種測試情境
- ✅ 資料結構正確

---

## 整合驗收

### Test Case 13: 端到端流程測試

**完整使用者旅程**:

**場景**: HR 專員 Alice 需要分析員工健康狀況

**步驟**:
1. **上傳資料**
   - 開啟 Checkinly
   - 上傳 `sample-with-mood.xlsx`
   - 確認解析成功

2. **查看儀表板**
   - 檢查 KPI 卡片（總工時、加班、Bradford Score 等）
   - 查看健康天氣條
   - 檢查優先關注名單

3. **分析倦怠狀況**
   - 點擊「倦怠評估」
   - 查看趨勢圖（識別高風險部門）
   - 檢查統計卡片（確認高風險人數）

4. **填寫問卷**（模擬員工）
   - 選擇 Stanford 問卷
   - 填寫分數
   - 提交並確認儲存

5. **檢視更新**
   - 重新整理頁面
   - 確認資料持久化（localStorage）

**驗收標準**:
- ✅ 完整流程順暢無阻
- ✅ 資料一致性正確
- ✅ 使用者體驗良好

---

### Test Case 14: 跨瀏覽器測試（選配）

**測試瀏覽器**:
- Chrome Latest ✅（主要）
- Edge Latest ⚠️（建議）
- Firefox Latest ℹ️（可選）

**測試重點**:
- 圖表渲染
- localStorage 支援
- CSS 樣式一致性

**驗收標準**:
- ✅ Chrome 100% 正常
- ⚠️ Edge 95% 正常（小差異可接受）

---

## 驗收檢查表

### INC-006 倦怠趨勢圖與統計

- [ ] **TC1**: 倦怠評估頁面正常顯示
- [ ] **TC2**: Stanford 統計卡片正確（3 張卡片，顏色、人數、百分比正確）
- [ ] **TC3**: Stanford 趨勢圖正確（6 條線，顏色對應，Tooltip 正常）
- [ ] **TC4**: CBI 問卷切換正常（Y 軸 0-100，資料更新）
- [ ] **TC5**: OLBI 問卷切換正常（Y 軸 1-4，資料更新）
- [ ] **TC6**: 響應式設計正常（手機/平板/桌面）
- [ ] **TC7**: Console 無錯誤訊息

### INC-007 測試與文件

- [ ] **TC8**: README.md 包含員工健康監測完整說明
- [ ] **TC9**: USER_GUIDE.md 完整（6 大章節，≥ 400 行）
- [ ] **TC10**: TEST_REPORT.md 記錄 37 個測試案例
- [ ] **TC11**: DEPLOYMENT_CHECKLIST.md 包含 7 大驗證類別
- [ ] **TC12**: 範例資料檔案存在且可用

### 整合測試

- [ ] **TC13**: 端到端流程順暢完成
- [ ] **TC14**: Chrome 瀏覽器測試通過
- [ ] **Build**: `npm run build` 成功（< 40 秒）
- [ ] **Git**: 所有變更已提交（`git status` clean）

---

## 驗收簽核

**驗收人**: ___________________
**驗收日期**: ___________________
**驗收結果**: [ ] 通過  [ ] 有條件通過  [ ] 不通過

**備註**:
```
（記錄任何發現的問題或建議）



```

---

## 常見問題排查

### Q1: 趨勢圖不顯示

**原因**: mockData 未生成或 useEffect 未觸發

**解決方法**:
1. 檢查 Console 是否有錯誤
2. 確認 `generateMockBurnoutData` 函式正常執行
3. 檢查 `mockData` state 是否有資料：
   ```javascript
   // 在 Console 輸入
   console.log(mockData);
   ```

### Q2: 統計卡片顯示 0 人

**原因**: 風險閾值計算錯誤或部門資料問題

**解決方法**:
1. 檢查 `mockBurnoutData.js` 中的 `RISK_THRESHOLDS` 定義
2. 確認分數範圍符合閾值

### Q3: 切換問卷時畫面閃爍

**原因**: React re-render 導致

**解決方法**:
- 正常現象，不影響功能
- 若閃爍嚴重，檢查 useEffect dependencies

### Q4: 範例檔案上傳失敗

**原因**: 檔案路徑錯誤或檔案損壞

**解決方法**:
```bash
# 確認檔案完整性
file data/examples/sample-with-mood.xlsx
# 應顯示：Microsoft Excel 2007+

# 檢查檔案大小
ls -lh data/examples/sample-with-mood.xlsx
# 應 > 1MB
```

---

## 附錄：快速驗收指令

```bash
# 一鍵檢查所有文件是否存在
ls -lh README.md \
  docs/USER_GUIDE.md \
  docs/DEPLOYMENT_CHECKLIST.md \
  docs/testing/TEST_REPORT.md \
  data/examples/sample-with-mood.xlsx \
  data/examples/sample-boundary.xlsx

# 統計文件總行數
wc -l docs/USER_GUIDE.md docs/DEPLOYMENT_CHECKLIST.md docs/testing/TEST_REPORT.md

# 檢查 Git 狀態
git status

# 最終建置測試
npm run build

# 啟動開發伺服器
npm run dev
```

---

**文件版本**: 1.0
**最後更新**: 2026-01-07
**維護者**: Formula Supervisor System
