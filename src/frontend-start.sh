#!/bin/bash

# 设置颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

clear

echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════╗"
echo "║         🚀 前端快速启动                    ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查 frontend 目录是否存在
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ frontend 目录不存在！${NC}"
    echo ""
    echo -e "${YELLOW}💡 请先运行：./frontend-deploy.sh${NC}"
    exit 1
fi

cd frontend

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  未检测到 node_modules 目录${NC}"
    echo ""
    echo -e "${YELLOW}⏳ 正在安装依赖...${NC}"
    echo ""
    npm install
    if [ $? -ne 0 ]; then
        echo ""
        echo -e "${RED}❌ 依赖安装失败！${NC}"
        exit 1
    fi
    echo ""
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
    echo ""
fi

echo -e "${GREEN}✅ 环境检查通过${NC}"
echo ""
echo -e "${CYAN}📌 启动信息：${NC}"
echo "   前端：http://localhost:3000"
echo "   后端：http://localhost:8080"
echo ""
echo -e "${YELLOW}⚠️  请确保后端服务已启动！${NC}"
echo ""
echo -e "${YELLOW}⏳ 正在启动开发服务器...${NC}"
echo ""

npm run dev

echo ""
echo -e "${GREEN}✅ 服务已停止${NC}"
