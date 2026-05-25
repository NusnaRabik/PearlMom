const { Mother, User, Appointment, Vaccination } = require('../models');
const { success, error } = require('../utils/response');

// Get mother dashboard
const getDashboard = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id },
      include: [
        {
          model: Appointment,
          as: 'appointments',
          limit: 5,
          order: [['appointment_date', 'DESC']]
        },
        {
          model: Vaccination,
          as: 'vaccinations',
          limit: 5,
          order: [['due_date', 'ASC']]
        }
      ]
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    return success(res, { mother });
  } catch (err) {
    console.error('Dashboard error:', err);
    return error(res, 'Error fetching dashboard');
  }
};

// Get mother profile
const getProfile = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    return success(res, { mother });
  } catch (err) {
    return error(res, 'Error fetching profile');
  }
};

// Update mother profile
const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'full_name', 'address', 'district', 'emergency_contact_name',
      'emergency_contact_phone', 'emergency_relationship',
      'husband_name', 'husband_contact', 'allergies', 'chronic_diseases'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await Mother.update(updates, {
      where: { user_id: req.user.user_id }
    });

    const updated = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    return success(res, { mother: updated }, 'Profile updated');
  } catch (err) {
    return error(res, 'Error updating profile');
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
    return error(res, 'Error fetching mothers');
  }
};

module.exports = {
  getDashboard,
  getProfile,
  updateProfile,
  getAllMothers
};