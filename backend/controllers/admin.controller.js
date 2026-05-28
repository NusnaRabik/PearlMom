const { User, Mother, Midwife, Appointment, Vaccination, Notification, ClinicVisit } = require('../models');
const { sequelize } = require('../config/db');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const generateMotherID = require('../utils/generateMotherID');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const totalMothers = await Mother.count({ where: { is_deleted: false } });
    const activeProviders = await Midwife.count({ where: { is_active: true, is_deleted: false } });
    const highRiskCases = await Mother.count({ where: { is_high_risk: true, is_deleted: false } });
    const totalMothersForVaccine = await Mother.count({ where: { is_deleted: false } });

    const vaccinatedMothers = await Vaccination.count({
      where: {
        vaccine_name: { [Op.like]: '%Tetanus%' },
        status: 'completed',
        dose_number: 2
      }
    });

    const vaccinationCoverage = totalMothersForVaccine > 0
      ? ((vaccinatedMothers / totalMothersForVaccine) * 100).toFixed(1)
      : '0';

    const monthlyData = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const nextMonth = new Date(today.getFullYear(), today.getMonth() - i + 1, 1);
      const count = await Mother.count({
        where: {
          created_at: { [Op.gte]: monthDate, [Op.lt]: nextMonth },
          is_deleted: false
        }
      });
      monthlyData.push({ month: months[monthDate.getMonth()], total: count });
    }

    const recentMothers = await Mother.findAll({
      where: { is_deleted: false },
      attributes: ['full_name', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 3
    });

    const recentMidwives = await Midwife.findAll({
      where: { is_deleted: false },
      attributes: ['full_name', 'created_at', 'employee_id'],
      order: [['created_at', 'DESC']],
      limit: 3
    });

    const recentActivity = [
      ...recentMothers.map(m => ({
        timestamp: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: m.full_name,
        action: `New Mother Registration: ${m.full_name}`,
        status: 'success',
        date: m.created_at
      })),
      ...recentMidwives.map(mw => ({
        timestamp: new Date(mw.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: mw.full_name,
        action: `New Provider Registration: ${mw.full_name} (${mw.employee_id})`,
        status: 'success',
        date: mw.created_at
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const completedVisits = await ClinicVisit.count({ where: { status: 'completed' } });
    const totalVisits = await ClinicVisit.count();
    const deliverySuccessRate = totalVisits > 0
      ? ((completedVisits / totalVisits) * 100).toFixed(1)
      : '98.2';

    const activeMaternalRecords = await Mother.count({
      where: { profile_completed: true, is_deleted: false }
    });

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const providersThisMonth = await Midwife.count({
      where: { created_at: { [Op.gte]: startOfMonth }, is_deleted: false }
    });

    return successResponse(res, {
      stats: {
        totalMothers, activeProviders, highRiskCases,
        vaccinationCoverage: `${vaccinationCoverage}%`,
        monthlyData, recentActivity,
        deliverySuccessRate: `${deliverySuccessRate}%`,
        activeMaternalRecords, providersThisMonth,
        uptime: '99.9', lastAudit: 'Today', encryption: 'AES-256'
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return errorResponse(res, 'Error fetching dashboard data: ' + error.message);
  }
};

// @desc    Get all users (including deactivated)
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { is_deleted: false };
    
    if (status === 'active') {
      where.is_active = true;
    } else if (status === 'inactive') {
      where.is_active = false;
    }
    
    if (role && role !== 'all') where.role = role;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, {
      users: rows,
      pagination: { 
        total: count, 
        page: parseInt(page), 
        pages: Math.ceil(count / limit),
        active_count: await User.count({ where: { is_active: true, is_deleted: false } }),
        inactive_count: await User.count({ where: { is_active: false, is_deleted: false } })
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return errorResponse(res, 'Error fetching users');
  }
};

// @desc    Get user statistics (active/inactive counts)
// @route   GET /api/admin/user-stats
// @desc    Get user statistics (active/inactive counts)
// @route   GET /api/admin/user-stats
const getUserStats = async (req, res) => {
  try {
    const activeUsers = await User.count({ where: { is_active: true, is_deleted: false } });
    const inactiveUsers = await User.count({ where: { is_active: false, is_deleted: false } });
    const totalMothers = await Mother.count({ where: { is_deleted: false } });
    const totalProviders = await Midwife.count({ where: { is_deleted: false } });
    const pendingMothers = await Mother.count({ where: { profile_completed: false, is_deleted: false } });
    
    console.log('User stats:', { activeUsers, inactiveUsers, totalMothers, totalProviders, pendingMothers });
    
    return successResponse(res, {
      stats: {
        active_users: activeUsers,
        inactive_users: inactiveUsers,
        total_mothers: totalMothers,
        total_providers: totalProviders,
        pending_approvals: pendingMothers
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return errorResponse(res, 'Error fetching user statistics');
  }
};

// @desc    Reactivate user account
// @route   POST /api/admin/users/:id/reactivate
const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByPk(id);
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }
    
    await user.update({ 
      is_active: true,
      updated_at: new Date()
    });
    
    return successResponse(res, { user }, 'User reactivated successfully');
  } catch (error) {
    console.error('Error reactivating user:', error);
    return errorResponse(res, 'Error reactivating user');
  }
};

// @desc    Bulk deactivate users
// @route   POST /api/admin/users/bulk-deactivate
const bulkDeactivateUsers = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_ids } = req.body;
    
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      await transaction.rollback();
      return errorResponse(res, 'User IDs array is required', 400);
    }
    
    await User.update(
      { is_active: false, updated_at: new Date() },
      { where: { user_id: user_ids }, transaction }
    );
    
    await transaction.commit();
    
    return successResponse(res, { deactivated_count: user_ids.length }, `${user_ids.length} users deactivated successfully`);
  } catch (error) {
    await transaction.rollback();
    console.error('Error bulk deactivating users:', error);
    return errorResponse(res, 'Error deactivating users');
  }
};

// @desc    Bulk activate users
// @route   POST /api/admin/users/bulk-activate
const bulkActivateUsers = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { user_ids } = req.body;
    
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      await transaction.rollback();
      return errorResponse(res, 'User IDs array is required', 400);
    }
    
    await User.update(
      { is_active: true, updated_at: new Date() },
      { where: { user_id: user_ids }, transaction }
    );
    
    await transaction.commit();
    
    return successResponse(res, { activated_count: user_ids.length }, `${user_ids.length} users activated successfully`);
  } catch (error) {
    await transaction.rollback();
    console.error('Error bulk activating users:', error);
    return errorResponse(res, 'Error activating users');
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @desc    Update user
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, role, is_active } = req.body;

    const user = await User.findOne({ where: { user_id: id, is_deleted: false } });
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Build update object with only provided fields
    const updateFields = {};
    if (name !== undefined)      updateFields.name      = name;
    if (email !== undefined)     updateFields.email     = email;
    if (phone_no !== undefined)  updateFields.phone_no  = phone_no;
    if (role !== undefined)      updateFields.role      = role;
    if (is_active !== undefined) updateFields.is_active = is_active;
    updateFields.updated_at = new Date();

    await user.update(updateFields);

    return successResponse(res, { user }, 'User updated successfully');
  } catch (error) {
    console.error('Error updating user:', error);
    return errorResponse(res, 'Error updating user: ' + error.message);
  }
};

