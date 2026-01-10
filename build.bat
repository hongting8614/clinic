@echo off
chcp 65001 >nul
echo ====================================
echo   构建生产版本
echo ====================================
echo.
cd /d D:\AK-PMS
npm run build:mp-weixin
echo.
echo 构建完成！
pause





