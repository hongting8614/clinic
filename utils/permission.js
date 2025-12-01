/**
 * 权限验证工具函数
 * 可在云函数和小程序前端共用
 */

/**
 * 角色权限定义
 */
const ROLES = {
  ADMIN: 'admin',              // 管理员
  PROJECT_MANAGER: 'project_manager', // 项目经理
  DOCTOR: 'doctor',            // 医生
  PHARMACY: 'pharmacy',        // 药房人员（保留兼容）
  VIEWER: 'viewer'              // 查看者（保留兼容）
}

/**
 * 角色文本映射
 */
const ROLE_TEXT = {
  [ROLES.ADMIN]: '管理员',
  [ROLES.PROJECT_MANAGER]: '项目经理',
  [ROLES.DOCTOR]: '医务人员',
  [ROLES.PHARMACY]: '药房人员',
  [ROLES.VIEWER]: '查看者'
}

/**
 * 权限级别（数字越大权限越高）
 */
const ROLE_LEVEL = {
  [ROLES.VIEWER]: 1,
  [ROLES.DOCTOR]: 2,
  [ROLES.PROJECT_MANAGER]: 3,
  [ROLES.PHARMACY]: 3,  // 保留兼容
  [ROLES.ADMIN]: 4
}

/**
 * 功能权限配置
 * 定义每个功能所需的最低角色权限
 */
const PERMISSIONS = {
  // 用户管理（管理员和项目经理）
  'user.create': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
  'user.update': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
  'user.delete': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
  'user.list': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],
  
  // 药材管理
  'drug.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'drug.update': [ROLES.ADMIN, ROLES.PHARMACY],
  'drug.delete': [ROLES.ADMIN],
  'drug.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  'drug.import': [ROLES.ADMIN],
  
  // 入库管理
  'in.create': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACY], // 创建：管理员、医生、药房
  'in.sign': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACY], // 签名：管理员、医生、药房
  'in.review': [ROLES.ADMIN, ROLES.PROJECT_MANAGER], // 复核：管理员、项目经理
  'in.reject': [ROLES.ADMIN, ROLES.PROJECT_MANAGER], // 驳回：管理员、项目经理
  'in.read': [ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.DOCTOR, ROLES.PHARMACY, ROLES.VIEWER],
  'in.delete': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PHARMACY], // 删除草稿：管理员、医生、药房
  
  // 出库管理
  'out.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'out.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'out.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 调拨管理
  'transfer.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'transfer.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'transfer.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 消耗管理
  'consume.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'consume.update': [ROLES.ADMIN, ROLES.PHARMACY],
  'consume.delete': [ROLES.ADMIN],
  'consume.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 请领管理
  'requisition.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'requisition.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'requisition.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 盘点管理
  'inventory.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'inventory.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'inventory.update': [ROLES.ADMIN], // 修改差异仅管理员
  'inventory.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 报损管理
  'damage.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'damage.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'damage.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 退货管理
  'return.create': [ROLES.ADMIN, ROLES.PHARMACY],
  'return.sign': [ROLES.ADMIN, ROLES.PHARMACY],
  'return.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 库存查询
  'stock.read': [ROLES.ADMIN, ROLES.PHARMACY, ROLES.VIEWER],
  
  // 报表统计
  'report.read': [ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.PHARMACY, ROLES.VIEWER],
  'report.export': [ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.PHARMACY, ROLES.VIEWER],
  // 具体报表权限
  'report.clinic': [ROLES.ADMIN, ROLES.PROJECT_MANAGER], // 门诊登记报表
  'report.stock': [ROLES.ADMIN, ROLES.PROJECT_MANAGER], // 库存报表
  'report.out': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],   // 出库报表
  'report.in': [ROLES.ADMIN, ROLES.PROJECT_MANAGER],    // 入库报表
  
  // 系统设置
  'system.dept': [ROLES.ADMIN],
  'system.location': [ROLES.ADMIN],
  'system.config': [ROLES.ADMIN],
  'system.backup': [ROLES.ADMIN]
}

/**
 * 检查用户是否有指定权限
 * @param {string} userRole - 用户角色
 * @param {string} permission - 权限标识（如 'drug.create'）
 * @returns {boolean} 是否有权限
 */
function hasPermission(userRole, permission) {
  if (!PERMISSIONS[permission]) {
    console.warn(`未定义的权限: ${permission}`)
    return false
  }
  return PERMISSIONS[permission].includes(userRole)
}

/**
 * 检查用户角色级别是否满足要求
 * @param {string} userRole - 用户角色
 * @param {string} requiredRole - 所需角色
 * @returns {boolean} 是否满足
 */
function checkRoleLevel(userRole, requiredRole) {
  return ROLE_LEVEL[userRole] >= ROLE_LEVEL[requiredRole]
}

