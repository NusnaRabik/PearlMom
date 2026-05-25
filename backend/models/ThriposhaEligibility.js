const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ThriposhaEligibility = sequelize.define(
  'ThriposhaEligibility',
  {
    eligibility_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mother_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    assessed_date: {
      // Controllers use assessed_date and order by it
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    gestational_week: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    mother_weight_kg: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    bmi: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
    },
    is_eligible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    ineligibility_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    assessed_by: {
      // controllers store req.user.user_id
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'thriposha_eligibilities',
    timestamps: true,
  }
);

module.exports = ThriposhaEligibility;

