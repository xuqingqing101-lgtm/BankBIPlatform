#!/bin/bash

clear

echo "========================================"
echo "🔍 环境检查 - JDK 25 项目"
echo "========================================"
echo ""

echo "[1] Java版本检查"
echo "----------------------------------------"
java -version 2>&1 | head -1
if java -version 2>&1 | grep -q "version \"25"; then
    echo "✅ Java版本正确 (JDK 25)"
else
    echo "❌ 需要JDK 25，请查看 JDK25_SETUP.md"
fi
echo ""

echo "[2] Maven版本检查"
echo "----------------------------------------"
mvn -v 2>&1 | head -1
if mvn -v 2>&1 | grep -q "Java version: 25"; then
    echo "✅ Maven使用JDK 25"
else
    echo "❌ Maven未使用JDK 25，请检查JAVA_HOME"
fi
echo ""

echo "[3] JAVA_HOME检查"
echo "----------------------------------------"
if [ -n "$JAVA_HOME" ]; then
    echo "JAVA_HOME = $JAVA_HOME"
    if [ -f "$JAVA_HOME/bin/java" ]; then
        echo "✅ JAVA_HOME配置正确"
    else
        echo "❌ JAVA_HOME路径不正确"
    fi
else
    echo "❌ JAVA_HOME未设置"
fi
echo ""

echo "[4] 项目配置检查"
echo "----------------------------------------"
if grep -q "<java.version>25</java.version>" pom.xml; then
    echo "✅ pom.xml配置为JDK 25"
else
    echo "❌ pom.xml未配置JDK 25"
fi
echo ""

echo "[5] Lombok版本检查"
echo "----------------------------------------"
if grep -q "<lombok.version>1.18.36</lombok.version>" pom.xml; then
    echo "✅ Lombok版本正确 (1.18.36)"
else
    echo "⚠️  Lombok版本可能不支持JDK 25"
fi
echo ""

echo "========================================"
echo "📋 检查总结"
echo "========================================"
echo ""
echo "如果所有检查都通过，运行："
echo "    mvn clean compile"
echo ""
echo "如果有❌标记，请先修复相应问题"
echo "详细指南：../JDK25_SETUP.md"
echo ""
