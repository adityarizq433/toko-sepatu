const db = require('./config/db');

async function migrateShipping() {
  try {
    console.log('Menjalankan migrasi shipping (ongkir & kurir)...');
    
    // Check and add 'ongkir' column
    try {
      await db.query(`ALTER TABLE orders ADD COLUMN ongkir DECIMAL(12,2) DEFAULT 0`);
      console.log('Kolom ongkir berhasil ditambahkan.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME' || e.message.includes('Duplicate column name')) {
        console.log('Kolom ongkir sudah ada.');
      } else {
        console.error('Gagal menambahkan kolom ongkir:', e.message);
      }
    }

    // Check and add 'kurir' column
    try {
      await db.query(`ALTER TABLE orders ADD COLUMN kurir VARCHAR(50) DEFAULT 'Tidak ada'`);
      console.log('Kolom kurir berhasil ditambahkan.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME' || e.message.includes('Duplicate column name')) {
        console.log('Kolom kurir sudah ada.');
      } else {
        console.error('Gagal menambahkan kolom kurir:', e.message);
      }
    }

    // Check and add 'resi' column (optional for future)
    try {
      await db.query(`ALTER TABLE orders ADD COLUMN resi VARCHAR(100)`);
      console.log('Kolom resi berhasil ditambahkan.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME' || e.message.includes('Duplicate column name')) {
        console.log('Kolom resi sudah ada.');
      } else {
        console.error('Gagal menambahkan kolom resi:', e.message);
      }
    }
    
    console.log('Migrasi shipping selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Error saat migrasi shipping:', error);
    process.exit(1);
  }
}

migrateShipping();
