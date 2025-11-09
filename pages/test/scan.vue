<template>
	<view class="container">
		<!-- 页面头部 -->
		<view class="page-header">
			<view class="header-title">🔍 扫码功能测试</view>
			<view class="header-desc">测试条形码扫描和API配置</view>
		</view>
		
		<!-- 扫码区域 -->
		<view class="scan-section">
			<scanner 
				button-text="📷 开始扫码测试"
				button-type="primary"
				button-size="large"
				:show-manual-input="true"
				@success="onScanSuccess"
				@notFound="onNotFound"
				@error="onError"
			></scanner>
		</view>
		
		<!-- 测试结果 -->
		<view v-if="result" class="result-section">
			<view class="result-header">
				<text class="result-title">📊 测试结果</text>
				<view 
					class="result-status" 
					:class="result.success ? 'status-success' : 'status-fail'"
				>
					{{ result.success ? '✅ 成功' : '❌ 失败' }}
				</view>
			</view>
			
			<!-- 成功结果 -->
			<view v-if="result.success" class="result-content">
				<view class="result-item">
					<text class="label">数据来源：</text>
					<text class="value">{{ getSourceText(result.source) }}</text>
				</view>
				<view class="result-item">
					<text class="label">条形码：</text>
					<text class="value">{{ result.barcode }}</text>
				</view>
				<view class="result-item">
					<text class="label">药品名称：</text>
					<text class="value">{{ result.name }}</text>
				</view>
				<view class="result-item">
					<text class="label">规格：</text>
					<text class="value">{{ result.specification }}</text>
				</view>
				<view class="result-item">
					<text class="label">生产厂家：</text>
					<text class="value">{{ result.manufacturer }}</text>
				</view>
				<view class="result-item">
					<text class="label">单位：</text>
					<text class="value">{{ result.unit }}</text>
				</view>
				<view v-if="result.category" class="result-item">
					<text class="label">分类：</text>
					<text class="value">{{ result.category }}</text>
				</view>
			</view>
			
			<!-- 失败结果 -->
			<view v-else class="result-content">
				<view class="error-info">
					<text class="error-icon">⚠️</text>
					<text class="error-text">{{ result.message }}</text>
				</view>
				<view v-if="result.barcode" class="result-item">
					<text class="label">条形码：</text>
					<text class="value">{{ result.barcode }}</text>
				</view>
			</view>
			
			<!-- 原始数据 -->
			<view class="raw-data">
				<view class="raw-header" @click="showRawData = !showRawData">
					<text>🔧 原始数据</text>
					<text class="arrow">{{ showRawData ? '▼' : '▶' }}</text>
				</view>
				<view v-if="showRawData" class="raw-content">
					<text class="raw-text">{{ JSON.stringify(result, null, 2) }}</text>
				</view>
			</view>
		</view>
		
		<!-- 测试历史 -->
		<view v-if="history.length > 0" class="history-section">
			<view class="history-header">
				<text class="history-title">📜 测试历史</text>
				<u-button 
					text="清空" 
					size="mini" 
					type="error"
					plain
					@click="clearHistory"
				></u-button>
			</view>
			
			<view 
				v-for="(item, index) in history" 
				:key="index"
				class="history-item"
				@click="showHistoryDetail(item)"
			>
				<view class="history-left">
					<text class="history-status">{{ item.success ? '✅' : '❌' }}</text>
					<text class="history-barcode">{{ item.barcode || '未知' }}</text>
				</view>
				<view class="history-right">
					<text class="history-name">{{ item.name || '未找到' }}</text>
					<text class="history-time">{{ formatTime(item.timestamp) }}</text>
				</view>
			</view>
		</view>
		
		<!-- 配置说明 -->
		<view class="config-section">
			<view class="config-title">⚙️ API配置说明</view>
			<view class="config-content">
				<text class="config-text">
					1. 系统采用三级查询策略：\n
					   • 本地药品档案（免费）\n
					   • 缓存数据库（免费）\n
					   • 第三方API（需配置）\n\n
					2. 支持的API服务商：\n
					   • 极速数据（JISUAPI_APPKEY）\n
					   • 聚合数据（JUHE_API_KEY）\n
					   • 阿里云（ALIYUN_APPCODE）\n\n
					3. 配置位置：\n
					   云开发控制台 → 云函数 → drugBarcodeQuery → 环境变量\n\n
					4. 详细配置文档：\n
					   查看 docs/极速数据API配置指南.md
				</text>
			</view>
			
			<u-button 
				text="📖 查看配置文档" 
				type="info"
				plain
				@click="viewDocs"
			></u-button>
		</view>
		
		<!-- 测试用条形码 -->
		<view class="test-barcodes">
			<view class="test-title">🧪 测试用条形码</view>
			<view class="test-desc">点击复制，用于手动输入测试</view>
			<view 
				v-for="(item, index) in testBarcodes" 
				:key="index"
				class="test-item"
				@click="copyBarcode(item.code)"
			>
				<text class="test-code">{{ item.code }}</text>
				<text class="test-name">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import Scanner from '@/components/scanner/index.vue'

