const { User, Mother, Midwife, Appointment, Vaccination, Notification, sequelize } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const totalMothers = await Mother.count({ where: { is_deleted: false } });
    const totalProviders = await Midwife.count({ where: { is_deleted: false } });
    const totalUsers = await User.count({ where: { is_deleted: false } });
    const highRiskMothers = await Mother.count({ where: { is_high_risk: true, is_deleted: false } });
    const pendingAppointments = await Appointment.count({ where: { status: 'scheduled', appointment_date: { [Op.gte]: new Date() } } });
    const completedAppointments = await Appointment.count({ where: { status: 'completed' } });

    return successResponse(res, {
      stats: { totalMothers, totalProviders, totalUsers, highRiskMothers, pendingAppointments, completedAppointments }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return errorResponse(res, 'Error fetching dashboard data');
  }
};
// Login by Full Name (for mother login)
const loginByName = async (req, res) => {
  try {
    const { fullName, password, role } = req.body;

    let user = null;
    
    // If role is mother, first try to find by full name in mothers table
    if (role === 'mother') {
      const mother = await Mother.findOne({ 
        where: { full_name: fullName }
      });
      
      if (mother) {
        user = await User.findOne({ where: { user_id: mother.user_id } });
      }
    } 
    
    // If not found in mothers or role is not mother, try users table by name
    if (!user) {
      user = await User.findOne({ where: { name: fullName } });
    }
    
    // If still not found, try by email (backward compatibility)
    if (!user) {
      user = await User.findOne({ where: { email: fullName } });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid full name or password'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }

    if (user.is_deleted) {
      return res.status(401).json({
        success: false,
        message: 'Account not found'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid full name or password'
      });
    }

    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is not registered as a ${role}`
      });
    }

    const accessToken = generateAccessToken(user.user_id, user.role);
    const refreshToken = await generateRefreshToken(user.user_id);

    await User.update(
      { last_login: new Date() },
      { where: { user_id: user.user_id } }
    );

    const userData = {
      user_id: user.user_id,
      phone_no: user.phone_no,
      email: user.email,
      name: user.name,
      role: user.role,
      profile_completed: user.profile_completed,
      profile_picture_url: user.profile_picture_url
    };

    if (user.role === 'mother') {
      const mother = await Mother.findOne({ where: { user_id: user.user_id } });
      if (mother) {
        userData.mother_id = mother.mother_id;
        userData.mother_code = mother.mother_code;
        userData.pregnancy_status = mother.pregnancy_status;
        userData.is_high_risk = mother.is_high_risk;
        userData.expected_delivery_date = mother.expected_delivery_date;
        userData.full_name = mother.full_name;
      }
    }

    if (user.role === 'midwife') {
      const midwife = await Midwife.findOne({ where: { user_id: user.user_id } });
      if (midwife) {
        userData.midwife_id = midwife.midwife_id;
        userData.employee_id = midwife.employee_id;
        userData.assigned_area = midwife.assigned_area;
      }
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
        refreshToken,
        user: userData
      }
    });

  } catch (error) {
    console.error('Login by name error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { is_deleted: false };
    if (role && role !== 'all') where.role = role;
    if (status === 'active') where.is_active = true;
    if (status === 'inactive') where.is_active = false;

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password_hash'] },
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, {
      users: rows,
      pagination: { total: count, page: parseInt(page), pages: Math.ceil(count / limit) }
    });
  } catch (error) {
    return errorResponse(res, 'Error fetching users');
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_no, role, is_active } = req.body;

    await User.update({ name, email, phone_no, role, is_active }, { where: { user_id: id } });

    return successResponse(res, null, 'User updated successfully');
  } catch (error) {
    return errorResponse(res, 'Error updating user');
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
    return errorResponse(res, 'Error fetching system stats');
  }
};

module.exports = { getDashboard, getAllUsers, updateUser, deleteUser, getSystemStats };