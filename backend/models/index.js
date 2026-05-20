const { sequelize } = require('../config/db');
const User = require('./User');
const Mother = require('./Mother');
const Midwife = require('./Midwife');
const RefreshToken = require('./RefreshToken');
const MaternalRecord = require('./MaternalRecord');
const Appointment = require('./Appointment');
const Vaccination = require('./Vaccination');
const NutritionSupplement = require('./NutritionSupplement');
const Clinic = require('./Clinic');
const Notification = require('./Notification');
const ThriposhaEligibility = require('./ThriposhaEligibility');
const LabReport = require('./LabReport');

// Define all associations
const setupAssociations = () => {
  // User associations
  User.hasOne(Mother, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Mother.belongsTo(User, { foreignKey: 'user_id' });

  User.hasOne(Midwife, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Midwife.belongsTo(User, { foreignKey: 'user_id' });

  User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

  // Mother associations
  Mother.hasMany(MaternalRecord, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  MaternalRecord.belongsTo(Mother, { foreignKey: 'mother_id' });

  Mother.hasMany(Appointment, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  Appointment.belongsTo(Mother, { foreignKey: 'mother_id' });

  Mother.hasMany(Vaccination, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  Vaccination.belongsTo(Mother, { foreignKey: 'mother_id' });

  Mother.hasMany(NutritionSupplement, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  NutritionSupplement.belongsTo(Mother, { foreignKey: 'mother_id' });

  Mother.hasMany(ThriposhaEligibility, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  ThriposhaEligibility.belongsTo(Mother, { foreignKey: 'mother_id' });

  Mother.hasMany(LabReport, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
  LabReport.belongsTo(Mother, { foreignKey: 'mother_id' });

  // Midwife associations
  Midwife.hasMany(Mother, { foreignKey: 'assigned_midwife_id' });
  Mother.belongsTo(Midwife, { foreignKey: 'assigned_midwife_id' });

  Midwife.hasMany(Appointment, { foreignKey: 'midwife_id' });
  Appointment.belongsTo(Midwife, { foreignKey: 'midwife_id' });

  // Clinic associations
  Clinic.hasMany(Appointment, { foreignKey: 'clinic_id' });
  Appointment.belongsTo(Clinic, { foreignKey: 'clinic_id' });

  // User as recorder/distributor
  User.hasMany(MaternalRecord, { foreignKey: 'recorded_by', as: 'recorder' });
  MaternalRecord.belongsTo(User, { foreignKey: 'recorded_by', as: 'recorder' });

  User.hasMany(NutritionSupplement, { foreignKey: 'distributed_by', as: 'distributor' });
  NutritionSupplement.belongsTo(User, { foreignKey: 'distributed_by', as: 'distributor' });

  // Notification associations
  User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
  Notification.belongsTo(User, { foreignKey: 'user_id' });

  // Lab reports
  MaternalRecord.hasMany(LabReport, { foreignKey: 'record_id' });
  LabReport.belongsTo(MaternalRecord, { foreignKey: 'record_id' });
};

// Call setup associations
setupAssociations();

module.exports = {
  sequelize,
  User,
  Mother,
  Midwife,
  RefreshToken,
  MaternalRecord,
  Appointment,
  Vaccination,
  NutritionSupplement,
  Clinic,
  Notification,
  ThriposhaEligibility,
  LabReport
};