// @desc    Delete user (soft delete)
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.update({ is_deleted: true, deleted_at: new Date() }, { where: { user_id: id } });
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    console.error('Error deleting user:', error);
    return errorResponse(res, 'Error deleting user');
  }
};

// @desc    Get system stats
// @route   GET /api/admin/system-stats
const getSystemStats = async (req, res) => {
  try {
    const activeUsers = await User.count({ where: { is_active: true, is_deleted: false } });
    const totalAppointments = await Appointment.count();
    const totalVaccinations = await Vaccination.count();
    const unreadNotifications = await Notification.count({ where: { is_read: false } });

    return successResponse(res, { activeUsers, totalAppointments, totalVaccinations, unreadNotifications });
  } catch (error) {
    console.error('Error fetching system stats:', error);
    return errorResponse(res, 'Error fetching system stats');
  }
};

// @desc    Admin adds a new Mother
// @route   POST /api/admin/add-mother
const addMother = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      full_name, nic, dob, phone_no, email,
      address, district, gs_division, blood_group,
      lmp_date, expected_delivery_date, current_weight, height,
      pregnancy_status, gravida, para, is_high_risk,
      emergency_contact_name, emergency_contact_phone, emergency_relationship,
      husband_name, husband_contact, allergies, chronic_diseases
    } = req.body;

    if (!full_name || !nic || !phone_no || !current_weight || !height) {
      await transaction.rollback();
      return errorResponse(res, 'full_name, nic, phone_no, current_weight, and height are required.', 400);
    }

    const existingMother = await Mother.findOne({ where: { nic }, transaction });
    if (existingMother) {
      await transaction.rollback();
      return errorResponse(res, `A mother with NIC ${nic} already exists.`, 400);
    }

    const existingUser = await User.findOne({ where: { phone_no }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return errorResponse(res, `A user with phone number ${phone_no} already exists.`, 400);
    }

    const defaultPassword = full_name.toLowerCase().replace(/\s+/g, '') + '@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name: full_name,
      phone_no,
      email: email || `${full_name.toLowerCase().replace(/\s+/g, '')}_${Date.now()}@pearlmom.lk`,
      password_hash: hashedPassword,
      role: 'mother',
      is_active: true,
      profile_completed: true
    }, { transaction });

    let weeks = null;
    if (lmp_date) {
      const diffDays = Math.floor((new Date() - new Date(lmp_date)) / 86400000);
      weeks = Math.min(42, Math.max(0, Math.floor(diffDays / 7)));
    }

    const mother_code = await generateMotherID();

    const mother = await Mother.create({
      user_id: user.user_id,
      mother_code,
      full_name,
      nic,
      dob: dob || null,
      address: address || null,
      district: district || null,
      gs_division: gs_division || null,
      blood_group: blood_group || null,
      lmp_date: lmp_date || null,
      expected_delivery_date: expected_delivery_date || null,
      current_weight: current_weight ? parseFloat(current_weight) : null,
      height: height ? parseFloat(height) : null,
      pregnancy_status: pregnancy_status || 'pregnant',
      gravida: gravida ? parseInt(gravida) : 1,
      para: para ? parseInt(para) : 0,
      is_high_risk: is_high_risk === true || is_high_risk === 'true',
      weeks,
      emergency_contact_name: emergency_contact_name || null,
      emergency_contact_phone: emergency_contact_phone || null,
      emergency_relationship: emergency_relationship || null,
      husband_name: husband_name || null,
      husband_contact: husband_contact || null,
      allergies: allergies || null,
      chronic_diseases: chronic_diseases || null,
      registered_date: new Date(),
      profile_completed: true,
      is_deleted: false
    }, { transaction });

    await transaction.commit();

    return successResponse(res, {
      mother,
      user: {
        user_id: user.user_id, name: user.name,
        email: user.email, phone_no: user.phone_no, role: user.role
      },
      default_password: defaultPassword
    }, `Mother "${full_name}" added successfully. Default password: ${defaultPassword}`, 201);

  } catch (error) {
    await transaction.rollback();
    console.error('Admin addMother error:', error);
    return errorResponse(res, 'Error adding mother: ' + error.message, 500);
  }
};

