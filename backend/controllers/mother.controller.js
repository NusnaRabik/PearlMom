const { Mother, User, Midwife, Appointment, Vaccination, RefreshToken, ClinicVisit, LabReport, Clinic, HealthEducationChecklist } = require('../models');
const { success, error, successResponse, errorResponse } = require('../utils/response');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const generateMotherID = require('../utils/generateMotherID');
const { Op } = require('sequelize');

// Get mother dashboard - FIXED alias case
const getDashboard = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Appointment,
          as: 'Appointments',
          required: false,
          limit: 5,
          order: [['appointment_date', 'DESC']]
        },
        {
          model: Vaccination,
          as: 'Vaccinations',
          required: false,
          limit: 5,
          order: [['due_date', 'ASC']]
        }
      ]
    });

    if (!mother) {
      return error(res, 'Mother profile not found', 404);
    }

    // Also return user data
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['name', 'email', 'phone_no', 'profile_picture_url']
    });

    return success(res, { mother, user });
  } catch (err) {
    console.error('Dashboard error:', err);
    return error(res, 'Error fetching dashboard: ' + err.message);
  }
};

// Get mother profile
const getProfile = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    // Also fetch user data to combine
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['name', 'email', 'phone_no', 'profile_picture_url']
    });

    const responseData = {
      mother: mother,
      user: user
    };

    return success(res, responseData);
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, 'Error fetching profile');
  }
};

// Update mother profile - COMPLETE VERSION with all fields
const updateProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user_id = req.user.user_id;
    
    // Allowed fields for mother profile
    const allowedFields = [
      'full_name', 'nic', 'dob', 'address', 'district', 'gs_division', 'blood_group',
      'pregnancy_status', 'lmp_date', 'expected_delivery_date', 'current_weight', 'height',
      'gravida', 'para', 'allergies', 'chronic_diseases',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_relationship',
      'husband_name', 'husband_contact', 'assigned_midwife_id', 'is_high_risk'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        if (field === 'dob' || field === 'lmp_date' || field === 'expected_delivery_date') {
          if (req.body[field]) updates[field] = new Date(req.body[field]);
        } else if (field === 'current_weight' || field === 'height') {
          if (req.body[field]) updates[field] = parseFloat(req.body[field]);
        } else if (field === 'gravida' || field === 'para') {
          if (req.body[field]) updates[field] = parseInt(req.body[field]);
        } else if (field === 'is_high_risk') {
          updates[field] = req.body[field] === true || req.body[field] === 'true';
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    await Mother.update(updates, { where: { user_id: user_id }, transaction });

    if (req.body.full_name) {
      await User.update({ name: req.body.full_name }, { where: { user_id: user_id }, transaction });
    }
    if (req.body.email) {
      await User.update({ email: req.body.email }, { where: { user_id: user_id }, transaction });
    }
    if (req.body.mobile) {
      await User.update({ phone_no: req.body.mobile }, { where: { user_id: user_id }, transaction });
    }

    const updatedMother = await Mother.findOne({ where: { user_id: user_id }, transaction });
    const isProfileComplete = updatedMother && updatedMother.full_name && updatedMother.dob && updatedMother.blood_group && updatedMother.expected_delivery_date;

    if (isProfileComplete) {
      await Mother.update({ profile_completed: true }, { where: { user_id: user_id }, transaction });
      await User.update({ profile_completed: true }, { where: { user_id: user_id }, transaction });
    }

    await transaction.commit();

    const finalMother = await Mother.findOne({ where: { user_id: user_id } });
    const finalUser = await User.findByPk(user_id, { attributes: ['name', 'email', 'phone_no', 'profile_picture_url'] });

    return success(res, { mother: finalMother, user: finalUser }, 'Profile updated successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Update profile error:', err);
    return error(res, 'Error updating profile: ' + err.message);
  }
};

