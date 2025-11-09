<template>
  <u-popup v-model="show" mode="bottom" :border-radius="20">
    <view class="supplier-picker">
      <!-- 头部 -->
      <view class="picker-header">
        <text class="header-title">选择供应商</text>
        <text class="header-close" @click="close">×</text>
      </view>
      
      <!-- 搜索框 -->
      <view class="search-box">
        <input 
          class="search-input"
          v-model="searchKeyword"
          placeholder="搜索供应商名称或编码"
          @input="onSearch"
        />
        <text class="search-icon">🔍</text>
      </view>
      
      <!-- 快捷操作 -->
      <view class="quick-actions">
        <text class="action-btn" @click="addNewSupplier">+ 新建供应商</text>
      </view>
      
      <!-- 供应商列表 -->
      <scroll-view class="supplier-list" scroll-y>
        <view 
          v-for="item in filteredList" 
          :key="item._id"
          class="supplier-item"
          @click="selectSupplier(item)"
        >
          <view class="item-main">
            <text class="item-name">{{ item.name }}</text>
            <text class="item-code">{{ item.code }}</text>
          </view>
          <view class="item-info">
            <text class="item-contact">{{ item.contact || '-' }}</text>
            <text class="item-phone">{{ item.phone || '-' }}</text>
          </view>
        </view>
        
        <!-- 空状态 -->
        <view v-if="filteredList.length === 0" class="empty-state">
          <text class="empty-icon">📦</text>
          <text class="empty-text">暂无供应商</text>
          <text class="empty-hint" @click="addNewSupplier">点击新建供应商</text>
        </view>
      </scroll-view>
    </view>
  </u-popup>
</template>

<script>
export default {
  name: 'SupplierPicker',
  
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      show: false,
      searchKeyword: '',
      supplierList: [],
      filteredList: []
    }
  },
  
  watch: {
    value(val) {
      this.show = val
      if (val) {
        this.loadSuppliers()
      }
    },
    show(val) {
      this.$emit('input', val)
    }
  },
  
  methods: {
    // 加载供应商列表
    async loadSuppliers() {
      try {
        const db = wx.cloud.database()
        const res = await db.collection('suppliers')
          .where({ status: 'active' })
          .orderBy('name', 'asc')
          .get()
        
        this.supplierList = res.data
        this.filteredList = res.data
      } catch (error) {
        console.error('加载供应商失败:', error)
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 搜索供应商
    onSearch() {
      const keyword = this.searchKeyword.trim().toLowerCase()
      
      if (!keyword) {
        this.filteredList = this.supplierList
        return
      }
      
      this.filteredList = this.supplierList.filter(item => {
        return (
          item.name.toLowerCase().includes(keyword) ||
          (item.code && item.code.toLowerCase().includes(keyword)) ||
          (item.contact && item.contact.toLowerCase().includes(keyword))
        )
      })
    },
    
    // 选择供应商
    selectSupplier(item) {
      this.$emit('select', item)
      this.close()
    },
    
    // 新建供应商
    addNewSupplier() {
      this.$emit('add-new')
      this.close()
    },
    
    // 关闭弹窗
    close() {
      this.show = false
      this.searchKeyword = ''
    }
  }
}
</script>

<style scoped>
.supplier-picker {
  height: 500px;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.header-title {
  font-size: 18px;
  font-weight: bold;
}

.header-close {
  font-size: 30px;
  color: #999;
  line-height: 1;
}

.search-box {
  position: relative;
  padding: 10px 20px;
  background: #f5f5f5;
}

.search-input {
  width: 100%;
  height: 40px;
  padding: 0 40px 0 15px;
  background: #fff;
  border-radius: 20px;
  font-size: 14px;
}

.search-icon {
  position: absolute;
  right: 35px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
}

.quick-actions {
  padding: 10px 20px;
  border-bottom: 1px solid #eee;
}

.action-btn {
  display: inline-block;
  padding: 5px 15px;
  background: #07c160;
  color: #fff;
  border-radius: 15px;
  font-size: 14px;
}

.supplier-list {
  flex: 1;
  padding: 10px 0;
}

.supplier-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.supplier-item:active {
  background: #f5f5f5;
}

.item-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.item-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.item-code {
  font-size: 12px;
  color: #999;
  padding: 2px 8px;
  background: #f0f0f0;
  border-radius: 3px;
}

.item-info {
  display: flex;
  gap: 15px;
}

.item-contact,
.item-phone {
  font-size: 13px;
  color: #666;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  display: block;
  font-size: 60px;
  margin-bottom: 15px;
}

.empty-text {
  display: block;
  font-size: 16px;
  color: #999;
  margin-bottom: 10px;
}

.empty-hint {
  display: block;
  font-size: 14px;
  color: #07c160;
  text-decoration: underline;
}
</style>







