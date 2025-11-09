<template>
  <view class="signature-modal" @tap="closeModal">
    <view class="modal-content" @tap.stop>
      <view class="modal-header">
        <view class="header-title">✍️ 电子签名</view>
        <view class="header-desc">请在下方签名板上签名</view>
      </view>

      <view class="canvas-wrapper">
        <canvas 
          canvas-id="signatureCanvas" 
          class="signature-canvas"
          @touchstart="touchStart"
          @touchmove="touchMove"
          @touchend="touchEnd"
        ></canvas>
      </view>

      <view class="modal-actions">
        <button class="action-btn clear-btn" @click="clearSignature">
          🗑️ 清空
        </button>
        <button class="action-btn cancel-btn" @click="closeModal">
          取消
        </button>
        <button class="action-btn confirm-btn" @click="confirmSignature">
          ✅ 确认
        </button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Signature',
  data() {
    return {
      ctx: null,
      isDrawing: false,
      lastX: 0,
      lastY: 0
    };
  },
  mounted() {
    // 延迟初始化,确保DOM已渲染
    this.$nextTick(() => {
      setTimeout(() => {
        this.initCanvas();
      }, 300);
    });
  },
  methods: {
    initCanvas() {
      this.ctx = uni.createCanvasContext('signatureCanvas', this);
      if (!this.ctx) {
        console.error('签名画布初始化失败');
        return;
      }
      this.ctx.setStrokeStyle('#000000');
      this.ctx.setLineWidth(3);
      this.ctx.setLineCap('round');
      this.ctx.setLineJoin('round');
      
      // 设置白色背景
      this.ctx.setFillStyle('#ffffff');
      this.ctx.fillRect(0, 0, 750, 400);
      this.ctx.draw();
      
      console.log('签名画布初始化成功');
    },

    touchStart(e) {
      this.isDrawing = true;
      this.lastX = e.touches[0].x;
      this.lastY = e.touches[0].y;
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
      this.isDrawing = false;
    },

    clearSignature() {
      this.ctx.clearRect(0, 0, 750, 400);
      this.ctx.draw();
    },

    confirmSignature() {
      uni.canvasToTempFilePath({
        canvasId: 'signatureCanvas',
        success: (res) => {
          this.$emit('confirm', res.tempFilePath);
        },
        fail: (err) => {
          console.error('生成签名图片失败:', err);
          uni.showToast({
            title: '签名失败，请重试',
            icon: 'none'
          });
        }
      }, this);
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
  background: white;
  z-index: 9999;
  display: flex;
  flex-direction: column;
}

.modal-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: white;
}

.modal-header {
  padding: 40rpx 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  text-align: center;
}

.header-title {
  font-size: 36rpx;
  font-weight: bold;
  color: white;
  margin-bottom: 12rpx;
}

.header-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.9);
}

.canvas-wrapper {
  flex: 1;
  padding: 30rpx;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signature-canvas {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 16rpx;
  border: 3rpx dashed #d9d9d9;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.modal-actions {
  display: flex;
  gap: 16rpx;
  padding: 30rpx;
  background: white;
}

.action-btn {
  flex: 1;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
  font-weight: bold;
  border: none;
}

.clear-btn {
  background: #f0f0f0;
  color: #666;
}

.cancel-btn {
  background: white;
  color: #666;
  border: 2rpx solid #d9d9d9;
}

.confirm-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
}
</style>

