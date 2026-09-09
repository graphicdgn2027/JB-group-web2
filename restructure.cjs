const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const appDir = path.join(srcDir, 'app');
const appComponentsDir = path.join(appDir, 'components');
const importsDir = path.join(srcDir, 'imports');

const pagesDir = path.join(srcDir, 'pages');
const componentsDir = path.join(srcDir, 'components');
const assetsDir = path.join(srcDir, 'assets');

// Create new directories
[pagesDir, componentsDir, assetsDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper to move files
function moveDirContents(src, dest) {
  if (!fs.existsSync(src)) return;
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    if (fs.statSync(srcPath).isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      moveDirContents(srcPath, destPath);
    } else {
      fs.renameSync(srcPath, destPath);
    }
  }
}

// 1. Move components
moveDirContents(appComponentsDir, componentsDir);

// 2. Move pages
if (fs.existsSync(appDir)) {
  const appItems = fs.readdirSync(appDir);
  for (const item of appItems) {
    if (item !== 'components') {
      const srcPath = path.join(appDir, item);
      let targetName = item === 'App.tsx' ? 'HomePage.tsx' : item;
      fs.renameSync(srcPath, path.join(pagesDir, targetName));
    }
  }
}

// 3. Move assets
moveDirContents(importsDir, assetsDir);

// 4. Update imports
function updateImports(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      updateImports(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      if (fullPath.includes('pages')) {
        content = content.replace(/'\.\/components\//g, "'../components/");
        content = content.replace(/"\.\/components\//g, '"../components/');
      }
      
      if (item === 'main.tsx') {
        content = content.replace(/\/app\//g, '/pages/');
        content = content.replace(/App\.tsx/g, 'HomePage.tsx');
        content = content.replace(/import App from/g, 'import HomePage from');
        content = content.replace(/<App \/>/g, '<HomePage />');
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
}

updateImports(srcDir);

// Clean up old dirs
if (fs.existsSync(appComponentsDir)) fs.rmSync(appComponentsDir, { recursive: true, force: true });
if (fs.existsSync(appDir)) fs.rmSync(appDir, { recursive: true, force: true });
if (fs.existsSync(importsDir)) fs.rmSync(importsDir, { recursive: true, force: true });

console.log("Restructuring complete!");
