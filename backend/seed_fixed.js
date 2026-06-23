require('dotenv').config();
const db = require('./config/db');
const ProductModel = require('./models/productModel');

const productsToSeed = [
  {
    nama: "Nike Air Force 1 '07",
    brand: "Nike",
    kategori: "Sneakers",
    harga: 1549000,
    deskripsi: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
    gambar: "http://localhost:3000/uploads/nike_air_force_1.png"
  },
  {
    nama: "Asics Gel-Kayano 30",
    brand: "Asics",
    kategori: "Running",
    harga: 2599000,
    deskripsi: "The GEL-KAYANO 30 running shoe combines maximum support with ultimate comfort for complete peace of mind.",
    gambar: "http://localhost:3000/uploads/asics_gel_kayano.png"
  },
  {
    nama: "Hoka Clifton 9",
    brand: "Hoka",
    kategori: "Running",
    harga: 2299000,
    deskripsi: "The ninth iteration of our award-winning Clifton franchise has launched, lighter and more cushioned than ever before.",
    gambar: "http://localhost:3000/uploads/hoka_clifton.png"
  },
  {
    nama: "Puma Suede Classic",
    brand: "Puma",
    kategori: "Sneakers",
    harga: 1299000,
    deskripsi: "Definitely the most well-known and popular of all PUMA shoes, this design classic rightly deserves its place in public affection.",
    gambar: "http://localhost:3000/uploads/puma_suede.png"
  },
  {
    nama: "Vans Old Skool",
    brand: "Vans",
    kategori: "Sneakers",
    harga: 1150000,
    deskripsi: "The Old Skool was our first footwear design to showcase the famous Vans Sidestripe.",
    gambar: "http://localhost:3000/uploads/vans_old_skool.png"
  }
];

const sizes = [39, 40, 41, 42, 43, 44];

async function seed() {
  try {
    console.log('Waiting 2 seconds for Oracle connection pool...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Starting fixed seed process...');
    
    // Bersihkan produk lama agar tidak numpuk
    await db.query('DELETE FROM products');
    console.log('Semua produk lama berhasil dibersihkan.');
    
    for (const prod of productsToSeed) {
      console.log(`Inserting ${prod.nama}...`);
      const productId = await ProductModel.create({
        nama: prod.nama,
        brand: prod.brand,
        kategori: prod.kategori,
        harga: prod.harga,
        deskripsi: prod.deskripsi,
        gambar: prod.gambar
      });

      // Add random stock for sizes
      for (const size of sizes) {
        const stock = Math.floor(Math.random() * 20) + 5;
        await ProductModel.addSize(productId, size, stock);
      }
      console.log(`Successfully inserted ${prod.nama} with sizes.`);
    }

    console.log('Seed fixed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
