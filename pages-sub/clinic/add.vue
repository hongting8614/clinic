<template>
  <view class="clinic-add">
    <!-- 🏥 顶部标题 -->
    <view class="page-header">
      <view class="title">🏥 爱康医务室管理系统</view>
      <view class="subtitle">北京欢乐谷医务室 · 门诊登记表</view>
      <view class="date-time">{{ currentDateTime }}</view>
    </view>

    <view class="form-section">
      <!-- 基本信息 -->
      <view class="section-title">👤 患者基本信息</view>
      
      <!-- 就诊日期时间 -->
      <view class="form-item">
        <view class="label required">就诊日期时间</view>
        <view class="datetime-display">{{ form.visitDateTime }}</view>
      </view>

      <!-- 姓名 + 性别/年龄 -->
      <view class="form-row">
        <view class="form-item half">
          <view class="label required">姓名</view>
          <input v-model="form.name" type="text" placeholder="请输入患者姓名" />
        </view>
        <view class="form-item half">
          <view class="label required">性别 / 年龄</view>
          <view class="gender-age-row">
            <view class="gender-selector compact">
              <view 
                class="gender-item" 
                :class="{ active: form.gender === '男' }"
                @click="form.gender = '男'"
              >
                男
              </view>
              <view 
                class="gender-item" 
                :class="{ active: form.gender === '女' }"
                @click="form.gender = '女'"
              >
                女
              </view>
            </view>
            <input v-model.number="form.age" type="number" placeholder="年龄" class="age-input" />
          </view>
        </view>
      </view>

      <!-- 身份 + 就诊园区 -->
      <view class="form-row">
        <view class="form-item half">
          <view class="label required">身份</view>
          <view class="identity-selector">
            <view 
              v-for="identity in identityOptions"
              :key="identity.value"
              class="identity-item" 
              :class="{ active: form.identity === identity.value }"
              @click="form.identity = identity.value"
            >
              {{ identity.label }}
            </view>
          </view>
        </view>
        <view class="form-item half">
          <view class="label required">就诊园区</view>
          <view class="location-selector">
            <view
              v-for="loc in locations"
              :key="loc.value"
              class="location-item"
              :class="{ active: form.location === loc.value }"
              @click="selectLocation(loc.value)"
            >
              {{ loc.label }}
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 就诊信息 -->
    <view class="form-section">
      <view class="section-title">🏥 就诊信息</view>

      <!-- 受伤地点 -->
      <view class="form-item">
        <view class="label">受伤地点</view>
        <input v-model="form.injuryLocation" type="text" placeholder="例如：机动游戏区、餐饮区（可选）" class="input-uniform" />
          </view>

      <!-- 主诉 -->
      <view class="form-item">
        <view class="label required">主诉</view>
        <textarea
          v-model="form.chiefComplaint"
          placeholder="请输入患者自述症状，例如：头部外伤伴头晕"
          maxlength="100"
          class="textarea-small textarea-uniform"
        ></textarea>
        </view>

      <!-- 诊断 -->
      <view class="form-item">
        <view class="label required">诊断</view>
        <textarea
          v-model="form.diagnosis"
          placeholder="请输入初步诊断结果，例如：轻度头部挫伤"
          maxlength="100"
          class="textarea-small textarea-uniform"
        ></textarea>
      </view>

      <!-- 疾病名称（带下拉列表） -->
      <view class="form-item">
        <view class="label required">疾病名称</view>
        <view class="disease-input-wrapper">
          <input
            v-model="form.diseaseName" 
            type="text" 
            placeholder="例如：感冒、外伤、中暑等"
            @input="onDiseaseInput"
            @focus="onDiseaseFocus"
            class="input-uniform"
          />
          <!-- 疾病下拉列表 -->
          <view v-if="showDiseaseList && filteredDiseases.length > 0" class="disease-dropdown">
            <scroll-view scroll-y class="disease-scroll">
              <view 
                v-for="disease in filteredDiseases" 
                :key="disease"
                class="disease-item"
                @click="selectDisease(disease)"
              >
                {{ disease }}
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 处置 -->
      <view class="form-item">
        <view class="label required">处置</view>
        <textarea
          v-model="form.treatment"
          placeholder="请输入处理措施，例如：伤口清洗消毒、冷敷"
          maxlength="100"
          class="textarea-small textarea-uniform"
        ></textarea>
      </view>
      </view>

    <!-- 用药信息 -->
    <view class="form-section">
      <view class="section-title">💊 用药信息（可选）</view>

      <!-- 药品选择 - 只手动输入 -->
      <view class="form-item">
        <view class="label">药品名称</view>
        <view class="drug-input-wrapper">
          <input 
            v-model="drugSearchText" 
            type="text" 
            placeholder="点击查看所有药品或输入搜索"
            @input="onDrugSearch"
            @focus="onDrugInputFocus"
            class="input-uniform"
          />
          <!-- 下拉列表 -->
          <view v-if="showDrugList && filteredDrugs.length > 0" class="drug-dropdown">
            <view class="dropdown-header">
              <text class="dropdown-title">{{ form.location === 'land_park' ? '🏞️ 陆园' : '🌊 水园' }}库存药品</text>
              <text class="dropdown-count">({{ filteredDrugs.length }}种)</text>
            </view>
            <scroll-view scroll-y class="drug-scroll">
              <view 
                v-for="drug in filteredDrugs" 
                :key="drug._id"
                class="drug-item"
                @click="selectDrugFromList(drug)"
              >
                <view class="drug-name">{{ drug.name }}</view>
                <view class="drug-spec">{{ drug.specification }}</view>
              </view>
            </scroll-view>
          </view>
          <!-- 无结果提示 -->
          <view v-if="showDrugList && drugSearchText && filteredDrugs.length === 0" class="no-result">
            未找到匹配的药品
          </view>
        </view>
        <view v-if="selectedDrug" class="drug-info">
          <text class="spec">✅ {{ selectedDrug.name }} - {{ selectedDrug.specification }}</text>
          <text class="stock">
            {{ form.location === 'land_park' ? '🏞️ 陆园' : '🌊 水园' }}库存：{{ availableStock }} {{ selectedDrug.minUnit }}
          </text>
        </view>
      </view>

      <!-- 用药信息核心展示 - 快速登记版 -->
      <view v-if="selectedDrug" class="drug-quick-info">
        <!-- 药品名称大卡片 -->
        <view class="drug-name-card">
          <view class="drug-icon">💊</view>
          <view class="drug-details">
            <view class="drug-main-name">{{ selectedDrug.name }}</view>
            <view class="drug-spec-text">{{ selectedDrug.specification }}</view>
          </view>
        </view>
        
        <!-- 快速信息栏 -->
        <view class="quick-info-bar">
          <view class="info-tag park-tag">
            <text class="tag-icon">{{ form.location === 'land_park' ? '🏞️' : '🌊' }}</text>
            <text class="tag-text">{{ form.location === 'land_park' ? '陆园' : '水园' }}</text>
          </view>
          <view class="info-tag stock-tag" :class="{ 'stock-warning': availableStock < 10 }">
            <text class="tag-icon">📦</text>
            <text class="tag-text">库存 {{ availableStock }} {{ selectedDrug.minUnit }}</text>
          </view>
          <view class="info-tag unit-tag">
            <text class="tag-icon">📏</text>
            <text class="tag-text">{{ selectedDrug.minUnit }}</text>
          </view>
        </view>
        
        <!-- 数量输入大卡片 -->
        <view class="quantity-card">
          <view class="quantity-label">
            <text class="label-icon">🔢</text>
            <text class="label-text">用药数量</text>
            <text class="required-star">*</text>
          </view>
          <view class="quantity-input-wrapper">
            <input
              v-model.number="form.quantity"
              type="number"
              :placeholder="'请输入数量'"
              class="quantity-input-large"
            />
            <view class="quantity-unit-display">{{ selectedDrug.minUnit }}</view>
          </view>
          <!-- 库存不足警告 -->
          <view v-if="form.quantity > availableStock" class="quantity-warning">
            <text class="warning-icon">⚠️</text>
            <text class="warning-text">库存不足！当前库存：{{ availableStock }} {{ selectedDrug.minUnit }}</text>
          </view>
        </view>
      </view>

      <!-- 批次信息（自动FIFO） -->
      <view v-if="selectedBatch" class="batch-info">
        <view class="batch-item">
          <text class="label">批次号：</text>
          <text>{{ selectedBatch.batch }}</text>
        </view>
        <view class="batch-item">
          <text class="label">有效期：</text>
          <text>{{ formatDate(selectedBatch.expiryDate) }}</text>
          <text v-if="selectedBatch.daysToExpiry <= 60" class="warning">
            （{{ selectedBatch.daysToExpiry }}天后到期）
          </text>
        </view>
        <view class="batch-item">
          <text class="label">剩余库存：</text>
          <text>{{ selectedBatch.quantity }} {{ selectedDrug.minUnit }}</text>
        </view>
      </view>
    </view>

    <!-- 备注 -->
    <view class="form-section">
      <view class="section-title">📝 备注</view>
      <view class="form-item">
        <textarea
          v-model="form.remark"
          placeholder="其他说明或建议（可选）"
          maxlength="200"
          class="textarea-uniform"
        ></textarea>
      </view>
    </view>

    <!-- 接诊医生签名 -->
    <view class="form-section">
      <view class="section-title">✍️ 接诊医生签名</view>
      <view class="signature-info">
        <view class="signature-tip">
          <text class="tip-icon">ℹ️</text>
          <text class="tip-text">请医生在下方签名确认本次就诊信息</text>
        </view>
      </view>
      <view class="signature-section">
        <view v-if="form.doctorSign" class="signature-preview">
          <view class="signature-label">医生签名：</view>
          <image :src="form.doctorSign" mode="aspectFit" class="signature-image" />
          <view class="signature-time">签名时间：{{ form.signTime || currentDateTime }}</view>
          <button class="re-sign-btn" @click="openSignature">✏️ 重新签名</button>
        </view>
        <button v-else class="sign-btn" @click="openSignature">
          ✍️ 点击此处进行签名
        </button>
      </view>
    </view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="cancel-btn" @click="goBack">取消</button>
      <button class="submit-btn" :loading="submitting" @click="handleSubmit">
        💾 保存登记
      </button>
    </view>

    <!-- 继续登记选项 -->
    <view class="continue-option">
      <view class="continue-card" @click="toggleContinue">
        <view class="continue-checkbox">
          <checkbox :checked="continueAfterSubmit" />
        </view>
        <view class="continue-text">
          <view class="continue-title">💡 连续登记模式</view>
          <view class="continue-desc">提交后自动清空表单，继续登记下一位患者</view>
        </view>
      </view>
    </view>

    <!-- 药品选择器 -->
    <drug-selector
      v-if="showDrugSelector"
      @select="onDrugSelect"
      @close="showDrugSelector = false"
    />

    <!-- 签名组件 -->
    <signature
      v-if="showSignature"
      @confirm="onSignatureConfirm"
      @close="showSignature = false"
    />
  </view>
