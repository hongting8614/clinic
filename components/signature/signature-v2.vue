<template>
  <view class="signature-modal" @tap="handleBackdropClick">
    <view class="modal-content" @tap.stop>
      <!-- 顶部标题栏 -->
      <view class="modal-header">
        <view class="header-left">
          <view class="header-icon">✍️</view>
          <view class="header-text">
            <view class="header-title">电子签名</view>
            <view class="header-desc">{{ title || '请在下方签名板上签名' }}</view>
          </view>
        </view>
        <view class="close-btn" @click="closeModal">
          <text class="close-icon">✕</text>
        </view>
      </view>

      <!-- 签名画布区域 -->
      <view class="canvas-section">
        <!-- 提示信息 -->
        <view v-if="!hasDrawn" class="canvas-hint">
          <view class="hint-icon">👆</view>
          <view class="hint-text">请用手指在此区域签名</view>
        </view>
        
        <!-- 画布 -->
        <view class="canvas-wrapper">
          <canvas 
            canvas-id="signatureCanvas" 
            class="signature-canvas"
            :class="{ 'has-content': hasDrawn }"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @touchcancel="touchEnd"
          ></canvas>
          
          <!-- 签名指示线 -->
          <view class="signature-line"></view>
        </view>

        <!-- 工具栏 -->
        <view class="canvas-toolbar">
          <view class="toolbar-left">
            <view class="pen-size-selector">
              <view class="pen-label">笔粗:</view>
              <view 
                v-for="size in penSizes" 
                :key="size.value"
                class="pen-size-item"
                :class="{ active: penSize === size.value }"
                @click="changePenSize(size.value)"
              >
                <view class="pen-dot" :style="{ width: size.display + 'rpx', height: size.display + 'rpx' }"></view>
              </view>
            </view>
          </view>
          <view class="toolbar-right">
            <view class="stroke-count" v-if="strokeCount > 0">
              <text class="count-icon">✏️</text>
              <text class="count-text">{{ strokeCount }}笔</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部操作按钮 -->
      <view class="modal-actions">
        <button class="action-btn clear-btn" @click="clearSignature" :disabled="!hasDrawn">
          <text class="btn-icon">🗑️</text>
          <text class="btn-text">清空重写</text>
        </button>
        <button class="action-btn cancel-btn" @click="closeModal">
          <text class="btn-icon">✕</text>
          <text class="btn-text">取消</text>
        </button>
        <button 
          class="action-btn confirm-btn" 
          @click="confirmSignature"
          :disabled="!hasDrawn"
          :class="{ disabled: !hasDrawn }"
        >
          <text class="btn-icon">✅</text>
          <text class="btn-text">确认签名</text>
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SignatureV2',
  props: {
    title: {
      type: String,
      default: '请在下方签名板上签名'
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ctx: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      hasDrawn: false,
      strokeCount: 0,
      penSize: 3,
      penSizes: [
        { value: 2, display: 8, label: '细' },
        { value: 3, display: 12, label: '中' },
        { value: 5, display: 16, label: '粗' }
      ],
      canvasWidth: 0,
      canvasHeight: 0
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.initCanvas();
    });
  },
  methods: {
    initCanvas() {
      // 获取画布尺寸
      const query = uni.createSelectorQuery().in(this);
      query.select('.signature-canvas').boundingClientRect(data => {
        if (data) {
          this.canvasWidth = data.width;
          this.canvasHeight = data.height;
          
          // 初始化画布上下文
          this.ctx = uni.createCanvasContext('signatureCanvas', this);
          this.ctx.setStrokeStyle('#000000');
          this.ctx.setLineWidth(this.penSize);
          this.ctx.setLineCap('round');
          this.ctx.setLineJoin('round');
          
          // 设置白色背景
          this.ctx.setFillStyle('#ffffff');
          this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.ctx.draw();
        }
      }).exec();
    },

    touchStart(e) {
      this.isDrawing = true;
      this.lastX = e.touches[0].x;
      this.lastY = e.touches[0].y;
      
      if (!this.hasDrawn) {
        this.hasDrawn = true;
      }
    },

    touchMove(e) {
      if (!this.isDrawing) return;
      
      const x = e.touches[0].x;
      const y = e.touches[0].y;
      
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastX, this.lastY);
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.ctx.draw(true);
      
      this.lastX = x;
      this.lastY = y;
    },

    touchEnd() {
      if (this.isDrawing) {
        this.strokeCount++;
        this.isDrawing = false;
      }
    },

    changePenSize(size) {
      this.penSize = size;
      this.ctx.setLineWidth(size);
      
      uni.showToast({
        title: `笔粗已调整`,
        icon: 'none',
        duration: 1000
      });
    },

    clearSignature() {
      if (!this.hasDrawn) return;
      
      uni.showModal({
        title: '确认清空',
        content: '确定要清空当前签名吗?',
        confirmText: '确定清空',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 清空画布
            this.ctx.setFillStyle('#ffffff');
            this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            this.ctx.draw();
            
            this.hasDrawn = false;
            this.strokeCount = 0;
            
            uni.showToast({
              title: '✅ 已清空',
              icon: 'none',
              duration: 1500
            });
          }
        }
      });
    },

    confirmSignature() {
      if (!this.hasDrawn) {
        uni.showToast({
          title: '请先签名',
          icon: 'none'
        });
        return;
      }

      uni.showLoading({ title: '生成签名...' });

      // 延迟一下确保画布渲染完成
      setTimeout(() => {
        uni.canvasToTempFilePath({
          canvasId: 'signatureCanvas',
          fileType: 'png',
          quality: 1,
          success: (res) => {
            uni.hideLoading();
            
            // 上传到云存储
            this.uploadSignature(res.tempFilePath);
          },
          fail: (err) => {
            uni.hideLoading();
            console.error('生成签名图片失败:', err);
            uni.showToast({
              title: '签名失败，请重试',
              icon: 'none'
            });
          }
        }, this);
      }, 300);
    },

    async uploadSignature(tempFilePath) {
      try {
        uni.showLoading({ title: '上传签名...' });
        
        // 生成唯一文件名
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        const cloudPath = `signatures/${timestamp}_${random}.png`;
        
        // 上传到云存储
        const uploadResult = await wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: tempFilePath
        });
        
        uni.hideLoading();
        
        if (uploadResult.fileID) {
          uni.showToast({
            title: '✅ 签名成功',
            icon: 'success',
            duration: 1500
          });
          
          // 返回云存储文件ID
          this.$emit('confirm', uploadResult.fileID);
        } else {
          throw new Error('上传失败');
        }
      } catch (err) {
        uni.hideLoading();
        console.error('上传签名失败:', err);
        
        // 如果上传失败，返回本地临时路径
        uni.showToast({
          title: '⚠️ 使用本地签名',
          icon: 'none',
          duration: 2000
        });
        
        this.$emit('confirm', tempFilePath);
      }
    },

    handleBackdropClick() {
      if (this.hasDrawn) {
        uni.showModal({
          title: '确认退出',
          content: '当前签名未保存，确定要退出吗?',
          confirmText: '确定退出',
          cancelText: '继续签名',
          success: (res) => {
            if (res.confirm) {
              this.closeModal();
            }
          }
        });
      } else {
        this.closeModal();
      }
    },

    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="scss" scoped>