// @desc    Admin adds a new Provider / Midwife
// @route   POST /api/admin/add-provider
const addProvider = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { full_name, contact_number, email, assigned_area, district, qualification, years_of_experience } = req.body;

    if (!full_name || !contact_number || !email) {
      await transaction.rollback();
      return errorResponse(res, 'full_name, contact_number, and email are required.', 400);
    }

    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return errorResponse(res, `A user with email ${email} already exists.`, 400);
    }

    const defaultPassword = full_name.toLowerCase().replace(/\s+/g, '') + '@123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name: full_name,
      phone_no: contact_number,
      email,
      password_hash: hashedPassword,
      role: 'midwife',
      is_active: true,
      profile_completed: true
    }, { transaction });

    const count = await Midwife.count({ transaction });
    const employee_id = `MW-${String(count + 1).padStart(4, '0')}`;

    const midwife = await Midwife.create({
      user_id: user.user_id,
      employee_id,
      full_name,
      contact_number,
      assigned_area: assigned_area || null,
      district: district || null,
      qualification: qualification || null,
      years_of_experience: years_of_experience ? parseInt(years_of_experience) : null,
      is_active: true,
      is_deleted: false,
      profile_completed: true
    }, { transaction });

    await transaction.commit();

    return successResponse(res, {
      midwife,
      user: {
        user_id: user.user_id, name: user.name,
        email: user.email, phone_no: user.phone_no, role: user.role
      },
      default_password: defaultPassword
    }, `Provider "${full_name}" added successfully. Default password: ${defaultPassword}`, 201);

  } catch (error) {
    await transaction.rollback();
    console.error('Admin addProvider error:', error);
    return errorResponse(res, 'Error adding provider: ' + error.message, 500);
  }
};

