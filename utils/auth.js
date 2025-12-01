/**
 * 前端权限验证工具
 * 小程序端使用
 */
import { ROLES, hasPermission, isAdmin, canOperate, getRoleText } from './permission.js'

/**
 * 用户登录
 * 在 App.js onLaunch 或登录页面调用
 * @param {string} [wechatId] 可选：用于首次登录时按微信号绑定账号
 */
export async function login(wechatId) {
  try {
    // 兼容uni-app和微信小程序
    const cloud = typeof uni !== 'undefined' ? uni.cloud : wx.cloud
    
    const res = await cloud.callFunction({
      name: 'login',
      data: wechatId ? { wechatId } : {}
    })
    
    if (res.result.code === 0 && res.result.authorized) {
      // 登录成功，保存用户信息
      const { userInfo } = res.result
      
      // 兼容uni-app和微信小程序
      const setStorage = typeof uni !== 'undefined' ? uni.setStorageSync : wx.setStorageSync
      setStorage('isLogin', true)
      setStorage('userInfo', userInfo)
      setStorage('userRole', userInfo.role)
      setStorage('userId', userInfo.userId)
      
      return {
        success: true,
        userInfo
      }
    } else {
      // 不在白名单
      const setStorage = typeof uni !== 'undefined' ? uni.setStorageSync : wx.setStorageSync
      setStorage('isLogin', false)
      setStorage('userInfo', null)
      
      return {
        success: false,
        message: res.result.message
      }
    }
  } catch (err) {
    console.error('登录失败:', err)
    return {
      success: false,
      message: '登录失败，请重试'
    }
  }
}

/**
 * 检查登录状态
 */
export function checkLogin() {
  // 兼容uni-app和微信小程序
  if (typeof uni !== 'undefined') {
    return uni.getStorageSync('isLogin') === true
  } else if (typeof wx !== 'undefined') {
    return wx.getStorageSync('isLogin') === true
  }
  return false
}

/**
 * 获取当前用户信息
 */
export function getUserInfo() {
  // 兼容uni-app和微信小程序
  if (typeof uni !== 'undefined') {
    return uni.getStorageSync('userInfo') || null
  } else if (typeof wx !== 'undefined') {
    return wx.getStorageSync('userInfo') || null
  }
  return null
}

/**
 * 获取当前用户角色
 */
export function getUserRole() {
  return wx.getStorageSync('userRole') || ''
}

/**
 * 退出登录
 */
export function logout() {
  wx.removeStorageSync('isLogin')
  wx.removeStorageSync('userInfo')
  wx.removeStorageSync('userRole')
  wx.removeStorageSync('userId')
  
  // 跳转到登录页
  wx.reLaunch({
    url: '/pages/login/index'
  })
}

/**
 * 检查是否有指定权限
 * @param {string} permission - 权限标识
 * @returns {boolean}
 */
export function checkPermission(permission) {
  const role = getUserRole()
  return hasPermission(role, permission)
}

/**
 * 页面权限守卫
 * 在页面 onLoad 时调用
 * @param {string|array} requiredPermission - 所需权限
 * @param {object} options - 配置项
 */
export function requirePermission(requiredPermission, options = {}) {
  const {
    title = '权限不足',
    message = '您无权访问此页面',
    redirectTo = 'back' // 'back' | 'home' | string(页面路径)
  } = options
  
  const role = getUserRole()
  const permissions = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission]
  
  const hasAnyPermission = permissions.some(perm => 
    hasPermission(role, perm)
  )
  
  if (!hasAnyPermission) {
    wx.showModal({
      title,
      content: message,
      showCancel: false,
      success: () => {
        if (redirectTo === 'back') {
          wx.navigateBack()
        } else if (redirectTo === 'home') {
          wx.switchTab({ url: '/pages/index/index' })
        } else {
          wx.redirectTo({ url: redirectTo })
        }
      }
    })
    return false
  }
  
  return true
}

/**
 * 检查是否为管理员
 */
export function isUserAdmin() {
  return isAdmin(getUserRole())
}

/**
 * 检查是否可操作（管理员或药房人员）
 */
export function canUserOperate() {
  return canOperate(getUserRole())
}

/**
 * 获取当前用户角色文本
 */
export function getUserRoleText() {
  return getRoleText(getUserRole())
}

/**
 * 权限混入（用于页面或组件）
 * 在页面或组件中使用：import authMixin from '@/utils/auth-mixin.js'
 */
export const authMixin = {
  data() {
    return {
      userInfo: null,
      userRole: '',
      isAdmin: false,
      canOperate: false
    }
  },
  
  onLoad() {
    this.loadUserAuth()
  },
  
  methods: {
    // 加载用户权限信息
    loadUserAuth() {
      this.userInfo = getUserInfo()
      this.userRole = getUserRole()
      this.isAdmin = isUserAdmin()
      this.canOperate = canUserOperate()
    },
    
    // 检查权限
    hasPermission(permission) {
      return checkPermission(permission)
    },
    
    // 需要权限（不满足则提示并返回）
    requirePermission(permission, message) {
      return requirePermission(permission, { message })
    }
  }
}

// 导出常量
export { ROLES }





