// Get EMCH Card Data (for mother dashboard)
// Get EMCH Card Data (for mother dashboard)
const getEMCHCardData = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    
    // Get mother profile
    const mother = await Mother.findOne({
      where: { user_id: user_id, is_deleted: false }
    });
    
    if (!mother) {
      return error(res, 'Mother profile not found', 404);
    }
    
    // Get latest vital signs from clinic_visits
    const latestVisit = await ClinicVisit.findOne({
      where: { mother_id: mother.mother_id, status: 'completed', is_deleted: false },
      order: [['visit_date', 'DESC']],
      limit: 1
    });
    
    // Get all clinic visits for timeline
    const clinicVisits = await ClinicVisit.findAll({
      where: { mother_id: mother.mother_id, status: 'completed', is_deleted: false },
      order: [['visit_date', 'DESC']]
    });
    
    // Get next appointment - simplified to avoid alias issues
    const nextAppointment = await Appointment.findOne({
      where: { 
        mother_id: mother.mother_id, 
        status: 'scheduled',
        appointment_date: { [Op.gte]: new Date() },
        is_deleted: false
      },
      order: [['appointment_date', 'ASC']]
    });
    
    // If we need clinic details, fetch separately - FIXED: use 'name' instead of 'clinic_name'
    let clinicDetails = null;
    if (nextAppointment && nextAppointment.clinic_id) {
      clinicDetails = await Clinic.findOne({
        where: { clinic_id: nextAppointment.clinic_id },
        attributes: [['name', 'clinic_name'], 'address', 'contact_number', 'district'] // Use alias to map 'name' to 'clinic_name'
      });
    }
    
    // Get lab reports
    const labReports = await LabReport.findAll({
      where: { mother_id: mother.mother_id },
      order: [['collected_date', 'DESC']]
    });
    
    // Combine appointment with clinic details
    const appointmentWithDetails = nextAppointment ? {
      ...nextAppointment.toJSON(),
      Clinic: clinicDetails ? {
        clinic_name: clinicDetails.dataValues.clinic_name,
        address: clinicDetails.address,
        contact_number: clinicDetails.contact_number
      } : null
    } : null;
    
    return success(res, {
      mother,
      vitalSigns: latestVisit,
      clinicVisits,
      nextAppointment: appointmentWithDetails,
      labReports
    });
    
  } catch (err) {
    console.error('EMCH card data error:', err);
    return error(res, 'Error fetching EMCH card data: ' + err.message);
  }
};

// Add new mother (for provider) - using generateMotherID
const addMother = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const {
      mother_code,
      full_name,
      nic,
      dob,
      phone_no,
      email,
      address,
      district,
      gs_division,
      blood_group,
      lmp_date,
      expected_delivery_date,
      current_weight,
      height,
      pregnancy_status,
      gravida,
      para,
      is_high_risk,
      emergency_contact_name,
      emergency_contact_phone,
      emergency_relationship,
      husband_name,
      husband_contact,
      allergies,
      chronic_diseases
    } = req.body;

    // Get the logged-in midwife
    const midwife = await Midwife.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!midwife) {
      await transaction.rollback();
      return errorResponse(res, 'Provider profile not found', 404);
    }

    // Generate mother_code using the same function as registration
    let finalMotherCode = mother_code;
    if (!finalMotherCode) {
      finalMotherCode = await generateMotherID();
    } else {
      // Check if provided mother_code already exists
      const existingMother = await Mother.findOne({ where: { mother_code: finalMotherCode } });
      if (existingMother) {
        await transaction.rollback();
        return errorResponse(res, `Mother code ${finalMotherCode} already exists. Please use a different code or leave empty for auto-generation.`, 400);
      }
    }

    // Create user account for the mother
    const defaultPassword = full_name.toLowerCase().replace(/\s/g, '') + '123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);
    
    const user = await User.create({
      phone_no: phone_no,
      email: email || `${full_name.toLowerCase().replace(/\s/g, '')}@pearlmom.lk`,
      name: full_name,
      password_hash: hashedPassword,
      role: 'mother',
      profile_completed: true,
      is_active: true
    }, { transaction });

    // Calculate weeks from LMP
    let weeks = null;
    if (lmp_date) {
      const lmp = new Date(lmp_date);
      const today = new Date();
      const diffTime = today - lmp;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      weeks = Math.floor(diffDays / 7);
      if (weeks < 0) weeks = 0;
      if (weeks > 42) weeks = 42;
    }

    // Create mother profile
    const mother = await Mother.create({
      user_id: user.user_id,
      mother_code: finalMotherCode,
      full_name: full_name,
      nic: nic,
      dob: dob,
      address: address,
      district: district,
      gs_division: gs_division,
      blood_group: blood_group,
      lmp_date: lmp_date,
      expected_delivery_date: expected_delivery_date,
      current_weight: current_weight,
      height: height,
      pregnancy_status: pregnancy_status || 'pregnant',
      gravida: gravida || 1,
      para: para || 0,
      is_high_risk: is_high_risk || false,
      weeks: weeks,
      emergency_contact_name: emergency_contact_name,
      emergency_contact_phone: emergency_contact_phone,
      emergency_relationship: emergency_relationship,
      husband_name: husband_name,
      husband_contact: husband_contact,
      allergies: allergies,
      chronic_diseases: chronic_diseases,
      assigned_midwife_id: midwife.midwife_id,
      registered_date: new Date(),
      profile_completed: true
    }, { transaction });

    await transaction.commit();

    return successResponse(res, { 
      mother, 
      user,
      default_password: defaultPassword
    }, `Mother added successfully. Default password: ${defaultPassword}`);
  } catch (error) {
    await transaction.rollback();
    console.error('Add mother error:', error);
    
    // Handle duplicate entry error specifically
    if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') {
      return errorResponse(res, 'Duplicate entry. Mother code or NIC already exists.', 400);
    }
    
    return errorResponse(res, 'Error adding mother: ' + error.message);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findByPk(user_id);
    if (!user) return error(res, 'User not found', 404);
    
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) return error(res, 'Current password is incorrect', 400);
    
    if (newPassword.length < 8) return error(res, 'New password must be at least 8 characters', 400);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password_hash: hashedPassword }, { where: { user_id: user_id } });
    
    return success(res, null, 'Password changed successfully');
  } catch (err) {
    console.error('Change password error:', err);
    return error(res, 'Error changing password');
  }
};

