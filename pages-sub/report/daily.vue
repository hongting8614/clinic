<template>
  <view class="daily-report-page">
    <!-- 日报内容区域 -->
    <view class="report-container">
      <!-- 日报文本（可编辑） -->
      <view class="report-card">
        <view class="report-header">
          <text class="report-date">{{ reportDate }}</text>
          <text class="report-location">{{ reportLocation }}</text>
          <view class="header-actions">
            <view class="action-btn" @click="editReportText">
              <text class="action-icon">{{ isEditingText ? '✓' : '✏️' }}</text>
            </view>
            <view class="action-btn" @click="copyReport">
              <text class="action-icon">📋</text>
            </view>
          </view>
        </view>
        
        <view class="report-content">
          <textarea 
            v-if="isEditingText"
            v-model="reportContent" 
            class="report-textarea"
            placeholder="请输入日报内容"
            auto-height
          ></textarea>
          <text v-else class="report-text" selectable>{{ reportContent }}</text>
        </view>
      </view>


      <!-- 统计信息 -->
      <view class="stats-card" v-if="stats">
        <view class="stats-title">统计信息</view>
        <view class="stats-grid">
          <view class="stat-item">
            <text class="stat-value">{{ stats.total }}</text>
            <text class="stat-label">总接诊</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.visitorTotal }}</text>
            <text class="stat-label">游客</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.employeeTotal }}</text>
            <text class="stat-label">员工</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ stats.outcallTotal }}</text>
            <text class="stat-label">出诊次数</text>
          </view>
        </view>
        <view class="template-actions">
          <button class="mini-btn" @click="exportTemplateCSV('visitor')">模板CSV-游客</button>
          <button class="mini-btn" @click="exportTemplateCSV('employee')">模板CSV-员工</button>
        </view>
      </view>

      <!-- 下方仅保留统计信息卡片和底部操作栏，去掉明细与汇总表格 -->
    </view>

    <!-- 底部操作栏（统一使用顶部导航返回箭头） -->
    <view class="bottom-actions">
      <button class="action-button secondary" @click="goClinic">门诊登记</button>
      <button class="action-button primary" @click="copyReport">复制全部</button>
      <button class="action-button primary" @click="exportCSV">导出CSV</button>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ReportDaily',
  data() {
    return {
      reportContent: '',
      reportDate: '',
      reportLocation: '',
      stats: null,
      tableData: null,
      isEditingText: false,
      isEditingVisitor: false,
      isEditingEmployee: false,
      // 固定疾病清单（用于汇总报表），为空也要显示
      diseaseList: [
        '擦伤','扭伤','割伤','烫伤','跌伤','撞伤','脆伤','挫伤','头痛','头晕',
        '感冒','发烧','咳嗽','腹泻','腹痛','恶心呕吐','过敏','皮疹','牙痛','关节痛',
        '腰痛','胸闷','心慌','晕厥','中暑','痛经','胃痛','骨折','其他'
      ],
      visitorSummary: null,
      employeeSummary: null
    }
  },
  onLoad(options) {
    // 从页面参数获取日报内容
    if (options.content) {
      this.reportContent = decodeURIComponent(options.content)
    }
    if (options.date) {
      this.reportDate = decodeURIComponent(options.date)
    }
    if (options.location) {
      this.reportLocation = decodeURIComponent(options.location)
    }
    if (options.stats) {
      try {
        this.stats = JSON.parse(decodeURIComponent(options.stats))
      } catch (e) {
        console.error('解析统计信息失败:', e)
      }
    }
    if (options.tableData) {
      try {
        this.tableData = JSON.parse(decodeURIComponent(options.tableData))
      } catch (e) {
        console.error('解析表格数据失败:', e)
      }
    }

    // 如果未携带内容，则在本页直接根据门诊登记生成（默认当天 + 最近园区）
    if (!this.reportContent) {
      const now = new Date()
      const y = now.getFullYear()
      const m = String(now.getMonth() + 1).padStart(2, '0')
      const d = String(now.getDate()).padStart(2, '0')
      const dateStr = `${y}-${m}-${d}`
      let loc = 'land_park'
      try {
        const saved = uni.getStorageSync('clinic_last_location')
        if (saved === 'land_park' || saved === 'water_park') loc = saved
      } catch (e) {}
      this.generateFromClinicRecords(dateStr, loc)
      return
    }
    // 生成汇总（带参打开时）
    this.generateSummaries()
  },
  methods: {
    // 在本页直接调用门诊信息生成日报
    async generateFromClinicRecords(dateStr, location) {
      try {
        uni.showLoading({ title: '加载中...' })
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'list',
            data: {
              location,
              startDate: dateStr,
              endDate: dateStr,
              pageSize: 1000,
              useClinicRecords: true
            }
          }
        })
        const records = res?.result?.data?.list || []
        const locationName = location === 'land_park' ? '陆园' : '水园'
        
        // 生成文本、统计与表格
        this.reportContent = this.formatDailyReport(records, dateStr, locationName)
        this.stats = this.calculateStats(records)
        this.tableData = this.prepareTableData(records)
        const d = new Date(dateStr)
        const yy = d.getFullYear()
        const mm = String(d.getMonth() + 1).padStart(2, '0')
        const dd = String(d.getDate()).padStart(2, '0')
        this.reportDate = `${yy}年${mm}月${dd}日`
        this.reportLocation = locationName
        this.generateSummaries()
      } catch (e) {
        console.error('生成日报失败:', e)
        uni.showToast({ title: '生成失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },

    // 文本日报构建（与登记页口径一致）
    formatDailyReport(records, dateStr, locationName) {
      const dt = new Date(dateStr)
      const y = dt.getFullYear()
      const m = dt.getMonth() + 1
      const d = dt.getDate()
      const dateFormatted = `${y}年${m}月${d}日`
      
      const agg = { total: records.length, visitor: [], employee: [], outcall: [] }
      records.forEach(r => {
        const identity = r.identity || '游客'
        const disease = r.diseaseName || r.diagnosis || r.chiefComplaint || '未知'
        const site = r.injuryLocation || ''
        const isOut = r.isOutcall || r.visitType === 'outcall'
        if (isOut && site) {
          const ex = agg.outcall.find(i => i.location === site)
          ex ? ex.count++ : agg.outcall.push({ location: site, count: 1 })
        }
        const bucket = identity === '员工' ? 'employee' : 'visitor'
        const list = agg[bucket]
        const existed = list.find(i => i.disease === disease)
        if (existed) {
          existed.total++
          if (bucket === 'visitor' && site) {
            const l = existed.locations?.find(x => x.name === site)
            l ? l.count++ : existed.locations.push({ name: site, count: 1 })
          }
        } else {
          list.push({
            disease,
            total: 1,
            locations: bucket === 'visitor' && site ? [{ name: site, count: 1 }] : []
          })
        }
      })
      
      let report = `${dateFormatted}北京欢乐谷医务室（${locationName}）当日接诊共计${agg.total}人。`
      if (agg.visitor.length) {
        const vt = agg.visitor.reduce((s, i) => s + i.total, 0)
        const parts = agg.visitor.map(i => {
          if (i.locations?.length) {
            const lp = i.locations.map(l => `${l.name}${l.count}人`).join('，')
            return `${i.disease}${i.total}人（${lp}）`
          }
          return `${i.disease}${i.total}人`
        })
        report += `\n游客${vt}人：${parts.join('，')}。`
      }
      if (agg.employee.length) {
        const et = agg.employee.reduce((s, i) => s + i.total, 0)
        report += `\n员工${et}人：${agg.employee.map(i => `${i.disease}${i.total}人`).join('，')}。`
      }
      if (agg.outcall.length) {
        const ot = agg.outcall.reduce((s, i) => s + i.count, 0)
        report += `\n出诊${ot}次：${agg.outcall.map(i => `${i.location}${i.count}次`).join('，')}。`
      }
      return report.trim()
    },

    // 简要统计
    calculateStats(records) {
      const s = { total: records.length, visitorTotal: 0, employeeTotal: 0, outcallTotal: 0 }
      records.forEach(r => {
        const id = r.identity || '游客'
        const isOut = r.isOutcall || r.visitType === 'outcall'
        if (id === '游客') s.visitorTotal++
        else if (id === '员工') s.employeeTotal++
        if (isOut) s.outcallTotal++
      })
      return s
    },

    // 表格数据
    prepareTableData(records) {
      let doctorName = ''
      try {
        const u = uni.getStorageSync('userInfo'); doctorName = u?.name || ''
      } catch (e) {}
      const visitor = []
      const employee = []
      records.forEach(r => {
        const id = r.identity || '游客'
        const obj = {
          name: r.name || '',
          diseaseName: r.diseaseName || r.diagnosis || r.chiefComplaint || '未知',
          location: r.injuryLocation || '',
          visitTime: r.visitDateTime || r.createTime || '',
          isOutcall: r.isOutcall || r.visitType === 'outcall',
          doctorName
        }
        if (id === '游客') visitor.push(obj); else if (id === '员工') employee.push(obj)
      })
      return { visitor, employee }
    },
    // 生成员工/游客汇总
    generateSummaries() {
      const initCounts = () => {
        const obj = {}
        this.diseaseList.forEach(name => { obj[name] = 0 })
        return obj
      }
      const normalize = (name) => {
        if (!name) return '其他'
        const found = this.diseaseList.find(d => name.indexOf(d) !== -1)
        return found || '其他'
      }
      const build = (rows) => {
        const counts = initCounts()
        ;(rows || []).forEach(item => {
          const key = normalize(item.diseaseName)
          counts[key] = (counts[key] || 0) + 1
        })
        return counts
      }
      this.visitorSummary = build(this.tableData?.visitor || [])
      this.employeeSummary = build(this.tableData?.employee || [])
    },
    
    // 编辑日报文本
    editReportText() {
      this.isEditingText = !this.isEditingText
      if (!this.isEditingText) {
        // 退出编辑模式时保存
        uni.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        })
      }
    },

    // 切换表格编辑模式
    toggleEditTable(type) {
      if (type === 'visitor') {
        this.isEditingVisitor = !this.isEditingVisitor
      } else if (type === 'employee') {
        this.isEditingEmployee = !this.isEditingEmployee
      }
      
      if ((type === 'visitor' && !this.isEditingVisitor) || 
          (type === 'employee' && !this.isEditingEmployee)) {
        // 退出编辑模式时保存
        uni.showToast({
          title: '已保存',
          icon: 'success',
          duration: 1000
        })
      }
    },

    // 复制表格（Excel格式）
    copyTable(type) {
      if (!this.tableData) {
        uni.showToast({
          title: '暂无表格数据',
          icon: 'none'
        })
        return
      }

      const data = type === 'visitor' ? this.tableData.visitor : this.tableData.employee
      if (!data || data.length === 0) {
        uni.showToast({
          title: '暂无数据',
          icon: 'none'
        })
        return
      }

      // 生成Excel格式的表格文本（制表符分隔）
      let text = type === 'visitor' ? '游客接诊明细：\n' : '员工接诊明细：\n'
      // 表头（使用制表符分隔）
      text += '疾病名称\t地点\t出诊\t接诊医生\n'
      
      // 数据行（使用制表符分隔）
      data.forEach(item => {
        const disease = item.diseaseName || '-'
        const location = item.location || '-'
        const outcall = item.isOutcall ? '是' : '否'
        const doctor = item.doctorName || '-'
        text += `${disease}\t${location}\t${outcall}\t${doctor}\n`
      })

      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: `已复制${type === 'visitor' ? '游客' : '员工'}数据（可粘贴到Excel）`,
            icon: 'success',
            duration: 2000
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },
    
    // 复制汇总数据（只复制数据，不复制疾病名列）
    copySummary(type, orientation = 'horizontal') {
      const summary = type === 'visitor' ? this.visitorSummary : this.employeeSummary
      if (!summary) {
        uni.showToast({ title: '暂无汇总数据', icon: 'none' })
        return
      }
      const values = this.diseaseList.map(name => String(summary[name] ?? 0))
      const text = orientation === 'horizontal'
        ? values.join('\t')   // 一行，制表符分隔
        : values.join('\n')   // 多行，一列
      
      uni.setClipboardData({
        data: text,
        success: () => {
          uni.showToast({
            title: `已复制${type === 'visitor' ? '游客' : '员工'}汇总数据`,
            icon: 'success'
          })
        }
      })
    },
    
    // 导出CSV（Excel可直接打开）
    exportCSV() {
      const toCSV = (title, summary) => {
        let csv = `${title}\n疾病名称,次数\n`
        this.diseaseList.forEach(name => {
          csv += `${name},${summary[name] ?? 0}\n`
        })
        return csv + '\n'
      }
      const vCSV = toCSV('游客汇总', this.visitorSummary || {})
      const eCSV = toCSV('员工汇总', this.employeeSummary || {})
      const content = vCSV + eCSV
      
      try {
        const fs = wx.getFileSystemManager()
        const filePath = `${wx.env.USER_DATA_PATH}/daily_report_${Date.now()}.csv`
        fs.writeFile({
          filePath,
          data: content,
          encoding: 'utf8',
          success: () => {
            wx.openDocument({
              filePath,
              fileType: 'csv',
              showMenu: true
            })
          },
          fail: () => {
            // 回退为复制
            uni.setClipboardData({
              data: content,
              success: () => uni.showToast({ title: '已复制CSV文本', icon: 'success' })
            })
          }
        })
      } catch (e) {
        // 不支持文件系统时，复制
        uni.setClipboardData({
          data: content,
          success: () => uni.showToast({ title: '已复制CSV文本', icon: 'success' })
        })
      }
    },

    // ================= 模板导出（指定列顺序） =================
    getTemplateHeader() {
      // 固定顺序（含两个“地点”）
      return ['日期/受伤类型','扭伤','擦伤','地点','烫伤','磕伤','冻伤','腹泻','头晕','头痛','感冒','脱臼','骨折','地点','过敏','痛经','测血压','其他','合计','接诊医生','备注']
    },
    getTemplateMapping() {
      // 关键词映射（若匹配多个，以首次匹配为准）
      return {
        '扭伤': ['扭伤'],
        '擦伤': ['擦伤','擦破'],
        '烫伤': ['烫伤','烫热伤'],
        '磕伤': ['磕伤','撞伤','磕碰','挫伤'],
        '冻伤': ['冻伤'],
        '腹泻': ['腹泻','拉肚','肠炎','肠胃炎'],
        '头晕': ['头晕'],
        '头痛': ['头痛','头疼'],
        '感冒': ['感冒','上呼吸道感染'],
        '脱臼': ['脱臼','关节脱位'],
        '骨折': ['骨折'],
        '过敏': ['过敏','荨麻疹','皮疹'],
        '痛经': ['痛经'],
        '测血压': ['测血压','血压','量血压']
      }
    },
    // 构建一行数据（不含表头）
    buildTemplateRow(type) {
      const rows = type === 'visitor' ? (this.tableData?.visitor || []) : (this.tableData?.employee || [])
      const mapping = this.getTemplateMapping()
      const keys = Object.keys(mapping)
      const counts = {}
      keys.forEach(k => counts[k] = 0)
      let other = 0
      // 地点（擦伤、骨折）各取出现次数最多的一个地点
      const locCountFor = (diseaseKey) => {
        const m = new Map()
        rows.forEach(r => {
          const disease = String(r.diseaseName || '')
          const location = (r.location || '').trim()
          const matched = mapping[diseaseKey].some(k => disease.indexOf(k) !== -1)
          if (matched && location) {
            m.set(location, (m.get(location) || 0) + 1)
          }
        })
        let top = ''
        let max = 0
        m.forEach((v, k) => { if (v > max) { max = v; top = k } })
        return top
      }
      const loc擦伤 = locCountFor('擦伤')
      const loc骨折 = locCountFor('骨折')
      // 统计
      rows.forEach(r => {
        const name = String(r.diseaseName || '')
        let matchedKey = ''
        for (const k of keys) {
          if (mapping[k].some(w => name.indexOf(w) !== -1)) { matchedKey = k; break }
        }
        if (matchedKey) counts[matchedKey]++
        else other++
      })
      // 医生
      let doctorName = ''
      try {
        const u = uni.getStorageSync('userInfo'); doctorName = u?.name || ''
      } catch (e) {}
      // 日期
      const dateText = this.reportDate || ''
      // 备注：收集归入“其他”的原疾病名（去重+次数）
      const otherMap = new Map()
      rows.forEach(r => {
        const name = String(r.diseaseName || '')
        const isOther = !keys.some(k => mapping[k].some(w => name.indexOf(w) !== -1))
        if (isOther && name) {
          otherMap.set(name, (otherMap.get(name) || 0) + 1)
        }
      })
      const remarkParts = []
      otherMap.forEach((v,k) => remarkParts.push(`${k}${v}人`))
      
      // 收集出诊信息
      const outcallMap = new Map()
      let outcallTotal = 0
      rows.forEach(r => {
        const isOutcall = r.isOutcall || false
        const location = (r.location || '').trim()
        if (isOutcall) {
          outcallTotal++
          if (location) {
            outcallMap.set(location, (outcallMap.get(location) || 0) + 1)
          }
        }
      })
      
      // 构建备注文本
      let remark = ''
      if (remarkParts.length > 0) {
        remark = remarkParts.join('，')
      }
      if (outcallTotal > 0) {
        const outcallParts = []
        outcallMap.forEach((v, k) => outcallParts.push(`${k}${v}次`))
        const outcallText = `共计出诊${outcallTotal}次` + (outcallParts.length > 0 ? `，${outcallParts.join('，')}` : '')
        remark = remark ? `${remark}。${outcallText}` : outcallText
      }
      
      // 合计
      const total = rows.length
      
      // 格式化函数：0显示为空字符串
      const formatCount = (count) => count === 0 ? '' : count
      
      // 如果当日无记录，所有数据列都为空
      if (total === 0) {
        return [
          dateText,     // 日期/受伤类型
          '', '', '',   // 扭伤、擦伤、地点
          '', '', '',   // 烫伤、磕伤、冻伤
          '', '', '',   // 腹泻、头晕、头痛
          '', '', '',   // 感冒、脱臼、骨折
          '',           // 地点
          '', '', '',   // 过敏、痛经、测血压
          '',           // 其他
          '',           // 合计（0时也显示为空）
          doctorName,
          ''            // 备注
        ]
      }
      
      // 输出顺序
      return [
        dateText,                      // 日期/受伤类型
        formatCount(counts['扭伤']),
        formatCount(counts['擦伤']),
        loc擦伤 || '',
        formatCount(counts['烫伤']),
        formatCount(counts['磕伤']),
        formatCount(counts['冻伤']),
        formatCount(counts['腹泻']),
        formatCount(counts['头晕']),
        formatCount(counts['头痛']),
        formatCount(counts['感冒']),
        formatCount(counts['脱臼']),
        formatCount(counts['骨折']),
        loc骨折 || '',
        formatCount(counts['过敏']),
        formatCount(counts['痛经']),
        formatCount(counts['测血压']),
        formatCount(other),            // 其他（0时显示为空）
        total,                         // 合计（总数）
        doctorName,
        remark                         // 备注：详细列出"其他"项目
      ]
    },
    copyTemplateRow(type) {
      const row = this.buildTemplateRow(type)
      const text = row.map(v => String(v ?? '')).join('\t')
      uni.setClipboardData({
        data: text,
        success: () => uni.showToast({ title: `已复制${type==='visitor'?'游客':'员工'}模板数据`, icon: 'success' })
      })
    },
    exportTemplateCSV(type) {
      const header = this.getTemplateHeader().join(',')
      const row = this.buildTemplateRow(type).map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')
      const csv = `${header}\n${row}\n`
      try {
        const fs = wx.getFileSystemManager()
        const filePath = `${wx.env.USER_DATA_PATH}/daily_${type}_${Date.now()}.csv`
        fs.writeFile({
          filePath, data: csv, encoding: 'utf8',
          success: () => wx.openDocument({ filePath, fileType: 'csv', showMenu: true })
        })
      } catch (e) {
        uni.setClipboardData({
          data: csv,
          success: () => uni.showToast({ title: '已复制CSV文本', icon: 'success' })
        })
      }
    },
    // 复制日报
    copyReport() {
      if (!this.reportContent) {
        uni.showToast({
          title: '暂无内容可复制',
          icon: 'none'
        })
        return
      }

      // 只复制文本日报内容，不包含表格
      uni.setClipboardData({
        data: this.reportContent.trim(),
        success: () => {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'success',
            duration: 2000
          })
        },
        fail: () => {
          uni.showToast({
            title: '复制失败',
            icon: 'none'
          })
        }
      })
    },

    // 返回
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.daily-report-page {
  min-height: 100vh;
  // 使用统一的蓝色渐变背景
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding-top: 24rpx;
  padding-bottom: 130rpx;
}

