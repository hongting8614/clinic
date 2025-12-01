const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ 
  env: cloud.DYNAMIC_CURRENT_ENV 
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action, barcode, drugName, specification, unit } = event
  const startTime = Date.now()
  
  console.log('========================================')
  console.log('🔍 药材条形码查询云函数')
  console.log('操作:', action)
  console.log('条形码:', barcode)
  console.log('药材名称:', drugName || '-')
  console.log('时间:', new Date().toISOString())
  console.log('========================================')
  
  try {
    let result
    
    // 只支持条形码查询
    if (action === 'queryByBarcode') {
      result = await queryByBarcode(barcode)
    } else {
      result = { success: false, message: `未知操作: ${action}` }
    }
    
    const duration = Date.now() - startTime
    console.log('========================================')
    console.log('✅ 查询完成')
    console.log('耗时:', duration + 'ms')
    console.log('结果:', result.success ? '成功' : '失败')
    if (result.source) {
      console.log('数据来源:', result.source)
    }
    console.log('========================================')
    
    return result
  } catch (err) {
    const duration = Date.now() - startTime
    console.error('========================================')
    console.error('❌ 云函数执行失败')
    console.error('耗时:', duration + 'ms')
    console.error('错误类型:', err.name)
    console.error('错误信息:', err.message)
    console.error('错误堆栈:', err.stack)
    console.error('========================================')
    
    return {
      success: false,
      message: err.message || '查询失败',
      error: {
        type: err.name,
        message: err.message
      }
    }
  }
}

/**
 * 查询药材信息（三级查询策略）
 */
async function queryByBarcode(barcode) {
  if (!barcode) {
    console.warn('⚠️ 条形码为空')
    return { success: false, message: '条形码不能为空' }
  }
  
  console.log('📋 开始三级查询策略')
  console.log('条形码:', barcode)
  
  // 第一级：查询本地药材档案
  console.log('🔍 [第1级] 查询本地药材档案...')
  let drugInfo = await queryLocalDrugs(barcode)
  if (drugInfo) {
    console.log('✅ [第1级] 本地药材档案命中!')
    console.log('药材名称:', drugInfo.name)
    return {
      success: true,
      data: drugInfo,
      source: 'local',
      message: '从本地药材档案获取'
    }
  }
  console.log('❌ [第1级] 本地药材档案未找到')
  
  // 第二级：查询缓存数据库
  console.log('🔍 [第2级] 查询缓存数据库...')
  drugInfo = await queryCache(barcode)
  if (drugInfo) {
    console.log('✅ [第2级] 缓存数据命中!')
    console.log('药材名称:', drugInfo.name)
    return {
      success: true,
      data: drugInfo,
      source: 'cache',
      message: '从缓存数据库获取'
    }
  }
  console.log('❌ [第2级] 缓存数据库未找到')
  
  // 第三级：条形码映射表（含完整药材信息）
  console.log('🔍 [第3级] 查询条形码映射表...')
  const mapping = await queryBarcodeMapping(barcode)
  if (mapping) {
    console.log('✅ [第3级] 映射表命中!')
    console.log('药材名称:', mapping.drugName)
    
    return {
      success: true,
      data: {
        name: mapping.drugName,
        specification: mapping.specification || '',
        unit: mapping.unit || '盒',
        manufacturer: mapping.manufacturer || '',
        barcode: barcode,
        isPrescription: mapping.isPrescription || false,
        prescriptionType: mapping.prescriptionType || '非处方药',
        approvalNumber: mapping.approvalNumber || ''
      },
      source: 'mapping',
      message: '从条形码映射表获取'
    }
  }
  console.log('❌ [第3级] 映射表未找到')
  
  // 未找到，提示用户首次录入
  console.log('💡 未找到药材信息，需要首次录入')
  console.log('📋 建议用户：')
  console.log('   1. 从已有药材中选择')
  console.log('   2. 输入药材名称查询NMPA')
  console.log('   3. 手动新建药材档案')
  
  return {
    success: false,
    message: '未找到药材信息',
    barcode: barcode,
    suggestion: '请手动填写药材信息，填写后将自动保存到系统'
  }
}