export default {
	components: {
		Scanner
	},
	
	data() {
		return {
			result: null,
			showRawData: false,
			history: [],
			testBarcodes: [
				{ code: '6901234567890', name: '常见药品条形码' },
				{ code: '6921168509089', name: '阿莫西林胶囊' },
				{ code: '6920003800014', name: '感冒灵颗粒' },
				{ code: '6901028000017', name: '维生素C片' }
			]
		}
	},
	
	onLoad() {
		// 加载测试历史
		this.loadHistory()
	},
	
	methods: {
		// 扫码成功
		onScanSuccess(drugInfo) {
			console.log('✅ 扫码成功:', drugInfo)
			
			this.result = {
				success: true,
				...drugInfo,
				timestamp: Date.now()
			}
			
			// 添加到历史记录
			this.addToHistory(this.result)
			
			// 滚动到结果区域
			uni.pageScrollTo({
				scrollTop: 300,
				duration: 300
			})
		},
		
		// 未找到药品
		onNotFound(data) {
			console.log('⚠️ 未找到药品:', data)
			
			this.result = {
				success: false,
				barcode: data.barcode || data,
				message: '未找到药品信息',
				timestamp: Date.now()
			}
			
			// 添加到历史记录
			this.addToHistory(this.result)
		},
		
		// 扫码错误
		onError(error) {
			console.error('❌ 扫码错误:', error)
			
			this.result = {
				success: false,
				barcode: error.barcode || '',
				message: error.type === 'scan_fail' ? '扫码失败' : '查询失败',
				error: error,
				timestamp: Date.now()
			}
			
			// 添加到历史记录
			this.addToHistory(this.result)
		},
		
		// 获取数据来源文本
		getSourceText(source) {
			const sourceMap = {
				'local': '📦 本地药品档案',
				'cache': '💾 缓存数据库',
				'gs1': '🌐 第三方API'
			}
			return sourceMap[source] || '❓ 未知来源'
		},
		
		// 格式化时间
		formatTime(timestamp) {
			const date = new Date(timestamp)
			const hours = String(date.getHours()).padStart(2, '0')
			const minutes = String(date.getMinutes()).padStart(2, '0')
			const seconds = String(date.getSeconds()).padStart(2, '0')
			return `${hours}:${minutes}:${seconds}`
		},
		
		// 添加到历史记录
		addToHistory(item) {
			this.history.unshift(item)
			
			// 只保留最近20条
			if (this.history.length > 20) {
				this.history = this.history.slice(0, 20)
			}
			
			// 保存到本地存储
			uni.setStorageSync('scan_test_history', this.history)
		},
		
		// 加载历史记录
		loadHistory() {
			try {
				const history = uni.getStorageSync('scan_test_history')
				if (history) {
					this.history = history
				}
			} catch (err) {
				console.error('加载历史记录失败:', err)
			}
		},
		
		// 清空历史
		clearHistory() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有测试历史吗？',
				success: (res) => {
					if (res.confirm) {
						this.history = []
						uni.removeStorageSync('scan_test_history')
						uni.showToast({
							title: '已清空',
							icon: 'success'
						})
					}
				}
			})
		},
		
		// 显示历史详情
		showHistoryDetail(item) {
			this.result = item
			this.showRawData = false
			
			uni.pageScrollTo({
				scrollTop: 300,
				duration: 300
			})
		},
		
		// 复制条形码
		copyBarcode(code) {
			uni.setClipboardData({
				data: code,
				success: () => {
					uni.showToast({
						title: '已复制到剪贴板',
						icon: 'success'
					})
				}
			})
		},
		
		// 查看文档
		viewDocs() {
			uni.showModal({
				title: '📖 配置文档',
				content: '配置文档位于项目目录：\ndocs/极速数据API配置指南.md\n\n请在电脑上查看完整文档。',
				showCancel: false
			})
		}
	}
}
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	background-color: #F5F7FA;
	padding: 20rpx;
	padding-bottom: 40rpx;
}

