#!/bin/bash

clear

echo "========================================"
echo "🔧 Lombok编译问题修复工具"
echo "========================================"
echo ""

echo "[1/4] 清理项目..."
mvn clean
if [ $? -ne 0 ]; then
    echo "❌ 清理失败！"
    exit 1
fi
echo "✅ 清理完成"
echo ""

echo "[2/4] 解析依赖..."
mvn dependency:resolve
if [ $? -ne 0 ]; then
    echo "❌ 依赖解析失败！"
    exit 1
fi
echo "✅ 依赖解析完成"
echo ""

echo "[3/4] 编译项目..."
mvn compile
if [ $? -ne 0 ]; then
    echo "❌ 编译失败！请检查错误信息"
    exit 1
fi
echo "✅ 编译成功"
echo ""

echo "[4/4] 验证Lombok..."
echo "检查User类的getter方法..."
if javap -p target/classes/com/bank/bi/model/entity/User.class | grep -q "getUserId"; then
    echo "✅ Lombok工作正常！"
else
    echo "⚠️  警告: 未检测到Lombok生成的方法"
fi
echo ""

echo "========================================"
echo "✅ 修复完成！"
echo "========================================"
echo ""
echo "下一步: 运行 mvn spring-boot:run 启动应用"
echo ""
