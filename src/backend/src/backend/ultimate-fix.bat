@echo off
chcp 65001 >nul
cls

echo ============================================
echo 🔧 Lombok编译问题 - 终极修复方案
echo ============================================
echo.

echo 此脚本将执行以下操作：
echo 1. 完全清理项目
echo 2. 清理Maven缓存
echo 3. 重新下载所有依赖
echo 4. 验证Lombok配置
echo 5. 编译项目
echo.
pause

echo.
echo ============================================
echo [1/6] 检查环境
echo ============================================
echo.

echo Java版本：
java -version 2>&1 | findstr "version"
echo.

echo Maven版本：
mvn -v 2>&1 | findstr "Apache Maven"
mvn -v 2>&1 | findstr "Java version"
echo.

echo ============================================
echo [2/6] 完全清理项目
echo ============================================
echo.

if exist target (
    echo 删除target目录...
    rmdir /s /q target
    echo ✅ target目录已删除
) else (
    echo ℹ️  target目录不存在
)
echo.

echo 执行mvn clean...
call mvn clean
echo.

echo ============================================
echo [3/6] 清理Maven本地仓库
echo ============================================
echo.

echo 清理Lombok缓存...
call mvn dependency:purge-local-repository -DmanualInclude="org.projectlombok:lombok" -q
echo ✅ Lombok缓存已清理
echo.

echo ============================================
echo [4/6] 验证pom.xml配置
echo ============================================
echo.

echo 检查Lombok版本配置...
findstr "<lombok.version>" pom.xml
echo.

echo 检查Java版本配置...
findstr "<java.version>" pom.xml
echo.

echo 检查是否有maven-compiler-plugin...
findstr "maven-compiler-plugin" pom.xml >nul
if %ERRORLEVEL% EQ 0 (
    echo ✅ maven-compiler-plugin已配置
) else (
    echo ❌ maven-compiler-plugin未配置
)
echo.

echo ============================================
echo [5/6] 重新下载依赖
echo ============================================
echo.

echo 强制更新所有依赖...
call mvn dependency:resolve -U
echo.

echo 检查Lombok是否正确下载...
call mvn dependency:tree | findstr "lombok"
echo.

echo ============================================
echo [6/6] 编译项目
echo ============================================
echo.

echo 开始编译（这可能需要几分钟）...
echo.
call mvn clean compile

if %ERRORLEVEL% EQ 0 (
    echo.
    echo ============================================
    echo ✅ 编译成功！
    echo ============================================
    echo.
    
    echo 验证Lombok是否工作...
    echo.
    
    if exist "target\classes\com\bank\bi\model\entity\User.class" (
        echo 检查User类的getter方法...
        javap -p target\classes\com\bank\bi\model\entity\User.class | findstr "getUserId" >nul
        if %ERRORLEVEL% EQ 0 (
            echo ✅ Lombok工作正常！User类的getter方法已生成
        ) else (
            echo ❌ 警告: 未找到getter方法，Lombok可能未正常工作
        )
    )
    
    echo.
    echo ============================================
    echo 🎉 下一步
    echo ============================================
    echo.
    echo 运行应用：
    echo     mvn spring-boot:run
    echo.
    echo 或打包：
    echo     mvn package
    echo.
) else (
    echo.
    echo ============================================
    echo ❌ 编译失败
    echo ============================================
    echo.
    echo 可能的原因：
    echo 1. JDK版本问题 - 需要JDK 25
    echo 2. Maven版本问题 - 需要Maven 3.9.0+
    echo 3. 网络问题 - 无法下载依赖
    echo 4. Lombok配置问题
    echo.
    echo 建议：
    echo 1. 查看详细日志：
    echo     mvn clean compile -X ^> compile-debug.log 2^>^&1
    echo.
    echo 2. 查看修复文档：
    echo     type COMPILE_FIX_FINAL.md
    echo.
    echo 3. 尝试使用JDK 17：
    echo     修改pom.xml中的^<java.version^>为17
    echo.
    echo 4. 使用Maven Wrapper：
    echo     mvn wrapper:wrapper -Dmaven=3.9.9
    echo     mvnw.cmd clean compile
    echo.
)

pause