.page-header {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	padding: 40rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
	text-align: center;
}

.header-title {
	font-size: 36rpx;
	font-weight: bold;
	color: #FFFFFF;
	margin-bottom: 10rpx;
}

.header-desc {
	font-size: 26rpx;
	color: rgba(255, 255, 255, 0.9);
}

.scan-section {
	background-color: #FFFFFF;
	padding: 40rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.result-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.result-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 25rpx;
	padding-bottom: 20rpx;
	border-bottom: 2rpx solid #F0F0F0;
}

.result-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.result-status {
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	font-size: 24rpx;
	font-weight: bold;
}

.status-success {
	background-color: #E8F5E9;
	color: #4CAF50;
}

.status-fail {
	background-color: #FFEBEE;
	color: #F44336;
}

.result-content {
	margin-bottom: 20rpx;
}

.result-item {
	display: flex;
	padding: 15rpx 0;
	border-bottom: 1rpx solid #F8F8F8;
}

.result-item .label {
	min-width: 180rpx;
	font-size: 28rpx;
	color: #999999;
}

.result-item .value {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
	word-break: break-all;
}

.error-info {
	display: flex;
	align-items: center;
	gap: 15rpx;
	padding: 30rpx;
	background-color: #FFF3E0;
	border-radius: 15rpx;
	margin-bottom: 20rpx;
}

.error-icon {
	font-size: 40rpx;
}

.error-text {
	flex: 1;
	font-size: 28rpx;
	color: #FF9800;
}

.raw-data {
	margin-top: 20rpx;
	border-top: 2rpx solid #F0F0F0;
	padding-top: 20rpx;
}

.raw-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 15rpx 0;
	font-size: 28rpx;
	color: #666666;
	cursor: pointer;
}

.arrow {
	font-size: 24rpx;
	color: #999999;
}

.raw-content {
	background-color: #F8F8F8;
	padding: 20rpx;
	border-radius: 10rpx;
	margin-top: 10rpx;
}

.raw-text {
	font-size: 24rpx;
	color: #666666;
	font-family: monospace;
	word-break: break-all;
	white-space: pre-wrap;
}

.history-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.history-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20rpx;
}

.history-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.history-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #F8F8F8;
	border-radius: 15rpx;
	margin-bottom: 15rpx;
}

.history-left {
	display: flex;
	align-items: center;
	gap: 15rpx;
}

.history-status {
	font-size: 32rpx;
}

.history-barcode {
	font-size: 26rpx;
	color: #666666;
	font-family: monospace;
}

.history-right {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	gap: 5rpx;
}

.history-name {
	font-size: 28rpx;
	color: #333333;
}

.history-time {
	font-size: 22rpx;
	color: #999999;
}

.config-section {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
	margin-bottom: 20rpx;
}

.config-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 20rpx;
}

.config-content {
	background-color: #F8F8F8;
	padding: 25rpx;
	border-radius: 15rpx;
	margin-bottom: 20rpx;
}

.config-text {
	font-size: 26rpx;
	color: #666666;
	line-height: 40rpx;
}

.test-barcodes {
	background-color: #FFFFFF;
	padding: 30rpx;
	border-radius: 20rpx;
}

.test-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 10rpx;
}

.test-desc {
	font-size: 24rpx;
	color: #999999;
	margin-bottom: 20rpx;
}

.test-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	background-color: #F8F8F8;
	border-radius: 15rpx;
	margin-bottom: 15rpx;
}

.test-code {
	font-size: 28rpx;
	color: #333333;
	font-family: monospace;
	font-weight: bold;
}

.test-name {
	font-size: 26rpx;
	color: #999999;
}
</style>



