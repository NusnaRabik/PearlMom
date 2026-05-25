const { Vaccination, Mother } = require('../models');
const { success, error } = require('../utils/response');

const getMyVaccinations = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const vaccinations = await Vaccination.findAll({
      where: { mother_id: mother.mother_id },
      order: [['due_date', 'ASC']]
    });

    return success(res, { vaccinations });
  } catch (err) {
    return error(res, 'Error fetching vaccinations');
  }
};

const addVaccination = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const vaccination = await Vaccination.create({
      mother_id: mother.mother_id,
      ...req.body
    });

    return success(res, { vaccination }, 'Vaccination added', 201);
  } catch (err) {
    return error(res, 'Error adding vaccination');
  }
};

module.exports = { getMyVaccinations, addVaccination };