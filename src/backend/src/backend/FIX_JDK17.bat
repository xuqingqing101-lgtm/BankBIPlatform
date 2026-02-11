@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔧 JDK 17 配置 - 稳定版本修复
echo ========================================
echo.

echo JDK 25存在兼容性问题！
echo 已将项目配置改为JDK 17 (LTS长期支持版本)
echo.

echo ========================================
echo [1/4] 检查Java版本
echo ========================================
echo.

java -version 2>&1 | findstr "version"
echo.

java -version 2>&1 | findstr "17" >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ 检测到JDK 17
    echo.
    goto cleanup
) else (
    echo ❌ 未检测到JDK 17
    echo.
    echo 请先安装JDK 17:
    echo.
    echo 下载地址:
    echo   - OpenJDK 17: https://adoptium.net/temurin/releases/?version=17
    echo   - Oracle JDK 17: https://www.oracle.com/java/technologies/downloads/#java17
    echo.
    echo 安装后设置JAVA_HOME:
    echo   setx JAVA_HOME "C:\Program Files\Java\jdk-17"
    echo   setx PATH "%%JAVA_HOME%%\bin;%%PATH%%"
    echo.
    echo 然后重启终端并重新运行此脚本
    echo.
    pause
    exit /b 1
)

:cleanup
echo ========================================
echo [2/4] 完全清理
echo ========================================
echo.

if exist target (
    echo 删除target目录...
    rmdir /s /q target
)

echo 执行mvn clean...
call mvn clean
echo ✅ 清理完成
echo.

echo ========================================
echo [3/4] 清理依赖缓存
echo ========================================
echo.

echo 清理Lombok缓存...
call mvn dependency:purge-local-repository -DmanualInclude="org.projectlombok:lombok" -q

echo 清理Spring Boot缓存...
call mvn dependency:purge-local-repository -DmanualInclude="org.springframework.boot:spring-boot-starter-parent" -q

echo ✅ 缓存清理完成
echo.

echo ========================================
echo [4/4] 编译项目
echo ========================================
echo.

echo 开始编译...
echo.
call mvn clean compile

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ========================================
    echo ✅ 编译成功！
    echo ========================================
    echo.
    
    echo 配置信息：
    echo   - Java版本: 17 (LTS)
    echo   - Spring Boot: 3.2.2
    echo   - Lombok: 1.18.30
    echo   - Maven Compiler: 3.11.0
    echo.
    
    echo ========================================
    echo 🎉 可以启动应用了！
    echo ========================================
    echo.
    echo 运行：
    echo     mvn spring-boot:run
    echo.
    echo 或打包：
    echo     mvn package
    echo.
) else (
    echo.
    echo ========================================
    echo ❌ 编译失败
    echo ========================================
    echo.
    echo 请检查：
    echo 1. 确认使用JDK 17: java -version
    echo 2. 确认Maven版本: mvn -v
    echo 3. 查看详细错误: mvn clean compile -X
    echo.
)

pause
