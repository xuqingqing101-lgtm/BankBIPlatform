#!/bin/bash

clear

echo "========================================"
echo "🔍 错误诊断工具"
echo "========================================"
echo ""

echo "[1/5] 检查Java版本"
echo "----------------------------------------"
java -version
echo ""

echo "[2/5] 检查Maven版本"
echo "----------------------------------------"
mvn -v
echo ""

echo "[3/5] 清理项目"
echo "----------------------------------------"
mvn clean
echo ""

echo "[4/5] 执行详细编译（查看具体错误）"
echo "----------------------------------------"
echo "正在编译，请等待..."
echo ""
mvn clean compile -X > compile-debug.log 2>&1

echo ""
echo "========================================"
echo "📋 编译结果"
echo "========================================"
echo ""

if grep -q "BUILD SUCCESS" compile-debug.log; then
    echo "✅ 编译成功！"
    echo ""
    echo "尝试启动应用..."
    mvn spring-boot:run
else
    echo "❌ 编译失败"
    echo ""
    echo "正在提取关键错误信息..."
    echo ""
    echo "========================================"
    echo "🚨 错误详情"
    echo "========================================"
    echo ""
    
    grep "ERROR" compile-debug.log | grep -v "For more" | grep -v "To see" | tail -20
    
    echo ""
    echo "========================================"
    echo "💡 可能的原因"
    echo "========================================"
    echo ""
    
    if grep -q "cannot find symbol" compile-debug.log; then
        echo "🔴 发现 \"cannot find symbol\" 错误"
        echo "   - 可能是依赖包缺失"
        echo "   - 可能是Lombok注解处理器问题"
        echo ""
    fi
    
    if grep -q "package.*does not exist" compile-debug.log; then
        echo "🔴 发现包不存在错误"
        echo "   - 可能需要更新依赖"
        echo ""
    fi
    
    if grep -q "Lombok" compile-debug.log; then
        echo "🔴 发现Lombok相关错误"
        echo "   - Lombok版本问题"
        echo ""
    fi
    
    echo ""
    echo "========================================"
    echo "📄 完整日志已保存"
    echo "========================================"
    echo ""
    echo "文件: compile-debug.log"
    echo ""
    echo "请查看日志文件获取完整错误信息"
fi

echo ""
