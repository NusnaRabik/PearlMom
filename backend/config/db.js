const { Sequelize } = require('sequelize');
const mysql2 = require('mysql2');
require('dotenv').config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pearl_mom_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      freezeTableName: true,
      timestamps: true,
      underscored: true
    }
  }
);

// Database connection and sync - FIXED VERSION
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL Database connected successfully');
    
    // ✅ SAFE SYNC - NO { alter: true }
    // This only creates tables if they don't exist
    // It will NOT create duplicate indexes
    await sequelize.sync();
    console.log('✅ Database schema synchronized');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    // Don't exit the process in production
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

module.exports = {
  sequelize,
  connectDB
};