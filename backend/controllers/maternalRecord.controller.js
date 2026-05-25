const { MaternalRecord, Mother, User } = require('../models');
const { success, error } = require('../utils/response');

// Get all records
const getAllRecords = async (req, res) => {
  try {
    let whereClause = { is_deleted: false };

    if (req.user.role === 'mother') {
      const mother = await Mother.findOne({ where: { user_id: req.user.user_id } });
      if (!mother) return error(res, 'Mother profile not found', 404);
      whereClause.mother_id = mother.mother_id;
    }

    const records = await MaternalRecord.findAll({
      where: whereClause,
      order: [['visit_date', 'DESC']],
      include: [
        {
          model: Mother,
          attributes: ['full_name', 'mother_code']
        },
        {
          model: User,
          as: 'recorder',
          attributes: ['name']
        }
      ]
    });

    return success(res, { records });
  } catch (err) {
    console.error('Error fetching records:', err);
    return error(res, 'Error fetching records');
  }
};

// Get single record
const getRecordById = async (req, res) => {
  try {
    const record = await MaternalRecord.findByPk(req.params.id, {
      include: [
        {
          model: Mother,
          attributes: ['full_name', 'mother_code']
        },
        {
          model: User,
          as: 'recorder',
          attributes: ['name']
        }
      ]
    });

    if (!record) return error(res, 'Record not found', 404);

    return success(res, { record });
  } catch (err) {
    console.error('Error fetching record:', err);
    return error(res, 'Error fetching record');
  }
};

// Create new record
const createRecord = async (req, res) => {
  try {
    const {
      mother_id,
      visit_date,
      visit_type,
      gestational_weeks,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      weight_kg,
      fundal_height_cm,
      fetal_heart_rate,
      fetal_movements,
      hemoglobin_level,
      urine_albumin,
      urine_sugar,
      medications_prescribed,
      ultrasound_report,
      doctors_notes,
      next_visit_date
    } = req.body;

    // Validate mother exists
    const mother = await Mother.findByPk(mother_id);
    if (!mother) return error(res, 'Mother not found', 404);

    const record = await MaternalRecord.create({
      mother_id,
      visit_date: visit_date || new Date(),
      visit_type: visit_type || 'antenatal',
      gestational_weeks,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      weight_kg,
      fundal_height_cm,
      fetal_heart_rate,
      fetal_movements,
      hemoglobin_level,
      urine_albumin,
      urine_sugar,
      medications_prescribed,
      ultrasound_report,
      doctors_notes,
      next_visit_date,
      recorded_by: req.user.user_id
    });

    // Update mother's weight
    if (weight_kg) {
      await Mother.update(
        { current_weight: weight_kg },
        { where: { mother_id } }
      );
    }

    return success(res, { record }, 'Record created successfully', 201);
  } catch (err) {
    console.error('Error creating record:', err);
    return error(res, 'Error creating record');
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const record = await MaternalRecord.findByPk(req.params.id);
    if (!record) return error(res, 'Record not found', 404);

    const allowedFields = [
      'visit_date', 'visit_type', 'gestational_weeks',
      'blood_pressure_systolic', 'blood_pressure_diastolic',
      'weight_kg', 'fundal_height_cm', 'fetal_heart_rate',
      'fetal_movements', 'hemoglobin_level', 'urine_albumin',
      'urine_sugar', 'medications_prescribed', 'ultrasound_report',
      'doctors_notes', 'next_visit_date'
    ];

    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    await record.update(updates);

    return success(res, { record }, 'Record updated successfully');
  } catch (err) {
    console.error('Error updating record:', err);
    return error(res, 'Error updating record');
  }
};

// Delete record (soft delete)
const deleteRecord = async (req, res) => {
  try {
    const record = await MaternalRecord.findByPk(req.params.id);
    if (!record) return error(res, 'Record not found', 404);

    await record.update({ is_deleted: true });

    return success(res, null, 'Record deleted successfully');
  } catch (err) {
    console.error('Error deleting record:', err);
    return error(res, 'Error deleting record');
  }
};

// Get records for specific mother (provider only)
const getMotherRecords = async (req, res) => {
  try {
    const records = await MaternalRecord.findAll({
      where: {
        mother_id: req.params.motherId,
        is_deleted: false
      },
      order: [['visit_date', 'DESC']],
      include: [
        {
          model: User,
          as: 'recorder',
          attributes: ['name']
        }
      ]
    });

    return success(res, { records });
  } catch (err) {
    console.error('Error fetching mother records:', err);
    return error(res, 'Error fetching records');
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
  getMotherRecords
};