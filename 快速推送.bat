@echo off
chcp 65001 >nul
echo ========================================
echo   快速推送到GitHub - AK-PMS v3.16.5
echo ========================================
echo.

echo 正在添加所有更改...
git add .

echo.
echo 正在提交更改...
set /p message=请输入提交信息: 
if "%message%"=="" set message=update: 更新代码
git commit -m "%message%"

echo.
echo 正在推送到GitHub...
git push

echo.
echo ========================================
echo   推送完成！
echo ========================================

pause
