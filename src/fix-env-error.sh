#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${CYAN}"
echo "╔══════════════════════════════════════════════╗"
echo "║    ⚡ 快速修复环境变量错误                ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}🔧 正在修复 import.meta.env 错误...${NC}"
echo ""

# 检查是否在 frontend 目录
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✅ 已在 frontend 目录${NC}"
elif [ -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  切换到 frontend 目录...${NC}"
    cd frontend
else
    echo -e "${RED}❌ 错误：找不到 frontend 目录${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}[Step 1/3] 更新 lib/api.ts 文件...${NC}"
echo "────────────────────────────────────────────"

# 更新 lib/api.ts
if [ -f "src/lib/api.ts" ]; then
    if [ -f "../lib/api.ts" ]; then
        cp -f ../lib/api.ts src/lib/api.ts
        echo -e "${GREEN}✅ 已更新 lib/api.ts${NC}"
    else
        echo -e "${YELLOW}⚠️  源文件不存在，跳过${NC}"
    fi
else
    echo -e "${RED}❌ src/lib/api.ts 不存在${NC}"
fi

echo ""
echo -e "${CYAN}[Step 2/3] 创建 .env 配置文件...${NC}"
echo "────────────────────────────────────────────"

# 创建 .env 文件
if [ ! -f ".env" ]; then
    cat > .env << 'EOF'
# 环境变量配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=银行智能AI分析平台
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
EOF
    echo -e "${GREEN}✅ 已创建 .env 配置文件${NC}"
else
    echo -e "${GREEN}✅ .env 文件已存在${NC}"
fi

echo ""
echo -e "${CYAN}[Step 3/3] 清除缓存...${NC}"
echo "────────────────────────────────────────────"

# 清除 Vite 缓存
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo -e "${GREEN}✅ 已清除 Vite 缓存${NC}"
else
    echo -e "${YELLOW}⚠️  缓存目录不存在${NC}"
fi

echo ""
echo "══════════════════════════════════════════════"
echo ""
echo -e "${GREEN}✅ 修复完成！${NC}"
echo ""
echo -e "${CYAN}💡 下一步：${NC}"
echo "   1. 关闭当前运行的前端服务（Ctrl+C）"
echo "   2. 运行：npm run dev"
echo "   或：./frontend-start.sh"
echo ""
echo "══════════════════════════════════════════════"
echo ""

read -p "按 Enter 退出..."
