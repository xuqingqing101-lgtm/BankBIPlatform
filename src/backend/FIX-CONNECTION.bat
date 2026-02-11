@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔧 一键修复前后端连接问题
echo ========================================
echo.
echo 此脚本将：
echo   1. 停止当前服务
echo   2. 清理所有编译文件
echo   3. 重新编译项目
echo   4. 启动后端服务
echo   5. 测试连接
echo.
echo ⚠️  请确保已关闭其他使用8080端口的程序
echo.

pause
echo.

echo [步骤1] 检查并关闭占用8080端口的进程
echo ------------------------------------
netstat -ano | findstr ":8080" >nul 2>&1
if not errorlevel 1 (
    echo 发现8080端口被占用，尝试关闭...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8080"') do (
        echo 结束进程 PID: %%a
        taskkill /PID %%a /F >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✅ 已尝试关闭
) else (
    echo ✅ 端口8080未被占用
)
echo.

echo [步骤2] 清理编译文件
echo ------------------------------------
if exist "target" (
    echo 删除target目录...
    rmdir /s /q target
    echo ✅ target目录已删除
) else (
    echo ✅ target目录不存在
)
echo.

echo [步骤3] Maven清理
echo ------------------------------------
echo 执行 mvn clean...
call mvn clean
if errorlevel 1 (
    echo ❌ mvn clean 失败
    pause
    exit /b 1
)
echo ✅ Maven清理完成
echo.

echo [步骤4] 重新编译
echo ------------------------------------
echo 执行 mvn compile...
call mvn compile
if errorlevel 1 (
    echo ❌ 编译失败！请检查错误信息
    pause
    exit /b 1
)
echo ✅ 编译成功
echo.

echo [步骤5] 启动后端服务
echo ------------------------------------
echo.
echo 🚀 正在启动后端服务...
echo.
echo ⚠️  重要提示：
echo    - 请等待看到 "银行智能AI分析平台已启动" 提示
echo    - 请确认日志中有 "Mapped" 字样（Controller映射）
echo    - 启动后请不要关闭此窗口
echo.
echo 启动完成后：
echo    1. 打开新的命令行窗口
echo    2. 运行: cd backend ^&^& test-all-apis.bat
echo    3. 或访问: http://localhost:8080/api/health
echo.

call mvn spring-boot:run
