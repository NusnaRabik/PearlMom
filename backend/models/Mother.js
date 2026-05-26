const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Mother = sequelize.define('Mother', {
  mother_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  mother_code: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  full_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  nic: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  district: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  gs_division: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: true
  },
  pregnancy_status: {
    type: DataTypes.ENUM('pregnant', 'postnatal', 'completed'),
    defaultValue: 'pregnant'
  },
  lmp_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  expected_delivery_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  current_weight: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5,2),
    allowNull: true
  },
  gravida: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  para: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  allergies: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  chronic_diseases: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  emergency_contact_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emergency_contact_phone: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  emergency_relationship: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  husband_name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  husband_contact: {
    type: DataTypes.STRING(15),
    allowNull: true
  },
  assigned_midwife_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  is_high_risk: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  weeks: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Current gestational weeks'
  },
  registered_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  profile_completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'mothers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

// Add associations
Mother.associate = function(models) {
  Mother.belongsTo(models.User, {
    foreignKey: 'user_id',
    as: 'user'
  });
  
  Mother.hasMany(models.ThriposhaEligibility, {
    foreignKey: 'mother_id',
    as: 'thriposha_eligibilities'
  });
  
  Mother.hasMany(models.NutritionSupplement, {
    foreignKey: 'mother_id',
    as: 'nutrition_supplements'
  });
  
  Mother.belongsTo(models.Midwife, {
    foreignKey: 'assigned_midwife_id',
    as: 'midwife'
  });
  
  Mother.hasMany(models.Appointment, {
    foreignKey: 'mother_id',
    as: 'appointments'
  });
  
  Mother.hasMany(models.Vaccination, {
    foreignKey: 'mother_id',
    as: 'vaccinations'
  });
};

module.exports = Mother;