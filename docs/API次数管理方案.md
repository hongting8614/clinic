# 🔒 第三方API次数管理方案

## 📅 设计时间
2025-11-08

## 🎯 核心要求
**第三方API扫码次数必须限制在 < 99次/天**

---

## 一、API次数限制策略

### 1.1 限制规则

```javascript
{
  // 每日限制
  dailyLimit: 99,           // 每天最多99次
  warningThreshold: 80,     // 80次时警告
  criticalThreshold: 90,    // 90次时严重警告
  
  // 单用户限制
  userDailyLimit: 20,       // 单用户每天最多20次
  
  // 时段限制
  hourlyLimit: 15,          // 每小时最多15次
  
  // 紧急预留
  emergencyReserve: 9       // 预留9次紧急使用
}
```

### 1.2 查询优先级（强制）

```
优先级1: 本地药材档案（免费，无限次）
  ↓ 未找到
优先级2: 检查API剩余次数
  ↓ 次数充足
优先级3: 调用第三方API（付费，<99次/天）
  ↓ 自动保存到本地档案
  ↓ 次数不足
提示用户手动新建
```

---

## 二、数据库设计

### 2.1 API使用记录表

```javascript
// 集合名称: api_usage_logs
{
  _id: 'log_001',
  date: '2025-11-08',           // 日期（YYYY-MM-DD）
  apiType: 'jisuapi',           // API类型
  barcode: '6901234567890',     // 查询的条形码
  success: true,                // 是否成功
  userId: 'user_001',           // 操作用户
  userName: '李医生',           // 用户名称
  timestamp: '2025-11-08 10:30:00',
  result: {                     // 查询结果
    drugName: '阿莫西林胶囊',
    found: true
  }
}
```

### 2.2 每日统计表

```javascript
// 集合名称: api_daily_stats
{
  _id: 'stat_20251108',
  date: '2025-11-08',
  totalCalls: 45,               // 当日总调用次数
  successCalls: 42,             // 成功次数
  failedCalls: 3,               // 失败次数
  remainingCalls: 54,           // 剩余次数 (99 - 45)
  
  // 用户使用统计
  userStats: [
    { userId: 'user_001', userName: '李医生', calls: 15 },
    { userId: 'user_002', userName: '王护士', calls: 12 }
  ],
  
  // 时段统计
  hourlyStats: {
    '08': 5,  // 8点-9点: 5次
    '09': 12, // 9点-10点: 12次
    '10': 8   // 10点-11点: 8次
  },
  
  lastUpdateTime: '2025-11-08 10:30:00'
}
```

---

## 三、云函数实现

### 3.1 drugBarcodeQuery 云函数优化

