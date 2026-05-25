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
    allowNull: false
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
    allowNull: false
  },
  sent_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  read_date: DataTypes.DATE,
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

module.exports = Notification;