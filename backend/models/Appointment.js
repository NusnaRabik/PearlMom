const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mother_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  clinic_id: DataTypes.INTEGER,
  midwife_id: DataTypes.INTEGER,
  appointment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  appointment_time: DataTypes.TIME,
  appointment_type: {
    type: DataTypes.ENUM('antenatal', 'postnatal', 'vaccination', 'checkup', 'home_visit'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'completed', 'cancelled', 'missed'),
    defaultValue: 'scheduled'
  },
  notes: DataTypes.TEXT,
  reminder_sent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  reminder_sent_at: DataTypes.DATE,
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'appointments',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Appointment;