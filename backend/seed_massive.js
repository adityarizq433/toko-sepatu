require('dotenv').config();
const db = require('./config/db');
const ProductModel = require('./models/productModel');

const brandsData = {
  "Nike": [
    { nama: "Nike Air Force 1 Low", kategori: "Sneakers", harga: 1549000 },
    { nama: "Nike Air Max 90", kategori: "Sneakers", harga: 1799000 },
    { nama: "Nike Dunk Low Retro", kategori: "Sneakers", harga: 1699000 },
    { nama: "Nike Blazer Mid '77", kategori: "Sneakers", harga: 1499000 },
    { nama: "Nike ZoomX Vaporfly", kategori: "Running", harga: 3299000 },
    { nama: "Nike Air Zoom Pegasus 40", kategori: "Running", harga: 1999000 },
    { nama: "Nike Air Jordan 1 High", kategori: "Sneakers", harga: 2499000 },
    { nama: "Nike React Infinity Run", kategori: "Running", harga: 2399000 },
    { nama: "Nike Cortez Basic", kategori: "Sneakers", harga: 1199000 },
    { nama: "Nike Air Max 270", kategori: "Sneakers", harga: 2389000 }
  ],
  "Asics": [
    { nama: "Asics Gel-Kayano 30", kategori: "Running", harga: 2599000 },
    { nama: "Asics Gel-Nimbus 26", kategori: "Running", harga: 2499000 },
    { nama: "Asics Novablast 4", kategori: "Running", harga: 2199000 },
    { nama: "Asics GT-2000 12", kategori: "Running", harga: 1999000 },
    { nama: "Asics Japan S", kategori: "Sneakers", harga: 1199000 },
    { nama: "Asics Gel-Lyte III", kategori: "Sneakers", harga: 1599000 },
    { nama: "Asics Magic Speed 3", kategori: "Running", harga: 2399000 },
    { nama: "Asics Superblast", kategori: "Running", harga: 3099000 },
    { nama: "Asics Gel-Cumulus 25", kategori: "Running", harga: 1899000 },
    { nama: "Asics EX89", kategori: "Sneakers", harga: 1699000 }
  ],
  "Hoka": [
    { nama: "Hoka Clifton 9", kategori: "Running", harga: 2299000 },
    { nama: "Hoka Bondi 8", kategori: "Running", harga: 2499000 },
    { nama: "Hoka Mach 6", kategori: "Running", harga: 2399000 },
    { nama: "Hoka Speedgoat 5", kategori: "Running", harga: 2599000 },
    { nama: "Hoka Arahi 7", kategori: "Running", harga: 2199000 },
    { nama: "Hoka Challenger 7", kategori: "Running", harga: 2299000 },
    { nama: "Hoka Gaviota 5", kategori: "Running", harga: 2699000 },
    { nama: "Hoka Rincon 3", kategori: "Running", harga: 1899000 },
    { nama: "Hoka Transport", kategori: "Sneakers", harga: 2199000 },
    { nama: "Hoka Rocket X 2", kategori: "Running", harga: 3499000 }
  ],
  "Puma": [
    { nama: "Puma Suede Classic", kategori: "Sneakers", harga: 1299000 },
    { nama: "Puma RS-X3", kategori: "Sneakers", harga: 1799000 },
    { nama: "Puma Cali", kategori: "Sneakers", harga: 1399000 },
    { nama: "Puma MB.02", kategori: "Sneakers", harga: 2299000 },
    { nama: "Puma Velocity Nitro 3", kategori: "Running", harga: 1999000 },
    { nama: "Puma Mayze Platform", kategori: "Sneakers", harga: 1599000 },
    { nama: "Puma Slipstream", kategori: "Sneakers", harga: 1699000 },
    { nama: "Puma Deviate Nitro 2", kategori: "Running", harga: 2499000 },
    { nama: "Puma Future Rider", kategori: "Sneakers", harga: 1399000 },
    { nama: "Puma Palermo", kategori: "Sneakers", harga: 1499000 }
  ],
  "Vans": [
    { nama: "Vans Old Skool", kategori: "Sneakers", harga: 1150000 },
    { nama: "Vans Classic Slip-On", kategori: "Sneakers", harga: 950000 },
    { nama: "Vans Sk8-Hi", kategori: "Sneakers", harga: 1299000 },
    { nama: "Vans Authentic", kategori: "Sneakers", harga: 999000 },
    { nama: "Vans Era", kategori: "Sneakers", harga: 999000 },
    { nama: "Vans Half Cab", kategori: "Sneakers", harga: 1399000 },
    { nama: "Vans Knu Skool", kategori: "Sneakers", harga: 1250000 },
    { nama: "Vans UltraRange Neo VR3", kategori: "Sneakers", harga: 1899000 },
    { nama: "Vans Skate Old Skool", kategori: "Sneakers", harga: 1299000 },
    { nama: "Vans Slip-On TRK", kategori: "Sneakers", harga: 899000 }
  ]
};

const sizes = [39, 40, 41, 42, 43, 44];

async function fetchImage(query, brand) {
  try {
    let url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`;
    let res = await fetch(url);
    let data = await res.json();
    if (data.results && data.results.length > 0) return data.results[0].urls.regular;

    url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(brand + ' sneaker')}&per_page=1`;
    res = await fetch(url);
    data = await res.json();
    if (data.results && data.results.length > 0) return data.results[0].urls.regular;

    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'; // fallback
  } catch (e) {
    return 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';
  }
}

async function seed() {
  try {
    console.log('Waiting 2 seconds for DB pool...');
    await new Promise(r => setTimeout(r, 2000));
    console.log('Clearing old products...');
    await db.query('DELETE FROM products');

    for (const [brand, products] of Object.entries(brandsData)) {
      console.log(`Seeding brand: ${brand}`);
      for (const prod of products) {
        console.log(`Fetching image for ${prod.nama}...`);
        const imageUrl = await fetchImage(prod.nama, brand);

        const productId = await ProductModel.create({
          nama: prod.nama,
          brand: brand,
          kategori: prod.kategori,
          harga: prod.harga,
          deskripsi: `Koleksi resmi dari ${brand}. Sepatu ${prod.nama} memberikan kenyamanan maksimal dan desain premium yang sangat cocok untuk gaya Anda.`,
          gambar: imageUrl
        });

        for (const size of sizes) {
          const stock = Math.floor(Math.random() * 20) + 5;
          await ProductModel.addSize(productId, size, stock);
        }
      }
    }
    console.log('Massive seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error during massive seed:', error);
    process.exit(1);
  }
}

seed();
