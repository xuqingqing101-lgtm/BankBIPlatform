@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔍 诊断Controller注册问题
echo ========================================
echo.

echo [步骤1] 检查Controller文件是否存在
echo ------------------------------------
if exist "src\main\java\com\bank\bi\controller\WelcomeController.java" (
    echo ✅ WelcomeController.java 存在
) else (
    echo ❌ WelcomeController.java 不存在
)

if exist "src\main\java\com\bank\bi\controller\AuthController.java" (
    echo ✅ AuthController.java 存在
) else (
    echo ❌ AuthController.java 不存在
)

if exist "src\main\java\com\bank\bi\controller\AiController.java" (
    echo ✅ AiController.java 存在
) else (
    echo ❌ AiController.java 不存在
)
echo.

echo [步骤2] 检查编译后的class文件
echo ------------------------------------
if exist "target\classes\com\bank\bi\controller\WelcomeController.class" (
    echo ✅ WelcomeController.class 已编译
) else (
    echo ❌ WelcomeController.class 未编译 - 需要重新编译！
)

if exist "target\classes\com\bank\bi\controller\AuthController.class" (
    echo ✅ AuthController.class 已编译
) else (
    echo ❌ AuthController.class 未编译 - 需要重新编译！
)
echo.

echo [步骤3] 检查主应用类
echo ------------------------------------
if exist "target\classes\com\bank\bi\BankBiApplication.class" (
    echo ✅ BankBiApplication.class 已编译
) else (
    echo ❌ BankBiApplication.class 未编译
)
echo.

echo ========================================
echo 🔧 解决方案
echo ========================================
echo.

if not exist "target\classes\com\bank\bi\controller\WelcomeController.class" (
    echo ⚠️  检测到class文件缺失！
    echo.
    echo 需要重新编译项目：
    echo   1. 运行 REBUILD.bat
    echo   2. 或手动执行: mvn clean compile
    echo.
) else (
    echo ℹ️  class文件存在，但可能未被注册。
    echo.
    echo 可能的原因：
    echo   1. 包扫描路径问题
    echo   2. 注解配置问题
    echo   3. 需要完全清理重新编译
    echo.
    echo 建议：运行 REBUILD.bat 完全重新编译
    echo.
)

pause
