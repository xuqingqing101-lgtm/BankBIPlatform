@echo off
chcp 65001 >nul
cls

echo ========================================
echo 🔧 Lombok编译问题修复工具
echo ========================================
echo.

echo [1/4] 清理项目...
call mvn clean
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 清理失败！
    pause
    exit /b 1
)
echo ✅ 清理完成
echo.

echo [2/4] 解析依赖...
call mvn dependency:resolve
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖解析失败！
    pause
    exit /b 1
)
echo ✅ 依赖解析完成
echo.

echo [3/4] 编译项目...
call mvn compile
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 编译失败！请检查错误信息
    pause
    exit /b 1
)
echo ✅ 编译成功
echo.

echo [4/4] 验证Lombok...
echo 检查User类的getter方法...
javap -p target\classes\com\bank\bi\model\entity\User.class | findstr "getUserId" >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ Lombok工作正常！
) else (
    echo ⚠️  警告: 未检测到Lombok生成的方法
)
echo.

echo ========================================
echo ✅ 修复完成！
echo ========================================
echo.
echo 下一步: 运行 mvn spring-boot:run 启动应用
echo.
pause
