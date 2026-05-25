const { User, Mother, Midwife } = require('../models');
const { success, error } = require('../utils/response');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        { model: Mother, as: 'mother', required: false },
        { model: Midwife, as: 'midwife', required: false }
      ]
    });

    if (!user) {
      return error(res, 'User not found', 404);
    }

    const profileData = {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      phone_no: user.phone_no,
      role: user.role,
      profile_completed: user.profile_completed,
      profile_picture_url: user.profile_picture_url,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    // Add role-specific profile data
    if (user.role === 'mother' && user.mother) {
      profileData.mother = {
        mother_id: user.mother.mother_id,
        mother_code: user.mother.mother_code,
        full_name: user.mother.full_name,
        nic: user.mother.nic,
        dob: user.mother.dob,
        address: user.mother.address,
        district: user.mother.district,
        gs_division: user.mother.gs_division,
        blood_group: user.mother.blood_group,
        pregnancy_status: user.mother.pregnancy_status,
        lmp_date: user.mother.lmp_date,
        expected_delivery_date: user.mother.expected_delivery_date,
        current_weight: user.mother.current_weight,
        height: user.mother.height,
        gravida: user.mother.gravida,
        para: user.mother.para,
        allergies: user.mother.allergies,
        chronic_diseases: user.mother.chronic_diseases,
        emergency_contact_name: user.mother.emergency_contact_name,
        emergency_contact_phone: user.mother.emergency_contact_phone,
        emergency_relationship: user.mother.emergency_relationship,
        husband_name: user.mother.husband_name,
        husband_contact: user.mother.husband_contact,
        assigned_midwife_id: user.mother.assigned_midwife_id,
        is_high_risk: user.mother.is_high_risk,
        registered_date: user.mother.registered_date
      };
    }

    if (user.role === 'midwife' && user.midwife) {
      profileData.midwife = {
        midwife_id: user.midwife.midwife_id,
        employee_id: user.midwife.employee_id,
        contact_number: user.midwife.contact_number,
        assigned_area: user.midwife.assigned_area,
        district: user.midwife.district,
        qualification: user.midwife.qualification,
        years_of_experience: user.midwife.years_of_experience,
        is_active: user.midwife.is_active
      };
    }

    return success(res, { profile: profileData });
  } catch (err) {
    console.error('Get profile error:', err);
    return error(res, 'Error fetching profile');
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, phone_no } = req.body;
    
    await User.update(
      { name, email, phone_no },
      { where: { user_id: req.user.user_id } }
    );

    const updatedUser = await User.findByPk(req.user.user_id, {
      attributes: { exclude: ['password_hash'] }
    });

    return success(res, { user: updatedUser }, 'Profile updated successfully');
  } catch (err) {
    console.error('Update profile error:', err);
    return error(res, 'Error updating profile');
  }
};

