<template>
  <view class="container">
    <view class="header">
      <text class="title">📦 数据迁移 v3.14</text>
      <text class="subtitle">请按顺序点击按钮</text>
    </view>
    
    <!-- 步骤指示 -->
    <view class="steps">
      <view class="step" :class="{ active: currentStep >= 1 }">
        <text class="step-num">1</text>
        <text class="step-text">环境检查</text>
      </view>
      <view class="step" :class="{ active: currentStep >= 2 }">
        <text class="step-num">2</text>
        <text class="step-text">执行迁移</text>
      </view>
      <view class="step" :class="{ active: currentStep >= 3 }">
        <text class="step-num">3</text>
        <text class="step-text">验证结果</text>
      </view>
    </view>
    
    <!-- 操作按钮 -->
    <view class="actions">
      <button 
        class="btn btn-info" 
        @click="checkEnvironment"
        :disabled="loading"
      >
        1️⃣ 环境检查
      </button>
      
      <button 
        class="btn btn-primary" 
        @click="runMigration"
        :disabled="loading || currentStep < 1"
      >
        2️⃣ 开始迁移
      </button>
      
      <button 
        class="btn btn-success" 
        @click="validateMigration"
        :disabled="loading || currentStep < 2"
      >
        3️⃣ 验证结果
      </button>
      
      <button 
        class="btn btn-warning" 
        @click="clearLog"
        :disabled="loading"
      >
        🗑️ 清空日志
      </button>
    </view>
    
    <!-- 日志显示 -->
    <view class="log-container">
      <text class="log-title">📋 执行日志</text>
      <scroll-view class="log-content" scroll-y :scroll-into-view="scrollToView">
        <text class="log-text">{{ log }}</text>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      log: '准备就绪，请开始操作...\n',
      loading: false,
      currentStep: 0,
      scrollToView: ''
    }
  },
  
  methods: {
    addLog(message) {
      const time = new Date().toLocaleTimeString()
      this.log += `[${time}] ${message}\n`
      // 自动滚动到底部
      this.$nextTick(() => {
        this.scrollToView = 'log-bottom'
      })
    },
    
    clearLog() {
      this.log = '日志已清空\n'
      this.currentStep = 0
    },
    
    // 步骤1: 环境检查
    async checkEnvironment() {
      this.loading = true
      this.addLog('━'.repeat(30))
      this.addLog('开始环境检查...')
      
      try {
        const db = wx.cloud.database()
        
        // 1. 检查药库配置
        this.addLog('检查药库配置...')
        const locations = await db.collection('locations')
          .where({ code: 'drug_storage' })
          .get()
        
        if (locations.data.length > 0) {
          this.addLog('✅ 药库配置已存在')
        } else {
          this.addLog('⚠️ 药库配置不存在，迁移时会自动创建')
        }
        
        // 2. 检查药品数量
        const drugs = await db.collection('drugs').count()
        this.addLog(`📊 药品档案: ${drugs.total} 条`)
        
        // 3. 检查库存数量
        const stock = await db.collection('stock').count()
        this.addLog(`📦 库存记录: ${stock.total} 条`)
        
        // 4. 检查云函数
        this.addLog('检查云函数...')
        
        try {
          const inTest = await wx.cloud.callFunction({
            name: 'inRecords',
            data: { action: 'getCounts' }
          })
          this.addLog(inTest.result.success ? '✅ inRecords 正常' : '❌ inRecords 异常')
        } catch (e) {
          this.addLog('❌ inRecords 调用失败: ' + e.errMsg)
        }
        
        try {
          const outTest = await wx.cloud.callFunction({
            name: 'outRecords',
            data: { action: 'getCounts' }
          })
          this.addLog(outTest.result.success ? '✅ outRecords 正常' : '❌ outRecords 异常')
        } catch (e) {
          this.addLog('❌ outRecords 调用失败: ' + e.errMsg)
        }
        
        this.addLog('━'.repeat(30))
        this.addLog('✅ 环境检查完成，可以开始迁移')
        this.currentStep = 1
        
      } catch (error) {
        this.addLog(`❌ 环境检查失败: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    
    // 步骤2: 执行迁移
    async runMigration() {
      this.loading = true
      this.addLog('━'.repeat(30))
      this.addLog('开始数据迁移...')
      
      try {
        const db = wx.cloud.database()
        const _ = db.command
        
        // 迁移统计
        let successCount = 0
        let failCount = 0
        
        // 1. 添加药库配置
        this.addLog('步骤1: 添加药库配置...')
        try {
          const existing = await db.collection('locations')
            .where({ code: 'drug_storage' })
            .get()
          
          if (existing.data.length === 0) {
            await db.collection('locations').add({
              data: {
                code: 'drug_storage',
                name: '药库',
                icon: '🏥',
                type: 'storage',
                status: 'active',
                sort: 0,
                createTime: new Date(),
                updateTime: new Date()
              }
            })
            this.addLog('✅ 药库配置添加成功')
          } else {
            this.addLog('ℹ️ 药库配置已存在，跳过')
          }
        } catch (error) {
          this.addLog(`❌ 添加药库配置失败: ${error.message}`)
        }
        
        // 2. 迁移药品档案
        this.addLog('步骤2: 迁移药品档案...')
        const drugs = await db.collection('drugs').get()
        this.addLog(`找到 ${drugs.data.length} 个药品`)
        
        for (let i = 0; i < drugs.data.length; i++) {
          const drug = drugs.data[i]
          try {
            await db.collection('drugs').doc(drug._id).update({
              data: {
                specification: drug.spec || drug.specification || '',
                updateTime: new Date()
              }
            })
            successCount++
            
            if ((i + 1) % 10 === 0) {
              this.addLog(`进度: ${i + 1}/${drugs.data.length}`)
            }
          } catch (error) {
            failCount++
            this.addLog(`❌ 药品 ${drug.name} 迁移失败`)
          }
        }
        
        this.addLog(`✅ 药品迁移完成: 成功 ${successCount}, 失败 ${failCount}`)
        
        // 3. 迁移库存数据
        this.addLog('步骤3: 迁移库存数据...')
        const stocks = await db.collection('stock').get()
        this.addLog(`找到 ${stocks.data.length} 条库存`)
        
        successCount = 0
        failCount = 0
        
        for (let i = 0; i < stocks.data.length; i++) {
          const stock = stocks.data[i]
          try {
            await db.collection('stock').doc(stock._id).update({
              data: {
                specification: stock.spec || stock.specification || '',
                lockQuantity: stock.lockQuantity || 0,
                updateTime: new Date()
              }
            })
            successCount++
            
            if ((i + 1) % 10 === 0) {
              this.addLog(`进度: ${i + 1}/${stocks.data.length}`)
            }
          } catch (error) {
            failCount++
          }
        }
        
        this.addLog(`✅ 库存迁移完成: 成功 ${successCount}, 失败 ${failCount}`)
        
        this.addLog('━'.repeat(30))
        this.addLog('🎉 数据迁移完成！')
        this.currentStep = 2
        
      } catch (error) {
        this.addLog(`❌ 迁移失败: ${error.message}`)
      } finally {
        this.loading = false
      }
    },
    
    // 步骤3: 验证结果
    async validateMigration() {
      this.loading = true
      this.addLog('━'.repeat(30))
      this.addLog('开始验证迁移结果...')
      
      try {
        const db = wx.cloud.database()
        const _ = db.command
        
        // 1. 验证药库配置
        const locations = await db.collection('locations')
          .where({ code: 'drug_storage' })
          .get()
        
        if (locations.data.length > 0) {
          this.addLog('✅ 药库配置存在')
        } else {
          this.addLog('❌ 药库配置不存在')
        }
        
        // 2. 验证药品档案
        const drugs = await db.collection('drugs').get()
        const drugsWithSpec = drugs.data.filter(d => d.specification).length
        this.addLog(`📊 药品档案: ${drugsWithSpec}/${drugs.data.length} 包含 specification 字段`)
        
        // 3. 验证库存数据
        const stocks = await db.collection('stock').get()
        const stocksWithSpec = stocks.data.filter(s => s.specification).length
        this.addLog(`📦 库存数据: ${stocksWithSpec}/${stocks.data.length} 包含 specification 字段`)
        
        this.addLog('━'.repeat(30))
        
        if (locations.data.length > 0 && 
            drugsWithSpec === drugs.data.length && 
            stocksWithSpec === stocks.data.length) {
          this.addLog('🎉 验证通过！所有数据迁移成功')
          this.currentStep = 3
          
          // 显示成功提示
          wx.showModal({
            title: '迁移成功',
            content: '数据迁移已完成，可以开始测试！',
            showCancel: false
          })
        } else {
          this.addLog('⚠️ 部分验证未通过，请检查')
        }
        
      } catch (error) {
        this.addLog(`❌ 验证失败: ${error.message}`)
      } finally {
        this.loading = false
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

.steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.step {
  flex: 1;
  background: #fff;
  padding: 15px 10px;
  border-radius: 10px;
  text-align: center;
  margin: 0 5px;
  opacity: 0.5;
}

.step.active {
  opacity: 1;
  border: 2px solid #07c160;
}

.step-num {
  display: block;
  width: 30px;
  height: 30px;
  line-height: 30px;
  background: #f0f0f0;
  border-radius: 50%;
  margin: 0 auto 5px;
  font-weight: bold;
}

.step.active .step-num {
  background: #07c160;
  color: #fff;
}

.step-text {
  font-size: 12px;
  display: block;
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

.btn-info {
  background: #1890ff;
}

.btn-primary {
  background: #07c160;
}

.btn-success {
  background: #52c41a;
}

.btn-warning {
  background: #fa8c16;
}

.log-container {
  background: #fff;
  border-radius: 10px;
  padding: 15px;
  height: 400px;
  display: flex;
  flex-direction: column;
}

.log-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
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







