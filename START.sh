#!/bin/bash

clear

echo "========================================"
echo "🚀 银行智能AI分析平台 - 快速启动"
echo "========================================"
echo ""

echo "[1/3] 检查环境"
echo "----------------------------------------"

if ! java -version 2>&1 | grep -q "version \"17"; then
    echo "❌ 未检测到JDK 17"
    echo ""
    echo "请先安装JDK 17: https://adoptium.net/temurin/releases/?version=17"
    echo ""
    exit 1
fi

echo "✅ JDK 17 已安装"
echo ""

echo "[2/3] 清理并编译"
echo "----------------------------------------"

mvn clean compile -DskipTests

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 编译失败！"
    echo ""
    echo "运行诊断工具查看详细错误："
    echo "    ./diagnose.sh"
    echo ""
    exit 1
fi

echo "✅ 编译成功"
echo ""

echo "[3/3] 启动应用"
echo "----------------------------------------"
echo ""
echo "正在启动应用..."
echo ""
echo "提示："
echo "  - API地址: http://localhost:8080/api"
echo "  - H2控制台: http://localhost:8080/api/h2-console"
echo "  - 所有API无需认证"
echo ""
echo "按Ctrl+C停止应用"
echo ""
echo "========================================"
echo ""

mvn spring-boot:run
