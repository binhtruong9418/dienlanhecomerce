import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const source = path.join(__dirname, '../node_modules/tinymce');
const destination = path.join(__dirname, '../public/tinymce');

try {
    // Remove existing tinymce folder if it exists
    if (fs.existsSync(destination)) {
        fs.removeSync(destination);
        console.log('Removed existing TinyMCE folder');
    }

    // Copy tinymce to public folder
    fs.copySync(source, destination);
    console.log('✅ TinyMCE copied to public/tinymce successfully!');
} catch (error) {
    console.error('❌ Error copying TinyMCE:', error);
    process.exit(1);
}