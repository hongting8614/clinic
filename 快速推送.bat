@echo off
chcp 65001 >nul
echo ========================================
echo     AK-PMS 快速推送到 GitHub
echo ========================================
echo.

REM 切换到项目目录
cd /d D:\AK-PMS

REM 显示当前状态
echo [1/4] 检查修改文件...
git status

echo.
echo [2/4] 添加所有修改...
git add .

echo.
echo [3/4] 提交修改...
set /p commit_msg="请输入提交说明（直接回车使用默认）: "
if "%commit_msg%"=="" set commit_msg=日常更新 %date% %time%
git commit -m "%commit_msg%"

echo.
echo [4/4] 推送到 GitHub...
git push

echo.
echo ========================================
echo     ✅ 推送完成！
echo ========================================
echo.
pause

