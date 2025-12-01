<template>
	<view class="scanner-wrapper">
		<!-- 扫码按钮 -->
		<u-button 
			:type="buttonType" 
			:text="buttonText" 
			:icon="buttonIcon"
			:size="buttonSize"
			@click="scanCode"
			:loading="loading"
			:disabled="disabled"
		></u-button>
		
		<!-- 手动输入条形码（可选） -->
		<view v-if="showManualInput" class="manual-input">
			<input 
				v-model="manualBarcode"
				class="barcode-input"
				type="text"
				placeholder="或手动输入条形码"
				@confirm="onManualInput"
			/>
			<u-button 
				text="查询" 
				size="small" 
				type="success"
				@click="onManualInput"
				:loading="loading"
			></u-button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'Scanner',
	
	props: {
		// 按钮文字
		buttonText: {
			type: String,
			default: '📷 扫码添加'
		},
		// 按钮类型
		buttonType: {
			type: String,
			default: 'primary'
		},
		// 按钮图标
		buttonIcon: {
			type: String,
			default: ''
		},
		// 按钮尺寸
		buttonSize: {
			type: String,
			default: 'default'
		},
		// 是否连续扫码模式
		continuous: {
			type: Boolean,
			default: false
		},
		// 是否显示手动输入
		showManualInput: {
			type: Boolean,
			default: true
		},
		// 是否禁用
		disabled: {
			type: Boolean,
			default: false
		},
		// 扫码类型（barCode/qrCode/datamatrix/pdf417）
		scanType: {
			type: Array,
			default: () => ['barCode']
		}
	},
	
	data() {
		return {
			loading: false,
			manualBarcode: ''
		}
	},
	
	methods: {
		// 扫码
		scanCode() {
			if (this.disabled || this.loading) return
			
			uni.scanCode({
				scanType: this.scanType,
				success: (res) => {
					const barcode = res.result
					console.log('✅ 扫码成功:', barcode)
					
					// 验证条形码格式
					if (!this.validateBarcode(barcode)) {
						uni.showToast({
							title: '条形码格式不正确',
							icon: 'none'
						})
						return
					}
					
					// 查询药材信息
					this.getDrugByBarcode(barcode)
				},
				fail: (err) => {
					console.error('❌ 扫码失败:', err)
					
					// 用户取消扫码不提示错误
					if (err.errMsg && err.errMsg.includes('cancel')) {
						console.log('用户取消扫码')
						return
					}
					
					uni.showToast({
						title: '扫码失败，请重试',
						icon: 'none'
					})
					
					this.$emit('error', { type: 'scan_fail', error: err })
				}
			})
		},
		
		// 手动输入条形码
		onManualInput() {
			const barcode = this.manualBarcode.trim()
			
			if (!barcode) {
				uni.showToast({
					title: '请输入条形码',
					icon: 'none'
				})
				return
			}
			
			if (!this.validateBarcode(barcode)) {
				uni.showToast({
					title: '条形码格式不正确',
					icon: 'none'
				})
				return
			}
			
			console.log('✅ 手动输入条形码:', barcode)
			this.getDrugByBarcode(barcode)
		},
		
		// 验证条形码格式
		validateBarcode(barcode) {
			if (!barcode) return false
			
			// 条形码通常是8-14位数字
			// EAN-8: 8位, EAN-13: 13位, UPC: 12位
			const pattern = /^\d{8,14}$/
			return pattern.test(barcode)
		},
		
		// 查询药材信息
		async getDrugByBarcode(barcode) {
			this.loading = true
			
			// 清空手动输入框
			this.manualBarcode = ''
			
			try {
				console.log('🔍 开始查询条形码:', barcode)
				
				// 调用专用的条形码查询云函数
				const result = await wx.cloud.callFunction({
					name: 'drugBarcodeQuery',
					data: {
						action: 'queryByBarcode',
						barcode: barcode
					}
				})
				
				console.log('☁️ 云函数返回:', result.result)
				
				if (result.result.success && result.result.data) {
					const drugInfo = result.result.data
					const source = result.result.source || 'unknown'
					
					// 显示数据来源
					const sourceText = {
						'local': '本地档案',
						'cache': '缓存数据',
						'gs1': 'API查询'
					}[source] || '未知来源'
					
					uni.showToast({
						title: `✅ 识别成功 (${sourceText})`,
						icon: 'success',
						duration: 1500
					})
					
					console.log('✅ 药材信息:', drugInfo)
					
					// 触发成功事件，返回药材信息和条形码
					this.$emit('success', {
						...drugInfo,
						barcode: barcode,
						source: source
					})
					
					// 如果是连续扫码模式，延迟后继续扫码
					if (this.continuous) {
						setTimeout(() => {
							this.scanCode()
						}, 1500)
					}
				} else {
					// 药材未找到
					console.log('⚠️ 未找到药材信息')
					this.handleDrugNotFound(barcode)
				}
				
			} catch (err) {
				console.error('❌ 查询药材失败:', err)
				
				let errorMsg = '查询失败，请重试'
				
				// 解析错误信息
				if (err.errMsg) {
					if (err.errMsg.includes('cloud function')) {
						errorMsg = '云函数调用失败，请检查网络'
					} else if (err.errMsg.includes('timeout')) {
						errorMsg = '查询超时，请重试'
					}
				}
				
				uni.showToast({
					title: errorMsg,
					icon: 'none',
					duration: 2000
				})
				
				this.$emit('error', {
					type: 'query_fail',
					barcode: barcode,
					error: err
				})
			} finally {
				this.loading = false
			}
		},
		
		// 处理药材未找到
		handleDrugNotFound(barcode) {
			uni.showModal({
				title: '💊 药材未找到',
				content: `条形码：${barcode}\n\n该药材未录入系统，是否手动添加？`,
				confirmText: '立即添加',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						// 触发未找到事件，携带条形码信息
						this.$emit('notFound', {
							barcode: barcode,
							timestamp: Date.now()
						})
					} else if (this.continuous) {
						// 连续扫码模式下，取消后继续扫码
						setTimeout(() => {
							this.scanCode()
						}, 500)
					}
				}
			})
		},
		
		// 重置组件状态
		reset() {
			this.loading = false
			this.manualBarcode = ''
		}
	}
}
</script>

<style lang="scss" scoped>
.scanner-wrapper {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.manual-input {
	display: flex;
	align-items: center;
	gap: 15rpx;
	padding: 20rpx;
	background-color: #F8F8F8;
	border-radius: 15rpx;
}

.barcode-input {
	flex: 1;
	height: 60rpx;
	padding: 0 20rpx;
	background-color: #FFFFFF;
	border: 1px solid #E0E0E0;
	border-radius: 10rpx;
	font-size: 28rpx;
}
</style>

































