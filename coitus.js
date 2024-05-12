const fs = require('fs');

// Чтение содержимого файла
const readFileSync = (filePath) => {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
};

// Запись содержимого в файл
const writeFileSync = (filePath, content) => {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File ${filePath} has been written successfully.`);
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
  }
};

// Чтение содержимого файлов JavaScript и CSS
const mp3Const = readFileSync('./pizda/stringsong.ts');
const lyricsConst = readFileSync('./pizda/awesome.ts');
const jsContent = readFileSync('./pizda/with.js');
const cssContent = readFileSync('./pizda/woman.css');

// Чтение исходного HTML шаблона
let htmlContent = readFileSync('./pizda/sex.html');

// Вставка содержимого JavaScript и CSS в HTML
htmlContent = htmlContent.replace('</head>', `<script>${mp3Const}</script><script>${lyricsConst}</script><script>${jsContent}</script></head>`);
htmlContent = htmlContent.replace('</body>', `<style>${cssContent}</style></body>`);

// Запись итогового HTML файла
writeFileSync('./vagina/sexy.html', htmlContent);
