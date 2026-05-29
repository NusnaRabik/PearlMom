const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ThriposhaStock = sequelize.define('ThriposhaStock', {
  stock_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  batch_number: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  packets_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  packets_distributed: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  packets_damaged: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  packets_expired: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  received_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  supplier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  batch_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'low_stock', 'exhausted'),
    defaultValue: 'active'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'thriposha_stock',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ThriposhaStock;