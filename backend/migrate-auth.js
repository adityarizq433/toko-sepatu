const db = require('./config/db');

async function migrate() {
  try {
    console.log('Menjalankan migrasi autentikasi...');
    
    // Add columns to users table
    const alterQuery = `
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS is_verified TINYINT(1) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS otp_code VARCHAR(10),
      ADD COLUMN IF NOT EXISTS otp_expires TIMESTAMP,
      ADD COLUMN IF NOT EXISTS google_id VARCHAR(255)
    `;
    
    // In MySQL, "ADD COLUMN IF NOT EXISTS" is available in 8.0.16+. 
    // If it fails, it might be an older version or already exists.
    // Let's do it safely by querying information_schema first or just try-catch.
    
    // Safe approach for MySQL < 8.0.16
    const columns = [
      { name: 'is_verified', def: 'TINYINT(1) DEFAULT 0' },
      { name: 'otp_code', def: 'VARCHAR(10)' },
      { name: 'otp_expires', def: 'TIMESTAMP NULL' },
      { name: 'google_id', def: 'VARCHAR(255)' }
    ];

    for (const col of columns) {
      try {
        await db.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`);
        console.log(`Kolom ${col.name} berhasil ditambahkan.`);
      } catch (e) {
        if (e.code === 'ER_DUP_FIELDNAME') {
          console.log(`Kolom ${col.name} sudah ada.`);
        } else {
          console.error(`Gagal menambahkan kolom ${col.name}:`, e.message);
        }
      }
    }
    
    console.log('Migrasi selesai!');
    process.exit(0);
  } catch (error) {
    console.error('Error saat migrasi:', error);
    process.exit(1);
  }
}

migrate();
