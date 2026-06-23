require('dotenv').config();
const db = require('./config/db');

const vansImages = [
  'https://images.unsplash.com/photo-1619646176605-b7417fb53b1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Mnx8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1589312866743-e043e4a6e2b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8M3x8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1626379530580-6a58c5cf1d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NHx8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1705887351211-5608f389ed06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8NXx8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1560858001-2a568c6ea1d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8Nnx8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1670181830393-877c92daa0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8N3x8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1618225747659-433d5a5c6af7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8OHx8dmFucyUyMHNob2VzfGVufDB8fHx8MTc4MjE4NzE3M3ww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1612194228259-d240452a64b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTB8fHZhbnMlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODcxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1670181830401-1bde633ce4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTF8fHZhbnMlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODcxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1621930997123-12b382615241?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MTR8fHZhbnMlMjBzaG9lc3xlbnwwfHx8fDE3ODIxODcxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080'
];

async function fixVans() {
  await new Promise(r => setTimeout(r, 2000));
  try {
    const [rows] = await db.query("SELECT id, nama FROM products WHERE brand = 'Vans'");
    for (let i = 0; i < rows.length; i++) {
      const prod = rows[i];
      const imageUrl = vansImages[i % vansImages.length];
      await db.query("UPDATE products SET gambar = :gambar WHERE id = :id", { gambar: imageUrl, id: prod.id });
      console.log(`Updated ${prod.nama} with distinct image.`);
    }
    console.log("Fixed Vans images successfully!");
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
fixVans();
