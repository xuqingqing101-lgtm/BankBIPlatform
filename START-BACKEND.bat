@echo off
chcp 65001 >nul
cls

echo.
echo ========================================
echo   🚀 启动银行智能AI分析平台后端
echo ========================================
echo.
echo 📍 当前目录: %CD%
echo.

REM 检查是否在backend目录
if not exist "pom.xml" (
    echo ❌ 错误: 未找到 pom.xml
    echo.
    echo 💡 请确保在 backend 目录下运行此脚本
    echo.
    echo 正确的位置应该是:
    echo    项目根目录/backend/
    echo.
    pause
    exit /b 1
)

echo [步骤 1/4] 检查Java环境
echo ------------------------------------
java -version 2>&1 | findstr "version" >nul
if errorlevel 1 (
    echo ❌ Java未安装或未配置到PATH
    echo.
    echo 请安装JDK 17并配置环境变量
    pause
    exit /b 1
)
echo ✅ Java环境正常
java -version 2>&1 | findstr "version"
echo.

echo [步骤 2/4] 检查端口8080
echo ------------------------------------
netstat -ano | findstr ":8080" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  端口8080已被占用，尝试关闭...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✅ 已尝试释放端口
) else (
    echo ✅ 端口8080可用
)
echo.

echo [步骤 3/4] 清理并编译
echo ------------------------------------
echo 正在清理旧文件...
if exist "target" rmdir /s /q target
echo.

echo 正在编译项目...
call mvn clean compile -DskipTests
if errorlevel 1 (
    echo.
    echo ❌ 编译失败！
    echo.
    echo 💡 可能的原因:
    echo    1. Maven未安装
    echo    2. pom.xml配置错误
    echo    3. 代码有语法错误
    echo.
    pause
    exit /b 1
)
echo.
echo ✅ 编译成功
echo.

echo [步骤 4/4] 启动应用
echo ------------------------------------
echo.
echo 🚀 正在启动后端服务...
echo.
echo ⚠️  重要提示:
echo    - 请等待看到 "银行智能AI分析平台已启动" 提示
echo    - 请查找 "Mapped" 字样 (Controller注册信息)
echo    - 启动后请保持此窗口打开
echo.
echo 启动完成后:
echo    ✅ 打开新的命令行窗口
echo    ✅ 运行: curl http://localhost:8080/api/health
echo    ✅ 应该返回: {"status":"UP","message":"..."}
echo.
echo ========================================
echo   按任意键开始启动...
echo ========================================
pause >nul
echo.

call mvn spring-boot:run
