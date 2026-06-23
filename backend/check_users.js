const db = require('./config/db');

async function checkUsers() {
    try {
        await new Promise(r => setTimeout(r, 2000));
        console.log('Fetching users from database...');
        const [rows] = await db.query('SELECT id, nama, email, role, created_at FROM users ORDER BY created_at DESC');
        console.table(rows);
    } catch (error) {
        console.error('Error fetching users:', error);
    } process.exit(0);
}

checkUsers();
