@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🧪 完整API测试
echo ========================================
echo.

set BASE_URL=http://localhost:8080/api
set PASS=0
set FAIL=0

echo [1/8] 测试欢迎页 GET /
echo ------------------------------------
curl -s -w "%%{http_code}" -o temp.json %BASE_URL%/
set /p STATUS=<temp.json
if "%STATUS:~-3%"=="200" (
    echo ✅ 通过 - 欢迎页
    set /a PASS+=1
) else (
    echo ❌ 失败 - 欢迎页 [%STATUS:~-3%]
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [2/8] 测试健康检查 GET /health
echo ------------------------------------
curl -s -w "%%{http_code}" -o temp.json %BASE_URL%/health
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - 健康检查
    set /a PASS+=1
) else (
    echo ❌ 失败 - 健康检查
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [3/8] 测试认证健康 GET /auth/health
echo ------------------------------------
curl -s -w "%%{http_code}" -o temp.json %BASE_URL%/auth/health
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - 认证健康
    set /a PASS+=1
) else (
    echo ❌ 失败 - 认证健康
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [4/8] 测试AI对话 POST /ai/chat
echo ------------------------------------
curl -s -X POST %BASE_URL%/ai/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"测试问题\",\"module\":\"deposit\"}" ^
  -w "%%{http_code}" -o temp.json
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - AI对话
    set /a PASS+=1
) else (
    echo ❌ 失败 - AI对话
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [5/8] 测试获取对话列表 GET /ai/conversations
echo ------------------------------------
curl -s %BASE_URL%/ai/conversations ^
  -H "Content-Type: application/json" ^
  -w "%%{http_code}" -o temp.json
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - 对话列表
    set /a PASS+=1
) else (
    echo ❌ 失败 - 对话列表
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [6/8] 测试获取Pin列表 GET /panel/items
echo ------------------------------------
curl -s %BASE_URL%/panel/items ^
  -H "Content-Type: application/json" ^
  -w "%%{http_code}" -o temp.json
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - Pin列表
    set /a PASS+=1
) else (
    echo ❌ 失败 - Pin列表
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [7/8] 测试创建Pin POST /panel/item
echo ------------------------------------
curl -s -X POST %BASE_URL%/panel/item ^
  -H "Content-Type: application/json" ^
  -d "{\"category\":\"deposit\",\"title\":\"测试Pin\",\"content\":\"测试内容\",\"queryText\":\"测试\",\"positionX\":100,\"positionY\":100,\"width\":400,\"height\":300}" ^
  -w "%%{http_code}" -o temp.json
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - 创建Pin
    set /a PASS+=1
) else (
    echo ❌ 失败 - 创建Pin
    set /a FAIL+=1
)
type temp.json
echo.
echo.

echo [8/8] 测试H2控制台
echo ------------------------------------
curl -s -I %BASE_URL%/h2-console 2>nul | findstr /C:"200" >nul
if "%ERRORLEVEL%"=="0" (
    echo ✅ 通过 - H2控制台
    set /a PASS+=1
) else (
    echo ⚠️  跳过 - H2控制台 (需要浏览器访问)
)
echo.
echo.

del temp.json 2>nul

echo ========================================
echo 📊 测试结果
echo ========================================
echo.
echo 通过: %PASS%
echo 失败: %FAIL%
echo.

if %FAIL% GTR 0 (
    echo ❌ 有测试失败！请检查：
    echo   1. 后端是否已启动
    echo   2. Controller是否已注册 ^(查看启动日志^)
    echo   3. 是否运行了 REBUILD.bat
    echo.
) else (
    echo ✅ 所有测试通过！
    echo.
    echo 前后端连接正常，可以使用前端了！
    echo.
)

pause
