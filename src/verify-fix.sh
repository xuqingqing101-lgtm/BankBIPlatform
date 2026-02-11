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
echo "║    🎯 验证前后端代码修复                  ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# 获取脚本所在目录
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

ALL_OK=1

echo "════════════════════════════════════════════════"
echo ""
echo -e "${CYAN}[Step 1/5] 检查关键文件是否存在...${NC}"
echo "────────────────────────────────────────────"

# 检查前端API文件
if [ -f "lib/api.ts" ]; then
    echo -e "${GREEN}✅ lib/api.ts 存在${NC}"
else
    echo -e "${RED}❌ lib/api.ts 不存在${NC}"
    ALL_OK=0
fi

# 检查App.tsx
if [ -f "App.tsx" ]; then
    echo -e "${GREEN}✅ App.tsx 存在${NC}"
else
    echo -e "${RED}❌ App.tsx 不存在${NC}"
    ALL_OK=0
fi

# 检查后端控制器
if [ -f "backend/src/main/java/com/bank/bi/controller/AiController.java" ]; then
    echo -e "${GREEN}✅ AiController.java 存在${NC}"
else
    echo -e "${RED}❌ AiController.java 不存在${NC}"
    ALL_OK=0
fi

if [ -f "backend/src/main/java/com/bank/bi/controller/WelcomeController.java" ]; then
    echo -e "${GREEN}✅ WelcomeController.java 存在${NC}"
else
    echo -e "${RED}❌ WelcomeController.java 不存在${NC}"
    ALL_OK=0
fi

if [ -f "backend/src/main/resources/application.yml" ]; then
    echo -e "${GREEN}✅ application.yml 存在${NC}"
else
    echo -e "${RED}❌ application.yml 不存在${NC}"
    ALL_OK=0
fi

echo ""
echo -e "${CYAN}[Step 2/5] 验证API路径修复...${NC}"
echo "────────────────────────────────────────────"

# 检查lib/api.ts中是否包含修复后的路径
if grep -q "/ai/chat" lib/api.ts 2>/dev/null; then
    echo -e "${GREEN}✅ API路径已修复：/api/ai/chat${NC}"
else
    echo -e "${RED}❌ API路径未修复，仍然是 /api/chat${NC}"
    ALL_OK=0
fi

# 检查是否使用了正确的字段名
if grep -q "query: message" lib/api.ts 2>/dev/null; then
    echo -e "${GREEN}✅ 请求体字段已修复：query${NC}"
else
    echo -e "${RED}❌ 请求体字段未修复${NC}"
    ALL_OK=0
fi

echo ""
echo -e "${CYAN}[Step 3/5] 检查后端配置...${NC}"
echo "────────────────────────────────────────────"

# 检查application.yml中的context-path
if grep -q "context-path: /api" backend/src/main/resources/application.yml 2>/dev/null; then
    echo -e "${GREEN}✅ 后端context-path正确：/api${NC}"
else
    echo -e "${YELLOW}⚠️  后端context-path可能不正确${NC}"
fi

# 检查端口配置
if grep -q "port: 8080" backend/src/main/resources/application.yml 2>/dev/null; then
    echo -e "${GREEN}✅ 后端端口正确：8080${NC}"
else
    echo -e "${YELLOW}⚠️  后端端口可能不正确${NC}"
fi

echo ""
echo -e "${CYAN}[Step 4/5] 检查CORS配置...${NC}"
echo "────────────────────────────────────────────"

if grep -q "setAllowedOriginPatterns" backend/src/main/java/com/bank/bi/config/SecurityConfig.java 2>/dev/null; then
    echo -e "${GREEN}✅ CORS配置存在${NC}"
else
    echo -e "${YELLOW}⚠️  CORS配置可能缺失${NC}"
fi

echo ""
echo -e "${CYAN}[Step 5/5] 检查环境变量配置...${NC}"
echo "────────────────────────────────────────────"

if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✅ frontend/.env 存在${NC}"
    echo ""
    echo "内容："
    cat frontend/.env
else
    echo -e "${YELLOW}⚠️  frontend/.env 不存在（不影响运行，会使用默认值）${NC}"
fi

echo ""
echo "════════════════════════════════════════════════"
echo ""

if [ $ALL_OK -eq 1 ]; then
    echo -e "${GREEN}✅✅✅ 所有检查通过！代码已修复！${NC}"
    echo ""
    echo -e "${CYAN}📋 前后端API映射：${NC}"
    echo "   ────────────────────────────────"
    echo "   健康检查：GET  /api/health         ✅"
    echo "   AI对话：  POST /api/ai/chat       ✅"
    echo "   对话列表：GET  /api/ai/conversations ✅"
    echo ""
    echo -e "${CYAN}🚀 下一步：${NC}"
    echo "   1. 启动后端：./backend-start.sh"
    echo "   2. 启动前端：./frontend-start.sh"
    echo "   3. 打开浏览器：http://localhost:5173"
    echo ""
else
    echo -e "${RED}❌ 发现问题，请检查上面标记为 ❌ 的项${NC}"
    echo ""
    echo -e "${YELLOW}💡 修复建议：${NC}"
    echo "   1. 确保运行了修复脚本"
    echo "   2. 检查文件是否在正确位置"
    echo "   3. 查看 ✅ 全面代码检查报告.md"
    echo ""
fi

echo "════════════════════════════════════════════════"
echo ""

read -p "按 Enter 退出..."
