// backend/models/ClinicVisit.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ClinicVisit = sequelize.define('ClinicVisit', {
  visit_id: {
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
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  visit_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  gestational_weeks: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  blood_pressure_systolic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  blood_pressure_diastolic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  weight_kg: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  fetal_heart_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  fundal_height_cm: {
    type: DataTypes.DECIMAL(5,1),
    allowNull: true
  },
  edema: {
    type: DataTypes.ENUM('none', 'mild', 'moderate', 'severe'),
    defaultValue: 'none'
  },
  fetal_movement: {
    type: DataTypes.ENUM('normal', 'decreased', 'increased', 'absent'),
    defaultValue: 'normal'
  },
  hemoglobin_level: {
    type: DataTypes.DECIMAL(4,1),
    allowNull: true
  },
  urine_albumin: {
    type: DataTypes.STRING(20),
    defaultValue: 'Normal'
  },
  urine_sugar: {
    type: DataTypes.STRING(20),
    defaultValue: 'Normal'
  },
  visit_type: {
    type: DataTypes.ENUM('antenatal', 'postnatal', 'emergency', 'follow_up'),
    defaultValue: 'antenatal'
  },
  status: {
    type: DataTypes.ENUM('draft', 'completed', 'cancelled'),
    defaultValue: 'draft'
  },
  patient_complaints: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  clinical_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referrals: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  next_visit_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  recorded_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'clinic_visits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = ClinicVisit;