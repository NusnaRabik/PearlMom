const User = require('./User');
const Mother = require('./Mother');
const Midwife = require('./Midwife');
const Clinic = require('./Clinic');
const Appointment = require('./Appointment');
const Vaccination = require('./Vaccination');
const RefreshToken = require('./RefreshToken');
const Notification = require('./Notification');
const MaternalRecord = require('./MaternalRecord');

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

Midwife.hasMany(Appointment, { foreignKey: 'midwife_id' });
Appointment.belongsTo(Midwife, { foreignKey: 'midwife_id' });

Clinic.hasMany(Appointment, { foreignKey: 'clinic_id' });
Appointment.belongsTo(Clinic, { foreignKey: 'clinic_id' });

Midwife.hasMany(Mother, { foreignKey: 'assigned_midwife_id' });
Mother.belongsTo(Midwife, { foreignKey: 'assigned_midwife_id' });

User.hasMany(MaternalRecord, { foreignKey: 'recorded_by', as: 'recorder' });
MaternalRecord.belongsTo(User, { foreignKey: 'recorded_by', as: 'recorder' });

module.exports = {
  User,
  Mother,
  Midwife,
  Clinic,
  Appointment,
  Vaccination,
  RefreshToken,
  Notification,
  MaternalRecord
};