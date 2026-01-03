# Maintenance Guide

本文檔提供 Checkinly 系統的維護指南，包含常見修改場景、組件使用方式、設計系統維護規範。

## 目錄

- [設計系統維護](#設計系統維護)
- [組件使用指南](#組件使用指南)
- [常見修改場景](#常見修改場景)
- [開發最佳實踐](#開發最佳實踐)
- [疑難排解](#疑難排解)

---

## 設計系統維護

### 設計系統文檔

完整設計系統規範請參考：
- [DESIGN_SYSTEM.md](./docs/DESIGN_SYSTEM.md)

### 核心設計原則

1. **4px 基礎網格**: 所有間距必須是 4 的倍數
2. **語義化配色**: 使用 Primary/Success/Warning/Error 語義色
3. **統一圓角**: Button(6px), Card(12px), Modal(16px)
4. **陰影層級**: 使用 shadow-card / shadow-dropdown / shadow-modal
5. **無障礙標準**: 所有互動元素需有 focus 樣式和 ARIA 標籤

### 修改配色

**位置**: `tailwind.config.js`

```javascript
colors: {
  primary: {
    500: '#1890ff',  // 主色調
    600: '#096dd9',  // 深色變體
    // ...
  }
}
```

**影響範圍**: 按鈕、連結、active 狀態、圖表

**注意事項**:
- 確保對比度 ≥ 4.5:1 (WCAG AA)
- 修改後需更新 DESIGN_SYSTEM.md
- 測試所有互動狀態（hover/active/focus）

### 修改間距

**位置**: `tailwind.config.js`

```javascript
spacing: {
  '18': '72px',  // 自定義間距
  // ...
}
```

**命名規範**: 使用 4px 倍數（4, 8, 12, 16, 24, 32...）

**使用方式**:
```jsx
<div className="p-6">   {/* padding: 24px */}
<div className="gap-4"> {/* gap: 16px */}
```

### 修改字體

**位置**: `tailwind.config.js`

```javascript
fontSize: {
  'heading-1': ['24px', { lineHeight: '32px', fontWeight: '600' }],
  // ...
}
```

**使用方式**:
```jsx
<h1 className="text-heading-1">標題</h1>
```

---

## 組件使用指南

### StatCard 組件

**用途**: KPI 數值卡片，支援語義化配色和趨勢指示器

**基本使用**:
```jsx
<StatCard
  title="本月總工時"
  value="2,345"
  subtext="人均 156 小時"
  icon={Briefcase}
  colorScheme="primary"  // 'primary' | 'success' | 'warning' | 'error'
  trend={{ direction: 'up', percentage: '8.5', label: '較上月' }}
/>
```

**Props 說明**:
- `title`: 卡片標題
- `value`: 主要數值（會以 36px 粗體顯示）
- `subtext`: 輔助說明
- `icon`: Lucide React 圖標
- `colorScheme`: 語義化配色方案
- `trend`: 趨勢指示器（可選）

### Card 組件

**用途**: 基礎容器卡片，自帶陰影和圓角

**基本使用**:
```jsx
<Card animated={true}>
  <h3 className="text-heading-3 mb-4">卡片標題</h3>
  <p>卡片內容</p>
</Card>
```

**Props 說明**:
- `className`: 自定義樣式（會合併到預設樣式）
- `animated`: 是否顯示進場動畫（預設 true）

### Header 組件

**用途**: 固定頂部導航，包含品牌、標題、操作按鈕

**基本使用**:
```jsx
<Header
  fileName={fileName}
  onMenuClick={() => setSidebarOpen(!sidebarOpen)}
/>
```

**自訂修改**:
- 高度固定 64px（h-16）
- 左側間距: lg:left-64（適配 Sidebar）
- z-index: z-sticky (1020)

### Sidebar 組件

**用途**: 固定側邊欄，支援響應式收合

**基本使用**:
```jsx
<Sidebar
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
/>
```

**自訂導航項目**:

修改 `src/components/Sidebar.jsx`:

```jsx
const navItems = [
  { icon: LayoutDashboard, label: '儀表板' },
  { icon: FileText, label: '出勤明細' },
  { icon: Users, label: '員工管理' },
  { icon: Settings, label: '設定' },
  // 新增項目
  { icon: YourIcon, label: '新功能' },
];
```

---

## 常見修改場景

### 場景 1: 新增 KPI 卡片

**步驟**:
1. 在 `src/utils/statsCalculator.js` 添加計算邏輯
2. 在 `src/App.jsx` 添加 StatCard

```jsx
<StatCard
  title="新 KPI"
  value={stats.newMetric}
  subtext="說明文字"
  icon={YourIcon}
  colorScheme="primary"
/>
```

### 場景 2: 修改圖表配色

**位置**: `src/App.jsx`

```jsx
const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d'];
```

**修改後**:
```jsx
const COLORS = ['#新色1', '#新色2', '#新色3', '#新色4'];
```

**注意**: 確保新色符合設計系統且對比度足夠

### 場景 3: 新增智能建議規則

**位置**: `src/utils/statsCalculator.js`

```javascript
// 在 suggestions 陣列中添加
if (condition) {
  suggestions.push({
    type: 'warning',  // 'info' | 'warning' | 'error'
    text: '建議內容'
  });
}
```

### 場景 4: 修改上傳檔案格式支援

**位置**: `src/App.jsx`

```jsx
const fileExt = file.name.split('.').pop().toLowerCase();

if (fileExt === 'csv') {
  parseCSV(file, setData, setLoading, setError);
} else if (['xlsx', 'xls'].includes(fileExt)) {
  parseExcel(file, setData, setLoading, setError);
} else if (fileExt === 'json') {  // 新增格式
  parseJSON(file, setData, setLoading, setError);
} else {
  setError('不支援的檔案格式');
}
```

**需同步修改**:
- `accept` 屬性: `accept=".csv,.xlsx,.xls,.json"`
- 錯誤訊息文字
- 提示文字（支援格式列表）

### 場景 5: 調整響應式斷點

**位置**: `tailwind.config.js`

Tailwind 預設斷點：
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**自訂斷點**:
```javascript
theme: {
  screens: {
    'tablet': '768px',
    'desktop': '1280px',
  }
}
```

**使用方式**:
```jsx
<div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-4">
```

---

## 開發最佳實踐

### 代碼風格

1. **組件命名**: PascalCase (例: `StatCard.jsx`)
2. **工具函數**: camelCase (例: `calculateStats.js`)
3. **常數**: UPPER_SNAKE_CASE (例: `const COLORS = [...]`)
4. **CSS 類名**: kebab-case 或 Tailwind utilities

### 組件結構

```jsx
// 1. Imports
import React from 'react';
import { Icon } from 'lucide-react';

// 2. Component Definition
const MyComponent = ({ prop1, prop2 }) => {
  // 3. State & Hooks
  const [state, setState] = useState(null);

  // 4. Effects
  useEffect(() => {}, []);

  // 5. Handlers
  const handleClick = () => {};

  // 6. Render
  return (
    <div className="...">
      {/* Content */}
    </div>
  );
};

// 7. Export
export default MyComponent;
```

### 效能優化

1. **使用 useMemo** 緩存昂貴計算:
```jsx
const stats = useMemo(() => calculateStats(data), [data]);
```

2. **使用 useCallback** 避免不必要的重新渲染:
```jsx
const handleUpload = useCallback((file) => {}, [dependencies]);
```

3. **延遲載入大型組件**:
```jsx
const HeavyChart = lazy(() => import('./HeavyChart'));
```

### Git Commit 規範

遵循 Conventional Commits:

```bash
feat: 新增功能
fix: 修復 bug
refactor: 重構代碼
style: 樣式調整
docs: 文檔更新
test: 測試相關
chore: 建構工具或輔助工具
```

範例:
```bash
git commit -m "feat(ui): add export to Excel functionality"
git commit -m "fix(parser): resolve Big5 encoding issue"
git commit -m "refactor(stats): optimize calculation performance"
```

---

## 疑難排解

### 問題 1: Tailwind 樣式不生效

**可能原因**:
- 類名拼寫錯誤
- 自定義類未在 `tailwind.config.js` 定義
- Tailwind 4.x 不支援 @apply 自定義類

**解決方案**:
1. 檢查拼寫
2. 確認 `content` 路徑正確: `"./src/**/*.{js,jsx}"`
3. 使用原生 CSS 取代 @apply

### 問題 2: 圖表不顯示

**可能原因**:
- Recharts 未載入
- 數據格式不正確
- 容器高度為 0

**解決方案**:
1. 檢查 Console 是否有錯誤
2. 驗證數據格式符合 Recharts 要求
3. 確保容器有明確高度: `<div className="h-64">`

### 問題 3: 檔案上傳失敗

**可能原因**:
- 檔案格式不支援
- 檔案大小超過限制
- 編碼問題

**解決方案**:
1. 檢查檔案副檔名
2. 確認檔案 < 10MB
3. 嘗試另一種編碼（UTF-8 / Big5）

### 問題 4: 構建失敗

**可能原因**:
- Node.js 版本不符
- 依賴衝突
- 語法錯誤

**解決方案**:
```bash
# 1. 檢查 Node.js 版本
node -v  # 應該 >= 18

# 2. 清除並重新安裝
rm -rf node_modules package-lock.json
npm install

# 3. 檢查語法
npm run lint

# 4. 重新構建
npm run build
```

### 問題 5: 響應式佈局異常

**可能原因**:
- 斷點使用錯誤
- 固定寬度覆蓋響應式
- Sidebar 間距未調整

**解決方案**:
1. 使用正確的斷點: `lg:ml-64` (桌面) / `ml-0` (移動)
2. 避免固定寬度，使用 `w-full` 或 `max-w-*`
3. 檢查 Header 的 `left` 值: `lg:left-64` / `left-0`

---

## 版本升級指南

### 升級 React

```bash
npm install react@latest react-dom@latest
```

**注意事項**:
- 查閱 [React 更新日誌](https://react.dev/blog)
- 測試所有組件是否正常
- 檢查新的 deprecation 警告

### 升級 Tailwind CSS

```bash
npm install -D tailwindcss@latest
```

**注意事項**:
- Tailwind 4.x 語法有重大變更
- 檢查 `tailwind.config.js` 是否需要調整
- 測試所有樣式是否正常

### 升級 Vite

```bash
npm install -D vite@latest
```

**注意事項**:
- 查閱 [Vite 遷移指南](https://vitejs.dev/guide/migration.html)
- 測試開發和構建是否正常
- 檢查插件相容性

---

## 資源連結

- [React 文檔](https://react.dev/)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [Vite 文檔](https://vitejs.dev/)
- [Recharts 文檔](https://recharts.org/)
- [Lucide Icons](https://lucide.dev/)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)

---

**維護者**: Claude Code (Anthropic)
**最後更新**: 2025-12-10