// @desc    Admin adds another Admin
// @route   POST /api/admin/add-admin
const addAdmin = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { full_name, email, password, phone_no } = req.body;

    if (!full_name || !email || !password) {
      await transaction.rollback();
      return errorResponse(res, 'full_name, email, and password are required.', 400);
    }
    if (password.length < 8) {
      await transaction.rollback();
      return errorResponse(res, 'Password must be at least 8 characters.', 400);
    }

    const existingUser = await User.findOne({ where: { email }, transaction });
    if (existingUser) {
      await transaction.rollback();
      return errorResponse(res, `A user with email ${email} already exists.`, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const defaultPhoneNo = phone_no || `ADMIN${Date.now().toString().slice(-8)}`;

    const user = await User.create({
      name: full_name,
      email,
      phone_no: defaultPhoneNo,
      password_hash: hashedPassword,
      role: 'admin',
      is_active: true,
      profile_completed: true
    }, { transaction });

    await transaction.commit();

    return successResponse(res, {
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no,
        role: user.role
      }
    }, `Admin "${full_name}" added successfully.`, 201);

  } catch (error) {
    await transaction.rollback();
    console.error('Admin addAdmin error:', error);
    return errorResponse(res, 'Error adding admin: ' + error.message, 500);
  }
};
// Add these functions to your admin.controller.js

// @desc    Get alert preferences
// @route   GET /api/admin/alert-preferences
const getAlertPreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['alert_preferences']
    });
    
    const defaultPreferences = {
      criticalSystemAlerts: true,
      securityLoginAlerts: true,
      newUserRegistration: true
    };
    
    let preferences = defaultPreferences;
    if (user && user.alert_preferences) {
      try {
        preferences = JSON.parse(user.alert_preferences);
      } catch (e) {
        preferences = defaultPreferences;
      }
    }
    
    return successResponse(res, { preferences });
  } catch (error) {
    console.error('Error getting alert preferences:', error);
    return errorResponse(res, 'Error fetching alert preferences');
  }
};

// @desc    Update alert preferences
// @route   PUT /api/admin/alert-preferences
const updateAlertPreferences = async (req, res) => {
  try {
    const { criticalSystemAlerts, securityLoginAlerts, newUserRegistration } = req.body;
    
    const preferences = {
      criticalSystemAlerts: criticalSystemAlerts !== undefined ? criticalSystemAlerts : true,
      securityLoginAlerts: securityLoginAlerts !== undefined ? securityLoginAlerts : true,
      newUserRegistration: newUserRegistration !== undefined ? newUserRegistration : true
    };
    
    await User.update(
      { alert_preferences: JSON.stringify(preferences) },
      { where: { user_id: req.user.user_id } }
    );
    
    return successResponse(res, { preferences }, 'Alert preferences updated successfully');
  } catch (error) {
    console.error('Error updating alert preferences:', error);
    return errorResponse(res, 'Error updating alert preferences');
  }
};
// @desc    Get detailed user info by user_id (joins role-specific table)
// @route   GET /api/admin/users/:id/details
const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: { 
        user_id: id, 
        is_deleted: false 
        // ← NO is_active filter here — deactivated users must be fetchable
      },
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    let roleDetails = null;

    if (user.role === 'mother') {
      roleDetails = await Mother.findOne({
        where: { 
          user_id: id, 
          is_deleted: false 
          // ← NO is_active filter here either
        }
      });
    } else if (user.role === 'midwife') {
      roleDetails = await Midwife.findOne({
        where: { 
          user_id: id, 
          is_deleted: false 
        }
      });
    }

    return successResponse(res, {
      user: user.toJSON(),
      roleDetails: roleDetails ? roleDetails.toJSON() : null
    });

  } catch (error) {
    console.error('Error fetching user details:', error);
    return errorResponse(res, 'Error fetching user details');
  }
};

module.exports = {
  getDashboard,
  getAllUsers,
  getUserStats,
  reactivateUser,
  bulkDeactivateUsers,
  bulkActivateUsers,
  updateUser,
  deleteUser,
  getSystemStats,
  addMother,
  addProvider,
  addAdmin,
  getAlertPreferences,     // Add this
  updateAlertPreferences,
  getUserDetails
};