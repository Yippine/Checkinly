# F0 緊急出勤明細表頁面 - 測試指南

## 快速開始

```bash
npm run dev
# 訪問 http://localhost:3004
```

## 驗收測試清單（12 項）

### 1. 路由系統測試
- [ ] **測試 1**: 點擊 Sidebar 的「儀表板」按鈕，確認顯示儀表板視圖
- [ ] **測試 2**: 點擊 Sidebar 的「出勤明細」按鈕，確認顯示 AttendanceTable 組件
- [ ] **測試 12**: 在兩個頁面之間切換，確認有流暢的 fade-in 動畫

### 2. 表格顯示測試
- [ ] **測試 3**: 上傳 CSV/Excel 檔案，確認表格顯示 8 個欄位
  - 部門、員工編號、日期、星期、班別、打卡時間、實到工時、加班紀錄

### 3. 搜尋功能測試
- [ ] **測試 4**: 在搜尋框輸入「小港」，確認即時篩選出小港相關資料
- [ ] **測試 5**: 在搜尋框輸入員工編號（如 N094002），確認即時篩選出該員工所有記錄

### 4. 排序功能測試
- [ ] **測試 6**: 點擊表頭欄位（部門、日期、實到工時），確認
  - 資料按該欄位排序
  - 顯示排序圖示（↑ 升序 或 ↓ 降序）
  - 再次點擊切換排序方向

### 5. 分頁功能測試
- [ ] **測試 8**: 上傳超過 50 筆資料，確認
  - 顯示分頁控制項（第 X 頁，共 Y 頁）
  - 上一頁/下一頁按鈕可正常使用
  - 每頁顯示 50 筆資料

### 6. Excel 匯出測試
- [ ] **測試 7**: 點擊「匯出 Excel」按鈕，確認
  - 下載檔案名稱格式：`出勤明細_匯出_YYYYMMDD.xlsx`
  - 檔案包含當前篩選後的資料（非分頁資料）
  - 若篩選後資料 > 1000 筆，顯示警告提示

### 7. UI/UX 測試
- [ ] **測試 9**: 滑鼠移動到表格任一行，確認 hover 效果（背景變淡灰色）
- [ ] **測試 10**: 調整瀏覽器寬度至手機尺寸（< 768px），確認表格可橫向滾動
- [ ] **測試 11**: 未上傳資料時訪問「出勤明細」頁面，確認顯示空狀態提示

## 公式對照

每個測試項目都對應到 formula-auto-planning.json 中的技術公式：

| 測試項目 | 對應公式子系統 | 實現檔案 |
|---------|---------------|---------|
| 1, 2, 12 | RouteSystem | App.jsx, Sidebar.jsx |
| 3 | TableComponent | AttendanceTable.jsx |
| 4, 5 | SearchEngine | AttendanceTable.jsx (filteredData) |
| 6 | SortEngine | AttendanceTable.jsx (sortedData) |
| 8 | PaginationEngine | AttendanceTable.jsx (paginatedData) |
| 7 | ExportUtility | exportExcel.js |
| 9, 10, 11 | StylingSystem + EmptyState | AttendanceTable.jsx |

## 測試資料

使用專案中的範例資料或上傳自己的 CSV/Excel 檔案。建議測試以下情境：

1. **小資料集**（< 50 筆）：測試無分頁情況
2. **中資料集**（50-200 筆）：測試分頁功能
3. **大資料集**（> 1000 筆）：測試效能與匯出警告

## 驗收標準

- ✅ 所有 12 項測試通過
- ✅ 無 console 錯誤
- ✅ 符合 Ant Design Pro 設計系統
- ✅ 程式碼與公式雙向映射完整

## 技術細節

```javascript
// 資料處理管線（Data Pipeline）
rawData -> filteredData (SearchEngine) -> sortedData (SortEngine) -> paginatedData (PaginationEngine)

// 複雜度分析
SearchEngine: O(n) - 線性掃描
SortEngine: O(n log n) - JavaScript Array.sort()
PaginationEngine: O(1) - 陣列切片
```

---

**實現公式**: `RouteSystem + TableComponent + SearchEngine + SortEngine + PaginationEngine + ExportUtility`

**偏差分數**: 0.02 / 0.05 (PASS)
