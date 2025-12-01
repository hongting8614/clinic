# 🕷️ 京东医药爬虫使用说明

## 📦 准备工作

### 1. 安装Python依赖

```bash
pip install selenium
pip install beautifulsoup4
pip install pandas
pip install openpyxl
```

### 2. 下载ChromeDriver

1. 查看你的Chrome浏览器版本：
   - 打开Chrome → 右上角三个点 → 帮助 → 关于Google Chrome
   - 记住版本号，例如：120.0.6099.129

2. 下载对应版本的ChromeDriver：
   - 访问：https://chromedriver.chromium.org/downloads
   - 或者：https://googlechromelabs.github.io/chrome-for-testing/
   - 下载与你的Chrome版本匹配的驱动

3. 放置ChromeDriver：
   - 解压下载的文件
   - 将 `chromedriver.exe` 放到以下任一位置：
     - `C:\Windows\System32\`
     - 或添加到系统PATH环境变量

---

## 🚀 使用方法

### 方式1：直接运行

```bash
cd d:\AK-PMS\scripts
python jd_drug_crawler.py
```

### 方式2：在Python中使用

```python
from jd_drug_crawler import JDDrugCrawler

crawler = JDDrugCrawler()
crawler.search_drugs(keyword="感冒药", max_pages=3)
crawler.batch_get_details()  # 获取详情（包括条形码）
crawler.save_to_excel()
crawler.generate_import_script()
crawler.close()
```

---

## 📋 运行流程

### 1. 启动程序

```bash
python jd_drug_crawler.py
```

### 2. 选择搜索关键词

```
请选择搜索关键词：
  1. 感冒药
  2. 消炎药
  3. 止咳药
  4. 止痛药
  5. 降压药
  6. 降糖药
  7. 自定义

请输入选项 (1-7): 1
```

### 3. 输入爬取页数

```
爬取页数 (1-10，默认3): 3
```

### 4. 等待爬取完成

```
🔍 搜索关键词: 感冒药
📡 访问: https://search.jd.com/...

📄 第 1 页
找到 60 个商品
  [1] ✅ 999感冒灵颗粒
  [2] ✅ 连花清瘟胶囊
  ...
```

### 5. 选择是否获取详情

```
是否获取详情（包括条形码）？(y/n): y

📋 获取详情: 999感冒灵颗粒
  ✅ 条形码: 6901028075862
  ✅ 规格: 10g×9袋
  ✅ 厂家: 华润三九医药股份有限公司
```

### 6. 自动保存文件

程序会自动生成3个文件：

1. **京东药材数据.csv** - CSV格式数据
2. **京东药材数据.xlsx** - Excel格式数据
3. **导入京东数据.js** - 云数据库导入脚本

---

## 📤 导入到云数据库

### 步骤1：打开导入脚本

找到生成的 `导入京东数据.js` 文件

### 步骤2：在小程序开发工具运行

1. 打开微信开发者工具
2. 打开控制台（Console）
3. 复制 `导入京东数据.js` 的全部内容
4. 粘贴到控制台
5. 按Enter运行

### 步骤3：等待导入完成

```
========================================
📦 开始批量导入京东药材数据
总数: 50
========================================
[1/50] ✅ 999感冒灵颗粒
[2/50] ✅ 连花清瘟胶囊
...
========================================
✅ 导入完成
成功: 48
失败: 2
========================================
```

---

## ⚙️ 配置选项

### 修改爬取页数

在代码中修改：

```python
crawler.search_drugs(keyword="感冒药", max_pages=5)  # 爬取5页
```

### 修改搜索关键词

```python
keywords = [
    "感冒药",
    "消炎药",
    "你想要的关键词"
]
```

### 启用无头模式（后台运行）

在代码第21行取消注释：

```python
chrome_options.add_argument('--headless')  # 启用无头模式
```

---

## ⚠️ 注意事项

### 1. 反爬虫限制

- ✅ 已设置延迟（避免请求过快）
- ✅ 已设置User-Agent
- ⚠️ 不要爬取过多页面
- ⚠️ 建议单次爬取 1-5 页

### 2. 条形码获取

- 需要进入商品详情页才能获取条形码
- 会增加爬取时间
- 建议分批次进行

### 3. 数据准确性

- 京东数据可能不是官方药材信息
- 建议结合NMPA数据使用
- 仅作为初始数据参考

### 4. 法律合规

- ⚠️ 仅用于学习和个人使用
- ⚠️ 不要用于商业用途
- ⚠️ 遵守京东网站使用条款

---

## 🐛 常见问题

### 问题1：ChromeDriver版本不匹配

```
错误: session not created: This version of ChromeDriver only supports Chrome version xxx
```

**解决：**
- 下载与你的Chrome版本匹配的ChromeDriver
- 或更新Chrome浏览器

### 问题2：找不到ChromeDriver

```
错误: 'chromedriver' executable needs to be in PATH
```

**解决：**
- 确认ChromeDriver已下载
- 放到系统PATH路径中
- 或在代码中指定完整路径

### 问题3：页面加载超时

```
错误: Timeout waiting for page to load
```

**解决：**
- 检查网络连接
- 增加等待时间
- 重试几次

### 问题4：爬取到的数据没有条形码

**原因：**
- 商品详情页没有显示条形码
- 或条形码字段名称变化

**解决：**
- 检查商品详情页HTML结构
- 手动补充条形码信息

---

## 📊 数据格式

### Excel表格字段

| 字段 | 说明 | 示例 |
|------|------|------|
| skuId | 京东商品ID | 100012345678 |
| name | 药材名称 | 999感冒灵颗粒 |
| barcode | 条形码 | 6901028075862 |
| specification | 规格 | 10g×9袋 |
| unit | 单位 | 盒 |
| manufacturer | 生产企业 | 华润三九医药股份有限公司 |
| approvalNumber | 批准文号 | 国药准字Z... |
| price | 价格 | 15.80 |
| shop | 店铺 | 京东大药房 |
| link | 商品链接 | https://item.jd.com/... |

---

## 🎯 最佳实践

### 1. 分批次爬取

```python
# 第一批：感冒药
crawler.search_drugs("感冒药", max_pages=3)
crawler.batch_get_details()
crawler.save_to_excel("感冒药数据.xlsx")

# 第二批：消炎药
crawler.search_drugs("消炎药", max_pages=3)
crawler.batch_get_details()
crawler.save_to_excel("消炎药数据.xlsx")
```

### 2. 定期更新

- 建议每月更新一次数据
- 补充新上市的药材
- 更新价格信息

### 3. 数据清洗

- 检查重复数据
- 验证条形码格式
- 核对药材信息准确性

---

## 📞 技术支持

如有问题，请检查：
1. Python版本 >= 3.7
2. Chrome浏览器已安装
3. ChromeDriver版本匹配
4. 网络连接正常

---

## 📝 更新日志

### v1.0.0 (2025-11-23)
- ✅ 基础爬虫功能
- ✅ 支持京东医药搜索
- ✅ 自动获取条形码
- ✅ 生成导入脚本
- ✅ 导出Excel和CSV

---

**祝爬取顺利！** 🎉
