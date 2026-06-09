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

const newButtonContainer = `      <div class="flex items-center gap-0.5">
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="$emit('minimize')"
        >
          <div class="w-2.5 h-0.5 bg-white mb-1"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-blue-300 to-blue-500 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm"
          @click.stop="toggleMaximize"
        >
          <div class="w-2.5 h-2.5 border-2 border-white"></div>
        </button>
        <button
          class="w-5 h-5 flex items-center justify-center bg-gradient-to-b from-red-400 to-red-600 border border-white/40 hover:brightness-110 active:brightness-90 rounded-sm ml-0.5"
          @click.stop="$emit('close')"
        >
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>`;

const newHeaderClasses = 'h-7 bg-gradient-to-b from-[#0058e6] via-[#3a93ff] to-[#0058e6] flex items-center justify-between px-2 cursor-pointer border-b border-[#00138c] select-none cursor-move';

let changed = [];

for (const file of files) {
  if (file.includes('MessengerWindow') || file.includes('XpDesktop') || file.includes('StartMenu')) continue;
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace title bar classes
  content = content.replace(/class="[^"]*justify-between[^"]*cursor-move[^"]*"/g, `class="${newHeaderClasses}"`);
  
  // Update spans inside the titlebar to use the messenger font/shadow style
  content = content.replace(/class="flex items-center gap-2 text-xs md:text-sm"/g, `class="flex items-center gap-2 text-xs md:text-sm text-white font-bold drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]"`);
  
  content = content.replace(/class="text-xs md:text-sm font-semibold"/g, `class="text-xs md:text-sm font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]"`);
  content = content.replace(/<span class="font-semibold text-xs md:text-sm/g, `<span class="font-bold text-xs md:text-sm text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]`);
  content = content.replace(/<span class="font-semibold">/g, `<span class="font-bold text-white drop-shadow-[1px_1px_1px_rgba(0,0,0,0.5)]">`);
  
  // TerminalHero title style: class="font-semibold" => replaced above, but let's be careful
  
  // Replace Buttons container
  const buttonGroupRegex = /<div class="flex items-center gap-\[2px\]">[\s\S]*?<!-- Close -->[\s\S]*?<\/button>\s*<\/div>/;
  if (buttonGroupRegex.test(content)) {
    content = content.replace(buttonGroupRegex, newButtonContainer);
  } else {
    // some files might not have <!-- Close -->, MyDocsExplorer for example:
    const buttonGroupRegexAlt = /<div class="flex items-center gap-\[2px\]">[\s\S]*?<!-- Botón cerrar -->[\s\S]*?<\/button>\s*<\/div>/;
    if (buttonGroupRegexAlt.test(content)) {
      content = content.replace(buttonGroupRegexAlt, newButtonContainer);
    } else {
       // A more general regex: from `<div class="flex items-center gap-[2px]">` to the NEXT `</div>` that balances it
       // Since the button group has exactly 3 buttons closing and the div closing, we can match:
       const generalRegex = /<div class="flex items-center gap-\[2px\]">([\s\S]*?)<\/button>\s*<\/div>/;
       if (generalRegex.test(content)) {
         content = content.replace(generalRegex, newButtonContainer);
       }
    }
  }
  
  if (content !== original) {
    changed.push(file);
    fs.writeFileSync(file, content);
  }
}

console.log('Changed files:', changed);
