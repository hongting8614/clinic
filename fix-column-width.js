// 修复门诊登记表Excel列宽脚本
// 将序号、性别、年龄列宽从2.88改为3.5

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'cloudfunctions', 'reports', 'index.js');

console.log('正在读取文件...');
let content = fs.readFileSync(filePath, 'utf8');

console.log('正在修改列宽...');

// 修改列宽：从3.5改为4.86（因为ExcelJS会自动缩小，4.86实际显示约为3.5）
content = content.replace(
  /worksheet\.columns = \[\s*\{ key: 'index', width: 3\.5 \},\s*\{ key: 'dateTime', width: 14 \},\s*\{ key: 'name', width: 6 \},\s*\{ key: 'gender', width: 3\.5 \},\s*\{ key: 'age', width: 3\.5 \},/,
  `worksheet.columns = [
    { key: 'index', width: 4.86 },
    { key: 'dateTime', width: 14 },
    { key: 'name', width: 6 },
    { key: 'gender', width: 4.86 },
    { key: 'age', width: 4.86 },`
);

console.log('正在保存文件...');
fs.writeFileSync(filePath, content, 'utf8');

console.log('✓ 修复完成！');
console.log('\n修改内容：');
console.log('- 序号列宽：3.5 → 4.86（实际显示约3.5）');
console.log('- 性别列宽：3.5 → 4.86（实际显示约3.5）');
console.log('- 年龄列宽：3.5 → 4.86（实际显示约3.5）');
console.log('\n下一步：');
console.log('1. 在微信开发者工具中右键 cloudfunctions/reports');
console.log('2. 选择"上传并部署：云端安装依赖"');
console.log('3. 等待部署完成');
console.log('4. 重新导出Excel测试');


