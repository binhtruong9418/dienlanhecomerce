import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../node_modules/tinymce');
const destination = path.join(__dirname, '../dist/tinymce');

try {
    // Copy tinymce to dist folder
    fs.copySync(source, destination);
    console.log('✅ TinyMCE copied to dist/tinymce successfully!');
} catch (error) {
    console.error('❌ Error copying TinyMCE to dist:', error);
    process.exit(1);
}