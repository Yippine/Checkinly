# Hotfix Report: INC-006 Tooltip Error

**Issue ID**: HOTFIX-001
**Date**: 2026-01-07
**Severity**: P1 (High - Blocks Testing)
**Status**: ✅ FIXED

---

## Problem Description

### Error Message
```
BurnoutTrendChart.jsx:119
Uncaught TypeError: Cannot read properties of undefined (reading 'toFixed')
at CustomTooltip (BurnoutTrendChart.jsx:119:22)
```

### Symptom
- 進入「倦怠評估」頁面幾秒後白畫面
- F12 Console 顯示紅色錯誤訊息
- 頁面無法正常使用

### Reproduction Steps
1. 啟動開發伺服器 `npm run dev`
2. 開啟 `http://localhost:3004`
3. 點擊側邊欄「倦怠評估」
4. 等待 2-3 秒
5. ❌ 頁面白畫面，Console 報錯

---

## Root Cause Analysis

### Data Flow Issue

**問題根源**: 資料結構轉換後，CustomTooltip 無法正確讀取分數

#### 原始資料結構（mockBurnoutData.js）:
```javascript
[
  {
    department: "護理部",
    month: "2025-01",
    avgScore: 3.5,
    employeeCount: 25
  },
  ...
]
```

#### 圖表資料轉換（chartData）:
```javascript
[
  {
    month: "2025-01",
    護理部: 3.5,    // avgScore 被拆分成部門屬性
    醫療部: 3.2,
    檢驗部: 2.8,
    ...
  },
  ...
]
```

#### Recharts Tooltip Payload 結構:
```javascript
payload: [
  {
    dataKey: "護理部",  // Line 的 dataKey
    value: 3.5,         // 對應的分數值
    payload: {          // 完整的 chartData 資料點
      month: "2025-01",
      護理部: 3.5,
      醫療部: 3.2,
      ...
    }
  }
]
```

### Buggy Code (Before Fix)

**File**: `src/components/BurnoutTrendChart.jsx:75-79`

```javascript
const CustomTooltip = ({ active, payload, questionnaireType }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const score = data.avgScore;  // ❌ ERROR: avgScore doesn't exist!

  // Later at line 119:
  平均分數: {score.toFixed(2)}  // ❌ Cannot read 'toFixed' of undefined
}
```

**Problem**:
- `data.avgScore` is `undefined` because transformed chartData has no `avgScore` field
- `score.toFixed(2)` throws error when `score` is `undefined`

---

## Solution

### Code Changes

**Modified 3 lines** in `src/components/BurnoutTrendChart.jsx`:

#### Change 1: Extract department name from dataKey (Line 79)
```diff
const CustomTooltip = ({ active, payload, questionnaireType }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
- const score = data.avgScore;
+ const department = payload[0].dataKey; // Department name from Line dataKey
+ const score = payload[0].value; // Score from Line value
```

#### Change 2: Use extracted department variable (Line 117)
```diff
  <p className="text-xs text-text-secondary mb-1">
-   {data.department} · {data.month}
+   {department} · {data.month}
  </p>
```

#### Change 3: Add null safety check (Line 120)
```diff
  <p className={`text-sm font-semibold ${colorClass.split(" ")[0]}`}>
-   平均分數: {score.toFixed(2)}
+   平均分數: {score !== undefined && score !== null ? score.toFixed(2) : 'N/A'}
  </p>
```

### Why This Works

1. **Correct Data Access**:
   - `payload[0].dataKey` → Department name (e.g., "護理部")
   - `payload[0].value` → Score value (e.g., 3.5)

2. **Null Safety**:
   - Added defensive check `score !== undefined && score !== null`
   - Fallback to 'N/A' if score is invalid

3. **Data Flow Aligned**:
   - Now matches Recharts' actual payload structure
   - No assumptions about transformed data shape

---

## Verification

### Build Test
```bash
npm run build
# ✅ Result: built in 34.99s (SUCCESS)
```

### Manual Test Checklist

After applying fix, verify:

- [ ] Navigate to「倦怠評估」page
- [ ] Page loads without white screen
- [ ] No errors in Console (F12)
- [ ] Hover mouse over trend chart lines
- [ ] Tooltip displays correctly:
  - ✅ Department name (e.g., "護理部")
  - ✅ Month (e.g., "2025-01")
  - ✅ Score (e.g., "3.50")
  - ✅ Risk level (e.g., "高風險")
- [ ] Switch questionnaire types (Stanford / CBI / OLBI)
- [ ] Tooltip updates correctly for all types

---

## Impact Assessment

### Files Changed
- `src/components/BurnoutTrendChart.jsx` (3 lines modified)

### Affected Features
- ✅ Burnout Trend Chart Tooltip (FIXED)
- ✅ All questionnaire types (Stanford / CBI / OLBI)
- ✅ Chart interactivity

### Risk Level
- **Low**: Minimal change, isolated to tooltip rendering
- No impact on data generation or other components

---

## Lessons Learned

### Testing Gaps
1. **Missing Interactive Testing**:
   - Automated code review didn't catch runtime errors
   - Need manual hover/interaction tests

2. **Data Structure Validation**:
   - Should verify transformed data matches component expectations
   - Add runtime checks for critical data paths

### Prevention Measures
1. **Add PropTypes or TypeScript**:
   - Would catch type mismatches at dev time
   - Tooltip expects specific payload structure

2. **Add Defensive Coding**:
   - Always check `undefined`/`null` before calling methods
   - Use optional chaining (`score?.toFixed(2)`)

3. **Component Testing**:
   - Add tests for Recharts Tooltip interactions
   - Mock different payload structures

---

## Follow-up Actions

### Immediate (This Release)
- [x] Fix CustomTooltip data extraction
- [x] Add null safety checks
- [x] Verify build succeeds
- [ ] Manual testing by user

### Short-term (Next Sprint)
- [ ] Add PropTypes to BurnoutTrendChart
- [ ] Add unit tests for CustomTooltip
- [ ] Document Recharts payload structure

### Long-term (Future)
- [ ] Consider TypeScript migration for better type safety
- [ ] Add E2E tests for chart interactions
- [ ] Create reusable Tooltip component with validation

---

## Related Issues
- INC-006: Burnout Trend Visualization (Original Implementation)
- INC-007: Integration Testing (Test Report needs update)

---

**Fixed By**: Formula Supervisor
**Verified By**: (Pending User Testing)
**Approved By**: (Pending)

**Status**: ✅ Fix Applied, Awaiting Verification
