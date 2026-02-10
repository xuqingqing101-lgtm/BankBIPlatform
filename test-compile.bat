@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🧪 测试编译
echo ========================================
echo.

echo [步骤1] 检查Java版本
echo ----------------------------------------
java -version
echo.

echo [步骤2] 清理项目
echo ----------------------------------------
call mvn clean
echo.

echo [步骤3] 仅编译（不启动）
echo ----------------------------------------
echo 编译中，请稍候...
echo.

call mvn compile -e 2>&1 | tee compile-output.log

findstr /C:"BUILD SUCCESS" compile-output.log >nul
if %ERRORLEVEL% EQ 0 (
    echo.
    echo ========================================
    echo ✅ 编译成功！
    echo ========================================
    echo.
    echo 现在尝试打包...
    echo.
    call mvn package -DskipTests
    
    if %ERRORLEVEL% EQ 0 (
        echo.
        echo ========================================
        echo ✅ 打包成功！
        echo ========================================
        echo.
        echo JAR文件位置: target\bi-platform-1.0.0.jar
        echo.
        echo 尝试直接运行JAR:
        echo     java -jar target\bi-platform-1.0.0.jar
        echo.
        echo 或者使用Maven运行:
        echo     mvn spring-boot:run
        echo.
    ) else (
        echo.
        echo ========================================
        echo ❌ 打包失败
        echo ========================================
        echo.
        echo 但是编译成功了，问题可能在测试或打包阶段
        echo.
    )
) else (
    echo.
    echo ========================================
    echo ❌ 编译失败
    echo ========================================
    echo.
    echo 正在提取错误信息...
    echo.
    
    findstr /C:"[ERROR]" compile-output.log | findstr /V /C:"For more" | findstr /V /C:"To see" | findstr /V /C:"[Help"
    
    echo.
    echo 查看完整日志: compile-output.log
    echo.
)

pause
