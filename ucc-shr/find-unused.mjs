import fs from 'fs';
import path from 'path';

const srcPath = 'e:/CEGRAD-UCC/ucc-shr/src';

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];
  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });
  return arrayOfFiles;
}

const allFiles = getAllFiles(srcPath);
const componentFiles = allFiles.filter(f => f.includes('\\components\\') && !f.endsWith('index.ts') && !f.endsWith('.d.ts'));

const unused = [];

for (const compFile of componentFiles) {
  const content = fs.readFileSync(compFile, 'utf8');
  // Match `export function Name` or `export const Name`
  const match = content.match(/export (?:function|const|class) ([A-Za-z0-9_]+)/);
  if (!match) continue;
  const compName = match[1];
  
  let isUsed = false;
  for (const file of allFiles) {
    if (file === compFile) continue;
    // Skip index.ts in the same folder
    if (file.endsWith('index.ts') && path.dirname(file) === path.dirname(compFile)) continue;
    
    const fileContent = fs.readFileSync(file, 'utf8');
    const regex = new RegExp(`\\b${compName}\\b`);
    if (regex.test(fileContent)) {
      isUsed = true;
      break;
    }
  }
  
  if (!isUsed) {
    unused.push({ file: compFile, component: compName });
  }
}

console.log(JSON.stringify(unused, null, 2));
