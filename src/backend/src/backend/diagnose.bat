@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔍 错误诊断工具
echo ========================================
echo.

echo [1/5] 检查Java版本
echo ----------------------------------------
java -version
echo.

echo [2/5] 检查Maven版本
echo ----------------------------------------
mvn -v
echo.

echo [3/5] 清理项目
echo ----------------------------------------
call mvn clean
echo.

echo [4/5] 执行详细编译（查看具体错误）
echo ----------------------------------------
echo 正在编译，请等待...
echo.
call mvn clean compile -X > compile-debug.log 2>&1

echo.
echo ========================================
echo 📋 编译结果
echo ========================================
echo.

findstr /C:"BUILD SUCCESS" compile-debug.log >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ 编译成功！
    echo.
    echo 尝试启动应用...
    call mvn spring-boot:run
) else (
    echo ❌ 编译失败
    echo.
    echo 正在提取关键错误信息...
    echo.
    echo ========================================
    echo 🚨 错误详情
    echo ========================================
    echo.
    
    findstr /C:"ERROR" compile-debug.log | findstr /V /C:"[ERROR] For more" | findstr /V /C:"[ERROR] To see"
    
    echo.
    echo ========================================
    echo 💡 可能的原因
    echo ========================================
    echo.
    
    findstr /C:"cannot find symbol" compile-debug.log >nul
    if %ERRORLEVEL% EQ 0 (
        echo 🔴 发现 "cannot find symbol" 错误
        echo    - 可能是依赖包缺失
        echo    - 可能是Lombok注解处理器问题
        echo.
    )
    
    findstr /C:"package" compile-debug.log | findstr /C:"does not exist" >nul
    if %ERRORLEVEL% EQ 0 (
        echo 🔴 发现包不存在错误
        echo    - 可能需要更新依赖
        echo.
    )
    
    findstr /C:"Lombok" compile-debug.log >nul
    if %ERRORLEVEL% EQ 0 (
        echo 🔴 发现Lombok相关错误
        echo    - Lombok版本问题
        echo.
    )
    
    echo.
    echo ========================================
    echo 📄 完整日志已保存
    echo ========================================
    echo.
    echo 文件: compile-debug.log
    echo.
    echo 请查看日志文件获取完整错误信息
)

echo.
pause
