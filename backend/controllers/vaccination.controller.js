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

// Get vaccinations by mother ID (for providers)
const getVaccinationsByMotherId = async (req, res) => {
  try {
    const { motherId } = req.params;
    
    // Find mother by mother_code or mother_id
    let mother = null;
    if (motherId) {
      if (isNaN(parseInt(motherId))) {
        mother = await Mother.findOne({ 
          where: { mother_code: motherId, is_deleted: false }
        });
      } else {
        mother = await Mother.findOne({ 
          where: { mother_id: parseInt(motherId), is_deleted: false }
        });
      }
    }
    
    if (!mother) {
      return error(res, 'Mother not found', 404);
    }

    const vaccinations = await Vaccination.findAll({
      where: { mother_id: mother.mother_id, is_deleted: false },
      order: [['given_date', 'DESC']]
    });

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
    console.error('Error fetching vaccinations by mother ID:', err);
    return error(res, 'Error fetching vaccinations: ' + err.message);
  }
};

// Add vaccination for a specific mother (by provider)
const addVaccinationForMother = async (req, res) => {
  try {
    const { motherId } = req.params;
    const { vaccine_name, dose_number, given_date, batch_number, notes } = req.body;
    
    // Validate required fields
    if (!vaccine_name || !given_date) {
      return error(res, 'Vaccine name and given date are required', 400);
    }
    
    // Find mother by mother_code or mother_id
    let mother = null;
    if (motherId) {
      if (isNaN(parseInt(motherId))) {
        mother = await Mother.findOne({ 
          where: { mother_code: motherId, is_deleted: false }
        });
      } else {
        mother = await Mother.findOne({ 
          where: { mother_id: parseInt(motherId), is_deleted: false }
        });
      }
    }
    
    if (!mother) {
      return error(res, 'Mother not found', 404);
    }
    
    // Determine vaccine type based on name
    let vaccine_type = 'other';
    const vaccineNameLower = vaccine_name.toLowerCase();
    if (vaccineNameLower.includes('tetanus')) vaccine_type = 'tetanus';
    else if (vaccineNameLower.includes('rubella')) vaccine_type = 'rubella';
    else if (vaccineNameLower.includes('influenza') || vaccineNameLower.includes('flu')) vaccine_type = 'influenza';
    else if (vaccineNameLower.includes('covid')) vaccine_type = 'covid19';
    
    // Create vaccination record
    const vaccination = await Vaccination.create({
      mother_id: mother.mother_id,
      vaccine_name: vaccine_name,
      vaccine_type: vaccine_type,
      dose_number: dose_number || 1,
      due_date: given_date,
      given_date: given_date,
      status: 'given',
      administered_by: req.user.name || 'Provider',
      batch_number: batch_number || null,
      notes: notes || null,
      is_deleted: false
    });
    
    const formattedVaccination = {
      vaccination_id: vaccination.vaccination_id,
      vaccine_name: vaccination.vaccine_name,
      vaccine_type: vaccination.vaccine_type,
      dose_number: vaccination.dose_number,
      due_date: vaccination.due_date,
      given_date: vaccination.given_date,
      status: vaccination.status,
      administered_by: vaccination.administered_by,
      batch_number: vaccination.batch_number,
      notes: vaccination.notes
    };
    
    return success(res, { vaccination: formattedVaccination }, 'Vaccination added successfully', 201);
  } catch (err) {
    console.error('Error adding vaccination for mother:', err);
    return error(res, 'Error adding vaccination: ' + err.message);
  }
};

const addVaccination = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const { vaccine_name, vaccine_type, dose_number, given_date, batch_number, notes } = req.body;
    
    const vaccination = await Vaccination.create({
      mother_id: mother.mother_id,
      vaccine_name: vaccine_name,
      vaccine_type: vaccine_type || 'other',
      dose_number: dose_number || 1,
      due_date: given_date || new Date(),
      given_date: given_date || new Date(),
      status: 'given',
      administered_by: req.user.name || 'Self',
      batch_number: batch_number || null,
      notes: notes || null
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
  getCompletedVaccinations,
  getVaccinationsByMotherId,
  addVaccinationForMother
};