</template>

<script>
import signature from '@/components/signature/signature.vue';

export default {
  components: {
    signature
  },
  data() {
    return {
      locations: [
        { label: '陆园', value: 'land_park', icon: '🏞️' },
        { label: '水园', value: 'water_park', icon: '🌊' }
      ],
      identityOptions: [
        { label: '游客', value: '游客', icon: '🎫' },
        { label: '员工', value: '员工', icon: '👔' }
      ],
      form: {
        visitDateTime: '',
        name: '',
        gender: '男',
        age: null,
        identity: '游客',
        location: 'land_park',
        injuryLocation: '',
        chiefComplaint: '',
        diseaseName: '',
        diagnosis: '',
        treatment: '',
        drugId: '',
        quantity: null,
        remark: '',
        doctorSign: '',
        signTime: ''
      },
      currentDateTime: '',
      selectedDrug: null,
      selectedBatch: null,
      availableStock: 0,
      
      // 药品搜索相关
      drugSearchText: '',
      allDrugs: [],
      filteredDrugs: [],
      showDrugList: false,
      
      // 疾病名称下拉列表
      diseaseOptions: [
        '感冒',
        '发烧',
        '头痛',
        '头晕',
        '咳嗽',
        '腹泻',
        '腹痛',
        '恶心呕吐',
        '外伤',
        '扭伤',
        '擦伤',
        '割伤',
        '烫伤',
        '中暑',
        '晕厥',
        '过敏',
        '皮疹',
        '咽喉痛',
        '牙痛',
        '关节痛',
        '腰痛',
        '胸闷',
        '心慌',
        '失眠',
        '其他'
      ],
      filteredDiseases: [],
      showDiseaseList: false,
      
      showDrugSelector: false,
      showSignature: false,
      submitting: false,
      continueAfterSubmit: true  // 默认开启连续登记
    };
  },

  onLoad() {
    this.updateDateTime();
    // 每分钟更新一次时间
    setInterval(() => {
      this.updateDateTime();
    }, 60000);
    
    // 恢复上次选择的园区
    this.restoreLastLocation();
    
    // 加载药品列表
    this.loadAllDrugs();
  },

  methods: {
    updateDateTime() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      this.currentDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      this.form.visitDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
    },

    // 加载所有药品
    async loadAllDrugs() {
      try {
        const res = await wx.cloud.callFunction({
          name: 'drugManage',
          data: {
            action: 'getList',
            data: { pageSize: 1000 }
          }
        });

        if (res.result.success) {
          this.allDrugs = res.result.data.list || [];
        }
      } catch (err) {
        console.error('加载药品列表失败:', err);
      }
    },

    // 药品输入框获得焦点
    async onDrugInputFocus() {
      this.showDrugList = true;
      
      // 如果没有输入内容，显示当前园区的所有药品
      if (!this.drugSearchText || this.drugSearchText.trim() === '') {
        await this.loadLocationDrugs();
      } else {
        this.onDrugSearch();
      }
    },

    // 加载当前园区的药品
    async loadLocationDrugs() {
      try {
        uni.showLoading({ title: '加载药品...' });
        
        const res = await wx.cloud.callFunction({
          name: 'stockManage',
          data: {
            action: 'getStockList',
            data: {
              location: this.form.location,
              pageSize: 1000
            }
          }
        });
        
        uni.hideLoading();

        if (res.result.success) {
          const stockList = res.result.data.list || [];
          // 过滤出有库存的药品
          this.filteredDrugs = stockList
            .filter(item => item.quantity > 0)
            .map(item => ({
              _id: item.drugId,
              name: item.drugName || item.name,
              specification: item.specification || item.spec,
              minUnit: item.minUnit || item.unit,
              packUnit: item.packUnit || item.unit,
              conversionRate: item.conversionRate || 1,
              stock: item.quantity
            }));
          
          console.log(`加载了${this.filteredDrugs.length}种药品`);
        } else {
          // 如果获取失败，显示所有药品
          this.filteredDrugs = this.allDrugs.slice(0, 50);
        }
      } catch (err) {
        console.error('加载园区药品失败:', err);
        uni.hideLoading();
        // 失败时显示所有药品
        this.filteredDrugs = this.allDrugs.slice(0, 50);
      }
    },

    // 药品搜索
    onDrugSearch() {
      if (!this.drugSearchText || this.drugSearchText.trim() === '') {
        // 没有搜索内容时，加载当前园区药品
        this.loadLocationDrugs();
        return;
      }

      const keyword = this.drugSearchText.toLowerCase();
      // 从当前园区的药品中搜索
      if (this.filteredDrugs.length > 0 && !this.drugSearchText) {
        // 已经加载了园区药品，在其中搜索
        const currentList = [...this.filteredDrugs];
        this.filteredDrugs = currentList.filter(drug => {
          return drug.name.toLowerCase().includes(keyword) ||
                 (drug.specification && drug.specification.toLowerCase().includes(keyword));
        });
      } else {
        // 从所有药品中搜索
        this.filteredDrugs = this.allDrugs.filter(drug => {
          return drug.name.toLowerCase().includes(keyword) ||
                 (drug.pinyin && drug.pinyin.toLowerCase().includes(keyword)) ||
                 (drug.specification && drug.specification.toLowerCase().includes(keyword));
        }).slice(0, 30); // 最多显示30个结果
      }
    },

    // 从列表选择药品
    selectDrugFromList(drug) {
      this.drugSearchText = drug.name;
      this.showDrugList = false;
      this.onDrugSelect(drug);
    },

    // 疾病名称获得焦点
    onDiseaseFocus() {
      // 焦点进入时，显示所有疾病列表
      if (!this.form.diseaseName || this.form.diseaseName.trim() === '') {
        // 没有输入内容，显示所有疾病
        this.filteredDiseases = this.diseaseOptions;
      } else {
        // 有输入内容，显示过滤后的疾病
        const keyword = this.form.diseaseName.toLowerCase();
        this.filteredDiseases = this.diseaseOptions.filter(disease => {
          return disease.toLowerCase().includes(keyword);
        });
      }
      this.showDiseaseList = true;
    },
    
    // 疾病名称输入
    onDiseaseInput() {
      if (!this.form.diseaseName || this.form.diseaseName.trim() === '') {
        // 显示所有常见疾病
        this.filteredDiseases = this.diseaseOptions;
        this.showDiseaseList = true;
        return;
      }

      const keyword = this.form.diseaseName.toLowerCase();
      this.filteredDiseases = this.diseaseOptions.filter(disease => {
        return disease.toLowerCase().includes(keyword);
      });
      
      // 如果有匹配结果，显示列表
      if (this.filteredDiseases.length > 0) {
        this.showDiseaseList = true;
      }
    },

    // 选择疾病
    selectDisease(disease) {
      this.form.diseaseName = disease;
      this.showDiseaseList = false;  // 选择后隐藏列表
    },

    // 恢复上次选择的园区
    restoreLastLocation() {
      try {
        const lastLocation = uni.getStorageSync('clinic_last_location');
        if (lastLocation && (lastLocation === 'land_park' || lastLocation === 'water_park')) {
          this.form.location = lastLocation;
          const locationName = lastLocation === 'land_park' ? '陆园' : '水园';
          console.log(`已恢复上次选择的园区: ${locationName}`);
        } else {
          // 默认陆园
          this.form.location = 'land_park';
        }
        
        // 恢复连续登记模式设置
        const continueMode = uni.getStorageSync('clinic_continue_mode');
        if (continueMode !== undefined && continueMode !== null) {
          this.continueAfterSubmit = continueMode;
        }
      } catch (err) {
        console.error('恢复园区选择失败:', err);
        this.form.location = 'land_park';
      }
    },

    selectLocation(location) {
      this.form.location = location;
      
      // 保存到本地存储，记忆用户选择
      try {
        uni.setStorageSync('clinic_last_location', location);
      } catch (err) {
        console.error('保存园区选择失败:', err);
      }
      
      // 切换园区后重新加载批次
      if (this.selectedDrug) {
        uni.showToast({
          title: `已切换到${location === 'land_park' ? '陆园' : '水园'}`,
          icon: 'none',
          duration: 1500
        });
        this.loadBatches();
      }
    },


    async onDrugSelect(drug) {
      // 先设置基本信息
      this.form.drugId = drug._id;
      this.showDrugSelector = false;
      
      // 从药品档案获取完整信息
      try {
        uni.showLoading({ title: '加载药品信息...' });
        const res = await wx.cloud.callFunction({
          name: 'drugManage',
          data: {
            action: 'getDetail',
            data: { id: drug._id }
          }
        });
        
        if (res.result.success && res.result.data) {
          // 使用完整的药品信息
          this.selectedDrug = {
            ...res.result.data,
            _id: res.result.data._id,
            drugCode: res.result.data.drugCode || res.result.data.code || '',
            name: res.result.data.name,
            specification: res.result.data.specification || res.result.data.spec || '',
            minUnit: res.result.data.minUnit || res.result.data.unit || '个',
            packUnit: res.result.data.packUnit || res.result.data.unit || '盒',
            conversionRate: res.result.data.conversionRate || 1,
            manufacturer: res.result.data.manufacturer || ''
          };
        } else {
          // 如果获取失败，使用传入的drug数据
          this.selectedDrug = {
            ...drug,
            minUnit: drug.minUnit || drug.unit || '个',
            packUnit: drug.packUnit || drug.unit || '盒',
            conversionRate: drug.conversionRate || 1
          };
        }
      } catch (err) {
        console.error('获取药品详情失败:', err);
        // 使用传入的drug数据
        this.selectedDrug = {
          ...drug,
          minUnit: drug.minUnit || drug.unit || '个',
          packUnit: drug.packUnit || drug.unit || '盒',
          conversionRate: drug.conversionRate || 1
        };
      } finally {
        uni.hideLoading();
      }
      
      // 加载该园区的批次和库存
      await this.loadBatches();
    },

    async loadBatches() {
      uni.showLoading({ title: '加载库存...' });
      try {
        const res = await wx.cloud.callFunction({
          name: 'stockManage',
          data: {
            action: 'getBatchesByDrugId',
            data: {
              drugId: this.form.drugId,
              location: this.form.location,
              enableFIFO: true
            }
          }
        });

        if (res.result.success && res.result.data.length > 0) {
          const batches = res.result.data;
          this.selectedBatch = batches[0];
          this.availableStock = batches.reduce((sum, b) => sum + b.quantity, 0);
        } else {
          this.selectedBatch = null;
          this.availableStock = 0;
          const parkName = this.form.location === 'land_park' ? '陆园' : '水园';
          uni.showToast({
            title: `${parkName}该药品库存不足`,
            icon: 'none',
            duration: 2000
          });
        }
      } catch (err) {
        uni.showToast({
          title: '加载库存失败',
          icon: 'none'
        });
      } finally {
        uni.hideLoading();
      }
    },

    openSignature() {
      this.showSignature = true;
    },

    onSignatureConfirm(signatureData) {
      this.form.doctorSign = signatureData;
      
      // 记录签名时间
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      this.form.signTime = `${year}-${month}-${day} ${hours}:${minutes}`;
      
      this.showSignature = false;
      
      uni.showToast({
        title: '签名成功',
        icon: 'success',
        duration: 1500
      });
    },

    async handleSubmit() {
      // 表单验证
      if (!this.form.name || this.form.name.trim() === '') {
        uni.showToast({ title: '请输入患者姓名', icon: 'none' });
        return;
      }
      if (!this.form.gender) {
        uni.showToast({ title: '请选择性别', icon: 'none' });
        return;
      }
      if (!this.form.age || this.form.age <= 0) {
        uni.showToast({ title: '请输入有效的年龄', icon: 'none' });
        return;
      }
      if (!this.form.identity) {
        uni.showToast({ title: '请选择身份', icon: 'none' });
        return;
      }
      if (!this.form.chiefComplaint || this.form.chiefComplaint.trim() === '') {
        uni.showToast({ title: '请输入主诉', icon: 'none' });
        return;
      }
      if (!this.form.diseaseName || this.form.diseaseName.trim() === '') {
        uni.showToast({ title: '请输入疾病名称', icon: 'none' });
        return;
      }
      if (!this.form.diagnosis || this.form.diagnosis.trim() === '') {
        uni.showToast({ title: '请输入诊断', icon: 'none' });
        return;
      }
      if (!this.form.treatment || this.form.treatment.trim() === '') {
        uni.showToast({ title: '请输入处置措施', icon: 'none' });
        return;
      }
      if (!this.form.doctorSign) {
        uni.showToast({ title: '请签名', icon: 'none' });
        return;
      }

      // 如果选择了药品，验证用量
      if (this.selectedDrug) {
        if (!this.form.quantity || this.form.quantity <= 0) {
          uni.showToast({ title: '请输入有效的用量', icon: 'none' });
        return;
      }

      // 验证库存（园区使用最小单位，直接比较）
        if (this.form.quantity > this.availableStock) {
        uni.showToast({
          title: `库存不足，最多${this.availableStock}${this.selectedDrug.minUnit}`,
          icon: 'none',
          duration: 3000
        });
        return;
        }
      }

      this.submitting = true;
      uni.showLoading({ title: '保存中...' });

      try {
        // 准备数据
        const submitData = {
          visitDateTime: this.form.visitDateTime,
          name: this.form.name.trim(),
          gender: this.form.gender,
          age: this.form.age,
          identity: this.form.identity,
          location: this.form.location,  // 🏞️ 园区（陆园/水园）
          injuryLocation: this.form.injuryLocation.trim(),
          chiefComplaint: this.form.chiefComplaint.trim(),
          diseaseName: this.form.diseaseName.trim(),
          diagnosis: this.form.diagnosis.trim(),
          treatment: this.form.treatment.trim(),
          remark: this.form.remark.trim(),
          doctorSign: this.form.doctorSign,
          signTime: this.form.signTime
        };

        // 如果有用药信息，云函数会从对应园区扣减库存
        if (this.selectedDrug && this.form.quantity) {
          // 确保数量是整数，避免小数
          const intQuantity = Math.floor(this.form.quantity);
          
          submitData.drugInfo = {
            drugId: this.form.drugId,  // 系统内部ID（主键）
            drugCode: this.selectedDrug.drugCode || this.selectedDrug.code || '',  // 药品代码（业务编码）
              drugName: this.selectedDrug.name,
              specification: this.selectedDrug.specification,
            unit: this.selectedDrug.minUnit,
            quantity: intQuantity,
              batchId: this.selectedBatch._id,
            batch: this.selectedBatch.batch,
            location: this.form.location,  // 关联园区
              minUnit: this.selectedDrug.minUnit,
              packUnit: this.selectedDrug.packUnit,
            conversionRate: this.selectedDrug.conversionRate
          };
          
          // 兼容旧字段
          submitData.drugId = this.form.drugId;  // 系统内部ID（主键）
          submitData.drugCode = this.selectedDrug.drugCode || this.selectedDrug.code || '';  // 药品代码（业务编码）
          submitData.drugName = this.selectedDrug.name;
          submitData.specification = this.selectedDrug.specification;
          submitData.batchId = this.selectedBatch._id;
          submitData.quantityMin = intQuantity;
          submitData.minUnit = this.selectedDrug.minUnit;
          submitData.packUnit = this.selectedDrug.packUnit;
          submitData.conversionRate = this.selectedDrug.conversionRate;
          submitData.patient = this.form.name.trim();
          submitData.symptom = this.form.chiefComplaint.trim();
        }

        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'add',
            data: submitData
          }
        });

        if (res.result.success) {
          if (this.continueAfterSubmit) {
            // 连续登记模式：立即清空表单
          uni.showToast({
              title: '✅ 登记成功！可继续登记',
              icon: 'success',
              duration: 2000
          });

            setTimeout(() => {
            this.resetForm();
              // 滚动到顶部
              uni.pageScrollTo({
                scrollTop: 0,
                duration: 300
              });
            }, 800);
          } else {
            // 返回列表
            uni.showToast({
              title: '登记成功',
              icon: 'success'
            });
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          }
        } else {
          uni.showToast({
            title: res.result.error || '登记失败',
            icon: 'none'
          });
        }
      } catch (err) {
        console.error('登记失败:', err);
        uni.showToast({
          title: '登记失败',
          icon: 'none'
        });
      } finally {
        this.submitting = false;
        uni.hideLoading();
      }
    },

    resetForm() {
      this.updateDateTime();
      this.form = {
        visitDateTime: this.form.visitDateTime,
        name: '',
        gender: '男',
        age: null,
        identity: '游客',
        location: this.form.location,  // 保留园区选择
        injuryLocation: '',
        chiefComplaint: '',
        diseaseName: '',
        diagnosis: '',
        treatment: '',
        drugId: '',
        quantity: null,
        remark: '',
        doctorSign: '',
        signTime: ''
      };
      this.selectedDrug = null;
      this.selectedBatch = null;
      this.availableStock = 0;
      this.convertedQuantity = null;
      this.drugSearchText = '';
      this.filteredDrugs = [];
      this.showDrugList = false;
      this.filteredDiseases = [];
      this.showDiseaseList = false;
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    // 切换连续登记模式
    toggleContinue() {
      this.continueAfterSubmit = !this.continueAfterSubmit;
      
      // 保存用户偏好
      try {
        uni.setStorageSync('clinic_continue_mode', this.continueAfterSubmit);
      } catch (err) {
        console.error('保存连续登记设置失败:', err);
      }
      
      uni.showToast({
        title: this.continueAfterSubmit ? '已开启连续登记' : '已关闭连续登记',
        icon: 'none',
        duration: 1500
      });
    },

    goBack() {
      uni.navigateBack();
    }
  }
};
</script>

