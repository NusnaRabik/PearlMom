const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SupportTicket = sequelize.define('SupportTicket', {
  ticket_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  user_role: {
    type: DataTypes.ENUM('mother', 'midwife', 'doctor', 'admin'),
    allowNull: true
  },
  user_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  user_email: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  ticket_type: {
    type: DataTypes.ENUM('contact', 'bug'),
    allowNull: false,
    defaultValue: 'contact'
  },
  subject: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  page_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  browser_info: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  steps_to_reproduce: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachment_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
    defaultValue: 'medium'
  },
  resolved_by: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  resolved_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'support_tickets',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = SupportTicket;