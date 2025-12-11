# Checkinly - 智能出勤管理系統

> 專業級工時分析平台，符合 Ant Design Pro 標準，提供完整的出勤數據分析與智能建議

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite)](https://vitejs.dev/)

## 功能特性

### 數據處理
- **智能上傳**: 支援拖曳上傳 Excel (.xlsx) 和 CSV 檔案
- **自動編碼檢測**: UTF-8 / Big5 自動識別與 fallback
- **智能欄位映射**: 自動識別部門、員工編號、日期、工時等欄位
- **即時解析**: 大數據檔案快速解析與渲染

### 數據分析
- **KPI 儀表板**: 總工時、加班時數、出勤異常、在職人數
- **趨勢分析**: 每日出勤趨勢圖表（正常工時 + 加班時數）
- **部門排行**: 部門工時與加班排行（橫向堆疊長條圖）
- **狀態分佈**: 出勤狀態圓餅圖（內圈設計）
- **加班排行**: Top 5 加班員工表格

### 智能建議
- **自動分析**: 基於數據自動生成管理建議
- **異常預警**: 識別高加班、高遲到等異常情況
- **優化建議**: 提供人力調配和流程優化建議

### UI/UX 特性
- **Ant Design Pro 風格**: 專業級企業 UI 標準
- **完整設計系統**: 色彩、間距、字體、陰影、圓角統一規範
- **響應式設計**: 支援手機/平板/桌面全斷點
- **無障礙支援**: WCAG 2.1 AA 標準，完整 ARIA 標籤
- **動畫體驗**: 流暢的進場動畫和互動反饋
- **暗色 Sidebar**: 專業的側邊欄導航設計

## 技術棧

- **前端框架**: React 19.2
- **構建工具**: Vite 7.2
- **樣式系統**: Tailwind CSS 4.1
- **圖表庫**: Recharts 3.5
- **圖標庫**: Lucide React 0.555
- **資料解析**: SheetJS (xlsx) + PapaParse

## 快速開始

### 安裝依賴

```bash
npm install
```

### 開發模式

```bash
npm run dev
```

應用將在 http://localhost:5175 啟動

### 生產構建

```bash
npm run build
```

構建產出將在 `dist/` 目錄

### 預覽構建

```bash
npm run preview
```

## 專案結構

```
Checkinly/
├── .claude/
│   └── formula/
│       ├── DESIGN_SYSTEM.md      # 完整設計系統規範
│       ├── FORMULA.md             # 專案公式化文檔
│       ├── history/               # 歷史版本封存
│       └── workflow/              # 自動化執行記錄
├── data/
│   └── 11401出勤明細.xlsx        # 測試數據檔案
├── docs/
│   └── DESIGN_SYSTEM.md          # 設計系統（主文檔）
├── src/
│   ├── components/
│   │   ├── Card.jsx              # 基礎卡片組件
│   │   ├── EmptyState.jsx        # 空狀態組件
│   │   ├── GlobalLoader.jsx      # 全局載入器
│   │   ├── Header.jsx            # 頂部導航
│   │   ├── Sidebar.jsx           # 側邊欄
│   │   ├── Skeleton.jsx          # 骨架屏
│   │   └── StatCard.jsx          # KPI 卡片
│   ├── utils/
│   │   ├── fileParser.js         # 檔案解析工具
│   │   └── statsCalculator.js   # 統計計算工具
│   ├── App.jsx                   # 主應用組件
│   ├── App.css                   # 應用樣式
│   ├── index.css                 # 全局樣式
│   └── main.jsx                  # 應用入口
├── dist/                         # 構建產出
├── index.html                    # HTML 模板
├── package.json                  # 依賴配置
├── tailwind.config.js            # Tailwind 配置
├── vite.config.js                # Vite 配置
├── README.md                     # 專案說明（本文件）
├── CHANGELOG.md                  # 版本變更記錄
├── DEPLOYMENT.md                 # 部署指南
├── MAINTENANCE.md                # 維護指南
└── TESTING.md                    # 測試指南
```

## 使用說明

### 1. 上傳檔案

1. 點擊上傳區域的「選擇檔案」按鈕
2. 選擇 Excel (.xlsx) 或 CSV 檔案
3. 系統自動解析並顯示分析結果

或

1. 直接拖曳檔案到上傳區域
2. 系統自動解析並顯示分析結果

### 2. 查看分析結果

上傳成功後，系統將顯示：

- **KPI 卡片**: 總工時、加班時數、出勤異常、在職人數
- **趨勢圖表**: 每日出勤變化趨勢
- **部門排行**: 各部門工時與加班情況
- **智能建議**: 自動生成的管理建議
- **狀態分佈**: 出勤狀態圓餅圖
- **加班排行**: Top 5 加班員工

### 3. 清除數據

點擊右上角「清除資料重選」按鈕，可重新上傳檔案

## 設計規範

本專案嚴格遵循 Ant Design Pro 設計規範，完整設計系統文檔請參考：

- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md) - 完整設計系統規範

### 核心設計原則

1. **一致性**: 統一的視覺語言和互動模式
2. **清晰性**: 明確的視覺層次和導航結構
3. **效率性**: 優化的開發者體驗和組件複用
4. **無障礙**: 符合 WCAG 2.1 AA 標準
5. **可擴展性**: 從手機到桌面的無縫適配

### 設計系統亮點

- **4px 基礎網格**: 所有間距基於 4px 倍數
- **語義化色彩**: Primary/Success/Warning/Error 完整色階
- **Elevation 系統**: 5 級陰影系統營造深度感
- **Typography 階層**: 從 Display 到 Caption 的完整字體系統
- **動畫系統**: 流暢的進場和互動動畫

## 瀏覽器支援

- Chrome (最新)
- Firefox (最新)
- Safari (最新)
- Edge (最新)

## 效能指標

- **Lighthouse Performance**: ≥ 90
- **Lighthouse Accessibility**: ≥ 90
- **Lighthouse Best Practices**: ≥ 90
- **Lighthouse SEO**: ≥ 90
- **首屏載入**: < 3s
- **互動響應**: < 100ms
- **動畫幀率**: ≥ 60fps

## 維護與更新

- 維護指南: [MAINTENANCE.md](./MAINTENANCE.md)
- 測試指南: [TESTING.md](./TESTING.md)
- 部署指南: [DEPLOYMENT.md](./DEPLOYMENT.md)
- 版本記錄: [CHANGELOG.md](./CHANGELOG.md)

## 開發團隊

由 Claude Code (Anthropic) 協助開發，基於 Formula-Contract 方法論實現精確的需求到代碼轉換。

## 授權

MIT License

---

**Checkinly** - Professional Work Hour Analysis System
Built with React + Vite + Tailwind CSS + Recharts