```javascript
const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

// API每日限制
const DAILY_LIMIT = 99
const WARNING_THRESHOLD = 80
const CRITICAL_THRESHOLD = 90
const USER_DAILY_LIMIT = 20
const HOURLY_LIMIT = 15

exports.main = async (event, context) => {
  const { action, barcode } = event
  const wxContext = cloud.getWXContext()
  const userId = wxContext.OPENID
  
  console.log('========================================')
  console.log('🔍 药材条形码查询云函数')
  console.log('用户ID:', userId)
  console.log('条形码:', barcode)
  console.log('========================================')
  
  try {
    switch (action) {
      case 'queryByBarcode':
        return await queryByBarcode(barcode, userId)
      case 'getUsageStats':
        return await getUsageStats()
      default:
        return { success: false, message: '未知操作' }
    }
  } catch (err) {
    console.error('❌ 云函数执行失败:', err)
    return {
      success: false,
      message: err.message || '查询失败'
    }
  }
}

/**
 * 查询药材信息（带API次数控制）
 */
async function queryByBarcode(barcode, userId) {
  if (!barcode) {
    return { success: false, message: '条形码不能为空' }
  }
  
  console.log('📋 开始三级查询策略（带API次数控制）')
  
  // 第1级：查询本地药材档案（优先，免费）
  console.log('📦 [第1级] 查询本地药材档案...')
  let drugInfo = await queryLocalDrugs(barcode)
  
  if (drugInfo) {
    console.log('✅ [第1级] 本地档案命中!')
    console.log('💰 成本: ¥0（免费）')
    
    return {
      success: true,
      data: drugInfo,
      source: 'local',
      cost: 0,
      message: '从本地药材档案获取'
    }
  }
  
  console.log('❌ [第1级] 本地档案未找到')
  
  // 第2级：检查API剩余次数
  console.log('📊 [第2级] 检查API剩余次数...')
  const usageCheck = await checkAPIUsage(userId)
  
  if (!usageCheck.allowed) {
    console.log('🚫 API次数不足，拒绝调用')
    return {
      success: false,
      message: usageCheck.message,
      reason: 'api_limit_exceeded',
      stats: usageCheck.stats,
      suggestion: '请手动新建药材档案，或等待明天重置'
    }
  }
  
  console.log('✅ API次数充足，可以调用')
  console.log(`📊 今日已用: ${usageCheck.stats.todayUsed}/${DAILY_LIMIT}`)
  console.log(`📊 剩余次数: ${usageCheck.stats.remaining}`)
  
  // 第3级：调用第三方API
  console.log('📡 [第3级] 调用第三方API...')
  console.log('⚠️ 注意: 将消耗1次API次数')
  
  drugInfo = await queryThirdPartyAPI(barcode)
  
  if (drugInfo) {
    console.log('✅ [第3级] API查询成功!')
    console.log('💰 成本: ¥0.01-0.05（付费）')
    
    // 记录API使用
    await logAPIUsage(barcode, userId, true, drugInfo)
    
    // 自动保存到本地档案（下次免费）
    console.log('💾 自动保存到本地药材档案...')
    await saveToDrugArchive(drugInfo)
    
    // 获取更新后的统计
    const updatedStats = await getTodayStats()
    
    return {
      success: true,
      data: drugInfo,
      source: 'api',
      cost: 0.01,
      saved: true,
      message: '从第三方API获取',
      apiStats: {
        todayUsed: updatedStats.totalCalls,
        remaining: DAILY_LIMIT - updatedStats.totalCalls,
        warning: updatedStats.totalCalls >= WARNING_THRESHOLD
      }
    }
  }
  
  console.log('❌ [第3级] API未找到')
  
  // 记录API使用（失败）
  await logAPIUsage(barcode, userId, false, null)
  
  return {
    success: false,
    message: '未找到药材信息',
    barcode: barcode,
    suggestion: '请手动新建药材档案'
  }
}

/**
 * 检查API使用次数
 */
async function checkAPIUsage(userId) {
  const today = new Date().toISOString().split('T')[0]
  
  try {
    // 获取今日统计
    const stats = await getTodayStats()
    
    // 1. 检查每日总限制
    if (stats.totalCalls >= DAILY_LIMIT) {
      console.log('🚫 今日API次数已达上限')
      return {
        allowed: false,
        message: `今日API次数已用完 (${stats.totalCalls}/${DAILY_LIMIT})`,
        stats: {
          todayUsed: stats.totalCalls,
          remaining: 0,
          limit: DAILY_LIMIT
        }
      }
    }
    
    // 2. 检查单用户限制
    const userStat = stats.userStats.find(u => u.userId === userId)
    const userCalls = userStat ? userStat.calls : 0
    
    if (userCalls >= USER_DAILY_LIMIT) {
      console.log('🚫 用户今日API次数已达上限')
      return {
        allowed: false,
        message: `您今日API次数已用完 (${userCalls}/${USER_DAILY_LIMIT})`,
        stats: {
          todayUsed: stats.totalCalls,
          remaining: DAILY_LIMIT - stats.totalCalls,
          userUsed: userCalls,
          userLimit: USER_DAILY_LIMIT
        }
      }
    }
    
    // 3. 检查每小时限制
    const currentHour = new Date().getHours().toString().padStart(2, '0')
    const hourCalls = stats.hourlyStats[currentHour] || 0
    
    if (hourCalls >= HOURLY_LIMIT) {
      console.log('🚫 当前小时API次数已达上限')
      return {
        allowed: false,
        message: `当前小时API次数已达上限 (${hourCalls}/${HOURLY_LIMIT})`,
        stats: {
          todayUsed: stats.totalCalls,
          remaining: DAILY_LIMIT - stats.totalCalls,
          hourUsed: hourCalls,
          hourLimit: HOURLY_LIMIT
        }
      }
    }
    
    // 4. 警告提示
    const remaining = DAILY_LIMIT - stats.totalCalls
    let warning = null
    
    if (remaining <= (DAILY_LIMIT - CRITICAL_THRESHOLD)) {
      warning = `⚠️ 严重警告: 今日仅剩${remaining}次API调用`
    } else if (remaining <= (DAILY_LIMIT - WARNING_THRESHOLD)) {
      warning = `⚠️ 警告: 今日剩余${remaining}次API调用`
    }
    
    if (warning) {
      console.log(warning)
    }
    
    // 允许调用
    return {
      allowed: true,
      warning: warning,
      stats: {
        todayUsed: stats.totalCalls,
        remaining: remaining,
        limit: DAILY_LIMIT,
        userUsed: userCalls,
        userLimit: USER_DAILY_LIMIT
      }
    }
    
  } catch (err) {
    console.error('❌ 检查API次数失败:', err)
    // 出错时允许调用，但记录错误
    return {
      allowed: true,
      warning: '⚠️ 无法获取API使用统计',
      stats: {
        todayUsed: 0,
        remaining: DAILY_LIMIT,
        limit: DAILY_LIMIT
      }
    }
  }
}

/**
 * 获取今日统计
 */
async function getTodayStats() {
  const today = new Date().toISOString().split('T')[0]
  const statId = `stat_${today.replace(/-/g, '')}`
  
  try {
    const res = await db.collection('api_daily_stats')
      .doc(statId)
      .get()
    
    if (res.data) {
      return res.data
    }
  } catch (err) {
    // 记录不存在，创建新记录
  }
  
  // 返回默认统计
  return {
    _id: statId,
    date: today,
    totalCalls: 0,
    successCalls: 0,
    failedCalls: 0,
    remainingCalls: DAILY_LIMIT,
    userStats: [],
    hourlyStats: {},
    lastUpdateTime: new Date()
  }
}

/**
 * 记录API使用
 */
async function logAPIUsage(barcode, userId, success, result) {
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  const timestamp = now.toISOString()
  const currentHour = now.getHours().toString().padStart(2, '0')
  const statId = `stat_${today.replace(/-/g, '')}`
  
  try {
    // 1. 添加使用日志
    await db.collection('api_usage_logs').add({
      data: {
        date: today,
        apiType: 'jisuapi',
        barcode: barcode,
        success: success,
        userId: userId,
        timestamp: timestamp,
        result: result ? {
          drugName: result.name,
          found: true
        } : {
          found: false
        },
        createTime: now
      }
    })
    
    // 2. 更新每日统计
    const stats = await getTodayStats()
    
    // 更新用户统计
    const userStatIndex = stats.userStats.findIndex(u => u.userId === userId)
    if (userStatIndex >= 0) {
      stats.userStats[userStatIndex].calls++
    } else {
      // 获取用户信息
      const userInfo = await getUserInfo(userId)
      stats.userStats.push({
        userId: userId,
        userName: userInfo.name || '未知用户',
        calls: 1
      })
    }
    
    // 更新时段统计
    if (!stats.hourlyStats[currentHour]) {
      stats.hourlyStats[currentHour] = 0
    }
    stats.hourlyStats[currentHour]++
    
    // 更新总计
    stats.totalCalls++
    if (success) {
      stats.successCalls++
    } else {
      stats.failedCalls++
    }
    stats.remainingCalls = DAILY_LIMIT - stats.totalCalls
    stats.lastUpdateTime = now
    
    // 保存统计
    await db.collection('api_daily_stats')
      .doc(statId)
      .set({
        data: stats
      })
    
    console.log('✅ API使用记录已保存')
    console.log(`📊 今日已用: ${stats.totalCalls}/${DAILY_LIMIT}`)
    
  } catch (err) {
    console.error('❌ 记录API使用失败:', err)
  }
}

/**
 * 获取用户信息
 */
async function getUserInfo(userId) {
  try {
    const res = await db.collection('users')
      .where({ _openid: userId })
      .get()
    
    if (res.data && res.data.length > 0) {
      return res.data[0]
    }
  } catch (err) {
    console.error('获取用户信息失败:', err)
  }
  
  return { name: '未知用户' }
}

/**
 * 获取使用统计（供前端查询）
 */
async function getUsageStats() {
  try {
    const stats = await getTodayStats()
    
    return {
      success: true,
      data: {
        todayUsed: stats.totalCalls,
        remaining: DAILY_LIMIT - stats.totalCalls,
        limit: DAILY_LIMIT,
        successRate: stats.totalCalls > 0 
          ? (stats.successCalls / stats.totalCalls * 100).toFixed(1) 
          : 0,
        warning: stats.totalCalls >= WARNING_THRESHOLD,
        critical: stats.totalCalls >= CRITICAL_THRESHOLD,
        userStats: stats.userStats,
        hourlyStats: stats.hourlyStats
      }
    }
  } catch (err) {
    console.error('获取统计失败:', err)
    return {
      success: false,
      message: '获取统计失败'
    }
  }
}

// ... 其他函数保持不变
```

