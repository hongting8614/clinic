const cloud = require('wx-server-sdk')
const PDFDocument = require('pdfkit')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { action, data } = event
  try {
    switch (action) {
      case 'inboundReport':
        return await inboundReport(data)
      case 'stockReport':
        return await stockReport(data)
      case 'exportInboundPDF':
        return await exportInboundPDF(data)
      case 'exportStockPDF':
        return await exportStockPDF(data)
      default:
        return { success: false, message: 'Unknown action' }
    }
  } catch (e) {
    console.error(e)
    return { success: false, message: e.message || 'failed' }
  }
}

async function inboundReport(params) {
  const { startDate, endDate, operator, recordNo, drugName } = params || {}
  let query = db.collection('in_records')
  if (startDate || endDate) {
    const start = startDate ? new Date(startDate + ' 00:00:00') : new Date('1970-01-01')
    const end = endDate ? new Date(endDate + ' 23:59:59') : new Date()
    query = query.where({ createTime: _.gte(start).and(_.lte(end)) })
  }
  if (operator) {
    query = query.where({ operator })
  }
  if (recordNo) {
    query = query.where({ recordNo })
  }
  // 拉取（分页粗略合并）
  let records = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.orderBy('createTime', 'desc').skip(skip).limit(limit).get()
    records = records.concat(res.data || [])
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  // 按药品名过滤
  if (drugName) {
    const key = String(drugName).toLowerCase()
    records = records.filter(r => (r.items || []).some(it => (it.drugName || '').toLowerCase().includes(key)))
  }
  // 汇总
  const mapped = records.map(r => {
    const totalQuantity = (r.items || []).reduce((s, it) => s + (it.quantity || 0), 0)
    const totalAmount = (r.items || []).reduce((s, it) => s + ((it.price || 0) * (it.quantity || 0)), 0)
    return {
      _id: r._id,
      recordNo: r.recordNo,
    createTime: r.createTime,
    operator: r.operator || '',
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
  // 统计：按天、按操作人
  const dayMap = {}
  const operatorMap = {}
  mapped.forEach(r => {
    const d = formatDate(r.createTime)
    if (!dayMap[d]) dayMap[d] = { date: d, count: 0, totalAmount: 0, totalQuantity: 0 }
    dayMap[d].count++
    dayMap[d].totalAmount += r.totalAmount
    dayMap[d].totalQuantity += r.totalQuantity
    const op = r.operator || '未知'
    if (!operatorMap[op]) operatorMap[op] = { operator: op, count: 0, totalAmount: 0 }
    operatorMap[op].count++
    operatorMap[op].totalAmount += r.totalAmount
  })
  const byDay = Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date))
  const byOperator = Object.values(operatorMap).sort((a, b) => b.totalAmount - a.totalAmount).slice(0, 5)
  return {
    success: true,
    data: {
      totalRecords,
      totalDrugs,
      totalQuantity,
      totalAmount,
      records: mapped,
      byDay, byOperator
    }
  }
}

async function stockReport(params) {
  const { category = '', stockFilter = 'all', expiryFilter = 'all' } = params || {}
  let query = db.collection('stock')
  if (category) {
    query = query.where({ category })
  }
  // 分批取
  let items = []
  let skip = 0
  const limit = 100
  while (true) {
    const res = await query.skip(skip).limit(limit).get()
    items = items.concat(res.data || [])
    if (!res.data || res.data.length < limit) break
    skip += limit
  }
  // 计算状态
  const now = Date.now()
  items = items.map(i => {
    const nearExpiry = i.expireDate ? (new Date(i.expireDate).getTime() - now) <= 90 * 86400000 : false
    const totalValue = Number(((i.price || 0) * (i.quantity || 0)).toFixed(2))
    return { ...i, nearExpiry, totalValue }
  })
  // 库存筛选
  items = items.filter(i => {
    if (stockFilter === 'inStock') return (i.quantity || 0) > 0
    if (stockFilter === 'sufficient') return (i.quantity || 0) > (i.minStock || 10)
    if (stockFilter === 'warning') return (i.quantity || 0) > 0 && (i.quantity || 0) <= (i.minStock || 10)
    if (stockFilter === 'low') return (i.quantity || 0) > 0 && (i.quantity || 0) <= 5
    if (stockFilter === 'empty') return (i.quantity || 0) <= 0
    return true
  })
  // 效期筛选（简化）
  if (expiryFilter === 'expired') items = items.filter(i => i.expireDate && new Date(i.expireDate) < new Date())
  if (expiryFilter === 'expiring1') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 30 * 86400000)
  if (expiryFilter === 'expiring3') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 90 * 86400000)
  if (expiryFilter === 'expiring6') items = items.filter(i => i.expireDate && (new Date(i.expireDate) - new Date()) <= 180 * 86400000)

  const totalDrugs = items.length
  const totalStock = items.reduce((s, i) => s + (i.quantity || 0), 0)
  const totalValue = Number(items.reduce((s, i) => s + (i.totalValue || 0), 0).toFixed(2))
  const lowStockCount = items.filter(i => (i.quantity || 0) <= (i.minStock || 10) && (i.quantity || 0) > 0).length
  const expiringCount = items.filter(i => i.nearExpiry).length

  return {
    success: true,
    data: {
      totalDrugs, totalStock, lowStockCount, expiringCount, totalValue, items
    }
  }
}

