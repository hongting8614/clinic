# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  从GitHub拉取最新代码" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查是否在Git仓库中
if (-not (Test-Path ".git")) {
    Write-Host "错误: 当前目录不是Git仓库！" -ForegroundColor Red
    exit 1
}

# 检查当前分支
Write-Host "检查当前分支..." -ForegroundColor Yellow
$currentBranch = git rev-parse --abbrev-ref HEAD
Write-Host "当前分支: $currentBranch" -ForegroundColor Green
Write-Host ""

# 检查是否有未提交的更改
Write-Host "检查工作区状态..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "警告: 工作区有未提交的更改！" -ForegroundColor Yellow
    Write-Host ""
    git status --short
    Write-Host ""
    $response = Read-Host "是否要暂存这些更改并继续拉取？(y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Write-Host "暂存当前更改..." -ForegroundColor Yellow
        git stash push -m "Auto stash before pull at $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        $stashed = $true
    } else {
        Write-Host "拉取操作已取消。" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "工作区干净，可以安全拉取。" -ForegroundColor Green
    $stashed = $false
}
Write-Host ""

# 获取远程更新
Write-Host "获取远程更新..." -ForegroundColor Yellow
git fetch origin
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 获取远程更新失败！" -ForegroundColor Red
    exit 1
}
Write-Host "远程更新获取成功！" -ForegroundColor Green
Write-Host ""

# 拉取最新代码
Write-Host "拉取最新代码..." -ForegroundColor Yellow
git pull origin $currentBranch
if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 拉取代码失败！" -ForegroundColor Red
    if ($stashed) {
        Write-Host "尝试恢复暂存的更改..." -ForegroundColor Yellow
        git stash pop
    }
    exit 1
}
Write-Host "代码拉取成功！" -ForegroundColor Green
Write-Host ""

# 如果之前暂存了更改，现在恢复
if ($stashed) {
    Write-Host "恢复暂存的更改..." -ForegroundColor Yellow
    git stash pop
    if ($LASTEXITCODE -ne 0) {
        Write-Host "警告: 恢复暂存更改时可能有冲突，请手动解决。" -ForegroundColor Yellow
    } else {
        Write-Host "暂存的更改已恢复！" -ForegroundColor Green
    }
    Write-Host ""
}

# 显示最新提交
Write-Host "最新提交信息:" -ForegroundColor Cyan
git log -1 --pretty=format:"%h - %an, %ar : %s" --date=relative
Write-Host ""
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  拉取完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan

