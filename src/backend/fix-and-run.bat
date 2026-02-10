@echo off
chcp 65001 >nul
echo ================================================
echo 🔧 银行智能AI分析平台 - 修复并启动
echo ================================================
echo.

REM 检查是否在正确的目录
if not exist "pom.xml" (
    color 0C
    echo.
    echo ❌ 错误: 未找到 pom.xml 文件！
    echo.
    echo 💡 请确保在 backend 目录下运行此脚本
    echo.
    echo 当前目录: %CD%
    echo.
    echo 正确的运行方式：
    echo    1. 在项目根目录双击: 后端快速启动.bat
    echo    2. 或命令行: cd backend ^&^& fix-and-run.bat
    echo.
    pause
    exit /b 1
)

echo ✅ 目录检查通过
echo 当前目录: %CD%
echo.

echo [1/4] 清理旧文件...
if exist target rmdir /s /q target
echo ✅ 清理完成
echo.

echo [2/4] 编译项目...
call mvn clean compile -Dmaven.compiler.encoding=UTF-8
if %errorlevel% neq 0 (
    echo.
    echo ❌ 编译失败！
    echo.
    echo 请检查错误信息并尝试：
    echo 1. 确认 JDK 17 已安装: java -version
    echo 2. 确认 Maven 已安装: mvn -version
    echo 3. 查看完整错误日志
    echo.
    pause
    exit /b 1
)
echo ✅ 编译成功
echo.

echo [3/4] 检查端口 8080...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') do (
    echo 发现端口 8080 被占用，正在释放...
    taskkill /PID %%a /F >nul 2>&1
    timeout /t 2 /nobreak >nul
)
echo ✅ 端口检查完成
echo.

echo [4/4] 启动应用...
echo.
echo ================================================
echo 🚀 正在启动后端服务...
echo ================================================
echo.
echo 提示：
echo - 看到 "银行智能AI分析平台已启动" 表示成功
echo - 保持此窗口打开
echo - 按 Ctrl+C 停止服务
echo.
echo ================================================
echo.

call mvn spring-boot:run

pause