async function exportInboundPDF(params) {
  const report = await inboundReport(params)
  if (!report.success) return report
  const { data } = report
  const title = params.title || '北京欢乐谷医务室药材入库表'
  // 生成PDF
  const doc = new PDFDocument({ size: 'A4', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  doc.fontSize(16).text(title, { align: 'center' })
  doc.moveDown(0.5)
  doc.fontSize(10).text(`时间范围：${params.startDate || ''} ~ ${params.endDate || ''}`, { align: 'center' })
  doc.moveDown()

  // 表头
  doc.fontSize(10)
  drawRow(doc, ['单号', '日期', '供应商', '操作人(签名)', '品种', '数量', '金额'], [120, 70, 100, 100, 40, 50, 60], true)
  data.records.forEach(r => {
    drawRow(doc, [
      r.recordNo || '',
      formatDate(r.createTime),
      r.supplier || '',
      r.operatorSignText || r.operator || '',
      String(r.drugCount || 0),
      String(r.totalQuantity || 0),
      String(r.totalAmount || 0)
    ], [120, 70, 100, 100, 40, 50, 60], false)
  })

  doc.moveDown()
  doc.text(`合计：单据${data.totalRecords}张，品种${data.totalDrugs}个，数量${data.totalQuantity}，金额¥${data.totalAmount}`, { align: 'right' })
  doc.end()
  await done

  const arrayBuffer = Buffer.concat(buffers)
  const filePath = `reports/inbound_${Date.now()}.pdf`
  const upload = await cloud.uploadFile({
    cloudPath: filePath,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

async function exportStockPDF(params) {
  const report = await stockReport(params)
  if (!report.success) return report
  const { data } = report
  const title = '北京欢乐谷医务室现库存表'
  const doc = new PDFDocument({ size: 'A4', margin: 36 })
  const buffers = []
  doc.on('data', buffers.push.bind(buffers))
  const done = new Promise(resolve => doc.on('end', resolve))

  doc.fontSize(16).text(title, { align: 'center' })
  doc.moveDown()
  doc.fontSize(10)
  drawRow(doc, ['药品名称', '规格', '库存', '单位', '状态', '价值'], [120, 150, 40, 40, 50, 60], true)
  data.items.forEach(i => {
    const status = i.quantity <= 0 ? '无库存' : (i.quantity <= (i.minStock || 10) ? '预警' : (i.nearExpiry ? '近效期' : '正常'))
    drawRow(doc, [
      i.drugName || '',
      i.specification || '',
      String(i.quantity || 0),
      i.unit || '',
      status,
      String(i.totalValue || 0)
    ], [120, 150, 40, 40, 50, 60], false)
  })
  doc.moveDown()
  doc.text(`合计：品种${data.totalDrugs}个，库存${data.totalStock}，总价值¥${data.totalValue}`, { align: 'right' })
  doc.end()
  await done
  const arrayBuffer = Buffer.concat(buffers)
  const upload = await cloud.uploadFile({
    cloudPath: `reports/stock_${Date.now()}.pdf`,
    fileContent: arrayBuffer
  })
  return { success: true, fileID: upload.fileID }
}

function drawRow(doc, cells, widths, header = false) {
  const startX = doc.x
  const startY = doc.y
  for (let idx = 0; idx < cells.length; idx++) {
    const text = cells[idx] == null ? '' : String(cells[idx])
    const w = widths[idx] || 60
    if (header) doc.font('Helvetica-Bold')
    else doc.font('Helvetica')
    doc.text(text, startX + widths.slice(0, idx).reduce((a, b) => a + b, 0) + 2, startY, { width: w - 4 })
  }
  const rowHeight = 16
  doc.moveDown(0.2)
  doc.y = startY + rowHeight
  // 分隔线
  doc.moveTo(startX, doc.y).lineTo(startX + widths.reduce((a, b) => a + b, 0), doc.y).strokeColor('#eeeeee').stroke()
  doc.strokeColor('#000000')
}

function formatDate(date) {
  if (!date) return ''
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}


