const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const MaternalRecord = sequelize.define('MaternalRecord', {
  record_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  visit_type: {
    type: DataTypes.ENUM('antenatal', 'postnatal', 'emergency', 'follow_up'),
    allowNull: false
  },
  gestational_weeks: DataTypes.INTEGER,
  blood_pressure_systolic: DataTypes.INTEGER,
  blood_pressure_diastolic: DataTypes.INTEGER,
  weight_kg: DataTypes.DECIMAL(5,2),
  fundal_height_cm: DataTypes.DECIMAL(5,1),
  fetal_heart_rate: DataTypes.INTEGER,
  fetal_movements: DataTypes.STRING(50),
  hemoglobin_level: DataTypes.DECIMAL(4,1),
  urine_albumin: DataTypes.STRING(20),
  urine_sugar: DataTypes.STRING(20),
  medications_prescribed: DataTypes.TEXT,
  ultrasound_report: DataTypes.TEXT,
  doctors_notes: DataTypes.TEXT,
  next_visit_date: DataTypes.DATEONLY,
  recorded_by: DataTypes.INTEGER,
  file_url: DataTypes.STRING(500),
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'maternal_records',
  timestamps: true
});

module.exports = MaternalRecord;