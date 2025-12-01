# 📁 静态资源说明

本目录存放小程序的静态资源文件。

---

## 🎨 图标文件

### 已生成
- ✅ `logo.svg` - SVG矢量图标（可缩放）
- ✅ `icon-design.md` - 图标设计方案

### 待生成（使用工具生成）
- [ ] `logo.png` - 200x200px 小程序主图标
- [ ] `splash-icon.png` - 288x288px 启动页图标

### Tabbar图标（待添加）
```
tabbar/
  ├── home.png           - 首页（未选中）
  ├── home-active.png    - 首页（选中）
  ├── stock.png          - 库存（未选中）
  ├── stock-active.png   - 库存（选中）
  ├── record.png         - 单据（未选中）
  ├── record-active.png  - 单据（选中）
  ├── user.png           - 我的（未选中）
  └── user-active.png    - 我的（选中）
```

---

## 🛠️ 如何生成图标

### 方法一：使用在线工具（推荐）⭐

**步骤**：
1. 打开浏览器
2. 访问 `tools/generate-icon.html`（本地文件）
3. 调整颜色和文字
4. 点击"下载"按钮
5. 将下载的图标重命名为 `logo.png`
6. 放到 `static/` 目录

### 方法二：转换SVG为PNG

**在线转换**：
1. 访问 https://svgtopng.com/
2. 上传 `static/logo.svg`
3. 设置尺寸：200x200px
4. 下载PNG文件
5. 重命名为 `logo.png`

**使用VS Code插件**：
1. 安装插件：`SVG`
2. 右键 `logo.svg`
3. 选择 "Export PNG"
4. 设置尺寸并导出

### 方法三：使用设计软件

**Figma/Sketch/PS/AI**：
1. 导入 `logo.svg`
2. 调整为 200x200px
3. 导出为PNG
4. 保存为 `logo.png`

---

## 📏 图标尺寸规范

### 小程序图标
- **主图标**：200x200px（推荐）
- **启动页**：288x288px
- **格式**：PNG（带透明通道）
- **位置**：static/logo.png

### Tabbar图标
- **尺寸**：81x81px（标准）
- **格式**：PNG
- **颜色**：
  - 未选中：灰色 (#7A7E83)
  - 选中：主题色 (#667eea)

### 设计要求
- ✅ 圆角：10-20px
- ✅ 内边距：适当留白
- ✅ 清晰度：高分辨率
- ✅ 格式：PNG with Alpha

---

## 🎨 快速生成Tabbar图标

### 使用Emoji图标（临时方案）

可以使用以下emoji快速生成：
- 🏠 首页：home
- 📦 库存：stock  
- 📋 单据：record
- 👤 我的：user

### 推荐图标库

**免费图标库**：
1. **Iconfont** - https://www.iconfont.cn/
   - 阿里巴巴矢量图标库
   - 免费、丰富

2. **Icons8** - https://icons8.com/
   - 多种风格
   - 可自定义颜色

3. **Flaticon** - https://www.flaticon.com/
   - 扁平化图标
   - 医疗分类丰富

---

## 📋 使用清单

### 添加图标到项目

1. **生成/下载图标文件**
   ```
   ✅ logo.png (200x200)
   ✅ tabbar 图标 (81x81) × 8个
   ```

2. **放置文件**
   ```
   static/
     ├── logo.png
     └── tabbar/
         ├── home.png
         ├── home-active.png
         ├── stock.png
         ├── stock-active.png
         ├── record.png
         ├── record-active.png
         ├── user.png
         └── user-active.png
   ```

3. **配置manifest.json**
   ```json
   {
     "icons": {
       "72": "static/logo.png",
       "96": "static/logo.png",
       "128": "static/logo.png",
       "144": "static/logo.png"
     }
   }
   ```

4. **已配置pages.json**（Tabbar图标）
   ```json
   {
     "tabBar": {
       "list": [
         {
           "iconPath": "static/tabbar/home.png",
           "selectedIconPath": "static/tabbar/home-active.png"
         }
       ]
     }
   }
   ```

5. **上传到微信公众平台**
   ```
   微信公众平台 → 设置 → 基本设置
   → 小程序头像 → 上传 logo.png
   ```

---

## ✅ 完成！

图标设计方案和生成工具已准备好！

### 下一步
1. 打开 `tools/generate-icon.html`
2. 调整颜色（可选）
3. 下载图标
4. 放到static目录
5. 配置完成！

---

**最后更新**：2025-10-28  
**维护者**：开发团队

