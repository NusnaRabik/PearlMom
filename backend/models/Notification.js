const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notification_type: {
    type: DataTypes.ENUM('appointment_reminder', 'vaccination_alert', 'checkup_reminder', 'general'),
    allowNull: false,
    defaultValue: 'general'
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  sent_via: {
    type: DataTypes.ENUM('sms', 'email', 'in_app'),
    allowNull: false,
    defaultValue: 'in_app'
  },
  sent_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  read_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true,
  createdAt: 'createdAt',   // matches your DB column exactly
  updatedAt: false,          // your schema has no updatedAt on notifications
  underscored: false
});

module.exports = Notification;