const fs = require('fs')
const path = require('path')

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  let changed = false

  if (content.includes('REVIEWING')) {
    content = content.replace(/REVIEWING/g, 'UNDER_REVIEW')
    changed = true
  }
  if (content.includes('REFERRED')) {
    content = content.replace(/REFERRED/g, 'UNDER_INVESTIGATION') // Assuming REFERRED -> UNDER_INVESTIGATION based on new workflow
    changed = true
  }
  if (content.includes('RESOLVED')) {
    content = content.replace(/RESOLVED/g, 'CLOSED') // RESOLVED and CLOSED are both just CLOSED now
    changed = true
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8')
    console.log(`Updated ${filePath}`)
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      walkDir(fullPath)
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      replaceInFile(fullPath)
    }
  }
}

walkDir(path.join(__dirname, 'src'))
