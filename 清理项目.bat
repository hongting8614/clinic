@echo off
chcp 65001 >nul
echo ========================================
echo 🧹 AK-PMS 项目清理脚本
echo ========================================
echo.
echo ⚠️ 警告：此操作将移动和删除文件
echo 建议先备份项目！
echo.
pause

echo.
echo [1/5] 创建归档文件夹...
if not exist "archived" mkdir archived
if not exist "archived\scripts" mkdir archived\scripts
if not exist "archived\docs" mkdir archived\docs
if not exist "tools" mkdir tools
if not exist "docs\archived" mkdir docs\archived
if not exist "docs\archived\optimization" mkdir docs\archived\optimization
if not exist "docs\archived\v3.16.1" mkdir docs\archived\v3.16.1
echo ✅ 文件夹创建完成

echo.
echo [2/5] 移动临时诊断脚本...
if exist "诊断库存问题.js" (
    move "诊断库存问题.js" "archived\scripts\" >nul 2>&1
    echo   ✅ 诊断库存问题.js
)
if exist "诊断处方库存问题.js" (
    move "诊断处方库存问题.js" "archived\scripts\" >nul 2>&1
    echo   ✅ 诊断处方库存问题.js
)
if exist "清除园区选择设置-手机端使用.js" (
    move "清除园区选择设置-手机端使用.js" "archived\scripts\" >nul 2>&1
    echo   ✅ 清除园区选择设置-手机端使用.js
)
if exist "database_init.js" (
    move "database_init.js" "archived\scripts\" >nul 2>&1
    echo   ✅ database_init.js
)
echo ✅ 临时脚本移动完成

echo.
echo [3/5] 整理工具脚本...
if exist "清除测试数据.js" (
    move "清除测试数据.js" "tools\" >nul 2>&1
    echo   ✅ 清除测试数据.js
)
if exist "清除测试数据-使用指南.md" (
    move "清除测试数据-使用指南.md" "tools\" >nul 2>&1
    echo   ✅ 清除测试数据-使用指南.md
)
echo ✅ 工具脚本整理完成

echo.
echo [4/5] 删除重复文件...
if exist "清除测试数据-安全版.js" (
    del "清除测试数据-安全版.js" >nul 2>&1
    echo   ✅ 清除测试数据-安全版.js
)
if exist "清除测试数据-分步执行.js" (
    del "清除测试数据-分步执行.js" >nul 2>&1
    echo   ✅ 清除测试数据-分步执行.js
)
echo ✅ 重复文件删除完成

echo.
echo [5/5] 归档历史文档...

REM v3.16.1 文档
if exist "v3.16.1快速部署指南.md" move "v3.16.1快速部署指南.md" "docs\archived\v3.16.1\" >nul 2>&1
if exist "v3.16.1部署检查清单.md" move "v3.16.1部署检查清单.md" "docs\archived\v3.16.1\" >nul 2>&1
if exist "v3.16.1快速总结.md" move "v3.16.1快速总结.md" "docs\archived\v3.16.1\" >nul 2>&1
if exist "v3.16.1完成报告.md" move "v3.16.1完成报告.md" "docs\archived\v3.16.1\" >nul 2>&1

REM 库存出库优化文档
if exist "库存出库逻辑优化-工作完成总结.md" move "库存出库逻辑优化-工作完成总结.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-README.md" move "库存出库逻辑优化-README.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-文件索引.md" move "库存出库逻辑优化-文件索引.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-总结.md" move "库存出库逻辑优化-总结.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-部署检查清单.md" move "库存出库逻辑优化-部署检查清单.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-代码落地完成报告.md" move "库存出库逻辑优化-代码落地完成报告.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-快速应用指南.md" move "库存出库逻辑优化-快速应用指南.md" "docs\archived\optimization\" >nul 2>&1
if exist "库存出库逻辑优化-代码落地文档.md" move "库存出库逻辑优化-代码落地文档.md" "docs\archived\optimization\" >nul 2>&1
if exist "优化分析报告-库存出库逻辑.md" move "优化分析报告-库存出库逻辑.md" "docs\archived\optimization\" >nul 2>&1