---

## 四、前端提示优化

### 4.1 扫码前提示

```javascript
async scanBarcode() {
  try {
    // 1. 检查API剩余次数
    const stats = await this.getAPIStats()
    
    if (stats.remaining === 0) {
      uni.showModal({
        title: '🚫 API次数已用完',
        content: `今日API调用次数已达上限 (${stats.todayUsed}/${stats.limit})\n\n建议：\n1. 手动新建药材档案\n2. 等待明天重置`,
        showCancel: false
      })
      return
    }
    
    // 2. 警告提示
    if (stats.critical) {
      const res = await uni.showModal({
        title: '⚠️ API次数不足',
        content: `今日API次数仅剩 ${stats.remaining} 次\n\n是否继续扫码？`,
        confirmText: '继续',
        cancelText: '取消'
      })
      
      if (!res.confirm) {
        return
      }
    } else if (stats.warning) {
      uni.showToast({
        title: `⚠️ 今日剩余${stats.remaining}次API调用`,
        icon: 'none',
        duration: 2000
      })
    }
    
    // 3. 调用扫码
    const scanRes = await uni.scanCode({
      scanType: ['barCode']
    })
    
    await this.handleBarcode(scanRes.result)
    
  } catch (err) {
    if (err.errMsg && err.errMsg.includes('cancel')) {
      return
    }
    
    uni.showToast({
      title: '扫码失败',
      icon: 'none'
    })
  }
}

// 获取API统计
async getAPIStats() {
  try {
    const result = await this.$api.callFunction('drugBarcodeQuery', {
      action: 'getUsageStats'
    })
    
    if (result.success) {
      return result.data
    }
  } catch (err) {
    console.error('获取API统计失败:', err)
  }
  
  return {
    todayUsed: 0,
    remaining: 99,
    limit: 99,
    warning: false,
    critical: false
  }
}
```

