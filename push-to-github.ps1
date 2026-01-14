# Git推送到GitHub的PowerShell脚本
# 版本: v3.16.5
# 日期: 2026-01-10

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Git推送到GitHub - AK-PMS v3.16.5" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在正确的目录
$currentPath = Get-Location
Write-Host "当前目录: $currentPath" -ForegroundColor Yellow

# 检查Git状态
Write-Host ""
Write-Host "1. 检查Git状态..." -ForegroundColor Green
git status --short

# 检查是否有未提交的更改
$status = git status --porcelain
if ($status) {
    Write-Host ""
    Write-Host "⚠️  发现未提交的更改" -ForegroundColor Yellow
    $commit = Read-Host "是否要提交这些更改? (y/n)"
    
    if ($commit -eq 'y' -or $commit -eq 'Y') {
        Write-Host ""
        Write-Host "2. 添加所有更改..." -ForegroundColor Green
        git add .
        
        Write-Host ""
        $message = Read-Host "请输入提交信息"
        if ([string]::IsNullOrWhiteSpace($message)) {
            $message = "update: 更新代码"
        }
        
        Write-Host ""
        Write-Host "3. 提交更改..." -ForegroundColor Green
        git commit -m "$message"
    }
}

# 检查网络连接
Write-Host ""
Write-Host "4. 检查GitHub连接..." -ForegroundColor Green
$pingResult = Test-Connection -ComputerName github.com -Count 1 -Quiet

if (-not $pingResult) {
    Write-Host "❌ 无法连接到GitHub" -ForegroundColor Red
    Write-Host ""
    Write-Host "可能的原因:" -ForegroundColor Yellow
    Write-Host "  1. 网络连接问题" -ForegroundColor White
    Write-Host "  2. 需要使用VPN" -ForegroundColor White
    Write-Host "  3. 防火墙阻止" -ForegroundColor White
    Write-Host ""
    Write-Host "建议解决方案:" -ForegroundColor Yellow
    Write-Host "  1. 使用 GitHub Desktop 推送（最简单）" -ForegroundColor White
    Write-Host "  2. 配置代理后重试" -ForegroundColor White
    Write-Host "  3. 稍后重试" -ForegroundColor White
    Write-Host ""
    
    $useDesktop = Read-Host "是否要打开GitHub Desktop? (y/n)"
    if ($useDesktop -eq 'y' -or $useDesktop -eq 'Y') {
        Start-Process "github"
    }
    
    exit
}

Write-Host "✅ GitHub连接正常" -ForegroundColor Green

# 尝试推送
Write-Host ""
Write-Host "5. 推送到GitHub..." -ForegroundColor Green
Write-Host "   远程仓库: https://github.com/hongting8614/clinic.git" -ForegroundColor Gray
Write-Host ""

try {
    git push origin main 2>&1 | Tee-Object -Variable pushOutput
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅ 推送成功！" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "查看仓库: https://github.com/hongting8614/clinic" -ForegroundColor Cyan
        Write-Host ""
        
        $openBrowser = Read-Host "是否要在浏览器中打开仓库? (y/n)"
        if ($openBrowser -eq 'y' -or $openBrowser -eq 'Y') {
            Start-Process "https://github.com/hongting8614/clinic"
        }
    } else {
        Write-Host ""
        Write-Host "❌ 推送失败" -ForegroundColor Red
        Write-Host ""
        Write-Host "错误信息:" -ForegroundColor Yellow
        Write-Host $pushOutput -ForegroundColor Red
        Write-Host ""
        Write-Host "建议:" -ForegroundColor Yellow
        Write-Host "  1. 使用 GitHub Desktop 推送" -ForegroundColor White
        Write-Host "  2. 检查网络连接" -ForegroundColor White
        Write-Host "  3. 查看 Git推送指南-v3.16.5.md" -ForegroundColor White
    }
} catch {
    Write-Host ""
    Write-Host "❌ 推送过程中出错" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "建议使用 GitHub Desktop 推送" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")


