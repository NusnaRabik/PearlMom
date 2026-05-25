const { Mother, User, Midwife, Appointment, Vaccination, NutritionSupplement, ThriposhaEligibility, MaternalRecord } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

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

    const totalMothers = await Mother.count({
      where: { assigned_midwife_id: midwife.midwife_id, is_deleted: false }
    });

    const highRiskMothers = await Mother.count({
      where: { assigned_midwife_id: midwife.midwife_id, is_high_risk: true, is_deleted: false }
    });

    const todayAppointments = await Appointment.count({
      where: {
        midwife_id: midwife.midwife_id,
        appointment_date: new Date().toISOString().split('T')[0],
        status: 'scheduled'
      }
    });

    const pendingVaccinations = await Vaccination.count({
      include: [{ model: Mother, where: { assigned_midwife_id: midwife.midwife_id }, required: true }],
      where: { status: 'due', due_date: { [Op.lte]: new Date() } }
    });

    const recentAppointments = await Appointment.findAll({
      where: { midwife_id: midwife.midwife_id },
      include: [{ model: Mother, attributes: ['full_name', 'mother_code'] }],
      order: [['appointment_date', 'DESC']],
      limit: 5
    });

    return successResponse(res, {
      stats: { totalMothers, highRiskMothers, todayAppointments, pendingVaccinations },
      recentAppointments,
      provider: {
        name: req.user.name,
        employee_id: midwife.employee_id,
        assigned_area: midwife.assigned_area,
        district: midwife.district
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return errorResponse(res, 'Error fetching dashboard data');
  }
};

// @desc    Get provider profile
// @route   GET /api/providers/profile
const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_id, { attributes: { exclude: ['password_hash'] } });
    const midwife = await Midwife.findOne({ where: { user_id: req.user.user_id, is_deleted: false } });

    if (!midwife) return errorResponse(res, 'Provider profile not found', 404);

    return successResponse(res, {
      user: {
        user_id: user.user_id, name: user.name, email: user.email,
        phone_no: user.phone_no, profile_picture_url: user.profile_picture_url
      },
      provider: midwife
    });
  } catch (error) {
    return errorResponse(res, 'Error fetching profile');
  }
};

// @desc    Update provider profile
// @route   PUT /api/providers/profile
const updateProfile = async (req, res) => {
  try {
    const { contact_number, assigned_area, district, qualification, years_of_experience } = req.body;

    await Midwife.update({ contact_number, assigned_area, district, qualification, years_of_experience: years_of_experience ? parseInt(years_of_experience) : undefined }, {
      where: { user_id: req.user.user_id }
    });

    if (req.body.name) {
      await User.update({ name: req.body.name }, { where: { user_id: req.user.user_id } });
    }

    const updatedProvider = await Midwife.findOne({ where: { user_id: req.user.user_id } });
    return successResponse(res, { provider: updatedProvider }, 'Profile updated');
  } catch (error) {
    return errorResponse(res, 'Error updating profile');
  }
};

// @desc    Get assigned mothers
// @route   GET /api/providers/mothers
const getMyMothers = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({ where: { user_id: req.user.user_id } });
    if (!midwife) return errorResponse(res, 'Provider not found', 404);

    const mothers = await Mother.findAll({
      where: { assigned_midwife_id: midwife.midwife_id, is_deleted: false },
      include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }],
      order: [['created_at', 'DESC']]
    });

    return successResponse(res, { mothers });
  } catch (error) {
    return errorResponse(res, 'Error fetching mothers');
  }
};

// @desc    Record clinic visit
// @route   POST /api/providers/clinic-visit
const recordClinicVisit = async (req, res) => {
  try {
    const { mother_id, visit_date, blood_pressure_systolic, blood_pressure_diastolic, weight_kg, fetal_heart_rate, fundal_height_cm, notes } = req.body;

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
    });

    await Mother.update({ current_weight: weight_kg }, { where: { mother_id } });

    return successResponse(res, { record }, 'Clinic visit recorded successfully', 201);
  } catch (error) {
    console.error('Error recording clinic visit:', error);
    return errorResponse(res, 'Error recording clinic visit');
  }
};

module.exports = { getDashboard, getMyProfile, updateProfile, getMyMothers, recordClinicVisit };