/**
 * 查询本地药材档案
 */
async function queryLocalDrugs(barcode) {
  try {
    const res = await db.collection('drugs')
      .where({ barcode: barcode })
      .get()
    
    if (res.data && res.data.length > 0) {
      const drug = res.data[0]
      return {
        name: drug.drugName || drug.name,
        specification: drug.specification || drug.spec,
        unit: drug.packUnit || drug.unit || '盒',
        manufacturer: drug.manufacturer || '',
        barcode: drug.barcode,
        category: drug.category || '',
        _id: drug._id
      }
    }
    
    return null
  } catch (err) {
    console.error('查询本地药材失败:', err)
    return null
  }
}

/**
 * 查询缓存数据库
 */
async function queryCache(barcode) {
  try {
    const res = await db.collection('drug_barcode_cache')
      .where({ barcode: barcode })
      .get()
    
    if (res.data && res.data.length > 0) {
      const cache = res.data[0]
      
      // 检查缓存是否过期（30天）
      const cacheTime = new Date(cache.cacheTime)
      const now = new Date()
      const daysDiff = (now - cacheTime) / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 30) {
        // 更新查询次数
        await db.collection('drug_barcode_cache')
          .doc(cache._id)
          .update({
            data: {
              queryCount: db.command.inc(1),
              lastQueryTime: new Date()
            }
          })
        
        return cache.drugInfo
      } else {
        // 缓存过期，删除
        await db.collection('drug_barcode_cache').doc(cache._id).remove()
        return null
      }
    }
    
    return null
  } catch (err) {
    console.error('查询缓存失败:', err)
    return null
  }
}

/**
 * 保存到缓存数据库
 */
async function saveToCache(drugInfo) {
  try {
    await db.collection('drug_barcode_cache').add({
      data: {
        barcode: drugInfo.barcode,
        drugInfo: drugInfo,
        queryCount: 1,
        source: 'gs1',
        cacheTime: new Date(),
        lastQueryTime: new Date(),
        createTime: new Date()
      }
    })
    console.log('✅ 已保存到缓存数据库')
  } catch (err) {
    console.error('保存缓存失败:', err.message)
  }
}

/**
 * 智能解析单位
 */
function parseUnit(specification) {
  if (!specification) return '盒'
  
  const patterns = [
    { regex: /\/([盒瓶支袋包片粒])/, index: 1 },
    { regex: /×\d+[片粒]\/([盒瓶])/, index: 1 },
    { regex: /(\d+ml|\d+g)\/瓶/, unit: '瓶' },
    { regex: /(\d+片|\d+粒)\/盒/, unit: '盒' }
  ]
  
  for (let pattern of patterns) {
    if (pattern.index) {
      const match = specification.match(pattern.regex)
      if (match) return match[pattern.index]
    } else if (pattern.unit) {
      if (pattern.regex.test(specification)) return pattern.unit
    }
  }
  
  return '盒'
}

// NMPA查询相关代码已删除，使用纯本地方案

/**
 * 查询条形码映射表
 */
async function queryBarcodeMapping(barcode) {
  try {
    const res = await db.collection('barcode_mapping')
      .where({ barcode: barcode })
      .get()
    
    if (res.data && res.data.length > 0) {
      return res.data[0]
    }
    return null
  } catch (err) {
    console.error('查询映射表失败:', err.message)
    return null
  }
}

/**
 * 创建条形码映射
 */
async function createBarcodeMapping(barcode, drugInfo) {
  try {
    await db.collection('barcode_mapping').add({
      data: {
        barcode: barcode,
        drugName: drugInfo.name,
        specification: drugInfo.specification || '',
        unit: drugInfo.unit || '盒',
        manufacturer: drugInfo.manufacturer || '',
        approvalNumber: drugInfo.approvalNumber || '',
        isPrescription: drugInfo.isPrescription || false,
        prescriptionType: drugInfo.prescriptionType || '非处方药',
        source: 'manual',  // 手动录入
        createTime: db.serverDate()
      }
    })
    console.log('✅ 条形码映射创建成功')
    return true
  } catch (err) {
    console.error('创建映射失败:', err.message)
    return false
  }
}
