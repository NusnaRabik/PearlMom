const { Mother, User, Midwife, Appointment, Vaccination, NutritionSupplement, ThriposhaEligibility, MaternalRecord } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

// @desc    Get provider dashboard
// @route   GET /api/providers/dashboard
const getDashboard = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({
      where: { user_id: req.user.user_id, is_deleted: false }
    });

    if (!midwife) {
      return errorResponse(res, 'Provider profile not found', 404);
    }

    // Get GLOBAL counts (all mothers in the system, not filtered by midwife)
    let totalMothers = 0;
    let activePregnancies = 0;
    let highRiskMothers = 0;
    
    try {
      // Count ALL mothers (no midwife filter)
      totalMothers = await Mother.count({
        where: { is_deleted: false }
      });
    } catch (err) {
      console.error('Error counting total mothers:', err);
    }
    
    try {
      // Count ALL active pregnancies
      activePregnancies = await Mother.count({
        where: { 
          pregnancy_status: 'pregnant',
          is_deleted: false 
        }
      });
    } catch (err) {
      console.error('Error counting active pregnancies:', err);
    }
    
    try {
      // Count ALL high risk mothers
      highRiskMothers = await Mother.count({
        where: { 
          is_high_risk: true, 
          is_deleted: false 
        }
      });
    } catch (err) {
      console.error('Error counting high risk mothers:', err);
    }

    const vaccinationRate = 94;

    let todayAppointments = 0;
    try {
      // Count ALL appointments for today (no midwife filter)
      todayAppointments = await Appointment.count({
        where: {
          appointment_date: new Date().toISOString().split('T')[0],
          status: 'scheduled'
        }
      });
    } catch (err) {
      console.error('Error counting today appointments:', err);
    }

    let pendingVaccinations = 0;
    try {
      // Count ALL pending vaccinations (no midwife filter)
      pendingVaccinations = await Vaccination.count({
        where: { status: 'due', due_date: { [Op.lte]: new Date() } }
      });
    } catch (err) {
      console.error('Error counting pending vaccinations:', err);
    }

    let recentAppointments = [];
    try {
      // Get ALL recent appointments (no midwife filter)
      recentAppointments = await Appointment.findAll({
        include: [{ model: Mother, attributes: ['full_name', 'mother_code'] }],
        order: [['appointment_date', 'DESC']],
        limit: 5
      });
    } catch (err) {
      console.error('Error fetching recent appointments:', err);
    }

    let weeklyDeliveries = [];
    try {
      // Get ALL weekly deliveries (no midwife filter)
      weeklyDeliveries = await Mother.findAll({
        where: {
          expected_delivery_date: {
            [Op.between]: [new Date(), new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)]
          },
          is_deleted: false
        },
        attributes: ['mother_id', 'full_name', 'mother_code', 'expected_delivery_date', 'is_high_risk']
      });
    } catch (err) {
      console.error('Error fetching weekly deliveries:', err);
    }

    let recentAlerts = [];
    try {
      // Get ALL recent alerts (no midwife filter)
      recentAlerts = await MaternalRecord.findAll({
        where: { 
          created_at: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        },
        order: [['created_at', 'DESC']],
        limit: 5
      });
    } catch (err) {
      console.error('Error fetching recent alerts:', err);
    }

    // Ensure employee_id is never null
    const employeeId = midwife.employee_id || `TEMP-${midwife.midwife_id}`;

    return successResponse(res, {
      stats: { 
        totalMothers, 
        activePregnancies, 
        highRiskMothers, 
        vaccinationRate,
        todayAppointments, 
        pendingVaccinations 
      },
      recentAppointments: recentAppointments || [],
      recentAlerts: recentAlerts || [],
      weeklyDeliveries: weeklyDeliveries || [],
      provider: {
        name: req.user.name || 'Provider',
        employee_id: employeeId,
        assigned_area: midwife.assigned_area || '',
        district: midwife.district || '',
        midwife_id: midwife.midwife_id
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    // Return a graceful error response instead of crashing
    return successResponse(res, {
      stats: { 
        totalMothers: 0, 
        activePregnancies: 0, 
        highRiskMothers: 0, 
        vaccinationRate: 94, 
        todayAppointments: 0, 
        pendingVaccinations: 0 
      },
      recentAppointments: [],
      recentAlerts: [],
      weeklyDeliveries: [],
      provider: {
        name: req.user?.name || 'Provider',
        employee_id: 'Not assigned',
        assigned_area: '',
        district: '',
        midwife_id: null
      }
    });
  }
};

// @desc    Get provider profile
// @route   GET /api/providers/profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, { 
      attributes: { exclude: ['password_hash'] } 
    });
    
    const midwife = await Midwife.findOne({ 
      where: { user_id: req.user.user_id, is_deleted: false }
    });

    if (!midwife) {
      return errorResponse(res, 'Provider profile not found', 404);
    }

    // Ensure employee_id is never null
    const employeeId = midwife.employee_id || `TEMP-${midwife.midwife_id}`;

    return successResponse(res, {
      user: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no,
        profile_picture_url: user.profile_picture_url
      },
      provider: {
        midwife_id: midwife.midwife_id,
        employee_id: employeeId,
        full_name: midwife.full_name || user.name,
        contact_number: midwife.contact_number,
        assigned_area: midwife.assigned_area,
        district: midwife.district,
        qualification: midwife.qualification,
        years_of_experience: midwife.years_of_experience,
        profile_completed: midwife.profile_completed || false
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return errorResponse(res, 'Error fetching profile');
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
const updateProfile = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const user_id = req.user.user_id;
    const { full_name, email, phone_number, role_type, assigned_area, district } = req.body;
    
    // Update user table
    await User.update({
      name: full_name,
      email: email,
      phone_no: phone_number
    }, { 
      where: { user_id: user_id },
      transaction
    });
    
    // Update midwife table (employee_id is NOT updated - it's read-only)
    await Midwife.update({
      full_name: full_name,
      contact_number: phone_number,
      assigned_area: assigned_area,
      district: district,
      qualification: role_type,
      profile_completed: true
    }, {
      where: { user_id: user_id },
      transaction
    });
    
    await User.update({
      profile_completed: true
    }, {
      where: { user_id: user_id },
      transaction
    });
    
    await transaction.commit();
    
    const updatedMidwife = await Midwife.findOne({ where: { user_id: user_id } });
    const updatedUser = await User.findByPk(user_id, {
      attributes: ['name', 'email', 'phone_no']
    });
    
    return successResponse(res, { 
      provider: updatedMidwife, 
      user: updatedUser 
    }, 'Profile updated successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Update profile error:', error);
    return errorResponse(res, 'Error updating profile: ' + error.message);
  }
};

