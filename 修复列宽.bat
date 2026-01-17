@echo off
chcp 65001 >nul
echo 正在修复门诊登记表Excel列宽...
echo.

cd /d "%~dp0"

powershell -Command "(Get-Content 'cloudfunctions\reports\index.js' -Raw) -replace \"{ key: 'index', width: 3.5 }\", \"{ key: 'index', width: 4.86 }\" -replace \"{ key: 'gender', width: 3.5 }\", \"{ key: 'gender', width: 4.86 }\" -replace \"{ key: 'age', width: 3.5 }\", \"{ key: 'age', width: 4.86 }\" | Set-Content 'cloudfunctions\reports\index.js' -Encoding UTF8"

echo.
echo ✓ 修复完成！
echo.
echo 修改内容：
echo - 序号列宽：3.5 → 4.86 （实际显示约3.5）
echo - 性别列宽：3.5 → 4.86 （实际显示约3.5）
echo - 年龄列宽：3.5 → 4.86 （实际显示约3.5）
echo.
echo 下一步操作：
echo 1. 在微信开发者工具中右键 cloudfunctions/reports
echo 2. 选择"上传并部署：云端安装依赖"
echo 3. 等待部署完成
echo 4. 重新导出Excel测试
echo.
pause