REM 诊断系统文档
if exist "诊断系统代码修复补丁.md" move "诊断系统代码修复补丁.md" "docs\archived\optimization\" >nul 2>&1
if exist "诊断系统完整说明.md" move "诊断系统完整说明.md" "docs\archived\optimization\" >nul 2>&1
if exist "诊断与症状不一致问题解决方案.md" move "诊断与症状不一致问题解决方案.md" "docs\archived\optimization\" >nul 2>&1
if exist "诊断字段关联逻辑优化方案.md" move "诊断字段关联逻辑优化方案.md" "docs\archived\optimization\" >nul 2>&1
if exist "诊断字段关联逻辑优化完成报告.md" move "诊断字段关联逻辑优化完成报告.md" "docs\archived\optimization\" >nul 2>&1
if exist "诊断字段关联优化总结.md" move "诊断字段关联优化总结.md" "docs\archived\optimization\" >nul 2>&1
if exist "主诉修改重新填充方案.md" move "主诉修改重新填充方案.md" "docs\archived\optimization\" >nul 2>&1

REM 五官科文档
if exist "五官科疾病功能快速总结.md" move "五官科疾病功能快速总结.md" "docs\archived\optimization\" >nul 2>&1
if exist "五官科疾病部署文档.md" move "五官科疾病部署文档.md" "docs\archived\optimization\" >nul 2>&1
if exist "五官科疾病测试用例.md" move "五官科疾病测试用例.md" "docs\archived\optimization\" >nul 2>&1

REM 处方功能文档
if exist "处方不能添加药品问题分析与优化.md" move "处方不能添加药品问题分析与优化.md" "docs\archived\optimization\" >nul 2>&1
if exist "处方功能优化说明.md" move "处方功能优化说明.md" "docs\archived\optimization\" >nul 2>&1
if exist "处方库存获取失败问题修复说明.md" move "处方库存获取失败问题修复说明.md" "docs\archived\optimization\" >nul 2>&1

REM 辅助诊断文档
if exist "辅助诊断功能优化方案.md" move "辅助诊断功能优化方案.md" "docs\archived\optimization\" >nul 2>&1
if exist "辅助诊断功能优化完成报告.md" move "辅助诊断功能优化完成报告.md" "docs\archived\optimization\" >nul 2>&1

REM 扭伤诊断文档
if exist "扭伤拉伤诊断快速选择指南.md" move "扭伤拉伤诊断快速选择指南.md" "docs\archived\optimization\" >nul 2>&1
if exist "扭伤诊断选择使用指南.md" move "扭伤诊断选择使用指南.md" "docs\archived\optimization\" >nul 2>&1

REM 其他优化文档
if exist "选择诊断参考按钮逻辑说明.md" move "选择诊断参考按钮逻辑说明.md" "docs\archived\optimization\" >nul 2>&1
if exist "Add.vue文件说明-最终答案.md" move "Add.vue文件说明-最终答案.md" "docs\archived\optimization\" >nul 2>&1
if exist "代码优化报告.md" move "代码优化报告.md" "docs\archived\optimization\" >nul 2>&1

echo ✅ 历史文档归档完成

echo.
echo ========================================
echo ✅ 清理完成！
echo ========================================
echo.
echo 📊 清理统计：
echo   - 已归档临时脚本：4 个
echo   - 已整理工具脚本：2 个
echo   - 已删除重复文件：2 个
echo   - 已归档历史文档：约 30 个
echo.
echo 📁 文件位置：
echo   - 临时脚本：archived\scripts\
echo   - 工具脚本：tools\
echo   - 历史文档：docs\archived\
echo.
echo 💡 下一步：
echo   1. 检查项目是否正常运行
echo   2. 提交代码到 Git
echo   3. 查看"代码优化清理报告-2026-01-02.md"了解详情
echo.
pause