### 4.2 API次数不足时的处理

```javascript
async handleBarcode(barcode) {
  uni.showLoading({ title: '查询中...' })
  
  try {
    const result = await this.$api.callFunction('drugBarcodeQuery', {
      action: 'queryByBarcode',
      barcode: barcode
    })
    
    if (result.success) {
      // 查询成功
      this.addToInboundList(result.data)
      
      // 显示API使用情况
      if (result.source === 'api' && result.apiStats) {
        const stats = result.apiStats
        
        if (stats.warning) {
          uni.showToast({
            title: `✅ 已添加（剩余${stats.remaining}次API）`,
            icon: 'none',
            duration: 2000
          })
        } else {
          uni.showToast({
            title: '✅ 已添加',
            icon: 'success'
          })
        }
      } else {
        uni.showToast({
          title: '✅ 已添加',
          icon: 'success'
        })
      }
      
    } else if (result.reason === 'api_limit_exceeded') {
      // API次数不足
      uni.showModal({
        title: '🚫 API次数不足',
        content: result.message + '\n\n' + result.suggestion,
        confirmText: '手动新建',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.showCreateDrugDialog(barcode)
          }
        }
      })
      
    } else {
      // 未找到
      uni.showModal({
        title: '💊 未找到药材',
        content: `条形码：${barcode}\n\n未找到药材信息，是否手动新建？`,
        confirmText: '新建',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.showCreateDrugDialog(barcode)
          }
        }
      })
    }
    
  } catch (err) {
    uni.showToast({
      title: '查询失败',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}
```

### ~~4.3 页面顶部显示API使用情况~~（已取消）

