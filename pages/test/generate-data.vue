<template>
  <view class="container">
    <view class="header">
      <text class="title">🚀 v3.14 测试数据生成</text>
      <text class="subtitle">自动生成符合双轨制的测试数据</text>
    </view>
    
    <!-- 数据预览 -->
    <view class="preview-section">
      <view class="preview-card">
        <text class="preview-label">将生成的数据：</text>
        <view class="preview-list">
          <text class="preview-item">📍 3个地点（药库、陆地园区、水上园区）</text>
          <text class="preview-item">🏢 4个供应商</text>
          <text class="preview-item">💊 14种药品</text>
          <text class="preview-item">📦 药库库存（28-42条，包装单位）</text>
          <text class="preview-item">🏢 园区库存（约16-24条，最小单位）</text>
        </view>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="actions">
      <button 
        class="btn btn-primary" 
        @click="generateData"
        :disabled="loading"
      >
        {{ loading ? '生成中...' : '🚀 一键生成测试数据' }}
      </button>
      
      <button 
        class="btn btn-danger" 
        @click="clearData"
        :disabled="loading"
      >
        🗑️ 清空测试数据
      </button>
      
      <button 
        class="btn btn-info" 
        @click="showStats"
        :disabled="loading"
      >
        📊 查看统计
      </button>
    </view>
    
    <!-- 日志显示 -->
    <view class="log-container">
      <view class="log-header">
        <text class="log-title">📋 执行日志</text>
        <text class="log-clear" @click="clearLog">清空</text>
      </view>
      <scroll-view class="log-content" scroll-y>
        <text class="log-text">{{ log }}</text>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      log: '准备就绪，点击按钮开始生成测试数据...\n',
      loading: false
    }
  },
  
  methods: {
    addLog(message) {
      const time = new Date().toLocaleTimeString()
      this.log += `[${time}] ${message}\n`
    },
    
    clearLog() {
      this.log = '日志已清空\n'
    },
    
    // 生成测试数据
    async generateData() {
      this.loading = true
      this.addLog('━'.repeat(30))
      this.addLog('🚀 开始生成测试数据...')
      
      try {
        const db = wx.cloud.database()
        
        // 步骤1: 添加地点
        this.addLog('\n📍 步骤1: 添加地点配置...')
        await this.addLocations(db)
        
        // 步骤2: 添加供应商
        this.addLog('\n🏢 步骤2: 添加供应商...')
        await this.addSuppliers(db)
        
        // 步骤3: 添加药品
        this.addLog('\n💊 步骤3: 添加药品档案...')
        const drugs = await this.addDrugs(db)
        
        // 步骤4: 生成药库库存
        this.addLog('\n📦 步骤4: 生成药库库存...')
        await this.generateDrugStorageStock(db, drugs)
        
        // 步骤5: 生成园区库存
        this.addLog('\n🏢 步骤5: 生成园区库存...')
        await this.generateParkStock(db, drugs)
        
        // 步骤6: 显示统计
        this.addLog('\n📊 步骤6: 数据统计...')
        await this.showStatistics(db)
        
        this.addLog('\n🎉 测试数据生成完成！')
        
        wx.showModal({
          title: '生成成功',
          content: '测试数据已生成，可以开始测试！',
          showCancel: false
        })
        
      } catch (error) {
        this.addLog(`\n❌ 生成失败: ${error.message}`)
        wx.showToast({
          title: '生成失败',
          icon: 'none'
        })
      } finally {
        this.loading = false
      }
    },
    
    // 添加地点
    async addLocations(db) {
      const locations = [
        { code: 'drug_storage', name: '药库', icon: '🏥', type: 'storage' },
        { code: 'land_park', name: '陆地园区', icon: '🏢', type: 'park' },
        { code: 'water_park', name: '水上园区', icon: '🏊', type: 'park' }
      ]
      
      for (let loc of locations) {
        const exists = await db.collection('locations')
          .where({ code: loc.code })
          .count()
        
        if (exists.total === 0) {
          await db.collection('locations').add({
            data: {
              ...loc,
              status: 'active',
              sort: locations.indexOf(loc),
              createTime: new Date()
            }
          })
          this.addLog(`✅ 添加地点: ${loc.name}`)
        } else {
          this.addLog(`ℹ️ 地点已存在: ${loc.name}`)
        }
      }
    },
    
    // 添加供应商
    async addSuppliers(db) {
      const suppliers = [
        { name: '康美药业', code: 'SUP001', contact: '张经理', phone: '13800138000' },
        { name: '九州通医药', code: 'SUP002', contact: '李经理', phone: '13800138001' },
        { name: '华润医药', code: 'SUP003', contact: '王经理', phone: '13800138002' },
        { name: '国药集团', code: 'SUP004', contact: '赵经理', phone: '13800138003' }
      ]
      
      for (let sup of suppliers) {
        const exists = await db.collection('suppliers')
          .where({ code: sup.code })
          .count()
        
        if (exists.total === 0) {
          await db.collection('suppliers').add({
            data: {
              ...sup,
              status: 'active',
              createTime: new Date()
            }
          })
          this.addLog(`✅ 添加供应商: ${sup.name}`)
        } else {
          this.addLog(`ℹ️ 供应商已存在: ${sup.name}`)
        }
      }
    },
    
    // 添加药品
    async addDrugs(db) {
      const drugs = [
        { name: '阿莫西林胶囊', specification: '0.25g×24粒/盒', unit: '盒', price: 15.8, category: '抗生素' },
        { name: '头孢克肟片', specification: '0.1g×12片/盒', unit: '盒', price: 28.5, category: '抗生素' },
        { name: '布洛芬缓释胶囊', specification: '0.3g×20粒/盒', unit: '盒', price: 12.6, category: '解热镇痛' },
        { name: '对乙酰氨基酚片', specification: '0.5g×16片/盒', unit: '盒', price: 8.9, category: '解热镇痛' },
        { name: '氯雷他定片', specification: '10mg×10片/盒', unit: '盒', price: 18.5, category: '抗过敏' },
        { name: '小儿感冒糖浆', specification: '100ml/瓶', unit: '瓶', price: 15.2, category: '儿科用药' },
        { name: '复方甘草口服液', specification: '10ml×6支/盒', unit: '盒', price: 22.5, category: '呼吸系统' },
        { name: '蒲地蓝消炎口服液', specification: '10ml×12支/盒', unit: '盒', price: 35.8, category: '清热解毒' },
        { name: '青霉素钠注射液', specification: '80万单位×10支/盒', unit: '盒', price: 45.0, category: '抗生素' },
        { name: '维生素C注射液', specification: '2ml:0.5g×5支/盒', unit: '盒', price: 12.5, category: '维生素' },
        { name: '红霉素软膏', specification: '10g/支', unit: '支', price: 5.5, category: '外用药' },
        { name: '碘伏消毒液', specification: '500ml/瓶', unit: '瓶', price: 18.0, category: '消毒用品' },
        { name: '板蓝根颗粒', specification: '10g×20袋/盒', unit: '盒', price: 16.8, category: '中成药' },
        { name: '感冒清热颗粒', specification: '12g×9袋/盒', unit: '盒', price: 18.5, category: '中成药' }
      ]
      
      const addedDrugs = []
      
      for (let drug of drugs) {
        const exists = await db.collection('drugs')
          .where({ name: drug.name, specification: drug.specification })
          .get()
        
        if (exists.data.length === 0) {
          const result = await db.collection('drugs').add({
            data: {
              ...drug,
              status: 'active',
              createTime: new Date()
            }
          })
          addedDrugs.push({ _id: result._id, ...drug })
          this.addLog(`✅ 添加药品: ${drug.name}`)
        } else {
          addedDrugs.push({ _id: exists.data[0]._id, ...drug })
          this.addLog(`ℹ️ 药品已存在: ${drug.name}`)
        }
      }
      
      return addedDrugs
    },
    
    // 解析规格
    parseSpec(spec) {
      const pattern1 = /^([\d.]+)(\w+)×(\d+)(\w+)\/(\w+)$/
      const match1 = spec.match(pattern1)
      if (match1) {
        return {
          dosage: parseFloat(match1[1]),
          dosageUnit: match1[2],
          conversionRate: parseInt(match1[3]),
          minUnit: match1[4],
          packUnit: match1[5]
        }
      }
      
      const pattern2 = /^([\d.]+)(\w+)\/(\w+)$/
      const match2 = spec.match(pattern2)
      if (match2) {
        return {
          dosage: parseFloat(match2[1]),
          dosageUnit: match2[2],
          conversionRate: 1,
          minUnit: match2[2],
          packUnit: match2[3]
        }
      }
      
      return null
    },
    
    // 生成药库库存
    async generateDrugStorageStock(db, drugs) {
      let count = 0
      
      for (let drug of drugs) {
        const specInfo = this.parseSpec(drug.specification)
        if (!specInfo) continue
        
        const batchCount = Math.floor(Math.random() * 2) + 2
        
        for (let i = 0; i < batchCount; i++) {
          const batch = `LOT${Date.now().toString().slice(-8)}${i}`
          const quantity = Math.floor(Math.random() * 50) + 10
          const pricePerMin = specInfo.conversionRate > 0 
            ? (drug.price / specInfo.conversionRate).toFixed(4)
            : drug.price
          
          await db.collection('stock').add({
            data: {
              drugId: drug._id,
              drugName: drug.name,
              specification: drug.specification,
              specInfo: specInfo,
              location: 'drug_storage',
              batch: batch,
              productionDate: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000),
              expireDate: new Date(Date.now() + (Math.random() * 550 + 180) * 24 * 60 * 60 * 1000),
              quantity: quantity,
              unit: specInfo.packUnit,
              lockQuantity: 0,
              price: drug.price,
              pricePerMin: parseFloat(pricePerMin),
              status: 'normal',
              createTime: new Date()
            }
          })
          
          count++
        }
      }
      
      this.addLog(`✅ 生成药库库存: ${count} 条`)
    },
    
    // 生成园区库存
    async generateParkStock(db, drugs) {
      const parks = ['land_park', 'water_park']
      let totalCount = 0
      
      for (let park of parks) {
        const selectedDrugs = drugs
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(drugs.length * 0.6))
        
        let parkCount = 0
        
        for (let drug of selectedDrugs) {
          const specInfo = this.parseSpec(drug.specification)
          if (!specInfo) continue
          
          const batch = `LOT${Date.now().toString().slice(-8)}`
          const minQuantity = Math.floor(Math.random() * 100) + 20
          const pricePerMin = specInfo.conversionRate > 0 
            ? (drug.price / specInfo.conversionRate).toFixed(4)
            : drug.price
          
          await db.collection('stock').add({
            data: {
              drugId: drug._id,
              drugName: drug.name,
              specification: drug.specification,
              specInfo: specInfo,
              location: park,
              batch: batch,
              productionDate: new Date(Date.now() - Math.random() * 150 * 24 * 60 * 60 * 1000),
              expireDate: new Date(Date.now() + (Math.random() * 500 + 200) * 24 * 60 * 60 * 1000),
              quantity: minQuantity,
              unit: specInfo.minUnit,
              lockQuantity: 0,
              price: drug.price,
              pricePerMin: parseFloat(pricePerMin),
              status: 'normal',
              createTime: new Date()
            }
          })
          
          parkCount++
        }
        
        const parkName = park === 'land_park' ? '陆地园区' : '水上园区'
        this.addLog(`✅ ${parkName}库存: ${parkCount} 条`)
        totalCount += parkCount
      }
    },
    
    // 显示统计
    async showStatistics(db) {
      const locationCount = await db.collection('locations').count()
      this.addLog(`📍 地点数量: ${locationCount.total}`)
      
      const supplierCount = await db.collection('suppliers').count()
      this.addLog(`🏢 供应商数量: ${supplierCount.total}`)
      
      const drugCount = await db.collection('drugs').count()
      this.addLog(`💊 药品数量: ${drugCount.total}`)
      
      const stockCount = await db.collection('stock').count()
      this.addLog(`📦 库存记录: ${stockCount.total}`)
    },
    
    // 清空数据
    async clearData() {
      const confirm = await new Promise((resolve) => {
        wx.showModal({
          title: '确认清空',
          content: '此操作将删除所有库存数据，是否继续？',
          success: (res) => resolve(res.confirm)
        })
      })
      
      if (!confirm) return
      
      this.loading = true
      this.addLog('⚠️ 开始清空库存数据...')
      
      try {
        const db = wx.cloud.database()
        const res = await db.collection('stock').where({}).remove()
        this.addLog(`✅ 删除库存: ${res.removed} 条`)
        
        wx.showToast({
          title: '清空成功',
          icon: 'success'
        })
      } catch (error) {
        this.addLog(`❌ 清空失败: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    
    // 查看统计
    async showStats() {
      this.addLog('\n📊 查看数据统计...')
      try {
        const db = wx.cloud.database()
        await this.showStatistics(db)
      } catch (error) {
        this.addLog(`❌ 统计失败: ${error.message}`)
      }
    }
  }
}
</script>

<style scoped>
.container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
}

.preview-section {
  margin-bottom: 20px;
}

.preview-card {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
}

.preview-label {
  font-size: 16px;
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.preview-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-item {
  font-size: 14px;
  color: #666;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 5px;
}

.actions {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.btn {
  width: 100%;
  margin-bottom: 10px;
  padding: 15px;
  border: none;
  border-radius: 5px;
  color: #fff;
  font-size: 16px;
}

.btn[disabled] {
  opacity: 0.5;
}

.btn-primary {
  background: #07c160;
}

.btn-danger {
  background: #fa5151;
}

.btn-info {
  background: #1890ff;
}

.log-container {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.log-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.log-title {
  font-size: 16px;
  font-weight: bold;
}

.log-clear {
  font-size: 14px;
  color: #1890ff;
}

.log-content {
  flex: 1;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  font-family: monospace;
}

.log-text {
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>







