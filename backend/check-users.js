const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
  const connectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };

  try {
    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected to Aiven MySQL.\n');

    const [users] = await connection.query('SELECT user_id, name, email, phone_no, role, is_active FROM users LIMIT 15');
    console.log('📋 Sample Users in Database:');
    console.table(users);

    const [mothers] = await connection.query('SELECT mother_id, user_id, mother_code, full_name FROM mothers LIMIT 10');
    console.log('📋 Sample Mothers in Database:');
    console.table(mothers);

    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

checkUsers();
