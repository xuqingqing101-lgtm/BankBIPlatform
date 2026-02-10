@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🧪 测试API接口
echo ========================================
echo.

echo [1/5] 测试欢迎页面
echo ------------------------------------
curl -s http://localhost:8080/api/
echo.
echo.

echo [2/5] 测试健康检查
echo ------------------------------------
curl -s http://localhost:8080/api/health
echo.
echo.

echo [3/5] 测试AI聊天
echo ------------------------------------
curl -s -X POST http://localhost:8080/api/ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"本月存款情况\",\"module\":\"deposit\"}"
echo.
echo.

echo [4/5] 获取对话列表
echo ------------------------------------
curl -s http://localhost:8080/api/ai/conversations
echo.
echo.

echo [5/5] 获取Pin列表
echo ------------------------------------
curl -s http://localhost:8080/api/panel/items
echo.
echo.

echo ========================================
echo ✅ 测试完成！
echo ========================================
echo.
echo 如果看到JSON数据，说明API工作正常！
echo.
echo 下一步：
echo   1. 浏览器访问: http://localhost:8080/api/
echo   2. 查看H2数据库: http://localhost:8080/api/h2-console
echo   3. 启动前端: cd ..\frontend 然后 npm run dev
echo.
pause
