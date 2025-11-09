<template>
	<view>
		<!-- 非全屏签名区域 -->
		<view v-if="!isFullScreen" class="signature-container" @click="openFullScreen">
			<view v-if="!signData" class="signature-placeholder">
				<text class="placeholder-icon">🖊️</text>
				<text class="placeholder-text">点击全屏签名</text>
			</view>
			<image v-else :src="signData" mode="aspectFit" class="signature-preview"></image>
			<view v-if="signData" class="signature-actions">
			<button class="btn-resign" @click.stop="clearSign">重新签名</button>
			</view>
		</view>
		
		<!-- 全屏签名弹窗 -->
	<view v-if="isFullScreen" class="signature-popup-mask" @click.stop="closeFullScreen">
		<view class="fullscreen-signature" @click.stop>
				<!-- 顶部工具栏 -->
				<view class="signature-header">
					<view class="header-left" @click="closeFullScreen">
						<text class="header-icon">✕</text>
						<text class="header-text">取消</text>
					</view>
					<view class="header-center">
						<text class="header-title">{{ title }}</text>
					</view>
					<view class="header-right" @click="clearCanvas">
						<text class="header-icon">🔄</text>
						<text class="header-text">清空</text>
					</view>
				</view>
				
			<!-- 签名画布 -->
			<view class="signature-canvas-wrapper">
				<canvas 
					id="signatureCanvas"
					canvas-id="signatureCanvas"
					type="2d"
					class="signature-canvas"
					@touchstart="touchStart"
					@touchmove="touchMove"
					@touchend="touchEnd"
					disable-scroll="true"
				></canvas>
				<view v-if="!hasDrawn" class="canvas-tip">请在此处签署您的姓名</view>
			</view>
				
				<!-- 底部按钮 -->
				<view class="signature-footer">
				<button 
					class="btn-clear" 
						@click="clearCanvas"
				>清空重签</button>
				<button 
					class="btn-confirm" 
						@click="confirmSign"
						:disabled="!hasDrawn"
				>✓ 确认签名</button>
					</view>
				</view>
			</view>
	</view>
</template>

