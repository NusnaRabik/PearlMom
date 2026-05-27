const { Vaccination, Mother } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

const getMyVaccinations = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const vaccinations = await Vaccination.findAll({
      where: { mother_id: mother.mother_id, is_deleted: false },
      order: [['due_date', 'ASC']]
    });

    // Format the response to match frontend expectations
    const formattedVaccinations = vaccinations.map(vacc => ({
      vaccination_id: vacc.vaccination_id,
      vaccine_name: vacc.vaccine_name,
      vaccine_type: vacc.vaccine_type,
      dose_number: vacc.dose_number,
      due_date: vacc.due_date,
      given_date: vacc.given_date,
      status: vacc.status,
      administered_by: vacc.administered_by,
      batch_number: vacc.batch_number,
      notes: vacc.notes
    }));

    return success(res, { vaccinations: formattedVaccinations });
  } catch (err) {
    console.error('Error fetching vaccinations:', err);
    return error(res, 'Error fetching vaccinations: ' + err.message);
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
      status: 'due',
      ...req.body
    });

    return success(res, { vaccination }, 'Vaccination added successfully', 201);
  } catch (err) {
    console.error('Error adding vaccination:', err);
    return error(res, 'Error adding vaccination: ' + err.message);
  }
};

const updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    
    await Vaccination.update(req.body, {
      where: { vaccination_id: id }
    });

    const updated = await Vaccination.findByPk(id);
    return success(res, { vaccination: updated }, 'Vaccination updated successfully');
  } catch (err) {
    console.error('Error updating vaccination:', err);
    return error(res, 'Error updating vaccination: ' + err.message);
  }
};

const getUpcomingVaccinations = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const vaccinations = await Vaccination.findAll({
      where: {
        mother_id: mother.mother_id,
        status: { [Op.in]: ['due', 'scheduled'] },
        due_date: { [Op.gte]: new Date() },
        is_deleted: false
      },
      order: [['due_date', 'ASC']],
      limit: 5
    });

    return success(res, { vaccinations });
  } catch (err) {
    console.error('Error fetching upcoming vaccinations:', err);
    return error(res, 'Error fetching upcoming vaccinations');
  }
};

const getCompletedVaccinations = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const vaccinations = await Vaccination.findAll({
      where: {
        mother_id: mother.mother_id,
        status: { [Op.in]: ['given', 'completed'] },
        is_deleted: false
      },
      order: [['given_date', 'DESC']]
    });

    return success(res, { vaccinations });
  } catch (err) {
    console.error('Error fetching completed vaccinations:', err);
    return error(res, 'Error fetching completed vaccinations');
  }
};

module.exports = { 
  getMyVaccinations, 
  addVaccination,
  updateVaccination,
  getUpcomingVaccinations,
  getCompletedVaccinations
};