<style lang="scss" scoped>
.clinic-add {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20rpx 20rpx 140rpx;
}

// 🏥 顶部标题
.page-header {
  background: white;
  border-radius: 20rpx;
  padding: 40rpx 30rpx;
  margin-bottom: 20rpx;
  text-align: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);

  .title {
    font-size: 44rpx;
    font-weight: bold;
    color: #1890ff;
    margin-bottom: 16rpx;
    letter-spacing: 2rpx;
  }

  .subtitle {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
    padding: 16rpx 0;
    border-bottom: 4rpx solid #1890ff;
    display: inline-block;
  }

  .date-time {
    font-size: 28rpx;
    color: #666;
    margin-top: 16rpx;
  }
}

.form-section {
  background: white;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 3rpx solid #e8e8e8;
  display: flex;
  align-items: center;
}

.form-item {
  margin-bottom: 30rpx;

  &.half {
    flex: 1;
  }

  .label {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 16rpx;
    display: block;
    font-weight: 500;

    &.required::before {
      content: '*';
      color: #ff4d4f;
      margin-right: 8rpx;
      font-weight: bold;
    }
  }

  input {
    width: 100%;
    padding: 20rpx 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 26rpx;
    background: #fafafa;
    transition: all 0.3s;
    box-sizing: border-box;
    height: 80rpx;  // 统一高度
    line-height: 1.6;  // 统一行高

    &:focus {
      border-color: #1890ff;
      background: white;
    }
    
    &::placeholder {
      font-size: 26rpx;
      color: #999;
    }
  }

  textarea {
    width: 100%;
    padding: 20rpx 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 26rpx;
    background: #fafafa;
    transition: all 0.3s;
    box-sizing: border-box;
    line-height: 1.8;

    &:focus {
      border-color: #1890ff;
      background: white;
    }
    
    &::placeholder {
      font-size: 26rpx;
      color: #999;
    }
  }

  // 统一宽度的输入框
  .input-uniform,
  .textarea-uniform {
    width: 100% !important;
    box-sizing: border-box;
    max-width: 100%;
  }

  textarea {
    height: 180rpx;
    
    &.textarea-small {
    height: 150rpx;
    }
  }
}

