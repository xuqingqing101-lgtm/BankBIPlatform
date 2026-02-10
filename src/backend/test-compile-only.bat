@echo off
chcp 65001 >nul
cls

echo ====================================
echo 测试编译（不启动应用）
echo ====================================
echo.

cd /d "%~dp0"

echo 正在编译...
echo.

call mvn clean compile -DskipTests

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ====================================
    echo ✅ 编译成功！
    echo ====================================
    echo.
    echo 代码没有问题，可以正常编译。
    echo 如果mvn spring-boot:run失败，是运行时问题。
    echo.
    echo 运行时常见问题：
    echo   1. 端口8080被占用
    echo   2. Redis连接失败（已禁用）
    echo   3. 数据库初始化失败
    echo.
    echo 下一步：运行 test-run.bat 测试启动
) else (
    echo.
    echo ====================================
    echo ❌ 编译失败！
    echo ====================================
    echo.
    echo 代码有语法错误或依赖问题。
    echo.
    echo 常见编译问题：
    echo   1. Lombok注解处理器问题
    echo   2. 依赖包缺失
    echo   3. JDK版本不对
    echo.
    echo 查看上面的错误信息。
)

echo.
pause
