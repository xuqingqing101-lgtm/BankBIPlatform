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
echo "║    🏦 银行智能AI分析平台 - 后端启动       ║"
echo "╚══════════════════════════════════════════════╝"
echo -e "${NC}"

# 检查是否在后端目录
if [ ! -f "pom.xml" ]; then
    if [ -d "backend" ]; then
        echo -e "${YELLOW}[提示] 切换到 backend 目录...${NC}"
        cd backend
    else
        echo -e "${RED}❌ 错误：找不到 pom.xml 或 backend 目录${NC}"
        echo -e "${YELLOW}💡 请在项目根目录或 backend 目录下运行此脚本${NC}"
        exit 1
    fi
fi

echo -e "${CYAN}[Step 1/4] 检查 Java 环境...${NC}"
echo "────────────────────────────────────────────"

if ! command -v java &> /dev/null; then
    echo -e "${RED}❌ 未检测到 Java！${NC}"
    echo -e "${YELLOW}💡 请先安装 JDK 17 或更高版本${NC}"
    exit 1
fi

JAVA_VERSION=$(java -version 2>&1 | head -n 1 | cut -d'"' -f2 | cut -d'.' -f1)
echo -e "${GREEN}✅ Java 版本：$JAVA_VERSION${NC}"

if [ "$JAVA_VERSION" -lt 17 ]; then
    echo -e "${RED}⚠️  警告：需要 Java 17 或更高版本${NC}"
    echo -e "${YELLOW}   当前版本：$JAVA_VERSION${NC}"
fi

echo ""
echo -e "${CYAN}[Step 2/4] 检查 Maven 环境...${NC}"
echo "────────────────────────────────────────────"

if ! command -v mvn &> /dev/null; then
    if ! command -v mvnw &> /dev/null; then
        echo -e "${RED}❌ 未检测到 Maven 或 Maven Wrapper！${NC}"
        exit 1
    fi
    MVN_CMD="./mvnw"
    echo -e "${GREEN}✅ 使用 Maven Wrapper${NC}"
else
    MVN_CMD="mvn"
    echo -e "${GREEN}✅ Maven 版本：$(mvn -version | head -n 1)${NC}"
fi

echo ""
echo -e "${CYAN}[Step 3/4] 清理和编译项目...${NC}"
echo "────────────────────────────────────────────"
echo -e "${YELLOW}⏳ 正在清理和编译（首次可能需要几分钟）...${NC}"
echo ""

$MVN_CMD clean package -DskipTests

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}❌ 编译失败！${NC}"
    echo -e "${YELLOW}💡 请检查编译错误信息${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ 编译成功！${NC}"

echo ""
echo -e "${CYAN}[Step 4/4] 启动后端服务...${NC}"
echo "────────────────────────────────────────────"
echo ""
echo -e "${GREEN}📌 服务信息：${NC}"
echo -e "   ${CYAN}后端地址：${NC}http://localhost:8080"
echo -e "   ${CYAN}健康检查：${NC}http://localhost:8080/api/health"
echo ""
echo -e "${YELLOW}⚠️  保持此窗口打开！按 Ctrl+C 可停止服务${NC}"
echo ""
echo "══════════════════════════════════════════════"
echo ""

# 启动 Spring Boot
$MVN_CMD spring-boot:run

echo ""
echo "══════════════════════════════════════════════"
echo -e "${GREEN}✅ 服务已停止${NC}"
echo "══════════════════════════════════════════════"
