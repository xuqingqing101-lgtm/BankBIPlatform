@echo off
chcp 65001 >nul
color 0A
cls

echo.
echo ╔══════════════════════════════════════════════╗
echo ║    🏦 银行智能AI分析平台 - 启动后端       ║
echo ╚══════════════════════════════════════════════╝
echo.

REM 检查是否在backend目录
if not exist "pom.xml" (
    color 0C
    echo ❌ 错误: 未找到 pom.xml
    echo.
    echo 💡 当前目录: %CD%
    echo.
    echo 💡 请确保在 backend 目录下运行此脚本
    echo.
    echo 正确的运行方式：
    echo    1. 在项目根目录双击: 后端快速启动.bat
    echo    2. 或命令行: cd backend ^&^& RUN.bat
    echo.
    pause
    exit /b 1
)

echo ✅ 目录检查通过
echo.

echo [1/4] 🔍 检查环境...
echo ────────────────────────────────────────────
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Java未安装
    echo.
    echo 请安装JDK 17: https://adoptium.net/
    pause
    exit /b 1
)
echo ✅ Java环境正常

mvn -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Maven未安装
    echo.
    echo 请安装Maven: https://maven.apache.org/download.cgi
    pause
    exit /b 1
)
echo ✅ Maven环境正常
echo.

echo [2/4] 🧹 清理端口...
echo ────────────────────────────────────────────
netstat -ano | findstr ":8080" >nul 2>&1
if not errorlevel 1 (
    echo 发现8080端口被占用，正在释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080" ^| findstr LISTENING') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 1 >nul
)
echo ✅ 端口8080已准备就绪
echo.

echo [3/4] 📦 检查依赖...
echo ────────────────────────────────────────────
if not exist "target" (
    echo ⏳ 首次启动，正在下载依赖...
    echo    （这可能需要几分钟，请耐心等待）
)
echo.

echo [4/4] 🚀 启动服务...
echo ────────────────────────────────────────────
echo.
echo ⏳ 正在编译和启动后端服务...
echo.
echo ✅ 当看到以下内容时表示启动成功:
echo    • "🏦 银行智能AI分析平台已启动"
echo    • "Mapped" 字样 (Controller注册信息)
echo.
echo ⚠️  启动后请保持此窗口打开!
echo.
echo ══════════════════════════════════════════════
echo.

REM 启动Spring Boot
call mvn spring-boot:run

REM 如果启动失败
if errorlevel 1 (
    color 0C
    echo.
    echo ══════════════════════════════════════════════
    echo ❌ 启动失败！
    echo ══════════════════════════════════════════════
    echo.
    echo 🔧 请尝试:
    echo    1. 运行: mvn clean compile
    echo    2. 检查8080端口是否被占用
    echo    3. 查看上面的错误信息
    echo    4. 或双击运行: 后端快速启动.bat
    echo.
    pause
)
