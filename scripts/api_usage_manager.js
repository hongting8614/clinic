// API使用情况管理脚本
// 在小程序开发工具控制台运行

const db = wx.cloud.database()

// 1. 查看当前API使用情况
async function checkAPIUsage() {
  console.log('========================================')
  console.log('📊 API使用情况查询')
  console.log('========================================')
  
  const res = await db.collection('api_usage')
    .where({ apiName: 'jisu_barcode' })
    .get()
  
  if (res.data && res.data.length > 0) {
    const usage = res.data[0]
    console.log('API名称:', usage.apiName)
    console.log('已使用:', usage.count, '次')
    console.log('限制:', usage.limit, '次')
    console.log('剩余:', (usage.limit - usage.count), '次')
    console.log('最后更新:', new Date(usage.lastUpdate).toLocaleString())
    console.log('')
    
    // 显示百分比
    const percentage = ((usage.count / usage.limit) * 100).toFixed(1)
    console.log(`使用率: ${percentage}%`)
    
    // 警告提示
    if (usage.count >= 99) {
      console.log('⚠️ 警告: 已达到使用上限，API已自动停用')
    } else if (usage.count >= 80) {
      console.log('⚠️ 警告: 使用量已超过80%，请注意')
    } else if (usage.count >= 50) {
      console.log('💡 提示: 使用量已超过50%')
    }
  } else {
    console.log('ℹ️ 尚未开始使用API')
  }
  
  console.log('========================================')
}

// 2. 重置API使用次数（谨慎操作！）
async function resetAPIUsage() {
  console.log('========================================')
  console.log('⚠️ 重置API使用次数')
  console.log('========================================')
  
  const confirm = await new Promise(resolve => {
    wx.showModal({
      title: '确认重置',
      content: '确定要重置API使用次数吗？\n\n这将允许再次调用API，可能产生费用！',
      confirmText: '确认重置',
      cancelText: '取消',
      success: res => resolve(res.confirm)
    })
  })
  
  if (!confirm) {
    console.log('❌ 操作已取消')
    return
  }
  
  const res = await db.collection('api_usage')
    .where({ apiName: 'jisu_barcode' })
    .get()
  
  if (res.data && res.data.length > 0) {
    await db.collection('api_usage')
      .doc(res.data[0]._id)
      .update({
        data: {
          count: 0,
          lastUpdate: db.serverDate()
        }
      })
    
    console.log('✅ API使用次数已重置为0')
  }
  
  console.log('========================================')
}

// 3. 查看API调用历史（需要先记录）
async function viewAPIHistory() {
  console.log('========================================')
  console.log('📋 API调用历史')
  console.log('========================================')
  
  // 查看最近通过API获取的药材
  const res = await db.collection('barcode_cache')
    .where({ source: 'jisu_api' })
    .orderBy('createTime', 'desc')
    .limit(20)
    .get()
  
  console.log(`找到 ${res.data.length} 条API查询记录：\n`)
  
  res.data.forEach((item, index) => {
    console.log(`${index + 1}. ${item.drugName}`)
    console.log(`   条形码: ${item.barcode}`)
    console.log(`   规格: ${item.specification}`)
    console.log(`   时间: ${new Date(item.createTime).toLocaleString()}`)
    console.log('')
  })
  
  console.log('========================================')
}

// 4. 设置警告阈值
async function setWarningThreshold(threshold = 80) {
  console.log('========================================')
  console.log('⚙️ 设置警告阈值')
  console.log('========================================')
  
  const res = await db.collection('api_usage')
    .where({ apiName: 'jisu_barcode' })
    .get()
  
  if (res.data && res.data.length > 0) {
    await db.collection('api_usage')
      .doc(res.data[0]._id)
      .update({
        data: {
          warningThreshold: threshold
        }
      })
    
    console.log(`✅ 警告阈值已设置为: ${threshold}%`)
    console.log(`   当使用量超过 ${threshold}% 时会显示警告`)
  }
  
  console.log('========================================')
}

// 5. 导出使用报告
async function exportUsageReport() {
  console.log('========================================')
  console.log('📊 API使用报告')
  console.log('========================================')
  
  const usage = await db.collection('api_usage')
    .where({ apiName: 'jisu_barcode' })
    .get()
  
  const history = await db.collection('barcode_cache')
    .where({ source: 'jisu_api' })
    .count()
  
  const report = {
    reportDate: new Date().toLocaleString(),
    apiName: '极速数据 - 条形码查询',
    usage: usage.data[0] || {},
    successCount: history.total,
    successRate: usage.data[0] ? ((history.total / usage.data[0].count) * 100).toFixed(1) + '%' : 'N/A'
  }
  
  console.log('报告生成时间:', report.reportDate)
  console.log('')
  console.log('API信息:')
  console.log('  名称:', report.apiName)
  console.log('  已调用:', report.usage.count || 0, '次')
  console.log('  成功:', report.successCount, '次')
  console.log('  成功率:', report.successRate)
  console.log('  剩余次数:', (99 - (report.usage.count || 0)), '次')
  console.log('')
  console.log('========================================')
  
  return report
}

// 快捷命令
console.log('========================================')
console.log('📋 API使用情况管理工具')
console.log('========================================')
console.log('可用命令：')
console.log('  1. checkAPIUsage()      - 查看使用情况')
console.log('  2. resetAPIUsage()      - 重置使用次数')
console.log('  3. viewAPIHistory()     - 查看调用历史')
console.log('  4. exportUsageReport()  - 导出使用报告')
console.log('========================================')
console.log('')
console.log('示例：在控制台输入')
console.log('  checkAPIUsage()')
console.log('')
