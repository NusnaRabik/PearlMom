const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mother = sequelize.define('Mother', {
  mother_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  mother_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  full_name: DataTypes.STRING(200),
  nic: DataTypes.STRING(15),
  dob: DataTypes.DATEONLY,
  address: DataTypes.TEXT,
  district: DataTypes.STRING(100),
  blood_group: DataTypes.STRING(5),
  pregnancy_status: {
    type: DataTypes.ENUM('pregnant', 'postnatal', 'completed'),
    defaultValue: 'pregnant'
  },
  lmp_date: DataTypes.DATEONLY,
  expected_delivery_date: DataTypes.DATEONLY,
  current_weight: DataTypes.DECIMAL(5,2),
  height: DataTypes.DECIMAL(5,2),
  allergies: DataTypes.TEXT,
  chronic_diseases: DataTypes.TEXT,
  emergency_contact_name: DataTypes.STRING(100),
  emergency_contact_phone: DataTypes.STRING(15),
  emergency_relationship: DataTypes.STRING(50),
  husband_name: DataTypes.STRING(100),
  husband_contact: DataTypes.STRING(15),
  assigned_midwife_id: DataTypes.INTEGER,
  is_high_risk: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  registered_date: DataTypes.DATEONLY,
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'mothers'
});

module.exports = Mother;