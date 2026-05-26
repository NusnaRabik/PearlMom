// backend/models/ThriposhaEligibility.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ThriposhaEligibility = sequelize.define('ThriposhaEligibility', {
  eligibility_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  assessed_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gestational_week: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  mother_weight_kg: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  bmi: {
    type: DataTypes.DECIMAL(6, 2),
    allowNull: true
  },
  is_eligible: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  ineligibility_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assessed_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'thriposha_eligibilities',
  timestamps: true,
  createdAt: 'created_at',  // Map to your column
  updatedAt: 'updated_at'    // Map to your column
});

module.exports = ThriposhaEligibility;