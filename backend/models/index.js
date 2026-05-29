const User = require('./User');
const Mother = require('./Mother');
const Midwife = require('./Midwife');
const Clinic = require('./Clinic');
const Appointment = require('./Appointment');
const Vaccination = require('./Vaccination');
const RefreshToken = require('./RefreshToken');
const Notification = require('./Notification');
const MaternalRecord = require('./MaternalRecord');
const ThriposhaEligibility = require('./ThriposhaEligibility');
const NutritionSupplement = require('./NutritionSupplement');
const ClinicVisit = require('./ClinicVisit');
const HealthEducationChecklist = require('./HealthEducationChecklist');
const LabReport = require('./LabReport');
const Exercise = require('./Exercise');
const ExerciseProgress = require('./ExerciseProgress');
const ThriposhaStock = require('./ThriposhaStock');
const ThriposhaStockSettings = require('./ThriposhaStockSettings');
const VaccineStock = require('./VaccineStock');

// Associations
User.hasOne(Mother, { foreignKey: 'user_id' });
Mother.belongsTo(User, { foreignKey: 'user_id' });

User.hasOne(Midwife, { foreignKey: 'user_id' });
Midwife.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id' });

Mother.hasMany(MaternalRecord, { foreignKey: 'mother_id', onDelete: 'CASCADE' });
MaternalRecord.belongsTo(Mother, { foreignKey: 'mother_id' });

Mother.hasMany(Appointment, { foreignKey: 'mother_id' });
Appointment.belongsTo(Mother, { foreignKey: 'mother_id' });

Mother.hasMany(Vaccination, { foreignKey: 'mother_id' });
Vaccination.belongsTo(Mother, { foreignKey: 'mother_id' });

Exercise.hasMany(ExerciseProgress, { foreignKey: 'exercise_id' });
ExerciseProgress.belongsTo(Exercise, { foreignKey: 'exercise_id' });

Mother.hasMany(ExerciseProgress, { foreignKey: 'mother_id' });
ExerciseProgress.belongsTo(Mother, { foreignKey: 'mother_id' });

// Lab Report associations
Mother.hasMany(LabReport, { foreignKey: 'mother_id' });
LabReport.belongsTo(Mother, { foreignKey: 'mother_id' });

// Thriposha associations
Mother.hasMany(ThriposhaEligibility, { foreignKey: 'mother_id', as: 'thriposha_eligibilities' });
ThriposhaEligibility.belongsTo(Mother, { foreignKey: 'mother_id', as: 'mother' });

Mother.hasMany(NutritionSupplement, { foreignKey: 'mother_id', as: 'nutrition_supplements' });
NutritionSupplement.belongsTo(Mother, { foreignKey: 'mother_id', as: 'mother' });

User.hasMany(NutritionSupplement, { foreignKey: 'distributed_by', as: 'distributions' });
NutritionSupplement.belongsTo(User, { foreignKey: 'distributed_by', as: 'distributor' });

User.hasMany(ThriposhaEligibility, { foreignKey: 'assessed_by', as: 'assessments' });
ThriposhaEligibility.belongsTo(User, { foreignKey: 'assessed_by', as: 'assessor' });

// Clinic Visit associations
Mother.hasMany(ClinicVisit, { foreignKey: 'mother_id', as: 'clinic_visits' });
ClinicVisit.belongsTo(Mother, { foreignKey: 'mother_id', as: 'mother' });

User.hasMany(ClinicVisit, { foreignKey: 'recorded_by', as: 'recorded_visits' });
ClinicVisit.belongsTo(User, { foreignKey: 'recorded_by', as: 'recorder' });

// Health Education Checklist associations
Mother.hasMany(HealthEducationChecklist, { foreignKey: 'mother_id', as: 'health_education' });
HealthEducationChecklist.belongsTo(Mother, { foreignKey: 'mother_id', as: 'mother' });

ClinicVisit.hasMany(HealthEducationChecklist, { foreignKey: 'visit_id', as: 'education_checklist' });
HealthEducationChecklist.belongsTo(ClinicVisit, { foreignKey: 'visit_id', as: 'visit' });

Midwife.hasMany(Appointment, { foreignKey: 'midwife_id' });
Appointment.belongsTo(Midwife, { foreignKey: 'midwife_id' });

Clinic.hasMany(Appointment, { foreignKey: 'clinic_id' });
Appointment.belongsTo(Clinic, { foreignKey: 'clinic_id' });

Midwife.hasMany(Mother, { foreignKey: 'assigned_midwife_id' });
Mother.belongsTo(Midwife, { foreignKey: 'assigned_midwife_id' });

User.hasMany(MaternalRecord, { foreignKey: 'recorded_by', as: 'recorder' });
MaternalRecord.belongsTo(User, { foreignKey: 'recorded_by', as: 'recorder' });

// NEW: Stock management associations
// Thriposha Stock - User associations
User.hasMany(ThriposhaStock, { foreignKey: 'created_by', as: 'thriposha_stock_entries' });
ThriposhaStock.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

// Thriposha Stock Settings - User association
ThriposhaStockSettings.belongsTo(User, { foreignKey: 'updated_by', as: 'updater' });

// Vaccine Stock - User associations
User.hasMany(VaccineStock, { foreignKey: 'created_by', as: 'vaccine_stock_entries' });
VaccineStock.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

module.exports = {
  User,
  Mother,
  Midwife,
  Clinic,
  Appointment,
  Vaccination,
  RefreshToken,
  Notification,
  MaternalRecord,
  ThriposhaEligibility,
  NutritionSupplement,
  ClinicVisit,
  HealthEducationChecklist,
  LabReport,
  Exercise,
  ExerciseProgress,
  // NEW exports
  ThriposhaStock,
  ThriposhaStockSettings,
  VaccineStock
};