// @desc    Update mother profile
// @route   PUT /api/profile/mother
// @access  Private (Mother only)
const updateMotherProfile = async (req, res) => {
  try {
    if (req.user.role !== 'mother') {
      return error(res, 'Only mothers can update mother profile', 403);
    }

    const allowedFields = [
      'full_name', 'nic', 'dob', 'address', 'district', 'gs_division',
      'blood_group', 'pregnancy_status', 'lmp_date', 'expected_delivery_date',
      'current_weight', 'height', 'gravida', 'para', 'allergies', 'chronic_diseases',
      'emergency_contact_name', 'emergency_contact_phone', 'emergency_relationship',
      'husband_name', 'husband_contact'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await Mother.update(updates, {
      where: { user_id: req.user.user_id }
    });

    const updatedMother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    return success(res, { mother: updatedMother }, 'Mother profile updated successfully');
  } catch (err) {
    console.error('Update mother profile error:', err);
    return error(res, 'Error updating mother profile');
  }
};

// @desc    Update midwife profile
// @route   PUT /api/profile/midwife
// @access  Private (Midwife only)
const updateMidwifeProfile = async (req, res) => {
  try {
    if (req.user.role !== 'midwife') {
      return error(res, 'Only midwives can update midwife profile', 403);
    }

    const allowedFields = [
      'contact_number', 'assigned_area', 'district', 'qualification', 'years_of_experience'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    if (req.body.years_of_experience) {
      updates.years_of_experience = parseInt(req.body.years_of_experience);
    }

    await Midwife.update(updates, {
      where: { user_id: req.user.user_id }
    });

    const updatedMidwife = await Midwife.findOne({
      where: { user_id: req.user.user_id }
    });

    return success(res, { midwife: updatedMidwife }, 'Midwife profile updated successfully');
  } catch (err) {
    console.error('Update midwife profile error:', err);
    return error(res, 'Error updating midwife profile');
  }
};

// @desc    Upload profile picture
// @route   POST /api/profile/upload-photo
// @access  Private
const uploadProfilePhoto = async (req, res) => {
  try {
    // In a real implementation, you would handle file upload here
    // For now, we'll accept a URL from the request body
    const { photoUrl } = req.body;

    if (!photoUrl) {
      return error(res, 'Photo URL is required', 400);
    }

    await User.update(
      { profile_picture_url: photoUrl },
      { where: { user_id: req.user.user_id } }
    );

    return success(res, { photoUrl }, 'Profile photo updated successfully');
  } catch (err) {
    console.error('Upload photo error:', err);
    return error(res, 'Error uploading profile photo');
  }
};

// @desc    Delete profile picture
// @route   DELETE /api/profile/photo
// @access  Private
const deleteProfilePhoto = async (req, res) => {
  try {
    await User.update(
      { profile_picture_url: null },
      { where: { user_id: req.user.user_id } }
    );

    return success(res, null, 'Profile photo deleted successfully');
  } catch (err) {
    console.error('Delete photo error:', err);
    return error(res, 'Error deleting profile photo');
  }
};

// @desc    Change password
// @route   PUT /api/profile/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return error(res, 'Old password and new password are required', 400);
    }

    if (newPassword.length < 6) {
      return error(res, 'New password must be at least 6 characters', 400);
    }

    const user = await User.findByPk(req.user.user_id);

    const isPasswordValid = await user.comparePassword(oldPassword);
    if (!isPasswordValid) {
      return error(res, 'Old password is incorrect', 401);
    }

    user.password_hash = newPassword;
    await user.save();

    return success(res, null, 'Password changed successfully');
  } catch (err) {
    console.error('Change password error:', err);
    return error(res, 'Error changing password');
  }
};

// @desc    Get profile completion status
// @route   GET /api/profile/completion-status
// @access  Private
const getProfileCompletionStatus = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, {
      include: [
        { model: Mother, as: 'mother', required: false },
        { model: Midwife, as: 'midwife', required: false }
      ]
    });

    const completionStatus = {
      profile_completed: user.profile_completed,
      has_name: !!user.name,
      has_email: !!user.email,
      has_phone: !!user.phone_no
    };

    if (user.role === 'mother' && user.mother) {
      completionStatus.mother_profile = {
        has_full_name: !!user.mother.full_name,
        has_nic: !!user.mother.nic,
        has_address: !!user.mother.address,
        has_edd: !!user.mother.expected_delivery_date,
        completion_percentage: calculateMotherProfileCompletion(user.mother)
      };
    }

    if (user.role === 'midwife' && user.midwife) {
      completionStatus.midwife_profile = {
        has_employee_id: !!user.midwife.employee_id,
        has_qualification: !!user.midwife.qualification,
        has_assigned_area: !!user.midwife.assigned_area,
        completion_percentage: calculateMidwifeProfileCompletion(user.midwife)
      };
    }

    return success(res, completionStatus);
  } catch (err) {
    console.error('Profile completion status error:', err);
    return error(res, 'Error fetching profile completion status');
  }
};

// Helper function to calculate mother profile completion percentage
const calculateMotherProfileCompletion = (mother) => {
  const fields = [
    'full_name', 'nic', 'dob', 'address', 'district',
    'blood_group', 'expected_delivery_date', 'emergency_contact_name',
    'emergency_contact_phone', 'husband_name'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    if (mother[field]) completed++;
  });
  
  return Math.round((completed / fields.length) * 100);
};

// Helper function to calculate midwife profile completion percentage
const calculateMidwifeProfileCompletion = (midwife) => {
  const fields = [
    'employee_id', 'contact_number', 'assigned_area',
    'district', 'qualification', 'years_of_experience'
  ];
  
  let completed = 0;
  fields.forEach(field => {
    if (midwife[field]) completed++;
  });
  
  return Math.round((completed / fields.length) * 100);
};

module.exports = {
  getProfile,
  updateProfile,
  updateMotherProfile,
  updateMidwifeProfile,
  uploadProfilePhoto,
  deleteProfilePhoto,
  changePassword,
  getProfileCompletionStatus
};