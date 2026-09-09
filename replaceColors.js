import fs from 'fs';
import path from 'path';

const dir = 'src/app/components';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
  { regex: /bg-\[\#0b192c\]/g, replacement: 'bg-brand-blue' },
  { regex: /text-\[\#0b192c\]/g, replacement: 'text-brand-blue' },
  { regex: /border-\[\#0b192c\]/g, replacement: 'border-brand-blue' },
  { regex: /text-blue-900/g, replacement: 'text-brand-blue' },
  { regex: /bg-blue-950/g, replacement: 'bg-brand-blue-hover' },
  { regex: /text-blue-600/g, replacement: 'text-brand-red' },
  { regex: /bg-blue-600/g, replacement: 'bg-brand-red' },
  { regex: /border-blue-600/g, replacement: 'border-brand-red' },
  { regex: /bg-blue-50/g, replacement: 'bg-brand-red/10' },
  { regex: /bg-green-500/g, replacement: 'bg-brand-red' },
  { regex: /bg-green-400/g, replacement: 'bg-brand-red/75' },
  { regex: /text-blue-200/g, replacement: 'text-brand-red/20' }
];

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  for (const { regex, replacement } of replacements) {
    content = content.replace(regex, replacement);
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
  }
}