<script>
export default {
	name: 'Signature',
	
	props: {
		// 签名标题
		title: {
			type: String,
			default: '签名'
		},
		// 初始签名数据
		value: {
			type: String,
			default: ''
		}
	},
	
	data() {
		return {
			isFullScreen: false,
			signData: '',
			ctx: null,
			canvas: null,
			canvasWidth: 0,
			canvasHeight: 0,
			isDrawing: false,
			lastX: 0,
			lastY: 0,
			hasDrawn: false,
			dpr: 1
		}
	},
	
	watch: {
		value: {
			immediate: true,
			handler(val) {
				this.signData = val
			}
		}
	},
	
	methods: {
		openFullScreen() {
			this.isFullScreen = true
			
			// 延迟初始化画布，确保popup已完全显示
			this.$nextTick(() => {
				setTimeout(() => {
					this.initCanvas()
				}, 300)
			})
		},
		
		closeFullScreen() {
			this.isFullScreen = false
		},
		
		async initCanvas() {
			try {
				// 获取系统信息（使用新API）
				const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync()
				this.dpr = windowInfo.pixelRatio || 1
				
				// 获取canvas节点
				const query = uni.createSelectorQuery().in(this)
				const canvasNode = await new Promise((resolve) => {
					query.select('#signatureCanvas')
						.fields({ node: true, size: true })
						.exec((res) => {
							if (res && res[0]) {
								resolve(res[0])
							} else {
								resolve(null)
							}
						})
				})
				
				if (!canvasNode || !canvasNode.node) {
					console.error('Canvas节点获取失败，使用旧版API')
					this.initCanvasOld()
					return
				}
				
				this.canvas = canvasNode.node
				this.ctx = this.canvas.getContext('2d')
				
				// 设置canvas实际大小（考虑设备像素比）
				this.canvasWidth = canvasNode.width
				this.canvasHeight = canvasNode.height
				
				this.canvas.width = this.canvasWidth * this.dpr
				this.canvas.height = this.canvasHeight * this.dpr
				
				// 缩放上下文以匹配设备像素比
				this.ctx.scale(this.dpr, this.dpr)
				
				// 设置画笔样式
				this.ctx.strokeStyle = '#000000'
				this.ctx.lineWidth = 3
				this.ctx.lineCap = 'round'
				this.ctx.lineJoin = 'round'
				
				console.log('Canvas初始化成功 (新版API)', {
					width: this.canvasWidth,
					height: this.canvasHeight,
					dpr: this.dpr
				})
			} catch (err) {
				console.error('Canvas初始化失败:', err)
				// 降级到旧版API
				this.initCanvasOld()
			}
		},
		
		initCanvasOld() {
			console.log('使用旧版Canvas API')
			// 获取系统信息（使用新API）
			const windowInfo = uni.getWindowInfo ? uni.getWindowInfo() : uni.getSystemInfoSync()
			this.canvasWidth = windowInfo.windowWidth
			this.canvasHeight = windowInfo.windowHeight - 200
			
			// 创建canvas上下文（旧版API）
			this.ctx = uni.createCanvasContext('signatureCanvas', this)
			
			// 设置画笔样式
			this.ctx.setStrokeStyle('#000000')
			this.ctx.setLineWidth(3)
			this.ctx.setLineCap('round')
			this.ctx.setLineJoin('round')
			
			console.log('Canvas初始化成功 (旧版API)')
		},
		
		drawExistingSign() {
			// TODO: 如果有已存在的签名图片，绘制到画布上
			// 这里暂时跳过，因为小程序canvas绘制图片较复杂
		},
		
		touchStart(e) {
			if (!this.ctx) {
				console.error('Canvas未初始化')
				return
			}
			
			const touch = e.touches[0]
			this.isDrawing = true
			this.lastX = touch.x
			this.lastY = touch.y
			
			this.ctx.beginPath()
			this.ctx.moveTo(touch.x, touch.y)
			
			console.log('开始绘制:', { x: touch.x, y: touch.y })
		},
		
		touchMove(e) {
			if (!this.isDrawing || !this.ctx) return
			
			const touch = e.touches[0]
			this.ctx.lineTo(touch.x, touch.y)
			this.ctx.stroke()
			
			// 新版API不需要调用draw()
			if (this.canvas) {
				// Canvas 2D API 自动渲染
			} else {
				// 旧版API需要调用draw()
				this.ctx.draw(true)
			}
			
			this.lastX = touch.x
			this.lastY = touch.y
			this.hasDrawn = true
		},
		
		touchEnd(e) {
			this.isDrawing = false
			console.log('结束绘制')
		},
		
		clearCanvas() {
			if (!this.ctx) return
			
			if (this.canvas) {
				// 新版API
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
			} else {
				// 旧版API
				this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
				this.ctx.draw(true)
			}
			
			this.hasDrawn = false
			console.log('画布已清空')
		},
		
		clearSign() {
			this.signData = ''
			this.hasDrawn = false
			this.$emit('input', '')
			this.$emit('change', '')
		},
		
		async confirmSign() {
			if (!this.hasDrawn) {
				uni.showToast({
					title: '请先签名',
					icon: 'none'
				})
				return
			}
			
			uni.showLoading({
				title: '正在保存...'
			})
			
			try {
				// 将canvas转为临时图片
				const res = await this.canvasToTempFilePath()
				
				// 上传到云存储
				const fileID = await this.uploadToCloud(res.tempFilePath)
				
				this.signData = fileID
				this.$emit('input', fileID)
				this.$emit('change', fileID)
			
			console.log('✅ 签名保存成功:', fileID)
			console.log('✅ 已触发input和change事件')
				
				uni.hideLoading()
				uni.showToast({
					title: '签名成功',
				icon: 'success',
				duration: 1500
				})
				
				this.closeFullScreen()
				
			} catch (err) {
				console.error('签名保存失败:', err)
				uni.hideLoading()
				uni.showToast({
					title: '签名保存失败',
					icon: 'none'
				})
			}
		},
		
		canvasToTempFilePath() {
			return new Promise((resolve, reject) => {
				if (this.canvas) {
					// 新版API
					uni.canvasToTempFilePath({
						canvas: this.canvas,
						success: resolve,
						fail: reject
					}, this)
				} else {
					// 旧版API
					uni.canvasToTempFilePath({
						canvasId: 'signatureCanvas',
						success: resolve,
						fail: reject
					}, this)
				}
			})
		},
		
		async uploadToCloud(filePath) {
			// 生成云存储路径
			const timestamp = Date.now()
			const random = Math.floor(Math.random() * 1000)
			const cloudPath = `signatures/${timestamp}_${random}.png`
			
			try {
				const res = await wx.cloud.uploadFile({
					cloudPath: cloudPath,
					filePath: filePath
				})
				return res.fileID
			} catch (err) {
				throw new Error('上传云存储失败')
			}
		}
	}
}
</script>

