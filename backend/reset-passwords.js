const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function resetAllPasswords() {
  console.log('🔄 Setting a universal test password for all accounts in Aiven database...\n');

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

    // 1. Generate hash for Password123!
    const newPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newPassword, salt);

    // 2. Update all users to have this password and be active
    await connection.query(
      'UPDATE users SET password_hash = ?, is_active = 1, is_deleted = 0',
      [newHash]
    );

    console.log(`✅ All user accounts updated with password: "${newPassword}" and set to ACTIVE (is_active = 1)!\n`);

    // 3. Fetch all accounts grouped by role
    const [users] = await connection.query(
      'SELECT user_id, name, email, phone_no, role FROM users ORDER BY role, user_id'
    );

    const [midwives] = await connection.query(
      'SELECT midwife_id, user_id, employee_id, full_name FROM midwives'
    );

    const [mothers] = await connection.query(
      'SELECT mother_id, user_id, mother_code, full_name FROM mothers'
    );

    console.log('📋 === READY TO LOGIN ACCOUNTS ===\n');
    console.log(`🔑 PASSWORD FOR ALL ACCOUNTS: ${newPassword}\n`);

    console.log('🤰 MOTHER ACCOUNTS:');
    users.filter(u => u.role === 'mother').forEach(u => {
      const m = mothers.find(m => m.user_id === u.user_id);
      console.log(`- Role: Mother | Full Name: "${u.name}" | Email: "${u.email}" | Mother Code: "${m ? m.mother_code : 'N/A'}"`);
    });

    console.log('\n👩‍⚕️ PROVIDER (MIDWIFE) ACCOUNTS:');
    users.filter(u => u.role === 'midwife').forEach(u => {
      const mw = midwives.find(m => m.user_id === u.user_id);
      console.log(`- Role: Provider | Full Name: "${u.name}" | Email: "${u.email}" | Employee ID: "${mw ? mw.employee_id : 'N/A'}"`);
    });

    console.log('\n👑 ADMIN ACCOUNTS:');
    users.filter(u => u.role === 'admin').forEach(u => {
      console.log(`- Role: Admin | Full Name: "${u.name}" | Email: "${u.email}"`);
    });

    await connection.end();
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

resetAllPasswords();
