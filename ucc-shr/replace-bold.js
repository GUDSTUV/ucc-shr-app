const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.resolve(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let replaced = 0;
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('weight="bold"')) {
    fs.writeFileSync(f, content.replace(/weight="bold"/g, 'weight="semibold"'));
    replaced++;
  }
});
console.log('Replaced in ' + replaced + ' files');
