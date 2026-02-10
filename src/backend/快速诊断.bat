@echo off
chcp 65001 >nul
color 0E
cls

echo.
echo ╔══════════════════════════════════════════════════════════════════╗
echo ║            🔍 银行智能AI分析平台 - 快速诊断                   ║
echo ╚══════════════════════════════════════════════════════════════════╝
echo.

echo 🔍 正在检查系统状态...
echo.
echo ══════════════════════════════════════════════════════════════════
echo.

REM 检查1: Java
echo [1/5] 检查 Java...
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Java 未安装
    echo.
    echo 💡 解决方法:
    echo    1. 下载 JDK 17: https://adoptium.net/
    echo    2. 安装后重启命令行
    echo.
    goto :end
) else (
    echo ✅ Java 已安装
    java -version 2>&1 | findstr /C:"version"
)
echo.

REM 检查2: Maven
echo [2/5] 检查 Maven...
mvn -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Maven 未安装
    echo.
    echo 💡 解决方法:
    echo    1. 下载 Maven: https://maven.apache.org/download.cgi
    echo    2. 配置环境变量
    echo    3. 重启命令行
    echo.
    goto :end
) else (
    echo ✅ Maven 已安装
    mvn -version 2>&1 | findstr /C:"Apache Maven"
)
echo.

REM 检查3: 端口8080
echo [3/5] 检查端口 8080...
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  端口 8080 已被占用
    echo.
    netstat -ano | findstr ":8080"
    echo.
    echo 💡 解决方法:
    echo    运行 RUN.bat 会自动释放端口
    echo    或手动关闭占用进程
    echo.
) else (
    echo ✅ 端口 8080 可用
)
echo.

REM 检查4: pom.xml
echo [4/5] 检查项目文件...
if not exist "pom.xml" (
    color 0C
    echo ❌ 未找到 pom.xml
    echo.
    echo 💡 解决方法:
    echo    请在 backend 目录下运行此脚本
    echo.
    goto :end
) else (
    echo ✅ 找到 pom.xml
)
echo.

REM 检查5: 后端是否运行
echo [5/5] 检查后端服务...
curl -s http://localhost:8080/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  后端服务未运行
    echo.
    echo 💡 这就是前端显示 "Failed to fetch" 的原因！
    echo.
    color 0E
) else (
    color 0A
    echo ✅ 后端服务正在运行
    echo.
    curl -s http://localhost:8080/api/health
    echo.
)
echo.

echo ══════════════════════════════════════════════════════════════════
echo.

REM 给出建议
netstat -ano | findstr ":8080" | findstr "LISTENING" >nul 2>&1
if not errorlevel 1 (
    echo 📊 诊断结果: 后端服务正在运行
    echo.
    echo ✅ 如果前端仍显示错误:
    echo    1. 按 Ctrl+Shift+R 强制刷新前端页面
    echo    2. 检查浏览器控制台错误信息
    echo    3. 确认前端 URL 配置正确
) else (
    color 0E
    echo 📊 诊断结果: 后端服务未启动
    echo.
    echo ✅ 解决方法:
    echo.
    echo    【方法1】运行启动脚本
    echo       RUN.bat
    echo.
    echo    【方法2】完整启动
    echo       START-BACKEND.bat
    echo.
    echo    【方法3】自动修复
    echo       FIX-CONNECTION.bat
)
echo.

:end
echo ══════════════════════════════════════════════════════════════════
echo.
pause
