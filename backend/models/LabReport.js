const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LabReport = sequelize.define(
  'LabReport',
  {
    lab_report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mother_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    record_id: {
      // models/index.js defines MaternalRecord -> LabReport via record_id
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    test_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    test_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    collected_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    file_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: 'lab_reports',
    timestamps: true,
  }
);

module.exports = LabReport;

