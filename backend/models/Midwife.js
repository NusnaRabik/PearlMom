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
    unique: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  employee_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  contact_number: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  assigned_area: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  qualification: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  years_of_experience: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  profile_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'midwives',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Midwife;