const db = require('./config/db');

async function makeAdmin() {
    try {
        await new Promise(r => setTimeout(r, 2000));
        console.log('Updating user role...');
        const sql = "UPDATE users SET role = 'admin' WHERE email = 'adityarizq433@gmail.com'";
        await db.query(sql);
        console.log('Success! adityarizq433@gmail.com is now an admin.');
    } catch (error) {
        console.error('Error updating user:', error);
    } process.exit(0);
}

makeAdmin();