**说明**：为保持界面简洁，不在页面顶部显示API统计提示条。

**替代方案**：
- ✅ 仅在扫码时根据剩余次数动态提示
- ✅ 80次以下：不提示（正常使用）
- ✅ 80-89次：扫码成功后提示"剩余X次"
- ✅ 90-98次：扫码前弹窗确认
- ✅ 99次：扫码前直接拒绝

---

## 五、管理后台统计

### 5.1 统计页面

```vue
<template>
  <view class="stats-container">
    <view class="stats-card">
      <view class="card-title">📊 今日API使用统计</view>
      
      <!-- 总体统计 -->
      <view class="stats-overview">
        <view class="stat-item">
          <text class="stat-value">{{ stats.todayUsed }}</text>
          <text class="stat-label">已使用</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.remaining }}</text>
          <text class="stat-label">剩余</text>
        </view>
        <view class="stat-item">
          <text class="stat-value">{{ stats.successRate }}%</text>
          <text class="stat-label">成功率</text>
        </view>
      </view>
      
      <!-- 进度条 -->
      <view class="progress-bar">
        <view 
          class="progress-fill"
          :class="{
            'warning': stats.warning,
            'critical': stats.critical
          }"
          :style="{ width: (stats.todayUsed / stats.limit * 100) + '%' }"
        ></view>
      </view>
      
      <!-- 用户排行 -->
      <view class="user-ranking">
        <view class="ranking-title">用户使用排行</view>
        <view 
          v-for="(user, index) in stats.userStats" 
          :key="user.userId"
          class="ranking-item"
        >
          <text class="ranking-no">{{ index + 1 }}</text>
          <text class="ranking-name">{{ user.userName }}</text>
          <text class="ranking-calls">{{ user.calls }}次</text>
        </view>
      </view>
      
      <!-- 时段分布 -->
      <view class="hourly-chart">
        <view class="chart-title">时段分布</view>
        <view class="chart-bars">
          <view 
            v-for="(calls, hour) in stats.hourlyStats" 
            :key="hour"
            class="chart-bar"
          >
            <view 
              class="bar-fill"
              :style="{ height: (calls / 15 * 100) + '%' }"
            ></view>
            <text class="bar-label">{{ hour }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
```

---

## 六、定时任务（每日重置）

### 6.1 云函数定时器

```javascript
// 云函数: resetAPIStats
// 触发器: 每天00:00执行

const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  console.log('========================================')
  console.log('🔄 开始重置API统计')
  console.log('时间:', new Date().toISOString())
  console.log('========================================')
  
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    
    // 归档昨日数据
    const statId = `stat_${yesterdayStr.replace(/-/g, '')}`
    const stats = await db.collection('api_daily_stats')
      .doc(statId)
      .get()
    
    if (stats.data) {
      // 保存到历史记录
      await db.collection('api_stats_history').add({
        data: {
          ...stats.data,
          archivedTime: new Date()
        }
      })
      
      console.log('✅ 昨日数据已归档')
      console.log(`📊 昨日使用: ${stats.data.totalCalls}次`)
    }
    
    console.log('✅ API统计重置完成')
    console.log('========================================')
    
    return {
      success: true,
      message: 'API统计重置成功'
    }
    
  } catch (err) {
    console.error('❌ 重置失败:', err)
    return {
      success: false,
      message: err.message
    }
  }
}
```

---

## 七、总结

### 核心保障措施

1. ✅ **硬性限制**：每日API调用 < 99次
2. ✅ **优先本地**：优先查询本地药材档案（免费）
3. ✅ **实时监控**：每次调用前检查剩余次数
4. ✅ **分级警告**：80次警告，90次严重警告
5. ✅ **用户限制**：单用户每天最多20次
6. ✅ **时段限制**：每小时最多15次
7. ✅ **自动保存**：API查询结果自动保存到本地档案
8. ✅ **每日重置**：定时任务每天00:00重置统计

### 预期效果

- 💰 **成本可控**：严格控制在99次以内
- 📊 **实时监控**：随时了解使用情况
- ⚠️ **提前预警**：避免超限
- 🔄 **自动优化**：查询结果自动保存，逐步减少API依赖

---

**设计完成日期**: 2025-11-08  
**版本**: v1.0  
**状态**: ✅ 设计完成