.form-row {
  display: flex;
  gap: 20rpx;
}

.datetime-display {
  padding: 20rpx;
  background: #e6f7ff;
  border: 2rpx solid #91d5ff;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #1890ff;
  font-weight: bold;
  text-align: center;
  height: 80rpx;  // 统一高度
  box-sizing: border-box;
  line-height: 1.6;  // 统一行高
  display: flex;
  align-items: center;
  justify-content: center;
}

.gender-selector,
.identity-selector {
  display: flex;
  gap: 20rpx;

  .identity-item {
    flex: 1;
    height: 80rpx;  // 统一高度
    padding: 20rpx;
    text-align: center;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #666;
    background: #fafafa;
    transition: all 0.3s;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.active {
      border-color: #1890ff;
      background: #e6f7ff;
      color: #1890ff;
      font-weight: bold;
      transform: scale(1.05);
    }
  }
}

.gender-selector {
  display: flex;
  gap: 20rpx;

  &.compact {
    flex: 1;
    min-width: 0;
  }

  .gender-item {
    flex: 1;
    height: 80rpx;  // 统一高度
    padding: 20rpx;
    text-align: center;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #666;
    background: #fafafa;
    transition: all 0.3s;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.active {
      border-color: #1890ff;
      background: #e6f7ff;
      color: #1890ff;
      font-weight: bold;
      transform: scale(1.05);
    }
    }
  }

