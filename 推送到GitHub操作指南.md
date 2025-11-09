# 🚀 推送到 GitHub 操作指南

## 第一步：在 GitHub 创建仓库

### 1. 登录 GitHub
- 打开：https://github.com
- 登录您的账号

### 2. 创建新仓库
- 点击右上角 `+` → `New repository`
- 仓库名称：`AK-PMS`
- 描述（可选）：`药品管理系统 - 微信小程序`
- 选择：**Private**（私有仓库，推荐）
- **不要**勾选任何初始化选项（README、.gitignore、license）
- 点击：`Create repository`

### 3. 复制仓库地址
创建完成后，会显示仓库地址，类似：
```
https://github.com/你的用户名/AK-PMS.git
```

---

## 第二步：在电脑A执行推送命令

### 1. 添加远程仓库
```bash
cd D:\AK-PMS
git remote add origin https://github.com/你的用户名/AK-PMS.git
```

**将上面的地址替换为您的实际仓库地址！**

### 2. 推送代码
```bash
git push -u origin master
```

### 3. 输入 GitHub 凭据
- 如果提示输入用户名和密码：
  - 用户名：您的 GitHub 用户名
  - 密码：使用 **Personal Access Token**（不是登录密码）

#### 如何获取 Personal Access Token？

**步骤：**
1. 登录 GitHub
2. 点击右上角头像 → Settings（设置）
3. 左侧菜单：Developer settings（开发者设置）
4. Personal access tokens → Tokens (classic)
5. 点击：Generate new token (classic)
6. 填写：
   - Note（备注）：`AK-PMS Development`
   - Expiration（有效期）：选择 `No expiration`（永不过期）
   - 勾选权限：✅ `repo`（仓库完全访问权限）
7. 点击：Generate token
8. **复制并保存** Token（只显示一次！）

**使用 Token：**
- 在 Git 要求输入密码时，粘贴这个 Token

---

## 第三步：验证推送成功

### 1. 检查远程仓库
```bash
git remote -v
```

应该显示：
```
origin  https://github.com/你的用户名/AK-PMS.git (fetch)
origin  https://github.com/你的用户名/AK-PMS.git (push)
```

### 2. 刷新 GitHub 页面
- 回到 GitHub 仓库页面
- 刷新，应该能看到所有文件

✅ 完成！

---

## 📝 日常使用

### 电脑A 工作完成后
```bash
cd D:\AK-PMS

# 1. 添加所有修改
git add .

# 2. 提交修改
git commit -m "更新说明"

# 3. 推送到 GitHub
git push
```

### 电脑B 首次使用
```bash
# 1. 克隆项目
git clone https://github.com/你的用户名/AK-PMS.git D:\AK-PMS

# 2. 打开工作区
cd D:\AK-PMS
# 双击 AK-PMS.code-workspace
```

### 电脑B 后续使用
```bash
cd D:\AK-PMS

# 1. 拉取最新代码
git pull

# 2. 继续开发...
```

---

## ⚠️ 常见问题

### Q1：推送时提示 "Permission denied"
**A：** 检查 Personal Access Token 是否正确，权限是否包含 `repo`

### Q2：推送时提示 "remote: Repository not found"
**A：** 检查远程仓库地址是否正确

### Q3：想保存 Git 凭据，避免每次输入？
**A：** 运行以下命令：
```bash
git config --global credential.helper store
```
下次输入一次 Token 后，会自动保存

### Q4：如何查看当前远程仓库？
**A：** 
```bash
git remote -v
```

### Q5：如何更改远程仓库地址？
**A：** 
```bash
git remote set-url origin https://github.com/新用户名/新仓库.git
```

---

## 🔐 安全建议

1. ✅ 使用私有仓库（Private Repository）
2. ✅ 不要将敏感信息（密码、密钥）提交到 Git
3. ✅ `.gitignore` 已配置，会自动排除敏感文件
4. ✅ Personal Access Token 保存在安全的地方

---

## 📊 Git 常用命令速查

```bash
# 查看状态
git status

# 查看修改
git diff

# 查看提交历史
git log

# 撤销修改（未提交）
git checkout .

# 查看远程仓库
git remote -v

# 拉取最新代码
git pull

# 推送到远程
git push
```

---

## 🎯 完整工作流程总结

**电脑A → GitHub → 电脑B**

```
电脑A：
1. 修改代码
2. git add .
3. git commit -m "更新内容"
4. git push

↓ GitHub 云端同步 ↓

电脑B：
1. git pull
2. 双击 AK-PMS.code-workspace
3. 继续开发
```

✅ **完美的多设备开发环境！**

