@echo off
chcp 65001 >nul
echo ========================================
echo     AK-PMS 快速同步代码
echo ========================================
echo.

REM 切换到项目目录
cd /d D:\AK-PMS

echo [1/2] 从 GitHub 拉取最新代码...
git pull

echo.
echo [2/2] 打开工作区...
start "" "AK-PMS.code-workspace"

echo.
echo ========================================
echo     ✅ 同步完成！工作区已打开
echo ========================================
echo.
pause