.gender-age-row {
  display: flex;
  gap: 15rpx;
  align-items: stretch;
}

.age-input {
  flex: 0 0 120rpx;
  min-width: 120rpx;
  padding: 20rpx 16rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 26rpx;
  background: #fafafa;
  text-align: center;
  box-sizing: border-box;
  height: 80rpx;
  
  &:focus {
    border-color: #1890ff;
    background: white;
  }
}

.location-selector {
  display: flex;
  gap: 20rpx;

  .location-item {
    flex: 1;
    height: 80rpx;  // 统一高度
    padding: 20rpx;
    text-align: center;
    border: 3rpx solid #e0e0e0;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #666;
    background: #fafafa;
    transition: all 0.3s;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;

    &.active {
      border-color: #1890ff;
      background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%);
      color: #1890ff;
      font-weight: bold;
      box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
      transform: translateY(-4rpx);
    }
  }
}

.location-hint {
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: #fff7e6;
  border-left: 4rpx solid #faad14;
    border-radius: 8rpx;
  font-size: 24rpx;
  color: #d46b08;
  line-height: 1.6;
}

// 药品输入包装器
.drug-input-wrapper {
  position: relative;
  width: 100%;

  input {
    width: 100%;
    padding: 20rpx 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 26rpx;
    background: white;
    transition: all 0.3s;
    box-sizing: border-box;
    height: 80rpx;  // 统一高度
    line-height: 1.6;  // 统一行高

    &:focus {
      border-color: #1890ff;
      box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
    }
    
    &::placeholder {
      font-size: 26rpx;
      color: #999;
    }
  }

  // 药品下拉列表
  .drug-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8rpx;
    background: white;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 600rpx;
    overflow: hidden;
    
    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16rpx 20rpx;
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      border-bottom: 1rpx solid #7dd3fc;
      
      .dropdown-title {
        font-size: 26rpx;
        font-weight: bold;
        color: #0369a1;
      }
      
      .dropdown-count {
        font-size: 22rpx;
        color: #0891b2;
      }
    }

    .drug-scroll {
      max-height: 540rpx;
    }

    .drug-item {
      padding: 24rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      transition: background 0.2s;

      &:active {
        background: #f5f5f5;
      }

      &:last-child {
        border-bottom: none;
      }

      .drug-name {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
        margin-bottom: 8rpx;
      }

      .drug-spec {
        font-size: 24rpx;
        color: #999;
      }
    }
  }

  .no-result {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8rpx;
    padding: 40rpx 20rpx;
    background: white;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    text-align: center;
    font-size: 26rpx;
    color: #999;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
}