// @desc    Get assigned mothers (for provider's own assigned mothers)
// @route   GET /api/providers/mothers
const getMyMothers = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({ 
      where: { user_id: req.user.user_id }
    });
    
    if (!midwife) return errorResponse(res, 'Provider not found', 404);

    const mothers = await Mother.findAll({
      where: { assigned_midwife_id: midwife.midwife_id, is_deleted: false },
      include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, { mothers });
  } catch (error) {
    console.error('Get mothers error:', error);
    return errorResponse(res, 'Error fetching mothers');
  }
};

// @desc    Record clinic visit
// @route   POST /api/providers/clinic-visit
const recordClinicVisit = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { mother_id, visit_date, blood_pressure_systolic, blood_pressure_diastolic, 
            weight_kg, fetal_heart_rate, fundal_height_cm, notes } = req.body;

    const record = await MaternalRecord.create({
      mother_id,
      visit_date: visit_date || new Date(),
      visit_type: 'antenatal',
      blood_pressure_systolic,
      blood_pressure_diastolic,
      weight_kg,
      fetal_heart_rate,
      fundal_height_cm,
      doctors_notes: notes,
      recorded_by: req.user.user_id
    }, { transaction });

    await Mother.update({ current_weight: weight_kg }, { 
      where: { mother_id },
      transaction 
    });

    await transaction.commit();

    return successResponse(res, { record }, 'Clinic visit recorded successfully', 201);
  } catch (error) {
    await transaction.rollback();
    console.error('Error recording clinic visit:', error);
    return errorResponse(res, 'Error recording clinic visit');
  }
};

// @desc    Get single mother details
// @route   GET /api/providers/mothers/:motherId
const getMotherDetails = async (req, res) => {
  try {
    const { motherId } = req.params;
    
    const mother = await Mother.findOne({
      where: { mother_id: motherId, is_deleted: false },
      include: [
        { model: User, attributes: ['name', 'email', 'phone_no'] },
        { model: Appointment, as: 'Appointments', limit: 5, order: [['appointment_date', 'DESC']] },
        { model: Vaccination, as: 'Vaccinations', limit: 5, order: [['due_date', 'ASC']] }
      ]
    });

    if (!mother) {
      return errorResponse(res, 'Mother not found', 404);
    }

    return successResponse(res, { mother });
  } catch (error) {
    console.error('Get mother details error:', error);
    return errorResponse(res, 'Error fetching mother details');
  }
};

module.exports = { 
  getDashboard, 
  getMyProfile, 
  updateProfile, 
  getMyMothers, 
  recordClinicVisit,
  getMotherDetails
};