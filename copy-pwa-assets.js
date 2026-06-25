import fs from 'fs';
import path from 'path';

const srcImagesDir = path.join(process.cwd(), 'src', 'assets', 'images');
const publicImagesDir = path.join(process.cwd(), 'public', 'src', 'assets', 'images');

// Ensure public directory exists
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
}

try {
  if (fs.existsSync(srcImagesDir)) {
    const files = fs.readdirSync(srcImagesDir);
    for (const file of files) {
      const srcFile = path.join(srcImagesDir, file);
      const destFile = path.join(publicImagesDir, file);
      if (fs.statSync(srcFile).isFile()) {
        fs.copyFileSync(srcFile, destFile);
      }
    }
    console.log(`Successfully copied ${files.length} images to ${publicImagesDir}`);
  }

  // Also copy PWA icon to root public/icon.jpg
  const srcPwaIcon = path.join(srcImagesDir, 'ain_tebournok_pwa_icon_1782296799339.jpg');
  const destRootIcon = path.join(process.cwd(), 'public', 'icon.jpg');
  if (fs.existsSync(srcPwaIcon)) {
    fs.copyFileSync(srcPwaIcon, destRootIcon);
    console.log(`Successfully copied PWA icon to ${destRootIcon}`);
  }
} catch (err) {
  console.error('Error copying assets:', err);
}

