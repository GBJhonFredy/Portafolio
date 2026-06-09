const fs = require('fs');
const path = require('path');

function getFiles(dir, filesList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getFiles(filePath, filesList);
    } else if (filePath.endsWith('.vue')) {
      filesList.push(filePath);
    }
  }
  return filesList;
}

const files = getFiles(path.join(__dirname, 'app/src/components'));
let changed = [];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Remover la clase mb-1 del div que representa la linea de minimizar
  content = content.replace(/class="w-2\.5 h-0\.5 bg-white mb-1"/g, 'class="w-2.5 h-0.5 bg-white"');
  
  if (content !== original) {
    changed.push(file);
    fs.writeFileSync(file, content);
  }
}

console.log('Fixed minimize buttons in files:', changed);
