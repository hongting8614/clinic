const cloud = require('wx-server-sdk')
const axios = require('axios')

cloud.init({ 
  env: cloud.DYNAMIC_CURRENT_ENV 
})

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, drugName, drugId, barcode } = event
  const startTime = Date.now()
  
  console.log('========================================')
  console.log('🔍 药材搜索云函数')
  console.log('操作:', action || 'search')
  console.log('时间:', new Date().toISOString())
  console.log('========================================')
  
  try {
    // 根据action执行不同操作
    if (action === 'getAllDrugs') {
      return await getAllDrugs()
    }
    
    if (action === 'updateDrugBarcode') {
      return await updateDrugBarcode(drugId, barcode)
    }
    
    // 默认：药材名称搜索
    if (!drugName || !drugName.trim()) {
      return { success: false, message: '药材名称不能为空' }
    }
    
    console.log('药材名称:', drugName)
    
    // 第一步：查询本地药材档案
    console.log('🔍 [第1步] 查询本地药材档案...')
    const localResult = await queryLocalDrugs(drugName.trim())
    
    if (localResult && localResult.length > 0) {
      console.log('✅ [第1步] 本地找到', localResult.length, '条记录')
      
      const duration = Date.now() - startTime
      console.log('========================================')
      console.log('✅ 查询完成')
      console.log('耗时:', duration + 'ms')
      console.log('数据来源: 本地档案')
      console.log('========================================')
      
      return {
        success: true,
        data: localResult,
        source: 'local',
        message: '从本地药材档案获取'
      }
    }
    
    console.log('❌ [第1步] 本地档案未找到')
    
    // 第二步：调用国家药监局NMPA API
    console.log('🔍 [第2步] 调用国家药监局API...')
    const nmpaResult = await queryNMPA(drugName.trim())
    
    if (nmpaResult.success && nmpaResult.data && nmpaResult.data.length > 0) {
      console.log('✅ [第2步] NMPA查询成功，找到', nmpaResult.data.length, '条记录')
      
      // 第三步：保存到本地缓存
      console.log('💾 [第3步] 保存到本地缓存...')
      await saveToDrugCache(drugName.trim(), nmpaResult.data)
      
      const duration = Date.now() - startTime
      console.log('========================================')
      console.log('✅ 查询完成')
      console.log('耗时:', duration + 'ms')
      console.log('数据来源: 国家药监局')
      console.log('========================================')
      
      return {
        success: true,
        data: nmpaResult.data,
        source: 'nmpa',
        message: '从国家药监局获取'
      }
    }
    
    console.log('❌ [第2步] NMPA未找到药材信息')
    
    // 未找到
    const duration = Date.now() - startTime
    console.log('========================================')
    console.log('⚠️ 查询完成（未找到）')
    console.log('耗时:', duration + 'ms')
    console.log('========================================')
    
    return {
      success: false,
      message: '未找到药材信息',
      suggestion: '请检查药材名称是否正确，或手动创建药材档案'
    }
    
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
 * 查询本地药材档案
 */
async function queryLocalDrugs(drugName) {
  try {
    const res = await db.collection('drugs')
      .where(
        _.or([
          {
            name: db.RegExp({
              regexp: drugName,
              options: 'i'  // 忽略大小写
            })
          },
          {
            genericName: db.RegExp({
              regexp: drugName,
              options: 'i'
            })
          },
          {
            // tradeNames 为数组字段，RegExp 会匹配任一元素
            tradeNames: db.RegExp({
              regexp: drugName,
              options: 'i'
            })
          }
        ])
      )
      .limit(20)
      .get()
    
    if (res.data && res.data.length > 0) {
      return res.data.map(drug => ({
        _id: drug._id,
        name: drug.name || drug.drugName,
        specification: drug.specification || drug.spec,
        unit: drug.packUnit || drug.unit || '盒',
        manufacturer: drug.manufacturer || '',
        barcode: drug.barcode || '',
        approvalNumber: drug.approvalNumber || '',
        category: drug.category || '',
        source: 'local'
      }))
    }
    
    return null
  } catch (err) {
    console.error('查询本地药材失败:', err)
    return null
  }
}

/**
 * 查询国家药监局NMPA
 */
async function queryNMPA(drugName) {
  try {
    console.log('📡 开始查询NMPA...')
    console.log('查询关键词:', drugName)
    
    // 国产药材查询
    const domesticUrl = 'http://app1.nmpa.gov.cn/data_nmpa/face3/search.jsp'
    
    const params = {
      tableId: '25',        // 25:国产药材, 26:进口药材
      State: '1',
      bcId: '124356560303886909015737447882',
      curstart: '1',
      State: '1',
      tableName: 'TABLE25',
      viewtitleName: 'COLUMN79',
      viewsubTitleName: 'COLUMN82,COLUMN75,COLUMN76',
      keyword: drugName
    }
    
    console.log('请求URL:', domesticUrl)
    console.log('请求参数:', params)
    
    const response = await axios.get(domesticUrl, {
      params: params,
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    })
    
    console.log('响应状态:', response.status)
    console.log('响应数据长度:', response.data.length)
    
    // 使用正则表达式解析HTML
    const results = []
    const html = response.data
    
    // 匹配表格行 <tr>...</tr>
    const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi
    const tdRegex = /<td[^>]*>([\s\S]*?)<\/td>/gi
    
    let trMatch
    let rowIndex = 0
    
    while ((trMatch = trRegex.exec(html)) !== null) {
      rowIndex++
      if (rowIndex === 1) continue // 跳过表头
      
      const rowHtml = trMatch[1]
      const cells = []
      let tdMatch
      
      // 提取所有单元格
      while ((tdMatch = tdRegex.exec(rowHtml)) !== null) {
        // 移除HTML标签，只保留文本
        const cellText = tdMatch[1]
          .replace(/<[^>]+>/g, '')  // 移除所有HTML标签
          .replace(/&nbsp;/g, ' ')  // 替换空格实体
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&')
          .trim()
        cells.push(cellText)
      }
      
      // 重置 tdRegex.lastIndex
      tdRegex.lastIndex = 0
      
      if (cells.length >= 4) {
        const result = {
          approvalNumber: cells[0],   // 批准文号
          name: cells[1],             // 药材名称
          manufacturer: cells[2],     // 生产企业
          approvalDate: cells[3],     // 批准日期
          source: 'nmpa'
        }
        
        // 只保存有效数据
        if (result.name && result.manufacturer) {
          results.push(result)
        }
      }
    }
    
    console.log('解析到', results.length, '条记录')
    
    if (results.length > 0) {
      console.log('首条记录:', results[0])
    }
    
    return {
      success: results.length > 0,
      data: results
    }
    
  } catch (err) {
    console.error('NMPA查询失败:', err.message)
    if (err.response) {
      console.error('响应状态:', err.response.status)
      console.error('响应数据:', err.response.data)
    }
    return {
      success: false,
      message: err.message
    }
  }
}

/**
 * 保存到药材名称搜索缓存
 */
async function saveToDrugCache(drugName, results) {
  try {
    // 检查是否已存在
    const existing = await db.collection('drug_search_cache')
      .where({ drugName: drugName })
      .get()
    
    if (existing.data && existing.data.length > 0) {
      // 更新现有记录
      await db.collection('drug_search_cache')
        .doc(existing.data[0]._id)
        .update({
          data: {
            results: results,
            queryCount: db.command.inc(1),
            lastQueryTime: new Date(),
            updateTime: new Date()
          }
        })
      console.log('✅ 更新缓存成功')
    } else {
      // 新增记录
      await db.collection('drug_search_cache').add({
        data: {
          drugName: drugName,
          results: results,
          queryCount: 1,
          source: 'nmpa',
          createTime: new Date(),
          lastQueryTime: new Date()
        }
      })
      console.log('✅ 新增缓存成功')
    }
  } catch (err) {
    console.error('保存缓存失败:', err.message)
  }
}

/**
 * 获取所有药材
 */
async function getAllDrugs() {
  try {
    console.log('📋 获取所有药材...')
    
    const res = await db.collection('drugs')
      .orderBy('name', 'asc')
      .limit(1000)
      .get()
    
    console.log(`✅ 找到 ${res.data.length} 种药材`)
    
    return {
      success: true,
      data: res.data,
      count: res.data.length
    }
  } catch (err) {
    console.error('获取药材失败:', err.message)
    return {
      success: false,
      message: '获取药材失败：' + err.message
    }
  }
}

/**
 * 更新药材条形码
 */
async function updateDrugBarcode(drugId, barcode) {
  try {
    console.log('🔄 更新药材条形码...')
    console.log('药材ID:', drugId)
    console.log('条形码:', barcode)
    
    if (!drugId || !barcode) {
      return {
        success: false,
        message: '药材ID和条形码不能为空'
      }
    }
    
    await db.collection('drugs')
      .doc(drugId)
      .update({
        data: {
          barcode: barcode,
          updateTime: db.serverDate()
        }
      })
    
    console.log('✅ 更新成功')
    
    return {
      success: true,
      message: '条形码已关联'
    }
  } catch (err) {
    console.error('更新失败:', err.message)
    return {
      success: false,
      message: '更新失败：' + err.message
    }
  }
}
