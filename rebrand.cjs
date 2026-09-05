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
    ['Brite Clinic', 'Yasha Skin Clinic'],
    ['BRITE CLINIC', 'YASHA SKIN CLINIC'],
    ['Brite', 'Yasha'],
    ['BRITE', 'YASHA'],
    ['briteclinic', 'yashaclinic'],
    ['brite', 'yasha'],
    ['Dr. Naveen Keshwani', 'Dr. Yasha Upendra'],
    ["Dr. Naveen Keshwani's", "Dr. Yasha Upendra's"],
    ['Dr. Keshwani', 'Dr. Upendra'],
    ["Dr. Keshwani's", "Dr. Upendra's"],
    ['Naveen Keshwani', 'Yasha Upendra'],
    ['Keshwani', 'Upendra'],
    ['Naveen', 'Yasha']
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
