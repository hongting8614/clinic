// 修复门诊登记表导出 [object Object] 问题
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cloudfunctions', 'reports', 'index.js');

console.log('正在读取文件...');
let content = fs.readFileSync(filePath, 'utf8');

console.log('正在修复 [object Object] 问题...');

// 查找并替换 excelRow.values 赋值部分
const oldPattern = `    excelRow.values = [
      row.index,
      row.dateTime,
      row.name,
      row.gender,
      row.age,
      row.identity,
      row.chiefComplaint,
      row.diagnosis,
      row.disposal,
      row.doctor,
      row.remark
    ]`;

const newPattern = `    excelRow.values = [
      String(row.index || ''),
      String(row.dateTime || ''),
      String(row.name || ''),
      String(row.gender || ''),
      String(row.age || ''),
      String(row.identity || ''),
      String(row.chiefComplaint || ''),
      String(row.diagnosis || ''),
      String(row.disposal || ''),
      String(row.doctor || ''),
      String(row.remark || '')
    ]`;

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  console.log('✓ 找到并修复了问题代码');
} else {
  console.log('⚠ 未找到目标代码，可能已经修复过了');
}

console.log('正在保存文件...');
fs.writeFileSync(filePath, content, 'utf8');

console.log('\n✓ 修复完成！');
console.log('\n修改内容：');
console.log('- 所有导出字段都强制转换为字符串');
console.log('- 避免出现 [object Object] 问题');
console.log('\n下一步：');
console.log('1. 在微信开发者工具中右键 cloudfunctions/reports');
console.log('2. 选择"上传并部署：云端安装依赖"');
console.log('3. 等待部署完成');
console.log('4. 重新导出Excel测试');


