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

const toNumOrNull = (val) => {
  if (val === '' || val === undefined || val === null) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
};

const toIntOrNull = (val) => {
  if (val === '' || val === undefined || val === null) return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
};

const toDateOrNull = (val) => {
  if (!val || String(val).trim() === '') return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : val;
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

    const safeWeight = toNumOrNull(weight_kg);

    const record = await MaternalRecord.create({
      mother_id,
      visit_date: toDateOrNull(visit_date) || new Date(),
      visit_type: visit_type || 'antenatal',
      gestational_weeks: toIntOrNull(gestational_weeks),
      blood_pressure_systolic: toIntOrNull(blood_pressure_systolic),
      blood_pressure_diastolic: toIntOrNull(blood_pressure_diastolic),
      weight_kg: safeWeight,
      fundal_height_cm: toNumOrNull(fundal_height_cm),
      fetal_heart_rate: toIntOrNull(fetal_heart_rate),
      fetal_movements: fetal_movements || null,
      hemoglobin_level: toNumOrNull(hemoglobin_level),
      urine_albumin: urine_albumin || null,
      urine_sugar: urine_sugar || null,
      medications_prescribed: medications_prescribed || null,
      ultrasound_report: ultrasound_report || null,
      doctors_notes: doctors_notes || null,
      next_visit_date: toDateOrNull(next_visit_date),
      recorded_by: req.user.user_id
    });

    // Update mother's weight
    if (safeWeight !== null) {
      await Mother.update(
        { current_weight: safeWeight },
        { where: { mother_id } }
      );
    }

    return success(res, { record }, 'Record created successfully', 201);
  } catch (err) {
    console.error('Error creating record:', err);
    return error(res, 'Error creating record: ' + err.message);
  }
};

// Update record
const updateRecord = async (req, res) => {
  try {
    const record = await MaternalRecord.findByPk(req.params.id);
    if (!record) return error(res, 'Record not found', 404);

    const intFields = ['gestational_weeks', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'fetal_heart_rate'];
    const numFields = ['weight_kg', 'fundal_height_cm', 'hemoglobin_level'];
    const dateFields = ['visit_date', 'next_visit_date'];
    const strFields = ['visit_type', 'fetal_movements', 'urine_albumin', 'urine_sugar', 'medications_prescribed', 'ultrasound_report', 'doctors_notes'];

    const updates = {};
    intFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = toIntOrNull(req.body[f]);
    });
    numFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = toNumOrNull(req.body[f]);
    });
    dateFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = toDateOrNull(req.body[f]);
    });
    strFields.forEach(f => {
      if (req.body[f] !== undefined) updates[f] = req.body[f] || null;
    });

    await record.update(updates);

    return success(res, { record }, 'Record updated successfully');
  } catch (err) {
    console.error('Error updating record:', err);
    return error(res, 'Error updating record: ' + err.message);
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