<template>
  <view class="clinic-add">
    <scroll-view
      class="clinic-scroll"
      scroll-y
      :scroll-into-view="activeFieldId"
    >
    <!-- 顶部标题 -->
    <view class="page-header">
      <view class="title">北京欢乐谷医务室</view>
      <view class="subtitle">门诊登记表</view>
    </view>

    <!-- 功能按钮区域：选择园区 + 门诊日报 -->
    <view class="top-actions-card">
      <view class="top-buttons">
        <button class="top-btn primary" @tap="openLocationSelector">
          {{ locationLocked ? '选择园区' : currentLocationLabel }}
        </button>
        <button class="top-btn ghost" @tap="generateDailyReport">门诊日报</button>
      </view>
    </view>

    <!-- 园区选择提示弹窗（悬浮窗） -->
    <view v-if="showLocationTip" class="location-modal-overlay">
      <view class="location-modal">
        <view class="modal-title">请选择当前所在园区</view>
        <view class="modal-subtitle">当前：{{ currentLocationLabel }}，用于统计门诊登记、日报等数据</view>

        <view class="modal-location-buttons">
          <button class="modal-loc-btn" :class="{ active: form.location === 'land_park' }" @tap="handleLocationSelect('land_park')">陆园</button>
          <button class="modal-loc-btn" :class="{ active: form.location === 'water_park' }" @tap="handleLocationSelect('water_park')">水园</button>
        </view>

        <view class="modal-hint-text">后续可随时通过上方“选择园区”按钮切换，不影响已登记记录。</view>

        <view class="modal-row" @tap="noTipNextTime = !noTipNextTime">
          <checkbox :checked="noTipNextTime" />
          <text class="modal-checkbox-text">下次不再提醒</text>
        </view>

        <button class="modal-close-btn" @tap="closeLocationTip">关闭提示</button>
      </view>
    </view>

    <view id="field-remark" class="form-section">
      <!-- 基本信息 -->
      <view class="section-title">患者基本信息</view>
      
      <!-- 就诊日期时间 + 身份 并排 -->
      <view class="form-row">
        <view id="field-name" class="form-item half">
          <view class="label required">就诊日期时间</view>
          <view class="datetime-display">{{ form.visitDateTime }}</view>
        </view>
        <view class="form-item half">
          <view class="label required">身份</view>
          <view class="identity-selector">
            <view 
              v-for="idOpt in identityOptions"
              :key="idOpt.value"
              class="identity-item" 
              :class="{ active: form.identity === idOpt.value }"
              @click="setIdentity(idOpt.value)"
            >
              {{ idOpt.label }}
            </view>
          </view>
        </view>
      </view>


      <!-- 姓名 + 性别/年龄 -->
      <view class="form-row">
        <view class="form-item half">
          <view class="label required">姓名</view>
          <input
            v-model="form.name"
            type="text"
            placeholder="选园区后输入姓名"
            :disabled="locationLocked"
            cursor-spacing="80"
          />
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
            <input
              v-model.number="form.age"
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              :maxlength="3"
              :focus="ageFocus"
              @tap="ageFocus = true"
              @blur="ageFocus = false"
              confirm-type="done"
              placeholder="年龄"
              class="age-input"
            />
          </view>
        </view>
      </view>

      <!-- 主诉 -->
      <view id="field-chiefComplaint" class="form-item">
        <view class="label required">主诉</view>
        <view class="disease-input-wrapper">
          <input
            v-model="form.chiefComplaint"
            type="text"
            placeholder="请输入患者自述症状，例如：头部外伤伴头晕"
            maxlength="100"
            class="input-uniform"
            @focus="onComplaintFocus(); onFieldFocus('field-chiefComplaint')"
            @input="onComplaintInput"
            @blur="onComplaintBlur"
          />
          <!-- 主诉下拉列表 -->
          <view v-if="showComplaintList && filteredComplaints.length > 0" class="disease-dropdown">
            <scroll-view scroll-y class="disease-scroll">
              <view
                v-for="opt in filteredComplaints"
                :key="opt.key"
                class="disease-item"
                @click="selectComplaint(opt)"
              >
                {{ opt.label }}
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

    </view>

    <!-- 就诊信息 -->
    <view class="form-section">
      <view class="section-title">就诊信息</view>

      <!-- 是否出诊 + 受伤地点 -->
      <view class="form-row">
        <view class="form-item half">
          <view class="label required">是否出诊</view>
          <view class="identity-selector visit-type-selector">
            <view
              v-for="vt in visitTypeOptions"
              :key="vt.value"
              class="identity-item"
              :class="{ active: form.visitType === vt.value }"
              @click="setVisitType(vt.value)"
            >
              <text class="visit-type-text">{{ vt.label }}</text>
            </view>
          </view>
        </view>
        <view class="form-item half">
          <view class="label" :class="{ required: form.visitType === 'outcall' }">受伤地点</view>
          <view class="location-input-wrapper">
            <input
              v-model="form.injuryLocation"
              type="text"
              :placeholder="form.visitType === 'outcall' ? '请输入受伤地点（必填）' : '例如：机动游戏区、餐饮区（可选）'"
              class="input-uniform"
              @focus="onLocationFocus(); onFieldFocus('field-injuryLocation')"
              @input="onLocationInput"
            />
            <!-- 地点下拉列表 -->
            <view v-if="showLocationList && filteredLocations.length > 0" class="location-dropdown">
              <scroll-view scroll-y class="location-scroll">
                <view
                  v-for="loc in filteredLocations"
                  :key="loc"
                  class="location-item"
                  @click="selectLocationFromList(loc)"
                >
                  {{ loc }}
                </view>
              </scroll-view>
            </view>
          </view>
        </view>
      </view>

      <!-- 诊断 -->
      <view class="form-item">
        <view class="label required">诊断</view>
        <view class="disease-input-wrapper">
          <input
            v-model="form.diagnosis"
            type="text"
            placeholder="请输入初步诊断结果，例如：轻度头部挫伤"
            maxlength="100"
            class="input-uniform"
            @focus="onDiagnosisFocus(); onFieldFocus('field-diagnosis')"
            @input="onDiagnosisInput"
            @blur="onDiagnosisBlur"
          />
          <view v-if="showDiagnosisList && filteredDiagnosis.length > 0" class="disease-dropdown">
            <scroll-view scroll-y class="disease-scroll">
              <!-- 模板库参考 -->
              <view v-if="filteredDiagnosis.length > 0" class="diagnosis-section">
                <view 
                  v-for="it in filteredDiagnosis" 
                  :key="it"
                  class="disease-item"
                  @click="selectDiagnosis(it)"
                >
                  {{ it }}
                </view>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 症状 -->
      <view id="field-symptom" class="form-item">
        <view class="label">症状</view>
        <view class="disease-input-wrapper">
          <input
            v-model="form.symptom"
            type="text"
            placeholder="例如：头晕、恶心、局部红肿等（可选，可从主诉自动提取）"
            maxlength="150"
            class="input-uniform"
            @focus="onSymptomFocus(); onFieldFocus('field-symptom')"
            @input="onSymptomInput"
            @blur="onSymptomBlur"
          />
          <!-- 症状下拉列表 -->
          <view v-if="showSymptomList && filteredSymptoms.length > 0" class="disease-dropdown">
            <scroll-view scroll-y class="disease-scroll">
              <view
                v-for="(symptom, idx) in filteredSymptoms"
                :key="idx"
                class="disease-item"
                @click="selectSymptom(symptom)"
              >
                <text class="symptom-name">{{ symptom.name || symptom }}</text>
                <text v-if="symptom.category" class="symptom-category">{{ symptom.category }}</text>
              </view>
            </scroll-view>
          </view>
        </view>
      </view>

      <!-- 疾病名称（带下拉列表）+ 选择诊断参考按钮 -->
      <view class="form-item">
        <view class="label required">疾病名称</view>
        <view class="disease-name-row">
          <view class="disease-input-wrapper" style="flex: 1;">
            <input
              v-model="form.diseaseName" 
              type="text" 
              placeholder="例如：感冒、外伤、中暑等"
              @input="onDiseaseInput"
              @focus="onDiseaseFocus(); onFieldFocus('field-diseaseName')"
              @blur="onDiseaseBlur"
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
      </view>

      <!-- 处置 -->
      <view class="form-item">
        <view class="label required">处置</view>
        <view class="disease-input-wrapper">
          <input
            v-model="form.treatment"
            type="text"
            placeholder="请输入处理措施，例如：伤口清洗消毒、冷敷"
            maxlength="120"
            class="input-uniform"
            @focus="onTreatmentFocus(); onFieldFocus('field-treatment')"
            @input="onTreatmentInput"
          />
          <view v-if="showTreatmentList && filteredTreatments.length > 0" class="disease-dropdown">
            <scroll-view scroll-y class="disease-scroll">
              <view 
                v-for="it in filteredTreatments" 
                :key="it"
                class="disease-item"
                @click="selectTreatment(it)"
              >
                {{ it }}
              </view>
            </scroll-view>
          </view>
        </view>
      </view>
      </view>

    <!-- 用药信息 -->
    <view class="form-section">
      <view class="section-title">用药信息（可选）</view>

      <!-- 药材选择 - 只手动输入 -->
      <view id="field-drug" class="form-item">
        <view class="label">药材名称</view>
        <view class="drug-input-wrapper">
          <input 
            v-model="drugSearchText" 
            type="text" 
            placeholder="点击查看所有药材或输入搜索"
            @input="onDrugSearch"
            @focus="onDrugInputFocus"
            class="input-uniform"
          />
          <!-- 下拉列表 -->
          <view v-if="showDrugList && filteredDrugs.length > 0" class="drug-dropdown">
            <view class="dropdown-header">
              <text class="dropdown-title">{{ form.location === 'land_park' ? '陆园' : '水园' }}库存药材</text>
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
            未找到匹配的药材
          </view>
        </view>
      </view>

      <!-- 用药信息展示 -->
      <view v-if="selectedDrug" class="drug-quick-info">
        <!-- 药材信息单行展示 -->
        <view class="drug-info-row">
          <view class="drug-name-section">
            <text class="drug-name-text">{{ selectedDrug.name }}</text>
            <text class="drug-spec-text">{{ selectedDrug.specification }}</text>
          </view>
          <view class="drug-stock-section">
            <text class="stock-label">{{ form.location === 'land_park' ? '陆园' : '水园' }}库存：</text>
            <text class="stock-value" :class="{ 'stock-warning': availableStock < 10 }">{{ availableStock }} {{ getRealMinUnit(selectedDrug) }}</text>
          </view>
        </view>
      </view>

      <!-- 用药数量和用法输入 -->
      <view v-if="selectedDrug" class="drug-usage-section">
        <!-- 用药数量 -->
        <view class="form-row">
          <view class="form-item half">
            <view class="label required">用药数量</view>
            <view class="quantity-input-group">
              <input
                v-model.number="form.quantity"
                type="number"
                placeholder="数量"
                class="input-uniform"
              />
              <text class="unit-text">{{ getRealMinUnit(selectedDrug) }}</text>
            </view>
            <!-- 库存不足警告 -->
            <view v-if="form.quantity > availableStock" class="quantity-warning">
              <text class="warning-icon">⚠️</text>
              <text class="warning-text">库存不足！当前：{{ availableStock }} {{ getRealMinUnit(selectedDrug) }}</text>
            </view>
          </view>
          
          <!-- 单次剂量 -->
          <view class="form-item half">
            <view class="label">单次剂量</view>
            <view class="dosage-input-group">
              <input
                v-model="currentDrug.dosage"
                type="text"
                :placeholder="getDosagePlaceholder(selectedDrug)"
                class="input-uniform"
              />
            </view>
          </view>
        </view>

        <!-- 用药频次和途径 -->
        <view class="form-row">
          <view class="form-item half">
            <view class="label">用药频次</view>
            <picker mode="selector" :range="frequencyOptions" :value="frequencyIndex" @change="onFrequencyChange">
              <view class="picker-input">{{ currentFrequencyLabel }}</view>
            </picker>
          </view>
          
          <view class="form-item half">
            <view class="label">给药途径</view>
            <picker mode="selector" :range="routeOptions" :value="routeIndex" @change="onRouteChange">
              <view class="picker-input">{{ currentRouteLabel }}</view>
            </picker>
          </view>
        </view>

        <!-- 用法说明 -->
        <view class="form-item">
          <view class="label">用法说明</view>
          <input
            v-model="currentDrug.usage"
            type="text"
            placeholder="如：饭后服用，多饮水"
            class="input-uniform"
          />
        </view>

        <!-- 添加到处方按钮 -->
        <view class="add-prescription-action">
          <button class="add-prescription-btn" @click="addToPrescription">
            <text class="btn-icon">➕</text>
            <text class="btn-text">加入处方</text>
          </button>
        </view>
      </view>

      <!-- 开具处方开关 -->
      <view class="form-item">
        <view class="label-row">
          <view class="label">开具处方</view>
          <switch 
            :checked="enablePrescription" 
            @change="onPrescriptionSwitch"
            color="#1890ff"
          />
        </view>
      </view>

      <!-- 处方（符合国家规定格式） -->
      <view v-if="enablePrescription" class="prescription-section">
        <!-- 医院信息头部 -->
        <view class="prescription-hospital-header">
          <view class="hospital-logo">🏥</view>
          <view class="hospital-info">
            <text class="hospital-name">北京欢乐谷医务室</text>
            <text class="hospital-subtitle">Beijing Happy Valley Medical Office</text>
          </view>
        </view>
        
        <!-- 处方标题 -->
        <view class="prescription-title-section">
          <text class="prescription-main-title">门诊处方笺</text>
          <text class="prescription-type-badge">普通处方</text>
        </view>
        
        <!-- 处方编号和日�� -->
        <view class="prescription-meta-info">
          <view class="meta-item">
            <text class="meta-label">处方编号：</text>
            <text class="meta-value">{{ prescriptionNo }}</text>
          </view>
          <view class="meta-item">
            <text class="meta-label">开具日期：</text>
            <text class="meta-value">{{ currentDate }}</text>
          </view>
        </view>
        
        <!-- 患者信息卡片 -->
        <view class="prescription-patient-card">
          <view class="patient-info-row">
            <view class="patient-info-item">
              <text class="info-label">姓名</text>
              <text class="info-value">{{ form.name || '___' }}</text>
            </view>
            <view class="patient-info-item">
              <text class="info-label">性别</text>
              <text class="info-value">{{ form.gender || '___' }}</text>
            </view>
            <view class="patient-info-item">
              <text class="info-label">年龄</text>
              <text class="info-value">{{ form.age || '___' }}岁</text>
            </view>
            <view class="patient-info-item">
              <text class="info-label">身份</text>
              <text class="info-value">{{ form.identity || '___' }}</text>
            </view>
          </view>
          <view class="patient-diagnosis-row">
            <text class="diagnosis-label">临床诊断：</text>
            <text class="diagnosis-value">{{ form.diagnosis || '___' }}</text>
          </view>
        </view>
        
        <!-- Rp 标记和药品列表 -->
        <view class="prescription-body">
          <view class="prescription-rp-header">
            <text class="rp-symbol">Rp:</text>
          </view>
          
          <!-- 药品列表 -->
          <view class="prescription-drugs-list">
            <view v-if="prescriptionList.length === 0" class="drugs-empty">
              <text class="empty-icon">💊</text>
              <text class="empty-text">暂无处方药品</text>
              <text class="empty-hint">请在上方选择药品并添加到处方</text>
            </view>
            
            <view 
              v-for="(item, index) in prescriptionList" 
              :key="index"
              class="prescription-drug-item"
            >
              <!-- 药品名称和规格 - 单行显示 -->
              <view class="drug-item-header">
                <view class="drug-name-spec">
                  <text class="drug-name">{{ item.drugName }}</text>
                  <text class="drug-spec-quantity">{{ formatSpecQuantity(item) }}</text>
                </view>
                <view class="drug-actions">
                  <text class="action-btn delete" @click="removeFromPrescription(index)">[删除]</text>
                </view>
              </view>
              
              <!-- 用法用量（格式化显示） -->
              <view v-if="item.dosage || item.route || item.frequency" class="drug-usage-row">
                <text class="usage-label">用法：</text>
                <text class="usage-value">{{ formatUsage(item) }}</text>
              </view>
              
              <!-- ✨ FIFO 批次分配信息展示 -->
              <view v-if="item.batchAllocation && item.batchAllocation.length > 0" class="batch-allocation-info">
                <view class="batch-allocation-header">
                  <text class="batch-label">📦 批次分配：</text>
                  <text class="batch-count">{{ item.batchCount }}个批次</text>
                  <text v-if="item.hasNearExpiry" class="near-expiry-tag">⚠️ 近效期</text>
                </view>
                <view 
                  v-for="(batch, bIndex) in item.batchAllocation" 
                  :key="bIndex"
                  class="batch-item"
                  :class="{ 'near-expiry': batch.isNearExpiry }"
                >
                  <view class="batch-row">
                    <text class="batch-number">批次{{ bIndex + 1 }}：{{ batch.batch }}</text>
                    <text class="batch-quantity">{{ batch.quantity }}{{ item.unit }}</text>
                  </view>
                  <view class="batch-detail">
                    <text class="batch-expiry">有效期：{{ formatDate(batch.expireDate) }}</text>
                    <text v-if="batch.isNearExpiry" class="batch-days">({{ batch.daysToExpire }}天后过期)</text>
                  </view>
                </view>
              </view>
              
              <!-- 兼容旧的单批次显示 -->
              <view v-else-if="item.batchNumber" class="batch-single-info">
                <text class="batch-label">批次：</text>
                <text class="batch-value">{{ item.batchNumber }}</text>
              </view>
            </view>
          </view>
          
          <!-- 处方统计 -->
          <view v-if="prescriptionList.length > 0" class="prescription-summary">
            <text class="summary-text">共 {{ prescriptionList.length }} 种药品</text>
          </view>
          
          <view class="prescription-blank-line">
            <text class="blank-text">————————— 以下空白 —————————</text>
          </view>
        </view>
        
        <!-- 处方底部签名区 -->
        <view class="prescription-footer-section">
          <view class="footer-row">
            <view class="footer-item">
              <text class="footer-label">医师签名：</text>
              <view class="signature-placeholder">
                <text class="placeholder-text">（见下方电子签名）</text>
              </view>
            </view>
          </view>
        </view>
        
        <!-- 处方说明 -->
        <view class="prescription-notes">
          <view class="note-title">📌 处方说明</view>
          <view class="note-item">
            <text class="note-bullet">•</text>
            <text class="note-text">本处方仅供医务室内部使用，请妥善保管</text>
          </view>
          <view class="note-item">
            <text class="note-bullet">•</text>
            <text class="note-text">药品数量使用最小单位（片、粒、支等）</text>
          </view>
          <view class="note-item">
            <text class="note-bullet">•</text>
            <text class="note-text">请按医嘱用药，如有不适请及时就诊</text>
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
      <view class="section-title">备注</view>
      <view class="form-item">
        <input
          v-model="form.remark"
          type="text"
          placeholder="其他说明或建议（可选）"
          maxlength="200"
          class="input-uniform"
        />
      </view>
    </view>

    <!-- 接诊医生签名 -->
    <view class="form-section">
      <view class="section-title">接诊医生签名</view>
        <view class="signature-info">
          <view class="signature-tip">
          <text class="tip-text">请医生在下方签名确认本次就诊信息</text>
        </view>
      </view>
      <view class="signature-section">
        <view class="signature-label-row">
          <view class="signature-label">医生签名</view>
          <text class="required">*</text>
        </view>
        <Signature
          :key="signatureKey"
          v-model="form.doctorSign"
          title="医生签名"
          @change="onDoctorSignChange"
        />
        <view v-if="form.signTime" class="signature-time">
          签名时间：{{ form.signTime }}
        </view>
      </view>
    </view>

    <!-- 继续登记选项 -->
    <view class="continue-option">
      <view class="continue-card" @click="toggleContinue">
        <view class="continue-checkbox">
          <checkbox :checked="continueAfterSubmit" />
        </view>
        <view class="continue-text">
          <view class="continue-title">连续登记模式</view>
          <view class="continue-desc">提交后自动清空表单，继续登记下一位患者</view>
        </view>
      </view>
    </view>

    <!-- 药材选择器 -->
    <drug-selector
      v-if="showDrugSelector"
      @select="onDrugSelect"
      @close="showDrugSelector = false"
    />

    </scroll-view>

    <!-- 提交按钮 -->
    <view class="submit-section">
      <button class="cancel-btn" @click="goBack">取消</button>
      <button class="submit-btn" :loading="submitting" @click="handleSubmit">
        保存
      </button>
    </view>

    <!-- 继续登记选项 -->
    <view class="continue-option">
      <view class="continue-card" @click="toggleContinue">
        <view class="continue-checkbox">
          <checkbox :checked="continueAfterSubmit" />
        </view>
        <view class="continue-text">
          <view class="continue-title">连续登记模式</view>
          <view class="continue-desc">提交后自动清空表单，继续登记下一位患者</view>
        </view>
      </view>
    </view>

    <!-- 药材选择器 -->
    <drug-selector
      v-if="showDrugSelector"
      @select="onDrugSelect"
      @close="showDrugSelector = false"
    />

  </view>
</template>

<script>
import Signature from '@/components/signature/index.vue';