.signature-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 92%;
  max-width: 700rpx;
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.4);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// 顶部标题栏
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.header-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
  filter: drop-shadow(0 2rpx 4rpx rgba(0, 0, 0, 0.2));
}

.header-text {
  flex: 1;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.2);
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.close-btn {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  margin-left: 20rpx;
  
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
}

.close-icon {
  font-size: 32rpx;
  color: white;
  font-weight: bold;
}

// 签名画布区域
.canvas-section {
  padding: 30rpx;
  background: #f8f9fa;
}

.canvas-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20rpx;
  margin-bottom: 20rpx;
  background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
  border-radius: 16rpx;
  border: 2rpx dashed #faad14;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

.hint-icon {
  font-size: 32rpx;
  margin-right: 12rpx;
}

.hint-text {
  font-size: 26rpx;
  color: #d46b08;
  font-weight: 500;
}

.canvas-wrapper {
  position: relative;
  background: white;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.signature-canvas {
  width: 100%;
  height: 450rpx;
  background: white;
  
  &.has-content {
    border: 3rpx solid #52c41a;
  }
}

.signature-line {
  position: absolute;
  bottom: 120rpx;
  left: 40rpx;
  right: 40rpx;
  height: 2rpx;
  background: repeating-linear-gradient(
    to right,
    #d9d9d9 0,
    #d9d9d9 10rpx,
    transparent 10rpx,
    transparent 20rpx
  );
  pointer-events: none;
}

// 工具栏
.canvas-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  margin-top: 20rpx;
  background: white;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.08);
}

.toolbar-left {
  flex: 1;
}

.pen-size-selector {
  display: flex;
  align-items: center;
  gap: 12rpx;
}

.pen-label {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  margin-right: 8rpx;
}

.pen-size-item {
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 12rpx;
  border: 2rpx solid #e0e0e0;
  transition: all 0.3s;
  
  &.active {
    background: #e6f7ff;
    border-color: #1890ff;
    transform: scale(1.1);
    
    .pen-dot {
      background: #1890ff;
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
}

.pen-dot {
  background: #666;
  border-radius: 50%;
  transition: all 0.3s;
}

.toolbar-right {
  display: flex;
  align-items: center;
}

.stroke-count {
  display: flex;
  align-items: center;
  padding: 12rpx 20rpx;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12rpx;
  border: 2rpx solid #bae6fd;
}

.count-icon {
  font-size: 24rpx;
  margin-right: 8rpx;
}

.count-text {
  font-size: 24rpx;
  color: #0369a1;
  font-weight: 600;
}

// 底部操作按钮
.modal-actions {
  display: flex;
  gap: 16rpx;
  padding: 30rpx;
  background: white;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24rpx 12rpx;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
  transition: all 0.3s;
  
  &:active:not(.disabled) {
    transform: scale(0.95);
  }
  
  &.disabled {
    opacity: 0.5;
  }
}

.btn-icon {
  font-size: 32rpx;
  margin-bottom: 8rpx;
}

.btn-text {
  font-size: 24rpx;
}

.clear-btn {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  border: 2rpx solid #fbbf24;
  
  &:active:not(.disabled) {
    background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
  }
}

.cancel-btn {
  background: white;
  color: #666;
  border: 2rpx solid #d9d9d9;
  
  &:active {
    background: #f5f5f5;
  }
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.4);
  
  &:active:not(.disabled) {
    box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.5);
  }
  
  &.disabled {
    background: linear-gradient(135deg, #d9d9d9 0%, #bfbfbf 100%);
    box-shadow: none;
  }
}
</style>