// Deactivate account
const deactivateAccount = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user_id = req.user.user_id;
    
    await User.update({ is_active: false, is_deleted: true, deleted_at: new Date() }, { where: { user_id: user_id }, transaction });
    await Mother.update({ is_deleted: true }, { where: { user_id: user_id }, transaction });
    await RefreshToken.update({ is_revoked: true }, { where: { user_id: user_id }, transaction });
    
    await transaction.commit();
    return success(res, null, 'Account deactivated successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Deactivate account error:', err);
    return error(res, 'Error deactivating account');
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { profile_picture_url } = req.body;
    await User.update({ profile_picture_url: profile_picture_url }, { where: { user_id: user_id } });
    return success(res, { profile_picture_url }, 'Profile picture updated');
  } catch (err) {
    console.error('Upload profile picture error:', err);
    return error(res, 'Error uploading profile picture');
  }
};

// Get all mothers (for providers)
const getAllMothers = async (req, res) => {
  try {
    const mothers = await Mother.findAll({
      where: { is_deleted: false },
      include: [{ model: User, as: 'user', attributes: ['name', 'email', 'phone_no'] }]
    });
    return success(res, { mothers });
  } catch (err) {
    console.error('Get all mothers error:', err);
    return error(res, 'Error fetching mothers');
  }
};

// Update mother medical details
const updateMedicalDetails = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const updates = {};
    const medicalFields = ['current_weight', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'fetal_heart_rate', 'fundal_height', 'notes'];
    
    medicalFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    
    await Mother.update(updates, { where: { user_id: user_id } });
    const updated = await Mother.findOne({ where: { user_id: user_id } });
    return success(res, { mother: updated }, 'Medical details updated');
  } catch (err) {
    console.error('Update medical details error:', err);
    return error(res, 'Error updating medical details');
  }
};

// Create or update mother profile (for registration completion)
const createOrUpdateProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user_id = req.user.user_id;
    let mother = await Mother.findOne({ where: { user_id: user_id }, transaction });
    
    if (!mother) {
      mother = await Mother.create({
        user_id: user_id,
        full_name: req.body.full_name || req.user.name,
        registered_date: new Date(),
        pregnancy_status: 'pregnant',
        ...req.body
      }, { transaction });
    } else {
      await mother.update(req.body, { transaction });
    }
    
    await User.update({ profile_completed: true }, { where: { user_id: user_id }, transaction });
    await transaction.commit();
    
    const updatedMother = await Mother.findOne({ where: { user_id: user_id } });
    return success(res, { mother: updatedMother }, 'Profile saved successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Create/Update profile error:', err);
    return error(res, 'Error saving profile');
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getEMCHCardData,
  addMother,
  changePassword,
  deactivateAccount,
  uploadProfilePicture,
  getAllMothers,
  updateMedicalDetails,
  createOrUpdateProfile
};