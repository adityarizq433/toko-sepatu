require('dotenv').config();
const db = require('./config/db');
const ProductModel = require('./models/productModel');

const productsToSeed = [
  // NIKE
  {
    nama: "Nike Air Force 1 '07",
    brand: "Nike",
    kategori: "Sneakers",
    harga: 1549000,
    deskripsi: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
    gambar: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80"
  },
  {
    nama: "Nike Air Max 270",
    brand: "Nike",
    kategori: "Running",
    harga: 2389000,
    deskripsi: "Nike's first lifestyle Air Max brings you style, comfort and big attitude in the Nike Air Max 270.",
    gambar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80"
  },
  {
    nama: "Nike Dunk Low Retro",
    brand: "Nike",
    kategori: "Sneakers",
    harga: 1799000,
    deskripsi: "Created for the hardwood but taken to the streets, the '80s b-ball icon returns with perfectly shined overlays.",
    gambar: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80"
  },
  // ASICS
  {
    nama: "Asics Gel-Kayano 30",
    brand: "Asics",
    kategori: "Running",
    harga: 2599000,
    deskripsi: "The GEL-KAYANO 30 running shoe combines maximum support with ultimate comfort for complete peace of mind.",
    gambar: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
  },
  {
    nama: "Asics Japan S",
    brand: "Asics",
    kategori: "Sneakers",
    harga: 1199000,
    deskripsi: "The JAPAN S shoes are based on one of our throwback offerings from 1981. This reworked iteration is formed with a low-top silhouette.",
    gambar: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80"
  },
  // HOKA
  {
    nama: "Hoka Clifton 9",
    brand: "Hoka",
    kategori: "Running",
    harga: 2299000,
    deskripsi: "The ninth iteration of our award-winning Clifton franchise has launched, lighter and more cushioned than ever before.",
    gambar: "https://images.unsplash.com/photo-1628253747716-0c4f5c90fdda?w=800&q=80"
  },
  {
    nama: "Hoka Bondi 8",
    brand: "Hoka",
    kategori: "Running",
    harga: 2499000,
    deskripsi: "One of the hardest working shoes in the HOKA lineup, the Bondi takes a bold step forward this season.",
    gambar: "https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&q=80"
  },
  // PUMA
  {
    nama: "Puma Suede Classic",
    brand: "Puma",
    kategori: "Sneakers",
    harga: 1299000,
    deskripsi: "Definitely the most well-known and popular of all PUMA shoes, this design classic rightly deserves its place in public affection.",
    gambar: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80"
  },
  // SKECHERS
  {
    nama: "Skechers Go Walk 6",
    brand: "Skechers",
    kategori: "Running",
    harga: 1099000,
    deskripsi: "Get next-level comfort on your walks with the Skechers GO WALK 6 shoe.",
    gambar: "https://images.unsplash.com/photo-1514989940723-e8e51635b782?w=800&q=80"
  },
  // VANS
  {
    nama: "Vans Old Skool",
    brand: "Vans",
    kategori: "Sneakers",
    harga: 1150000,
    deskripsi: "The Old Skool was our first footwear design to showcase the famous Vans Sidestripe.",
    gambar: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80"
  },
  {
    nama: "Vans Classic Slip-On",
    brand: "Vans",
    kategori: "Slip-on",
    harga: 950000,
    deskripsi: "First introduced in 1977, the Vans #98—now known as the Classic Slip-On—instantly became an icon in Southern California.",
    gambar: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80"
  }
];

const sizes = [39, 40, 41, 42, 43, 44];

async function seed() {
  try {
    console.log('Waiting 2 seconds for Oracle connection pool...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('Starting seed process...');
    
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
        const stock = Math.floor(Math.random() * 20) + 5; // 5 to 24 stock
        await ProductModel.addSize(productId, size, stock);
      }
      console.log(`Successfully inserted ${prod.nama} with sizes.`);
    }

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

seed();
