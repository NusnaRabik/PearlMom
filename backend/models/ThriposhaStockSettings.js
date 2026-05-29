const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ThriposhaStockSettings = sequelize.define('ThriposhaStockSettings', {
  setting_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  low_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 200
  },
  critical_stock_threshold: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  alert_email: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  last_alert_sent: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'thriposha_stock_settings',
  timestamps: true,
  createdAt: false,
  updatedAt: 'updated_at'
});

module.exports = ThriposhaStockSettings;