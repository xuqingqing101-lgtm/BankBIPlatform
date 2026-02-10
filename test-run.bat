@echo off
chcp 65001 >nul
cls

echo ====================================
echo 测试启动应用
echo ====================================
echo.

cd /d "%~dp0"

echo 提示：
echo   - 如果看到"银行智能AI分析平台已启动"，说明成功
echo   - 如果看到Exception或Error，记录下错误信息
echo   - 按Ctrl+C停止应用
echo.
echo ====================================
echo.

pause

call mvn spring-boot:run

pause
