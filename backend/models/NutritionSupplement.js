// backend/models/NutritionSupplement.js
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
    allowNull: false,
    references: {
      model: 'mothers',
      key: 'mother_id'
    }
  },
  supplement_type: {
    type: DataTypes.ENUM('thriposha', 'iron_folic', 'calcium', 'vitamin_c', 'other'),
    allowNull: false,
    defaultValue: 'thriposha'
  },
  distribution_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  packets: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  is_eligible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  eligibility_criteria: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  distributed_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'nutrition_supplements',
  timestamps: true,
  createdAt: 'created_at',  // Map to your existing column
  updatedAt: 'updated_at'    // Map to your existing column
});

module.exports = NutritionSupplement;