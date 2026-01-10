# 修复 add.vue 中的"欢乐谷医务室"为"北京欢乐谷医务室"

$filePath = "D:\AK-PMS\pages-sub\clinic\add.vue"

# 读取文件内容
$content = Get-Content $filePath -Raw -Encoding UTF8

# 备份原文件
Copy-Item $filePath "$filePath.backup"

# 查找并替换（只替换日报生成代码中的，不替换页面标题）
# 根据搜索结果，第4941行附近有需要修改的内容
$pattern = '欢乐谷医务室\（\$\{locationName\}'
$replacement = '北京欢乐谷医务室（${locationName}'

if ($content -match $pattern) {
    $content = $content -replace $pattern, $replacement
    Write-Host "✅ 找到并替换了日报生成代码中的'欢乐谷医务室'" -ForegroundColor Green
} else {
    Write-Host "⚠️ 未找到匹配的模式，尝试其他方式" -ForegroundColor Yellow
    
    # 尝试更宽松的匹配
    $pattern2 = '`\$\{dateFormatted\}欢乐谷医务室'
    $replacement2 = '`${dateFormatted}北京欢乐谷医务室'
    
    if ($content -match $pattern2) {
        $content = $content -replace $pattern2, $replacement2
        Write-Host "✅ 使用备用方式替换成功" -ForegroundColor Green
    } else {
        Write-Host "❌ 未找到需要替换的内容" -ForegroundColor Red
    }
}

# 保存文件
$content | Set-Content $filePath -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "修复完成！" -ForegroundColor Cyan
Write-Host "原文件已备份为: $filePath.backup" -ForegroundColor Gray
Write-Host ""
Write-Host "请验证修改是否正确，如有问题可以从备份恢复。" -ForegroundColor Yellow





