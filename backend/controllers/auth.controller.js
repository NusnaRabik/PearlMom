const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Mother, Midwife, RefreshToken } = require('../models');
const jwtConfig = require('../config/jwtConfig');
const generateMotherID = require('../utils/generateMotherID');
const { success, error } = require('../utils/response');
const { sequelize } = require('../config/db');
const { Op, fn, col, where } = require('sequelize');
const bcrypt = require('bcryptjs');

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

const isRoleMatch = (actualRole, requestedRole) => {
  if (!requestedRole) return true;
  const normalizedRole = requestedRole.toLowerCase();
  if (normalizedRole === 'provider') {
    return actualRole === 'midwife' || actualRole === 'doctor';
  }
  return actualRole === normalizedRole;
};

// Register
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

    // Create user; password hashing is handled by User.beforeCreate hook
    const user = await User.create({
      phone_no: mobile,
      email,
      name: fullName,
      password_hash: password,
      role: backendRole,
      profile_completed: false,
      is_active: true
    }, { transaction });

    // Create role-specific profile
    if (backendRole === 'mother') {
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
            pregnancy_status: 'pregnant',
            gravida: 1,
            para: 0,
            is_high_risk: false
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
      const timestamp = Date.now().toString().slice(-6);
      const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const employeeId = `PHM-${timestamp}${random}`;
      
      await Midwife.create({
        user_id: user.user_id,
        employee_id: employeeId,
        full_name: fullName,
        contact_number: mobile,
        is_active: true,
        is_deleted: false,
        profile_completed: false
      }, { transaction });
    }

    await transaction.commit();

    const accessToken = generateAccessToken(user.user_id, backendRole);
    const refreshToken = await generateRefreshToken(user.user_id);

    await User.update(
      { last_login: new Date() },
      { where: { user_id: user.user_id } }
    );

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

    if (backendRole === 'mother') {
      const mother = await Mother.findOne({ where: { user_id: user.user_id } });
      if (mother) {
        responseData.user.mother_code = mother.mother_code;
        responseData.user.mother_id = mother.mother_id;
      }
    }

    if (backendRole === 'midwife') {
      const midwife = await Midwife.findOne({ where: { user_id: user.user_id } });
      if (midwife) {
        responseData.user.midwife_id = midwife.midwife_id;
        responseData.user.employee_id = midwife.employee_id;
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: responseData
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Registration error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// Login by Full Name (for mother, provider, and admin)
const loginByName = async (req, res) => {
  try {
    const { fullName, password, role } = req.body;
    const requestedRole = role?.toLowerCase();
    const normalizedFullName = fullName?.trim() || '';
    const normalizedFullNameLower = normalizedFullName.toLowerCase();
    const normalizedPassword = password?.trim();

    console.log('Login attempt:', { fullName: normalizedFullName, role: requestedRole, password: '***' });

    let user = null;
    let foundIn = null;

    const buildNameCondition = (column) => where(fn('LOWER', col(column)), normalizedFullNameLower);
    const buildEmailCondition = () => where(fn('LOWER', col('email')), normalizedFullNameLower);
    const providerIdOrNameCondition = {
      [Op.or]: [
        buildNameCondition('full_name'),
        { employee_id: normalizedFullName }
      ]
    };

    const findMidwife = async () => {
      return await Midwife.findOne({ where: providerIdOrNameCondition });
    };

    // === ADMIN & GENERAL FALLBACK FIRST (most reliable for admin) ===
    if (requestedRole === 'admin' || !requestedRole) {
      user = await User.findOne({ 
        where: {
          [Op.or]: [
            buildNameCondition('name'),
            buildEmailCondition()
          ]
        }
      });
      if (user) {
        console.log('Found admin/general user in users table');
        foundIn = 'users';
      }
    }

    // If logging in as provider, search provider profile
    if (!user && requestedRole === 'provider') {
      const midwife = await findMidwife();
      if (midwife) {
        console.log('Found in midwives table:', midwife.midwife_id);
        user = await User.findOne({ where: { user_id: midwife.user_id } });
        foundIn = 'midwives';
      }
    }

    // If logging in as mother, search mother profile
    if (!user && requestedRole === 'mother') {
      const mother = await Mother.findOne({ where: buildNameCondition('full_name') });
      if (mother) {
        console.log('Found in mothers table:', mother.mother_id);
        user = await User.findOne({ where: { user_id: mother.user_id } });
        foundIn = 'mothers';
      }
    }

    // Final fallback - search users table by name (for any role)
    if (!user) {
      user = await User.findOne({ where: buildNameCondition('name') });
      if (user) {
        console.log('Found in users table by name (fallback)');
        foundIn = 'users_name';
      }
    }

    // Try by email as last resort
    if (!user) {
      user = await User.findOne({ where: buildEmailCondition() });
      if (user) {
        console.log('Found in users table by email');
        foundIn = 'users_email';
      }
    }

    if (!user) {
      console.log('User not found for:', normalizedFullName);
      return res.status(401).json({
        success: false,
        message: 'Invalid full name or password'
      });
    }

    console.log('User found:', { user_id: user.user_id, role: user.role, foundIn });
    console.log('Stored password hash:', user.password_hash);
    console.log('Input password length:', normalizedPassword?.length || 0);

    // Check if user is active
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

    // Verify password - Enhanced with better error handling
        // Verify password
    let isPasswordValid = false;
    
    try {
      isPasswordValid = await user.comparePassword(normalizedPassword);
      console.log('Password valid (standard):', isPasswordValid);
    } catch (err) {
      console.error('Password compare error:', err.message);
    }

    if (!isPasswordValid) {
      console.log('❌ Password verification failed');
      return res.status(401).json({
        success: false,
        message: 'Invalid full name or password'
      });
    }
    
    if (!isPasswordValid) {
      console.log('Password validation FAILED for user:', user.name);
      return res.status(401).json({
        success: false,
        message: 'Invalid full name or password'
      });
    }

    console.log('Password validation SUCCESS for user:', user.name);

    // Check role match if role was specified
    if (requestedRole && !isRoleMatch(user.role, requestedRole)) {
      return res.status(403).json({
        success: false,
        message: `This account is not registered as a ${requestedRole}`
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

    // Add mother data if role is mother
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
        userData.dob = mother.dob;
        userData.address = mother.address;
        userData.district = mother.district;
        userData.current_weight = mother.current_weight;
        userData.height = mother.height;
      }
    }

    // Add midwife data if role is midwife
    if (user.role === 'midwife') {
      const midwife = await Midwife.findOne({ where: { user_id: user.user_id } });
      if (midwife) {
        userData.midwife_id = midwife.midwife_id;
        userData.employee_id = midwife.employee_id;
        userData.assigned_area = midwife.assigned_area;
        userData.full_name = midwife.full_name;
        userData.contact_number = midwife.contact_number;
        userData.district = midwife.district;
        userData.qualification = midwife.qualification;
        userData.years_of_experience = midwife.years_of_experience;
      }
    }

    console.log('Login successful for:', userData.name);

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

// Login with email (for backward compatibility)
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    const user = await User.findOne({ where: { email: normalizedEmail } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordValid = await user.comparePassword(normalizedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (role && !isRoleMatch(user.role, role)) {
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
      const { qualification, years_of_experience, assigned_area, district } = req.body;
      
      const updateData = {};
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
// Change password (for authenticated user)
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters'
      });
    }
    
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const isValid = await user.comparePassword(oldPassword);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ 
      password_hash: hashedPassword,
      updated_at: new Date()
    });
    
    return res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error changing password: ' + error.message
    });
  }
};

