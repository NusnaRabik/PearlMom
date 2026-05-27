const { Clinic } = require('../models');
const { success, error } = require('../utils/response');

const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll({
      where: { is_active: true },
      order: [['name', 'ASC']]
    });
    return success(res, { clinics });
  } catch (err) {
    console.error('Error fetching clinics:', err);
    return error(res, 'Error fetching clinics: ' + err.message);
  }
};

const getClinicById = async (req, res) => {
  try {
    const clinic = await Clinic.findByPk(req.params.id);
    if (!clinic) return error(res, 'Clinic not found', 404);
    return success(res, { clinic });
  } catch (err) {
    console.error('Error fetching clinic:', err);
    return error(res, 'Error fetching clinic: ' + err.message);
  }
};

const getClinicsByDistrict = async (req, res) => {
  try {
    const clinics = await Clinic.findAll({
      where: {
        district: req.params.district,
        is_active: true
      },
      order: [['name', 'ASC']]
    });
    return success(res, { clinics });
  } catch (err) {
    console.error('Error fetching clinics by district:', err);
    return error(res, 'Error fetching clinics: ' + err.message);
  }
};

module.exports = { getAllClinics, getClinicById, getClinicsByDistrict };