const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Vaccination = sequelize.define('Vaccination', {
  vaccination_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vaccine_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  vaccine_type: {
    type: DataTypes.ENUM('tetanus', 'rubella', 'influenza', 'covid19', 'other'),
    allowNull: false
  },
  dose_number: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  given_date: DataTypes.DATEONLY,
  status: {
    type: DataTypes.ENUM('due', 'given', 'missed'),
    defaultValue: 'due'
  },
  notes: DataTypes.TEXT
}, {
  tableName: 'vaccinations'
});

module.exports = Vaccination;