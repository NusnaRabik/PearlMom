const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Midwife = sequelize.define('Midwife', {
  midwife_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  employee_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  contact_number: DataTypes.STRING(15),
  assigned_area: DataTypes.STRING(100),
  district: DataTypes.STRING(100),
  qualification: DataTypes.STRING(200),
  years_of_experience: DataTypes.INTEGER,
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'midwives'
});

module.exports = Midwife;