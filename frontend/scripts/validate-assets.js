import { existsSync } from 'fs';
import { join } from 'path';

const requiredAssets = [
  'public/vite.svg',
  'src/index.css',
  'src/App.css',
  'index.html'
];

console.log('🔍 Validating required assets...');

let allValid = true;

requiredAssets.forEach(asset => {
  if (existsSync(asset)) {
    console.log(`✅ ${asset}`);
  } else {
    console.log(`❌ Missing: ${asset}`);
    allValid = false;
  }
});

if (allValid) {
  console.log('✅ All assets validated successfully!');
  process.exit(0);
} else {
  console.log('❌ Asset validation failed!');
  process.exit(1);
}
