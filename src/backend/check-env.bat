@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔍 环境检查 - JDK 25 项目
echo ========================================
echo.

echo [1] Java版本检查
echo ----------------------------------------
java -version 2>&1 | findstr "version"
java -version 2>&1 | findstr "25" >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ Java版本正确 ^(JDK 25^)
) else (
    echo ❌ 需要JDK 25，请查看 JDK25_SETUP.md
)
echo.

echo [2] Maven版本检查
echo ----------------------------------------
mvn -v 2>&1 | findstr "Apache Maven"
mvn -v 2>&1 | findstr "Java version: 25" >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ Maven使用JDK 25
) else (
    echo ❌ Maven未使用JDK 25，请检查JAVA_HOME
)
echo.

echo [3] JAVA_HOME检查
echo ----------------------------------------
if defined JAVA_HOME (
    echo JAVA_HOME = %JAVA_HOME%
    if exist "%JAVA_HOME%\bin\java.exe" (
        echo ✅ JAVA_HOME配置正确
    ) else (
        echo ❌ JAVA_HOME路径不正确
    )
) else (
    echo ❌ JAVA_HOME未设置
)
echo.

echo [4] 项目配置检查
echo ----------------------------------------
findstr "<java.version>25</java.version>" pom.xml >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ pom.xml配置为JDK 25
) else (
    echo ❌ pom.xml未配置JDK 25
)
echo.

echo [5] Lombok版本检查
echo ----------------------------------------
findstr "<lombok.version>1.18.36</lombok.version>" pom.xml >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ Lombok版本正确 ^(1.18.36^)
) else (
    echo ⚠️  Lombok版本可能不支持JDK 25
)
echo.

echo ========================================
echo 📋 检查总结
echo ========================================
echo.
echo 如果所有检查都通过，运行：
echo     mvn clean compile
echo.
echo 如果有❌标记，请先修复相应问题
echo 详细指南：JDK25_SETUP.md
echo.

pause
