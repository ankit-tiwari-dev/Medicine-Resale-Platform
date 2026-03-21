import fs from 'fs';
const imagePath = 'C:\\Users\\olive\\.gemini\\antigravity\\brain\\9fdfbaf1-4af3-4fa4-b17c-e2da493ad7f4\\test_medicine_pack_1774044631847.png';
const outputPath = 'd:\\Medicine Resale Platform\\image_base64.txt';
const base64 = fs.readFileSync(imagePath).toString('base64');
fs.writeFileSync(outputPath, base64);
console.log('Base64 saved to ' + outputPath);
