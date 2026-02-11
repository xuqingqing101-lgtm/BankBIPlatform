@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔧 自动修复编译问题
echo ========================================
echo.

echo [步骤 1/4] 检查Java版本...
java -version 2>&1 | findstr "version"
echo.
echo 要求: JDK 25 或更高版本
echo 如果版本不符，请查看 JDK25_SETUP.md
echo.

echo [步骤 2/4] 清理项目和缓存...
echo 正在清理...
call mvn clean
echo 正在清理Lombok缓存...
call mvn dependency:purge-local-repository -DmanualInclude="org.projectlombok:lombok" -q
echo ✅ 清理完成
echo.

echo [步骤 3/4] 下载最新依赖并编译...
echo 这可能需要几分钟，请耐心等待...
echo.
call mvn clean compile

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ========================================
    echo ✅ 编译成功！
    echo ========================================
    echo.
    echo 下一步：运行应用
    echo     mvn spring-boot:run
    echo.
    echo 或者测试API：
    echo     curl -X POST http://localhost:8080/api/auth/login \
    echo       -H "Content-Type: application/json" \
    echo       -d "{\"username\":\"admin\",\"password\":\"admin123\"}"
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ 编译失败
    echo ========================================
    echo.
    echo 请尝试以下方案：
    echo.
    echo 方案1：检查JDK版本
    echo     java -version
    echo     应该是 JDK 17 或 11
    echo.
    echo 方案2：查看详细日志
    echo     mvn clean compile -X ^> compile-log.txt 2^>^&1
    echo.
    echo 方案3：查看修复文档
    echo     type LOMBOK_FIX_V2.md
    echo.
)

pause