<style lang="scss" scoped>
// ==================== 非全屏签名区域 ====================
.signature-container {
	width: 100%;
	height: 120rpx;
	background-color: #F8F8F8;
	border: 2rpx dashed #CCCCCC;
	border-radius: 12rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	position: relative;
}

.signature-placeholder {
	display: flex;
	flex-direction: row;
	align-items: center;
	gap: 12rpx;

.placeholder-icon {
		font-size: 40rpx;
}

.placeholder-text {
		font-size: 24rpx;
	color: #999999;
	}
}

.signature-preview {
	width: 100%;
	height: 100%;
}

.signature-actions {
	position: absolute;
	bottom: 20rpx;
	right: 20rpx;
	
	.btn-resign {
		padding: 8rpx 20rpx;
		background-color: #FF976A;
		color: #FFFFFF;
		font-size: 24rpx;
		border-radius: 20rpx;
		border: none;
		
		&::after {
			border: none;
		}
	}
}

// ==================== 全屏签名弹窗 ====================
.signature-popup-mask {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 9999;
	display: flex;
	align-items: center;
	justify-content: center;
}

.fullscreen-signature {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	background-color: #FFFFFF;
}

// 顶部工具栏
.signature-header {
	height: 100rpx;
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

.header-left,
.header-right {
	display: flex;
	align-items: center;
	gap: 10rpx;
	padding: 10rpx;

.header-icon {
	font-size: 32rpx;
}

.header-text {
	font-size: 28rpx;
	color: #333333;
		}
}

.header-center {
	flex: 1;
	text-align: center;

.header-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
		}
	}
}

// 签名画布
.signature-canvas-wrapper {
	flex: 1;
	background-color: #FFFFFF;
	margin: 20rpx;
	border-radius: 20rpx;
	position: relative;
	overflow: hidden;

.signature-canvas {
	width: 100%;
	height: 100%;
}

.canvas-tip {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	font-size: 28rpx;
	color: #CCCCCC;
	pointer-events: none;
	z-index: 0;
	}
}

// 底部按钮
.signature-footer {
	height: 120rpx;
	background-color: #FFFFFF;
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 0 30rpx;
	box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
	gap: 20rpx;
	
	button {
		flex: 1;
		height: 80rpx;
		border-radius: 40rpx;
		font-size: 28rpx;
		border: none;
		
		&::after {
			border: none;
		}
	}
	
	.btn-clear {
		background-color: #F7F8FA;
		color: #646566;
	}
	
	.btn-confirm {
		background-color: #07C160;
		color: #FFFFFF;
		
		&:disabled {
			background-color: #C8C9CC;
			color: #FFFFFF;
		}
	}
}
</style>


