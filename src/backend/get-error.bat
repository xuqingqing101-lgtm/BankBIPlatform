@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔍 获取详细错误信息
echo ========================================
echo.

echo 正在执行详细诊断，请等待...
echo.

call mvn clean compile -e -X > error-detail.log 2>&1

echo 完成！错误日志已保存到: error-detail.log
echo.
echo ========================================
echo 🔴 关键错误信息（最后50行）
echo ========================================
echo.

powershell -Command "Get-Content error-detail.log | Select-Object -Last 50"

echo.
echo ========================================
echo 📄 完整日志文件: error-detail.log
echo ========================================
echo.

pause