/**
 * 获取角色文本
 * @param {string} role - 角色代码
 * @returns {string} 角色文本
 */
function getRoleText(role) {
  return ROLE_TEXT[role] || '未知角色'
}

/**
 * 检查是否为管理员
 * @param {string} role - 角色
 * @returns {boolean}
 */
function isAdmin(role) {
  return role === ROLES.ADMIN
}

/**
 * 检查是否可操作（管理员、项目经理或药房人员）
 * @param {string} role - 角色
 * @returns {boolean}
 */
function canOperate(role) {
  return [ROLES.ADMIN, ROLES.PROJECT_MANAGER, ROLES.PHARMACY].includes(role)
}

/**
 * 检查是否可以复核（管理员或项目经理）
 * @param {string} role - 角色
 * @returns {boolean}
 */
function canReview(role) {
  return [ROLES.ADMIN, ROLES.PROJECT_MANAGER].includes(role)
}

/**
 * 检查是否可以查看报表（管理员或项目经理）
 * @param {string} role - 角色
 * @returns {boolean}
 */
function canViewReports(role) {
  return [ROLES.ADMIN, ROLES.PROJECT_MANAGER].includes(role)
}

// ===== 新增：前端便捷权限函数 =====

// 从本地缓存获取当前用户角色，前端使用
function getCurrentRole() {
  try {
    // uni 在云函数环境不存在，这里仅供小程序端使用
    /* global uni */
    const userInfo = typeof uni !== 'undefined' ? (uni.getStorageSync('userInfo') || {}) : {}
    return userInfo.role || ROLES.VIEWER
  } catch (e) {
    return ROLES.VIEWER
  }
}

// 是否可以新建/编辑入库单或出库单（除复核外的单据编辑权限）
function canEditInOutRecords(role) {
  return role === ROLES.ADMIN || role === ROLES.DOCTOR
}

// 是否可以进行入库复核
function canReviewInbound(role) {
  return role === ROLES.ADMIN || role === ROLES.PROJECT_MANAGER
}

// 是否可以进行出库复核/接收确认
function canReviewOutbound(role) {
  return role === ROLES.ADMIN || role === ROLES.DOCTOR
}

// 是否可以执行库存盘点/调整等操作
function canAdjustStock(role) {
  return role === ROLES.ADMIN || role === ROLES.DOCTOR
}

// 是否可以导出报表（入库/出库/库存/门诊等）
function canExportReports(role) {
  return (
    role === ROLES.ADMIN ||
    role === ROLES.PROJECT_MANAGER ||
    role === ROLES.DOCTOR
  )
}

/**
 * 云函数中验证权限
 * 需要在云函数中使用，依赖云开发环境
 * @param {string} openid - 用户openid
 * @param {string|array} requiredPermission - 所需权限
 * @returns {Promise<{authorized: boolean, message: string, user?: object}>}
 */
async function checkPermissionInCloud(openid, requiredPermission) {
  // 注意：这个函数仅在云函数环境中可用
  if (typeof cloud === 'undefined') {
    throw new Error('此函数仅在云函数环境中可用')
  }
  
  const db = cloud.database()
  
  // 查询用户
  const userRes = await db.collection('users')
    .where({ openid, status: 'active' })
    .get()
  
  if (userRes.data.length === 0) {
    return {
      authorized: false,
      message: '用户不存在或已被禁用'
    }
  }
  
  const user = userRes.data[0]
  
  // 检查权限
  const permissions = Array.isArray(requiredPermission) 
    ? requiredPermission 
    : [requiredPermission]
  
  const hasAnyPermission = permissions.some(perm => 
    hasPermission(user.role, perm)
  )
  
  if (!hasAnyPermission) {
    return {
      authorized: false,
      message: '权限不足'
    }
  }
  
  return {
    authorized: true,
    message: '验证通过',
    user
  }
}

// 导出（根据环境选择导出方式）
// 导出所有内容
export {
  ROLES,
  ROLE_TEXT,
  ROLE_LEVEL,
  PERMISSIONS,
  hasPermission,
  checkRoleLevel,
  getRoleText,
  isAdmin,
  canOperate,
  canReview,
  canViewReports,
  getCurrentRole,
  canEditInOutRecords,
  canReviewInbound,
  canReviewOutbound,
  canAdjustStock,
  canExportReports,
  checkPermissionInCloud
}

// 同时兼容 CommonJS（用于云函数）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ROLES,
    ROLE_TEXT,
    ROLE_LEVEL,
    PERMISSIONS,
    hasPermission,
    checkRoleLevel,
    getRoleText,
    isAdmin,
    canOperate,
    canReview,
    canViewReports,
    getCurrentRole,
    canEditInOutRecords,
    canReviewInbound,
    canReviewOutbound,
    canAdjustStock,
    canExportReports,
    checkPermissionInCloud
  }
}





























