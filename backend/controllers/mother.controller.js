const { Mother, User, Appointment, Vaccination, RefreshToken } = require('../models');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

// Get mother dashboard
// Get mother dashboard - FIXED alias case
const getDashboard = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Appointment,
          as: 'Appointments',  // Capital A - matches association
          required: false,
          limit: 5,
          order: [['appointment_date', 'DESC']]
        },
        {
          model: Vaccination,
          as: 'Vaccinations',  // Capital V - matches association
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
    
    // Allowed fields for mother profile - INCLUDING all EMCHCardPage fields
    const allowedFields = [
      // Basic info
      'full_name',
      'nic',
      'dob',
      'address',
      'district',
      'gs_division',
      'blood_group',
      
      // Pregnancy details
      'pregnancy_status',
      'lmp_date',
      'expected_delivery_date',
      'current_weight',
      'height',
      'gravida',
      'para',
      
      // Medical history
      'allergies',
      'chronic_diseases',
      
      // Emergency contacts
      'emergency_contact_name',
      'emergency_contact_phone',
      'emergency_relationship',
      
      // Family details
      'husband_name',
      'husband_contact',
      
      // Professional info
      'assigned_midwife_id',
      'is_high_risk'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
        // Handle special conversions
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

    // Update mother profile
    await Mother.update(updates, {
      where: { user_id: user_id },
      transaction
    });

    // Also update user's name, email, phone if provided
    if (req.body.full_name) {
      await User.update(
        { name: req.body.full_name },
        { where: { user_id: user_id }, transaction }
      );
    }
    
    if (req.body.email) {
      await User.update(
        { email: req.body.email },
        { where: { user_id: user_id }, transaction }
      );
    }
    
    if (req.body.mobile) {
      await User.update(
        { phone_no: req.body.mobile },
        { where: { user_id: user_id }, transaction }
      );
    }

    // Update profile_completed flag if all required fields are filled
    const updatedMother = await Mother.findOne({
      where: { user_id: user_id },
      transaction
    });

    // Check if profile is complete (has required fields)
    const isProfileComplete = updatedMother && 
      updatedMother.full_name && 
      updatedMother.dob && 
      updatedMother.blood_group && 
      updatedMother.expected_delivery_date;

    if (isProfileComplete) {
      await Mother.update(
        { profile_completed: true },
        { where: { user_id: user_id }, transaction }
      );
      
      await User.update(
        { profile_completed: true },
        { where: { user_id: user_id }, transaction }
      );
    }

    await transaction.commit();

    const finalMother = await Mother.findOne({
      where: { user_id: user_id }
    });
    
    const finalUser = await User.findByPk(user_id, {
      attributes: ['name', 'email', 'phone_no', 'profile_picture_url']
    });

    return success(res, { mother: finalMother, user: finalUser }, 'Profile updated successfully');
  } catch (err) {
    await transaction.rollback();
    console.error('Update profile error:', err);
    return error(res, 'Error updating profile: ' + err.message);
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { oldPassword, newPassword } = req.body;
    
    const user = await User.findByPk(user_id);
    
    if (!user) {
      return error(res, 'User not found', 404);
    }
    
    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return error(res, 'Current password is incorrect', 400);
    }
    
    if (newPassword.length < 8) {
      return error(res, 'New password must be at least 8 characters', 400);
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password_hash: hashedPassword },
      { where: { user_id: user_id } }
    );
    
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
    
    // Soft delete user
    await User.update(
      { is_active: false, is_deleted: true, deleted_at: new Date() },
      { where: { user_id: user_id }, transaction }
    );
    
    // Soft delete mother profile
    await Mother.update(
      { is_deleted: true },
      { where: { user_id: user_id }, transaction }
    );
    
    // Revoke all refresh tokens
    await RefreshToken.update(
      { is_revoked: true },
      { where: { user_id: user_id }, transaction }
    );
    
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
    
    await User.update(
      { profile_picture_url: profile_picture_url },
      { where: { user_id: user_id } }
    );
    
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
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'email', 'phone_no']
      }]
    });

    return success(res, { mothers });
  } catch (err) {
    console.error('Get all mothers error:', err);
    return error(res, 'Error fetching mothers');
  }
};

// Update mother medical details (vitals, weight, etc.)
const updateMedicalDetails = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const updates = {};
    
    // Medical fields that can be updated
    const medicalFields = [
      'current_weight',
      'blood_pressure_systolic',
      'blood_pressure_diastolic',
      'fetal_heart_rate',
      'fundal_height',
      'notes'
    ];
    
    medicalFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });
    
    await Mother.update(updates, {
      where: { user_id: user_id }
    });
    
    const updated = await Mother.findOne({
      where: { user_id: user_id }
    });
    
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
    
    // Check if mother profile exists
    let mother = await Mother.findOne({ where: { user_id: user_id }, transaction });
    
    if (!mother) {
      // Create new profile
      mother = await Mother.create({
        user_id: user_id,
        full_name: req.body.full_name || req.user.name,
        registered_date: new Date(),
        pregnancy_status: 'pregnant',
        ...req.body
      }, { transaction });
    } else {
      // Update existing profile
      await mother.update(req.body, { transaction });
    }
    
    // Update user profile_completed flag
    await User.update(
      { profile_completed: true },
      { where: { user_id: user_id }, transaction }
    );
    
    await transaction.commit();
    
    const updatedMother = await Mother.findOne({
      where: { user_id: user_id }
    });
    
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
  changePassword,
  deactivateAccount,
  uploadProfilePicture,
  getAllMothers,
  updateMedicalDetails,
  createOrUpdateProfile
};