// 疾病名称输入包装器
.disease-input-wrapper {
  position: relative;
  width: 100%;

  input {
    height: 80rpx;  // 统一高度
    line-height: 1.6;  // 统一行高
    font-size: 26rpx;
    padding: 20rpx 24rpx;
  }

  .disease-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 8rpx;
    background: white;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 400rpx;
    overflow: hidden;

    .disease-scroll {
      max-height: 400rpx;
    }

    .disease-item {
      padding: 24rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      font-size: 26rpx;
      color: #333;
      transition: background 0.2s;

      &:active {
        background: #e6f7ff;
      }

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

// 用药信息快速登记版
.drug-quick-info {
  margin-top: 20rpx;
  padding: 0;
}

// 药品名称大卡片
.drug-name-card {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(251, 191, 36, 0.25);
  border: 3rpx solid #fbbf24;
  margin-bottom: 20rpx;
  
  .drug-icon {
    font-size: 56rpx;
    margin-right: 20rpx;
    filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.1));
  }
  
  .drug-details {
    flex: 1;
  }
  
  .drug-main-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #78350f;
    line-height: 1.4;
    margin-bottom: 8rpx;
  }
  
  .drug-spec-text {
    font-size: 24rpx;
    color: #92400e;
    font-weight: 500;
  }
}

