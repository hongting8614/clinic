# 🔧 解决 app.json 错误

## ❌ 问题原因

您遇到的错误：
```
app.json: 在项目根目录未找到 app.json
```

**原因**：这是一个 **uni-app 项目**，不是原生微信小程序项目。

- ✅ uni-app 使用：`pages.json` + `manifest.json`
- ❌ 原生小程序使用：`app.json`

您直接在微信开发者工具中打开了 uni-app 源码目录，所以报错。

---

## ✅ 解决方案（3个选择）

### 方案一：使用 HBuilderX（最推荐）⭐

这是 uni-app 官方推荐的开发工具。

#### 步骤：

1. **下载安装 HBuilderX**
   ```
   官网：https://www.dcloud.io/hbuilderx.html
   下载：HBuilderX 标准版（免费）
   ```

2. **导入项目**
   ```
   HBuilderX → 文件 → 导入 → 从本地目录导入
   选择目录：D:\medicine_manager\AK-PMS
   ```

3. **配置微信开发者工具路径**
   ```
   HBuilderX → 工具 → 设置 → 运行配置
   找到"微信开发者工具路径"
   设置为：C:\Program Files (x86)\Tencent\微信web开发者工具\cli.bat
   （根据您的实际安装路径调整）
   ```

4. **运行项目**
   ```
   HBuilderX → 运行 → 运行到小程序模拟器 → 微信开发者工具
   ```
   
   HBuilderX 会自动：
   - ✅ 编译 uni-app 代码
   - ✅ 生成小程序代码（包含 app.json）
   - ✅ 打开微信开发者工具
   - ✅ 自动刷新

---

### 方案二：使用 uni-app CLI 编译

如果您熟悉命令行，可以使用 CLI 工具。

#### 步骤：

1. **安装 Node.js**（如果还没有）
   ```
   官网：https://nodejs.org/
   ```

2. **安装 uni-app CLI**
   ```powershell
   npm install -g @dcloudio/uvm
   uvm install
   ```

3. **在项目目录编译**
   ```powershell
   cd D:\medicine_manager\AK-PMS
   npm install
   npm run dev:mp-weixin
   ```

4. **在微信开发者工具中打开编译后的目录**
   ```
   打开目录：D:\medicine_manager\AK-PMS\unpackage\dist\dev\mp-weixin
   ```

---

### 方案三：直接打开编译后的目录（临时方案）

如果项目已经编译过，可以直接打开编译输出目录。

#### 步骤：

1. **确认编译输出目录存在**
   ```
   D:\medicine_manager\AK-PMS\unpackage\dist\dev\mp-weixin
   ```

2. **在微信开发者工具中导入**
   ```
   微信开发者工具 → 导入项目
   目录：D:\medicine_manager\AK-PMS\unpackage\dist\dev\mp-weixin
   AppID：wx1ff987aa25e5c181
   ```

⚠️ **注意**：这个方案的问题是：
- 每次修改代码后需要重新编译
- 无法实时预览
- 不推荐用于开发

---

## 🎯 推荐流程

### 对于开发测试（推荐方案一）

```
1. 安装 HBuilderX
2. 导入项目
3. 配置微信开发者工具路径
4. 点击"运行到微信开发者工具"
5. 开始开发和测试
```

### 对于快速查看（推荐方案二或三）

```
1. 使用 CLI 编译项目
2. 在微信开发者工具中打开编译后的目录
3. 查看运行效果
```

---

## 📚 项目结构说明

```
AK-PMS/                          ← uni-app 源码目录（不能直接在微信开发者工具打开）
├── pages.json                   ← uni-app 页面配置
├── manifest.json                ← uni-app 应用配置
├── main.js                      ← uni-app 入口文件
├── App.vue                      ← uni-app 根组件
├── pages/                       ← 页面源码
├── components/                  ← 组件源码
└── unpackage/                   ← 编译输出目录
    └── dist/
        └── dev/
            └── mp-weixin/       ← 编译后的小程序代码（可以在微信开发者工具打开）
                ├── app.json     ← 自动生成的小程序配置
                ├── app.js       ← 自动生成的小程序入口
                └── ...          ← 其他编译后的文件
```

---

## ❓ 常见问题

### Q1: 为什么不能直接用微信开发者工具打开？
**A**: uni-app 是跨平台框架，需要先编译成小程序代码。就像 TypeScript 需要编译成 JavaScript 一样。

### Q2: HBuilderX 和微信开发者工具有什么区别？
**A**: 
- **HBuilderX**: uni-app 的开发工具，用于编写和编译 uni-app 代码
- **微信开发者工具**: 用于预览和调试编译后的小程序代码

### Q3: 我必须用 HBuilderX 吗？
**A**: 不是必须，但强烈推荐。您也可以：
- 使用 VS Code + uni-app 插件
- 使用 CLI 工具编译
- 但 HBuilderX 体验最好，功能最完整

### Q4: 编译后的代码在哪里？
**A**: `unpackage/dist/dev/mp-weixin/` 目录

---

## 🚀 立即开始

### 最快速的方法（推荐）：

1. **下载 HBuilderX**
   - 访问：https://www.dcloud.io/hbuilderx.html
   - 下载标准版（约 200MB）

2. **导入项目**
   - 打开 HBuilderX
   - 文件 → 导入 → 从本地目录导入
   - 选择：`D:\medicine_manager\AK-PMS`

3. **运行**
   - 运行 → 运行到小程序模拟器 → 微信开发者工具
   - 完成！🎉

---

## 📞 需要帮助？

如果您在操作过程中遇到问题，请告诉我：
1. 您选择了哪个方案？
2. 在哪一步遇到了问题？
3. 具体的错误信息是什么？

我会帮您解决！

---

**AK-PMS v3.4**  
**文档更新**: 2025-11-02


