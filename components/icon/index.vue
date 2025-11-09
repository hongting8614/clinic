<template>
	<view class="icon-wrapper" :class="['size-' + size, 'theme-' + theme]" :style="customStyle">
		<text class="icon-content">{{ iconMap[name] }}</text>
	</view>
</template>

<script>
export default {
	name: 'Icon',
	props: {
		name: {
			type: String,
			required: true
		},
		size: {
			type: String,
			default: 'medium' // small, medium, large, xlarge
		},
		theme: {
			type: String,
			default: 'primary' // primary, success, warning, danger, info
		},
		gradient: {
			type: Boolean,
			default: true
		}
	},
	computed: {
		iconMap() {
			return {
				// 医务室Logo
				'clinic': '⚕️',
				'hospital': '🏥',
				
				// 核心业务
				'in': '📥',
				'out': '📤',
				'stock': '📦',
				'document': '📋',
				'transfer': '🔄',
				'consume': '💊',
				'requisition': '📝',
				'inventory': '🔍',
				'damage': '⚠️',
				'return': '↩️',
				
				// 数据统计
				'chart': '📊',
				'trend': '📈',
				'report': '📉',
				'stats': '📑',
				
				// 状态指示
				'success': '✅',
				'warning': '⚠️',
				'danger': '🚨',
				'info': 'ℹ️',
				'pending': '⏳',
				'check': '✓',
				'close': '✕',
				
				// 功能操作
				'search': '🔍',
				'add': '➕',
				'edit': '✏️',
				'delete': '🗑️',
				'scan': '📷',
				'sign': '✍️',
				'export': '📤',
				'import': '📥',
				
				// 用户相关
				'user': '👤',
				'users': '👥',
				'setting': '⚙️',
				'help': '❓',
				'logout': '🚪',
				
				// 时间相关
				'time': '🕐',
				'calendar': '📅',
				'clock': '⏰',
				
				// 其他
				'bell': '🔔',
				'star': '⭐',
				'heart': '❤️',
				'tag': '🏷️',
				'location': '📍',
				'phone': '📞',
				'email': '✉️'
			}
		},
		customStyle() {
			return this.gradient ? this.getGradientStyle() : ''
		}
	},
	methods: {
		getGradientStyle() {
			const gradients = {
				primary: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);',
				success: 'background: linear-gradient(135deg, #10b981 0%, #059669 100%);',
				warning: 'background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);',
				danger: 'background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);',
				info: 'background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);',
				purple: 'background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);',
				teal: 'background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);',
				pink: 'background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);',
				orange: 'background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);',
				indigo: 'background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);'
			}
			return gradients[this.theme] || gradients.primary
		}
	}
}
</script>

<style scoped>
.icon-wrapper {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 16rpx;
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.icon-wrapper:active {
	transform: scale(0.95);
}

/* 尺寸 */
.size-small {
	width: 48rpx;
	height: 48rpx;
	border-radius: 12rpx;
}

.size-small .icon-content {
	font-size: 24rpx;
}

.size-medium {
	width: 70rpx;
	height: 70rpx;
	border-radius: 18rpx;
}

.size-medium .icon-content {
	font-size: 36rpx;
}

.size-large {
	width: 90rpx;
	height: 90rpx;
	border-radius: 22rpx;
}

.size-large .icon-content {
	font-size: 48rpx;
}

.size-xlarge {
	width: 120rpx;
	height: 120rpx;
	border-radius: 30rpx;
}

.size-xlarge .icon-content {
	font-size: 64rpx;
}

/* 图标内容 */
.icon-content {
	filter: drop-shadow(0 2rpx 4rpx rgba(0,0,0,0.1));
}

/* 主题（如果不使用渐变） */
.theme-primary:not([style*="gradient"]) {
	background: #667eea;
}

.theme-success:not([style*="gradient"]) {
	background: #10b981;
}

.theme-warning:not([style*="gradient"]) {
	background: #f59e0b;
}

.theme-danger:not([style*="gradient"]) {
	background: #ef4444;
}

.theme-info:not([style*="gradient"]) {
	background: #3b82f6;
}
</style>







