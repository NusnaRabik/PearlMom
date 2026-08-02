const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
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
    console.log('✅ Connected to Aiven MySQL database.\n');

    const [tables] = await connection.query('SHOW TABLES');
    const tableKey = Object.keys(tables[0])[0];
    
    console.log('📊 Current Table Row Counts:');
    console.log('-----------------------------');
    for (const row of tables) {
      const tableName = row[tableKey];
      try {
        const [countResult] = await connection.query(`SELECT COUNT(*) as total FROM \`${tableName}\``);
        console.log(`- ${tableName.padEnd(28)} : ${countResult[0].total} rows`);
      } catch (err) {
        console.log(`- ${tableName.padEnd(28)} : (error checking)`);
      }
    }

    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

checkDatabase();
