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
echo "║    🔧 修复前端文件结构                    ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查是否在 frontend 目录
if [ -f "vite.config.ts" ]; then
    echo -e "${GREEN}✅ 已在 frontend 目录${NC}"
elif [ -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  切换到 frontend 目录...${NC}"
    cd frontend
else
    echo -e "${RED}❌ 错误：找不到 frontend 目录${NC}"
    echo -e "${YELLOW}💡 请先运行 frontend-deploy.sh${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}[Step 1/3] 检查目录结构...${NC}"
echo "────────────────────────────────────────────"

# 创建必要的目录
mkdir -p src/lib
mkdir -p src/components/ui
mkdir -p src/styles
mkdir -p src/imports

echo -e "${GREEN}✅ 目录结构检查完成${NC}"

echo ""
echo -e "${CYAN}[Step 2/3] 复制缺失的文件...${NC}"
echo "────────────────────────────────────────────"

# 检查并复制 lib/api.ts
if [ ! -f "src/lib/api.ts" ]; then
    if [ -f "../lib/api.ts" ]; then
        cp ../lib/api.ts src/lib/api.ts
        echo -e "${GREEN}✅ 已复制 lib/api.ts${NC}"
    else
        echo -e "${RED}❌ 源文件 ../lib/api.ts 不存在${NC}"
        echo -e "${YELLOW}💡 需要手动创建此文件${NC}"
    fi
else
    echo -e "${GREEN}✅ lib/api.ts 已存在${NC}"
fi

# 检查并复制 lib/utils.ts
if [ ! -f "src/lib/utils.ts" ]; then
    if [ -f "../lib/utils.ts" ]; then
        cp ../lib/utils.ts src/lib/utils.ts
        echo -e "${GREEN}✅ 已复制 lib/utils.ts${NC}"
    else
        echo -e "${YELLOW}⚠️  lib/utils.ts 不存在，创建默认版本...${NC}"
        cat > src/lib/utils.ts << 'EOF'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
EOF
        echo -e "${GREEN}✅ 已创建 lib/utils.ts${NC}"
    fi
else
    echo -e "${GREEN}✅ lib/utils.ts 已存在${NC}"
fi

# 检查 App.tsx
if [ ! -f "src/App.tsx" ]; then
    if [ -f "../App.tsx" ]; then
        cp ../App.tsx src/App.tsx
        echo -e "${GREEN}✅ 已复制 App.tsx${NC}"
    else
        echo -e "${RED}❌ 源文件 ../App.tsx 不存在${NC}"
    fi
else
    echo -e "${GREEN}✅ App.tsx 已存在${NC}"
fi

# 检查 styles/globals.css
if [ ! -f "src/styles/globals.css" ]; then
    if [ -f "../styles/globals.css" ]; then
        cp ../styles/globals.css src/styles/globals.css
        echo -e "${GREEN}✅ 已复制 styles/globals.css${NC}"
    else
        echo -e "${RED}❌ 源文件 ../styles/globals.css 不存在${NC}"
    fi
else
    echo -e "${GREEN}✅ styles/globals.css 已存在${NC}"
fi

# 复制 components
if [ -d "../components" ]; then
    echo -e "${YELLOW}⏳ 复制 components 目录...${NC}"
    cp -rf ../components/* src/components/ 2>/dev/null
    echo -e "${GREEN}✅ 已复制 components${NC}"
else
    echo -e "${YELLOW}⚠️  ../components 目录不存在${NC}"
fi

# 复制 imports
if [ -d "../imports" ]; then
    echo -e "${YELLOW}⏳ 复制 imports 目录...${NC}"
    cp -rf ../imports/* src/imports/ 2>/dev/null
    echo -e "${GREEN}✅ 已复制 imports${NC}"
else
    echo -e "${YELLOW}⚠️  ../imports 目录不存在（如果没有图片资源可以忽略）${NC}"
fi

# 复制环境变量文件
if [ -f "../.env" ]; then
    cp ../.env .env
    echo -e "${GREEN}✅ 已复制 .env 配置文件${NC}"
elif [ -f "../.env.example" ]; then
    cp ../.env.example .env
    echo -e "${GREEN}✅ 已从示例创建 .env 配置文件${NC}"
else
    echo -e "${YELLOW}⚠️  创建默认 .env 配置文件...${NC}"
    cat > .env << 'EOF'
# 环境变量配置
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=银行智能AI分析平台
VITE_APP_VERSION=1.0.0
VITE_DEBUG=true
EOF
    echo -e "${GREEN}✅ 已创建默认 .env 配置文件${NC}"
fi

echo ""
echo -e "${CYAN}[Step 3/3] 安装缺失的依赖...${NC}"
echo "────────────────────────────────────────────"

# 检查 package.json 中的依赖
if ! grep -q '"clsx"' package.json; then
    echo -e "${YELLOW}⏳ 安装 clsx...${NC}"
    npm install clsx
fi

if ! grep -q '"tailwind-merge"' package.json; then
    echo -e "${YELLOW}⏳ 安装 tailwind-merge...${NC}"
    npm install tailwind-merge
fi

echo ""
echo -e "${GREEN}✅ 修复完成！${NC}"
echo ""
echo -e "${CYAN}📋 文件结构：${NC}"
echo "frontend/"
echo "  └── src/"
echo "      ├── App.tsx"
echo "      ├── main.tsx"
echo "      ├── lib/"
echo "      │   ├── api.ts         ✅"
echo "      │   └── utils.ts       ✅"
echo "      ├── components/"
echo "      │   └── ui/"
echo "      ├── styles/"
echo "      │   └── globals.css"
echo "      └── imports/"
echo ""
echo -e "${CYAN}💡 现在可以启动前端：${NC}"
echo "   npm run dev"
echo ""

read -p "按 Enter 退出..."