// 欢乐谷主诉-关键词映射库（前端专用，用于主诉下拉联想）
// 说明：
// - key 为医生可能输入的关键词（疾病名/症状/场景词）
// - value 为若干主诉模板，每条包含疾病场景与规范主诉句子
const hvComplaintKeywordIndex = {
  // 外伤类 TR-01 皮肤擦伤/挫伤
  '擦伤': [
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '摔倒后膝盖擦伤、疼痛' },
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '碰撞后手臂蹭破皮、红肿' },
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '被游乐设施擦伤、轻微出血' },
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '摔倒后多处擦伤、疼痛' }
  ],
  '挫伤': [
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '摔倒后膝盖擦伤、疼痛' },
    { diseaseId: 'TR-01', diseaseName: '皮肤擦伤/挫伤', complaint: '碰撞后手臂蹭破皮、红肿' }
  ],

  // 外伤类 TR-02 关节扭伤
  '扭伤': [
    { diseaseId: 'TR-02', diseaseName: '关节扭伤', complaint: '崴脚后脚踝疼痛、肿胀' },
    { diseaseId: 'TR-02', diseaseName: '关节扭伤', complaint: '跑步摔倒后手腕扭伤、活动受限' },
    { diseaseId: 'TR-02', diseaseName: '关节扭伤', complaint: '跳跃后膝关节扭伤、不能承重' },
    { diseaseId: 'TR-02', diseaseName: '关节扭伤', complaint: '手腕扭伤、疼痛、活动困难' }
  ],
  '崴脚': [
    { diseaseId: 'TR-02', diseaseName: '关节扭伤', complaint: '崴脚后脚踝疼痛、肿胀' }
  ],

  // 外伤类 TR-03 头部轻微外伤
  '头部外伤': [
    { diseaseId: 'TR-03', diseaseName: '头部轻微外伤', complaint: '撞到头后头痛、头晕' },
    { diseaseId: 'TR-03', diseaseName: '头部轻微外伤', complaint: '头部撞伤、起包、恶心' },
    { diseaseId: 'TR-03', diseaseName: '头部轻微外伤', complaint: '头部碰伤、头痛想吐' },
    { diseaseId: 'TR-03', diseaseName: '头部轻微外伤', complaint: '头部外伤后头晕、注意力不集中' }
  ],

  // 外伤类 TR-04 可疑骨折
  '骨折': [
    { diseaseId: 'TR-04', diseaseName: '可疑骨折', complaint: '摔倒后手腕畸形、剧痛' },
    { diseaseId: 'TR-04', diseaseName: '可疑骨折', complaint: '腿部撞击后肿胀变形、不能动' },
    { diseaseId: 'TR-04', diseaseName: '可疑骨折', complaint: '高处跌落脚踝剧痛、畸形' },
    { diseaseId: 'TR-04', diseaseName: '可疑骨折', complaint: '手指挤压后畸形、活动异常' }
  ],

  // 环境类 EN-01 轻度中暑
  '中暑': [
    { diseaseId: 'EN-01', diseaseName: '轻度中暑', complaint: '太阳下排队后头晕、口渴、乏力' },
    { diseaseId: 'EN-01', diseaseName: '轻度中暑', complaint: '天气热感觉头晕、恶心、出汗多' },
    { diseaseId: 'EN-01', diseaseName: '轻度中暑', complaint: '长时间暴晒后头痛、乏力、口渴' },
    { diseaseId: 'EN-01', diseaseName: '轻度中暑', complaint: '热天游玩后头晕、心慌、想吐' }
  ],
  '暴晒': [
    { diseaseId: 'EN-01', diseaseName: '轻度中暑', complaint: '长时间暴晒后头痛、乏力、口渴' },
    { diseaseId: 'EN-02', diseaseName: '热痉挛/热衰竭', complaint: '暴晒后大量出汗、头晕、肌肉痉挛' }
  ],

  // 环境类 EN-02 热痉挛/热衰竭
  '热痉挛': [
    { diseaseId: 'EN-02', diseaseName: '热痉挛/热衰竭', complaint: '高温下活动后头晕、恶心、肌肉抽筋' },
    { diseaseId: 'EN-02', diseaseName: '热痉挛/热衰竭', complaint: '热天跑步后乏力、头晕、小腿抽筋' },
    { diseaseId: 'EN-02', diseaseName: '热痉挛/热衰竭', complaint: '暴晒后大量出汗、头晕、肌肉痉挛' },
    { diseaseId: 'EN-02', diseaseName: '热痉挛/热衰竭', complaint: '高温环境头晕、呕吐、全身无力' }
  ],

  // 环境类 EN-03 日光性皮炎
  '晒伤': [
    { diseaseId: 'EN-03', diseaseName: '日光性皮炎', complaint: '晒伤后皮肤发红、疼痛、灼热感' },
    { diseaseId: 'EN-03', diseaseName: '日光性皮炎', complaint: '暴晒后皮肤红肿、刺痛、痒' },
    { diseaseId: 'EN-03', diseaseName: '日光性皮炎', complaint: '晒后皮肤起红斑、脱皮、疼痛' },
    { diseaseId: 'EN-03', diseaseName: '日光性皮炎', complaint: '太阳晒后皮肤发红起泡、灼痛' }
  ],

  // 环境类 EN-04 蚊虫叮咬过敏
  '蚊虫叮咬': [
    { diseaseId: 'EN-04', diseaseName: '蚊虫叮咬过敏', complaint: '被蚊子咬后红肿、瘙痒' },
    { diseaseId: 'EN-04', diseaseName: '蚊虫叮咬过敏', complaint: '虫咬后起大包、很痒' },
    { diseaseId: 'EN-04', diseaseName: '蚊虫叮咬过敏', complaint: '蚊虫叮咬处红肿热痛' },
    { diseaseId: 'EN-04', diseaseName: '蚊虫叮咬过敏', complaint: '虫咬后皮疹、瘙痒难忍' }
  ],

  // 消化 GI-01 急性胃肠炎
  '腹泻': [
    { diseaseId: 'GI-01', diseaseName: '急性胃肠炎', complaint: '吃坏肚子后呕吐、腹泻、腹痛' },
    { diseaseId: 'GI-01', diseaseName: '急性胃肠炎', complaint: '进食后恶心呕吐、拉肚子' },
    { diseaseId: 'GI-01', diseaseName: '急性胃肠炎', complaint: '呕吐腹泻、肚子绞痛、发热' },
    { diseaseId: 'GI-01', diseaseName: '急性胃肠炎', complaint: '恶心、拉肚子、肚子咕咕叫' }
  ],

  // 消化 GI-02 功能性消化不良
  '消化不良': [
    { diseaseId: 'GI-02', diseaseName: '功能性消化不良', complaint: '吃太多后胃胀、反酸、不舒服' },
    { diseaseId: 'GI-02', diseaseName: '功能性消化不良', complaint: '饭后胃痛、饱胀感、嗳气' },
    { diseaseId: 'GI-02', diseaseName: '功能性消化不良', complaint: '胃部不适、食欲不振、腹胀' },
    { diseaseId: 'GI-02', diseaseName: '功能性消化不良', complaint: '吃东西后胃疼、反酸烧心' }
  ],

  // 神经 NS-01 晕动病
  '晕动病': [
    { diseaseId: 'NS-01', diseaseName: '晕动病', complaint: '坐旋转项目后头晕、恶心、想吐' },
    { diseaseId: 'NS-01', diseaseName: '晕动病', complaint: '玩游乐设施后头晕、出冷汗、心慌' },
    { diseaseId: 'NS-01', diseaseName: '晕动病', complaint: '晕车样感觉、头晕恶心、脸色苍白' },
    { diseaseId: 'NS-01', diseaseName: '晕动病', complaint: '旋转后眩晕、呕吐、乏力' }
  ],
  '眩晕': [
    { diseaseId: 'NS-01', diseaseName: '晕动病', complaint: '旋转后眩晕、呕吐、乏力' },
    { diseaseId: 'VR-01', diseaseName: '游乐设施后眩晕', complaint: '旋转项目后眩晕、恶心' },
    { diseaseId: 'VR-02', diseaseName: '前庭性眩晕', complaint: '天旋地转的眩晕、伴呕吐' }
  ],

  // 神经 NS-02 过度惊吓反应
  '惊吓': [
    { diseaseId: 'NS-02', diseaseName: '过度惊吓反应', complaint: '鬼屋出来后心慌、手抖、害怕' },
    { diseaseId: 'NS-02', diseaseName: '过度惊吓反应', complaint: '受惊吓后心慌、头晕、出汗' },
    { diseaseId: 'NS-02', diseaseName: '过度惊吓反应', complaint: '惊吓后心跳很快、紧张不安' },
    { diseaseId: 'NS-02', diseaseName: '过度惊吓反应', complaint: '恐怖项目后恐惧、失眠、噩梦' }
  ],

  // 心理 PS-01 儿童分离焦虑
  '走失': [
    { diseaseId: 'PS-01', diseaseName: '儿童分离焦虑', complaint: '小孩与父母走散后哭闹、害怕' },
    { diseaseId: 'PS-01', diseaseName: '儿童分离焦虑', complaint: '儿童找不到家长、焦虑哭闹' },
    { diseaseId: 'PS-01', diseaseName: '儿童分离焦虑', complaint: '孩子分离后恐慌、不肯离开' },
    { diseaseId: 'PS-01', diseaseName: '儿童分离焦虑', complaint: '儿童焦虑、紧抓不放、哭泣' }
  ],

  // 心理 PS-02 过度换气综合征
  '过度换气': [
    { diseaseId: 'PS-02', diseaseName: '过度换气综合征', complaint: '紧张后呼吸急促、手脚发麻' },
    { diseaseId: 'PS-02', diseaseName: '过度换气综合征', complaint: '焦虑发作呼吸快、头晕、手麻' },
    { diseaseId: 'PS-02', diseaseName: '过度换气综合征', complaint: '恐慌时喘不过气、手抽筋' },
    { diseaseId: 'PS-02', diseaseName: '过度换气综合征', complaint: '呼吸过快、胸口闷、嘴唇发麻' }
  ],

  // VR-01 游乐设施后眩晕
  '过山车': [
    { diseaseId: 'VR-01', diseaseName: '游乐设施后眩晕', complaint: '玩过山车后头晕、站不稳' },
    { diseaseId: 'MS-01', diseaseName: '颈部挥鞭样损伤', complaint: '坐过山车后脖子痛、僵硬' }
  ],
  '游乐设施': [
    { diseaseId: 'VR-01', diseaseName: '游乐设施后眩晕', complaint: '游乐设施后头昏、平衡差' },
    { diseaseId: 'MS-01', diseaseName: '颈部挥鞭样损伤', complaint: '游乐设施后颈部酸痛、头晕' }
  ],

  // VR-02 前庭性眩晕 & VR-03 耳石症
  '前庭性眩晕': [
    { diseaseId: 'VR-02', diseaseName: '前庭性眩晕', complaint: '天旋地转的眩晕、伴呕吐' },
    { diseaseId: 'VR-02', diseaseName: '前庭性眩晕', complaint: '眩晕感觉房子在转、恶心' },
    { diseaseId: 'VR-02', diseaseName: '前庭性眩晕', complaint: '剧烈眩晕、必须闭眼躺下' },
    { diseaseId: 'VR-02', diseaseName: '前庭性眩晕', complaint: '旋转性眩晕、伴耳鸣' }
  ],
  '耳石症': [
    { diseaseId: 'VR-03', diseaseName: '耳石症', complaint: '转头时突发眩晕、几秒钟就好' },
    { diseaseId: 'VR-03', diseaseName: '耳石症', complaint: '起床翻身时短暂天旋地转' },
    { diseaseId: 'VR-03', diseaseName: '耳石症', complaint: '头位变化时剧烈眩晕、不敢动' },
    { diseaseId: 'VR-03', diseaseName: '耳石症', complaint: '特定姿势时眩晕发作' }
  ],

  // GY-01/02/03 痛经
  '痛经': [
    { diseaseId: 'GY-01', diseaseName: '轻度痛经', complaint: '来月经肚子隐痛、腰酸' },
    { diseaseId: 'GY-01', diseaseName: '轻度痛经', complaint: '经期小腹坠痛、乏力' },
    { diseaseId: 'GY-02', diseaseName: '中度痛经', complaint: '痛经明显、影响游玩' },
    { diseaseId: 'GY-03', diseaseName: '重度痛经', complaint: '痛经剧痛、出冷汗、想吐' }
  ],

  // MT-01/02/03 低血糖
  '低血糖': [
    { diseaseId: 'MT-01', diseaseName: '轻度低血糖', complaint: '心慌手抖、出冷汗、饥饿感' },
    { diseaseId: 'MT-01', diseaseName: '轻度低血糖', complaint: '头晕心慌、手抖乏力' },
    { diseaseId: 'MT-01', diseaseName: '轻度低血糖', complaint: '游玩久了心慌、出汗、饿' },
    { diseaseId: 'MT-02', diseaseName: '中重度低血糖', complaint: '低血糖意识模糊、反应迟钝' },
    { diseaseId: 'MT-03', diseaseName: '低血糖昏迷', complaint: '低血糖昏迷、意识丧失' }
  ]
};