// 快速信息栏
.quick-info-bar {
  display: flex;
  gap: 12rpx;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}

.info-tag {
  display: flex;
  align-items: center;
  padding: 18rpx 22rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
  flex: 1;
  min-width: 0;
  
  .tag-icon {
    font-size: 26rpx;
    margin-right: 10rpx;
  }
  
  .tag-text {
    font-size: 24rpx;
    font-weight: 600;
    color: #334155;
  }
  
  &.park-tag {
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border: 2rpx solid #60a5fa;
    
    .tag-text {
      color: #1e40af;
    }
  }
  
  &.stock-tag {
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    border: 2rpx solid #34d399;
    
    .tag-text {
      color: #065f46;
    }
    
    &.stock-warning {
      background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
      border: 2rpx solid #f87171;
      
      .tag-text {
        color: #991b1b;
      }
    }
  }
  
  &.unit-tag {
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    border: 2rpx solid #818cf8;
    
    .tag-text {
      color: #3730a3;
    }
  }
}

// 数量输入大卡片
.quantity-card {
  padding: 28rpx 32rpx;
  background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%);
  border-radius: 20rpx;
  box-shadow: 0 6rpx 20rpx rgba(20, 184, 166, 0.2);
  border: 3rpx solid #14b8a6;
  
  .quantity-label {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
    
    .label-icon {
    font-size: 28rpx;
      margin-right: 12rpx;
    }
    
    .label-text {
      font-size: 28rpx;
      font-weight: bold;
      color: #0f766e;
    }
    
    .required-star {
      color: #dc2626;
      font-size: 28rpx;
      margin-left: 6rpx;
      font-weight: bold;
    }
  }
  
  .quantity-input-wrapper {
    display: flex;
    align-items: center;
    gap: 16rpx;
    margin-bottom: 16rpx;
  }
  
  .quantity-input-large {
    flex: 1;
    padding: 24rpx 28rpx;
    background: white;
    border: 4rpx solid #14b8a6;
    border-radius: 16rpx;
    font-size: 44rpx;  // 数量输入框保持大字号
    font-weight: bold;
    color: #0f766e;
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(20, 184, 166, 0.15);
    height: 100rpx;  // 固定高度
    line-height: 1.2;  // 行高
    
    &:focus {
      border-color: #0d9488;
      box-shadow: 0 0 0 4rpx rgba(20, 184, 166, 0.2);
    }
  }
  
  .quantity-unit-display {
    padding: 24rpx 28rpx;
    background: white;
    border: 4rpx solid #5eead4;
    border-radius: 16rpx;
    font-size: 44rpx;  // 单位字号与输入框统一
    font-weight: bold;
    color: #14b8a6;
    min-width: 140rpx;  // 增加最小宽度，确保显示完整
    text-align: center;
    box-shadow: 0 4rpx 12rpx rgba(20, 184, 166, 0.15);
    height: 100rpx;  // 与输入框高度统一
    line-height: 1.2;  // 行高统一
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.drug-info {
  margin-top: 16rpx;
  padding: 16rpx;
  background: #f6ffed;
  border-radius: 12rpx;
  font-size: 24rpx;
  color: #52c41a;

  .spec,
  .stock {
    display: block;
    margin-bottom: 8rpx;
  }
}

.quantity-input {
  display: flex;
  align-items: center;

  input {
    flex: 1;
    height: 80rpx;  // 统一高度
    line-height: 1.6;  // 统一行高
  }

  .unit {
    margin-left: 16rpx;
    font-size: 26rpx;  // 统一字号
    color: #666;
    font-weight: 500;
  }
}

.batch-info {
  padding: 24rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 16rpx;
  border: 2rpx solid #7dd3fc;
  box-shadow: 0 2rpx 8rpx rgba(14, 165, 233, 0.1);
  margin-top: 20rpx;

  .batch-item {
    display: flex;
    align-items: center;
    margin-bottom: 14rpx;
    font-size: 24rpx;
    
    &:last-child {
      margin-bottom: 0;
    }

    .label {
      color: #64748b;
      font-weight: 600;
      font-size: 24rpx;
      margin-right: 10rpx;
    }
    
    text {
      color: #334155;
      font-size: 24rpx;
      font-weight: 500;
    }

    .warning {
      color: #dc2626;
      margin-left: 8rpx;
      font-weight: bold;
    }
  }
}

// 库存不足警告
.quantity-warning {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border-radius: 12rpx;
  border: 2rpx solid #fca5a5;
  margin-top: 16rpx;
  animation: shake 0.5s ease-in-out;
  
  .warning-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }
  
  .warning-text {
    color: #dc2626;
    font-size: 26rpx;
    font-weight: 600;
    flex: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10rpx); }
  75% { transform: translateX(10rpx); }
}

