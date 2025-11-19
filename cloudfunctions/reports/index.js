const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit')
const ExcelJS = require('exceljs')
const path = require('path')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    switch (action) {
      case 'inboundReport':
        return await inboundReport(data)
      case 'inboundDetailReport':
        return await inboundDetailReport(data)
      case 'stockReport':
        return await stockReport(data)
      case 'exportInboundPDF':
        return await exportInboundPDF(data)
      case 'exportStockPDF':
        return await exportStockPDF(data)
      case 'exportInboundExcel':
        return await exportInboundExcel(data)
      case 'exportStockExcel':
        return await exportStockExcel(data)
      case 'exportClinicExcel':
        return await exportClinicExcel(data)
      case 'exportClinicPDF':
        return await exportClinicPDF(data)
      default:
        return { success: false, message: 'Unknown action' }
    }
  } catch (e) {
    console.error(e)
    return { success: false, message: e.message || 'failed' }
  }
}

async function inboundReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchInboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft
  })

  let filteredRecords = records
  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    filteredRecords = records.filter(r =>
      (r.items || []).some(it => (it.drugName || '').toLowerCase().includes(key))
    )
  }

  const mapped = filteredRecords.map(r => {
    const totalQuantity = (r.items || []).reduce((s, it) => s + (it.quantity || 0), 0)
    const totalAmount = (r.items || []).reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0)
    return {
      _id: r._id,
      recordNo: r.recordNo,
      createTime: r.createTime,
      operator: r.operator || '',
      status: r.status,
      remark: r.remark || '',
      operatorSign: r.operatorSign || '',
      operatorSignText: r.operatorSign && typeof r.operatorSign === 'string' ? r.operatorSign : (r.operator || ''),
      reviewer: r.reviewer || '',
      reviewerSignText: r.reviewerSign && typeof r.reviewerSign === 'string' ? r.reviewerSign : (r.reviewer || ''),
      drugCount: (r.items || []).length,
      totalQuantity,
      totalAmount: Number(totalAmount.toFixed(2))
    }
  })

  const totalRecords = mapped.length
  const totalDrugs = mapped.reduce((s, r) => s + r.drugCount, 0)
  const totalQuantity = mapped.reduce((s, r) => s + r.totalQuantity, 0)
  const totalAmount = Number(mapped.reduce((s, r) => s + r.totalAmount, 0).toFixed(2))

  const statistics = {
    totalRecords,
    totalDrugs,
    totalQuantity,
    totalAmount
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      records: mapped
    }
  }
}

async function inboundDetailReport(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    status = '',
    includeDraft = false
  } = params

  const records = await fetchInboundRecords({
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft
  })

  let details = []
  records.forEach(record => {
    (record.items || []).forEach((item, index) => {
      const specInfo = parseSpecification(item.specification || item.spec || '') || null
      const conversionRate = specInfo?.conversionRate || 0
      const convertedQuantity = conversionRate > 1
        ? Number(((item.quantity || 0) * conversionRate).toFixed(2))
        : null
      details.push({
        recordId: record._id,
        recordNo: record.recordNo,
        date: record.createTime,
        drugName: item.drugName || '',
        specification: item.specification || item.spec || '',
        unit: item.unit || '',
        batchNo: item.batch || '',
        productionDate: item.productionDate || '',
        expireDate: item.expireDate || '',
        manufacturer: item.manufacturer || '',
        quantity: Number(item.quantity || 0),
        price: Number(item.price || 0),
        amount: Number(((item.price || 0) * (item.quantity || 0)).toFixed(2)),
        operator: record.operator || '',
        status: record.status,
        remark: record.remark || '',
        convertedQuantity,
        convertedUnit: specInfo?.minUnit || '',
        conversionRate: conversionRate || null
      })
    })
  })

  if (drugName) {
    const key = String(drugName).trim().toLowerCase()
    details = details.filter(d => d.drugName.toLowerCase().includes(key))
  }
  if (batchNo) {
    const batchKey = String(batchNo).trim().toLowerCase()
    details = details.filter(d => (d.batchNo || '').toLowerCase().includes(batchKey))
  }

  details.sort((a, b) => {
    const dateA = new Date(a.date || 0).getTime()
    const dateB = new Date(b.date || 0).getTime()
    return dateB - dateA
  })

  const statistics = {
    totalRecords: details.length,
    totalDrugs: new Set(details.map(d => d.drugName)).size,
    totalQuantity: details.reduce((sum, d) => sum + (d.quantity || 0), 0),
    totalAmount: Number(details.reduce((sum, d) => sum + (d.amount || 0), 0).toFixed(2))
  }

  const filters = normalizeFilters({
    startDate,
    endDate,
    operator,
    recordNo,
    drugName,
    batchNo,
    status,
    includeDraft
  })

  return {
    success: true,
    data: {
      filters,
      statistics,
      details
    }
  }
}

