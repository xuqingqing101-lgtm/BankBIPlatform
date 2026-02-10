@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🧪 快速API测试
echo ========================================
echo.

echo [测试1] 欢迎页面 (/)
echo ------------------------------------
curl -s http://localhost:8080/api/
echo.
echo.

echo [测试2] 健康检查 (/health)
echo ------------------------------------
curl -s http://localhost:8080/api/health
echo.
echo.

echo [测试3] Auth健康检查 (/auth/health)
echo ------------------------------------
curl -s http://localhost:8080/api/auth/health
echo.
echo.

echo ========================================
echo ✅ 测试完成！
echo ========================================
echo.
echo 如果看到JSON数据，说明API工作正常！
echo 如果看到404，请重启后端：
echo   1. Ctrl+C 停止当前服务
echo   2. 重新运行 RUN.bat
echo.
pause
