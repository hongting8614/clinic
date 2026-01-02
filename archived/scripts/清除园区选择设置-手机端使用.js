/**
 * 清除园区选择设置 - 在手机小程序控制台执行
 * 
 * 使用方法：
 * 1. 在微信开发者工具中打开"真机调试"
 * 2. 在手机小程序中打开控制台（如果支持）
 * 3. 或者：在微信开发者工具的控制台中执行（会同步到手机）
 * 4. 复制下面的代码执行
 */

(function() {
  console.log('=== 清除园区选择设置 ===');
  
  // 清除相关存储
  try {
    uni.removeStorageSync('clinic_location_tip_closed');
    uni.removeStorageSync('clinic_last_location');
    
    console.log('✅ 已清除以下存储：');
    console.log('  - clinic_location_tip_closed');
    console.log('  - clinic_last_location');
    
    // 验证清除结果
    const tipClosed = uni.getStorageSync('clinic_location_tip_closed');
    const lastLocation = uni.getStorageSync('clinic_last_location');
    
    console.log('\n验证结果：');
    console.log('  - tipClosed:', tipClosed === undefined ? '✅ 已清除' : '❌ 仍有值: ' + tipClosed);
    console.log('  - lastLocation:', lastLocation === undefined ? '✅ 已清除' : '❌ 仍有值: ' + lastLocation);
    
    console.log('\n📱 下一步操作：');
    console.log('1. 关闭小程序');
    console.log('2. 重新打开小程序');
    console.log('3. 进入"门诊登记"页面');
    console.log('4. 应该会显示园区选择弹窗');
    
  } catch (err) {
    console.error('❌ 清除失败:', err);
  }
})();


