#!/bin/bash

# Checkinly 系統服務卸載腳本

echo "🗑️  開始卸載 Checkinly systemd 服務 (Port 3004)..."

# 檢查是否為 root 或有 sudo 權限
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  此腳本需要 sudo 權限，請使用: sudo ./scripts/uninstall-service.sh"
    exit 1
fi

# 定義顏色
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🛑 步驟 1/4: 停止服務..."
systemctl stop checkinly.service 2>/dev/null
echo -e "${GREEN}✓ 服務已停止${NC}"

echo ""
echo "❌ 步驟 2/4: 停用服務（取消開機自動啟動）..."
systemctl disable checkinly.service 2>/dev/null
echo -e "${GREEN}✓ 已停用開機自動啟動${NC}"

echo ""
echo "🗑️  步驟 3/4: 刪除服務文件..."
rm -f /etc/systemd/system/checkinly.service
echo -e "${GREEN}✓ 服務文件已刪除${NC}"

echo ""
echo "🔄 步驟 4/4: 重新載入 systemd..."
systemctl daemon-reload
systemctl reset-failed
echo -e "${GREEN}✓ systemd 已重新載入${NC}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ 卸載完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}💡 提示：${NC}"
echo "  如需手動啟動服務，請使用："
echo "  cd /home/leowu/Yippine/Checkinly"
echo "  npm run dev"
echo ""
echo "  服務已從系統中完全移除，不會在開機時自動啟動"
echo ""
