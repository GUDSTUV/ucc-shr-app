const fs = require('fs')
const path = require('path')

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8')
  if (content.includes('requireSuperAdmin')) {
    content = content.replace(/requireSuperAdmin/g, 'requireAdmin')
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