// Update profile (for authenticated user)
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone_no } = req.body;
    
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if email is taken by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ 
        where: { 
          email: email,
          user_id: { [Op.ne]: req.user.user_id }
        } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use'
        });
      }
    }
    
    // Check if phone is taken by another user
    if (phone_no && phone_no !== user.phone_no) {
      const existingUser = await User.findOne({ 
        where: { 
          phone_no: phone_no,
          user_id: { [Op.ne]: req.user.user_id }
        } 
      });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Phone number already in use'
        });
      }
    }
    
    // Update user
    await user.update({
      name: name || user.name,
      email: email || user.email,
      phone_no: phone_no || user.phone_no,
      updated_at: new Date()
    });
    
    // If user is mother, also update mother's full_name
    if (user.role === 'mother' && name) {
      await Mother.update(
        { full_name: name },
        { where: { user_id: user.user_id } }
      );
    }
    
    // If user is midwife, also update midwife's full_name
    if (user.role === 'midwife' && name) {
      await Midwife.update(
        { full_name: name },
        { where: { user_id: user.user_id } }
      );
    }
    
    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          user_id: user.user_id,
          name: user.name,
          email: user.email,
          phone_no: user.phone_no,
          role: user.role,
          profile_completed: user.profile_completed,
          profile_picture_url: user.profile_picture_url
        }
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error updating profile: ' + error.message
    });
  }
};

// Forgot password - send reset link
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }
    
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 hour
    
    await user.update({
      reset_token: resetTokenHash,
      reset_token_expires: resetTokenExpires
    });
    
    // In a real app, send email here
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset link: http://localhost:5173/reset-password?token=${resetToken}`);
    
    return res.json({
      success: true,
      message: 'Password reset link has been sent to your email'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error sending reset link'
    });
  }
};

// Reset password with token
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }
    
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    
    const user = await User.findOne({
      where: {
        reset_token: tokenHash,
        reset_token_expires: { [Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({
      password_hash: hashedPassword,
      reset_token: null,
      reset_token_expires: null
    });
    
    return res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
};

// Upload profile picture
const uploadProfilePicture = async (req, res) => {
  try {
    const { profile_picture_url } = req.body;
    
    const user = await User.findByPk(req.user.user_id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    await user.update({
      profile_picture_url: profile_picture_url,
      updated_at: new Date()
    });
    
    return res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: { profile_picture_url }
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error uploading profile picture'
    });
  }
};
module.exports = {
  register,
  login,
  loginByName,
  refreshAccessToken,
  getMe,
  checkProfileStatus,
  completeProfile,
  logout,
  changePassword,      // Add this
  updateProfile,       // Add this
  forgotPassword,      // Add this
  resetPassword,       // Add this
  uploadProfilePicture
};