require('dotenv').config();
const db = require('./config/db');

async function applyFallback() {
  await new Promise(r => setTimeout(r, 2000));
  try {
    const fallbackImage = 'http://localhost:3000/uploads/nike_air_force_1.png';
    const [result] = await db.query(
      "UPDATE products SET gambar = :gambar WHERE gambar LIKE '%unsplash%' OR gambar IS NULL",
      { gambar: fallbackImage }
    );
    console.log(`Successfully updated rows to fallback image.`);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
applyFallback();
