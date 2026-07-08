const fs = require('fs');
const { execSync } = require('child_process');

const diff = execSync('git diff').toString();
const files = diff.split('\ndiff --git a/');
files.shift();

files.forEach(f => {
  const lines = f.split('\n');
  const filenameStr = lines[0].split(' b/')[1];
  if (!filenameStr) return;
  // Remove the `ucc-shr/` prefix if present
  let filename = filenameStr.trim();
  if (filename.startsWith('ucc-shr/')) {
    filename = filename.replace('ucc-shr/', '');
  }
  
  try {
    let content = fs.readFileSync(filename, 'utf8');
    let changed = false;
    
    for (let i = 0; i < lines.length; i++) {
      if (
        lines[i].startsWith('-') && 
        lines[i].includes('<Text') && 
        lines[i].includes('weight="bold"') && 
        lines[i+1] && 
        lines[i+1].startsWith('+') && 
        lines[i+1].includes('weight="semibold"')
      ) {
        const addedLine = lines[i+1].substring(1);
        const removedLine = lines[i].substring(1);
        content = content.replace(addedLine, removedLine);
        changed = true;
      }
    }
    
    if (changed) {
      fs.writeFileSync(filename, content);
      console.log('Fixed ' + filename);
    }
  } catch (err) {
    console.error('Error on ' + filename, err);
  }
});
