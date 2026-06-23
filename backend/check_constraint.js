const oracledb = require('oracledb');
const dbConfig = require('./config/db'); // this calls initDb asynchronously

setTimeout(async () => {
    try {
        const [rows] = await dbConfig.query("SELECT search_condition FROM user_constraints WHERE table_name = 'ORDERS' AND constraint_type = 'C'");
        console.log(rows);
    } catch (e) {
        console.error(e);
    }
    process.exit(0);
}, 2000);
