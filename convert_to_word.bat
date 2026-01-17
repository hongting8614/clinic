@echo off
chcp 65001 >nul
echo ============================================================
echo 📄 Markdown 转 Word 文档工具
echo ============================================================
echo.

REM 创建输出目录
if not exist "Word文档" mkdir "Word文档"
echo 📁 输出目录: Word文档
echo.

REM 检查是否安装了 pandoc
where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  未检测到 pandoc，正在尝试使用 Python 方法...
    echo.
    goto PYTHON_METHOD
)

echo ✅ 使用 Pandoc 转换...
echo.

REM 使用 pandoc 转换文档
call :convert_file "📚 用户文档导航中心.md" "用户文档导航中心.docx"
call :convert_file "⚡ 5分钟快速入门.md" "5分钟快速入门.docx"
call :convert_file "📖 操作流程图解.md" "操作流程图解.docx"
call :convert_file "📱 小程序功能及用法手册.md" "小程序功能及用法手册.docx"
call :convert_file "❓ 常见问题速查手册.md" "常见问题速查手册.docx"
call :convert_file "📋 角色权限完整对照表.md" "角色权限完整对照表.docx"
call :convert_file "📱 微信小程序体验版使用指南.md" "微信小程序体验版使用指南.docx"
call :convert_file "✅ 项目部署与验证检查清单.md" "项目部署与验证检查清单.docx"
call :convert_file "👥 项目联系人信息表.md" "项目联系人信息表.docx"
call :convert_file "📚 项目文档总览.md" "项目文档总览.docx"

goto END

:PYTHON_METHOD
echo 使用 Python 方法转换...
python convert_to_word.py
goto END

:convert_file
if exist %1 (
    pandoc %1 -o "Word文档\%~2" --reference-doc=reference.docx 2>nul
    if %errorlevel% equ 0 (
        echo ✅ 已转换: %~2
    ) else (
        pandoc %1 -o "Word文档\%~2" 2>nul
        if %errorlevel% equ 0 (
            echo ✅ 已转换: %~2
        ) else (
            echo ❌ 转换失败: %1
        )
    )
) else (
    echo ⚠️  文件不存在: %1
)
goto :eof

:END
echo.
echo ============================================================
echo ✅ 转换完成！
echo 📁 输出目录: Word文档\
echo ============================================================
echo.
pause

