const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Mother, Midwife, RefreshToken } = require('../models');
const jwtConfig = require('../config/jwtConfig');
const generateMotherID = require('../utils/generateMotherID');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// Generate Access Token
const generateAccessToken = (user_id, role) => {
  return jwt.sign(
    { user_id, role }, 
    jwtConfig.secret, 
    { expiresIn: jwtConfig.expiresIn }
  );
};

// Generate Refresh Token
const generateRefreshToken = async (user_id) => {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  await RefreshToken.create({
    user_id,
    token_hash: tokenHash,
    expires_at: expiresAt
  });
  
  return refreshToken;
};

// Register - FIXED with transaction and proper error handling
const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { fullName, mobile, email, password, role } = req.body;
    
    const roleMap = {
      'mother': 'mother',
      'provider': 'midwife',
      'admin': 'admin'
    };
    
    const backendRole = roleMap[role] || 'mother';
    
    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { phone_no: mobile },
          { email: email }
        ]
      },
      transaction
    });
    
    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'User with this phone number or email already exists'
      });
    }

    // Create user
    const user = await User.create({
      phone_no: mobile,
      email,
      name: fullName,
      password_hash: password,
      role: backendRole,
      profile_completed: false
    }, { transaction });

    // Create role-specific profile
    if (backendRole === 'mother') {
      // Generate unique mother code with retry
      let motherCode;
      let retries = 3;
      let created = false;
      
      while (retries > 0 && !created) {
        try {
          motherCode = await generateMotherID();
          await Mother.create({
            user_id: user.user_id,
            mother_code: motherCode,
            full_name: fullName,
            registered_date: new Date(),
            pregnancy_status: 'pregnant'
          }, { transaction });
          created = true;
        } catch (err) {
          retries--;
          if (retries === 0) throw err;
          console.log(`Retry creating mother profile. Attempts left: ${retries}`);
        }
      }
    }

    if (backendRole === 'midwife') {
      await Midwife.create({
        user_id: user.user_id,
        employee_id: `PHM-TEMP-${user.user_id}`,
        contact_number: mobile
      }, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    // Generate tokens
    const accessToken = generateAccessToken(user.user_id, backendRole);
    const refreshToken = await generateRefreshToken(user.user_id);

    // Update last login
    await User.update(
      { last_login: new Date() },
      { where: { user_id: user.user_id } }
    );

    // Prepare response
    const responseData = {
      accessToken,
      refreshToken,
      user: {
        user_id: user.user_id,
        phone_no: user.phone_no,
        email: user.email,
        name: user.name,
        role: backendRole,
        profile_completed: false
      }
    };

    // Add mother code to response if applicable
    if (backendRole === 'mother') {
      const mother = await Mother.findOne({ 
        where: { user_id: user.user_id } 
      });
      if (mother) {
        responseData.user.mother_code = mother.mother_code;
        responseData.user.mother_id = mother.mother_id;
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: responseData
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Registration error details:', error);
    
    // Handle duplicate key error specifically
    if (error.name === 'SequelizeUniqueConstraintError' || error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'Registration failed due to duplicate entry. Please try again.'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login with email
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
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
        message: 'Invalid email or password'
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
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Login failed. Please try again.'
    });
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
        userData.blood_group = mother.blood_group;
      } else {
        console.warn(`User ${user.user_id} has role 'mother' but no mother profile found`);
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

// Refresh token
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash: tokenHash,
        is_revoked: false,
        expires_at: {
          [Op.gt]: new Date()
        }
      }
    });

    if (!storedToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const user = await User.findByPk(storedToken.user_id);
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    const newAccessToken = generateAccessToken(user.user_id, user.role);
    const newRefreshToken = await generateRefreshToken(storedToken.user_id);

    await RefreshToken.update(
      { is_revoked: true },
      { where: { token_id: storedToken.token_id } }
    );

    return res.json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
};

