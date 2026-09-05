const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'photos') {
        walkDir(dirPath, callback);
      }
    } else {
      if (dirPath.endsWith('.ts') || dirPath.endsWith('.tsx') || dirPath.endsWith('.html')) {
        callback(dirPath);
      }
    }
  });
}

function rebrand(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const replacements = [
    ['Yasha Skin Clinic', 'DR METHI ENT CARE AND SKIN TALKS'],
    ['YASHA SKIN CLINIC', 'DR METHI ENT CARE AND SKIN TALKS'],
    ['yashaclinic', 'methiclinic'],
    ['Dr. Yasha Upendra', 'Dr. Vanita Methi'],
    ["Dr. Yasha Upendra's", "Dr. Vanita Methi's"],
    ['Dr. Upendra', 'Dr. Methi'],
    ["Dr. Upendra's", "Dr. Methi's"],
    ['Yasha Upendra', 'Vanita Methi'],
    ['Upendra', 'Methi'],
    ['Yasha', 'Methi'],
    ['YASHA', 'METHI'],
    ['yasha', 'methi']
  ];

  let original = content;
  for (const [search, replace] of replacements) {
    content = content.split(search).join(replace);
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

walkDir(__dirname, rebrand);
