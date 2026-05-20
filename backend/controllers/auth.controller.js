const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User, Mother, Midwife, RefreshToken } = require('../models');
const jwtConfig = require('../config/jwtConfig');
const generateMotherID = require('../utils/generateMotherID');
const { successResponse, errorResponse } = require('../utils/responseHelper');

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
  // Create random token
  const refreshToken = crypto.randomBytes(40).toString('hex');
  
  // Hash it for storage
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  // Set expiry (7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  // Store in database
  await RefreshToken.create({
    user_id,
    token_hash: tokenHash,
    expires_at: expiresAt
  });
  
  return refreshToken;
};

// @desc    Register a new mother
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { fullName, mobile, email, password, role } = req.body;
    
    // Map role from frontend to backend
    const roleMap = {
      'mother': 'mother',
      'provider': 'midwife',
      'admin': 'admin'
    };
    
    const backendRole = roleMap[role] || 'mother';
    
    // Check if user exists
    const existingUser = await User.findOne({
      where: {
        [require('sequelize').Op.or]: [
          { phone_no: mobile },
          { email: email }
        ]
      }
    });
    
    if (existingUser) {
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
      profile_completed: false // Will trigger popup
    });

    // If mother, create mother profile placeholder
    if (backendRole === 'mother') {
      const motherCode = await generateMotherID();
      await Mother.create({
        user_id: user.user_id,
        mother_code: motherCode,
        full_name: fullName,
        registered_date: new Date(),
        pregnancy_status: 'pregnant'
      });
    }

    // If midwife/provider, create midwife profile placeholder
    if (backendRole === 'midwife') {
      await Midwife.create({
        user_id: user.user_id,
        employee_id: `PHM-TEMP-${user.user_id}`,
        contact_number: mobile
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.user_id, backendRole);
    const refreshToken = await generateRefreshToken(user.user_id);

    // Update last login
    await User.update(
      { last_login: new Date() },
      { where: { user_id: user.user_id } }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        accessToken,
        refreshToken,
        user: {
          user_id: user.user_id,
          phone_no: user.phone_no,
          name: user.name,
          role: backendRole,
          profile_completed: false
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Registration failed. Please try again.'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Mother, required: false },
        { model: Midwife, required: false }
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if account is deleted
    if (user.is_deleted) {
      return res.status(401).json({
        success: false,
        message: 'Account not found'
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify role if specified
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `This account is not registered as a ${role}`
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.user_id, user.role);
    const refreshToken = await generateRefreshToken(user.user_id);

    // Update last login
    await User.update(
      { last_login: new Date() },
      { where: { user_id: user.user_id } }
    );

    // Build response data
    const userData = {
      user_id: user.user_id,
      phone_no: user.phone_no,
      email: user.email,
      name: user.name,
      role: user.role,
      profile_completed: user.profile_completed,
      profile_picture_url: user.profile_picture_url
    };

    // Add profile data based on role
    if (user.role === 'mother' && user.Mother) {
      userData.mother_id = user.Mother.mother_id;
      userData.mother_code = user.Mother.mother_code;
      userData.pregnancy_status = user.Mother.pregnancy_status;
      userData.is_high_risk = user.Mother.is_high_risk;
    }

    if (user.role === 'midwife' && user.Midwife) {
      userData.midwife_id = user.Midwife.midwife_id;
      userData.employee_id = user.Midwife.employee_id;
      userData.assigned_area = user.Midwife.assigned_area;
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

// @desc    Refresh access token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }

    // Hash the provided token
    const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    // Find valid token in database
    const storedToken = await RefreshToken.findOne({
      where: {
        token_hash: tokenHash,
        is_revoked: false,
        expires_at: {
          [require('sequelize').Op.gt]: new Date()
        }
      },
      include: [{ model: User, attributes: ['user_id', 'role', 'is_active'] }]
    });

    if (!storedToken || !storedToken.User || !storedToken.User.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(
      storedToken.User.user_id, 
      storedToken.User.role
    );

    // Generate new refresh token
    const newRefreshToken = await generateRefreshToken(storedToken.user_id);

    // Revoke old token
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

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Mother, required: false },
        { model: Midwife, required: false }
      ]
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

    // Add role-specific data
    if (user.Mother) {
      userData.mother_profile = {
        mother_id: user.Mother.mother_id,
        mother_code: user.Mother.mother_code,
        pregnancy_status: user.Mother.pregnancy_status,
        expected_delivery_date: user.Mother.expected_delivery_date,
        is_high_risk: user.Mother.is_high_risk,
        blood_group: user.Mother.blood_group
      };
    }

    if (user.Midwife) {
      userData.midwife_profile = {
        midwife_id: user.Midwife.midwife_id,
        employee_id: user.Midwife.employee_id,
        assigned_area: user.Midwife.assigned_area,
        district: user.Midwife.district
      };
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

// @desc    Check profile completion status (for popup logic)
// @route   GET /api/auth/check-profile
// @access  Private
const checkProfileStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: ['user_id', 'name', 'role', 'profile_completed'],
      include: [
        { 
          model: Mother, 
          required: false,
          attributes: ['mother_id'] 
        },
        { 
          model: Midwife, 
          required: false,
          attributes: ['midwife_id'] 
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    let profile_id = null;
    if (user.role === 'mother' && user.Mother) {
      profile_id = user.Mother.mother_id;
    } else if (user.role === 'midwife' && user.Midwife) {
      profile_id = user.Midwife.midwife_id;
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

// @desc    Complete mother profile (after popup)
// @route   PUT /api/auth/complete-profile
// @access  Private
const completeProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const {
      full_name, nic, dob, address, district, gs_division,
      blood_group, lmp_date, expected_delivery_date,
      current_weight, height, gravida, para,
      allergies, chronic_diseases,
      emergency_contact_name, emergency_contact_phone, emergency_relationship,
      husband_name, husband_contact
    } = req.body;

    // Update mother profile
    if (req.user.role === 'mother') {
      await Mother.update({
        full_name,
        nic,
        dob,
        address,
        district,
        gs_division,
        blood_group,
        lmp_date,
        expected_delivery_date,
        current_weight: parseFloat(current_weight),
        height: parseFloat(height),
        gravida: parseInt(gravida) || 1,
        para: parseInt(para) || 0,
        allergies,
        chronic_diseases,
        emergency_contact_name,
        emergency_contact_phone,
        emergency_relationship,
        husband_name,
        husband_contact
      }, {
        where: { user_id }
      });

      // Mark profile as completed
      await User.update(
        { profile_completed: true },
        { where: { user_id } }
      );

      return res.json({
        success: true,
        message: 'Profile completed successfully'
      });
    }

    // For midwife/provider
    if (req.user.role === 'midwife') {
      const { employee_id, qualification, years_of_experience, assigned_area } = req.body;
      
      await Midwife.update({
        employee_id,
        qualification,
        years_of_experience: parseInt(years_of_experience) || 0,
        assigned_area,
        district: req.body.district
      }, {
        where: { user_id }
      });

      await User.update(
        { profile_completed: true },
        { where: { user_id } }
      );

      return res.json({
        success: true,
        message: 'Profile completed successfully'
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Invalid role for profile completion'
    });

  } catch (error) {
    console.error('Complete profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error completing profile'
    });
  }
};

// @desc    Logout (revoke refresh token)
// @route   POST /api/auth/logout
// @access  Private
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
  refreshAccessToken,
  getMe,
  checkProfileStatus,
  completeProfile,
  logout
};