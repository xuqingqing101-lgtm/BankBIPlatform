@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔧 强制重新编译并启动
echo ========================================
echo.
echo 正在清理旧的编译文件...
call mvn clean
echo.

echo 正在重新编译项目...
call mvn compile
echo.

if errorlevel 1 (
    echo ❌ 编译失败！
    echo.
    echo 请检查错误信息
    pause
    exit /b 1
)

echo ✅ 编译成功！
echo.
echo 正在启动应用...
echo.

call mvn spring-boot:run

pause
