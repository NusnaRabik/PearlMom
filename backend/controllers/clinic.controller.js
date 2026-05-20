const { Clinic } = require('../models');
const { success, error } = require('../utils/response');

const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll({
      where: { is_active: true }
    });
    return success(res, { clinics });
  } catch (err) {
    return error(res, 'Error fetching clinics');
  }
};

const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) return error(res, 'Clinic not found', 404);
    return success(res, { clinic });
  } catch (err) {
    return error(res, 'Error fetching clinic');
  }
};

const getClinicsByDistrict = async (req, res) => {
  try {
    const clinics = await Clinic.findAll({
      where: {
        district: req.params.district,
        is_active: true
      }
    });
    return success(res, { clinics });
  } catch (err) {
    return error(res, 'Error fetching clinics');
  }
};

module.exports = { getAllClinics, getClinicById, getClinicsByDistrict };