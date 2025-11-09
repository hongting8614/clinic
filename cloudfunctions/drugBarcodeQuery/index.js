const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ 
  env: cloud.DYNAMIC_CURRENT_ENV 
})

const db = cloud.database()

exports.main = async (event, context) => {
  const { action, barcode } = event
  const startTime = Date.now()
  
  console.log('========================================')
  console.log('🔍 药品条形码查询云函数')
  console.log('操作:', action)
  console.log('条形码:', barcode)
  console.log('时间:', new Date().toISOString())
  console.log('========================================')
  
  try {
    let result
    
    switch (action) {
      case 'queryByBarcode':
        result = await queryByBarcode(barcode)
        break
      default:
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
 * 查询药品信息（三级查询策略）
 */
async function queryByBarcode(barcode) {
  if (!barcode) {
    console.warn('⚠️ 条形码为空')
    return { success: false, message: '条形码不能为空' }
  }
  
  console.log('📋 开始三级查询策略')
  console.log('条形码:', barcode)
  
  // 第一级：查询本地药品档案
  console.log('🔍 [第1级] 查询本地药品档案...')
  let drugInfo = await queryLocalDrugs(barcode)
  if (drugInfo) {
    console.log('✅ [第1级] 本地药品档案命中!')
    console.log('药品名称:', drugInfo.name)
    return {
      success: true,
      data: drugInfo,
      source: 'local',
      message: '从本地药品档案获取'
    }
  }
  console.log('❌ [第1级] 本地药品档案未找到')
  
  // 第二级：查询缓存数据库
  console.log('🔍 [第2级] 查询缓存数据库...')
  drugInfo = await queryCache(barcode)
  if (drugInfo) {
    console.log('✅ [第2级] 缓存数据命中!')
    console.log('药品名称:', drugInfo.name)
    return {
      success: true,
      data: drugInfo,
      source: 'cache',
      message: '从缓存数据库获取'
    }
  }
  console.log('❌ [第2级] 缓存数据库未找到')
  
  // 第三级：调用第三方API
  console.log('🔍 [第3级] 调用第三方API...')
  drugInfo = await queryGS1China(barcode)
  if (drugInfo) {
    console.log('✅ [第3级] 第三方API查询成功!')
    console.log('药品名称:', drugInfo.name)
    console.log('数据来源:', drugInfo.apiSource || 'unknown')
    
    // 保存到缓存数据库
    console.log('💾 保存到缓存数据库...')
    await saveToCache(drugInfo)
    
    return {
      success: true,
      data: drugInfo,
      source: 'gs1',
      message: '从第三方API获取'
    }
  }
  console.log('❌ [第3级] 第三方API未找到')
  
  // 未找到，返回失败
  console.log('⚠️ 三级查询全部失败，未找到药品信息')
  console.log('建议: 用户需要手动填写药品信息')
  
  return {
    success: false,
    message: '未找到药品信息',
    barcode: barcode,
    suggestion: '请手动填写药品信息，填写后将自动保存到系统'
  }
}

/**
 * 查询本地药品档案
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
    console.error('查询本地药品失败:', err)
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
 * 查询中国物品编码中心API（GS1中国）
 * 注：由于GS1中国没有公开免费API，这里提供多个备选方案
 */
async function queryGS1China(barcode) {
  try {
    // 方案1：阿里云市场 - 商品条码查询API
    // 需要在阿里云市场购买并配置APPCODE
    const ALIYUN_APPCODE = process.env.ALIYUN_APPCODE || ''
    
    if (ALIYUN_APPCODE) {
      console.log('尝试阿里云条码查询API...')
      try {
        const response = await axios.get('https://icode.market.alicloudapi.com/getBarcode', {
          params: { Code: barcode },
          headers: {
            'Authorization': `APPCODE ${ALIYUN_APPCODE}`
          },
          timeout: 8000
        })
        
        console.log('阿里云API响应:', response.data)
        
        if (response.data && response.data.showapi_res_code === 0) {
          const data = response.data.showapi_res_body
          return {
            name: data.goodsName || data.name,
            specification: data.spec || '',
            unit: parseUnit(data.spec || ''),
            manufacturer: data.manuName || data.manufacturer || '',
            barcode: barcode,
            category: data.type || '',
            price: data.price || 0
          }
        }
      } catch (err) {
        console.error('阿里云API调用失败:', err.message)
      }
    }
    
    // 方案2：聚合数据API - 商品条码查询
    const JUHE_API_KEY = process.env.JUHE_API_KEY || ''
    
    if (JUHE_API_KEY) {
      console.log('尝试聚合数据条码查询API...')
      try {
        const response = await axios.get('http://apis.juhe.cn/goodsQuery/query', {
          params: {
            key: JUHE_API_KEY,
            barcode: barcode
          },
          timeout: 8000
        })
        
        console.log('聚合数据API响应:', response.data)
        
        if (response.data && response.data.error_code === 0) {
          const data = response.data.result
          return {
            name: data.goodsname || data.name,
            specification: data.spec || '',
            unit: parseUnit(data.spec || ''),
            manufacturer: data.manuname || data.manufacturer || '',
            barcode: barcode,
            category: data.type || '',
            price: data.price || 0
          }
        }
      } catch (err) {
        console.error('聚合数据API调用失败:', err.message)
      }
    }
    
    // 方案3：极速数据API - 商品条码查询
    const JISUAPI_APPKEY = process.env.JISUAPI_APPKEY || ''
    
    if (JISUAPI_APPKEY) {
      console.log('📡 [API-3] 尝试极速数据API...')
      console.log('AppKey:', JISUAPI_APPKEY.substring(0, 8) + '...')
      try {
        const response = await axios.get('https://api.jisuapi.com/barcode/query', {
          params: {
            appkey: JISUAPI_APPKEY,
            barcode: barcode
          },
          timeout: 8000
        })
        
        console.log('📡 [API-3] 极速数据API响应状态:', response.data.status)
        console.log('📡 [API-3] 响应消息:', response.data.msg || 'success')
        
        if (response.data && response.data.status === '0' && response.data.result) {
          const data = response.data.result
          console.log('✅ [API-3] 极速数据API查询成功!')
          console.log('药品名称:', data.name || data.goodsname)
          
          return {
            name: data.name || data.goodsname,
            specification: data.spec || data.specification || '',
            unit: parseUnit(data.spec || data.specification || ''),
            manufacturer: data.manufacturer || data.manuname || '',
            barcode: barcode,
            category: data.category || data.type || '',
            price: data.price || 0,
            apiSource: 'jisuapi'
          }
        } else {
          console.log('❌ [API-3] 极速数据API未找到数据')
        }
      } catch (err) {
        console.error('❌ [API-3] 极速数据API调用失败')
        console.error('错误信息:', err.message)
        if (err.response) {
          console.error('响应状态:', err.response.status)
          console.error('响应数据:', err.response.data)
        }
      }
    } else {
      console.log('⏭️ [API-3] 跳过极速数据API（未配置AppKey）')
    }
    
    // 如果没有配置API密钥，提示用户
    if (!ALIYUN_APPCODE && !JUHE_API_KEY && !JISUAPI_APPKEY) {
      console.warn('========================================')
      console.warn('⚠️ 未配置任何第三方API密钥')
      console.warn('========================================')
      console.warn('请在云函数环境变量中配置以下任意一个：')
      console.warn('1. JISUAPI_APPKEY  - 极速数据（推荐）')
      console.warn('2. JUHE_API_KEY    - 聚合数据')
      console.warn('3. ALIYUN_APPCODE  - 阿里云市场')
      console.warn('========================================')
      console.warn('配置步骤：')
      console.warn('1. 打开云开发控制台')
      console.warn('2. 进入云函数 → drugBarcodeQuery → 配置')
      console.warn('3. 添加环境变量')
      console.warn('4. 重新部署云函数')
      console.warn('========================================')
      console.warn('详细文档: docs/极速数据API配置指南.md')
      console.warn('========================================')
    }
    
    return null
  } catch (err) {
    console.error('查询GS1中国失败:', err.message)
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