// 签名提示
.signature-info {
  margin-bottom: 20rpx;
}

.signature-tip {
  display: flex;
  align-items: center;
  padding: 16rpx 20rpx;
  background: #e6f7ff;
  border-left: 4rpx solid #1890ff;
  border-radius: 8rpx;
  
  .tip-icon {
    margin-right: 12rpx;
    font-size: 28rpx;
  }
  
  .tip-text {
    font-size: 24rpx;
    color: #0050b3;
    line-height: 1.6;
  }
}

// 签名区域
.signature-section {
  padding: 20rpx 0;

  .signature-preview {
    position: relative;
    border: 3rpx solid #52c41a;
    border-radius: 16rpx;
    padding: 24rpx;
    background: #f6ffed;
    
    .signature-label {
      font-size: 26rpx;
      color: #52c41a;
      font-weight: bold;
      margin-bottom: 16rpx;
      display: block;
    }

    .signature-image {
      width: 100%;
      height: 200rpx;
      border: 2rpx dashed #b7eb8f;
      border-radius: 12rpx;
      background: white;
    }
    
    .signature-time {
      margin-top: 12rpx;
      font-size: 24rpx;
      color: #666;
      text-align: center;
    }

    .re-sign-btn {
      margin-top: 20rpx;
      width: 100%;
      padding: 20rpx;
      background: white;
      color: #1890ff;
      border: 2rpx solid #1890ff;
      border-radius: 12rpx;
      font-size: 28rpx;
      font-weight: 500;
    }
  }

  .sign-btn {
    width: 100%;
    padding: 50rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 16rpx;
    font-size: 34rpx;
    font-weight: bold;
    border: 4rpx dashed rgba(255, 255, 255, 0.5);
    box-shadow: 0 8rpx 24rpx rgba(102, 126, 234, 0.4);
    
    &:active {
      transform: scale(0.98);
      box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.5);
    }
  }
}

.submit-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 20rpx;
  background: white;
  box-shadow: 0 -4rpx 12rpx rgba(0, 0, 0, 0.1);
  z-index: 100;

  button {
    flex: 1;
    padding: 28rpx;
    border-radius: 12rpx;
    font-size: 32rpx;
    font-weight: bold;
  }

  .cancel-btn {
    background: white;
    border: 2rpx solid #d9d9d9;
    color: #666;
  }

  .submit-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
}

.continue-option {
  padding: 20rpx;
  margin-bottom: 20rpx;
}

.continue-card {
  display: flex;
  align-items: center;
  padding: 24rpx 28rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
  }
}

.continue-checkbox {
  margin-right: 20rpx;
  
  checkbox {
    transform: scale(1.3);
  }
}

.continue-text {
  flex: 1;
}

.continue-title {
  font-size: 30rpx;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8rpx;
}

.continue-desc {
  font-size: 24rpx;
  color: #999;
  line-height: 1.5;
}
</style>
