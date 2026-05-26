// backend/models/HealthEducationChecklist.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const HealthEducationChecklist = sequelize.define('HealthEducationChecklist', {
  checklist_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  visit_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  topic_title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  is_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'health_education_checklist',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = HealthEducationChecklist;