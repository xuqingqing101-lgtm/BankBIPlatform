@echo off
chcp 65001 >nul
cls

echo ====================================
echo 获取详细错误信息
echo ====================================
echo.

echo 正在运行详细编译...
echo.

cd /d "%~dp0"

REM 使用-e和-X参数获取完整错误信息
mvn spring-boot:run -e -X > full-error-log.txt 2>&1

echo.
echo ====================================
echo 错误日志已保存到: full-error-log.txt
echo ====================================
echo.
echo 请查看文件内容，重点关注:
echo   - Caused by:
echo   - Exception
echo   - ERROR
echo   - Failed to
echo.

REM 尝试提取关键错误信息
echo 正在提取关键错误...
echo.
echo ========== 关键错误信息 ==========
findstr /C:"Caused by:" full-error-log.txt
findstr /C:"Exception in thread" full-error-log.txt
findstr /C:"java.lang" full-error-log.txt | findstr "Exception"
echo =================================
echo.

pause
