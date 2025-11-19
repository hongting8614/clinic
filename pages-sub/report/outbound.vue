<template>
  <!-- ...上方已有表单内容... -->
  <view>
    <view v-if="!items.length" class="empty-tip">
      暂无药品，请点击下方按钮添加
    </view>
    <u-button type="primary" icon="plus" @click="drugPickerVisible = true">添加药品</u-button>
    <view v-for="(item, idx) in items" :key="item.id || (item.name+item.batch)" class="detail-row">
      <view>{{item.name}} | 批号:{{item.batch}} | {{item.quantity}} {{item.unit}}</view>
      <u-button size="mini" @click="editDrug(idx)">编辑</u-button>
      <u-button size="mini" type="error" @click="deleteDrug(idx)">删除</u-button>
    </view>
    <DrugPicker :visible.sync="drugPickerVisible" :drugList="drugList" @select="onSelectDrug" />
    <QuantityBatchInput v-if="inputDialogVisible" :drug="currentDrug" @confirm="onDrugConfirm" @cancel="closeInputDialog" />
  </view>
  <!-- ...下方继续已有内容... -->
</template>
<script>
import DrugPicker from '@/components/DrugPicker.vue'
import QuantityBatchInput from '@/components/QuantityBatchInput.vue'
export default {
  components: { DrugPicker, QuantityBatchInput },
  data() {
    return {
      // ...existing...
      items: [],
      drugPickerVisible: false,
      inputDialogVisible: false,
      currentDrug: null
    }
  },
  methods: {
    onSelectDrug(drug) {
      this.currentDrug = { ...drug, quantity: 1, batch: '', unit: drug.unit }
      this.inputDialogVisible = true
      this.drugPickerVisible = false
    },
    onDrugConfirm(data) {
      this.items.push(data)
      this.inputDialogVisible = false
    },
    closeInputDialog() {
      this.inputDialogVisible = false
    },
    editDrug(idx) {
      this.currentDrug = { ...this.items[idx] }
      this.inputDialogVisible = true
      this.editIndex = idx
    },
    deleteDrug(idx) {
      this.items.splice(idx, 1)
    }
  }
  // ...existing code...
}
</script>


