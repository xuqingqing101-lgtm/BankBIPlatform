@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔍 前后端连接诊断工具
echo ========================================
echo.

echo [检查1] Java版本
echo ------------------------------------
java -version 2>&1 | findstr "version"
if errorlevel 1 (
    echo ❌ Java未安装或不在PATH中
    echo.
    goto :end
) else (
    echo ✅ Java已安装
)
echo.

echo [检查2] Maven版本
echo ------------------------------------
mvn -version 2>nul | findstr "Apache Maven"
if errorlevel 1 (
    echo ❌ Maven未安装或不在PATH中
    echo.
    goto :end
) else (
    echo ✅ Maven已安装
)
echo.

echo [检查3] 端口8080占用情况
echo ------------------------------------
netstat -ano | findstr ":8080" >nul 2>&1
if errorlevel 1 (
    echo ⚠️  端口8080未被占用 - 后端可能没有启动
    echo.
    echo 💡 解决方法：运行 REBUILD.bat 启动后端
    echo.
) else (
    echo ✅ 端口8080已被占用 - 可能是后端正在运行
    echo.
    netstat -ano | findstr ":8080"
    echo.
)

echo [检查4] 测试后端连接
echo ------------------------------------
echo 测试: http://localhost:8080/api/health
echo.

curl -s -o nul -w "HTTP状态码: %%{http_code}\n" http://localhost:8080/api/health 2>nul
if errorlevel 1 (
    echo ❌ 无法连接到后端
    echo.
    echo 💡 可能的原因：
    echo    1. 后端没有启动
    echo    2. 端口配置错误
    echo    3. 防火墙阻止
    echo.
    echo 💡 解决方法：
    echo    cd backend
    echo    REBUILD.bat
    echo.
) else (
    echo.
    echo 响应内容:
    curl -s http://localhost:8080/api/health 2>nul
    echo.
    echo.
    
    curl -s http://localhost:8080/api/health 2>nul | findstr "UP" >nul
    if errorlevel 1 (
        echo ⚠️  后端响应但格式可能不对
    ) else (
        echo ✅ 后端连接成功！
    )
    echo.
)

echo [检查5] Controller文件是否存在
echo ------------------------------------
if exist "src\main\java\com\bank\bi\controller\WelcomeController.java" (
    echo ✅ WelcomeController.java 存在
) else (
    echo ❌ WelcomeController.java 不存在
)

if exist "src\main\java\com\bank\bi\controller\AiController.java" (
    echo ✅ AiController.java 存在
) else (
    echo ❌ AiController.java 不存在
)

if exist "src\main\java\com\bank\bi\controller\PanelController.java" (
    echo ✅ PanelController.java 存在
) else (
    echo ❌ PanelController.java 不存在
)
echo.

echo [检查6] 编译后的class文件
echo ------------------------------------
if exist "target\classes\com\bank\bi\controller\WelcomeController.class" (
    echo ✅ WelcomeController.class 已编译
    dir /TC "target\classes\com\bank\bi\controller\WelcomeController.class" | findstr "WelcomeController"
) else (
    echo ❌ WelcomeController.class 未编译
    echo.
    echo 💡 需要重新编译：REBUILD.bat
)
echo.

echo ========================================
echo 📊 诊断总结
echo ========================================
echo.

curl -s http://localhost:8080/api/health 2>nul | findstr "UP" >nul
if errorlevel 1 (
    echo ❌ 后端连接失败
    echo.
    echo 🔧 解决步骤：
    echo.
    echo 1. 运行后端：
    echo    cd backend
    echo    REBUILD.bat
    echo.
    echo 2. 等待看到：
    echo    ========================================
    echo    🏦 银行智能AI分析平台已启动
    echo    ========================================
    echo.
    echo    Mapped "{{[/health],methods=[GET]}}" onto ...
    echo.
    echo 3. 重新运行此诊断脚本：
    echo    diagnose-connection.bat
    echo.
) else (
    echo ✅ 后端连接正常！
    echo.
    echo 🎉 前端应该可以正常连接了
    echo.
    echo 💡 如果前端还是显示"Failed to fetch"：
    echo    1. 刷新前端页面
    echo    2. 清除浏览器缓存（Ctrl+Shift+R）
    echo    3. 检查浏览器控制台的错误信息
    echo.
)

:end
pause