.report-container {
  max-width: 702rpx;
  margin: 0 auto;
  padding: 24rpx 24rpx 40rpx;
}

.report-card {
  background: #ffffff;
  border-radius: 26rpx;
  padding: 32rpx 30rpx;
  box-shadow: 0 22rpx 60rpx rgba(15, 23, 42, 0.18);
  margin-bottom: 8rpx;

  .report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30rpx;
    padding-bottom: 20rpx;
    border-bottom: 2rpx solid #f0f0f0;

    .report-date {
      font-size: 32rpx;
      font-weight: bold;
      color: #0f172a;
    }

    .report-location {
      font-size: 28rpx;
      color: #0d9488;
      font-weight: 500;
      margin-left: 20rpx;
    }

    .header-actions {
      display: flex;
      gap: 10rpx;
    }
  }

  .report-content {
    .report-text {
      display: block;
      font-size: 30rpx;
      line-height: 2;
      color: #111827;
      white-space: pre-wrap;
      word-break: break-all;
    }

    .report-textarea {
      width: 100%;
      min-height: 200rpx;
      font-size: 30rpx;
      line-height: 2;
      color: #111827;
      padding: 20rpx;
      border: 2rpx solid #e0e0e0;
      border-radius: 12rpx;
      background: #fafafa;
    }
  }
}

