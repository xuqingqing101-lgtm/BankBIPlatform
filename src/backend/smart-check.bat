@echo off
chcp 65001 >nul
cls

echo ====================================
echo 🔍 智能错误检测
echo ====================================
echo.

cd /d "%~dp0"

echo 步骤1: 尝试仅编译（不运行）
echo ------------------------------------
call mvn compile -DskipTests -q
if %ERRORLEVEL% EQU 0 (
    echo ✅ 编译成功！问题在运行时。
    echo.
    echo 继续检测运行时问题...
    echo.
    goto :runtime_check
) else (
    echo ❌ 编译失败！问题在编译时。
    echo.
    echo 生成详细编译日志...
    mvn compile -DskipTests -X > compile-error.txt 2>&1
    echo.
    echo ========== 编译错误 ==========
    findstr /C:"ERROR" compile-error.txt | findstr /V "For more" | findstr /V "To see"
    echo ============================
    echo.
    echo 完整日志: compile-error.txt
    pause
    exit /b 1
)

:runtime_check
echo 步骤2: 检测运行时问题
echo ------------------------------------
echo.
echo 启动应用并捕获错误...
echo.

REM 启动应用并捕获输出
call mvn spring-boot:run > runtime-error.txt 2>&1

echo.
echo ========== 运行时错误 ==========
type runtime-error.txt | findstr /C:"Exception" /C:"Error" /C:"Failed" /C:"Caused by"
echo ===============================
echo.
echo 完整日志: runtime-error.txt
echo.
echo 常见运行时问题:
echo   1. 端口被占用 (Port already in use)
echo   2. Redis连接失败 (RedisConnectionException)
echo   3. 数据库连接失败 (Could not connect)
echo   4. Bean创建失败 (BeanCreationException)
echo.
pause