// Get current user
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      user_id: user.user_id,
      phone_no: user.phone_no,
      email: user.email,
      name: user.name,
      role: user.role,
      profile_completed: user.profile_completed,
      profile_picture_url: user.profile_picture_url,
      is_active: user.is_active,
      last_login: user.last_login
    };

    if (user.role === 'mother') {
      const mother = await Mother.findOne({ where: { user_id: user.user_id } });
      if (mother) {
        userData.mother_profile = {
          mother_id: mother.mother_id,
          mother_code: mother.mother_code,
          pregnancy_status: mother.pregnancy_status,
          expected_delivery_date: mother.expected_delivery_date,
          is_high_risk: mother.is_high_risk,
          blood_group: mother.blood_group
        };
      }
    }

    if (user.role === 'midwife') {
      const midwife = await Midwife.findOne({ where: { user_id: user.user_id } });
      if (midwife) {
        userData.midwife_profile = {
          midwife_id: midwife.midwife_id,
          employee_id: midwife.employee_id,
          assigned_area: midwife.assigned_area,
          district: midwife.district
        };
      }
    }

    return res.json({
      success: true,
      data: { user: userData }
    });

  } catch (error) {
    console.error('Get me error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Check profile status
const checkProfileStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'name', 'role', 'profile_completed']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile_id = null;
    if (user.role === 'mother') {
      const mother = await Mother.findOne({ 
        where: { user_id: user.user_id },
        attributes: ['mother_id']
      });
      if (mother) profile_id = mother.mother_id;
    } else if (user.role === 'midwife') {
      const midwife = await Midwife.findOne({ 
        where: { user_id: user.user_id },
        attributes: ['midwife_id']
      });
      if (midwife) profile_id = midwife.midwife_id;
    }

    return res.json({
      success: true,
      data: {
        user_id: user.user_id,
        name: user.name,
        role: user.role,
        profile_completed: user.profile_completed,
        show_popup: !user.profile_completed,
        profile_id: profile_id
      }
    });

  } catch (error) {
    console.error('Check profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error checking profile status'
    });
  }
};

// Complete profile
const completeProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user_id = req.user.user_id;

    if (req.user.role === 'mother') {
      const updateData = {};

      if (req.body.fullName) updateData.full_name = req.body.fullName;
      if (req.body.nic) updateData.nic = req.body.nic;
      if (req.body.dob) updateData.dob = req.body.dob;
      if (req.body.address) updateData.address = req.body.address;
      if (req.body.district) updateData.district = req.body.district;
      if (req.body.bloodGroup) updateData.blood_group = req.body.bloodGroup;
      if (req.body.pregnancyStatus) updateData.pregnancy_status = req.body.pregnancyStatus;
      if (req.body.lmpDate) updateData.lmp_date = req.body.lmpDate;
      if (req.body.gestationalWeeks) updateData.gestational_weeks = parseInt(req.body.gestationalWeeks) || null;
      if (req.body.expectedDeliveryDate) updateData.expected_delivery_date = req.body.expectedDeliveryDate;
      if (req.body.currentWeight) updateData.current_weight = parseFloat(req.body.currentWeight);
      if (req.body.height) updateData.height = parseFloat(req.body.height);
      if (req.body.husbandName) updateData.husband_name = req.body.husbandName;
      if (req.body.husbandContact) updateData.husband_contact = req.body.husbandContact;
      if (req.body.emergencyContact) updateData.emergency_contact_phone = req.body.emergencyContact;

      await Mother.update(updateData, { where: { user_id }, transaction });
      await User.update({ profile_completed: true }, { where: { user_id }, transaction });

      await transaction.commit();

      return res.json({
        success: true,
        message: 'Profile completed successfully'
      });
    }

    if (req.user.role === 'midwife') {
      const { employee_id, qualification, years_of_experience, assigned_area, district } = req.body;
      
      const updateData = {};
      if (employee_id) updateData.employee_id = employee_id;
      if (qualification) updateData.qualification = qualification;
      if (years_of_experience) updateData.years_of_experience = parseInt(years_of_experience);
      if (assigned_area) updateData.assigned_area = assigned_area;
      if (district) updateData.district = district;

      await Midwife.update(updateData, { where: { user_id }, transaction });
      await User.update({ profile_completed: true }, { where: { user_id }, transaction });

      await transaction.commit();

      return res.json({
        success: true,
        message: 'Profile completed successfully'
      });
    }

    await transaction.rollback();
    
    return res.status(400).json({
      success: false,
      message: 'Invalid role for profile completion'
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Complete profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error completing profile'
    });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
      await RefreshToken.update(
        { is_revoked: true },
        { where: { token_hash: tokenHash } }
      );
    }

    return res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
};

module.exports = {
  register,
  login,
  loginByName, // Added this new function
  refreshAccessToken,
  getMe,
  checkProfileStatus,
  completeProfile,
  logout
};