.table-card {
  background: #ffffff;
  border-radius: 24rpx;
  padding: 28rpx 26rpx;
  box-shadow: 0 20rpx 50rpx rgba(15, 23, 42, 0.16);
  margin-bottom: 24rpx;

  .table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20rpx;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f0f0f0;

    .table-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #0f172a;
    }

    .table-actions {
      display: flex;
      gap: 10rpx;
    }
  }

  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    min-width: 600rpx;
    border-collapse: collapse;

    .table-row {
      display: flex;
      border-bottom: 1rpx solid #f0f0f0;

      &.header-row {
        background: linear-gradient(135deg, #14b8a6 0%, #22c1c3 100%);
        border-radius: 8rpx 8rpx 0 0;
      }

      .table-cell {
        flex: 1;
        padding: 20rpx 12rpx;
        font-size: 26rpx;
        color: #111827;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        word-break: break-all;

        &.header-cell {
          color: #ffffff;
          font-weight: bold;
          font-size: 28rpx;
        }

        .table-input {
          width: 100%;
          padding: 8rpx 12rpx;
          font-size: 26rpx;
          border: 1rpx solid #e0e0e0;
          border-radius: 8rpx;
          background: #fafafa;
          text-align: center;
        }
      }
    }
  }
}

.action-btn {
  padding: 8rpx 16rpx;
  background: rgba(20, 184, 166, 0.1);
  border-radius: 8rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  &.small {
    padding: 6rpx 12rpx;
  }

  .action-icon {
    font-size: 28rpx;
  }
}

