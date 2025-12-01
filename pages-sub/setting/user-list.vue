<template>
  <view class="user-management">
    <!-- 登录检查中 -->
    <view v-if="isChecking" class="checking-container">
      <view class="checking-content">
        <text class="checking-text">检查登录状态...</text>
      </view>
    </view>
    
    <!-- 页面内容 -->
    <view v-else-if="isAuthorized" class="page-content">
    <!-- 顶部工具栏：当前角色 + 添加按钮 -->
    <view class="page-toolbar toolbar-light">
      <text class="toolbar-role">当前角色：{{ currentRoleText }}</text>
      <button class="btn-add btn-primary" @click="showAddDialog">
        <text class="btn-add-text">添加用户</text>
      </button>
    </view>
    
    <!-- 统计卡片：仅在有用户时显示 -->
    <view class="stats-card" v-if="totalUsers > 0" style="background-color: #f9f9f9; padding: 16px; border-bottom: 1px solid #ddd;">
      <view class="stat-item">
        <text class="stat-value">{{ totalUsers }}</text>
        <text class="stat-label">总用户数</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ activeUsers }}</text>
        <text class="stat-label">活跃用户</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ adminCount }}</text>
        <text class="stat-label">管理员</text>
      </view>
    </view>
    
    <!-- 筛选栏：仅在有用户时显示 -->
    <view class="filter-bar" v-if="totalUsers > 0" style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: #f9f9f9; border-bottom: 1px solid #ddd;">
      <picker 
        :range="roleFilter" 
        :range-key="'text'"
        @change="onRoleFilterChange"
      >
        <view class="filter-item">
          <text>角色：{{ selectedRoleText }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
      
      <picker 
        :range="statusFilter" 
        :range-key="'text'"
        @change="onStatusFilterChange"
      >
        <view class="filter-item">
          <text>状态：{{ selectedStatusText }}</text>
          <text class="arrow">▼</text>
        </view>
      </picker>
    </view>
    
    <!-- 用户列表 -->
    <view class="user-list">
      <view 
        v-for="user in filteredUserList" 
        :key="user._id"
        class="user-item"
        :class="{ 'inactive': user.status !== 'active', 'editing': editingUserId === user._id }"
      >
        <!-- 用户信息 -->
        <view class="user-info">
          <view class="user-avatar">
            {{ user.name.substr(0, 1) }}
          </view>
          <view class="user-details">
            <view class="user-name">
              <text>{{ user.name }}</text>
              <text 
                class="role-tag" 
                :class="'role-' + user.role"
              >
                {{ user.roleText }}
              </text>
            </view>
            <view class="user-meta">
              <text class="meta-item">实名：{{ user.realName || '未设置' }}</text>
            </view>
            <view class="user-meta">
              <text class="meta-item">{{ user.phone }}</text>
            </view>
            <view class="user-meta" v-if="user.lastLogin">
              <text class="meta-item">
                最近登录: {{ formatTime(user.lastLogin) }}
              </text>
            </view>
          </view>
        </view>
        
        <!-- 操作按钮 -->
        <view class="user-actions">
          <button 
            class="btn-action btn-edit" 
            @click="editUser(user)"
            :disabled="user.openid === currentUserOpenid"
          >
            {{ editingUserId === user._id ? '收起' : '编辑' }}
          </button>
          <button 
            class="btn-action btn-toggle" 
            @click="toggleUserStatus(user)"
            :disabled="user.openid === currentUserOpenid"
          >
            {{ user.status === 'active' ? '禁用' : '启用' }}
          </button>
          <button 
            class="btn-action btn-delete" 
            @click="deleteUser(user)"
            :disabled="user.openid === currentUserOpenid"
          >
            删除
          </button>
        </view>
        
        <!-- 原地编辑表单 -->
        <view v-if="editingUserId === user._id" class="inline-edit-form">
          <view class="edit-form-header">
            <text class="edit-form-title">编辑用户信息</text>
          </view>
          
          <view class="edit-form-body">
            <!-- 改为展示微信号，方便管理员按微信号管理用户 -->
          <view class="inline-form-item">
            <text class="inline-label">微信号</text>
            <input 
              v-model="form.wechatId" 
              class="inline-input"
              placeholder="请输入微信号（或唯一备注名）"
            />
          </view>
            
            <view class="inline-form-item">
              <text class="inline-label">姓名 *</text>
              <input 
                v-model="form.name" 
                class="inline-input"
                placeholder="请输入姓名"
              />
            </view>
            
            <view class="inline-form-item">
              <text class="inline-label">实名 *</text>
              <input 
                v-model="form.realName" 
                class="inline-input"
                placeholder="请输入真实姓名（2-10个中文字符）"
                maxlength="10"
              />
            </view>
            
            <view class="inline-form-item">
              <text class="inline-label">昵称</text>
              <input 
                v-model="form.nickname" 
                class="inline-input"
                placeholder="请输入昵称（可选）"
              />
            </view>
            
            <view class="inline-form-item">
              <text class="inline-label">手机号 *</text>
              <input 
                v-model="form.phone" 
                class="inline-input"
                type="number"
                placeholder="请输入手机号"
              />
            </view>
            
            <view class="inline-form-item">
              <text class="inline-label">角色 *</text>
              <picker 
                :range="roleOptions" 
                :range-key="'text'"
                :value="roleIndex"
                @change="onRoleChange"
              >
                <view class="inline-picker">
                  <text>{{ form.roleText }}</text>
                  <text class="picker-arrow">▼</text>
                </view>
              </picker>
            </view>
            
            <view class="role-desc-inline">
              <text class="desc-icon">💡</text>
              <text class="desc-text">{{ getRoleDescription(form.role) }}</text>
            </view>
          </view>
          
          <view class="edit-form-footer">
            <button class="inline-btn btn-cancel" @click="cancelEdit">取消</button>
            <button class="inline-btn btn-save" @click="submitForm">保存修改</button>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 空状态：系统尚无任何用户 -->
    <view v-if="totalUsers === 0" class="empty-state">
      <text class="empty-icon">👤</text>
      <text class="empty-text">当前还没有用户，请点击右上角“添加用户”</text>
    </view>
    
    <!-- 空状态：有用户，但当前筛选无结果 -->
    <view v-else-if="filteredUserList.length === 0" class="empty-state tip">
      <text class="empty-text">当前筛选条件下暂无用户，请调整筛选条件</text>
    </view>
    
    <!-- 添加/编辑用户弹层：仅在 showDialog 为 true 时显示 -->
    <view v-if="showDialog" class="dialog-mask" @tap="closeDialog">
      <view class="dialog-new" @tap.stop>
        <!-- 头部 -->
        <view class="dialog-header-new">
          <view class="header-icon">
            <text class="icon-text">{{ isEdit ? '✏️' : '👤' }}</text>
          </view>
          <text class="dialog-title-new">{{ isEdit ? '编辑用户信息' : '用户信息' }}</text>
          <text class="dialog-subtitle">{{ isEdit ? '修改用户的基本信息' : '填写用户的基本信息' }}</text>
        </view>
        
        <!-- 表单区域 -->
        <view class="dialog-body-new">
          <!-- 微信号（供管理员按微信号管理权限） -->
          <view class="form-group">
            <view class="form-label-new">
              <text class="label-text">微信号</text>
              <text class="required">*</text>
            </view>
            <input 
              v-model="form.wechatId" 
              class="form-input-new"
              placeholder="请输入微信号（或管理员录入的备注名）"
            />
            <text class="form-hint" v-if="!isEdit">请填写管理员在后台预留的微信号，用于绑定权限</text>
          </view>
          
          <!-- 姓名和实名 -->
          <view class="form-row">
            <view class="form-group half">
              <view class="form-label-new">
                <text class="label-text">姓名</text>
                <text class="required">*</text>
              </view>
              <input 
                v-model="form.name" 
                class="form-input-new"
                placeholder="输入姓名"
              />
            </view>
            
            <view class="form-group half">
              <view class="form-label-new">
                <text class="label-text">实名</text>
                <text class="required">*</text>
              </view>
              <input 
                v-model="form.realName" 
                class="form-input-new"
                placeholder="2-10个字"
                maxlength="10"
              />
            </view>
          </view>
          
          <!-- 手机号 -->
          <view class="form-group">
            <view class="form-label-new">
              <text class="label-text">手机号</text>
              <text class="required">*</text>
            </view>
            <input 
              v-model="form.phone" 
              class="form-input-new"
              type="number"
              placeholder="输入11位手机号"
              maxlength="11"
            />
          </view>
          
          <!-- 角色选择 -->
          <view class="form-group">
            <view class="form-label-new">
              <text class="label-text">角色权限</text>
              <text class="required">*</text>
            </view>
            <picker 
              :range="roleOptions" 
              :range-key="'text'"
              :value="roleIndex"
              @change="onRoleChange"
            >
              <view class="role-selector">
                <view class="role-left">
                  <text class="role-icon">{{ getRoleIcon(form.role) }}</text>
                  <view class="role-info">
                    <text class="role-name">{{ form.roleText }}</text>
                    <text class="role-desc-short">{{ getRoleDescriptionShort(form.role) }}</text>
                  </view>
                </view>
                <text class="select-arrow">▼</text>
              </view>
            </picker>
          </view>
        </view>
        
        <!-- 底部按钮 -->
        <view class="dialog-footer-new">
          <button class="btn-new btn-cancel-new" @click="closeDialog">
            <text class="btn-text-new">取消</text>
          </button>
          <button class="btn-new btn-confirm-new" @click="submitForm">
            <text class="btn-icon-new">{{ isEdit ? '✓' : '+' }}</text>
            <text class="btn-text-new">{{ isEdit ? '保存修改' : '立即添加' }}</text>
          </button>
        </view>
      </view>
    </view>
  </view>
</view>
</template>

<script>
import { authMixin, login } from '@/utils/auth.js'
import { hasPermission, ROLE_TEXT } from '@/utils/permission.js'
export default {
  mixins: [authMixin],
  
  data() {
    return {
      // 用户列表
      userList: [],
      totalUsers: 0,
      activeUsers: 0,
      adminCount: 0,
      
      // 当前登录用户的openid
      currentUserOpenid: '',
      
      // 筛选
      roleFilter: [
        { value: 'all', text: '全部角色' },
        { value: 'admin', text: '管理员' },
        { value: 'project_manager', text: '项目经理' },
        { value: 'doctor', text: '医生' },
        { value: 'pharmacy', text: '药房人员' },
        { value: 'viewer', text: '查看者' }
      ],
      selectedRole: 'all',
      selectedRoleText: '全部角色',
      
      statusFilter: [
        { value: 'all', text: '全部状态' },
        { value: 'active', text: '已启用' },
        { value: 'inactive', text: '已禁用' }
      ],
      selectedStatus: 'all',
      selectedStatusText: '全部状态',
      
      // 弹窗
      showDialog: false,
      isEdit: false,
      editingUserId: null, // 正在编辑的用户ID
      
      // 登录检查与权限
      isChecking: true,
      isAuthorized: false,
      unauthorizedMessage: '请先登录',
      noPermission: false,
      
      // 表单
      form: {
        _id: '',
        openid: '', // 仅用于展示/兼容，新增时不再手动填写
        wechatId: '',
        name: '',
        realName: '',
        nickname: '',
        phone: '',
        role: 'viewer',
        roleText: '查看者'
      },
      
      roleOptions: [
        { value: 'admin', text: '管理员', desc: '拥有全部权限，包括用户管理' },
        { value: 'project_manager', text: '项目经理', desc: '有入库复核功能，可查看各种报表，可管理用户' },
        { value: 'doctor', text: '医务人员', desc: '负责门诊登记和出库，无系统管理权限' },
        { value: 'viewer', text: '查看者', desc: '仅可查看数据，无编辑权限' }
      ]
    }
  },
  
  computed: {
    // 过滤后的用户列表
    filteredUserList() {
      return this.userList.filter(user => {
        const roleMatch = this.selectedRole === 'all' || user.role === this.selectedRole
        const statusMatch = this.selectedStatus === 'all' || user.status === this.selectedStatus
        return roleMatch && statusMatch
      })
    },
    
    // 角色选择器当前索引
    roleIndex() {
      return this.roleOptions.findIndex(item => item.value === this.form.role)
    },
    
    // 当前登录角色的中文名称
    currentRoleText() {
      const role = this.userInfo?.role
      if (!role) return '未登录'
      return ROLE_TEXT[role] || '未知角色'
    }
  },
  
  async onLoad() {
    // 先检查登录状态
    await this.checkAuth()
    
    if (!this.isAuthorized) {
      // 未登录或登录态异常
      this.unauthorizedMessage = '请先登录后再访问用户管理'
      return
    }
    
    // 检查是否有用户管理权限（仅管理员、项目经理）
    const role = this.userInfo?.role
    if (!role || !hasPermission(role, 'user.list')) {
      this.noPermission = true
      this.unauthorizedMessage = '仅管理员和项目经理可以查看和管理用户列表'
      return
    }
    
    // 有权限，加载数据
    this.noPermission = false
    this.isAuthorized = true
    this.currentUserOpenid = this.userInfo.openid
    this.loadUserList()
  },
  
  methods: {
    // 检查授权
    async checkAuth() {
      this.isChecking = true
      
      // 强制刷新一次登录信息，避免使用过期的本地缓存角色
      let userInfo = null
      try {
        const result = await login()
        
        if (result.success) {
          userInfo = result.userInfo
        } else {
          this.isChecking = false
          this.isAuthorized = false
          this.unauthorizedMessage = result.message || '请先登录'
          return
        }
      } catch (err) {
        console.error('登录失败:', err)
        this.isChecking = false
        this.isAuthorized = false
        this.unauthorizedMessage = '登录失败，请重试'
        return
      }
      
      // 检查权限（管理员和项目经理）
      if (userInfo.role !== 'admin' && userInfo.role !== 'project_manager') {
        this.isChecking = false
        this.isAuthorized = false
        this.unauthorizedMessage = '权限不足，仅管理员和项目经理可访问用户管理'
        return
      }
      
      // 授权通过
      this.userInfo = userInfo
      this.isChecking = false
      this.isAuthorized = true
    },
    
    // 返回
    handleGoBack() {
      uni.navigateBack()
    },
    
    // 加载用户列表
    async loadUserList() {
      uni.showLoading({ title: '加载中...' })
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'getUserList',
          data: {}
        })
        
        uni.hideLoading()
        const result = res.result || {}

        if (result.code !== 0) {
          this.unauthorizedMessage = result.message || '获取用户列表失败'
          if (result.code === 403) {
            // 云函数层面也做了权限校验
            this.noPermission = true
          }
          uni.showToast({
            title: result.message || '获取用户列表失败',
            icon: 'none'
          })
          return
        }
        
        this.userList = result.data || []
        this.updateStats()
      } catch (err) {
        uni.hideLoading()
        console.error('加载用户列表失败:', err)
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        })
      }
    },
    
    // 更新统计数据
    updateStats() {
      this.totalUsers = this.userList.length
      this.activeUsers = this.userList.filter(u => u.status === 'active').length
      this.adminCount = this.userList.filter(u => u.role === 'admin').length
    },
    
    // 角色筛选
    onRoleFilterChange(e) {
      const index = e.detail.value
      this.selectedRole = this.roleFilter[index].value
      this.selectedRoleText = this.roleFilter[index].text
    },
    
    // 状态筛选
    onStatusFilterChange(e) {
      const index = e.detail.value
      this.selectedStatus = this.statusFilter[index].value
      this.selectedStatusText = this.statusFilter[index].text
    },
    
    // 显示添加弹窗
    showAddDialog() {
      this.isEdit = false
      this.form = {
        _id: '',
        openid: '',
        name: '',
        nickname: '',
        phone: '',
        role: 'viewer',
        roleText: '查看者'
      }
      this.showDialog = true
    },
    
    // 编辑用户
    editUser(user) {
      if (user.openid === this.currentUserOpenid) {
        uni.showToast({
          title: '不能编辑自己的账号',
          icon: 'none'
        })
        return
      }
      
      // 如果已经在编辑这个用户，则收起
      if (this.editingUserId === user._id) {
        this.editingUserId = null
        return
      }
      
      // 展开编辑表单
      this.editingUserId = user._id
      this.isEdit = true
      this.form = {
        _id: user._id,
        openid: user.openid,
        wechatId: user.wechatId || '',
        name: user.name,
        realName: user.realName || user.name,
        nickname: user.nickname || '',
        phone: user.phone,
        role: user.role,
        roleText: user.roleText
      }
    },
    
    // 取消编辑
    cancelEdit() {
      this.editingUserId = null
      this.form = {
        _id: '',
        wechatId: '',
        name: '',
        realName: '',
        nickname: '',
        phone: '',
        role: 'viewer',
        roleText: '查看者'
      }
    },
    
    // 切换用户状态
    toggleUserStatus(user) {
      // 仍然按 openid 防止禁用自己的账号
      if (user.openid === this.currentUserOpenid) {
        uni.showToast({
          title: '不能禁用自己的账号',
          icon: 'none'
        })
        return
      }
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active'
      const actionText = newStatus === 'active' ? '启用' : '禁用'
      
      uni.showModal({
        title: '确认操作',
        content: `确定要${actionText}用户 ${user.name} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            await this.updateUserStatus(user._id, newStatus)
          }
        }
      })
    },
    
    // 更新用户状态
    async updateUserStatus(userId, status) {
      uni.showLoading({ title: '处理中...' })
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'updateUserStatus',
          data: { userId, status }
        })
        
        uni.hideLoading()
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '操作成功',
            icon: 'success'
          })
          this.loadUserList()
        } else {
          uni.showToast({
            title: res.result.message || '操作失败',
            icon: 'none'
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('更新状态失败:', err)
        uni.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    },
    
    // 删除用户
    deleteUser(user) {
      if (user.openid === this.currentUserOpenid) {
        uni.showToast({
          title: '不能删除自己的账号',
          icon: 'none'
        })
        return
      }
      
      uni.showModal({
        title: '确认删除',
        content: `确定要删除用户 ${user.name} 吗？\n此操作不可恢复！`,
        confirmColor: '#ff4d4f',
        success: async (res) => {
          if (res.confirm) {
            await this.confirmDeleteUser(user._id)
          }
        }
      })
    },
    
    // 确认删除用户
    async confirmDeleteUser(userId) {
      uni.showLoading({ title: '删除中...' })
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'deleteUser',
          data: { userId }
        })
        
        uni.hideLoading()
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '删除成功',
            icon: 'success'
          })
          this.loadUserList()
        } else {
          uni.showToast({
            title: res.result.message || '删除失败',
            icon: 'none'
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('删除用户失败:', err)
        uni.showToast({
          title: '删除失败',
          icon: 'none'
        })
      }
    },
    
    // 角色选择
    onRoleChange(e) {
      const index = e.detail.value
      this.form.role = this.roleOptions[index].value
      this.form.roleText = this.roleOptions[index].text
    },
    
    // 获取角色说明
    getRoleDescription(role) {
      const item = this.roleOptions.find(r => r.value === role)
      return item ? item.desc : ''
    },
    
    // 获取角色图标
    getRoleIcon(role) {
      const iconMap = {
        'admin': '👑',
        'project_manager': '👔',
        'doctor': '👨‍⚕️',
        'pharmacy': '💊',
        'viewer': '👁️'
      }
      return iconMap[role] || '👤'
    },
    
    // 获取角色简短说明
    getRoleDescriptionShort(role) {
      const descMap = {
        'admin': '系统管理员',
        'project_manager': '项目管理',
        'doctor': '医疗人员',
        'pharmacy': '药房管理',
        'viewer': '仅查看'
      }
      return descMap[role] || '未知角色'
    },
    
    // 关闭弹窗
    closeDialog() {
      this.showDialog = false
      this.editingUserId = null
      this.isEdit = false
      this.form = {
        openid: '',
        name: '',
        realName: '',
        nickname: '',
        phone: '',
        role: 'viewer',
        roleText: '查看者'
      }
    },
    
    // 提交表单
    async submitForm() {
      // 验证表单
      if (!this.form.wechatId || !this.form.name || !this.form.realName || !this.form.phone) {
        uni.showToast({
          title: '请填写完整信息（微信号、姓名、实名、手机号）',
          icon: 'none'
        })
        return
      }
      
      // 验证实名格式
      if (!/^[\u4e00-\u9fa5]{2,10}$/.test(this.form.realName)) {
        uni.showToast({
          title: '实名格式不正确，请输入2-10个中文字符',
          icon: 'none',
          duration: 2000
        })
        return
      }
      
      // 验证手机号
      if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
        uni.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        })
        return
      }
      
      if (this.isEdit) {
        await this.updateUser()
      } else {
        await this.addUser()
      }
    },
    
    // 添加用户
    async addUser() {
      uni.showLoading({ title: '添加中...' })
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'addUser',
          data: {
            // 新增用户时只需提供 wechatId，openid 将在首次登录时自动绑定
            wechatId: this.form.wechatId,
            name: this.form.name,
            realName: this.form.realName,
            nickname: this.form.nickname || this.form.name,
            phone: this.form.phone,
            role: this.form.role
          }
        })
        
        uni.hideLoading()
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          })
          this.editingUserId = null
          this.closeDialog()
          this.loadUserList()
        } else {
          uni.showToast({
            title: res.result.message || '添加失败',
            icon: 'none',
            duration: 2000
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('添加用户失败:', err)
        uni.showToast({
          title: '添加失败',
          icon: 'none'
        })
      }
    },
    
    // 更新用户
    async updateUser() {
      uni.showLoading({ title: '保存中...' })
      
      try {
        const res = await wx.cloud.callFunction({
          name: 'updateUser',
          data: {
            userId: this.form._id,
            name: this.form.name,
            realName: this.form.realName,
            nickname: this.form.nickname || this.form.name,
            phone: this.form.phone,
            role: this.form.role
          }
        })
        
        uni.hideLoading()
        
        if (res.result.code === 0) {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          })
          this.editingUserId = null
          this.closeDialog()
          this.loadUserList()
        } else {
          uni.showToast({
            title: res.result.message || '保存失败',
            icon: 'none'
          })
        }
      } catch (err) {
        uni.hideLoading()
        console.error('更新用户失败:', err)
        uni.showToast({
          title: '保存失败',
          icon: 'none'
        })
      }
    },
    
    // 格式化时间
    formatTime(dateStr) {
      if (!dateStr) return '未登录'
      
      const date = new Date(dateStr)
      const now = new Date()
      const diff = now - date
      
      // 1分钟内
      if (diff < 60000) {
        return '刚刚'
      }
      
      // 1小时内
      if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
      }
      
      // 今天
      if (date.toDateString() === now.toDateString()) {
        return date.toTimeString().substr(0, 5)
      }
      
      // 本年
      if (date.getFullYear() === now.getFullYear()) {
        return `${date.getMonth() + 1}-${date.getDate()}`
      }
      
      // 其他
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
  }
}
</script>

<style lang="scss" scoped>
.user-management {
  min-height: 100vh;
  background-color: #f5f6f8;
  padding-bottom: 30rpx;
}

/* 登录检查中 */
.checking-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6f8;
  
  .checking-content {
    text-align: center;
    
    .checking-text {
      font-size: 28rpx;
      color: #666;
    }
  }
}

/* 未授权提示 */
.unauthorized-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f6f8;
  padding: 40rpx;
  
  .unauthorized-content {
    background: white;
    border-radius: 20rpx;
    padding: 60rpx 40rpx;
    text-align: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
    max-width: 600rpx;
    width: 100%;
    
    .unauthorized-icon {
      font-size: 80rpx;
      display: block;
      margin-bottom: 30rpx;
    }
    
    .unauthorized-title {
      display: block;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 20rpx;
    }
    
    .unauthorized-text {
      display: block;
      font-size: 28rpx;
      color: #666;
      margin-bottom: 40rpx;
      line-height: 1.6;
    }
    
    .unauthorized-btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 24rpx 60rpx;
      border-radius: 50rpx;
      display: inline-block;
      box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.3);
      
      .btn-text {
        color: white;
        font-size: 28rpx;
        font-weight: 500;
      }
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 2rpx 8rpx rgba(102, 126, 234, 0.4);
      }
    }
  }

  .edit-form-footer {
    margin-top: 12rpx;
  }
}

// 顶部工具栏：改为白色圆角卡片，统一风格
.page-toolbar {
  margin: 20rpx 24rpx 10rpx;
  padding: 18rpx 22rpx;
  background: #ffffff;
  border-radius: 26rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10rpx 24rpx rgba(15, 23, 42, 0.08);

  .toolbar-role {
    font-size: 26rpx;
    color: #4b5563;
  }

  .btn-add {
    min-width: 180rpx;
    height: 60rpx;
    line-height: 60rpx;
    padding: 0 26rpx;
    background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
    color: #ffffff;
    border-radius: 999rpx;
    font-size: 26rpx;
    border: none;
    text-align: center;
  }
}

// 统计卡片
.stats-card {
  display: flex;
  margin: 20rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  
  .stat-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: #fff;
    
    &:not(:last-child) {
      border-right: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .stat-value {
      font-size: 48rpx;
      font-weight: bold;
      margin-bottom: 10rpx;
    }
    
    .stat-label {
      font-size: 24rpx;
      opacity: 0.8;
    }
  }
}

// 筛选栏
.filter-bar {
  display: flex;
  padding: 20rpx;
  background: #fff;
  margin: 20rpx;
  border-radius: 16rpx;
  
  .filter-item {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16rpx 24rpx;
    background: #f5f7fa;
    border-radius: 12rpx;
    font-size: 28rpx;
    color: #666;
    
    &:not(:last-child) {
      margin-right: 20rpx;
    }
    
    .arrow {
      font-size: 20rpx;
      color: #999;
    }
  }
}

// 用户列表
.user-list {
  padding: 0 20rpx;
}

.user-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  transition: all 0.3s;
  
  &.inactive {
    opacity: 0.6;
  }
  
  &.editing {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2rpx solid #667eea;
    box-shadow: 0 4rpx 16rpx rgba(102, 126, 234, 0.15);
  }
  
  .user-info {
    display: flex;
    margin-bottom: 20rpx;
    
    .user-avatar {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32rpx;
      font-weight: bold;
      margin-right: 20rpx;
      flex-shrink: 0;
    }
    
    .user-details {
      flex: 1;
      
      .user-name {
        display: flex;
        align-items: center;
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 12rpx;
        
        .role-tag {
          margin-left: 12rpx;
          padding: 4rpx 12rpx;
          border-radius: 8rpx;
          font-size: 22rpx;
          font-weight: normal;
          
          &.role-admin {
            background: #ffe7e7;
            color: #ff4d4f;
          }
          
          &.role-pharmacy {
            background: #e7f7ff;
            color: #1890ff;
          }
          
          &.role-viewer {
            background: #f0f0f0;
            color: #666;
          }
        }
      }
      
      .user-meta {
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
        
        .meta-item {
          margin-right: 30rpx;
        }
      }
    }
  }
  
  .user-actions {
    display: flex;
    border-top: 1px solid #f0f0f0;
    padding-top: 20rpx;
    
    .btn-action {
      flex: 1;
      padding: 16rpx;
      border-radius: 12rpx;
      font-size: 26rpx;
      border: none;
      
      &:not(:last-child) {
        margin-right: 16rpx;
      }
      
      &.btn-edit {
        background: #e7f7ff;
        color: #1890ff;
      }
      
      &.btn-toggle {
        background: #fff7e6;
        color: #fa8c16;
      }
      
      &.btn-delete {
        background: #fff1f0;
        color: #ff4d4f;
      }
      
      &:disabled {
        opacity: 0.4;
      }
    }
  }
}

// 空状态
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0; // 再向上收紧，使头像更靠上
  
  .empty-icon {
    font-size: 96rpx;      // 略微缩小头像
    margin-bottom: 8rpx;   // 头像和提示文字更紧凑
  }
  
  .empty-text {
    font-size: 28rpx;
    color: #999;
  }
}

// 旧弹窗样式（保留）
.dialog {
  width: 640rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.15);
  
  .dialog-header {
    padding: 32rpx 32rpx 24rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    .dialog-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #fff;
    }
  }
  
  .dialog-body {
    padding: 24rpx 32rpx;
    max-height: 65vh;
    overflow-y: auto;
    
    .form-item {
      margin-bottom: 24rpx;
      
      .form-label {
        display: block;
        font-size: 32rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 12rpx;
      }
      
      .form-input {
        width: 100%;
        padding: 24rpx 20rpx;
        background: #f8f9fa;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        font-size: 32rpx;
        color: #333;
        transition: all 0.3s;
        
        &:focus {
          background: #fff;
          border-color: #667eea;
        }
      }
      
      .form-picker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24rpx 20rpx;
        background: #f8f9fa;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        font-size: 32rpx;
        color: #333;
        font-weight: 500;
        
        .arrow {
          font-size: 24rpx;
          color: #667eea;
        }
      }
      
      .form-tip {
        display: block;
        font-size: 24rpx;
        color: #999;
        margin-top: 8rpx;
        padding-left: 4rpx;
      }
    }
    
    .role-description {
      padding: 20rpx 24rpx;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-left: 4rpx solid #667eea;
      border-radius: 12rpx;
      
      .desc-title {
        display: block;
        font-size: 28rpx;
        font-weight: 600;
        color: #667eea;
        margin-bottom: 8rpx;
      }
      
      .desc-content {
        font-size: 28rpx;
        color: #666;
        line-height: 1.6;
      }
    }
  }
  
  .dialog-footer {
    display: flex;
    padding: 24rpx 32rpx 32rpx;
    gap: 16rpx;
    
    button {
      flex: 1;
      padding: 28rpx;
      border-radius: 16rpx;
      font-size: 32rpx;
      font-weight: 600;
      border: none;
      transition: all 0.3s;
      
      &.btn-cancel {
        background: #f8f9fa;
        color: #666;
        border: 2rpx solid #e9ecef;
        
        &:active {
          background: #e9ecef;
        }
      }
      
      &.btn-confirm {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
}

// 原地编辑表单
.inline-edit-form {
  margin-top: 12rpx;
  border-top: 2rpx solid #e9ecef;
  background: #fafbfc;
  border-radius: 12rpx;
  padding: 16rpx;
  animation: slideDown 0.3s ease;
  
  .edit-form-header {
    margin-bottom: 12rpx;
    
    .edit-form-title {
      font-size: 32rpx;
      font-weight: bold;
      color: #667eea;
      display: flex;
      align-items: center;
      
      &::before {
        content: '✏️';
        margin-right: 8rpx;
      }
    }
  }
  
  .edit-form-body {
    .inline-form-item {
      margin-bottom: 14rpx;
      
      .inline-label {
        display: block;
        font-size: 26rpx;
        font-weight: 600;
        color: #333;
        margin-bottom: 10rpx;
      }
      
      .inline-input {
        width: 100%;
        padding: 16rpx 14rpx;
        background: #fff;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        font-size: 28rpx;
        color: #333;
        transition: all 0.3s;
        
        &:focus {
          border-color: #667eea;
          background: #fff;
        }
        
        &:disabled {
          background: #f5f5f5;
          color: #999;
        }
      }
      
      .inline-picker {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16rpx 14rpx;
        background: #fff;
        border: 2rpx solid #e9ecef;
        border-radius: 12rpx;
        font-size: 28rpx;
        color: #333;
        font-weight: 500;
        
        .picker-arrow {
          font-size: 22rpx;
          color: #667eea;
        }
      }
    }
    
    .role-desc-inline {
      display: flex;
      align-items: flex-start;
      padding: 16rpx 20rpx;
      background: linear-gradient(135deg, #fff7ed 0%, #ffe5cc 100%);
      border-left: 4rpx solid #ff9500;
      border-radius: 12rpx;
      margin-top: 12rpx;
      
      .desc-icon {
        font-size: 32rpx;
        margin-right: 12rpx;
        flex-shrink: 0;
      }
      
      .desc-text {
        font-size: 26rpx;
        color: #666;
        line-height: 1.6;
        flex: 1;
      }
    }
  }
  
  .edit-form-footer {
    display: flex;
    gap: 16rpx;
    margin-top: 24rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #e9ecef;
    
    .inline-btn {
      flex: 1;
      padding: 24rpx;
      border-radius: 14rpx;
      font-size: 30rpx;
      font-weight: 600;
      border: none;
      transition: all 0.3s;
      
      &.btn-cancel {
        background: #fff;
        color: #666;
        border: 2rpx solid #e9ecef;
        
        &:active {
          background: #f5f5f5;
        }
      }
      
      &.btn-save {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: #fff;
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.4);
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ============ 新版弹窗样式 ============
.dialog-new {
  width: 640rpx; 
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(15, 23, 42, 0.16);
  margin: -190rpx auto 40rpx; // 弹窗整体再上移一点
}

// 头部区域
.dialog-header-new {
  background: linear-gradient(135deg, #6d8bff 0%, #8e7bff 100%);
  padding: 32rpx 32rpx 24rpx;
  text-align: center;
  position: relative;
  
  .header-icon {
    width: 72rpx;
    height: 72rpx;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14rpx;
    backdrop-filter: blur(10rpx);
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    
    .icon-text {
      font-size: 40rpx;
    }
  }
  
  .dialog-title-new {
    display: block;
    font-size: 34rpx;
    font-weight: 700;
    color: #ffffff;
    margin-bottom: 6rpx;
    letter-spacing: 1rpx;
  }
  
  .dialog-subtitle {
    display: block;
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.82);
  }
}

// 表单区域
.dialog-body-new {
  padding: 32rpx 32rpx 24rpx;
  max-height: 60vh;
  overflow-y: auto;
}

// 表单行（用于并排）
.form-row {
  display: flex;
  gap: 20rpx;
  margin-bottom: 24rpx;
}

// 表单组
.form-group {
  margin-bottom: 24rpx;
  
  &.half {
    flex: 1;
    margin-bottom: 0;
  }
  
  .form-label-new {
    display: flex;
    align-items: center;
    margin-bottom: 12rpx;
    
    .label-text {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }
    
    .required {
      color: #ff4d4f;
      font-size: 32rpx;
      margin-left: 4rpx;
    }
  }
  
  .form-input-new {
    width: 100%;
    height: 88rpx;
    padding: 0 24rpx;
    background: #f8f9fa;
    border: 2rpx solid #e9ecef;
    border-radius: 16rpx;
    font-size: 32rpx;
    color: #333;
    transition: all 0.3s;
    
    &:focus {
      background: #ffffff;
      border-color: #667eea;
      box-shadow: 0 0 0 4rpx rgba(102, 126, 234, 0.1);
    }
    
    &:disabled {
      background: #f5f5f5;
      color: #999;
      border-color: #e0e0e0;
    }
  }
  
  .form-hint {
    display: block;
    font-size: 24rpx;
    color: #999;
    margin-top: 8rpx;
    padding-left: 4rpx;
  }
}

// 角色选择器
.role-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 120rpx;
  padding: 0 24rpx;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 2rpx solid #e9ecef;
  border-radius: 16rpx;
  transition: all 0.3s;
  
  &:active {
    background: #ffffff;
    border-color: #667eea;
  }
  
  .role-left {
    display: flex;
    align-items: center;
    gap: 20rpx;
    flex: 1;
  }
  
  .role-icon {
    font-size: 48rpx;
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 14rpx;
    flex-shrink: 0;
  }
  
  .role-info {
    flex: 1;
    
    .role-name {
      display: block;
      font-size: 32rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 6rpx;
    }
    
    .role-desc-short {
      display: block;
      font-size: 24rpx;
      color: #999;
    }
  }
  
  .select-arrow {
    font-size: 28rpx;
    color: #667eea;
    font-weight: bold;
    margin-left: 16rpx;
  }
}

// 底部按钮
.dialog-footer-new {
  display: flex;
  gap: 20rpx;
  padding: 24rpx 32rpx 36rpx;
  background: #fafbfc;
  
  .btn-new {
    flex: 1;
    height: 92rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 18rpx;
    font-size: 32rpx;
    font-weight: 600;
    border: none;
    transition: all 0.3s;
    gap: 8rpx;
    
    &.btn-cancel-new {
      background: #ffffff;
      color: #666;
      border: 3rpx solid #e9ecef;
      
      .btn-text-new {
        color: #666;
      }
      
      &:active {
        background: #f5f5f5;
        transform: scale(0.98);
      }
    }
    
    &.btn-confirm-new {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #ffffff;
      box-shadow: 0 6rpx 16rpx rgba(102, 126, 234, 0.4);
      
      .btn-icon-new {
        font-size: 36rpx;
        font-weight: bold;
      }
      
      .btn-text-new {
        color: #ffffff;
      }
      
      &:active {
        transform: scale(0.98);
        box-shadow: 0 4rpx 12rpx rgba(102, 126, 234, 0.5);
      }
    }
  }
}
</style>





























