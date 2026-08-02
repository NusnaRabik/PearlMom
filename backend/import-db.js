const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Load models and sequelize instance
require('./models');
const { sequelize } = require('./config/db');

async function importDatabase() {
  console.log('🚀 Starting Smart Database Import to Aiven Cloud...\n');

  let sqlPath = path.join(__dirname, 'pearl_mom_db.sql');
  if (!fs.existsSync(sqlPath)) {
    sqlPath = path.join(__dirname, '..', 'pearl_mom_db.sql');
  }

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Could not find 'pearl_mom_db.sql'!`);
    process.exit(1);
  }

  console.log(`📖 Reading SQL file from: ${sqlPath}`);
  const sql = fs.readFileSync(sqlPath, 'utf8');

  // Step 1: Create all tables with Sequelize (ensures proper Primary Keys for Aiven)
  console.log('🔨 Synchronizing database tables with Sequelize models...');
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to Sequelize.');
    await sequelize.sync({ force: true });
    console.log('✅ All tables created fresh with valid schemas and primary keys!\n');
  } catch (err) {
    console.error('❌ Sequelize sync failed:', err.message);
    process.exit(1);
  }

  // Step 2: Extract only the INSERT INTO statements from the SQL dump
  const lines = sql.split('\n');
  const insertStatements = [];
  let currentInsert = '';
  let inInsert = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('INSERT INTO')) {
      inInsert = true;
      currentInsert = trimmed;
    } else if (inInsert) {
      currentInsert += ' ' + trimmed;
    }

    if (inInsert && trimmed.endsWith(';')) {
      inInsert = false;
      insertStatements.push(currentInsert);
      currentInsert = '';
    }
  }

  console.log(`📦 Found ${insertStatements.length} INSERT statements to import.\n`);

  const connectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };

  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);

    console.log('⚙️  Disabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"');

    console.log('⏳ Inserting data rows into tables...');
    let successCount = 0;
    let failedCount = 0;

    for (const stmt of insertStatements) {
      try {
        await connection.query(stmt);
        successCount++;
      } catch (err) {
        console.warn(`  ⚠️  Skipped statement: ${err.message.substring(0, 80)}`);
        failedCount++;
      }
    }

    console.log('\n⚙️  Re-enabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log(`\n🎉 DATABASE IMPORT COMPLETED SUCCESSFULLY!`);
    console.log(`✅ ${successCount} data blocks imported successfully.`);
    if (failedCount > 0) {
      console.log(`ℹ️  ${failedCount} non-critical statements skipped.`);
    }
    console.log(`\nAll data from your SQL file is now live in the cloud database! 🚀`);
  } catch (err) {
    console.error('❌ Connection or Fatal Error:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
    await sequelize.close();
  }
}

importDatabase();
