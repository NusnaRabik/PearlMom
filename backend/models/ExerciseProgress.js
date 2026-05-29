const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ExerciseProgress = sequelize.define('ExerciseProgress', {
  progress_id: {
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
  exercise_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'exercises',
      key: 'exercise_id'
    }
  },
  completed_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  duration_minutes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('completed', 'skipped', 'partial'),
    defaultValue: 'completed'
  }
}, {
  tableName: 'exercise_progress',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['mother_id', 'exercise_id', 'completed_date'],
      name: 'unique_daily_exercise'
    }
  ]
});

module.exports = ExerciseProgress;