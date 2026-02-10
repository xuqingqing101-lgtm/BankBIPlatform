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
echo "║    🌐 前端本地部署 - 自动化脚本           ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${CYAN}[信息] 本脚本会帮你完成以下操作：${NC}"
echo "  1. 创建 frontend 目录结构"
echo "  2. 复制所有前端文件"
echo "  3. 创建配置文件"
echo "  4. 安装依赖（需要 Node.js）"
echo "  5. 启动开发服务器"
echo ""

read -p "按 Enter 继续..."

echo ""
echo -e "${CYAN}[Step 1/6] 检查 Node.js 环境...${NC}"
echo "────────────────────────────────────────────"

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未检测到 Node.js！${NC}"
    echo ""
    echo -e "${YELLOW}💡 请先安装 Node.js：${NC}"
    echo "   下载地址：https://nodejs.org/"
    echo "   推荐版本：18 或 20"
    echo ""
    echo "安装后重新运行此脚本"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本：$(node -v)${NC}"
echo -e "${GREEN}✅ npm 版本：$(npm -v)${NC}"

echo ""
echo -e "${CYAN}[Step 2/6] 创建项目目录...${NC}"
echo "────────────────────────────────────────────"

mkdir -p frontend/src/components
mkdir -p frontend/src/styles
mkdir -p frontend/src/imports
mkdir -p frontend/public

echo -e "${GREEN}✅ 目录结构创建完成${NC}"

echo ""
echo -e "${CYAN}[Step 3/6] 复制配置文件...${NC}"
echo "────────────────────────────────────────────"

# 复制配置文件
cp -f frontend-package.json frontend/package.json 2>/dev/null || echo "⚠️  package.json 未找到"
cp -f frontend-vite.config.ts frontend/vite.config.ts 2>/dev/null || echo "⚠️  vite.config.ts 未找到"
cp -f frontend-tsconfig.json frontend/tsconfig.json 2>/dev/null || echo "⚠️  tsconfig.json 未找到"
cp -f frontend-tsconfig.node.json frontend/tsconfig.node.json 2>/dev/null || echo "⚠️  tsconfig.node.json 未找到"
cp -f frontend-index.html frontend/index.html 2>/dev/null || echo "⚠️  index.html 未找到"
cp -f frontend-main.tsx frontend/src/main.tsx 2>/dev/null || echo "⚠️  main.tsx 未找到"
cp -f frontend-tailwind.config.js frontend/tailwind.config.js 2>/dev/null || echo "⚠️  tailwind.config.js 未找到"
cp -f frontend-postcss.config.js frontend/postcss.config.js 2>/dev/null || echo "⚠️  postcss.config.js 未找到"

echo -e "${GREEN}✅ 配置文件复制完成${NC}"

echo ""
echo -e "${CYAN}[Step 4/6] 复制源代码文件...${NC}"
echo "────────────────────────────────────────────"
echo ""
echo -e "${YELLOW}⚠️  请手动完成以下操作：${NC}"
echo ""
echo "1. 从 Figma Make 或当前项目复制以下文件到 frontend/src/"
echo "   - App.tsx"
echo "   - components/*.tsx (所有组件文件)"
echo "   - styles/globals.css"
echo "   - imports/* (所有图片和SVG)"
echo ""
echo "2. 或者，如果你已经有这些文件在项目根目录："
echo "   - 复制 App.tsx 到 frontend/src/App.tsx"
echo "   - 复制 components/*.tsx 到 frontend/src/components/"
echo "   - 复制 styles/globals.css 到 frontend/src/styles/"
echo "   - 复制 imports/* 到 frontend/src/imports/"
echo ""

# 尝试自动复制（如果文件存在）
if [ -f "App.tsx" ]; then
    cp App.tsx frontend/src/App.tsx
    echo -e "${GREEN}✅ 已复制 App.tsx${NC}"
fi

if [ -f "styles/globals.css" ]; then
    cp -f styles/globals.css frontend/src/styles/globals.css
    echo -e "${GREEN}✅ 已复制 globals.css${NC}"
fi

if [ -d "components" ]; then
    cp -rf components/* frontend/src/components/ 2>/dev/null
    echo -e "${GREEN}✅ 已复制 components 目录${NC}"
fi

if [ -d "imports" ]; then
    cp -rf imports/* frontend/src/imports/ 2>/dev/null
    echo -e "${GREEN}✅ 已复制 imports 目录${NC}"
fi

echo ""
echo -e "${YELLOW}💡 如果有文件未自动复制，请手动复制后继续${NC}"
echo ""

read -p "按 Enter 继续..."

echo ""
echo -e "${CYAN}[Step 5/6] 安装依赖...${NC}"
echo "────────────────────────────────────────────"
echo ""
echo -e "${YELLOW}⏳ 正在安装依赖包（可能需要几分钟）...${NC}"
echo ""

cd frontend
npm install

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ 依赖安装失败！${NC}"
    echo ""
    echo -e "${YELLOW}💡 可能的原因：${NC}"
    echo "   1. 网络连接问题"
    echo "   2. npm 配置问题"
    echo ""
    echo -e "${YELLOW}💡 解决方案：${NC}"
    echo "   1. 检查网络连接"
    echo "   2. 尝试使用国内镜像："
    echo "      npm config set registry https://registry.npmmirror.com"
    echo "   3. 重新运行此脚本"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 依赖安装完成${NC}"

echo ""
echo -e "${CYAN}[Step 6/6] 启动开发服务器...${NC}"
echo "────────────────────────────────────────────"
echo ""
echo -e "${GREEN}✅ 一切就绪！即将启动开发服务器...${NC}"
echo ""
echo -e "${CYAN}📌 服务器信息：${NC}"
echo "   前端地址：http://localhost:3000"
echo "   后端地址：http://localhost:8080"
echo ""
echo -e "${YELLOW}💡 启动后：${NC}"
echo "   1. 浏览器会自动打开 http://localhost:3000"
echo "   2. 确保后端服务也在运行（8080端口）"
echo "   3. 前端会自动连接到后端"
echo ""
echo -e "${YELLOW}⚠️  保持此窗口打开！按 Ctrl+C 可停止服务${NC}"
echo ""
echo "══════════════════════════════════════════════"
echo ""

npm run dev

echo ""
echo "══════════════════════════════════════════════"
echo -e "${GREEN}✅ 服务已停止${NC}"
echo "══════════════════════════════════════════════"