.stats-card {
  background: #ffffff;
  border-radius: 30rpx;
  padding: 28rpx 26rpx;
  box-shadow: 0 25rpx 60rpx rgba(15, 23, 42, 0.20);
  margin-bottom: 8rpx;

  .stats-title {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    margin-bottom: 24rpx;
    padding-bottom: 16rpx;
    border-bottom: 2rpx solid #f0f0f0;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20rpx;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24rpx;
      background: linear-gradient(135deg, #f0f4f8 0%, #ffffff 100%);
      border-radius: 16rpx;
      border: 2rpx solid #e8e8e8;

      .stat-value {
        font-size: 48rpx;
        font-weight: bold;
        color: #667eea;
        margin-bottom: 8rpx;
      }

      .stat-label {
        font-size: 24rpx;
        color: #666666;
      }
    }
  }
}

.template-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12rpx;
  margin-top: 16rpx;
}
.mini-btn {
  padding: 16rpx 12rpx;
  background: #f5f7ff;
  border: 2rpx solid #c7d2fe;
  color: #3730a3;
  border-radius: 12rpx;
  font-size: 26rpx;
}

.summary-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12rpx 16rpx;
}
.summary-row {
  display: contents;
}
.summary-disease {
  font-size: 28rpx;
  color: #475569;
}
.summary-count {
  font-size: 28rpx;
  color: #1e3a8a;
  font-weight: 700;
  text-align: right;
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  background: #ffffff;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  .action-button {
    flex: 1;
    padding: 20rpx 24rpx;
    border-radius: 999rpx;
    font-size: 28rpx;
    font-weight: bold;
    border: none;

    &.secondary {
      background: linear-gradient(135deg, #00c9ff 0%, #00e0b8 100%);
      color: #ffffff;
    }

    &.primary {
      background: linear-gradient(135deg, #00c9ff 0%, #00e0b8 100%);
      color: #ffffff;
    }
  }
}
</style>
