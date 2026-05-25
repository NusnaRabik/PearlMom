const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const NutritionSupplement = sequelize.define('NutritionSupplement', {
  supplement_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  supplement_type: {
    type: DataTypes.ENUM('thriposha', 'iron_folic', 'calcium', 'vitamin_c', 'other'),
    allowNull: false
  },
  distribution_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  quantity: DataTypes.STRING(50),
  is_eligible: DataTypes.BOOLEAN,
  distributed_by: DataTypes.INTEGER,
  notes: DataTypes.TEXT
}, {
  tableName: 'nutrition_supplements',
  timestamps: true
});

module.exports = NutritionSupplement;