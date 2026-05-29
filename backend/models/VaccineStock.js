const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const VaccineStock = sequelize.define('VaccineStock', {
  vaccine_stock_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vaccine_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  vaccine_type: {
    type: DataTypes.ENUM('tetanus', 'covid', 'influenza', 'tdap', 'hepatitis_b', 'rubella', 'bcg', 'polio', 'other'),
    allowNull: false
  },
  batch_number: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  doses_received: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  doses_used: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  doses_damaged: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  doses_expired: {
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
  storage_temperature: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  cold_storage_status: {
    type: DataTypes.ENUM('good', 'warning', 'critical', 'unknown'),
    defaultValue: 'unknown'
  },
  purchase_order_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  supplier: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  lot_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'low_stock', 'exhausted', 'recalled'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'vaccine_stock',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = VaccineStock;