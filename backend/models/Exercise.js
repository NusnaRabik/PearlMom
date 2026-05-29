const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Exercise = sequelize.define('Exercise', {
  exercise_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  trimester: {
    type: DataTypes.ENUM('first', 'second', 'third'),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  exercise_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 15
  },
  difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'challenging'),
    defaultValue: 'easy'
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  thumbnail_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  tips: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  precautions: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  display_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'exercises',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Exercise;