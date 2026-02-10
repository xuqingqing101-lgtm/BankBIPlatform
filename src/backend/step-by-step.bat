@echo off
chcp 65001 >nul
cls

echo ====================================
echo 逐步诊断工具
echo ====================================
echo.

cd /d "%~dp0"

echo [1/6] 检查Java版本
echo ------------------------------------
java -version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Java未安装或未配置
    pause
    exit /b 1
)
echo ✅ Java检查通过
echo.

echo [2/6] 检查Maven版本
echo ------------------------------------
mvn -v
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Maven未安装或未配置
    pause
    exit /b 1
)
echo ✅ Maven检查通过
echo.

echo [3/6] 清理项目
echo ------------------------------------
call mvn clean
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 清理失败
    pause
    exit /b 1
)
echo ✅ 清理成功
echo.

echo [4/6] 下载依赖
echo ------------------------------------
call mvn dependency:resolve
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖下载失败
    echo.
    echo 可能的原因：
    echo   1. 网络问题
    echo   2. Maven仓库无法访问
    echo.
    echo 建议：配置国内镜像
    pause
    exit /b 1
)
echo ✅ 依赖下载成功
echo.

echo [5/6] 编译项目（不运行）
echo ------------------------------------
call mvn compile -DskipTests
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 编译失败
    echo.
    echo 生成详细日志...
    mvn compile -DskipTests -X > compile-error.txt 2>&1
    echo.
    echo 详细日志已保存到: compile-error.txt
    echo.
    echo 显示最后50行错误：
    powershell -Command "Get-Content compile-error.txt -Tail 50"
    pause
    exit /b 1
)
echo ✅ 编译成功
echo.

echo [6/6] 启动应用
echo ------------------------------------
echo.
echo 如果这一步失败，说明是运行时错误
echo 请注意启动时的错误信息...
echo.
pause
echo.

call mvn spring-boot:run

pause
