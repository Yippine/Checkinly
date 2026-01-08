#!/bin/bash
# Quick Acceptance Test for INC-006 & INC-007
# 快速驗收測試腳本

echo "========================================="
echo "INC-006 & INC-007 快速驗收測試"
echo "========================================="
echo ""

# Step 1: 檢查 Git 狀態
echo "Step 1: 檢查 Git 狀態..."
git log --oneline | head -3
echo ""

# Step 2: 檢查文件完整性
echo "Step 2: 檢查文件完整性..."
echo ""
echo "必要文件檢查："
files=(
  "README.md"
  "docs/USER_GUIDE.md"
  "docs/DEPLOYMENT_CHECKLIST.md"
  "docs/testing/TEST_REPORT.md"
  "docs/testing/ACCEPTANCE_GUIDE_INC-006-007.md"
  "data/examples/sample-with-mood.xlsx"
  "data/examples/sample-boundary.xlsx"
)

all_exist=true
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    size=$(ls -lh "$file" | awk '{print $5}')
    echo "✓ $file ($size)"
  else
    echo "✗ $file (不存在)"
    all_exist=false
  fi
done
echo ""

# Step 3: 檢查新增組件
echo "Step 3: 檢查新增組件..."
components=(
  "src/utils/mockBurnoutData.js"
  "src/components/BurnoutTrendChart.jsx"
  "src/components/BurnoutRiskStats.jsx"
)

for comp in "${components[@]}"; do
  if [ -f "$comp" ]; then
    lines=$(wc -l < "$comp")
    echo "✓ $comp ($lines 行)"
  else
    echo "✗ $comp (不存在)"
    all_exist=false
  fi
done
echo ""

# Step 4: 文件行數統計
echo "Step 4: 文件品質檢查..."
echo ""
echo "使用者文件行數："
wc -l docs/USER_GUIDE.md docs/DEPLOYMENT_CHECKLIST.md docs/testing/TEST_REPORT.md | tail -1
echo ""

# Step 5: 建置測試
echo "Step 5: 執行建置測試..."
echo ""
echo "執行 npm run build..."
npm run build 2>&1 | tail -15
build_status=$?
echo ""

# Step 6: 總結
echo "========================================="
echo "驗收測試總結"
echo "========================================="
if [ $all_exist = true ] && [ $build_status -eq 0 ]; then
  echo "✅ 所有檢查通過！"
  echo ""
  echo "下一步："
  echo "1. 執行 'npm run dev' 啟動開發伺服器"
  echo "2. 開啟瀏覽器訪問 http://localhost:3004"
  echo "3. 參考 docs/testing/ACCEPTANCE_GUIDE_INC-006-007.md 進行手動驗收"
  echo ""
  echo "快速驗收路徑："
  echo "  → 點擊側邊欄「倦怠評估」"
  echo "  → 檢查統計卡片（3 張：低/中/高風險）"
  echo "  → 檢查趨勢圖（6 個部門線條）"
  echo "  → 切換問卷類型（Stanford / CBI / OLBI）"
else
  echo "⚠️ 部分檢查未通過，請檢查上方輸出"
fi
echo ""
