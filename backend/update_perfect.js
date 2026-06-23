require('dotenv').config();
const db = require('./config/db');
const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\40dce807-da34-44e7-b36e-bc32ebaf01af';
const uploadsDir = 'C:\\kuliah\\toko-sepatu\\backend\\uploads';

const imagesToUpdate = [
  { name: "Nike Air Force 1 Low", file: "nike_af1_low_1782188335254.png" },
  { name: "Nike Air Max 90", file: "nike_am90_1782188345654.png" },
  { name: "Nike Dunk Low Retro", file: "nike_dunk_low_1782188356065.png" },
  { name: "Nike Blazer Mid '77", file: "nike_blazer_mid_1782188368729.png" },
  { name: "Puma Palermo", file: "test_1_1782188018403.png" },
  { name: "Puma Future Rider", file: "test_2_1782188029290.png" },
  { name: "Puma Deviate Nitro 2", file: "test_3_1782188039452.png" },
  { name: "Puma Slipstream", file: "test_4_1782188049647.png" },
  { name: "Puma Mayze Platform", file: "test_5_1782188060603.png" }
];

async function updatePerfectImages() {
  await new Promise(r => setTimeout(r, 2000));
  try {
    for (const item of imagesToUpdate) {
      const srcPath = path.join(brainDir, item.file);
      const destName = Date.now() + '_' + item.file;
      const destPath = path.join(uploadsDir, destName);
      
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        const imageUrl = `http://localhost:3000/uploads/${destName}`;
        
        await db.query("UPDATE products SET gambar = :gambar WHERE nama = :nama", { gambar: imageUrl, nama: item.name });
        console.log(`Successfully updated ${item.name} with perfect isolated image!`);
      } else {
        console.log(`Image not found: ${srcPath}`);
      }
    }
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
updatePerfectImages();
