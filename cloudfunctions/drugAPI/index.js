// 药材第三方API云函数
// 用于查询国家药监局等第三方数据库

const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 云函数入口函数
 */
exports.main = async (event, context) => {
  const { action, keyword } = event
  
  console.log('drugAPI 调用:', { action, keyword })
  
  switch (action) {
    case 'search':
      return await searchDrug(keyword)
    default:
      return {
        success: false,
        message: '未知操作'
      }
  }
}

/**
 * 搜索药材
 * @param {string} keyword - 搜索关键词
 */
async function searchDrug(keyword) {
  try {
    console.log('开始搜索药材:', keyword)
    
    // TODO: 这里接入真实的第三方API
    // 例如：国家药材监督管理局数据查询接口
    // const result = await callNMPAAPI(keyword)
    
    // 目前使用模拟数据进行测试
    const mockResult = await mockSearchAPI(keyword)
    
    if (mockResult) {
      return {
        success: true,
        data: mockResult,
        message: '查询成功'
      }
    } else {
      return {
        success: false,
        data: null,
        message: '未找到相关药材'
      }
    }
    
  } catch (error) {
    console.error('搜索药材失败:', error)
    return {
      success: false,
      error: error.message,
      message: '查询失败'
    }
  }
}

/**
 * 模拟第三方API查询（用于测试）
 * 实际使用时替换为真实API调用
 */
async function mockSearchAPI(keyword) {
  // 模拟延迟
  await sleep(1000)
  
  // 模拟药材数据库
  const mockDatabase = [
    {
      name: '阿莫西林胶囊',
      specification: '0.25g×24粒/盒',
      spec: '0.25g×24粒/盒',
      unit: '盒',
      manufacturer: 'XX制药有限公司',
      approvalNumber: '国药准字H12345678',
      barcode: '6901234567890'
    },
    {
      name: '布洛芬缓释胶囊',
      specification: '0.3g×20粒/盒',
      spec: '0.3g×20粒/盒',
      unit: '盒',
      manufacturer: 'YY医药股份有限公司',
      approvalNumber: '国药准字H23456789',
      barcode: '6901234567891'
    },
    {
      name: '感冒灵颗粒',
      specification: '10g×10袋/盒',
      spec: '10g×10袋/盒',
      unit: '盒',
      manufacturer: 'ZZ中药制药厂',
      approvalNumber: '国药准字Z34567890',
      barcode: '6901234567892'
    },
    {
      name: '维生素C片',
      specification: '0.1g×100片/瓶',
      spec: '0.1g×100片/瓶',
      unit: '瓶',
      manufacturer: 'AA保健品公司',
      approvalNumber: '国药准字H45678901',
      barcode: '6901234567893'
    },
    {
      name: '阿司匹林肠溶片',
      specification: '25mg×100片/瓶',
      spec: '25mg×100片/瓶',
      unit: '瓶',
      manufacturer: 'BB制药集团',
      approvalNumber: '国药准字H56789012',
      barcode: '6901234567894'
    }
  ]
  
  // 模糊匹配
  const result = mockDatabase.find(drug => 
    drug.name.includes(keyword) || 
    keyword.includes(drug.name.substring(0, 3))
  )
  
  return result || null
}

/**
 * 真实的第三方API调用示例（待实现）
 * 可以接入以下数据源：
 * 1. 国家药材监督管理局（NMPA）- 药材数据查询
 * 2. 药智网 API
 * 3. 医药数据开放平台
 */
async function callNMPAAPI(keyword) {
  // TODO: 实现真实API调用
  // const https = require('https')
  // const requestOptions = {
  //   hostname: 'api.nmpa.gov.cn',
  //   path: `/query?keyword=${encodeURIComponent(keyword)}`,
  //   method: 'GET',
  //   headers: {
  //     'Authorization': 'YOUR_API_KEY'
  //   }
  // }
  // return new Promise((resolve, reject) => {
  //   const req = https.request(requestOptions, (res) => {
  //     let data = ''
  //     res.on('data', (chunk) => { data += chunk })
  //     res.on('end', () => { resolve(JSON.parse(data)) })
  //   })
  //   req.on('error', reject)
  //   req.end()
  // })
}

// 工具函数：延迟
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