export default {
  components: {
    Signature
  },
  data() {
    return {
      locations: [
        { label: '陆园', value: 'land_park' },
        { label: '水园', value: 'water_park' }
      ],
      identityOptions: [
        { label: '游客', value: '游客' },
        { label: '员工', value: '员工' }
      ],
      visitTypeOptions: [
        { label: '否', value: 'clinic' },
        { label: '是', value: 'outcall' }
      ],
      // 疾病→诊断与处置模板
      diseaseTemplates: {
        '扭伤': ['踝关节扭伤','腕关节扭伤','膝关节扭伤','肩关节扭伤','颈部肌肉拉伤','腰部肌筋膜拉伤','外侧副韧带拉伤'],
        '擦伤': ['皮肤表浅擦伤','肘部擦伤','膝部擦伤','手掌擦伤','面部擦伤','小腿擦伤','躯干擦伤'],
        '烫伤': ['Ⅰ度热烫伤','手部轻度烫伤','前臂轻度烫伤','躯干轻度烫伤','热液烫伤（表浅）','蒸汽烫伤（表浅）'],
        '磕伤': ['软组织挫伤','头皮挫伤','膝部挫伤','前臂挫伤','小腿挫伤','肩部挫伤','足背挫伤'],
        '冻伤': ['末端轻度冻伤','面部轻度冻伤','手指冻伤（表浅）','耳廓冻伤（表浅）','足趾冻伤（表浅）'],
        '腹泻': ['急性胃肠炎','受凉所致腹泻','饮食不洁所致腹泻','功能性腹泻','旅游者腹泻'],
        '头晕': ['体位性低血压','中暑轻型后遗症','疲劳性头晕','低血糖相关头晕','颈源性头晕可能'],
        '头痛': ['紧张性头痛','外伤后轻度头痛','偏头痛样头痛（既往史）','感冒相关头痛','鼻窦炎相关头痛可能'],
        '感冒': ['上呼吸道感染（轻）','风寒感冒','暑湿感冒','咽喉炎伴感冒','腺样体样症状可能'],
        '脱臼': ['手指小关节脱位（已复位）','肩关节轻度半脱位（建议转诊）','髌骨半脱位可能'],
        '骨折': ['疑似骨折（建议影像学检查）','手指末节疑似骨折','前臂疑似骨折','锁骨疑似骨折'],
        '过敏': ['荨麻疹样皮疹','接触性皮炎','虫咬后过敏反应','花粉过敏样反应','食物相关过敏可能'],
        '痛经': ['原发性痛经','寒凝血瘀型痛经','气滞血瘀型痛经'],
        '测血压': ['血压偏高待复测','血压偏低伴轻度头晕','血压正常记录观察'],
        '其他': ['一般外伤处理','非特异性不适，建议观察','情绪紧张相关不适']
      },
      treatmentTemplates: {
        '扭伤': ['冷敷+弹性绷带加压包扎','制动抬高24-48h','必要时外固定并转诊','48小时后热敷功能锻炼'],
        '擦伤': ['清创冲洗（盐水/3%双氧水）','碘伏消毒+无菌敷贴','必要时外用湿润烧伤膏','换药观察渗出感染'],
        '烫伤': ['冷水冲洗15-20分钟','碘伏/湿润烧伤膏外用','无菌敷贴覆盖','避免刺破水疱并观察'],
        '磕伤': ['局部冷敷+弹力绷带','碘伏消毒处理','必要时观察肿胀变化','超过48小时改热敷促进吸收'],
        '冻伤': ['温水复温（37-40℃）','干燥保暖与保护','避免摩擦与再次受冷','必要时外用保护性敷贴'],
        '腹泻': ['口服补液/葡萄糖粉剂一次','饮食清淡+观察','必要时解痉止泻','注意补盐与复诊提示'],
        '头晕': ['测血压、观察休息','口服葡萄糖粉剂一次','必要时对症处理','避免剧烈运动与久站'],
        '头痛': ['对症止痛（布洛芬一次）','补液与休息','观察诱因与复诊建议','避免强光久屏使用'],
        '感冒': ['藿香正气水一次','对症退热镇痛（布洛芬一次）','多饮水休息','含服草珊瑚/板蓝根冲剂'],
        '脱臼': ['制动固定+冷敷','建议影像学及专科处理','避免自行反复活动'],
        '骨折': ['制动固定+冷敷','立即转诊影像学检查','必要时止痛处理'],
        '过敏': ['口服氯雷他定一次','外用红肿冷敷','观察呼吸道症状','避免继续接触可疑过敏原'],
        '痛经': ['热敷腹部、休息','必要时对症解痉','注意保暖与规律作息'],
        '测血压': ['复测并记录','异常者建议随访或转诊','生活方式指导'],
        '其他': ['对症观察+健康教育','必要时随访']
      },
      // 主诉（症状）模板
      complaintTemplates: {
        '扭伤': '扭伤后局部疼痛肿胀，活动受限',
        '擦伤': '皮肤表浅擦伤，轻度渗血/疼痛',
        '烫伤': '热液/蒸汽烫伤，局部红肿灼痛',
        '磕伤': '碰撞致局部疼痛肿胀',
        '冻伤': '受寒后局部麻木疼痛，皮肤颜色改变',
        '腹泻': '近一天腹泻多次，伴轻度腹痛/乏力',
        '头晕': '阵发性头晕，伴乏力/站立不稳',
        '头痛': '持续性头痛，紧张诱发明显',
        '感冒': '咳嗽流涕咽痛，乏力/低热',
        '脱臼': '外伤后关节畸形疼痛，活动受限',
        '骨折': '外伤后局部肿胀疼痛，活动受限',
        '过敏': '全身/局部皮疹瘙痒，接触史阳性',
        '痛经': '经期下腹阵发性疼痛',
        '测血压': '测血压复查，无明显不适',
        '中暑': '户外暴晒后头晕乏力出汗增多',
        '咽喉痛': '咽部疼痛，吞咽不适',
        '皮疹': '皮疹伴瘙痒，抓挠后加重',
        '牙痛': '患牙疼痛，冷热刺激明显',
        '关节痛': '关节活动痛，活动后加重'
      },
      // 注意事项/复诊提示（按疾病自动附加到处置）
      treatmentCautions: {
        '腹泻': [
          '补液：小口频饮，注意补盐',
          '清淡饮食，避免油腻辛辣',
          '48小时未缓解或伴高热/血便请及时复诊'
        ],
        '头晕': [
          '休息，避免久站/剧烈运动',
          '监测血压与症状变化',
          '症状持续或加重请复诊'
        ],
        '头痛': [
          '注意休息与补水',
          '减少长时间屏幕与强光刺激',
          '频繁发作或伴呕吐/视物模糊请复诊'
        ],
        '感冒': [
          '多饮水休息，注意保暖与口罩礼仪',
          '对症用药后观察',
          '发热＞38.5℃或持续超过3天请复诊'
        ]
      },
      hvTriage: null,
      // 结构化疾病模板库：每个疾病下多条主诉，每条主诉有独立的症状/诊断/处置
      // 后续可以扩展 drugs 字段
      diseaseTemplateLib: {
        '感冒': [
          {
            complaint: '咳嗽流涕咽痛，伴乏力低热',
            symptoms: [
              '近1～2日出现咳嗽、流涕、咽痛，体温不高于38.5℃',
              '伴轻度乏力，无明显呼吸困难'
            ],
            diagnoses: [
              '上呼吸道感染（轻型）',
              '病毒性上呼吸道感染可能'
            ],
            treatments: [
              '多饮水休息，注意保暖',
              '口服对症药物（如退热镇痛药）',
              '观察体温及症状变化，必要时复诊'
            ]
          },
          {
            complaint: '受凉后出现流涕咳嗽、咽痛，伴头痛乏力',
            symptoms: [
              '受凉后出现流涕、咳嗽、咽痛约1日',
              '伴头痛乏力，无胸闷气促'
            ],
            diagnoses: [
              '风寒感冒',
              '急性上呼吸道感染'
            ],
            treatments: [
              '口服感冒药物一次，注意用药间隔',
              '注意保暖，减少户外暴露',
              '嘱如体温持续升高或症状加重及时就诊'
            ]
          },
          {
            complaint: '游玩途中出现流涕、喷嚏、轻度咳嗽，伴乏力',
            symptoms: [
              '游玩途中出现流涕、喷嚏，偶有轻度咳嗽',
              '体温基本正常或轻度升高'
            ],
            diagnoses: [
              '普通感冒',
              '上呼吸道感染待排'
            ],
            treatments: [
              '暂时减少剧烈项目，多饮温水',
              '根据需要给予含片或口服感冒药',
              '嘱观察症状，如发热明显或精神状态差需就诊'
            ]
          }
        ],
        '扭伤': [
          {
            complaint: '行走时不慎扭伤踝关节，局部肿胀疼痛，活动受限',
            symptoms: [
              '踝关节局部肿胀疼痛，活动受限',
              '皮肤完整，无明显畸形'
            ],
            diagnoses: [
              '踝关节软组织扭伤',
              '韧带拉伤可能'
            ],
            treatments: [
              '24小时内局部冷敷',
              '弹力绷带加压包扎，减少负重',
              '抬高患肢，必要时转诊影像学检查'
            ]
          },
          {
            complaint: '运动时扭伤膝关节，行走困难',
            symptoms: [
              '膝关节局部肿胀疼痛，行走时加重',
              '关节活动受限'
            ],
            diagnoses: [
              '膝关节扭伤',
              '内侧副韧带拉伤可能'
            ],
            treatments: [
              '局部冷敷、制动休息',
              '建议影像学检查，必要时转诊',
              '避免剧烈运动及负重行走'
            ]
          },
          {
            complaint: '玩项目时不慎扭伤腕关节，局部疼痛肿胀',
            symptoms: [
              '腕关节局部压痛、轻度肿胀',
              '活动时疼痛加重，静息时稍缓解'
            ],
            diagnoses: [
              '腕关节软组织扭伤'
            ],
            treatments: [
              '局部冷敷，抬高患肢',
              '弹力绷带适度加压固定',
              '嘱避免提重物，如疼痛明显或活动受限加重及时复诊'
            ]
          }
        ],
        '擦伤': [
          {
            complaint: '玩耍时摔倒致膝部皮肤擦伤，伴轻度渗血疼痛',
            symptoms: [
              '膝部皮肤表浅擦伤，少量渗血',
              '局部疼痛，无明显肿胀'
            ],
            diagnoses: [
              '膝部皮肤表浅擦伤'
            ],
            treatments: [
              '清水/生理盐水冲洗创面',
              '碘伏消毒后无菌敷贴覆盖',
              '交代保持创面清洁干燥，观察感染迹象'
            ],
            suggestDrugs: ['碘伏', '无菌敷贴', '海诺创可贴']
          },
          {
            complaint: '活动时摔倒致手掌擦伤，局部疼痛',
            symptoms: [
              '手掌皮肤表浅擦伤，少量渗血或渗液',
              '局部疼痛，活动基本自如'
            ],
            diagnoses: [
              '手掌皮肤表浅擦伤'
            ],
            treatments: [
              '冲洗清洁创面',
              '碘伏消毒后覆以创可贴或无菌敷贴',
              '嘱避免频繁摩擦及浸水'
            ],
            suggestDrugs: ['碘伏', '海诺创可贴']
          },
          {
            complaint: '滑倒致肘部擦伤，局部疼痛伴少量渗血',
            symptoms: [
              '肘部局部表浅皮肤擦伤，少量渗血或结痂',
              '关节活动基本自如，可有轻微牵拉痛'
            ],
            diagnoses: [
              '肘部皮肤表浅擦伤'
            ],
            treatments: [
              '生理盐水或清水冲洗创面',
              '碘伏消毒后敷贴无菌敷料',
              '嘱保持伤口清洁干燥，避免剧烈活动'
            ]
          }
        ],
        '烫伤': [
          {
            complaint: '被热饮不慎泼洒致手部局部红肿灼痛',
            symptoms: [
              '手背/手掌局部皮肤潮红、水肿',
              '疼痛明显，无大疱或少量小疱'
            ],
            diagnoses: [
              '手部表浅Ⅰ度热烫伤'
            ],
            treatments: [
              '流动冷水冲洗15～20分钟',
              '外用湿润烧伤膏或同类药物',
              '无菌敷料覆盖，嘱避免刺破水疱'
            ],
            suggestDrugs: ['湿润烧伤膏', '无菌敷贴']
          },
          {
            complaint: '接触热汤/蒸汽后前臂烫伤，局部红肿疼痛',
            symptoms: [
              '前臂局部皮肤潮红，轻度水肿',
              '疼痛明显，部分可见小疱'
            ],
            diagnoses: [
              '前臂表浅热烫伤'
            ],
            treatments: [
              '及时冷水冲洗降温',
              '局部外用烧伤药物并覆盖敷料',
              '交代观察感染迹象，如红肿加重及时复诊'
            ]
          },
          {
            complaint: '不慎接触热锅边缘致手指局部烫伤',
            symptoms: [
              '手指局部皮肤潮红或轻度水疱',
              '局部灼痛明显，活动基本不受限'
            ],
            diagnoses: [
              '手指轻度热烫伤'
            ],
            treatments: [
              '冷水冲洗患处10～15分钟',
              '外用湿润烧伤膏或同类药物',
              '避免刺破水疱，注意保持患处清洁'
            ]
          }
        ],
        '中暑': [
          {
            complaint: '户外排队久站后出现头晕乏力出汗增多',
            symptoms: [
              '在高温环境中活动后出现头晕、乏力、出汗增多',
              '皮肤潮红或湿冷，口渴'
            ],
            diagnoses: [
              '中暑轻型'
            ],
            treatments: [
              '转移至阴凉通风处休息',
              '口服补液或葡萄糖溶液',
              '物理降温（冷敷额头、颈部等）',
              '观察症状变化，如加重及时转诊'
            ],
            suggestDrugs: ['藿香正气水', '葡萄糖粉剂']
          },
          {
            complaint: '在阳光下玩耍后感到头痛、恶心、全身乏力',
            symptoms: [
              '户外暴晒后出现头痛、恶心、乏力',
              '部分伴有轻度心悸'
            ],
            diagnoses: [
              '中暑样反应'
            ],
            treatments: [
              '立即脱离高温环境，卧床休息',
              '口服补液，必要时给予对症药物',
              '嘱家属/同伴观察，如出现意识改变立即送医'
            ]
          }
        ],
        '腹泻': [
          {
            complaint: '进食冷饮或不洁食物后出现腹泻，多次稀便',
            symptoms: [
              '近1日多次稀便，伴轻度腹痛',
              '无明显高热或严重脱水表现'
            ],
            diagnoses: [
              '急性胃肠炎（轻型）'
            ],
            treatments: [
              '口服补液盐/葡萄糖溶液，小口多次',
              '暂避油腻辛辣及生冷饮食',
              '观察体温及大便次数，症状加重时及时就诊'
            ],
            suggestDrugs: ['诺氟沙星胶囊', '藿香正气水']
          },
          {
            complaint: '游玩期间出现腹泻伴轻度腹痛乏力',
            symptoms: [
              '反复稀便，腹部隐痛或阵发性腹痛',
              '伴乏力，食欲下降'
            ],
            diagnoses: [
              '功能性腹泻可能',
              '消化不良'
            ],
            treatments: [
              '建议口服补液，注意休息',
              '清淡饮食，避免刺激性食物',
              '如出现血便、高热等需尽快就诊'
            ]
          }
        ],
        '过敏': [
          {
            complaint: '接触不明物后出现全身皮疹瘙痒',
            symptoms: [
              '全身或局部出现红色丘疹/风团样皮疹',
              '瘙痒明显，无呼吸困难'
            ],
            diagnoses: [
              '荨麻疹样皮疹',
              '过敏反应'
            ],
            treatments: [
              '口服抗组胺药一次',
              '局部可外用止痒药物',
              '避免继续接触可疑过敏原，观察症状变化'
            ],
            suggestDrugs: ['氯雷他定片（开瑞坦）']
          },
          {
            complaint: '虫咬后局部红肿瘙痒不适',
            symptoms: [
              '局部红肿、皮疹，瘙痒明显',
              '一般全身情况尚可'
            ],
            diagnoses: [
              '虫咬性皮炎'
            ],
            treatments: [
              '局部冷敷或外用止痒药膏',
              '必要时口服抗过敏药',
              '嘱避免搔抓，观察有无加重或全身反应'
            ]
          },
          {
            complaint: '食用某种食物后出现口唇轻度肿胀瘙痒',
            symptoms: [
              '食用可疑食物后短时间内出现口周或口唇轻度肿胀、瘙痒',
              '无明显呼吸困难或胸闷气促'
            ],
            diagnoses: [
              '食物相关轻度过敏反应'
            ],
            treatments: [
              '口服抗组胺药一次',
              '暂避可疑食物，嘱观察症状变化',
              '如出现呼吸困难、胸闷或全身症状需立即就医'
            ]
          }
        ],
        '头晕': [
          {
            complaint: '在园区内长时间排队后出现头晕乏力',
            symptoms: [
              '长时间站立或排队后感到头晕、眼前发黑',
              '伴轻度乏力，平卧休息后好转'
            ],
            diagnoses: [
              '体位性低血压可能',
              '疲劳相关头晕'
            ],
            treatments: [
              '协助平卧或半卧休息',
              '口服葡萄糖溶液或温水',
              '嘱缓慢起身，短期内避免剧烈项目'
            ]
          },
          {
            complaint: '天气炎热时活动后出现头晕伴出汗乏力',
            symptoms: [
              '在高温环境下活动后出现头晕、乏力、大量出汗',
              '皮肤潮红或湿冷，口渴'
            ],
            diagnoses: [
              '中暑轻型',
              '高温相关不适'
            ],
            treatments: [
              '转移至阴凉通风处休息',
              '口服补液盐或葡萄糖溶液',
              '适当物理降温，观察症状变化'
            ]
          }
        ],
        '头痛': [
          {
            complaint: '久看手机或屏幕后出现头痛、眼胀',
            symptoms: [
              '长时间使用电子屏幕后出现额部或双侧头痛',
              '伴眼胀、颈部酸痛，休息后可缓解'
            ],
            diagnoses: [
              '紧张性头痛',
              '视疲劳相关头痛'
            ],
            treatments: [
              '建议暂时远离屏幕，闭目休息',
              '根据需要口服对症止痛药一次',
              '注意补水与颈肩放松练习'
            ]
          },
          {
            complaint: '户外活动后出现搏动性头痛，伴轻度恶心',
            symptoms: [
              '一侧或双侧搏动样头痛',
              '可伴恶心、对强光和噪声敏感'
            ],
            diagnoses: [
              '偏头痛样头痛可能'
            ],
            treatments: [
              '安排在安静、光线柔和环境休息',
              '根据情况口服止痛药物一次',
              '如反复发作或伴有神经系统症状建议进一步检查'
            ]
          }
        ],

        // 低血糖相关
        '低血糖': [
          {
            complaint: '空腹游玩后出现心慌出汗手抖',
            symptoms: [
              '长时间未进食后出现心慌、出冷汗、手抖',
              '可伴轻度头晕、乏力'
            ],
            diagnoses: [
              '低血糖样反应',
              '空腹相关低血糖可能'
            ],
            treatments: [
              '立即口服含糖饮料或葡萄糖溶液',
              '短期观察症状变化，缓解后继续补充少量主食',
              '提醒避免长时间空腹进行高强度活动，如症状不缓解建议就医'
            ],
            suggestDrugs: ['葡萄糖粉剂']
          },
          {
            complaint: '测血糖结果偏低，伴头晕乏力',
            symptoms: [
              '血糖监测结果低于正常范围',
              '伴有乏力、头晕、出汗等不适'
            ],
            diagnoses: [
              '低血糖发作（轻型）'
            ],
            treatments: [
              '立即补充糖分，口服葡萄糖或含糖饮料',
              '复测血糖并观察症状变化',
              '有糖尿病等基础疾病者建议回原随访医院评估用药'
            ]
          }
        ],

        // 发作/癫痫/晕厥相关
        '发作': [
          {
            complaint: '既往有癫痫史，本次在园区内出现抽搐发作',
            symptoms: [
              '突发意识障碍，伴四肢抽动',
              '发作后短暂嗜睡或意识模糊'
            ],
            diagnoses: [
              '癫痫发作（既往癫痫史）'
            ],
            treatments: [
              '发作期注意头偏向一侧，防止误吸，勿强行按压肢体',
              '发作停止后侧卧位休息，保持呼吸道通畅',
              '建议尽快联系家属并由神经专科进一步评估'
            ]
          },
          {
            complaint: '无明确既往史，本次突发抽搐样发作伴短暂意识丧失',
            symptoms: [
              '短暂意识障碍或意识丧失',
              '四肢不自主抽动，事后记忆不清'
            ],
            diagnoses: [
              '癫痫样发作待排'
            ],
            treatments: [
              '发作期注意安全保护，防止跌落伤及头面部',
              '发作后注意生命体征监测',
              '建议尽快转诊神经专科完善检查'
            ]
          },
          {
            complaint: '短暂晕倒后自行苏醒，无持续神经功能缺损',
            symptoms: [
              '突发短暂意识丧失，倒地后很快清醒',
              '事后可伴轻度乏力或头晕'
            ],
            diagnoses: [
              '不明原因晕厥待排'
            ],
            treatments: [
              '平卧抬高下肢，监测血压和心率',
              '建议行心电图及相关检查',
              '如反复发作或伴胸痛气促等症状应尽快就医'
            ]
          }
        ],

        // 痛经类
        '痛经': [
          {
            complaint: '来月经肚子隐痛、腰酸',
            symptoms: [
              '经期下腹部隐痛或胀痛，可放射至腰骶部',
              '伴腰酸、乏力，疼痛程度较轻，不影响日常活动',
              '月经量正常或略多，无血块或血块较少'
            ],
            diagnoses: [
              '轻度痛经',
              '原发性痛经可能'
            ],
            treatments: [
              '热敷腹部、休息',
              '必要时对症解痉',
              '注意保暖与规律作息'
            ],
            suggestDrugs: ['布洛芬缓释胶囊']
          },
          {
            complaint: '经期小腹坠痛、乏力',
            symptoms: [
              '经期下腹部坠痛或胀痛，疼痛程度中等',
              '伴乏力、腰酸，可能影响部分活动',
              '月经量正常，可有少量血块',
              '无恶心、呕吐等严重症状'
            ],
            diagnoses: [
              '中度痛经',
              '原发性痛经',
              '寒凝血瘀型痛经可能'
            ],
            treatments: [
              '热敷腹部、休息',
              '口服解痉止痛药（如布洛芬）',
              '注意保暖，避免受凉',
              '规律作息，避免过度劳累'
            ],
            suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
          },
          {
            complaint: '痛经明显、影响游玩',
            symptoms: [
              '经期下腹部明显疼痛，疼痛程度较重',
              '疼痛影响正常活动，可能需要休息',
              '可伴腰酸、乏力、情绪不佳',
              '月经量正常或略多，可有血块'
            ],
            diagnoses: [
              '中度痛经',
              '原发性痛经',
              '气滞血瘀型痛经可能'
            ],
            treatments: [
              '热敷腹部、休息',
              '口服解痉止痛药',
              '注意保暖与规律作息',
              '如疼痛持续或加重，建议妇科门诊进一步检查'
            ],
            suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
          },
          {
            complaint: '痛经剧痛、出冷汗、想吐',
            symptoms: [
              '经期下腹部剧烈疼痛，呈痉挛性或持续性',
              '疼痛难以忍受，严重影响活动',
              '伴出冷汗、面色苍白、恶心、想吐',
              '可伴头晕、乏力，甚至需要卧床休息',
              '月经量正常或略多，血块可能较多'
            ],
            diagnoses: [
              '重度痛经',
              '原发性痛经',
              '继发性痛经待排'
            ],
            treatments: [
              '立即休息，平卧休息',
              '热敷腹部，注意保暖',
              '口服解痉止痛药（如布洛芬）',
              '建议完善妇科检查，排除器质性疾病',
              '如症状严重或持续不缓解，建议转诊妇科专科'
            ],
            suggestDrugs: ['布洛芬缓释胶囊', '元胡止痛片']
          }
        ],

        // 测量/监测类
        '测量监测': [
          {
            complaint: '因自觉不适前来测量血压',
            symptoms: [
              '主诉头晕、心慌或乏力等症状',
              '血压监测结果在正常范围或略有波动'
            ],
            diagnoses: [
              '血压监测（结果正常）'
            ],
            treatments: [
              '记录血压结果，建议保持良好作息',
              '如反复出现不适或血压明显波动，建议门诊随访'
            ]
          },
          {
            complaint: '因头晕来测血压，结果偏高',
            symptoms: [
              '血压监测结果偏高，伴轻度不适',
              '可有头晕、头胀或耳鸣'
            ],
            diagnoses: [
              '血压监测（结果偏高）',
              '血压偏高待复测'
            ],
            treatments: [
              '建议安静休息后复测血压',
              '如多次测量均偏高，建议至门诊进一步评估',
              '注意饮食和作息管理'
            ]
          },
          {
            complaint: '因乏力、心慌等不适来测血糖',
            symptoms: [
              '血糖监测结果偏低',
              '伴有乏力、头晕、手抖等低血糖相关症状'
            ],
            diagnoses: [
              '血糖监测（结果偏低）',
              '低血糖样反应'
            ],
            treatments: [
              '口服含糖饮料或葡萄糖溶液',
              '短期内避免再次空腹高强度活动',
              '如症状不缓解或反复发作应尽快就医'
            ],
            suggestDrugs: ['葡萄糖粉剂']
          }
        ],

        // 劳损/慢性疼痛（主要面向员工）
        '劳损/慢性疼痛': [
          {
            complaint: '长时间站立或弯腰后出现腰背酸痛',
            symptoms: [
              '腰背部酸胀不适',
              '活动后疼痛加重，休息后可缓解'
            ],
            diagnoses: [
              '腰背肌筋膜炎'
            ],
            treatments: [
              '减少久坐久站，适当活动和拉伸腰背肌肉',
              '可外用止痛贴等对症处理',
              '如疼痛持续加重或伴下肢放射痛建议进一步检查'
            ]
          },
          {
            complaint: '长期伏案或低头工作后颈肩部酸痛不适',
            symptoms: [
              '颈肩部肌肉紧张酸痛',
              '久坐或保持同一姿势后症状加重'
            ],
            diagnoses: [
              '颈椎病可能'
            ],
            treatments: [
              '注意工作姿势，每小时起身活动颈肩部',
              '可行颈肩放松训练及局部热敷',
              '如伴上肢放射痛或麻木应尽快就医'
            ]
          }
        ]
      },
      // 常用药材（口服/外用一次）
      drugSuggestionList: [
        '棉签','碘伏','海诺创可贴','云南白药创可贴','一次性乳胶手套','纱布块','3%过氧化氢消毒液',
        '余氯试纸','葡萄糖粉剂','利多卡因气雾剂','消旋山莨菪碱片','甲氧氯普胺片','诺氟沙星胶囊',
        '维U颠茄铝胶囊','草珊瑚含片','氯芬黄敏片','布洛芬缓释胶囊','多潘立酮片','速效救心丸',
        '脱敏胶带','盐水清洗液','一次性吸氧管','氧气袋','红霉素眼膏','左氧氟沙星滴眼液',
        '藿香正气水','板蓝根颗粒','无菌敷贴','外科口罩','湿润烧伤膏','氯雷他定片（开瑞坦）',
        '金士康和盐水清洗液'
      ],
      rxDrugNames: ['诺氟沙星胶囊', '速效救心丸', '布洛芬缓释胶囊', '多潘立酮片', '甲氧氯普胺片'],
      form: {
        visitDateTime: '',
        name: '',
        gender: '男',
        age: null,
        identity: '游客',
        location: '',
        visitType: 'clinic',
        injuryLocation: '',
        chiefComplaint: '',
        symptom: '',
        diseaseName: '',
        diagnosis: '',
        treatment: '',
        drugId: '',
        quantity: null,
        remark: '',
        doctorSign: '',
        signTime: ''
      },
      showLocationTip: true, // 控制园区提示弹框是否显示
      noTipNextTime: false,  // 下次不再提醒
      currentDateTime: '',
      selectedDrug: null,
      selectedBatch: null,
      availableStock: 0,
      
      // 处方功能开关
      enablePrescription: false,
      
      // 处方列表
      prescriptionList: [],
      prescriptionNo: '', // 处方编号
      currentDate: '', // 当前日期
      
      // 签名组件key，用于强制重新渲染
      signatureKey: 0,
      
      // 当前正在编辑的药品信息
      currentDrug: {
        dosage: '',
        frequency: '',
        route: '',
        usage: ''
      },
      
      // 用法用量选择器索引
      frequencyIndex: 0,
      routeIndex: 0,
      
      // 用法用量模板
      dosageTemplates: {
        '口服': ['0.5g', '1g', '10ml', '20ml', '适量'],
        '外用': ['适量', '少量', '薄层涂抹'],
        '含服': ['1片', '适量']
      },
      routeOptions: ['口服', '外用', '含服', '舌下含服', '涂擦患处', '肌肉注射', '静脉注射'],
      frequencyOptions: ['即刻', '每日3次', '每日2次', '每日1次', '每8小时1次', '每12小时1次', '必要时', '睡前', '每日3-4次', '隔日1次'],
      
      // 药材搜索相关
      drugSearchText: '',
      allDrugs: [],
      filteredDrugs: [],
      showDrugList: false,
      
      // 疾病名称下拉列表（标准疾病名称）
      diseaseOptions: [
        '扭伤',
        '擦伤',
        '烫伤',
        '磕伤',
        '冻伤',
        '腹泻',
        '头晕',
        '头痛',
        '感冒',
        '脱臼',
        '骨折',
        '过敏',
        '痛经',
        '测血压',
        '其他'
      ],
      filteredDiseases: [],
      showDiseaseList: false,
      // 诊断/处置下拉
      filteredDiagnosis: [],
      showDiagnosisList: false,
      filteredTreatments: [],
      showTreatmentList: false,
      // 主诉下拉
      filteredComplaints: [],
      showComplaintList: false,
      complaintSelectedMode: false,  // 主诉是否已选择（自由编辑模式）
      complaintFocus: false,  // 控制主诉输入框聚焦
      // 症状相关
      filteredSymptoms: [],
      showSymptomList: false,
      standardizedSymptoms: [],  // 从主诉标准化提取的症状列表
      symptomBlurTimer: null,
      symptomInputTimer: null,  // 症状输入防抖计时器
      fetchHvSuggestionTimer: null,  // 获取诊断建议防抖计时器
      // 下拉隐藏延迟计时器
      diseaseBlurTimer: null,
      complaintBlurTimer: null,
      diagnosisBlurTimer: null,
      // 输入防抖计时器
      diseaseInputTimer: null,
      diagnosisInputTimer: null,
      // 年龄输入焦点（用于强制弹出数字键盘）
      ageFocus: false,
      // 园区常用地点词库（来自园区运营文件与现场点位）
      allLocations: [
        // 大区
        '欢乐时光区','甜品王国区','香格里拉区','失落玛雅区','爱琴港区','峡湾深林区',
        // 典型点位/场所
        '欢乐广场','星闪舞台','旱喷泉','环道','树屋打卡点','情人廊','外广场','停车场','闸口','水公园闸口','大剧院正门',
        // 乐园入口/屏幕
        '香格里拉大屏幕','二期舞台屏幕','太空盒子外屏幕','海洋馆小舞台','奇幻海洋馆',
        // 餐饮/店铺/项目口
        '乐迪历险记门口','超飞主题餐厅','克罗索斯餐厅','家庭过山车入口','玛雅天灾入口',
        // 糖果摊位
        '甜蜜蜜','牛角包','太阳',
        // 大型景观/设备标识
        '水晶神翼大山','音乐过山车提升段','雪域金翅提升段','大剧院'
      ],
      filteredLocations: [],
      showLocationList: false,
      
      showDrugSelector: false,
      submitting: false,
      continueAfterSubmit: true,  // 默认开启连续登记

      // 当前聚焦字段的容器 id，用于配合 scroll-view 的 scroll-into-view，让输入框始终滚到键盘上方
      activeFieldId: '',

      // 定时器 ID：用于更新就诊时间，页面卸载时清理
      dateTimeTimerId: null,

      // 用户自定义疾病模板（本地持久化），按疾病名分组
      // 结构示例：
      // {
      //   '扭伤': {
      //      complaints: [ '行走时不慎扭伤踝关节，局部肿胀疼痛，活动受限', ... ],
      //      diagnosis: [ '软组织扭伤（待进一步检查）', ... ],
      //      treatments: [ '局部冷敷', '弹力绷带加压包扎', ... ]
      //   },
      //   ...
      // }
      userDiseaseTemplates: {},

      // 多框搜索统一索引：汇总所有模板为 [{disease, complaint, diagnoses[], treatments[], symptoms[], source}]
      templateIndex: [],
      // 全局搜索关键词（用于跨字段联动）
      globalSearchKeyword: ''
    };
  },

  computed: {
    currentLocationLabel() {
      const loc = this.form?.location
      if (loc === 'land_park') return '陆园'
      if (loc === 'water_park') return '水园'
      return '未选择'
    },

    // 未选择合法园区时，锁定表单核心输入
    locationLocked() {
      const loc = this.form?.location
      return !loc || (loc !== 'land_park' && loc !== 'water_park')
    },
    
    // 根据主诉内容长度动态调整字号
    complaintFontSizeClass() {
      const length = (this.form.chiefComplaint || '').length;
      if (length > 50) return 'font-small';
      if (length > 30) return 'font-medium';
      return '';
    },
    
    // 根据诊断内容长度动态调整字号
    diagnosisFontSizeClass() {
      const length = (this.form.diagnosis || '').length;
      if (length > 50) return 'font-small';
      if (length > 30) return 'font-medium';
      return '';
    },
    
    // 当前选择的用药频次标签
    currentFrequencyLabel() {
      return this.frequencyOptions[this.frequencyIndex] || '请选择';
    },
    
    // 当前选择的给药途径标签
    currentRouteLabel() {
      return this.routeOptions[this.routeIndex] || '请选择';
    }
  },

  onLoad() {
    this.updateDateTime();
    // 每分钟更新一次时间，并记录定时器 ID，便于卸载时清理
    this.dateTimeTimerId = setInterval(() => {
      this.updateDateTime();
    }, 60000);
    
    // 初始化处方编号和日期
    this.initPrescription();
    
    // 恢复上次选择的园区
    this.restoreLastLocation();
    
    // 恢复用户自定义疾病模板
    this.restoreUserDiseaseTemplates();

    // 构建多框搜索统一索引
    this.buildTemplateIndex();

    // 加载药材列表
    this.loadAllDrugs();
  },

  onUnload() {
    // 页面卸载时清理定时器，避免多次进入页面产生重复计时
    if (this.dateTimeTimerId) {
      clearInterval(this.dateTimeTimerId);
      this.dateTimeTimerId = null;
    }
    // 清理防抖计时器
    if (this.symptomInputTimer) {
      clearTimeout(this.symptomInputTimer);
      this.symptomInputTimer = null;
    }
    if (this.fetchHvSuggestionTimer) {
      clearTimeout(this.fetchHvSuggestionTimer);
      this.fetchHvSuggestionTimer = null;
    }
    if (this.diseaseInputTimer) {
      clearTimeout(this.diseaseInputTimer);
      this.diseaseInputTimer = null;
    }
    if (this.diagnosisInputTimer) {
      clearTimeout(this.diagnosisInputTimer);
      this.diagnosisInputTimer = null;
    }
    if (this.complaintInputTimer) {
      clearTimeout(this.complaintInputTimer);
      this.complaintInputTimer = null;
    }
    if (this.complaintFocusTimer) {
      clearTimeout(this.complaintFocusTimer);
      this.complaintFocusTimer = null;
    }
  },

  watch: {
    // 监听主诉字段变化，清空时联动清空所有相关字段
    'form.chiefComplaint'(newVal, oldVal) {
      const newComplaint = (newVal || '').trim();
      const oldComplaint = (oldVal || '').trim();
      
      // 从有内容变为空
      if (oldComplaint && !newComplaint) {
        // 检查是否有已填写的相关字段
        const hasRelatedData = 
          this.form.symptom || 
          this.form.diagnosis || 
          this.form.diseaseName || 
          this.form.treatment || 
          this.prescriptionList.length > 0;
        
        if (hasRelatedData) {
          // 延迟执行，避免与输入事件冲突
          this.$nextTick(() => {
            uni.showModal({
              title: '清空确认',
              content: '清空主诉将同时清空症状、诊断、疾病名称、处置和处方等相关信息，是否继续？',
              confirmText: '确认清空',
              cancelText: '取消',
              confirmColor: '#dc2626',
              success: (res) => {
                if (res.confirm) {
                  this.clearAllRelatedFields();
                } else {
                  // 恢复主诉内容
                  this.form.chiefComplaint = oldComplaint;
                }
              }
            });
          });
        } else {
          // 没有相关数据，直接清空
          this.clearAllRelatedFields();
        }
      }
    }
  },

  methods: {
    // ✨ 清空所有相关字段（主诉清空时调用）
    clearAllRelatedFields() {
      // 1. 清空就诊信息相关字段
      this.form.symptom = '';           // 症状
      this.form.diagnosis = '';         // 诊断
      this.form.diseaseName = '';       // 疾病名称
      this.form.treatment = '';         // 处置
      
      // 2. 清空用药信息
      this.selectedDrug = null;         // 选中的药材
      this.form.drugId = '';            // 药材ID
      this.form.quantity = null;        // 用药数量
      this.drugSearchText = '';         // 药材搜索文本
      
      // 3. 清空处方列表
      this.prescriptionList = [];       // 处方列表
      
      // 4. 清空辅助数据
      this.standardizedSymptoms = [];   // 标准化症状
      this.hvTriage = null;             // 分诊建议
      
      // 5. 重置模式
      this.complaintSelectedMode = false;
      
      // 6. 关闭所有下拉列表
      this.showSymptomList = false;
      this.showDiagnosisList = false;
      this.showDiseaseList = false;
      this.showTreatmentList = false;
      this.showDrugList = false;
      this.showComplaintList = false;
      
      console.log('[clinic/add] 已清空主诉及所有相关字段');
    },
    
    // 初始化处方信息
    initPrescription() {
      // 生成处方编号：格式 年份-流水号（如2025-0001）
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      
      // 使用时间戳的后4位作为流水号（简化版，实际应该从数据库获取）
      const timestamp = Date.now();
      const serialNo = (timestamp % 10000).toString().padStart(4, '0');
      
      this.prescriptionNo = `${year}-${serialNo}`;
      this.currentDate = `${year}年${month}月${day}日`;
    },
    
    // 用药频次选择器变化
    onFrequencyChange(e) {
      this.frequencyIndex = e.detail.value;
      this.currentDrug.frequency = this.frequencyOptions[this.frequencyIndex];
    },
    
    // 给药途径选择器变化
    onRouteChange(e) {
      this.routeIndex = e.detail.value;
      this.currentDrug.route = this.routeOptions[this.routeIndex];
    },
    
    // 处方开关切换
    onPrescriptionSwitch(e) {
      this.enablePrescription = e.detail.value;
      
      // 如果开启处方，初始化处方信息
      if (this.enablePrescription && !this.prescriptionNo) {
        this.initPrescription();
      }
    },
    
    // 从药品规格中提取真正的最小单位
    getRealMinUnit(drug) {
      const spec = drug.specification || '';
      
      // 常见的最小单位
      const minUnits = ['片', '粒', '丸', '支', '袋', '包'];
      
      // 从规格中查找最小单位
      for (const unit of minUnits) {
        if (spec.includes(unit)) {
          return unit;
        }
      }
      
      // 如果规格中没有找到，返回原始的minUnit
      return drug.minUnit;
    },
    
    // 从药品规格中提取默认单次剂量
    // 如果有剂量单位（如0.1g, 5mg），返回剂量；否则返回最小单位（如1片、1粒）
    getDefaultDosage(drug) {
      if (!drug) return '';
      
      const spec = drug.specification || '';
      
      // 尝试匹配剂量格式：如 0.25g、5mg、10ml 等
      // 匹配模式：数字 + 单位（g, mg, ml, μg, mcg, ug等）
      // 优先匹配规格开头的剂量部分（如 "0.25g×24粒/盒" 中的 "0.25g"）
      const dosageMatch = spec.match(/^(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i);
      if (dosageMatch) {
        // 找到剂量单位，返回剂量值+单位
        return `${dosageMatch[1]}${dosageMatch[2].toLowerCase()}`;
      }
      
      // 如果开头没有，尝试匹配整个规格中的第一个剂量（如 "24粒/盒" 中没有剂量，但 "0.25g×24粒/盒" 中有）
      const anyDosageMatch = spec.match(/(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i);
      if (anyDosageMatch) {
        return `${anyDosageMatch[1]}${anyDosageMatch[2].toLowerCase()}`;
      }
      
      // 如果没有找到剂量单位，返回最小单位（如1片、1粒）
      const minUnit = this.getRealMinUnit(drug);
      return `1${minUnit}`;
    },
    
    // 获取单次剂量占位符文本
    getDosagePlaceholder(drug) {
      if (!drug) return '如：1片';
      
      const spec = drug.specification || '';
      
      // 检查是否有剂量单位
      const hasDosageUnit = /(\d+\.?\d*)\s*(mg|g|ml|μg|mcg|ug|毫升|ML)/i.test(spec);
      
      if (hasDosageUnit) {
        // 有剂量单位，提示可以输入剂量或单位
        return '如：0.1g、5mg等';
      } else {
        // 没有剂量单位，提示输入最小单位
        const minUnit = this.getRealMinUnit(drug);
        return `如：1${minUnit}`;
      }
    },
    
    // 添加到处方（使用 FIFO 自动分配批次）
    async addToPrescription() {
      // 1. 验证：是否选择药品
      if (!this.selectedDrug) {
        uni.showToast({
          title: '请先选择药材',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 2. 验证：是否输入数量
      if (!this.form.quantity || this.form.quantity <= 0) {
        uni.showToast({
          title: '请输入有效数量',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 3. 调用 FIFO 云函数自动分配批次
      uni.showLoading({ title: '分配批次中...' });
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'stockManage',
          data: {
            action: 'allocateBatchesFIFO',
            data: {
              drugId: this.selectedDrug._id,
              requiredQuantity: this.form.quantity,
              location: this.form.location
            }
          }
        });
        
        uni.hideLoading();
        
        console.log('[FIFO分配结果]:', res.result);
        
        if (res.result.success) {
          const allocation = res.result.data;
          
          // 4. 检查是否有近效期药品
          if (allocation.hasNearExpiry) {
            // 找出近效期的批次
            const nearExpiryBatches = allocation.allocation.filter(b => b.isNearExpiry);
            const nearExpiryInfo = nearExpiryBatches.map(b => 
              `批次${b.batch}：${b.daysToExpire}天后过期`
            ).join('\n');
            
            // 显示近效期提示，让用户确认
            uni.showModal({
              title: '⚠️ 近效期提示',
              content: `检测到近效期药品（90天内过期）：\n\n${nearExpiryInfo}\n\n是否继续添加到处方？`,
              confirmText: '继续添加',
              cancelText: '取消',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // 用户确认后添加
                  this.doAddToPrescription(allocation);
                }
              }
            });
          } else {
            // 5. 没有近效期，直接添加
            this.doAddToPrescription(allocation);
          }
        } else {
          // FIFO 分配失败（库存不足等）
          const errorMsg = res.result.message || '批次分配失败';
          
          // 如果是库存不足，给用户选择是否继续
          if (errorMsg.includes('库存不足')) {
            uni.showModal({
              title: '库存不足提醒',
              content: `${errorMsg}\n\n是否仍要添加到处方？`,
              confirmText: '仍要添加',
              cancelText: '取消',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  // 用户确认后，使用空的分配信息添加
                  this.doAddToPrescription(null);
                }
              }
            });
          } else {
            // 其他错误，直接提示
            uni.showToast({
              title: errorMsg,
              icon: 'none',
              duration: 2000
            });
          }
        }
      } catch (err) {
        uni.hideLoading();
        console.error('[FIFO分配异常]:', err);
        uni.showToast({
          title: '批次分配失败',
          icon: 'none',
          duration: 2000
        });
      }
    },
    
    // 执行添加到处方的核心逻辑
    // @param {Object} allocation - FIFO分配结果（可选）
    doAddToPrescription(allocation = null) {
      // 使用表单中的用法用量数据
      const dosage = (this.currentDrug.dosage || '').trim();
      const route = (this.currentDrug.route || '').trim();
      const frequency = (this.currentDrug.frequency || '').trim();
      
      // 构建处方项基本信息
      const prescriptionItem = {
        // 药品基本信息
        drugId: this.selectedDrug._id,
        drugName: this.selectedDrug.name,
        specification: this.selectedDrug.specification,
        manufacturer: this.selectedDrug.manufacturer,
        
        // 数量和单位
        quantity: this.form.quantity,
        unit: this.getRealMinUnit(this.selectedDrug),
        packUnit: this.selectedDrug.packUnit,
        minUnit: this.selectedDrug.minUnit,
        conversionRate: this.selectedDrug.conversionRate,
        
        // 用法用量
        dosage: dosage,
        route: route,
        frequency: frequency,
        usage: (this.currentDrug.usage || '').trim(),
        
        // 完整的 drug 对象引用（用于后续处理）
        drug: this.selectedDrug
      };
      
      // 如果有 FIFO 分配结果，使用分配的批次信息
      if (allocation && allocation.allocation && allocation.allocation.length > 0) {
        // ✅ 使用 FIFO 分配的批次信息
        prescriptionItem.batchAllocation = allocation.allocation; // 完整的批次分配信息
        prescriptionItem.batchCount = allocation.batchCount; // 批次数量
        prescriptionItem.hasNearExpiry = allocation.hasNearExpiry; // 是否有近效期
        
        // 为了兼容性，设置第一个批次为主批次
        const firstBatch = allocation.allocation[0];
        prescriptionItem.batchId = firstBatch.batchId;
        prescriptionItem.batchNumber = firstBatch.batch;
        prescriptionItem.expiryDate = firstBatch.expireDate;
        prescriptionItem.batch = {
          _id: firstBatch.batchId,
          batch: firstBatch.batch,
          expireDate: firstBatch.expireDate,
          quantity: firstBatch.quantity
        };
      } else {
        // ✅ 没有 FIFO 分配结果，使用旧的批次选择方式（兼容）
        prescriptionItem.batchId = this.selectedBatch?._id;
        prescriptionItem.batchNumber = this.selectedBatch?.batch;
        prescriptionItem.expiryDate = this.selectedBatch?.expireDate;
        prescriptionItem.batch = this.selectedBatch;
        prescriptionItem.batchAllocation = null;
        prescriptionItem.batchCount = this.selectedBatch ? 1 : 0;
        prescriptionItem.hasNearExpiry = false;
      }
      
      // 添加到处方列表
      this.prescriptionList.push(prescriptionItem);
      
      // ✅ 自动开启处方开关
      if (!this.enablePrescription) {
        this.enablePrescription = true;
      }
      
      // ✅ 清空数量输入框
      this.form.quantity = null;
      
      // ✅ 重新加载批次和库存
      if (this.selectedDrug && this.selectedDrug._id) {
        this.loadBatches();
      }
      
      // 成功提示
      uni.showToast({
        title: `已加入处方：${this.selectedDrug.name}`,
        icon: 'success',
        duration: 2000
      });
      
      // ✅ 滚动到处方区域，让用户看到添加结果
      this.$nextTick(() => {
        uni.pageScrollTo({
          selector: '.prescription-section',
          duration: 300
        });
      });
    },
    
    // 格式化规格和数量显示（例如：0.3gX1粒）
    formatSpecQuantity(item) {
      const parts = [];
      
      // 提取基本规格（去除包装信息）
      if (item.specification) {
        // 匹配规格中的基本单位部分，如 "0.3g" 从 "0.3g*20粒" 中提取
        const baseSpecMatch = item.specification.match(/^(\d+\.?\d*\s*(?:mg|g|ml|μg|mcg|ug|毫升|ML))/i);
        if (baseSpecMatch) {
          // 如果有基本规格（如 0.3g），只使用基本规格
          parts.push(baseSpecMatch[1]);
        } else {
          // 如果没有匹配到基本规格，使用完整规格
          parts.push(item.specification);
        }
      }
      
      // 添加实际数量
      if (item.quantity && item.unit) {
        const quantityStr = `X${item.quantity}${item.unit}`;
        parts.push(quantityStr);
      }
      
      return parts.length > 0 ? parts.join('') : '';
    },
    
    // 格式化用法用量显示
    formatUsage(item) {
      const parts = [];
      if (item.dosage) parts.push(item.dosage);
      if (item.route) parts.push(item.route);
      if (item.frequency) parts.push(item.frequency);
      return parts.join('  ');
    },
    
    // 从处方中移除
    removeFromPrescription(index) {
      uni.showModal({
        title: '确认删除',
        content: '确定要从处方中移除这味药吗？',
        success: (res) => {
          if (res.confirm) {
            this.prescriptionList.splice(index, 1);
            uni.showToast({
              title: '已移除',
              icon: 'success'
            });
          }
        }
      });
    },
    
    // 快速添加到处方（从药材选择区域）
    quickAddToPrescription() {
      // 如果没有选择药材，提示用户先选择
      if (!this.selectedDrug) {
        uni.showToast({
          title: '请先选择药材',
          icon: 'none',
          duration: 2000
        });
        // 滚动到药材选择区域
        this.$nextTick(() => {
          uni.pageScrollTo({
            selector: '#field-drug',
            duration: 300
          });
        });
        return;
      }
      
      // 如果没有输入数量，提示用户输入
      if (!this.form.quantity || this.form.quantity <= 0) {
        uni.showToast({
          title: '请先输入用药数量',
          icon: 'none',
          duration: 2000
        });
        return;
      }
      
      // 检查库存
      if (this.form.quantity > this.availableStock) {
        uni.showModal({
          title: '库存不足',
          content: `当前库存：${this.availableStock} ${this.getRealMinUnit(this.selectedDrug)}，是否仍要添加？`,
          success: (res) => {
            if (res.confirm) {
              this.addToPrescription();
            }
          }
        });
        return;
      }
      
      // 直接调用添加到处方方法
      this.addToPrescription();
    },
    
    onFieldFocus(id) {
      this.activeFieldId = id;
    },
    // 医生签名组件回调
    onDoctorSignChange(value) {
      // value 为签名图片的云文件ID或Base64，由 Signature 组件约定
      this.form.doctorSign = value;
      // 同时记录签名时间，便于在页面显示“签名时间”
      const now = new Date();
      const y = now.getFullYear();
      const m = (now.getMonth() + 1).toString().padStart(2, '0');
      const d = now.getDate().toString().padStart(2, '0');
      const hh = now.getHours().toString().padStart(2, '0');
      const mm = now.getMinutes().toString().padStart(2, '0');
      const ss = now.getSeconds().toString().padStart(2, '0');
      this.form.signTime = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
    },

    // 恢复用户自定义疾病模板（本地存储）
    restoreUserDiseaseTemplates() {
      try {
        const stored = uni.getStorageSync('clinic_user_disease_templates');
        if (stored && typeof stored === 'object') {
          this.userDiseaseTemplates = stored;
        }
      } catch (e) {
        console.error('恢复用户疾病模板失败:', e);
        this.userDiseaseTemplates = {};
      }
    },

    // 构建多框搜索统一索引：汇总系统模板、结构化模板、用户自定义模板
    buildTemplateIndex() {
      const index = [];
      const maxIndexSize = 1000; // 限制索引最大数量，避免内存和性能问题

      // 1) 结构化模板库 diseaseTemplateLib
      const diseaseKeys = Object.keys(this.diseaseTemplateLib || {});
      for (let i = 0; i < diseaseKeys.length && index.length < maxIndexSize; i++) {
        const disease = diseaseKeys[i];
        const list = this.diseaseTemplateLib[disease] || [];
        const maxListSize = Math.min(list.length, 50); // 每个疾病最多50条模板
        for (let j = 0; j < maxListSize && index.length < maxIndexSize; j++) {
          const tpl = list[j];
          if (tpl && tpl.complaint) {
            index.push({
              disease,
              complaint: tpl.complaint,
              symptoms: tpl.symptoms || [],
              diagnoses: tpl.diagnoses || [],
              treatments: tpl.treatments || [],
              source: 'structured',
              idx: j
            });
          }
        }
      }

      // 2) 旧版模板：complaintTemplates + diseaseTemplates + treatmentTemplates
      if (index.length < maxIndexSize) {
        const complaintKeys = Object.keys(this.complaintTemplates || {});
        for (let i = 0; i < complaintKeys.length && index.length < maxIndexSize; i++) {
          const disease = complaintKeys[i];
        const complaint = this.complaintTemplates[disease];
        const diagnoses = this.diseaseTemplates?.[disease] || [];
        const treatments = this.treatmentTemplates?.[disease] || [];
        if (complaint) {
          index.push({
            disease,
            complaint,
            symptoms: [],
            diagnoses,
            treatments,
            source: 'legacy'
          });
        }
        }
      }

      // 3) 用户自定义模板 userDiseaseTemplates
      if (index.length < maxIndexSize) {
        const userKeys = Object.keys(this.userDiseaseTemplates || {});
        for (let i = 0; i < userKeys.length && index.length < maxIndexSize; i++) {
          const disease = userKeys[i];
        const userTpl = this.userDiseaseTemplates[disease];
          if (!userTpl) continue;
          const complaints = userTpl.complaints || [];
          const maxComplaints = Math.min(complaints.length, 20); // 每个疾病最多20条用户模板
          for (let j = 0; j < maxComplaints && index.length < maxIndexSize; j++) {
            const complaint = complaints[j];
          if (complaint) {
            index.push({
              disease,
              complaint,
              symptoms: [],
              diagnoses: userTpl.diagnosis || [],
              treatments: userTpl.treatments || [],
              source: 'user',
                userIdx: j
            });
          }
          }
        }
      }

      this.templateIndex = index;
      console.log(`构建模板索引完成，共 ${index.length} 条记录`);
    },

    // 全局搜索：多条件并列搜索(AND逻辑)，同时匹配疾病/主诉/诊断三个关键词
    // 并结合 hvComplaintKeywordIndex 做主诉关键词→多主诉模板联想
    performGlobalSearch(diseaseKw, complaintKw, diagnosisKw) {
      const dKw = (diseaseKw || '').trim().toLowerCase();
      const cKw = (complaintKw || '').trim().toLowerCase();
      const dgKw = (diagnosisKw || '').trim().toLowerCase();

      // 如果三个关键词都为空，返回所有疾病和空列表
      if (!dKw && !cKw && !dgKw) {
        return {
          diseases: this.diseaseOptions,
          complaints: [],
          diagnoses: []
        };
      }

      // 性能优化：限制搜索范围，避免遍历过多数据
      const maxSearchCount = 500; // 最多搜索500条记录
      const searchIndex = this.templateIndex.slice(0, maxSearchCount);

      // 多条件并列过滤：同时满足所有非空关键词（基于结构化模板索引）
      const matchedRecords = [];
      for (let i = 0; i < searchIndex.length; i++) {
        const rec = searchIndex[i];
        let match = true;
        // 疾病关键词匹配
        if (dKw) {
          match = match && rec.disease && rec.disease.toLowerCase().includes(dKw);
        }
        // 主诉关键词匹配
        if (cKw) {
          match = match && rec.complaint && rec.complaint.toLowerCase().includes(cKw);
        }
        // 诊断关键词匹配
        if (dgKw) {
          match = match && (rec.diagnoses || []).some(d => d && d.toLowerCase().includes(dgKw));
        }
        if (match) {
          matchedRecords.push(rec);
          // 限制结果数量，找到足够的结果就停止
          if (matchedRecords.length >= 50) break;
        }
      }

      // 提取匹配的疾病、主诉、诊断（去重）
      const diseases = Array.from(new Set(matchedRecords.map(r => r.disease)));
      const baseComplaints = matchedRecords.map((r, idx) => ({
        key: `${r.disease}_${idx}`,
        label: r.complaint,
        disease: r.disease,
        record: r
      }));

      const diagSet = new Set();
      matchedRecords.forEach(r => {
        (r.diagnoses || []).forEach(d => diagSet.add(d));
      });
      const diagnoses = Array.from(diagSet);

      // 基于主诉关键词，追加 hvComplaintKeywordIndex 中的主诉模板（限制数量）
      const extraComplaints = [];
      if (cKw) {
        const keywordKeys = Object.keys(hvComplaintKeywordIndex || {});
        const maxKeywords = Math.min(keywordKeys.length, 20); // 最多检查20个关键词
        for (let i = 0; i < maxKeywords && extraComplaints.length < 20; i++) {
          const key = keywordKeys[i];
          const k = (key || '').toLowerCase();
          // 关键词双向包含："中暑" / "扭伤" / "晕动病" 等
          if (!k) continue;
          if (k.includes(cKw) || cKw.includes(k)) {
            const items = hvComplaintKeywordIndex[key] || [];
            const maxItems = Math.min(items.length, 5); // 每个关键词最多5条
            for (let j = 0; j < maxItems && extraComplaints.length < 20; j++) {
              const item = items[j];
              extraComplaints.push({
                key: `hv_${key}_${j}`,
                label: item.complaint,
                disease: item.diseaseName,
                record: {
                  disease: item.diseaseName,
                  complaint: item.complaint,
                  symptoms: [],
                  diagnoses: [item.diseaseName],
                  treatments: [],
                  source: 'hv_keyword'
                }
            });
          }
          }
        }
      }

      // 合并去重（按 complaint 文本去重）
      const mergedMap = new Map();
      [...baseComplaints, ...extraComplaints].forEach(c => {
        if (!mergedMap.has(c.label)) {
          mergedMap.set(c.label, c);
        }
      });
      const complaints = Array.from(mergedMap.values());

      return { diseases, complaints, diagnoses };
    },

    // 查找最匹配的模板记录（基于多个字段同时匹配）
    findBestMatchingRecord(diagnosis, complaint, diseaseName) {
      let bestMatch = null;
      let bestScore = 0;
      
      // 如果所有参数都为空，返回null
      if (!diagnosis && !complaint && !diseaseName) {
        return null;
      }
      
      for (const record of this.templateIndex) {
        let score = 0;
        
        // 诊断匹配度（权重最高）
        if (diagnosis && record.diagnoses && record.diagnoses.length) {
          const diagnosisMatch = record.diagnoses.some(d => {
            if (!d) return false;
            const dLower = d.toLowerCase();
            const diagnosisLower = diagnosis.toLowerCase();
            return d === diagnosis || 
                   dLower === diagnosisLower ||
                   dLower.includes(diagnosisLower) || 
                   diagnosisLower.includes(dLower);
          });
          if (diagnosisMatch) score += 5; // 诊断匹配权重最高
        }
        
        // 主诉匹配度
        if (complaint && record.complaint) {
          const complaintLower = (record.complaint || '').toLowerCase();
          const inputComplaintLower = complaint.toLowerCase();
          if (complaintLower === inputComplaintLower) {
            score += 4; // 完全匹配
          } else if (complaintLower.includes(inputComplaintLower) || 
                     inputComplaintLower.includes(complaintLower)) {
            score += 2; // 部分匹配
          }
        }
        
        // 疾病名称匹配度
        if (diseaseName && record.disease) {
          const diseaseLower = (record.disease || '').toLowerCase();
          const inputDiseaseLower = diseaseName.toLowerCase();
          if (diseaseLower === inputDiseaseLower) {
            score += 3; // 完全匹配
          } else if (diseaseLower.includes(inputDiseaseLower) || 
                     inputDiseaseLower.includes(diseaseLower)) {
            score += 1; // 部分匹配
          }
        }
        
        // 选择得分最高的记录
        if (score > bestScore) {
          bestScore = score;
          bestMatch = record;
        }
      }
      
      // 只有得分大于0的记录才返回（至少有一个字段匹配）
      return bestScore > 0 ? bestMatch : null;
    },

    // 智能填充字段：只填充空白字段，保留用户已输入的内容
    smartFillFields(record, options = {}) {
      if (!record) return;
      
      const {
        preserveComplaint = false,  // 是否保留主诉
        preserveSymptom = false,    // 是否保留症状
        preserveDiagnosis = false,  // 是否保留诊断
        preserveTreatment = false    // 是否保留处置
      } = options;
      
      // 主诉：如果为空或允许覆盖，则填充
      if (!preserveComplaint) {
        const currentComplaint = (this.form.chiefComplaint || '').trim();
        if (!currentComplaint && record.complaint) {
          this.form.chiefComplaint = record.complaint;
        }
      }
      
      // 症状：如果为空或允许覆盖，则填充
      if (!preserveSymptom) {
        const currentSymptom = (this.form.symptom || '').trim();
        if (!currentSymptom && record.symptoms && record.symptoms.length) {
          this.form.symptom = record.symptoms.join('；');
        }
      }
      
      // 诊断：如果为空或允许覆盖，则填充
      if (!preserveDiagnosis) {
        const currentDiagnosis = (this.form.diagnosis || '').trim();
        if (!currentDiagnosis && record.diagnoses && record.diagnoses.length) {
          this.form.diagnosis = record.diagnoses.join('；');
        }
      }
      
      // 处置：如果为空或允许覆盖，则填充
      if (!preserveTreatment) {
        const currentTreatment = (this.form.treatment || '').trim();
        if (!currentTreatment && record.treatments && record.treatments.length) {
          this.form.treatment = record.treatments.join('；');
        }
      }
      
      // 疾病名称：始终更新（用于分类），但基于诊断分析
      if (record.diagnoses && record.diagnoses.length) {
        const mainDiagnosis = record.diagnoses[0];
        const analyzedDisease = this.analyzeDiseaseFromDiagnosis(mainDiagnosis);
        if (analyzedDisease) {
          this.form.diseaseName = analyzedDisease;
        } else if (record.disease) {
          this.form.diseaseName = record.disease;
        }
      } else if (record.disease) {
        this.form.diseaseName = record.disease;
      }
    },

    setIdentity(val) {
      if (!this.form) return
      this.form.identity = val
    },
    setVisitType(val) {
      if (!this.form) return
      this.form.visitType = val
    },
    openLocationSelector() {
      const itemList = this.locations.map(l => l.label)
      uni.showActionSheet({
        itemList,
        success: (res) => {
          const idx = res.tapIndex
          const target = this.locations[idx]
          if (target) {
            this.selectLocation(target.value)
          }
        }
      })
    },
    // 关闭园区提示弹框
    closeLocationTip() {
      this.showLocationTip = false
      try {
        if (this.noTipNextTime) {
          uni.setStorageSync('clinic_location_tip_closed', true)
        }
      } catch (e) {}
    },

    // 从弹框中选择园区
    handleLocationSelect(location) {
      this.selectLocation(location)
      try {
        if (this.noTipNextTime) {
          uni.setStorageSync('clinic_location_tip_closed', true)
        }
      } catch (e) {}
      this.showLocationTip = false
    },
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

    // 加载所有药材
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
        console.error('加载药材列表失败:', err);
      }
    },

    // 药材输入框获得焦点
    async onDrugInputFocus() {
      this.showDrugList = true;
      
      // 如果没有输入内容，显示当前园区的所有药材
      if (!this.drugSearchText || this.drugSearchText.trim() === '') {
        // 没有输入内容，显示所有药材
        this.filteredDrugs = this.allDrugs;
      } else {
        this.onDrugSearch();
      }
    },

    // 加载当前园区的药材
    async loadLocationDrugs() {
      try {
        uni.showLoading({ title: '加载药材...' });
        
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
          // 过滤出有库存的药材
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
          
          console.log(`加载了${this.filteredDrugs.length}种药材`);
        } else {
          // 如果获取失败，显示所有药材
          this.filteredDrugs = this.allDrugs.slice(0, 50);
        }
      } catch (err) {
        console.error('加载园区药材失败:', err);
        uni.hideLoading();
        // 失败时显示所有药材
        this.filteredDrugs = this.allDrugs.slice(0, 50);
      }
    },

    // 药材输入框获得焦点
    onDrugInputFocus() {
      // 检查是否已选择园区
      if (!this.form.location) {
        uni.showToast({
          title: '请先选择就诊园区',
          icon: 'none',
          duration: 2000
        });
        this.showLocationTip = true;
        return;
      }
      
      // 如果没有搜索内容，加载当前园区的所有药材
      if (!this.drugSearchText || this.drugSearchText.trim() === '') {
        this.loadLocationDrugs();
      }
      
      // 显示药品下拉列表
      this.showDrugList = true;
    },

    // 药材搜索
    onDrugSearch() {
      if (!this.drugSearchText || this.drugSearchText.trim() === '') {
        // 没有搜索内容时，加载当前园区药材
        this.loadLocationDrugs();
        return;
      }

      const keyword = this.drugSearchText.toLowerCase();
      // 从当前园区的药材中搜索
      if (this.filteredDrugs.length > 0 && !this.drugSearchText) {
        // 已经加载了园区药材，在其中搜索
        const currentList = [...this.filteredDrugs];
        this.filteredDrugs = currentList.filter(drug => {
          const name = (drug.name || '').toLowerCase();
          const genericName = (drug.genericName || '').toLowerCase();
          const spec = (drug.specification || '').toLowerCase();
          const tradeNames = Array.isArray(drug.tradeNames) ? drug.tradeNames : [];
          const hitTrade = tradeNames.some(t => (t || '').toLowerCase().includes(keyword));

          return name.includes(keyword) ||
                 genericName.includes(keyword) ||
                 spec.includes(keyword) ||
                 hitTrade;
        });
      } else {
        // 从所有药材中搜索
        this.filteredDrugs = this.allDrugs.filter(drug => {
          const name = (drug.name || '').toLowerCase();
          const genericName = (drug.genericName || '').toLowerCase();
          const pinyin = (drug.pinyin || '').toLowerCase();
          const spec = (drug.specification || drug.spec || '').toLowerCase();
          const tradeNames = Array.isArray(drug.tradeNames) ? drug.tradeNames : [];
          const hitTrade = tradeNames.some(t => (t || '').toLowerCase().includes(keyword));

          return name.includes(keyword) ||
                 genericName.includes(keyword) ||
                 pinyin.includes(keyword) ||
                 spec.includes(keyword) ||
                 hitTrade;
        }).slice(0, 30); // 最多显示30个结果
      }
    },

    // 从列表选择药材
    selectDrugFromList(drug) {
      this.drugSearchText = drug.name;
      this.onDrugSelect(drug);
      this.showDrugList = false;
      
      // 选择药材后自动联动填充默认值
      this.autoFillDrugDefaults(drug);
    },
    
    // 自动填充药材默认值（联动功能）
    autoFillDrugDefaults(drug) {
      // 1. 根据药材类型自动设置默认用药数量
      if (!this.form.quantity || this.form.quantity === 0) {
        // 根据药材名称智能推荐数量
        if (drug.name.includes('创可贴') || drug.name.includes('纱布') || drug.name.includes('棉签')) {
          this.form.quantity = 1; // 外用材料默认1个
        } else if (drug.name.includes('片') || drug.name.includes('粒') || drug.name.includes('胶囊')) {
          this.form.quantity = 2; // 口服药默认2片/粒
        } else if (drug.name.includes('水') || drug.name.includes('液')) {
          this.form.quantity = 10; // 液体默认10ml
        } else {
          this.form.quantity = 1; // 其他默认1
        }
      }
      
      // 2. 根据药材类型自动设置单次剂量
      if (!this.currentDrug.dosage) {
        if (drug.name.includes('布洛芬')) {
          this.currentDrug.dosage = '0.3g';
        } else if (drug.name.includes('片') || drug.name.includes('粒')) {
          this.currentDrug.dosage = '1片';
        } else if (drug.name.includes('胶囊')) {
          this.currentDrug.dosage = '1粒';
        } else if (drug.specification) {
          this.currentDrug.dosage = drug.specification;
        }
      }
      
      // 3. 根据药材类型自动设置给药途径
      if (!this.currentDrug.route) {
        if (drug.name.includes('创可贴') || drug.name.includes('碘伏') || drug.name.includes('纱布') || 
            drug.name.includes('湿润烧伤膏') || drug.name.includes('红霉素眼膏')) {
          this.currentDrug.route = '外用';
          this.routeIndex = 1; // 外用
        } else if (drug.name.includes('含片') || drug.name.includes('草珊瑚')) {
          this.currentDrug.route = '含服';
          this.routeIndex = 2; // 含服
        } else if (drug.name.includes('速效救心丸')) {
          this.currentDrug.route = '舌下含服';
          this.routeIndex = 3; // 舌下含服
        } else {
          this.currentDrug.route = '口服';
          this.routeIndex = 0; // 口服
        }
      }
      
      // 4. 根据药材类型自动设置用药频次
      if (!this.currentDrug.frequency) {
        if (drug.name.includes('创可贴') || drug.name.includes('纱布') || drug.name.includes('碘伏')) {
          this.currentDrug.frequency = '即刻';
          this.frequencyIndex = 0; // 即刻
        } else if (drug.name.includes('速效救心丸')) {
          this.currentDrug.frequency = '必要时';
          this.frequencyIndex = 6; // 必要时
        } else if (drug.name.includes('布洛芬') || drug.name.includes('止痛')) {
          this.currentDrug.frequency = '每日3次';
          this.frequencyIndex = 1; // 每日3次
        } else {
          this.currentDrug.frequency = '即刻';
          this.frequencyIndex = 0; // 即刻
        }
      }
      
      // 5. 自动开启处方功能
      if (!this.enablePrescription) {
        this.enablePrescription = true;
      }
      
      // 提示用户已自动填充
      console.log('✅ 已自动填充药材默认值:', {
        quantity: this.form.quantity,
        dosage: this.currentDrug.dosage,
        route: this.currentDrug.route,
        frequency: this.currentDrug.frequency
      });
    },

    // 疾病名称获得焦点：显示下拉列表
    onDiseaseFocus() {
      // 清除失焦隐藏计时器
      if (this.diseaseBlurTimer) {
        clearTimeout(this.diseaseBlurTimer);
        this.diseaseBlurTimer = null;
      }
      
      // 触发全局搜索，基于所有三个框的关键词
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      
      // 显示下拉（即使为空也显示，会显示所有疾病）
      this.showDiseaseList = this.filteredDiseases.length > 0;
    },
    
    onDiseaseBlur() {
      const text = (this.form.diseaseName || '').trim();
      if (text) {
        // 1）先按疾病大类精确匹配
        const hasDisease = this.templateIndex.some(r => r.disease === text);
        if (hasDisease) {
          this.selectDisease(text);
        } else {
          // 2）再按标准诊断名匹配
          const diagRecord = this.templateIndex.find(r =>
            (r.diagnoses || []).some(d => d === text)
          );
          if (diagRecord) {
            this.selectDiagnosis(text);
          }
        }
      }

      // 延迟隐藏下拉，给点击事件留时间
      this.diseaseBlurTimer = setTimeout(() => {
        this.showDiseaseList = false;
      }, 200);
    },
    
    // 疾病名称输入：触发全局搜索并联动主诉/诊断下拉（添加防抖）
    onDiseaseInput() {
      // 清除之前的计时器
      if (this.diseaseInputTimer) {
        clearTimeout(this.diseaseInputTimer);
      }
      
      // 防抖处理，延迟200ms执行
      this.diseaseInputTimer = setTimeout(() => {
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;

      this.showDiseaseList = this.filteredDiseases.length > 0;
      // 主诉和诊断下拉在用户聚焦时才显示，这里只更新数据
      }, 200);
      // 如果当前输入的疾病名称与某个疾病完全匹配，则自动按该疾病刷新联动字段
      const kw = (this.form.diseaseName || '').trim();
      if (kw && this.filteredDiseases.includes(kw)) {
        this.selectDisease(kw);
      }
    },

    // 选择疾病：自动填充主诉/诊断/处置（默认强制填充，保证反向联动）
    // options.forceFill=true 时，无论当前字段是否已有内容，都用模板覆盖
    selectDisease(disease, options = { forceFill: true }) {
      // 清除失焦隐藏计时器
      if (this.diseaseBlurTimer) {
        clearTimeout(this.diseaseBlurTimer);
        this.diseaseBlurTimer = null;
      }
      
      // 选择后关闭下拉
      this.showDiseaseList = false;

      // 查找该疾病的第一条模板记录（使用最佳匹配）
      const record = this.templateIndex.find(r => r.disease === disease);
      if (record) {
        const force = options?.forceFill === true;
        // 智能填充：默认强制覆盖，满足“先选疾病反向自动填充”需求
        this.smartFillFields(record, {
          preserveComplaint: !force && !!(this.form.chiefComplaint && this.form.chiefComplaint.trim()),
          preserveSymptom: !force && !!(this.form.symptom && this.form.symptom.trim()),
          preserveDiagnosis: !force && !!(this.form.diagnosis && this.form.diagnosis.trim()),
          preserveTreatment: !force && !!(this.form.treatment && this.form.treatment.trim())
        });
        
        // 如果模板记录里缺少部分字段，兜底再用疾病模板填充缺失项
        const needComplaint = !this.form.chiefComplaint;
        const needDiagnosis = !this.form.diagnosis;
        const needTreatment = !this.form.treatment;
        if (needComplaint || needDiagnosis || needTreatment) {
          this.autoFillByDisease(disease);
        }
        
        // 确保疾病名称使用标准名称
        if (this.diseaseOptions.includes(disease)) {
          this.form.diseaseName = disease;
        }
        
        // 自动选择推荐用药
        if (Array.isArray(record.suggestDrugs) && record.suggestDrugs.length) {
          this.applySuggestDrugs(record.suggestDrugs);
        }
      } else {
        // 回退到旧逻辑（如果找不到结构化模板）
        this.loadTemplatesForDisease(disease);
        this.autoFillByDisease(disease);
        // 确保疾病名称使用标准名称
        if (!this.diseaseOptions.includes(this.form.diseaseName)) {
          const analyzedDisease = this.analyzeDiseaseFromDiagnosis(this.form.diagnosis || this.form.diseaseName);
          if (analyzedDisease) {
            this.form.diseaseName = analyzedDisease;
          } else {
            this.form.diseaseName = '其他';
          }
        }
      }
    },
    // 依据疾病载入诊断与处置模板
    loadTemplatesForDisease(disease) {
      const baseDiag = this.diseaseTemplates?.[disease] || [];
      // 合并结构化模板中的诊断
      const structDiag = (this.diseaseTemplateLib?.[disease] || [])
        .flatMap(t => t.diagnoses || []);
      const diag = Array.from(new Set([...(baseDiag || []), ...structDiag]));
      const treat = this.treatmentTemplates?.[disease] || [];
      this.filteredDiagnosis = diag;
      this.filteredTreatments = treat;
    },
    // 自动按疾病填入主诉/诊断/处置（可编辑）
    autoFillByDisease(disease) {
      const complaint = this.complaintTemplates?.[disease];
      const diagList = this.diseaseTemplates?.[disease] || [];
      const diag = diagList[0];
      const treats = (this.treatmentTemplates?.[disease] || []).slice(0, 2);
      // 附加注意事项/复诊提示
      const cautions = this.treatmentCautions?.[disease] || [];
      const merged = [];
      const pushUnique = (arr) => {
        arr.forEach(t => {
          if (t && !merged.includes(t)) merged.push(t);
        });
      };
      pushUnique(treats);
      pushUnique(cautions);
      // 每次选择疾病时，都用模板覆盖联动字段，保证重新选择疾病也会刷新
      if (complaint) this.form.chiefComplaint = complaint;
      if (diag) {
        // 初步诊断使用模板中的完整诊断组合
        this.form.diagnosis = diagList.length ? diagList.join('；') : diag;
        // 从诊断中分析提取标准疾病名称（确保使用标准名称归类）
        const analyzedDisease = this.analyzeDiseaseFromDiagnosis(this.form.diagnosis);
        if (analyzedDisease) {
          this.form.diseaseName = analyzedDisease;
        } else if (this.diseaseOptions.includes(disease)) {
          // 如果疾病名称本身是标准名称，直接使用
          this.form.diseaseName = disease;
        } else {
          this.form.diseaseName = '其他';
        }
      }
      if (merged.length) this.form.treatment = merged.join('；');
    },
    // 诊断输入与选择
    // 诊断获得焦点：显示下拉列表
    onDiagnosisFocus() {
      // 触发全局搜索，基于所有三个框的关键词
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      
      // 显示下拉（即使为空也显示，基于其他框的关键词）
      this.showDiagnosisList = this.filteredDiagnosis.length > 0;
    },
    // 诊断输入（添加防抖）
    onDiagnosisInput() {
      // 清除之前的计时器
      if (this.diagnosisInputTimer) {
        clearTimeout(this.diagnosisInputTimer);
      }
      
      // 防抖处理，延迟200ms执行
      this.diagnosisInputTimer = setTimeout(() => {
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;

      this.showDiagnosisList = this.filteredDiagnosis.length > 0;
      }, 200);
    },
    selectDiagnosis(text) {
      // 查找最匹配的模板记录（考虑当前已输入的字段）
      const bestRecord = this.findBestMatchingRecord(
        text,  // 选择的诊断
        this.form.chiefComplaint,  // 当前主诉
        this.form.diseaseName      // 当前疾病名称
      );

      if (bestRecord) {
        // 智能填充：强制更新症状和处置，确保与诊断一致
        this.smartFillFields(bestRecord, {
          preserveComplaint: !!(this.form.chiefComplaint && this.form.chiefComplaint.trim()),  // 如果主诉已输入，保留
          preserveSymptom: false,           // ⚠️ 强制更新症状，确保与诊断一致
          preserveDiagnosis: false,  // 诊断字段用新选择的替换
          preserveTreatment: false        // ⚠️ 强制更新处置，确保与诊断一致
        });
        
        // 确保诊断字段使用选择的诊断（如果模板中有完整诊断组合，使用组合；否则使用选择的诊断）
        if (bestRecord.diagnoses && bestRecord.diagnoses.length) {
          // 检查选择的诊断是否在模板的诊断列表中
          const hasExactMatch = bestRecord.diagnoses.some(d => d === text);
          if (hasExactMatch) {
            // 如果完全匹配，使用模板的完整诊断组合
            this.form.diagnosis = bestRecord.diagnoses.join('；');
          } else {
            // 否则使用选择的诊断
            this.form.diagnosis = text;
          }
        } else {
          this.form.diagnosis = text;
        }
        
        // 自动选择推荐用药
        if (Array.isArray(bestRecord.suggestDrugs) && bestRecord.suggestDrugs.length) {
          bestRecord.suggestDrugs.forEach(name => {
            if (name) {
              this.onDrugChip(name);
            }
          });
        }
      } else {
        // 如果没有找到匹配记录，只更新诊断和疾病名称
        this.form.diagnosis = text;
        const analyzedDisease = this.analyzeDiseaseFromDiagnosis(text);
        this.form.diseaseName = analyzedDisease || '其他';
      }

      this.showDiagnosisList = false;
    },
    // 主诉获得焦点：根据编辑模式决定是否触发搜索
    onComplaintFocus() {
      // 清除失焦隐藏计时器
      if (this.complaintBlurTimer) {
        clearTimeout(this.complaintBlurTimer);
        this.complaintBlurTimer = null;
      }
      
      const currentComplaint = (this.form.chiefComplaint || '').trim();
      
      // 情况1：自由编辑模式（已选择过） → 不触发搜索，不显示下拉
      if (this.complaintSelectedMode && currentComplaint) {
        this.showComplaintList = false;
        return;
      }
      
      // 情况2：输入框为空 → 重置为搜索模式，基于其他框的关键词显示联动结果
      if (!currentComplaint) {
        this.complaintSelectedMode = false;
      }
      
      // 情况3：搜索模式 → 触发全局搜索（基于AND逻辑）并显示下拉
      // 使用防抖避免频繁调用
      if (this.complaintFocusTimer) {
        clearTimeout(this.complaintFocusTimer);
      }
      this.complaintFocusTimer = setTimeout(() => {
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;
      
      // 即使主诉框为空，只要有其他框的关键词，也显示联动结果
      this.showComplaintList = this.filteredComplaints.length > 0;
      }, 150);
    },
    onComplaintInput() {
      const currentComplaint = (this.form.chiefComplaint || '').trim();
      
      // 如果内容被清空，重置为搜索模式
      if (!currentComplaint) {
        this.complaintSelectedMode = false;
      }
      
      // 如果已选择主诉（自由编辑模式），不显示下拉
      if (this.complaintSelectedMode && currentComplaint) {
        this.showComplaintList = false;
        return;
      }
      
      // 搜索模式：执行全局搜索并显示下拉（添加防抖）
      if (this.complaintInputTimer) {
        clearTimeout(this.complaintInputTimer);
      }
      this.complaintInputTimer = setTimeout(() => {
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      this.filteredDiseases = result.diseases;
      this.filteredComplaints = result.complaints;
      this.filteredDiagnosis = result.diagnoses;

      this.showComplaintList = this.filteredComplaints.length > 0;
      }, 200);
    },
    
    onComplaintBlur() {
      // 失焦时重置聚焦状态
      this.complaintFocus = false;
      // 延迟隐藏下拉，给点击事件留时间
      this.complaintBlurTimer = setTimeout(() => {
        this.showComplaintList = false;
      }, 200);
      // 主诉编辑完成后，根据最新主诉获取系统诊断建议（防抖处理）
      if (this.fetchHvSuggestionTimer) {
        clearTimeout(this.fetchHvSuggestionTimer);
      }
      this.fetchHvSuggestionTimer = setTimeout(() => {
      this.fetchHvSuggestion();
      }, 300);
    },
    async fetchHvSuggestion() {
      const text = (this.form.chiefComplaint || '').trim();
      if (!text) {
        this.hvTriage = null;
        this.standardizedSymptoms = [];
        // 主诉为空时，清空症状以保持一致
        this.form.symptom = '';
        return;
      }
      try {
        const res = await wx.cloud.callFunction({
          name: 'clinicRecords',
          data: {
            action: 'suggestHvDiagnosis',
            data: { chiefComplaint: text }
          }
        });

        console.log('[clinic/add] fetchHvSuggestion result:', res);

        const payload = res.result && res.result.success ? res.result.data : null;

        // 提取标准化症状
        if (payload && payload.standardized && payload.standardized.details) {
          this.standardizedSymptoms = payload.standardized.details.map(detail => ({
            code: detail.code,
            name: detail.standardName || detail.name,
            category: detail.category,
            severity: detail.severity || 1,
            selected: false
          }));
          
          // 根据主诉自动更新症状，保持与主诉一致（用分号连接标准化症状）
          const symptomText = this.standardizedSymptoms.map(s => s.name).join('；');
          if (symptomText) {
            this.form.symptom = symptomText;
          }
        } else {
          this.standardizedSymptoms = [];
          // 如果没有标准化症状，使用主诉内容作为症状
          if (text) {
            this.form.symptom = text;
          }
        }

        this.hvTriage = payload.triage || null;
      } catch (e) {
        console.error('获取标准化症状失败:', e);
        this.hvTriage = null;
        this.standardizedSymptoms = [];
      }
    },
    // 症状输入框获得焦点
    onSymptomFocus() {
      // 清除失焦隐藏计时器
      if (this.symptomBlurTimer) {
        clearTimeout(this.symptomBlurTimer);
        this.symptomBlurTimer = null;
      }
      
      // 如果症状框为空，显示标准化症状建议
      const currentSymptom = (this.form.symptom || '').trim();
      if (!currentSymptom && this.standardizedSymptoms.length > 0) {
        this.filteredSymptoms = this.standardizedSymptoms.map(s => ({
          name: s.name,
          category: s.category,
          code: s.code
        }));
        this.showSymptomList = true;
      } else if (currentSymptom) {
        // 基于输入内容过滤症状建议
        this.filterSymptomsByInput(currentSymptom);
      }
    },
    // 症状输入（添加防抖）
    onSymptomInput() {
      // 清除之前的计时器
      if (this.symptomInputTimer) {
        clearTimeout(this.symptomInputTimer);
      }
      
      // 防抖处理，延迟300ms执行
      this.symptomInputTimer = setTimeout(() => {
        const text = (this.form.symptom || '').trim();
        if (!text) {
          // 如果清空，显示标准化症状
          if (this.standardizedSymptoms.length > 0) {
            this.filteredSymptoms = this.standardizedSymptoms.map(s => ({
              name: s.name,
              category: s.category,
              code: s.code
            }));
            this.showSymptomList = true;
          } else {
            this.showSymptomList = false;
          }
          return;
        }
        
        // 基于输入内容过滤
        this.filterSymptomsByInput(text);
      }, 300);
    },
    // 根据输入内容过滤症状（优化性能）
    filterSymptomsByInput(text) {
      const lowerText = text.toLowerCase();
      const matched = [];
      const matchedNames = new Set(); // 用于去重
      
      // 1. 从标准化症状中匹配（限制数量）
      if (this.standardizedSymptoms && this.standardizedSymptoms.length > 0) {
        for (let i = 0; i < Math.min(this.standardizedSymptoms.length, 50); i++) {
          const s = this.standardizedSymptoms[i];
          if (s.name && s.name.toLowerCase().includes(lowerText)) {
            if (!matchedNames.has(s.name)) {
              matched.push({
                name: s.name,
                category: s.category,
                code: s.code
              });
              matchedNames.add(s.name);
            }
          }
          // 如果已经找到足够的匹配项，提前退出
          if (matched.length >= 20) break;
        }
      }
      
      // 2. 从模板索引中提取症状建议（限制遍历数量）
      if (this.templateIndex && this.templateIndex.length > 0 && matched.length < 20) {
        const maxIndex = Math.min(this.templateIndex.length, 100); // 最多遍历100条模板
        for (let i = 0; i < maxIndex; i++) {
          const rec = this.templateIndex[i];
          if (rec.symptoms && Array.isArray(rec.symptoms)) {
            for (let j = 0; j < rec.symptoms.length && matched.length < 20; j++) {
              const symptom = rec.symptoms[j];
              if (symptom && typeof symptom === 'string' && symptom.toLowerCase().includes(lowerText)) {
                if (!matchedNames.has(symptom)) {
                  matched.push({
                    name: symptom,
                    category: '',
                    code: ''
                  });
                  matchedNames.add(symptom);
                }
              }
            }
          }
          // 如果已经找到足够的匹配项，提前退出
          if (matched.length >= 20) break;
        }
      }
      
      this.filteredSymptoms = matched.slice(0, 20); // 限制最多20条
      this.showSymptomList = matched.length > 0;
    },
    // 症状失焦
    onSymptomBlur() {
      // 延迟隐藏下拉，给点击事件留时间
      this.symptomBlurTimer = setTimeout(() => {
        this.showSymptomList = false;
      }, 200);
    },
    // 选择症状
    selectSymptom(symptom) {
      // 清除失焦隐藏计时器
      if (this.symptomBlurTimer) {
        clearTimeout(this.symptomBlurTimer);
        this.symptomBlurTimer = null;
      }
      
      const currentSymptom = (this.form.symptom || '').trim();
      const symptomName = typeof symptom === 'string' ? symptom : (symptom.name || '');
      
      if (currentSymptom) {
        // 如果已有内容，追加（用分号分隔）
        if (!currentSymptom.includes(symptomName)) {
          this.form.symptom = `${currentSymptom}；${symptomName}`;
        }
      } else {
        // 如果为空，直接填入
        this.form.symptom = symptomName;
      }
      
      this.showSymptomList = false;
    },
    // 切换症状标签（添加到/从症状框移除）
    toggleSymptomTag(symptom) {
      symptom.selected = !symptom.selected;
      
      const currentSymptom = (this.form.symptom || '').trim();
      const symptomName = symptom.name;
      
      if (symptom.selected) {
        // 添加到症状框
        if (currentSymptom) {
          if (!currentSymptom.includes(symptomName)) {
            this.form.symptom = `${currentSymptom}；${symptomName}`;
          }
        } else {
          this.form.symptom = symptomName;
        }
      } else {
        // 从症状框移除
        if (currentSymptom.includes(symptomName)) {
          const parts = currentSymptom.split('；').filter(s => s.trim() !== symptomName);
          this.form.symptom = parts.join('；');
        }
      }
    },
    // 从诊断文本中分析提取标准疾病名称
    analyzeDiseaseFromDiagnosis(diagnosisText) {
      if (!diagnosisText) return null;
      
      const text = diagnosisText.toLowerCase();
      
      // 疾病名称匹配规则（按优先级排序，包含常见医学诊断术语）
      const diseaseRules = [
        // 扭伤类
        { keywords: ['扭伤', '崴', '扭到', '关节扭伤', '脚踝扭伤', '手腕扭伤', '踝关节扭伤', '腕关节扭伤', '软组织扭伤'], disease: '扭伤' },
        // 擦伤类
        { keywords: ['擦伤', '蹭破', '擦破', '皮肤擦伤', '挫伤', '表皮擦伤', '浅表擦伤'], disease: '擦伤' },
        // 烫伤类
        { keywords: ['烫伤', '烧伤', '灼伤', '烫到', '热烧伤', '化学烧伤'], disease: '烫伤' },
        // 磕伤类
        { keywords: ['磕伤', '磕到', '撞伤', '碰伤', '磕碰', '撞击伤', '碰撞伤'], disease: '磕伤' },
        // 冻伤类
        { keywords: ['冻伤', '冻到', '冻疮', '冻僵'], disease: '冻伤' },
        // 腹泻类（包含胃肠炎等）
        { keywords: ['腹泻', '拉肚子', '拉稀', '泻', '急性胃肠炎', '胃肠炎', '肠胃炎', '肠炎', '急性肠炎', '细菌性肠炎', '病毒性肠炎', '消化不良', '胃肠功能紊乱'], disease: '腹泻' },
        // 头晕类
        { keywords: ['头晕', '头昏', '眩晕', '晕', '眼前发黑', '体位性低血压', '低血糖', '贫血性头晕'], disease: '头晕' },
        // 头痛类
        { keywords: ['头痛', '头疼', '头部不适', '头胀', '偏头痛', '紧张性头痛', '血管性头痛'], disease: '头痛' },
        // 感冒类
        { keywords: ['感冒', '着凉', '受凉', '风寒', '上呼吸道感染', '上感', '普通感冒', '病毒性感冒'], disease: '感冒' },
        // 脱臼类
        { keywords: ['脱臼', '脱位', '关节脱位', '肩关节脱位', '肘关节脱位'], disease: '脱臼' },
        // 骨折类
        { keywords: ['骨折', '骨裂', '断骨', '闭合性骨折', '开放性骨折', '不完全骨折'], disease: '骨折' },
        // 过敏类
        { keywords: ['过敏', '过敏性', '过敏反应', '过敏性皮炎', '过敏性鼻炎', '荨麻疹', '湿疹'], disease: '过敏' },
        // 痛经类
        { keywords: ['痛经', '经期疼痛', '月经痛', '原发性痛经', '继发性痛经'], disease: '痛经' },
        // 测血压类
        { keywords: ['测血压', '血压', '量血压', '血压监测', '血压检查', '血压测量'], disease: '测血压' }
      ];
      
      // 按优先级匹配
      for (const rule of diseaseRules) {
        for (const keyword of rule.keywords) {
          if (text.includes(keyword.toLowerCase())) {
            return rule.disease;
          }
        }
      }
      
      // 如果没有匹配到，返回 null，保持原值或使用"其他"
      return null;
    },
    onDiagnosisBlur() {
      // 诊断输入框失焦时，关闭下拉列表
      this.showDiagnosisList = false;
      
      // 根据诊断自动更新处置，保持与诊断一致
      const diagnosisText = (this.form.diagnosis || '').trim();
      if (!diagnosisText) {
        // 诊断为空时，清空处置以保持一致
        this.form.treatment = '';
        return;
      }
      
      // 从诊断中分析提取标准疾病名称（强制更新，确保使用标准名称）
      const analyzedDisease = this.analyzeDiseaseFromDiagnosis(diagnosisText);
      if (analyzedDisease) {
        // 如果分析出标准疾病名称，直接更新（确保使用标准名称归类）
        this.form.diseaseName = analyzedDisease;
      } else {
        // 如果无法分析出标准疾病名称，设置为"其他"
        this.form.diseaseName = '其他';
      }
      
      // 使用最佳匹配逻辑查找最准确的模板记录
      const bestRecord = this.findBestMatchingRecord(
        diagnosisText,  // 当前诊断
        this.form.chiefComplaint,  // 当前主诉
        this.form.diseaseName      // 当前疾病名称
      );
      
      if (bestRecord && bestRecord.treatments && bestRecord.treatments.length) {
        // 找到匹配的模板记录，智能填充处置（如果处置为空）
        if (!this.form.treatment || !this.form.treatment.trim()) {
          this.form.treatment = bestRecord.treatments.join('；');
        }
        // 如果主诉为空，也可以填充主诉（确保字段关联）
        if (!this.form.chiefComplaint || !this.form.chiefComplaint.trim()) {
          if (bestRecord.complaint) {
            this.form.chiefComplaint = bestRecord.complaint;
          }
        }
        // 如果症状为空，也可以填充症状
        if (!this.form.symptom || !this.form.symptom.trim()) {
          if (bestRecord.symptoms && bestRecord.symptoms.length) {
            this.form.symptom = bestRecord.symptoms.join('；');
          }
        }
      } else {
        // 如果没有找到完整匹配，尝试根据疾病名称查找处置模板
        const diseaseName = (this.form.diseaseName || '').trim();
        if (diseaseName && (!this.form.treatment || !this.form.treatment.trim())) {
          const treatments = this.treatmentTemplates?.[diseaseName] || [];
          if (treatments.length > 0) {
            // 使用前两个处置模板
            this.form.treatment = treatments.slice(0, 2).join('；');
          }
        }
      }
    },
    // 打开诊断参考指南
    openDiagnosisGuide() {
      // 添加模板库匹配的诊断
      const result = this.performGlobalSearch(
        this.form.diseaseName,
        this.form.chiefComplaint,
        this.form.diagnosis
      );
      
      // 更新过滤列表
      this.filteredDiagnosis = result.diagnoses;
      
      // 4. 显示诊断下拉列表
      if (this.filteredDiagnosis.length > 0) {
        this.showDiagnosisList = true;
        // 聚焦到诊断输入框，触发下拉显示
        this.$nextTick(() => {
          // 触发诊断输入框的焦点事件，显示下拉列表
          this.onDiagnosisFocus();
        });
      } else {
        // 如果没有可用的诊断选项，提示用户
        uni.showToast({
          title: '请输入疾病名称或主诉以查看诊断参考',
          icon: 'none',
          duration: 2000
        });
      }
    },
    selectComplaint(opt) {
      // 清除失焦隐藏计时器
      if (this.complaintBlurTimer) {
        clearTimeout(this.complaintBlurTimer);
        this.complaintBlurTimer = null;
      }
      
      if (!opt || !opt.record) return;
      const rec = opt.record;

      // 智能填充：只填充空白字段，保留用户已输入的内容
      this.smartFillFields(rec, {
        preserveComplaint: false,  // 主诉用新选择的替换
        preserveSymptom: !!(this.form.symptom && this.form.symptom.trim()),
        preserveDiagnosis: !!(this.form.diagnosis && this.form.diagnosis.trim()),
        preserveTreatment: !!(this.form.treatment && this.form.treatment.trim())
      });
      
      // 确保主诉字段使用选择的主诉
      this.form.chiefComplaint = rec.complaint;
      
      // 自动选择推荐用药
      if (Array.isArray(rec.suggestDrugs) && rec.suggestDrugs.length) {
        this.applySuggestDrugs(rec.suggestDrugs);
      }

      // 进入自由编辑模式
      this.complaintSelectedMode = true;
      this.showComplaintList = false;
      
      // 自动聚焦到主诉输入框，方便立即编辑
      this.$nextTick(() => {
        this.complaintFocus = false;
        this.$nextTick(() => {
          this.complaintFocus = true;
        });
      });
    },
    // 处置输入与选择
    onTreatmentFocus() {
      if (!this.form.treatment || this.form.treatment.trim() === '') {
        const src = this.treatmentTemplates?.[this.form.diseaseName] || [];
        this.filteredTreatments = src;
        this.showTreatmentList = src.length > 0;
      }
    },
    onTreatmentInput() {
      const src = this.treatmentTemplates?.[this.form.diseaseName] || [];
      const text = (this.form.treatment || '').trim().toLowerCase();
      if (!text) {
        this.filteredTreatments = src;
        this.showTreatmentList = src.length > 0;
        return;
      }
      this.filteredTreatments = src.filter(s => s.toLowerCase().includes(text));
      this.showTreatmentList = this.filteredTreatments.length > 0;
    },
    selectTreatment(text) {
      this.form.treatment = text;
      this.showTreatmentList = false;
    },
    appendTreatment(token) {
      const base = (this.form.treatment || '').trim();
      this.form.treatment = base ? `${base}；${token}` : token;
    },
    // 将当前输入内容保存为自定义模板（全局搜索使用）
    saveCurrentAsTemplate() {
      const disease = (this.form.diseaseName || '').trim();
      if (!disease) {
        uni.showToast({ title: '请先选择疾病名称', icon: 'none' });
        return;
      }

      const complaint = (this.form.chiefComplaint || '').trim();
      const diagnosis = (this.form.diagnosis || '').trim();
      const treatment = (this.form.treatment || '').trim();

      if (!complaint && !diagnosis && !treatment) {
        uni.showToast({ title: '请输入主诉/诊断/处置后再保存', icon: 'none' });
        return;
      }

      // 直接更新 userDiseaseTemplates
      if (!this.userDiseaseTemplates[disease]) {
        this.userDiseaseTemplates[disease] = {
          complaints: [],
          diagnosis: [],
          treatments: []
        };
      }

      const target = this.userDiseaseTemplates[disease];

      if (complaint && !target.complaints.includes(complaint)) {
        target.complaints.unshift(complaint);
        target.complaints = target.complaints.slice(0, 20);
      }

      if (diagnosis && !target.diagnosis.includes(diagnosis)) {
        target.diagnosis.unshift(diagnosis);
        target.diagnosis = target.diagnosis.slice(0, 20);
      }

      if (treatment && !target.treatments.includes(treatment)) {
        target.treatments.unshift(treatment);
        target.treatments = target.treatments.slice(0, 20);
      }

      // 持久化到本地
      try {
        uni.setStorageSync('userDiseaseTemplates', this.userDiseaseTemplates);
        // 重新构建模板索引，包含新保存的模板
        this.buildTemplateIndex();
        uni.showToast({ title: '模板已保存', icon: 'success' });
      } catch (e) {
        console.error('保存模板失败:', e);
        uni.showToast({ title: '保存失败', icon: 'none' });
      }
    },
    // 提交后提示保存模板
    promptSaveTemplate() {
      const disease = (this.form.diseaseName || '').trim();
      const complaint = (this.form.chiefComplaint || '').trim();
      const diagnosis = (this.form.diagnosis || '').trim();
      const treatment = (this.form.treatment || '').trim();

      // 必须有疾病名和至少一项内容
      if (!disease || (!complaint && !diagnosis && !treatment)) {
        return;
      }

      uni.showModal({
        title: '保存为模板',
        content: '是否将当前主诉、诊断、处置保存为自定义模板？下次可快速调用',
        confirmText: '保存',
        cancelText: '跳过',
        success: (res) => {
          if (res.confirm) {
            this.saveCurrentAsTemplate();
          }
        }
      });
    },
    // —— 药材标签：与园区库存联动 —— //
    normalizeText(text) {
      try {
        return String(text || '').toLowerCase().replace(/\\s+/g, '');
      } catch (e) {
        return '';
      }
    },
    async ensureStockLoaded() {
      if (!this.filteredDrugs || this.filteredDrugs.length === 0) {
        try {
          await this.loadLocationDrugs();
        } catch (e) {}
      }
    },
    isPrescriptionDrug(name) {
      const n = (name || '').trim();
      if (!n) return false;
      return (this.rxDrugNames || []).includes(n);
    },
    applySuggestDrugs(list) {
      if (!Array.isArray(list) || !list.length) return;
      list.forEach(name => {
        const n = (name || '').trim();
        if (!n) return;
        if (this.isPrescriptionDrug(n)) {
          this.appendTreatment(`${n}（处方药，需开具处方单，在陆园/水园药房发药）`);
        } else {
          this.onDrugChip(n);
        }
      });
    },
    findDrugByName(name) {
      const target = this.normalizeText(name);
      const inList = (list) => {
        return (list || []).find(d => {
          const n1 = this.normalizeText(d.name || d.drugName);
          const n2 = this.normalizeText(d.specification || d.spec);
          return n1.includes(target) || target.includes(n1) || n2.includes(target);
        });
      };
      let found = inList(this.filteredDrugs);
      if (!found) found = inList(this.allDrugs);
      return found;
    },
    async onDrugChip(name) {
      // 1) 先附加“（一次）”到处置文本
      this.appendTreatment(`${name}（一次）`);
      // 2) 加载当前园区库存，并尝试选中对应药材
      await this.ensureStockLoaded();
      const drug = this.findDrugByName(name);
      if (drug && drug._id) {
        try {
          await this.onDrugSelect(drug);
          uni.showToast({ title: `已选中药材：${drug.name}`, icon: 'none' });
        } catch (e) {
          // 选中失败不影响处置文本
        }
      } else {
        uni.showToast({ title: '当前园区暂无该药库存', icon: 'none' });
      }
    },

    // 恢复上次选择的园区
    restoreLastLocation() {
      try {
        const lastLocation = uni.getStorageSync('clinic_last_location');
        const tipClosed = uni.getStorageSync('clinic_location_tip_closed');
        const isValidLocation = lastLocation === 'land_park' || lastLocation === 'water_park';

        // 规则：
        // 1）默认不选园区，每次进入都弹窗；
        // 2）只有当用户勾选了“下次不再提醒”并关闭弹窗时，才记住园区且下次不再弹窗；
        // 3）此时才在进入页面时自动带出上次园区。
        if (tipClosed && isValidLocation) {
          // 用户明确选择了不再提醒，并有合法园区记录
          this.form.location = lastLocation;
          this.showLocationTip = false;
          const locationName = lastLocation === 'land_park' ? '陆园' : '水园';
          console.log(`已按上次记录自动选择园区: ${locationName}`);
        } else {
          // 其余情况：不自动选园区，始终弹出提示
          this.form.location = '';
          this.showLocationTip = true;
        }
        
        // 恢复连续登记模式设置
        const continueMode = uni.getStorageSync('clinic_continue_mode');
        if (continueMode !== undefined && continueMode !== null) {
          this.continueAfterSubmit = continueMode;
        }
      } catch (err) {
        console.error('恢复园区选择失败:', err);
        this.form.location = '';
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
    // 地点输入框：获得焦点
    onLocationFocus() {
      const text = (this.form.injuryLocation || '').trim().toLowerCase();
      if (!text) {
        // 展示全部常用地点
        this.filteredLocations = Array.from(new Set(this.allLocations));
      } else {
        this.onLocationInput();
      }
      this.showLocationList = true;
    },
    // 地点输入：过滤
    onLocationInput() {
      const text = (this.form.injuryLocation || '').trim().toLowerCase();
      const src = Array.from(new Set(this.allLocations));
      if (!text) {
        this.filteredLocations = src;
      } else {
        this.filteredLocations = src.filter(name => name.toLowerCase().includes(text));
      }
      this.showLocationList = true;
    },
    // 选择地点
    selectLocationFromList(name) {
      this.form.injuryLocation = name;
      this.showLocationList = false;
    },


    async onDrugSelect(drug) {
      // 先设置基本信息
      this.form.drugId = drug._id;
      this.showDrugSelector = false;
      
      // 从药材档案获取完整信息
      uni.showLoading({ title: '加载药材信息...' });
      try {
        const res = await wx.cloud.callFunction({
          name: 'drugManage',
          data: {
            action: 'getDetail',
            data: { id: drug._id }
          }
        });
        
        if (res.result.success && res.result.data) {
          // 使用完整的药材信息
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
        console.error('获取药材详情失败:', err);
        // 使用传入的drug数据
        this.selectedDrug = {
          ...drug,
          minUnit: drug.minUnit || drug.unit || '个',
          packUnit: drug.packUnit || drug.unit || '盒',
          conversionRate: drug.conversionRate || 1
        };
      } finally {
        // 关闭第一个loading
        uni.hideLoading();
      }
      
      // 初始化单次剂量（从规格中提取）
      if (this.selectedDrug) {
        this.currentDrug.dosage = this.getDefaultDosage(this.selectedDrug);
      }
      
      // 加载该园区的批次和库存（loadBatches内部会管理loading状态）
      await this.loadBatches();
    },

    async loadBatches() {
      if (!this.form.drugId || !this.form.location) {
        console.warn('[loadBatches] 缺少必要参数:', {
          drugId: this.form.drugId,
          location: this.form.location
        });
        this.selectedBatch = null;
        this.availableStock = 0;
        return;
      }
      
      uni.showLoading({ title: '加载库存...' });
      try {
        console.log('[loadBatches] 查询参数:', {
          drugId: this.form.drugId,
          location: this.form.location,
          enableFIFO: true
        });
        
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

        console.log('[loadBatches] 查询结果:', res.result);

        if (res.result.success && res.result.data && res.result.data.length > 0) {
          const batches = res.result.data;
          console.log('[loadBatches] 找到批次:', batches.length, '个');
          console.log('[loadBatches] 批次详情:', batches);
          
          this.selectedBatch = batches[0];
          // 确保数量是数字类型
          this.availableStock = batches.reduce((sum, b) => {
            const qty = Number(b.quantity) || 0;
            console.log('[loadBatches] 批次数量:', b.batch, '=', qty);
            return sum + qty;
          }, 0);
          
          console.log('[loadBatches] 总库存:', this.availableStock);
        } else {
          console.warn('[loadBatches] 未找到批次或查询失败:', res.result);
          this.selectedBatch = null;
          this.availableStock = 0;
          const parkName = this.form.location === 'land_park' ? '陆园' : '水园';
          uni.showToast({
            title: `${parkName}该药材库存不足`,
            icon: 'none',
            duration: 2000
          });
        }
      } catch (err) {
        console.error('[loadBatches] 查询异常:', err);
        uni.showToast({
          title: '加载库存失败',
          icon: 'none'
        });
        this.selectedBatch = null;
        this.availableStock = 0;
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
      // 必须先选择就诊园区
      if (!this.form.location || (this.form.location !== 'land_park' && this.form.location !== 'water_park')) {
        uni.showToast({ title: '请选择就诊园区', icon: 'none' });
        return;
      }

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
      if (!this.form.visitType) {
        uni.showToast({ title: '请选择接诊类型', icon: 'none' });
        return;
      }
      if (this.form.visitType === 'outcall' && (!this.form.injuryLocation || this.form.injuryLocation.trim() === '')) {
        uni.showToast({ title: '出诊时需填写受伤地点', icon: 'none' });
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

      // 用药信息为选填：仅当选择了药材且数量>0时，才视为用药登记
      // 优先检查处方列表，如果有处方列表，使用处方列表；否则使用单个药品
      let hasValidDrugUsage = false;
      let drugItems = []; // 需要提交的药品列表
      
      // 优先使用处方列表
      if (this.prescriptionList && this.prescriptionList.length > 0) {
        // 验证处方列表中每个药品的库存
        for (let i = 0; i < this.prescriptionList.length; i++) {
          const item = this.prescriptionList[i];
          if (!item.drugId || !item.quantity || item.quantity <= 0) {
            continue;
          }
          
          // 获取药品详细信息
          try {
            console.log('🔍 [提交处方] 获取药品详细信息:', {
              drugId: item.drugId,
              drugName: item.drugName,
              index: i
            });
            
            const drugRes = await wx.cloud.callFunction({
              name: 'drugManage',
              data: {
                action: 'getDetail',
                data: { id: item.drugId }
              }
            });
            
            console.log('📦 [提交处方] 药品信息查询结果:', {
              success: drugRes.result?.success,
              hasData: !!drugRes.result?.data,
              error: drugRes.result?.error
            });
            
            if (!drugRes.result.success || !drugRes.result.data) {
              uni.hideLoading();
              this.submitting = false;
              
              // 提供更详细的错误信息
              let errorMsg = `药品${item.drugName || ''}信息获取失败`;
              if (drugRes.result?.error) {
                errorMsg += `\n\n错误详情: ${drugRes.result.error}`;
              }
              if (!item.drugId) {
                errorMsg += `\n\n可能原因: 药品ID为空`;
              } else {
                errorMsg += `\n\n药品ID: ${item.drugId}`;
              }
              errorMsg += `\n\n建议: 请重新选择该药品后再添加到处方`;
              
              console.error('❌ [提交处方] 药品信息获取失败:', {
                drugId: item.drugId,
                drugName: item.drugName,
                error: drugRes.result?.error
              });
              
              uni.showModal({
                title: '药品信息获取失败',
                content: errorMsg,
                showCancel: false,
                confirmText: '知道了'
              });
              return;
            }
            
            const drug = drugRes.result.data;
            
            // 获取批次信息
            console.log('🔍 [提交处方] 获取批次信息:', {
              drugId: item.drugId,
              drugName: item.drugName,
              location: this.form.location,
              locationName: this.form.location === 'land_park' ? '陆园' : '水园'
            });
            
            const batchRes = await wx.cloud.callFunction({
              name: 'stockManage',
              data: {
                action: 'getBatchesByDrugId',
                data: {
                  drugId: item.drugId,
                  location: this.form.location,
                  enableFIFO: true
                }
              }
            });
            
            console.log('📦 [提交处方] 批次查询结果:', {
              success: batchRes.result.success,
              dataLength: batchRes.result.data ? batchRes.result.data.length : 0,
              message: batchRes.result.message
            });
            
            if (!batchRes.result.success || !batchRes.result.data || batchRes.result.data.length === 0) {
              // 提供更详细的错误信息
              const locationName = this.form.location === 'land_park' ? '陆园' : '水园';
              let errorMsg = `药品${item.drugName || ''}当前库存取货失败`;
              
              if (!batchRes.result.success) {
                errorMsg += `\n\n失败原因: ${batchRes.result.message || '查询失败'}`;
              } else if (!batchRes.result.data || batchRes.result.data.length === 0) {
                errorMsg += `\n\n失败原因: ${locationName}暂无库存`;
                errorMsg += `\n\n建议: 请检查该药品是否已入库到${locationName}`;
              }
              
              console.error('❌ [提交处方] 批次获取失败:', errorMsg);
              
              uni.hideLoading();
              this.submitting = false;
              uni.showModal({
                title: '库存获取失败',
                content: errorMsg,
                showCancel: false,
                confirmText: '知道了'
              });
              return;
            }
            
            const batches = batchRes.result.data;
            const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
            const batch = item.batchId 
              ? batches.find(b => b._id === item.batchId) || batches[0]
              : batches[0];
            
            // 验证库存
            if (item.quantity > totalStock) {
              uni.hideLoading();
              this.submitting = false;
              uni.showToast({
                title: `${item.drugName || ''}库存不足，最多${totalStock}${drug.minUnit || item.unit}`,
                icon: 'none',
                duration: 3000
              });
              return;
            }
            
            // 添加到药品列表
            drugItems.push({
              drugId: item.drugId,
              drugName: item.drugName || drug.name,
              specification: item.specification || drug.specification,
              quantity: Math.floor(item.quantity),
              unit: item.unit || drug.minUnit,
              batchId: batch._id,
              batch: batch.batch,
              drug: drug
            });
          } catch (err) {
            console.error(`获取药品${item.drugName}信息失败:`, err);
            uni.hideLoading();
            this.submitting = false;
            uni.showToast({
              title: `获取${item.drugName || ''}信息失败`,
              icon: 'none'
            });
            return;
          }
        }
        
        hasValidDrugUsage = drugItems.length > 0;
      } else if (this.selectedDrug) {
        // 使用单个药品（原有逻辑）
        if (this.form.quantity && this.form.quantity > 0) {
          // 验证库存（园区使用最小单位，直接比较）
          if (this.form.quantity > this.availableStock) {
            uni.showToast({
              title: `库存不足，最多${this.availableStock}${this.selectedDrug.minUnit}`,
              icon: 'none',
              duration: 3000
            });
            return;
          }
          
          drugItems.push({
            drugId: this.form.drugId,
            drugName: this.selectedDrug.name,
            specification: this.selectedDrug.specification,
            quantity: Math.floor(this.form.quantity),
            unit: this.getRealMinUnit(this.selectedDrug),
            batchId: this.selectedBatch._id,
            batch: this.selectedBatch.batch,
            drug: this.selectedDrug
          });
          
          hasValidDrugUsage = true;
        } else {
          // 选择了药材但未填写有效数量，视为本次不登记用药，清空用药相关状态
          this.form.drugId = '';
          this.form.quantity = null;
          this.selectedDrug = null;
          this.selectedBatch = null;
          this.availableStock = 0;
        }
      }

      this.submitting = true;
      uni.showLoading({ title: '保存中...' });

      try {
        // 准备基础数据
        const baseData = {
          visitDateTime: this.form.visitDateTime,
          name: this.form.name.trim(),
          gender: this.form.gender,
          age: this.form.age,
          identity: this.form.identity,
          location: this.form.location,  // 园区（陆园/水园）
          visitType: this.form.visitType,
          isOutcall: this.form.visitType === 'outcall',
          injuryLocation: this.form.injuryLocation.trim(),
          chiefComplaint: this.form.chiefComplaint.trim(),
          diseaseName: this.form.diseaseName.trim(),
          diagnosis: this.form.diagnosis.trim(),
          treatment: this.form.treatment.trim(),
          remark: this.form.remark.trim()
        };

        // 如果有多个药品，需要为每个药品创建一条记录
        if (drugItems.length > 1) {
          // 多个药品：为每个药品创建一条门诊记录
          let successCount = 0;
          let failCount = 0;
          
          for (let i = 0; i < drugItems.length; i++) {
            const item = drugItems[i];
            const submitData = { ...baseData };
            
            // 设置药品信息
            const realMinUnit = item.unit || item.drug.minUnit;
            // 确保quantityMin是数字类型且大于0
            const quantityMin = Math.floor(Number(item.quantity)) || 0;
            if (quantityMin <= 0) {
              console.warn(`药品${item.drugName}的数量无效:`, item.quantity);
              failCount++;
              continue;
            }
            
            submitData.drugId = item.drugId;
            submitData.drugName = item.drugName;
            submitData.specification = item.specification || item.drug.specification;
            submitData.batchId = item.batchId;
            submitData.quantityMin = quantityMin; // 确保是数字类型
            submitData.minUnit = realMinUnit;
            submitData.packUnit = item.drug.packUnit || item.drug.unit;
            submitData.conversionRate = item.drug.conversionRate || 1;
            submitData.patient = this.form.name.trim();
            submitData.symptom = (this.form.symptom || this.form.chiefComplaint || '').trim();
            
            // 构建drugInfo（使用quantityMin而不是item.quantity）
            submitData.drugInfo = `${item.drugName} ${quantityMin}${realMinUnit}`;
            
            try {
              const res = await wx.cloud.callFunction({
                name: 'clinicRecords',
                data: {
                  action: 'add',
                  data: submitData
                }
              });
              
              if (res.result.success) {
                successCount++;
              } else {
                failCount++;
                console.error(`药品${item.drugName}提交失败:`, res.result.error);
              }
            } catch (err) {
              failCount++;
              console.error(`药品${item.drugName}提交异常:`, err);
            }
          }
          
          if (failCount > 0) {
            uni.showToast({
              title: `部分药品提交失败(${successCount}/${drugItems.length})`,
              icon: 'none',
              duration: 3000
            });
          } else {
            // 提示保存为模板
            this.promptSaveTemplate();
            
            if (this.continueAfterSubmit) {
              uni.showToast({
                title: '登记成功，可继续登记',
                icon: 'success',
                duration: 2000
              });
              setTimeout(() => {
                this.resetForm();
                uni.pageScrollTo({
                  scrollTop: 0,
                  duration: 300
                });
              }, 800);
            } else {
              uni.showToast({
                title: '登记成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.resetForm();
                uni.navigateBack();
              }, 1500);
            }
          }
        } else if (drugItems.length === 1) {
          // 单个药品：使用原有逻辑
          const item = drugItems[0];
          const submitData = { ...baseData };
          
          const realMinUnit = item.unit || item.drug.minUnit;
          // 确保quantityMin是数字类型且大于0
          const quantityMin = Math.floor(Number(item.quantity)) || 0;
          if (quantityMin <= 0) {
            uni.showToast({
              title: '药品数量无效',
              icon: 'none'
            });
            this.submitting = false;
            uni.hideLoading();
            return;
          }
          
          submitData.drugId = item.drugId;
          submitData.drugName = item.drugName;
          submitData.specification = item.specification || item.drug.specification;
          submitData.batchId = item.batchId;
          submitData.quantityMin = quantityMin; // 确保是数字类型
          submitData.minUnit = realMinUnit;
          submitData.packUnit = item.drug.packUnit || item.drug.unit;
          submitData.conversionRate = item.drug.conversionRate || 1;
          submitData.patient = this.form.name.trim();
          submitData.symptom = (this.form.symptom || this.form.chiefComplaint || '').trim();
          
          submitData.drugInfo = {
            drugId: item.drugId,
            drugCode: item.drug.drugCode || item.drug.code || '',
            drugName: item.drugName,
            specification: item.specification || item.drug.specification,
            unit: realMinUnit,
            quantity: item.quantity,
            batchId: item.batchId,
            batch: item.batch,
            location: this.form.location,
            minUnit: realMinUnit,
            packUnit: item.drug.packUnit || item.drug.unit,
            conversionRate: item.drug.conversionRate || 1
          };
          
          const res = await wx.cloud.callFunction({
            name: 'clinicRecords',
            data: {
              action: 'add',
              data: submitData
            }
          });

          if (res.result.success) {
            // 提示保存为模板
            this.promptSaveTemplate();
            
            if (this.continueAfterSubmit) {
              uni.showToast({
                title: '登记成功，可继续登记',
                icon: 'success',
                duration: 2000
              });
              setTimeout(() => {
                this.resetForm();
                uni.pageScrollTo({
                  scrollTop: 0,
                  duration: 300
                });
              }, 800);
            } else {
              uni.showToast({
                title: '登记成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.resetForm();
                uni.navigateBack();
              }, 1500);
            }
          } else {
            uni.showToast({
              title: res.result.error || '登记失败',
              icon: 'none'
            });
          }
        } else {
          // 无用药信息：只创建门诊登记记录
          const res = await wx.cloud.callFunction({
            name: 'clinicRecords',
            data: {
              action: 'add',
              data: baseData
            }
          });

          if (res.result.success) {
            // 提示保存为模板
            this.promptSaveTemplate();
            
            if (this.continueAfterSubmit) {
              uni.showToast({
                title: '登记成功，可继续登记',
                icon: 'success',
                duration: 2000
              });
              setTimeout(() => {
                this.resetForm();
                uni.pageScrollTo({
                  scrollTop: 0,
                  duration: 300
                });
              }, 800);
            } else {
              uni.showToast({
                title: '登记成功',
                icon: 'success'
              });
              setTimeout(() => {
                this.resetForm();
                uni.navigateBack();
              }, 1500);
            }
          } else {
            uni.showToast({
              title: res.result.error || '登记失败',
              icon: 'none'
            });
          }
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
      // 保留当前园区选择，其他信息全部重置
      const currentLocation = this.form.location || '';

      // 更新时间（就诊时间始终为当前时间）
      this.updateDateTime();

      // 逐字段重置，避免整体替换对象可能带来的响应式问题
      this.form.name = '';
      this.form.gender = '男';
      this.form.age = null;
      this.form.identity = '游客';
      this.form.location = currentLocation; // 保留园区选择
      this.form.visitType = 'clinic';
      this.form.injuryLocation = '';
      this.form.chiefComplaint = '';
      this.form.symptom = '';
      this.standardizedSymptoms = [];
      this.form.diseaseName = '';
      this.form.diagnosis = '';
      this.form.treatment = '';
      this.form.drugId = '';
      this.form.quantity = null;
      this.form.remark = '';
      this.form.doctorSign = '';
      this.form.signTime = '';
      
      // 更新签名组件key，强制重新渲染签名组件
      this.signatureKey = Date.now();

      // 用药与库存相关状态
      this.selectedDrug = null;
      this.selectedBatch = null;
      this.availableStock = 0;
      this.convertedQuantity = null;
      this.drugSearchText = '';
      this.filteredDrugs = [];
      this.showDrugList = false;
      
      // 重置处方相关状态
      this.prescriptionList = [];
      this.enablePrescription = false;
      this.prescriptionNo = '';
      this.currentDrug = {
        dosage: '',
        frequency: '',
        route: '',
        usage: ''
      };
      this.frequencyIndex = 0;
      this.routeIndex = 0;

      // 疾病/模板/下拉相关状态
      this.filteredDiseases = [];
      this.showDiseaseList = false;
      this.filteredDiagnosis = [];
      this.showDiagnosisList = false;
      this.filteredTreatments = [];
      this.showTreatmentList = false;
      this.filteredComplaints = [];
      this.showComplaintList = false;
      this.complaintSelectedMode = false; // 重置主诉编辑模式
      // 症状相关状态
      this.filteredSymptoms = [];
      this.showSymptomList = false;
      this.standardizedSymptoms = [];
      // 清理计时器
      if (this.symptomInputTimer) {
        clearTimeout(this.symptomInputTimer);
        this.symptomInputTimer = null;
      }
      if (this.fetchHvSuggestionTimer) {
        clearTimeout(this.fetchHvSuggestionTimer);
        this.fetchHvSuggestionTimer = null;
      }
      if (this.diseaseInputTimer) {
        clearTimeout(this.diseaseInputTimer);
        this.diseaseInputTimer = null;
      }
      if (this.diagnosisInputTimer) {
        clearTimeout(this.diagnosisInputTimer);
        this.diagnosisInputTimer = null;
      }
      if (this.complaintInputTimer) {
        clearTimeout(this.complaintInputTimer);
        this.complaintInputTimer = null;
      }
      if (this.complaintFocusTimer) {
        clearTimeout(this.complaintFocusTimer);
        this.complaintFocusTimer = null;
      }
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
    },

    // 生成日报
    async generateDailyReport() {
      try {
        uni.showLoading({ title: '生成中...' });

        // 获取当前日期和园区
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        // 必须先选择就诊园区
        const location = this.form.location;
        if (!location || (location !== 'land_park' && location !== 'water_park')) {
          uni.hideLoading();
          uni.showToast({ title: '请选择就诊园区', icon: 'none' });
          // 如有需要，可同时弹出园区选择提示
          this.showLocationTip = true;
          return;
        }
        const locationName = location === 'land_park' ? '陆园' : '水园';

        // 查询当日的所有门诊记录
        // 查询 clinic_records 集合（完整门诊登记信息）
        let records = [];
        try {
          // 使用 clinicRecords 云函数查询完整的门诊登记记录
          const res = await wx.cloud.callFunction({
            name: 'clinicRecords',
            data: {
              action: 'list',
              data: {
                location: location,
                startDate: dateStr,
                endDate: dateStr,
                pageSize: 1000,
                useClinicRecords: true  // 查询完整的门诊登记记录
              }
            }
          });

          if (res.result && res.result.success && res.result.data && res.result.data.list) {
            records = res.result.data.list;
          }
        } catch (err) {
          console.error('查询门诊记录失败:', err);
        }

        if (records.length === 0) {
          uni.hideLoading();
          uni.showToast({
            title: '当日无门诊记录',
            icon: 'none',
            duration: 2000
          });
          return;
        }

        // 生成文档和统计信息
        const report = this.formatDailyReport(records, dateStr, locationName);
        const stats = this.calculateStats(records);
        
        // 准备详细的表格数据
        const tableData = this.prepareTableData(records);

        uni.hideLoading();

        // 跳转到日报显示页面
        const reportDate = `${year}年${month}月${day}日`;
        uni.navigateTo({
          url: `/pages-sub/report/daily?content=${encodeURIComponent(report)}&date=${encodeURIComponent(reportDate)}&location=${encodeURIComponent(locationName)}&stats=${encodeURIComponent(JSON.stringify(stats))}&tableData=${encodeURIComponent(JSON.stringify(tableData))}`,
          fail: (err) => {
            console.error('跳转失败:', err);
            // 如果跳转失败，复制到剪贴板
            uni.setClipboardData({
              data: report,
              success: () => {
                uni.showToast({
                  title: '已复制到剪贴板',
                  icon: 'success'
                });
              }
            });
          }
        });
      } catch (err) {
        console.error('生成日报失败:', err);
        uni.hideLoading();
        uni.showToast({
          title: '生成失败：' + (err.message || '未知错误'),
          icon: 'none',
          duration: 3000
        });
      }
    },

    // 格式化日报
    formatDailyReport(records, dateStr, locationName) {
      // 解析日期
      const date = new Date(dateStr);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const dateFormatted = `${year}年${month}月${day}日`;

      // 统计信息
      const stats = {
        total: records.length,
        visitor: [],
        employee: [],
        outcall: []
      };

      // 按身份和疾病分类统计
      records.forEach(record => {
        const identity = record.identity || '游客';
        const diseaseName = record.diseaseName || '未知';
        const injuryLocation = record.injuryLocation || '';
        const isOutcall = record.isOutcall || record.visitType === 'outcall';

        if (isOutcall && injuryLocation) {
          // 统计出诊
          const existing = stats.outcall.find(item => item.location === injuryLocation);
          if (existing) {
            existing.count++;
          } else {
            stats.outcall.push({ location: injuryLocation, count: 1 });
          }
        }

        if (identity === '游客') {
          // 游客统计
          const existing = stats.visitor.find(item => item.disease === diseaseName);
          if (existing) {
            if (injuryLocation && injuryLocation.trim()) {
              const loc = existing.locations.find(l => l.name === injuryLocation);
              if (loc) {
                loc.count++;
              } else {
                existing.locations.push({ name: injuryLocation, count: 1 });
              }
            }
            existing.total++;
          } else {
            stats.visitor.push({
              disease: diseaseName,
              total: 1,
              locations: (injuryLocation && injuryLocation.trim()) ? [{ name: injuryLocation, count: 1 }] : []
            });
          }
        } else if (identity === '员工') {
          // 员工统计
          const existing = stats.employee.find(item => item.disease === diseaseName);
          if (existing) {
            existing.total++;
          } else {
            stats.employee.push({
              disease: diseaseName,
              total: 1
            });
          }
        }
      });

      // 生成文档内容
      let report = `${dateFormatted}欢乐谷医务室（${locationName}）当日接诊${stats.total}人。\n`;

      // 游客统计
      if (stats.visitor.length > 0) {
        const visitorTotal = stats.visitor.reduce((sum, item) => sum + item.total, 0);
        report += `游客${visitorTotal}人：`;
        
        const visitorParts = [];
        stats.visitor.forEach(item => {
          if (item.locations && item.locations.length > 0) {
            // 有地点的疾病：疾病X人（地点1X人，地点2X人）
            const locationParts = item.locations.map(loc => `${loc.name}${loc.count}人`);
            visitorParts.push(`${item.disease}${item.total}人（${locationParts.join('，')}）`);
          } else {
            // 无地点的疾病：疾病X人
            visitorParts.push(`${item.disease}${item.total}人`);
          }
        });
        report += visitorParts.join('，') + '。\n';
      }

      // 员工统计
      if (stats.employee.length > 0) {
        const employeeTotal = stats.employee.reduce((sum, item) => sum + item.total, 0);
        report += `员工${employeeTotal}人：`;
        const employeeParts = stats.employee.map(item => `${item.disease}${item.total}人`);
        report += employeeParts.join('，') + '。\n';
      }

      // 出诊统计
      if (stats.outcall.length > 0) {
        const outcallTotal = stats.outcall.reduce((sum, item) => sum + item.count, 0);
        report += `出诊${outcallTotal}次：`;
        const outcallParts = stats.outcall.map(item => `${item.location}${item.count}次`);
        report += outcallParts.join('，') + '。\n';
      }

      return report.trim();
    },

    // 计算统计信息
    calculateStats(records) {
      const stats = {
        total: records.length,
        visitorTotal: 0,
        employeeTotal: 0,
        outcallTotal: 0
      };

      records.forEach(record => {
        const identity = record.identity || '游客';
        const isOutcall = record.isOutcall || record.visitType === 'outcall';

        if (identity === '游客') {
          stats.visitorTotal++;
        } else if (identity === '员工') {
          stats.employeeTotal++;
        }

        if (isOutcall) {
          stats.outcallTotal++;
        }
      });

      return stats;
    },

    // 准备表格数据
    prepareTableData(records) {
      const visitorData = [];
      const employeeData = [];
      let doctorName = '';
      try {
        const userInfo = uni.getStorageSync('userInfo');
        doctorName = userInfo?.name || '';
      } catch (err) {
        console.error('获取用户信息失败:', err);
      }

      records.forEach(record => {
        const identity = record.identity || '游客';
        const diseaseName =
          record.diseaseName ||
          record.diagnosis ||
          record.chiefComplaint ||
          '未知';
        const data = {
          name: record.name || '',
          diseaseName,
          location: record.injuryLocation || '',
          visitTime: record.visitDateTime || record.createTime || '',
          isOutcall: record.isOutcall || record.visitType === 'outcall',
          doctorName: doctorName
        };

        if (identity === '游客') {
          visitorData.push(data);
        } else if (identity === '员工') {
          employeeData.push(data);
        }
      });

      return {
        visitor: visitorData,
        employee: employeeData
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.clinic-add {
  min-height: 100vh;
  // 使用与首页/门诊首页一致的蓝色渐变背景
  background: linear-gradient(180deg, #00c9ff 0%, #00a0ff 35%, #e5e7eb 100%);
  padding: 24rpx 24rpx 40rpx;
}

.clinic-scroll {
  box-sizing: border-box;
  padding-bottom: 120rpx; // 预留空间避免被底部固定按钮遮挡
}

// 顶部标题
.page-header {
  // 顶部标题卡片：象牙白圆角卡片，宽度与首页 header-card 对齐
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 40rpx 30rpx;
  background: #FFFFF0;
  border-radius: 22rpx;
  text-align: center;
  box-shadow:
    0 1rpx 0 rgba(255, 255, 255, 0.9) inset,
    0 -1rpx 0 rgba(15, 23, 42, 0.06) inset,
    0 18rpx 40rpx rgba(15, 23, 42, 0.14);

  .title {
    font-size: 44rpx;
    font-weight: bold;
    color: #0f172a;
    margin-bottom: 16rpx;
    letter-spacing: 2rpx;
  }

  .subtitle {
    font-size: 36rpx;
    font-weight: bold;
    color: #111827;
    margin-bottom: 16rpx;
    padding: 16rpx 0;
    border-bottom: 4rpx solid rgba(59, 130, 246, 0.6);
    display: inline-block;
  }
}

.top-actions-card {
  margin: 0 0 12rpx 0;
  padding: 16rpx 18rpx 18rpx;
  background: #FFFFF0;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.14);
}

.top-buttons {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 20rpx;
}

.top-btn {
  flex: 1;
  min-width: 0;
  padding: 18rpx 0;
  border-radius: 999rpx;
  font-size: 28rpx;
  /* 覆盖小程序 button 的默认 block+全宽行为，保证在一行内平分 */
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  background: linear-gradient(135deg, #22c1c3 0%, #2a91e9 100%);
  border: none;
  color: #ffffff;
}

.top-btn.primary {
  background: linear-gradient(135deg, #22c1c3 0%, #2a91e9 100%);
}

.top-btn.ghost {
  background: linear-gradient(135deg, #22c1c3 0%, #2a91e9 100%);
}

.form-section {
  max-width: 702rpx;
  margin: 0 auto 8rpx;
  padding: 32rpx 30rpx 30rpx;
  background: #FFFFF0;
  border-radius: 24rpx;
  box-shadow: 0 8rpx 20rpx rgba(15, 23, 42, 0.12);
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #0f172a;
  margin-bottom: 30rpx;
  padding-bottom: 20rpx;
  border-bottom: 3rpx solid rgba(226, 232, 240, 0.9);
  display: flex;
  align-items: center;
}

.form-item {
  margin-bottom: 30rpx;

  &.half {
    flex: 1;
  }

  .label {
    font-size: 30rpx;
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
    height: 80rpx;
    line-height: 80rpx;
    padding: 0 24rpx;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    font-size: 28rpx;
    background: #fafafa;
    transition: all 0.3s;
    box-sizing: border-box;
  }

  // 稍大一点的多行 textarea（如处置等）
  .textarea-small {
    min-height: 104rpx !important;  // 固定两行高度
    max-height: 104rpx !important;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    background: #f9fafb;
    font-size: 28rpx;
    color: #333;
  }

  // 自适应高度的 textarea
  .textarea-auto {
    min-height: 104rpx !important;  // 固定两行高度
    height: 104rpx !important;
    max-height: 104rpx !important;
    padding: 12rpx 24rpx !important;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    background: #f9fafb;
    font-size: 28rpx;
    color: #333;
    line-height: 1.4 !important;
    word-wrap: break-word;
    word-break: break-all;
    transition: all 0.3s;
    box-sizing: border-box;
    
    &:focus {
      border-color: #1890ff;
      background: #ffffff;
      box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
    }
    
    &::placeholder {
      color: #999;
      font-size: 26rpx;
    }
    
    // 内容较长时使用中等字号
    &.font-medium {
      font-size: 26rpx !important;
    }
    
    // 内容很长时使用小字号
    &.font-small {
      font-size: 24rpx !important;
      line-height: 1.5 !important;
    }
  }
}

.input-compact {
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  background: #f9fafb;
  font-size: 28rpx;
  color: #333;
  transition: all 0.3s;
  box-sizing: border-box;
  
  &:focus {
    border-color: #1890ff;
    background: #ffffff;
    box-shadow: 0 0 0 4rpx rgba(24, 144, 255, 0.1);
  }
  
  &::placeholder {
    color: #999;
    font-size: 26rpx;
  }
}

.form-row {
  display: flex;
  gap: 24rpx;        // 统一两列之间的间距
}

.datetime-display {
  padding: 20rpx;
  background: #e6f7ff;
  border: 2rpx solid #91d5ff;
  border-radius: 12rpx;
  font-size: 32rpx;
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

.visit-type-selector {
  .identity-item {
    justify-content: center;
  }
}

.visit-type-text {
  font-size: 26rpx;
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
  align-items: center;
  width: 100%;
  justify-content: space-between; // 让年龄输入框贴到右边
}

.gender-selector.compact {
  flex: 1; // 性别按钮组占据左侧剩余空间
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

// 药材输入包装器
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

  // 药材下拉列表（显示在输入框上方，避免被键盘遮挡）
  .drug-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 8rpx;
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
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 8rpx;
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
// 疾病名称行（输入框 + 按钮在同一行）
.disease-name-row {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
  width: 100%;
}


.disease-input-wrapper {
  position: relative;
  width: 100%;

  input {
    width: 100%;
    box-sizing: border-box;
    height: 80rpx;  // 统一高度
    line-height: 1.6;  // 统一行高
    font-size: 26rpx;
    padding: 20rpx 24rpx;
  }

  .disease-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 8rpx;
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
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 24rpx 20rpx;
      border-bottom: 1rpx solid #f0f0f0;
      
      &.hidden {
        display: none;
      }
      font-size: 26rpx;
      color: #333;
      transition: background 0.2s;
      
      .symptom-name {
        flex: 1;
      }
      
      .symptom-category {
        font-size: 22rpx;
        color: #94a3b8;
        margin-left: 12rpx;
      }

      &:active {
        background: #e6f7ff;
      }

      &:last-child {
        border-bottom: none;
      }
    }
    
    .diagnosis-section {
      .section-divider {
        padding: 16rpx 20rpx 12rpx;
        background: #f8fafc;
        border-bottom: 1rpx solid #e2e8f0;
        
        .section-title {
          font-size: 22rpx;
          color: #64748b;
          font-weight: 600;
        }
      }
    }
  }
  
  // 症状标签区域
  .symptom-tags {
    margin-top: 16rpx;
    padding: 16rpx;
    background: #f8fafc;
    border-radius: 12rpx;
    border: 1rpx solid #e2e8f0;
    
    .tags-label {
      font-size: 24rpx;
      color: #64748b;
      margin-bottom: 12rpx;
      font-weight: 500;
    }
    
    .tags-container {
      display: flex;
      flex-wrap: wrap;
      gap: 12rpx;
    }
    
    .symptom-tag {
      display: inline-flex;
      align-items: center;
      padding: 8rpx 16rpx;
      background: #ffffff;
      border: 2rpx solid #cbd5e1;
      border-radius: 20rpx;
      font-size: 24rpx;
      color: #475569;
      transition: all 0.2s;
      
      &.active {
        background: #e0f2fe;
        border-color: #0ea5e9;
        color: #0369a1;
      }
      
      .severity-badge {
        margin-left: 8rpx;
        padding: 2rpx 8rpx;
        border-radius: 8rpx;
        font-size: 20rpx;
        font-weight: 600;
        
        &.severity-1 {
          background: #dcfce7;
          color: #16a34a;
        }
        
        &.severity-2 {
          background: #fef3c7;
          color: #d97706;
        }
        
        &.severity-3 {
          background: #fee2e2;
          color: #dc2626;
        }
        
        &.severity-4 {
          background: #fce7f3;
          color: #be185d;
        }
      }
      
      &:active {
        transform: scale(0.95);
      }
    }
  }
}

// 处置药材建议 chips
.drug-chip-list {
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
.drug-chip {
  padding: 10rpx 14rpx;
  background: #f4f7ff;
  border: 2rpx solid #c7d2fe;
  color: #334155;
  border-radius: 999rpx;
  font-size: 24rpx;
}

// 受伤地点输入包装器
.location-input-wrapper {
  position: relative;
  width: 100%;

  input {
    height: 80rpx;
    line-height: 1.6;
    font-size: 26rpx;
    padding: 20rpx 24rpx;
  }

  .location-dropdown {
    position: absolute;
    bottom: 100%;
    left: 0;
    right: 0;
    margin-bottom: 8rpx;
    background: white;
    border: 2rpx solid #e0e0e0;
    border-radius: 12rpx;
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
    z-index: 1000;
    max-height: 400rpx;
    overflow: hidden;
  }

  .location-scroll {
    max-height: 400rpx;
  }

  .location-item {
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

// 用药信息展示
.drug-quick-info {
  margin-top: 16rpx;
  margin-bottom: 16rpx;
}

// 药材信息单行展示
.drug-info-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 20rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  gap: 16rpx;
  
  .drug-name-section {
    flex: 1;
    min-width: 0;
    
    .drug-name-text {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
      display: block;
      margin-bottom: 4rpx;
    }
    
    .drug-spec-text {
      font-size: 24rpx;
      color: #666;
      display: block;
    }
  }
  
  .drug-stock-section {
    display: flex;
    align-items: center;
    white-space: nowrap;
    
    .stock-label {
      font-size: 24rpx;
      color: #666;
      margin-right: 4rpx;
    }
    
    .stock-value {
      font-size: 26rpx;
      font-weight: 600;
      color: #52c41a;
      
      &.stock-warning {
        color: #dc2626;
      }
    }
  }
}

// 单行表单项（标签、输入框、单位在同一行）
.form-item-inline {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 24rpx;
  flex-wrap: wrap;
  
  .label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
    white-space: nowrap;
    
    &.required::before {
      content: '*';
      color: #dc2626;
      margin-right: 4rpx;
      font-weight: bold;
    }
  }
  
  .quantity-input-inline {
    flex: 1;
    min-width: 200rpx;
    background: #ffffff !important;
  }
  
  .unit-label {
    padding: 20rpx 24rpx;
    background: #e8e8e8;
    border: 2rpx solid #d0d0d0;
    border-radius: 12rpx;
    font-size: 26rpx;
    font-weight: 600;
    color: #555;
    min-width: 80rpx;
    text-align: center;
    height: 80rpx;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .add-to-prescription-btn {
    padding: 20rpx 28rpx;
    background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 6rpx;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 4rpx 12rpx rgba(24, 144, 255, 0.3);
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(24, 144, 255, 0.2);
    }
    
    .btn-icon {
      font-size: 32rpx;
      font-weight: bold;
      color: #ffffff;
    }
    
    .btn-text {
      font-size: 26rpx;
      font-weight: 600;
      color: #ffffff;
      white-space: nowrap;
    }
  }
  
  .quantity-warning-inline {
    width: 100%;
    margin-top: 8rpx;
    padding: 12rpx 16rpx;
    background: #fff5f5;
    border-radius: 8rpx;
    border: 1rpx solid #fca5a5;
    display: flex;
    align-items: center;
    gap: 8rpx;
    
    .warning-text {
      font-size: 24rpx;
      color: #dc2626;
      flex: 1;
    }
  }
}

// 开关行样式
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  
  .label {
    font-size: 28rpx;
    color: #333;
    font-weight: 500;
  }
}

// 处方区域（符合国家规定格式）
.prescription-section {
  margin-top: 24rpx;
  padding: 0;
  background: #ffffff;
  border: 3rpx solid #333;
  border-radius: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

// 医院信息
.prescription-hospital {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24rpx 24rpx;
  border-bottom: 2rpx solid #333;
  background: #f5f5f5;
  
  .hospital-name {
    font-size: 36rpx;
    font-weight: bold;
    color: #000;
    letter-spacing: 2rpx;
  }
}

// 处方头部信息
.prescription-header-info {
  border-bottom: 2rpx solid #333;
  padding: 20rpx 24rpx;
  padding-bottom: 20rpx;
  margin-bottom: 0;
}

.prescription-title-row {
  text-align: center;
  margin-bottom: 12rpx;
  
  .prescription-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #000;
    letter-spacing: 8rpx;
  }
}

.prescription-no-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
  
  .prescription-no {
    font-size: 24rpx;
    color: #666;
  }
}

.prescription-patient-info {
  display: flex;
  gap: 24rpx;
  margin-bottom: 12rpx;
  
  .patient-item {
    display: flex;
    align-items: center;
    
    .patient-label {
      font-size: 26rpx;
      color: #333;
    }
    
    .patient-value {
      font-size: 26rpx;
      color: #000;
      font-weight: 500;
      min-width: 80rpx;
    }
  }
}

.prescription-diagnosis {
  display: flex;
  align-items: center;
  
  .diagnosis-label {
    font-size: 26rpx;
    color: #333;
    white-space: nowrap;
  }
  
  .diagnosis-value {
    font-size: 26rpx;
    color: #000;
    font-weight: 500;
    flex: 1;
  }
}

// Rp标记和药品列表 - 医疗处方样式
.prescription-body {
  min-height: 300rpx;
  padding: 24rpx;
  border: 2rpx solid #333;
  background: #fff;
  margin-top: 20rpx;
}

// 处方头部操作区域 - 医疗处方样式
.prescription-header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20rpx;
  padding-bottom: 12rpx;
  border-bottom: 1rpx solid #e0e0e0;
}

.rp-mark {
  font-size: 36rpx;
  font-weight: bold;
  color: #000;
  font-family: 'Times New Roman', serif;
  letter-spacing: 2rpx;
}

// 添加处方按钮（在处方区域）- 医疗处方样式
.add-prescription-btn {
  display: flex;
  align-items: center;
  gap: 6rpx;
  padding: 10rpx 20rpx;
  background: #1890ff;
  border: 1rpx solid #096dd9;
  border-radius: 4rpx;
  color: #ffffff;
  font-size: 24rpx;
  white-space: nowrap;
  transition: all 0.2s;
  box-shadow: 0 2rpx 4rpx rgba(24, 144, 255, 0.2);
  
  .btn-icon {
    font-size: 26rpx;
    font-weight: bold;
  }
  
  .btn-text {
    font-size: 24rpx;
    font-weight: 500;
  }
  
  &:active {
    background: #096dd9;
    transform: scale(0.98);
    box-shadow: 0 1rpx 2rpx rgba(24, 144, 255, 0.3);
  }
}

// 处方表格 - 传统医疗处方样式
.prescription-table {
  border: 2rpx solid #333;
  border-radius: 0;
  overflow: hidden;
  margin-bottom: 20rpx;
  background: #fff;
}

// 表头 - 医疗处方表头样式
.table-header {
  display: flex;
  background: #f0f0f0;
  border-bottom: 2rpx solid #333;
  font-weight: 700;
  font-size: 26rpx;
  color: #000;
  
  view {
    padding: 20rpx 10rpx;
    text-align: center;
    border-right: 1rpx solid #333;
    word-break: keep-all;
    
    &:last-child {
      border-right: none;
    }
  }
}

// 表格空状态 - 医疗处方样式
.table-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 120rpx;
  padding: 40rpx 20rpx;
  border-bottom: 2rpx solid #333;
  
  .empty-text {
    font-size: 26rpx;
    color: #999;
    text-align: center;
    line-height: 1.6;
  }
}

// 表格行 - 医疗处方行样式
.table-row {
  display: flex;
  border-bottom: 1rpx solid #333;
  font-size: 26rpx;
  color: #000;
  background: #fff;
  min-height: 60rpx;
  
  &:last-child {
    border-bottom: 2rpx solid #333;
  }
  
  &:nth-child(even) {
    background: #fafafa;
  }
  
  view {
    padding: 18rpx 10rpx;
    border-right: 1rpx solid #333;
    display: flex;
    align-items: center;
    justify-content: center;
    word-break: break-all;
    
    &:last-child {
      border-right: none;
    }
  }
}

// 列宽定义 - 优化列宽比例
.col-no {
  width: 60rpx;
  flex-shrink: 0;
  justify-content: center;
  font-weight: 600;
}

.col-name {
  width: 220rpx;
  flex-shrink: 0;
  font-weight: 600;
  justify-content: flex-start;
  text-align: left;
  padding-left: 16rpx;
  padding-right: 8rpx;
}

.col-spec {
  width: 160rpx;
  flex-shrink: 0;
  font-size: 24rpx;
  color: #333;
  justify-content: center;
  text-align: center;
}

.col-quantity {
  width: 100rpx;
  flex-shrink: 0;
  justify-content: center;
  font-weight: 600;
  font-size: 26rpx;
}

.col-usage {
  flex: 1;
  min-width: 240rpx;
  font-size: 24rpx;
  line-height: 1.6;
  justify-content: flex-start;
  text-align: left;
  padding-left: 16rpx;
  padding-right: 16rpx;
}

.col-action {
  width: 120rpx;
  flex-shrink: 0;
  justify-content: center;
}

// 删除按钮 - 医疗处方样式
.delete-btn {
  padding: 6rpx 12rpx;
  background: #fff;
  border: 1rpx solid #ff4d4f;
  border-radius: 4rpx;
  transition: all 0.2s;
  cursor: pointer;
  
  &:active {
    background: #fff1f0;
    border-color: #cf1322;
    transform: scale(0.95);
  }
  
  .delete-text {
    font-size: 22rpx;
    color: #ff4d4f;
    font-weight: 500;
  }
}

// "以下空白"分隔线 - 医疗处方样式
.prescription-blank-line {
  text-align: center;
  padding: 20rpx 0;
  border-top: 1rpx dashed #999;
  margin-top: 10rpx;
  
  .blank-text {
    font-size: 24rpx;
    color: #666;
    letter-spacing: 4rpx;
    font-weight: 400;
  }
}

// 处方底部签名区 - 医疗处方样式
.prescription-footer {
  padding: 24rpx;
  border: 2rpx solid #333;
  border-top: none;
  background: #fff;
  
  .footer-signature {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20rpx;
    
    .footer-label {
      font-size: 28rpx;
      color: #000;
      white-space: nowrap;
      font-weight: 500;
    }
    
    .footer-value {
      font-size: 26rpx;
      color: #000;
      min-width: 180rpx;
      border-bottom: 2rpx solid #333;
      padding-bottom: 6rpx;
      text-align: center;
      font-weight: 500;
    }
    
    .footer-date {
      font-size: 26rpx;
      color: #000;
      font-weight: 500;
    }
  }
}

// 处方备注 - 医疗处方样式
.prescription-note {
  padding: 20rpx 24rpx;
  background: #f5f5f5;
  border: 2rpx solid #333;
  border-top: none;
  display: flex;
  flex-direction: column;
  gap: 10rpx;
  
  .note-text {
    font-size: 24rpx;
    color: #666;
    text-align: left;
    line-height: 1.8;
    font-weight: 400;
  }
}

// 库存不足警告样式
.quantity-warning {
  margin-top: 12rpx;
  padding: 12rpx 16rpx;
  background: #fff5f5;
  border-radius: 8rpx;
  border: 1rpx solid #fca5a5;
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  .warning-text {
    font-size: 24rpx;
    color: #dc2626;
    flex: 1;
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
  padding: 16rpx 24rpx 34rpx;
  background: #FFFFF0;
  box-shadow: 0 -4rpx 16rpx rgba(15, 23, 42, 0.22);
  border-top-left-radius: 24rpx;
  border-top-right-radius: 24rpx;
  z-index: 100;
}

.submit-section button {
  flex: 1;
  padding: 28rpx;
  border-radius: 12rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.submit-section .cancel-btn {
  background: linear-gradient(135deg, #22c1c3 0%, #2a91e9 100%);
  border: none;
  color: #ffffff;
  border-radius: 999rpx;
}

.submit-section .submit-btn {
  background: linear-gradient(135deg, #22c1c3 0%, #2a91e9 100%);
  border: none;
  color: #ffffff;
  border-radius: 999rpx;
}

.continue-option {
  padding: 20rpx 24rpx 40rpx;
  margin: 0 auto 8rpx;
  max-width: 702rpx;
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

/* 园区选择悬浮窗样式 */
.location-modal-overlay {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.location-modal {
  width: 86%;
  max-width: 720rpx;
  background: #FFFFF0;
  border-radius: 28rpx;
  padding: 30rpx 30rpx 26rpx;
  box-shadow:
    0 1rpx 0 rgba(255,255,255,0.9) inset,
    0 -1rpx 0 rgba(15,23,42,0.06) inset,
    0 18rpx 40rpx rgba(15, 23, 42, 0.35);
  border: 1rpx solid rgba(148, 163, 184, 0.35);
}


.modal-title {
  font-size: 32rpx;
  font-weight: 600;
  text-align: center;
  margin: 10rpx 0 6rpx;
}

.modal-subtitle {
  font-size: 24rpx;
  text-align: center;
  color: #6b7280;
  margin-bottom: 26rpx;
  line-height: 1.5;
}

.modal-location-buttons {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.modal-loc-btn {
  flex: 1;
  padding: 20rpx 0;
  border-radius: 999rpx;
  border: 2rpx solid #d1d5db;
  font-size: 28rpx;
  background: #ffffff;
  color: #374151;
  box-shadow: 0 2rpx 6rpx rgba(15, 23, 42, 0.08);
}

.modal-loc-btn.active {
  background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%);
  border-color: #2563eb;
  color: #ffffff;
  box-shadow: 0 6rpx 14rpx rgba(37, 99, 235, 0.45);
}

.modal-hint-text {
  font-size: 22rpx;
  color: #6b7280;
  line-height: 1.5;
  margin-bottom: 18rpx;
}

.modal-row {
  display: flex;
  align-items: center;
  margin-bottom: 22rpx;
  font-size: 26rpx;
  color: #4b5563;
}

.modal-checkbox-text {
  margin-left: 12rpx;
}

.modal-close-btn {
  width: 100%;
  padding: 18rpx 0;
  border-radius: 999rpx;
  border: 1rpx solid #d1d5db;
  background: #f9fafb;
  color: #4b5563;
  font-size: 28rpx;
}

/* ==================== 新版处方样式（符合医疗规范） ==================== */

// 医院信息头部
.prescription-hospital-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24rpx 20rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-bottom: 3rpx solid #000;
  gap: 16rpx;
  
  .hospital-logo {
    font-size: 48rpx;
  }
  
  .hospital-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .hospital-name {
      font-size: 36rpx;
      font-weight: bold;
      color: #000;
      letter-spacing: 2rpx;
      margin-bottom: 4rpx;
    }
    
    .hospital-subtitle {
      font-size: 20rpx;
      color: #666;
      letter-spacing: 1rpx;
    }
  }
}

// 处方标题区域
.prescription-title-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  background: #fff;
  border-bottom: 2rpx solid #000;
  gap: 16rpx;
  
  .prescription-main-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #000;
    letter-spacing: 8rpx;
  }
  
  .prescription-type-badge {
    padding: 6rpx 16rpx;
    background: #fef3c7;
    border: 2rpx solid #f59e0b;
    border-radius: 6rpx;
    font-size: 22rpx;
    color: #92400e;
    font-weight: 600;
  }
}

// 处方元信息（编号、日期）
.prescription-meta-info {
  display: flex;
  justify-content: space-between;
  padding: 16rpx 24rpx;
  background: #fafafa;
  border-bottom: 2rpx solid #000;
  
  .meta-item {
    display: flex;
    align-items: center;
    
    .meta-label {
      font-size: 24rpx;
      color: #666;
      font-weight: 500;
    }
    
    .meta-value {
      font-size: 24rpx;
      color: #000;
      font-weight: 600;
      margin-left: 4rpx;
    }
  }
}

// 患者信息卡片
.prescription-patient-card {
  padding: 20rpx 24rpx;
  background: #fff;
  border-bottom: 2rpx solid #000;
  
  .patient-info-row {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
    margin-bottom: 12rpx;
    
    .patient-info-item {
      display: flex;
      align-items: center;
      
      .info-label {
        font-size: 26rpx;
        color: #666;
        margin-right: 8rpx;
      }
      
      .info-value {
        font-size: 26rpx;
        color: #000;
        font-weight: 600;
        min-width: 60rpx;
      }
    }
  }
  
  .patient-diagnosis-row {
    display: flex;
    align-items: flex-start;
    
    .diagnosis-label {
      font-size: 26rpx;
      color: #666;
      white-space: nowrap;
      margin-right: 8rpx;
    }
    
    .diagnosis-value {
      font-size: 26rpx;
      color: #000;
      font-weight: 600;
      flex: 1;
      line-height: 1.5;
    }
  }
}

// 处方主体区域
.prescription-body {
  padding: 24rpx;
  background: #fff;
  min-height: 300rpx;
  
  .prescription-drugs-header {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 20rpx;
    padding-bottom: 12rpx;
    border-bottom: 2rpx dashed #ccc;
    
    .rp-symbol {
      font-size: 40rpx;
      font-weight: bold;
      color: #000;
      font-family: 'Times New Roman', serif;
    }
    
    .drugs-title {
      font-size: 28rpx;
      font-weight: 600;
      color: #333;
    }
  }
  
  .prescription-drugs-list {
    .drugs-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60rpx 20rpx;
      
      .empty-icon {
        font-size: 64rpx;
        margin-bottom: 16rpx;
      }
      
      .empty-text {
        font-size: 28rpx;
        color: #999;
        margin-bottom: 8rpx;
      }
      
      .empty-hint {
        font-size: 24rpx;
        color: #bbb;
        text-align: center;
        line-height: 1.5;
      }
    }
    
    .prescription-drug-item {
      padding: 16rpx 0;
      border-bottom: 1rpx solid #e5e5e5;
      
      &:last-child {
        border-bottom: none;
      }
      
      .drug-item-header {
        display: flex;
        align-items: flex-start;
        gap: 12rpx;
        margin-bottom: 8rpx;
        
        .drug-name-spec {
          flex: 1;
          display: flex;
          align-items: baseline;
          flex-wrap: wrap;
          gap: 8rpx;
          
          .drug-name {
            font-size: 28rpx;
            font-weight: 600;
            color: #000;
            line-height: 1.4;
          }
          
          .drug-spec {
            font-size: 24rpx;
            color: #666;
          }
        }
        
        .drug-quantity-wrapper {
          white-space: nowrap;
          margin-left: auto;
          margin-right: 12rpx;
        }
        
        .drug-quantity {
          font-size: 26rpx;
          font-weight: 600;
          color: #000;
          white-space: nowrap;
        }
        
        .drug-actions {
          display: flex;
          align-items: center;
          
          .action-btn {
            padding: 6rpx 12rpx;
            border-radius: 6rpx;
            font-size: 22rpx;
            font-weight: 500;
            transition: all 0.2s;
            
            &.delete {
              color: #ef4444;
              background: #fef2f2;
              border: 1rpx solid #fca5a5;
              
              &:active {
                background: #fee2e2;
                transform: scale(0.95);
              }
            }
          }
        }
      }
      
      .drug-item-usage {
        display: flex;
        align-items: flex-start;
        padding-left: 52rpx;
        
        .usage-label {
          font-size: 24rpx;
          color: #666;
          white-space: nowrap;
          margin-right: 8rpx;
        }
        
        .usage-text {
          font-size: 24rpx;
          color: #333;
          line-height: 1.5;
          flex: 1;
        }
      }
      
      .drug-usage-row {
        display: flex;
        align-items: flex-start;
        padding-left: 52rpx;
        margin-top: 8rpx;
        
        .usage-label {
          font-size: 24rpx;
          color: #666;
          white-space: nowrap;
          margin-right: 8rpx;
        }
        
        .usage-value {
          font-size: 24rpx;
          color: #333;
          line-height: 1.5;
          flex: 1;
        }
      }
      
      .drug-usage-note {
        padding-left: 52rpx;
        margin-top: 4rpx;
        
        .usage-note-text {
          font-size: 22rpx;
          color: #888;
          line-height: 1.5;
          font-style: italic;
        }
      }
      
      // ✨ FIFO 批次分配信息样式
      .batch-allocation-info {
        margin-top: 12rpx;
        padding: 12rpx;
        background: #f0f9ff;
        border-radius: 8rpx;
        border: 1rpx solid #bfdbfe;
        
        .batch-allocation-header {
          display: flex;
          align-items: center;
          gap: 8rpx;
          margin-bottom: 8rpx;
          
          .batch-label {
            font-size: 24rpx;
            color: #1e40af;
            font-weight: 600;
          }
          
          .batch-count {
            font-size: 22rpx;
            color: #3b82f6;
            background: #dbeafe;
            padding: 2rpx 8rpx;
            border-radius: 4rpx;
          }
          
          .near-expiry-tag {
            font-size: 22rpx;
            color: #dc2626;
            background: #fee2e2;
            padding: 2rpx 8rpx;
            border-radius: 4rpx;
            font-weight: 600;
          }
        }
        
        .batch-item {
          padding: 8rpx;
          margin-bottom: 6rpx;
          background: #ffffff;
          border-radius: 6rpx;
          border: 1rpx solid #e0e7ff;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          &.near-expiry {
            background: #fef2f2;
            border-color: #fecaca;
            
            .batch-number {
              color: #dc2626;
            }
          }
          
          .batch-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4rpx;
            
            .batch-number {
              font-size: 24rpx;
              color: #1e293b;
              font-weight: 500;
            }
            
            .batch-quantity {
              font-size: 24rpx;
              color: #3b82f6;
              font-weight: 600;
            }
          }
          
          .batch-detail {
            display: flex;
            align-items: center;
            gap: 12rpx;
            
            .batch-expiry {
              font-size: 22rpx;
              color: #64748b;
            }
            
            .batch-days {
              font-size: 22rpx;
              color: #dc2626;
              font-weight: 500;
            }
          }
        }
      }
      
      // 兼容旧的单批次显示
      .batch-single-info {
        margin-top: 8rpx;
        padding-left: 52rpx;
        
        .batch-label {
          font-size: 22rpx;
          color: #666;
        }
        
        .batch-value {
          font-size: 22rpx;
          color: #333;
        }
      }
    }
  }
  
  .prescription-summary {
    margin-top: 20rpx;
    padding-top: 16rpx;
    border-top: 2rpx dashed #ccc;
    text-align: right;
    
    .summary-text {
      font-size: 26rpx;
      color: #666;
      font-weight: 500;
    }
  }
}

// 处方底部签名区
.prescription-footer-section {
  padding: 24rpx;
  background: #fafafa;
  border-top: 2rpx solid #000;
  
  .footer-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .footer-item {
      flex: 1;
      display: flex;
      align-items: center;
      
      &:not(:last-child) {
        margin-right: 20rpx;
      }
      
      .footer-label {
        font-size: 24rpx;
        color: #333;
        white-space: nowrap;
        margin-right: 8rpx;
      }
      
      .signature-placeholder {
        flex: 1;
        border-bottom: 2rpx solid #000;
        padding-bottom: 4rpx;
        text-align: center;
        
        .placeholder-text {
          font-size: 22rpx;
          color: #999;
        }
      }
    }
  }
}

// 处方说明
.prescription-notes {
  padding: 20rpx 24rpx;
  background: #fffbeb;
  border-top: 2rpx dashed #f59e0b;
  
  .note-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 12rpx;
  }
  
  .note-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 8rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .note-bullet {
      font-size: 24rpx;
      color: #f59e0b;
      margin-right: 8rpx;
      line-height: 1.5;
    }
    
    .note-text {
      font-size: 24rpx;
      color: #78350f;
      line-height: 1.5;
      flex: 1;
    }
  }
}

// 用药使用区域样式
.drug-usage-section {
  margin-top: 20rpx;
  padding: 20rpx;
  background: #f9fafb;
  border-radius: 12rpx;
  border: 2rpx solid #e5e7eb;
}

.quantity-input-group {
  display: flex;
  align-items: center;
  gap: 8rpx;
  
  input {
    flex: 1;
  }
  
  .unit-text {
    font-size: 26rpx;
    color: #666;
    font-weight: 600;
    white-space: nowrap;
  }
}

.dosage-input-group {
  display: flex;
  align-items: center;
  
  input {
    flex: 1;
  }
}

.picker-input {
  width: 100%;
  height: 80rpx;
  line-height: 80rpx;
  padding: 0 24rpx;
  border: 2rpx solid #e0e0e0;
  border-radius: 12rpx;
  font-size: 28rpx;
  background: #fafafa;
  color: #333;
  box-sizing: border-box;
}

.add-prescription-action {
  margin-top: 20rpx;
  display: flex;
  justify-content: center;
  
  .add-prescription-btn {
    padding: 16rpx 40rpx;
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    border-radius: 12rpx;
    display: flex;
    align-items: center;
    gap: 8rpx;
    box-shadow: 0 4rpx 12rpx rgba(16, 185, 129, 0.3);
    transition: all 0.3s;
    
    &:active {
      transform: scale(0.95);
      box-shadow: 0 2rpx 8rpx rgba(16, 185, 129, 0.2);
    }
    
    .btn-icon {
      font-size: 32rpx;
      color: #fff;
      font-weight: bold;
    }
    
    .btn-text {
      font-size: 28rpx;
      color: #fff;
      font-weight: 600;
    }
  }
}

// 药品快速信息展示
.drug-quick-info {
  margin-top: 16rpx;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  border-radius: 12rpx;
  border: 2rpx solid #86efac;
  
  .drug-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16rpx;
    
    .drug-name-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4rpx;
      
      .drug-name-text {
        font-size: 28rpx;
        font-weight: 600;
        color: #065f46;
      }
      
      .drug-spec-text {
        font-size: 24rpx;
        color: #047857;
      }
    }
    
    .drug-stock-section {
      display: flex;
      align-items: baseline;
      white-space: nowrap;
      
      .stock-label {
        font-size: 24rpx;
        color: #047857;
        margin-right: 4rpx;
      }
      
      .stock-value {
        font-size: 28rpx;
        font-weight: bold;
        color: #10b981;
        
        &.stock-warning {
          color: #dc2626;
        }
      }
    }
  }
}

</style>