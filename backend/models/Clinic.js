const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Clinic = sequelize.define('Clinic', {
  clinic_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  clinic_type: {
    type: DataTypes.ENUM('antenatal', 'postnatal', 'family_planning', 'general'),
    allowNull: false
  },
  address: DataTypes.TEXT,
  district: DataTypes.STRING(100),
  latitude: DataTypes.DECIMAL(10,8),
  longitude: DataTypes.DECIMAL(11,8),
  contact_number: DataTypes.STRING(15),
  operating_hours: DataTypes.STRING(100),
  services: DataTypes.TEXT,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'clinics',
  timestamps: true,
  createdAt: 'createdAt',  // Use exactly as in your database (capital A)
  updatedAt: 'updatedAt',  // Use exactly as in your database (capital A)
  underscored: false       // Don't convert to snake_case
});

module.exports = Clinic;