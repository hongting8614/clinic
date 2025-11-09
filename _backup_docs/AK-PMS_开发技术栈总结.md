# 🔧 AK-PMS 开发技术栈总结

<div align="center">

**AK-PMS (AiKang Pharmacy Management System)**  
**Version**: 3.3  
**更新日期**: 2025-11-01  
**文档类型**: 技术栈速查手册

</div>

---

## 📊 技术栈一览表

### 前端技术栈

| 类别 | 技术/工具 | 版本 | 官方文档 | 用途 |
|------|----------|------|---------|------|
| **🎨 框架** | uni-app | 3.x | [uniapp.dcloud.io](https://uniapp.dcloud.io/) | 跨平台开发框架 |
| **⚛️ JS框架** | Vue.js | 3.x | [vuejs.org](https://vuejs.org/) | 响应式UI开发 |
| **🎭 UI组件** | Vant Weapp | 1.11+ | [vant-contrib.gitee.io/vant-weapp](https://vant-contrib.gitee.io/vant-weapp) | 移动端UI组件库 |
| | uView Plus | 3.x | [uiadmin.net/uview-plus](https://www.uiadmin.net/uview-plus/) | uni-app专用UI库 |
| **📈 图表库** | ECharts | 5.4+ | [echarts.apache.org](https://echarts.apache.org/) | 数据可视化 |
| **🗄️ 状态管理** | Vuex / Pinia | 4.x / 2.x | [vuex.vuejs.org](https://vuex.vuejs.org/) | 全局状态管理 |
| **🎨 样式** | Sass/SCSS | - | [sass-lang.com](https://sass-lang.com/) | CSS预处理器 |

### 后端技术栈

| 类别 | 技术/工具 | 版本 | 官方文档 | 用途 |
|------|----------|------|---------|------|
| **🚀 运行时** | Node.js | 18 LTS | [nodejs.org](https://nodejs.org/) | 云函数运行环境 |
| **☁️ 云平台** | 腾讯云开发 | CloudBase | [cloud.tencent.com](https://cloud.tencent.com/document/product/876) | Serverless平台 |
| **💾 数据库** | MongoDB | 4.4+ | [mongodb.com](https://www.mongodb.com/) | 文档型数据库 |
| **📦 云存储** | COS | - | [cloud.tencent.com/product/cos](https://cloud.tencent.com/product/cos) | 对象存储服务 |
| **⏰ 定时任务** | 云函数触发器 | - | - | 定时执行任务 |
| **📝 日志** | 云日志 | - | - | 日志收集与分析 |

### 开发工具

| 类别 | 工具 | 版本 | 下载地址 | 用途 |
|------|------|------|---------|------|
| **💻 IDE** | HBuilderX | 最新版 | [dcloud.io](https://www.dcloud.io/hbuilderx.html) | uni-app开发工具 |
| | 微信开发者工具 | 最新版 | [developers.weixin.qq.com](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | 小程序调试工具 |
| **📦 包管理** | npm | 9.6+ | [npmjs.com](https://www.npmjs.com/) | 依赖管理 |
| **🔧 CLI工具** | @cloudbase/cli | 最新版 | - | 云开发命令行工具 |
| **📝 代码规范** | ESLint | 8.x | [eslint.org](https://eslint.org/) | 代码检查 |
| | Prettier | 2.x | [prettier.io](https://prettier.io/) | 代码格式化 |
| **🔄 版本控制** | Git | 2.x | [git-scm.com](https://git-scm.com/) | 版本管理 |

---

## 🏗️ 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                      📱 用户层                                 │
│                   (微信小程序客户端)                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  前端框架: uni-app + Vue3                                      │
│  UI组件: Vant Weapp + uView Plus                              │
│  图表库: ECharts                                              │
│  状态管理: Vuex / Pinia                                       │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTPS / WebSocket
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    ⚙️ 应用层                                  │
│                (腾讯云开发 CloudBase)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  云函数 (Node.js 18):                                         │
│  ├─ drugManage        (药品管理)                              │
│  ├─ stockManage       (库存管理)                              │
│  ├─ inRecords         (入库记录)                              │
│  ├─ outRecords        (出库记录)                              │
│  ├─ clinicRecords     (门诊登记)      🔥 v3.2核心             │
│  ├─ consumeRecords    (消耗统计)                              │
│  ├─ requisitionRecords (请领管理)                             │
│  ├─ reportService     (报表服务)      🔥 v3.3新增             │
│  ├─ queryService      (查询服务)      🔥 v3.3新增             │
│  ├─ dailySummary      (每日统计)      ⏰ 定时任务             │
│  └─ expiryMonitor     (效期预警)      ⏰ 定时任务             │
│                                                               │
│  API网关: 自动生成RESTful接口                                  │
│                                                               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    💾 数据层                                  │
│              (云数据库 + 云存储)                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  数据库集合 (MongoDB):                                         │
│  ├─ drugs              (药品档案)                             │
│  ├─ stock              (库存表)         🔥 核心表              │
│  ├─ in_records         (入库记录)                             │
│  ├─ out_records        (出库记录)                             │
│  ├─ clinic_usage       (门诊登记)       🔥 v3.2新增           │
│  ├─ consume_records    (消耗记录)                             │
│  ├─ requisition_records (请领记录)                            │
│  ├─ statistics         (统计数据)       🔥 v3.3新增           │
│  ├─ alerts             (预警记录)       🔥 v3.3新增           │
│  ├─ users              (用户表)                               │
│  └─ operation_logs     (操作日志)                             │
│                                                               │
│  云存储:                                                       │
│  ├─ 电子签名图片                                               │
│  ├─ 报表导出文件 (Excel/PDF)                                  │
│  └─ 数据库备份文件                                             │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 核心依赖包

### package.json (前端)

```json
{
  "name": "ak-pms-miniprogram",
  "version": "3.3.0",
  "description": "AK-PMS 药材管理系统",
  "main": "main.js",
  "dependencies": {
    "@dcloudio/uni-app": "^3.0.0",
    "vue": "^3.2.0",
    "vuex": "^4.0.0",
    "pinia": "^2.0.0",
    "echarts": "^5.4.0",
    "vant-weapp": "^1.11.0",
    "uview-plus": "^3.0.0"
  },
  "devDependencies": {
    "@vue/cli-service": "^5.0.0",
    "sass": "^1.50.0",
    "sass-loader": "^10.0.0",
    "eslint": "^8.0.0",
    "prettier": "^2.0.0"
  }
}
```

### package.json (云函数)

```json
{
  "name": "ak-pms-cloudfunctions",
  "version": "3.3.0",
  "description": "AK-PMS 云函数",
  "dependencies": {
    "wx-server-sdk": "^3.0.0"
  }
}
```

---

## 🔑 核心技术特性

### 1. 分园区管理架构 🔥

```javascript
// location 字段贯穿全系统
const LOCATIONS = {
  LAND_PARK: 'land_park',         // 陆园
  WATER_PARK: 'water_park',       // 水园
  CLINIC_STORAGE: 'clinic_storage' // 医务室仓库
};

// 库存唯一键: drugId + batch + location
const stockKey = {
  drugId: 'DR001',
  batch: 'BATCH001',
  location: 'land_park'
};

// 门诊登记必须指定园区
const clinicRecord = {
  drugId: 'DR001',
  location: 'land_park',  // 🔥 核心字段
  quantityMin: 6,
  patient: '张三'
};
```

### 2. FIFO批次管理 🔥

```javascript
// 自动按有效期排序，先进先出
const batches = await db.collection('stock')
  .where({
    drugId: drugId,
    location: location,
    quantity: _.gt(0)
  })
  .orderBy('expiryDate', 'asc')  // 🔥 FIFO: 先进先出
  .get();

// 出库时自动选择最早批次
const selectedBatch = batches.data[0];
```

### 3. 单位换算系统 🔥

```javascript
// 药品定义
const drug = {
  name: '阿莫西林胶囊',
  specification: '0.25g×24粒',
  packUnit: '盒',           // 包装单位(入库/出库)
  minUnit: '粒',            // 最小单位(门诊/消耗)
  conversionRate: 24        // 换算因子: 1盒=24粒
};

// 门诊登记: 最小单位 → 包装单位
const quantityMin = 6;      // 医生输入: 6粒
const quantityPack = quantityMin / drug.conversionRate;  // 0.25盒
// 扣库存: -0.25盒
```

### 4. 有效期预警系统 🔥

```javascript
// 预警规则 (符合GSP标准)
function expiryStatus(daysToExpiry) {
  if (daysToExpiry <= 0) return '过期';     // 🔴
  if (daysToExpiry <= 60) return '临期';    // 🟠 60天标准
  return '正常';                            // 🟢
}

// 每日自动扫描
// 触发时间: 每日 00:10
// 执行内容:
// 1. 计算所有库存的距有效期天数
// 2. 更新预警状态
// 3. 生成预警记录
// 4. 推送微信通知
```

### 5. 理论库存计算 🔥

```javascript
// v3.2 修订版（新增门诊用药）
theoreticalStock(drugId, batch, location) = 
    Σ 入库数量(该药品, 该批次, 该园区)
  - Σ 出库数量(该药品, 该批次, 该园区)
  - Σ 门诊用药数量(该药品, 该批次, 该园区)  // 🔥 v3.2新增
  + Σ 盘点调整数量(该药品, 该批次, 该园区)
```

---

## 🗄️ 数据库设计要点

### 核心表结构

#### 1. stock (库存表) - 最核心

```javascript
{
  _id: 'STK001',
  drugId: 'DR001',
  drugName: '阿莫西林胶囊',
  specification: '0.25g×24粒',     // 🔥 v3.3必须
  batch: 'BATCH20251101',
  location: 'land_park',           // 🔥 核心维度
  quantity: 32,                    // 当前库存
  unit: '盒',
  expiryDate: '2026-01-15',        // 🔥 v3.3必须
  daysToExpiry: 76,                // 🔥 自动计算
  expiryStatus: '正常',            // 🔥 正常/临期/过期
  price: 15.5,
  updateTime: ISODate()
}

// 🔥 复合唯一索引
db.stock.createIndex(
  { drugId: 1, batch: 1, location: 1 },
  { unique: true }
);
```

#### 2. clinic_usage (门诊登记) - v3.2核心新增

```javascript
{
  _id: 'CU20251101001',
  drugId: 'DR001',
  drugName: '阿莫西林胶囊',
  specification: '0.25g×24粒',     // 🔥 v3.3必须
  batchId: 'BATCH20251101',
  location: 'land_park',           // 🔥 必填，核心字段
  quantityMin: 6,                  // 最小单位
  quantityPack: 0.25,              // 包装单位（自动换算）
  unit: '粒',
  packUnit: '盒',
  operatorId: 'openid_doctor',
  operatorName: '李医生',
  patient: '张三',
  createTime: ISODate()
}

// 🔥 索引
db.clinic_usage.createIndex(
  { location: 1, drugId: 1, createTime: -1 }
);
```

#### 3. statistics (统计数据) - v3.3新增

```javascript
{
  _id: 'STAT20251101_land_park',
  date: '2025-11-01',
  location: 'land_park',
  type: 'daily',
  
  inbound: {
    count: 5,
    totalQuantity: 100,
    totalAmount: 1550
  },
  
  outbound: {
    count: 3,
    totalQuantity: 30
  },
  
  clinic: {                        // 🔥 v3.2新增
    count: 12,
    totalQuantity: 40,
    patientCount: 8
  },
  
  stock: {
    totalValue: 50000,
    drugCount: 150,
    lowStockCount: 5,
    expiryWarningCount: 3
  },
  
  createTime: ISODate()
}
```

### 索引策略

```javascript
// 高频查询索引
db.drugs.createIndex({ name: 1 });
db.drugs.createIndex({ barcode: 1 }, { unique: true });
db.drugs.createIndex({ pinyin: 1 });

db.stock.createIndex({ drugId: 1, batch: 1, location: 1 }, { unique: true });
db.stock.createIndex({ location: 1, drugId: 1 });
db.stock.createIndex({ expiryDate: 1 });
db.stock.createIndex({ daysToExpiry: 1 });

db.clinic_usage.createIndex({ location: 1, drugId: 1, createTime: -1 });
db.clinic_usage.createIndex({ patient: 1 });

db.statistics.createIndex({ date: -1, location: 1 });

// TTL索引（自动清理90天前的日志）
db.operation_logs.createIndex(
  { createTime: 1 },
  { expireAfterSeconds: 7776000 }
);
```

---

## 🚀 部署流程

### 环境准备

```bash
# 1. 安装Node.js (18 LTS)
node -v  # v18.17.0

# 2. 安装云开发CLI
npm install -g @cloudbase/cli

# 3. 登录云开发
tcb login

# 4. 创建云环境
tcb env:create akpms-prod --alias "AK-PMS生产环境"
```

### 部署云函数

```bash
# 进入云函数目录
cd cloudfunctions

# 批量部署
for dir in */; do
  cd "$dir"
  npm install
  tcb fn:deploy --name "${dir%/}" --force
  cd ..
done
```

### 初始化数据库

```bash
# 执行初始化脚本
node scripts/initDatabase.js

# 内容包括:
# 1. 创建11个数据库集合
# 2. 创建索引
# 3. 插入初始数据（用户、配置等）
```

### 配置定时任务

```bash
# 每日统计任务 (每天23:59)
tcb fn:trigger:create dailySummary \
  --name daily-summary-trigger \
  --type timer \
  --config '{"cron":"59 23 * * *"}'

# 效期预警任务 (每天00:10)
tcb fn:trigger:create expiryMonitor \
  --name expiry-monitor-trigger \
  --type timer \
  --config '{"cron":"10 0 * * *"}'
```

### 部署小程序

```bash
# 1. 安装依赖
npm install

# 2. 配置环境ID (在App.vue中)
wx.cloud.init({
  env: 'akpms-prod-xxxxx',
  traceUser: true
});

# 3. 在微信开发者工具中上传代码
# 4. 在微信公众平台提交审核
```

---

## 📊 性能优化策略

### 数据库优化

```javascript
// 1. 使用投影减少数据传输
const drugs = await db.collection('drugs')
  .field({
    name: true,
    specification: true,
    unit: true,
    price: true
  })
  .get();

// 2. 使用聚合管道提高性能
const summary = await db.collection('stock')
  .aggregate()
  .match({ location: 'land_park' })
  .group({
    _id: '$drugId',
    totalQuantity: _.sum('$quantity')
  })
  .end();

// 3. 分页查询
const list = await db.collection('drugs')
  .skip((page - 1) * pageSize)
  .limit(pageSize)
  .get();
```

### 前端优化

```javascript
// 1. 数据缓存（5分钟）
state.drugCache[drugId] = data;
state.cacheExpiry[`drug_${drugId}`] = Date.now() + 300000;

// 2. 图片懒加载
<image lazy-load :src="imageUrl" />

// 3. 列表虚拟滚动
<recycle-list :list="longList" />
```

---

## 🔒 安全机制

### 权限控制

```javascript
// 角色权限矩阵
const ROLE_PERMISSIONS = {
  admin: ['drug.*', 'stock.*', 'inbound.*', 'outbound.*', ...],
  pharmacist: ['drug.view', 'drug.add', 'stock.view', ...],
  doctor: ['clinic.*', 'query.clinic'],
  clerk: ['stock.view', 'outbound.create']
};

// 云函数权限验证
async function checkPermission(openid, action) {
  const user = await db.collection('users')
    .where({ _openid: openid })
    .get();
    
  if (!hasPermission(user.role, action)) {
    throw new Error('权限不足');
  }
}
```

### 数据安全

```javascript
// 1. 操作日志记录
await db.collection('operation_logs').add({
  data: {
    action,
    userId: user._openid,
    ip: context.ip,
    createTime: new Date()
  }
});

// 2. 敏感信息脱敏
function maskString(str) {
  return str.slice(0, 2) + '****' + str.slice(-2);
}

// 3. 数据库权限（在控制台配置）
{
  "read": "auth != null",
  "write": "auth != null && auth.role in ['admin', 'pharmacist']"
}
```

---

## 📚 学习资源

### 官方文档

| 技术 | 文档地址 | 说明 |
|------|---------|------|
| uni-app | https://uniapp.dcloud.io/ | 框架文档 |
| Vue 3 | https://vuejs.org/ | Vue3文档 |
| 微信小程序 | https://developers.weixin.qq.com/miniprogram/dev/framework/ | 小程序文档 |
| 腾讯云开发 | https://cloud.tencent.com/document/product/876 | 云开发文档 |
| MongoDB | https://www.mongodb.com/docs/ | 数据库文档 |
| ECharts | https://echarts.apache.org/handbook/zh/get-started/ | 图表文档 |

### 推荐教程

```
前端:
- uni-app官方视频教程
- Vue3组合式API教程
- 微信小程序云开发实战

后端:
- Node.js异步编程
- MongoDB聚合查询
- Serverless架构实践

综合:
- 药品管理系统最佳实践
- GSP药品质量管理规范
```

---

## 🛠️ 开发规范

### 代码规范

```javascript
// 命名规范
const drugName = 'xxx';          // 变量: camelCase
const MAX_QUANTITY = 100;        // 常量: UPPER_SNAKE_CASE
function getDrugInfo() {}        // 函数: camelCase
class DrugManager {}             // 类: PascalCase

// 文件命名
drug-selector.vue                // 组件: kebab-case
drugManage/index.js              // 云函数: camelCase/index.js
```

### Git提交规范

```bash
feat: 新增门诊用药登记功能
fix: 修复库存扣减bug
docs: 更新技术文档
style: 代码格式调整
refactor: 重构报表查询模块
test: 添加单元测试
chore: 更新依赖版本
```

### 注释规范

```javascript
/**
 * 获取药品库存信息
 * @param {string} drugId - 药品ID
 * @param {string} location - 园区标识
 * @returns {Promise<Object>} 库存信息
 * @throws {AppError} 当药品不存在时抛出错误
 */
async function getStockInfo(drugId, location) {
  // 实现代码
}
```

---

## 📞 技术支持

### 问题排查

| 问题类型 | 排查方向 | 常用工具 |
|---------|---------|---------|
| 云函数报错 | 查看云函数日志 | 云开发控制台 |
| 数据库查询慢 | 检查索引、查看执行计划 | MongoDB Explain |
| 小程序白屏 | 查看控制台错误、网络请求 | 开发者工具 |
| 权限问题 | 检查用户角色、数据库权限 | 用户管理、权限配置 |

### 联系方式

- **技术文档**: 本项目 `/docs` 目录
- **技术支持**: ak-pms-tech@example.com
- **项目地址**: D:\medicine_manager\AK-PMS
- **更新日志**: CHANGELOG.md

---

## 📈 版本更新记录

### v3.3 (2025-11-01) 🔥 最新版

**新增功能**:
- ✅ 5大核心报表（R1-R5）
- ✅ 6项常用查询（Q1-Q6）
- ✅ 所有报表显示药品规格
- ✅ 有效期预警系统（≤60天临期）
- ✅ 盘点报表显示距有效期天数
- ✅ ECharts可视化图表
- ✅ Excel/PDF报表导出
- ✅ 定时任务自动统计

**技术改进**:
- ✅ 新增 `reportService` 云函数
- ✅ 新增 `queryService` 云函数
- ✅ 新增 `dailySummary` 定时任务
- ✅ 新增 `expiryMonitor` 定时任务
- ✅ 新增 `statistics` 数据表
- ✅ 新增 `alerts` 预警表
- ✅ 优化数据库索引

### v3.2 (2025-10-30)

**核心更新**:
- ✅ 门诊用药登记分园区（location字段）
- ✅ 理论库存计算公式修订（新增门诊用药项）
- ✅ 新增 `clinicRecords` 云函数
- ✅ 新增 `clinic_usage` 数据表
- ✅ 数据迁移兼容方案

### v3.1 (2025-10-15)

**功能完善**:
- ✅ 双人复核电子签名
- ✅ FIFO批次管理
- ✅ 单位换算系统
- ✅ 分园区库存管理

---

<div align="center">

**🔧 AK-PMS 开发技术栈总结**  
**Version**: 3.3  
**最后更新**: 2025-11-01

---

### 技术栈速查完成 ✅

**关键技术**:
- 前端: uni-app + Vue3 + Vant + ECharts
- 后端: 腾讯云开发 + Node.js 18 + MongoDB
- 核心: 分园区管理 + FIFO批次 + 单位换算 + 效期预警

**文档系列**:
- 📘 功能与管理文档 (`AK-PMS_v3.3_功能与管理文档.md`)
- ⚙️ 技术栈与实现说明 (`AK-PMS_v3.3_技术栈与实现说明.md`)
- 🔧 开发技术栈总结 (本文档)

---

**感谢使用 AK-PMS！**

</div>


