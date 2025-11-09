# 检查 Settings Sync 是否已开启

## 方法1：命令面板（最准确）

```bash
1. 按 Ctrl + Shift + P
2. 输入：settings sync turn
3. 查看显示的命令：

如果看到：
✅ "Settings Sync: Turn On" → 还没开启，需要点击开启
✅ "Settings Sync: Turn Off" → 已经开启了！

或者输入：
settings sync show

如果能执行 "Settings Sync: Show Settings"
说明功能可用，可以查看详细状态
```

## 方法2：左下角账户图标

```bash
1. 点击左下角的账户图标（人头图标 👤）
2. 查看菜单中是否有：
   - "Settings Sync is On" → 已开启 ✅
   - "Turn on Settings Sync..." → 需要开启
```

## 方法3：查看设置文件

```bash
1. 按 Ctrl + Shift + P
2. 输入：Preferences: Open User Settings (JSON)
3. 查找是否有类似这样的配置：
   "settingsSync.enabled": true
```

## 如果 Settings Sync 不可用

可能的原因：
1. Cursor 版本太旧（需要更新）
2. 功能被禁用（需要在设置中启用）
3. 需要先登录账户

## 替代方案

如果 Settings Sync 无法使用，可以：
1. 使用 Git 同步 .vscode 文件夹
2. 手动导出/导入设置
3. 使用配置文件管理工具