async function stockReport(params = {}) {
  const {
    category = '',
    stockFilter = 'all',
    expiryFilter = 'all'
  } = params

  let query = db.collection('stock')
  if (category) {
    query = query.where({ category })
  }

  let items = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.skip(skip).limit(limit).get()
    items = items.concat(res.data || [])
    if (!res.data || res.data.length < limit) break
    skip += limit
  }

  const now = Date.now()
  items = items.map(i => {
    const expireTime = i.expireDate ? new Date(i.expireDate).getTime() : null
    const nearExpiry = expireTime ? (expireTime - now) <= 90 * 86400000 : false
    const totalValue = Number(((i.price || 0) * (i.quantity || 0)).toFixed(2))
    const specInfo = i.specInfo || parseSpecification(i.specification || '')
    const conversionRate = specInfo?.conversionRate || 0
    const convertedQuantity = conversionRate > 1
      ? Number(((i.quantity || 0) * conversionRate).toFixed(2))
      : null
    return {
      ...i,
      nearExpiry,
      totalValue,
      convertedQuantity,
      convertedUnit: specInfo?.minUnit || '',
      conversionRate,
      statusText: getStockStatusText(i, nearExpiry)
    }
  })

  items = items.filter(i => {
    if (stockFilter === 'inStock') return (i.quantity || 0) > 0
    if (stockFilter === 'sufficient') return (i.quantity || 0) > (i.minStock || 10)
    if (stockFilter === 'warning') return (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.minStock || 10)
    if (stockFilter === 'low') return (i.quantity || 0) > 0 && (i.quantity || 0) <= 5
    if (stockFilter === 'empty') return (i.quantity || 0) <= 0
    return true
  })

  if (expiryFilter === 'expired') items = items.filter(i => i.expireDate && new Date(i.expireDate) < new Date())
  if (expiryFilter === 'expiring1') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 30 * 86400000)
  if (expiryFilter === 'expiring3') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 90 * 86400000)
  if (expiryFilter === 'expiring6') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 180 * 86400000)

  const enhancedItems = items.map(i => ({
    ...i,
    amount: Number(((i.quantity || 0) * (i.price || 0)).toFixed(2)),
    inboundDate: i.lastInTime || i.createTime || null,
    operator: i.lastInOperator || '',
    remark: i.remark || ''
  }))

  const statistics = {
    totalBatches: enhancedItems.length,
    totalDrugs: enhancedItems.length,
    totalStock: enhancedItems.reduce((s, i) => s + (i.quantity || 0), 0),
    totalValue: Number(enhancedItems.reduce((s, i) => s + (i.amount || 0), 0).toFixed(2)),
    lowStockCount: enhancedItems.filter(i => (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.minStock || 10)).length,
    expiringCount: enhancedItems.filter(i => i.nearExpiry).length
  }

  const filters = {
    category: category || '',
    stockFilter,
    expiryFilter,
    text: [
      category ? `分类：${category}` : '分类：全部',
      `库存状态：${getStockFilterText(stockFilter)}`,
      `效期状态：${getExpiryFilterText(expiryFilter)}`
    ].join(' ｜ ')
  }

  return {
    success: true,
    data: {
      filters,
      statistics,
      items: enhancedItems
    }
  }
}

