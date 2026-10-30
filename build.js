const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Administrator/WorkBuddy/2026-10-28-11-51-44/supplier-system';
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'css/style.css'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'js/app.js'), 'utf8');

let out = html
  .replace('<link rel="stylesheet" href="css/style.css" />', '<style>\n' + css + '\n</style>')
  .replace('<script src="js/app.js"></script>', '<script>\n' + js + '\n</script>');

fs.writeFileSync(path.join(dir, 'standalone.html'), out, 'utf8');
console.log('standalone.html 已生成, 大小:', out.length, '字节');
