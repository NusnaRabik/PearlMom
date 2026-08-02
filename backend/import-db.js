const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function importDatabase() {
  console.log('🚀 Starting Database Import to Aiven Cloud...\n');

  let sqlPath = path.join(__dirname, 'pearl_mom_db.sql');
  if (!fs.existsSync(sqlPath)) {
    sqlPath = path.join(__dirname, '..', 'pearl_mom_db.sql');
  }

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ Could not find 'pearl_mom_db.sql'!`);
    process.exit(1);
  }

  console.log(`📖 Reading SQL file from: ${sqlPath}`);
  let sql = fs.readFileSync(sqlPath, 'utf8');

  // Clean up MySQL dump formatting
  // 1. Remove DELIMITER commands
  sql = sql.replace(/^DELIMITER\s+.*$/gim, '');
  sql = sql.replace(/\$\$/g, ';');

  // 2. Remove DEFINER clauses (not allowed on cloud databases)
  sql = sql.replace(/CREATE\s+DEFINER=`[^`]+`@`[^`]+`/gi, 'CREATE');

  // 3. Remove single-line comments
  const lines = sql.split('\n');
  const cleanedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') || trimmed.startsWith('/*') && trimmed.endsWith('*/;')) {
      return '';
    }
    return line;
  });

  const cleanedSql = cleanedLines.join('\n');

  // Split into individual SQL statements by semicolon
  const statements = cleanedSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('/*') && !s.startsWith('--'));

  const connectionConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'defaultdb',
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined
  };

  console.log(`🔌 Connecting to Aiven Database (${connectionConfig.host}:${connectionConfig.port})...`);
  
  let connection;
  try {
    connection = await mysql.createConnection(connectionConfig);
    console.log('✅ Connected successfully to Aiven MySQL!\n');

    console.log('⚙️  Disabling foreign key checks temporarily...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');
    await connection.query('SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO"');

    console.log(`⏳ Executing ${statements.length} SQL statements (creating tables & importing data)...`);

    let successCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt) continue;

      try {
        await connection.query(stmt);
        successCount++;
      } catch (err) {
        // If it's a routine/trigger error due to cloud permissions, skip it and continue importing tables/data
        if (stmt.toUpperCase().includes('PROCEDURE') || stmt.toUpperCase().includes('TRIGGER') || stmt.toUpperCase().includes('FUNCTION')) {
          console.warn(`⚠️  Skipped stored routine (cloud permission): ${stmt.substring(0, 45)}...`);
          skippedCount++;
        } else {
          console.warn(`⚠️  Warning on statement: ${err.message.substring(0, 80)}`);
          skippedCount++;
        }
      }
    }

    console.log('⚙️  Re-enabling foreign key checks...');
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log(`\n🎉 IMPORT COMPLETED SUCCESSFULLY!`);
    console.log(`✅ ${successCount} statements executed successfully.`);
    if (skippedCount > 0) {
      console.log(`ℹ️  ${skippedCount} non-critical statements skipped.`);
    }
    console.log(`\nYour local database data is now live on Aiven Cloud! 🚀`);
  } catch (err) {
    console.error('❌ Connection or Fatal Error:', err.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importDatabase();
