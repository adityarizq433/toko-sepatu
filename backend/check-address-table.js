const db = require('./config/db');

async function checkTable() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        label VARCHAR(50) NOT NULL,
        alamat TEXT NOT NULL,
        is_default TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabel user_addresses dipastikan ada.');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
checkTable();
