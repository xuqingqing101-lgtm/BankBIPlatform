@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo   🧪 测试后端连接
echo ========================================
echo.

echo 目标地址: http://localhost:8080/api
echo.

echo [测试 1/3] 欢迎页面
echo ------------------------------------
curl -s http://localhost:8080/api/ 2>nul
if errorlevel 1 (
    echo.
    echo ❌ 无法连接到后端
    echo.
    echo 💡 请确保:
    echo    1. 后端已启动 (运行 START-BACKEND.bat)
    echo    2. 端口8080未被其他程序占用
    echo    3. 启动日志中有 "Mapped" 字样
    echo.
    goto :failed
)
echo.
echo ✅ 欢迎页面连接成功
echo.
echo.

echo [测试 2/3] 健康检查
echo ------------------------------------
curl -s http://localhost:8080/api/health 2>nul
if errorlevel 1 (
    echo.
    echo ❌ 健康检查失败
    goto :failed
)
echo.

curl -s http://localhost:8080/api/health 2>nul | findstr "UP" >nul
if errorlevel 1 (
    echo.
    echo ⚠️  健康检查端点响应，但状态不是UP
    echo.
    goto :failed
)
echo.
echo ✅ 健康检查成功
echo.
echo.

echo [测试 3/3] AI对话端点
echo ------------------------------------
curl -s -X POST http://localhost:8080/api/ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"测试\",\"module\":\"deposit\"}" 2>nul
if errorlevel 1 (
    echo.
    echo ❌ AI对话端点失败
    goto :failed
)
echo.
echo.
echo ✅ AI对话端点响应成功
echo.
echo.

echo ========================================
echo   ✅ 所有测试通过！
echo ========================================
echo.
echo 后端运行正常，可以使用前端了！
echo.
echo 📋 下一步:
echo    1. 打开前端页面 (http://localhost:5173)
echo    2. 按 Ctrl+Shift+R 强制刷新
echo    3. 查看右下角应该显示 "✅ 后端连接正常"
echo.
goto :end

:failed
echo ========================================
echo   ❌ 连接测试失败
echo ========================================
echo.
echo 🔧 故障排查:
echo.
echo 1. 检查后端是否启动:
echo    netstat -ano ^| findstr :8080
echo.
echo 2. 查看后端启动日志:
echo    必须看到 "Mapped" 字样
echo.
echo 3. 重新启动后端:
echo    START-BACKEND.bat
echo.
echo 4. 完全清理重启:
echo    FIX-CONNECTION.bat
echo.

:end
pause