async function exportInboundPDF(params = {}) {
  const mode = params.mode === 'detail' ? 'detail' : 'summary'
  const report = mode === 'detail' ? await inboundDetailReport(params) : await inboundReport(params)
  if (!report.success) return report

  const { data } = report
  const doc = new PDFDocument({ size: 'A4', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  // 字体路径
  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')

  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  const title = params.title || (mode === 'detail'
    ? '北京欢乐谷医务室入库明细表'
    : '北京欢乐谷医务室入库汇总表')

  drawPdfHeader(doc, title, data.filters, data.statistics, params.printUser)

  if (mode === 'detail') {
    const header = ['单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '生产厂家', '数量', '单价', '金额', '操作人']
    const widths = [70, 55, 80, 70, 40, 60, 60, 60, 80, 45, 45, 50, 55]
    drawRow(doc, header, widths, true)
    data.details.forEach(item => {
      drawRow(doc, [
        item.recordNo || '',
        formatDate(item.date),
        item.drugName || '',
        item.specification || '',
        item.unit || '',
        item.batchNo || '',
        item.productionDate || '',
        item.expireDate || '',
        item.manufacturer || '',
        String(item.quantity ?? ''),
        String(item.price ?? ''),
        String(item.amount ?? ''),
        item.operator || ''
      ], widths, false)
    })
  } else {
    const header = ['单号', '日期', '操作人', '状态', '品种', '数量', '金额']
    const widths = [90, 60, 70, 45, 45, 50, 60]
    drawRow(doc, header, widths, true)
    data.records.forEach(item => {
    drawRow(doc, [
        item.recordNo || '',
        formatDate(item.createTime),
        item.operator || '',
        item.status || '',
        String(item.drugCount || 0),
        String(item.totalQuantity || 0),
        String(item.totalAmount || 0)
      ], widths, false)
    })
  }

  drawPdfFooter(doc, params.printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/inbound_${mode}_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function exportStockPDF(params = {}) {
  const report = await stockReport(params)
  if (!report.success) return report

  const { data } = report
  const doc = new PDFDocument({ size: 'A4', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  // 字体路径
  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')

  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  drawPdfHeader(doc, '北京欢乐谷医务室库存明细表', data.filters, data.statistics, params.printUser)

  const header = ['药材名', '规格', '单位', '批号', '生产日期', '有效期', '入库日期', '操作人', '库存', '折算数量', '单价', '金额', '备注']
  const widths = [80, 70, 40, 60, 60, 60, 60, 55, 45, 55, 45, 50, 60]
  drawRow(doc, header, widths, true)
  data.items.forEach(item => {
    drawRow(doc, [
      item.drugName || '',
      item.specification || '',
      item.unit || '',
      item.batch || '',
      item.productionDate || '',
      item.expireDate || '',
      formatDate(item.inboundDate),
      item.operator || '',
      String(item.quantity || 0),
      item.convertedQuantity != null ? `${item.convertedQuantity}${item.convertedUnit || ''}` : '',
      String(item.price || 0),
      String(item.amount || 0),
      item.remark || ''
    ], widths, false)
  })

  drawPdfFooter(doc, params.printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/stock_detail_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function fetchInboundRecords(params = {}) {
  const {
    startDate,
    endDate,
    operator,
    recordNo,
    status,
    includeDraft,
    batchNo
  } = params

  const condition = {}
  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    condition.createTime = _.gte(start).and(_.lte(end))
  }
  if (operator) {
    condition.operator = operator
  }
  if (recordNo) {
    condition.recordNo = recordNo
  }
  if (status && status !== 'all') {
    condition.status = status
  } else if (!includeDraft) {
    condition.status = _.neq('draft')
  }

  let query = db.collection('in_records')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  if (batchNo) {
    const key = String(batchNo).trim().toLowerCase()
    return list.filter(record =>
      (record.items || []).some(item => (item.batch || '').toLowerCase().includes(key))
    )
  }
  return list
}

function normalizeFilters(filters = {}) {
  const normalized = {
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    operator: filters.operator || '',
    recordNo: filters.recordNo || '',
    drugName: filters.drugName || '',
    batchNo: filters.batchNo || '',
    status: filters.status || '',
    includeDraft: !!filters.includeDraft
  }
  normalized.text = buildFilterText(normalized)
  return normalized
}

function buildFilterText(filters) {
  const parts = []
  if (filters.startDate || filters.endDate) {
    parts.push(`时间：${filters.startDate || '——'} ~ ${filters.endDate || '——'}`)
  } else {
    parts.push('时间：全部')
  }
  parts.push(`药品：${filters.drugName || '全部'}`)
  if (filters.operator) parts.push(`操作人：${filters.operator}`)
  if (filters.recordNo) parts.push(`单号：${filters.recordNo}`)
  if (filters.batchNo) parts.push(`批号：${filters.batchNo}`)
  if (filters.status) parts.push(`状态：${filters.status}`)
  return parts.join(' ｜ ')
}

function buildDateBoundary(dateStr, isEnd = false) {
  if (!dateStr || typeof dateStr !== 'string') return null
  const parts = dateStr.split('-').map(p => Number(p))
  if (parts.length < 3 || parts.some(n => Number.isNaN(n))) {
    return null
  }
  const [year, month, day] = parts
  const hour = isEnd ? 23 : 0
  const minute = isEnd ? 59 : 0
  const second = isEnd ? 59 : 0
  return new Date(year, month - 1, day, hour, minute, second)
}

function parseSpecification(specification) {
  if (!specification || typeof specification !== 'string') return null
  const spec = specification.trim()
    .replace(/×/g, '×')
    .replace(/／/g, '/')
    .replace(/\s+/g, ' ')

  let match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)?\s*[×xX*]\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
  if (match) {
    return {
      dosage: match[1] ? parseFloat(match[1]) : null,
      dosageUnit: match[2] ? match[2].toLowerCase() : null,
      conversionRate: parseInt(match[3]),
      minUnit: match[4],
      packUnit: match[5],
      fullSpec: specification,
      pattern: 'standard'
    }
  }

  match = spec.match(/^(\d+\.?\d*)?\s*[×xX*]?\s*(\d+)\s*(片|粒|支|瓶|袋|丸|滴|ml|毫升|ML)\s*[/／]\s*(盒|瓶|袋|桶|箱|包)$/i)
  if (match) {
    return {
      dosage: match[1] ? parseFloat(match[1]) : null,
      dosageUnit: null,
      conversionRate: parseInt(match[2]),
      minUnit: match[3],
      packUnit: match[4],
      fullSpec: specification,
      pattern: 'simple'
    }
  }

  match = spec.match(/^(\d+\.?\d*)(mg|g|ml|μg|mcg|ug)\s*[/／]\s*(支|瓶|袋|桶|片|粒|丸)$/i)
  if (match) {
    const unit = match[3]
    return {
      dosage: parseFloat(match[1]),
      dosageUnit: match[2].toLowerCase(),
      conversionRate: 1,
      minUnit: unit,
      packUnit: unit,
      fullSpec: specification,
      pattern: 'single'
    }
  }

  return null
}

function getStockStatusText(item, nearExpiry) {
  if ((item.quantity || 0) <= 0) return '无库存'
  if ((item.quantity || 0) <= (item.minStock || 10)) return '库存预警'
  if (nearExpiry) return '近效期'
  return '正常'
}

function getStockFilterText(filter) {
  const map = {
    all: '全部',
    inStock: '有库存',
    sufficient: '库存充足',
    warning: '库存预警',
    low: '库存不足',
    empty: '无库存'
  }
  return map[filter] || '全部'
}

function getExpiryFilterText(filter) {
  const map = {
    all: '全部',
    normal: '正常',
    expiring6: '6个月内到期',
    expiring3: '3个月内到期',
    expiring1: '1个月内到期',
    expired: '已过期'
  }
  return map[filter] || '全部'
}

function drawPdfHeader(doc, title, filters = {}, statistics = {}, printUser = '') {
  doc.font('HeiTi').fontSize(22).text(title, { align: 'center' })
  doc.moveDown(0.5)
  doc.font('FangSong').fontSize(10).text(`统计时间：${filters.startDate || filters.endDate}`)
  if (filters.text) {
    doc.font('FangSong').text(`筛选条件：${filters.text}`)
  }
  const statsText = [
    statistics.totalRecords != null ? `记录数：${statistics.totalRecords}` : '',
    statistics.totalDrugs != null ? `药品种类：${statistics.totalDrugs}` : '',
    statistics.totalQuantity != null ? `总数量：${statistics.totalQuantity}` : '',
    statistics.totalAmount != null ? `总金额：¥${statistics.totalAmount}` : ''
  ].filter(Boolean).join(' ｜ ')
  if (statsText) {
    doc.font('FangSong').text(statsText)
  }
  doc.font('FangSong').text(`制表人：${printUser || '——'}`)
  doc.moveDown(0.5)
}

function drawPdfFooter(doc, printUser = '') {
  doc.moveDown()
  doc.font('FangSong').fontSize(10)
  doc.text(`制表人：${printUser || '——'}`)
  doc.text(`制表日期：${formatDate(new Date())}`)
}

function drawRow(doc, cells, widths, header = false) {
  const startX = doc.x
  const startY = doc.y
  for (let idx = 0; idx < cells.length; idx++) {
    const text = cells[idx] == null ? '' : String(cells[idx])
    const w = widths[idx] || 60
    if (header) {
      doc.font('FangSong').fontSize(14)
    } else {
      doc.font('FangSong').fontSize(12)
    }
    const offset = widths.slice(0, idx).reduce((a, b) => a + b, 0)
    doc.text(text, startX + offset + 2, startY, { width: w - 4 })
  }
  const rowHeight = 16
  doc.moveDown(0.2)
  doc.y = startY + rowHeight
  doc.moveTo(startX, doc.y).lineTo(startX + widths.reduce((a, b) => a + b, 0), doc.y).strokeColor('#eeeeee').stroke()
  doc.strokeColor('#000000')
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}

function formatDateTimeFull(date) {
  if (!date) return ''
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  return `${y}-${m}-${dd} ${hh}:${mm}`
}

// ==================== Excel导出功能 ====================

/**
 * 导出入库Excel报表（符合中国公文标准）
 */
async function exportInboundExcel(params = {}) {
  const { mode = 'summary', startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft = false, printUser = '' } = params
  
  // 获取数据
  let reportData
  if (mode === 'summary') {
    const res = await inboundReport({ startDate, endDate, operator, recordNo, drugName, includeDraft })
    reportData = res.data
  } else {
    const res = await inboundDetailReport({ startDate, endDate, drugName, operator, recordNo, batchNo, includeDraft })
    reportData = res.data
  }
  
  // 创建工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('入库报表', {
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'portrait',
      margins: {
        left: 0.98, right: 0.98, top: 0.98, bottom: 0.98, // 2.5cm ≈ 0.98英寸
        header: 0.5, footer: 0.5
      }
    }
  })
  
  // 设置列宽（针对打印友好的宽度进行调整）
  if (mode === 'summary') {
    worksheet.columns = [
      { key: 'recordNo', width: 22 },    // 单号
      { key: 'date', width: 14 },        // 日期
      { key: 'operator', width: 12 },    // 操作人
      { key: 'status', width: 10 },      // 状态
      { key: 'drugCount', width: 12 },   // 入库品种数
      { key: 'totalQuantity', width: 16 }, // 入库数量
      { key: 'totalAmount', width: 16 }  // 入库金额
    ]
  } else {
    worksheet.columns = [
      { key: 'recordNo', width: 20 },      // 单号
      { key: 'date', width: 14 },          // 日期
      { key: 'drugName', width: 18 },      // 药材名
      { key: 'specification', width: 18 }, // 规格
      { key: 'unit', width: 10 },          // 单位
      { key: 'batchNo', width: 16 },       // 批号
      { key: 'productionDate', width: 14 },// 生产日期
      { key: 'expireDate', width: 14 },    // 有效期
      { key: 'manufacturer', width: 18 },  // 生产厂家
      { key: 'quantity', width: 12 },      // 数量
      { key: 'price', width: 12 },         // 单价
      { key: 'amount', width: 14 },        // 金额
      { key: 'operator', width: 12 }       // 操作人
    ]
  }
  
  // 标题行（第1行）
  const titleText = mode === 'summary' ? '北京欢乐谷医务室入库汇总表' : '北京欢乐谷医务室入库明细表'
  worksheet.mergeCells('A1', mode === 'summary' ? 'G1' : 'M1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = titleText
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } }
  worksheet.getRow(1).height = 40
  
  // 统计时间 & 制表人行（第2行）
  const timeText = `统计时间：${startDate || '——'} ~ ${endDate || '——'}    制表人：${printUser || '——'}`
  worksheet.mergeCells('A2', mode === 'summary' ? 'G2' : 'M2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = timeText
  timeCell.font = { name: '仿宋_GB2312', size: 14 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 25
  
  // 表头行（第3行）
  let headers
  if (mode === 'summary') {
    // 将“品种数”“数量”“金额”改为含义更清晰的表头
    headers = ['单号', '日期', '操作人', '状态', '入库品种数', '入库数量（最小单位）', '入库金额（元）']
  } else {
    headers = ['单号', '日期', '药材名', '规格', '单位', '批号', '生产日期', '有效期', '生产厂家', '数量（最小单位）', '单价（元）', '金额（元）', '操作人']
  }
  
  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 14, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 30
  
  // 数据行（从第4行开始）
  const dataRows = mode === 'summary' ? reportData.records : reportData.details
  const colCount = mode === 'summary' ? 7 : 13
  
  dataRows.forEach((row, rowIndex) => {
    const excelRow = worksheet.getRow(4 + rowIndex)
    
    if (mode === 'summary') {
      // 与表头一一对应：单号-日期-操作人-状态-入库品种数-入库数量-入库金额
      excelRow.values = [
        row.recordNo,
        formatDate(row.createTime),
        row.operator,
        renderStatus(row.status),
        row.drugCount,
        row.totalQuantity,
        row.totalAmount
      ]
      // 金额列设置为纯数值格式（保留两位小数，千分位），数量/金额右对齐
      excelRow.getCell(6).numFmt = '#,##0.00'
      excelRow.getCell(7).numFmt = '#,##0.00'
      excelRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
    } else {
      // 明细模式：单号-日期-药材名-规格-单位-批号-生产日期-有效期-生产厂家-数量-单价-金额-操作人
      excelRow.values = [
        row.recordNo,
        formatDate(row.date),
        row.drugName,
        row.specification,
        row.unit,
        row.batchNo,
        row.productionDate || '',
        row.expireDate || '',
        row.manufacturer || '',
        row.quantity,
        row.price || '',
        row.amount || '',
        row.operator || ''
      ]
      // 数量、单价、金额右对齐，金额设置数值格式
      excelRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(11).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }
      excelRow.getCell(12).numFmt = '#,##0.00'
    }
    
    // 批量设置样式（更快）
    excelRow.font = { name: '仿宋_GB2312', size: 12 }
    if (mode === 'summary') {
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    } else {
      // 明细默认居中，数值列在上面已经单独改为右对齐
      excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    }
    excelRow.height = 22
    
    // 只设置边框
    for (let i = 1; i <= colCount; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })
  
  // 合计行（最后一行）
  const stats = reportData.statistics
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = '合计'
  
  if (mode === 'summary') {
    totalRow.getCell(5).value = stats.totalDrugs || 0
    totalRow.getCell(6).value = stats.totalQuantity || 0
    totalRow.getCell(7).value = stats.totalAmount || 0
    totalRow.getCell(6).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(6).numFmt = '#,##0.00'
    totalRow.getCell(7).numFmt = '#,##0.00'
  } else {
    totalRow.getCell(10).value = stats.totalQuantity || 0
    totalRow.getCell(12).value = stats.totalAmount || 0
    totalRow.getCell(10).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(12).alignment = { vertical: 'middle', horizontal: 'right' }
    totalRow.getCell(12).numFmt = '#,##0.00'
  }
  
  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  totalRow.height = 25
  
  // 生成Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  
  // 上传到云存储
  const timestamp = Date.now()
  const filename = mode === 'summary' 
    ? `inbound_summary_${timestamp}.xlsx`
    : `inbound_detail_${timestamp}.xlsx`
  
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: buffer
  })
  
  return { success: true, fileID: uploadResult.fileID, filename }
}

/**
 * 导出库存Excel报表（符合中国公文标准）
 */
async function exportStockExcel(params = {}) {
  const { drugName, location, showExpired = false } = params
  
  // 获取数据
  const res = await stockReport({ drugName, location, showExpired })
  const reportData = res.data
  
  // 创建工作簿
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('库存明细', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape', // 横向
      margins: {
        left: 0.98, right: 0.98, top: 0.98, bottom: 0.98,
        header: 0.5, footer: 0.5
      }
    }
  })
  
  // 设置列宽
  worksheet.columns = [
    { key: 'drugName', width: 18 },
    { key: 'specification', width: 18 },
    { key: 'unit', width: 8 },
    { key: 'batchNo', width: 16 },
    { key: 'productionDate', width: 12 },
    { key: 'inboundDate', width: 12 },
    { key: 'expireDate', width: 12 },
    { key: 'operator', width: 12 },
    { key: 'currentStock', width: 12 },
    { key: 'convertedQuantity', width: 12 },
    { key: 'price', width: 10 },
    { key: 'totalAmount', width: 12 },
    { key: 'remark', width: 20 }
  ]
  
  // 标题行
  worksheet.mergeCells('A1:M1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = '北京欢乐谷医务室库存明细表'
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 40
  
  // 统计时间行
  worksheet.mergeCells('A2:M2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = `统计时间：${formatDate(new Date())}`
  timeCell.font = { name: '仿宋_GB2312', size: 14 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 25
  
  // 表头行
  const headers = ['药材名', '规格', '单位', '批号', '生产日期', '入库日期', '有效期', '操作人', '当前库存', '折算数量', '单价', '总金额', '备注']
  const headerRow = worksheet.getRow(3)
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 14, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  headerRow.height = 30
  
  // 数据行
  reportData.items.forEach((item, rowIndex) => {
    const excelRow = worksheet.getRow(4 + rowIndex)
    excelRow.values = [
      '',
      item.drugName,
      item.specification,
      item.unit,
      item.batchNo,
      item.productionDate || '',
      item.inboundDate || '',
      item.expireDate || '',
      item.operator || '',
      item.currentStock,
      item.convertedQuantity || '',
      item.price || '',
      item.totalAmount || '',
      item.remark || ''
    ]
    
    // 批量设置样式
    excelRow.font = { name: '仿宋_GB2312', size: 12 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center' }
    excelRow.height = 22
    
    // 设置边框
    for (let i = 1; i <= 13; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })
  
  // 合计行
  const stats = reportData.statistics
  const totalRow = worksheet.addRow([])
  totalRow.getCell(1).value = '合计'
  totalRow.getCell(9).value = stats.totalStock || 0
  totalRow.getCell(12).value = stats.totalValue || 0
  
  totalRow.eachCell({ includeEmpty: true }, (cell) => {
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center' }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF2CC' } }
    cell.border = {
      top: { style: 'medium' },
      left: { style: 'thin' },
      bottom: { style: 'medium' },
      right: { style: 'thin' }
    }
  })
  totalRow.height = 25
  
  // 生成Buffer
  const buffer = await workbook.xlsx.writeBuffer()
  
  // 上传到云存储
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/stock_detail_${Date.now()}.xlsx`,
    fileContent: buffer
  })
  
  return { success: true, fileID: uploadResult.fileID }
}

// ==================== 门诊登记导出 ====================

// 查询门诊登记记录
async function fetchClinicRecords(params = {}) {
  const { startDate, endDate, name, location } = params
  const condition = {}

  if (startDate || endDate) {
    const start = startDate
      ? buildDateBoundary(startDate, false) || new Date('1970-01-01')
      : new Date('1970-01-01')
    const end = endDate
      ? buildDateBoundary(endDate, true) || new Date()
      : new Date()
    // 与 clinicRecords.list 对齐：按 createTime 做日期范围过滤
    condition.createTime = _.gte(start).and(_.lte(end))
  }

  if (location && location !== 'all') {
    condition.location = location
  }

  if (name) {
    const key = String(name).trim()
    if (key) {
      condition.name = db.RegExp({
        regexp: key,
        options: 'i'
      })
    }
  }

  let query = db.collection('clinic_records')
  if (Object.keys(condition).length) {
    query = query.where(condition)
  }

  const list = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('visitDateTime', 'asc').skip(skip).limit(limit).get()
    list.push(...(res.data || []))
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  return list
}

// 映射门诊记录为导出行
// 序号 | 就诊日期时间(yyyy-MM-dd HH:mm) | 姓名 | 性别 | 年龄 | 身份 | 主诉 | 诊断 | 处置措施 | 用药信息 | 医生
function mapClinicRecordsForExport(records = []) {
  return records.map((r, index) => {
    const dt = r.visitDateTime || r.createTime || null
    const dateStr = formatDateTimeFull(dt)
    const sex = r.gender || r.sex || ''
    const age = r.age != null ? String(r.age) : ''
    const identity = r.identity || ''
    const chief = r.chiefComplaint || ''
    const diag = r.diagnosis || ''
    const treatment = r.treatment || r.disposal || ''
    const drugName = r.drugName || ''
    const quantity = r.quantityMin || r.quantity || ''
    const unit = r.minUnit || r.unit || ''
    const composedDrugInfo = drugName
      ? `${drugName}${quantity ? ' ' + quantity : ''}${unit || ''}`
      : ''
    const drugInfo = r.drugInfo || composedDrugInfo
    const doctor = r.doctorName || r.operator || ''

    return {
      index: index + 1,
      dateTime: dateStr,
      name: r.name || '',
      gender: sex,
      age,
      identity,
      chiefComplaint: chief,
      diagnosis: diag,
      treatment,
      drugInfo,
      doctor
    }
  });
}
async function exportClinicExcel(params = {}) {
  const { startDate, endDate, name, location, printUser } = params
  const records = await fetchClinicRecords({ startDate, endDate, name, location })
  const rows = mapClinicRecordsForExport(records)

  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('门诊登记表', {
    pageSetup: {
      paperSize: 9,
      orientation: 'landscape',
      margins: {
        left: 0.98, right: 0.98, top: 0.98, bottom: 0.98,
        header: 0.5, footer: 0.5
      }
    }
  })

  worksheet.columns = [
    { key: 'index', width: 6 },
    { key: 'dateTime', width: 20 },
    { key: 'name', width: 10 },
    { key: 'gender', width: 8 },
    { key: 'age', width: 8 },
    { key: 'identity', width: 10 },
    { key: 'chiefComplaint', width: 22 },
    { key: 'diagnosis', width: 22 },
    // 合并原“处置措施”和“用药信息”为一列，宽度适当加大
    { key: 'treatmentAndDrug', width: 40 },
    { key: 'doctor', width: 10 }
  ]

  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = locMap[location] ? `（${locMap[location]}）` : ''
  const title = `北京欢乐谷医务室${locText}门诊登记表`
  worksheet.mergeCells('A1', 'K1')
  const titleCell = worksheet.getCell('A1')
  titleCell.value = title
  titleCell.font = { name: '黑体', size: 22, bold: true }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(1).height = 40

  const filterTextParts = []
  if (startDate || endDate) {
    filterTextParts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  }
  const filterText = filterTextParts.join('') || '时间：全部'

  worksheet.mergeCells('A2', 'K2')
  const timeCell = worksheet.getCell('A2')
  timeCell.value = filterText
  timeCell.font = { name: '仿宋_GB2312', size: 12 }
  timeCell.alignment = { vertical: 'middle', horizontal: 'center' }
  worksheet.getRow(2).height = 22

  worksheet.mergeCells('A3', 'K3')
  const makerCell = worksheet.getCell('A3')
  makerCell.value = `制表人：${printUser || '——'}    制表日期：${formatDate(new Date())}`
  makerCell.font = { name: '仿宋_GB2312', size: 12 }
  makerCell.alignment = { vertical: 'middle', horizontal: 'right' }
  worksheet.getRow(3).height = 20

  // 表头：将“处置措施”和“用药信息”合并为一列
  const headers = ['序号', '就诊日期时间', '姓名', '性别', '年龄', '身份', '主诉', '诊断', '处置及用药情况', '医生']
  const headerRow = worksheet.getRow(4)
  headers.forEach((header, idx) => {
    const cell = headerRow.getCell(idx + 1)
    cell.value = header
    cell.font = { name: '仿宋_GB2312', size: 12, bold: true }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } }
    cell.border = {
      top: { style: 'medium' },
    }
  })
  headerRow.height = 26

  rows.forEach((row, rowIdx) => {
    const excelRow = worksheet.getRow(5 + rowIdx)
    // 合并处置措施与用药信息的文案
    const mergedTreatment = [row.treatment, row.drugInfo].filter(Boolean).join('，')
    excelRow.values = [
      row.index,
      row.dateTime,
      row.name,
      row.gender,
      row.age,
      row.identity,
      row.chiefComplaint,
      row.diagnosis,
      mergedTreatment,
      row.doctor
    ]
    excelRow.font = { name: '仿宋_GB2312', size: 11 }
    excelRow.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    excelRow.height = 22
    for (let i = 1; i <= 10; i++) {
      const cell = excelRow.getCell(i)
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    }
  })

  const buffer = await workbook.xlsx.writeBuffer()
  const timestamp = Date.now()
  const filename = `clinic_${timestamp}.xlsx`
  const uploadResult = await cloud.uploadFile({
    cloudPath: `reports/${filename}`,
    fileContent: buffer
  })
  return { success: true, fileID: uploadResult.fileID, filename }
}

// 导出门诊登记 PDF
async function exportClinicPDF(params = {}) {
  const { startDate, endDate, name, location, printUser } = params
  const records = await fetchClinicRecords({ startDate, endDate, name, location })
  const rows = mapClinicRecordsForExport(records)

  const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  const fontDir = path.join(__dirname, 'fonts')
  const simheiFont = path.join(fontDir, 'SimHei.ttf')
  const fangsongFont = path.join(fontDir, 'FangSong_GB2312.ttf')
  doc.registerFont('HeiTi', simheiFont)
  doc.registerFont('FangSong', fangsongFont)

  const filters = {
    startDate: startDate || '',
    endDate: endDate || '',
    text: ''
  }
  const parts = []
  if (startDate || endDate) {
    parts.push(`时间：${startDate || '——'} ~ ${endDate || '——'}`)
  }
  if (name) parts.push(`姓名：${name}`)
  if (location && location !== 'all') {
    const locMap = { land_park: '陆园', water_park: '水园' }
    parts.push(`园区：${locMap[location] || location}`)
  }
  filters.text = parts.join(' ｜ ')

  const statistics = {
    totalRecords: rows.length
  }

  // 与 Excel 一致的标题：根据园区拼接
  const locMap = { land_park: '陆园', water_park: '水园' }
  const locText = location && location !== 'all' && locMap[location]
    ? `（${locMap[location]}）`
    : ''
  const clinicTitle = `北京欢乐谷医务室${locText}门诊登记表`

  drawPdfHeader(doc, clinicTitle, filters, statistics, printUser)

  // 表头与 Excel 对齐：合并“处置措施”和“用药信息”为一列
  const header = ['序号', '就诊日期时间', '姓名', '性别', '年龄', '身份', '主诉', '诊断', '处置及用药情况', '医生']
  // A4 横向下，总宽度控制在页面内容宽度内（约 630pt 左右）
  const widths = [30, 80, 50, 30, 30, 50, 110, 110, 160, 40]
  drawRow(doc, header, widths, true)

  rows.forEach(r => {
    // 为避免长文本在 PDF 中换行过多导致难以阅读，这里做适度截断
    const truncate = (text, len = 30) => {
      if (!text) return ''
      const str = String(text)
      return str.length > len ? str.slice(0, len) + '…' : str
    }

    const mergedTreatment = truncate([r.treatment, r.drugInfo].filter(Boolean).join('，'), 50)
    drawRow(doc, [
      r.index,
      r.dateTime,
      truncate(r.name, 10),
      truncate(r.gender, 2),
      truncate(r.age, 3),
      truncate(r.identity, 6),
      truncate(r.chiefComplaint, 40),
      truncate(r.diagnosis, 40),
      mergedTreatment,
      truncate(r.doctor, 10)
    ], widths, false)
  })

  drawPdfFooter(doc, printUser)
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/clinic_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

function renderStatus(status) {
  const map = {
    draft: '草稿',
    pending_review: '待复核',
    rejected: '已驳回',
    completed: '已完成'
  }
  return map[status] || status || '-'
}

