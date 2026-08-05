// backend/controllers/clinicVisit.controller.js
const { Mother, User, Midwife, ClinicVisit, HealthEducationChecklist, Appointment } = require('../models');
const { successResponse, errorResponse } = require('../utils/response');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

// Get all assigned mothers with their latest visit info - FIXED (ALL mothers)
const getAssignedMothers = async (req, res) => {
  try {
    // Get ALL mothers (no midwife filter - all providers can see all mothers)
    const mothers = await Mother.findAll({
      where: { is_deleted: false },
      include: [
        {
          model: User,
          attributes: ['name', 'email', 'phone_no']
        }
      ],
      order: [['full_name', 'ASC']]
    });

    // Format the response
    const formattedMothers = await Promise.all(mothers.map(async (mother) => {
      let lastVisit = null;
      try {
        lastVisit = await ClinicVisit.findOne({
          where: { mother_id: mother.mother_id, status: 'completed' },
          order: [['visit_date', 'DESC']]
        });
      } catch (err) {
        console.warn('Error querying lastVisit:', err.message);
      }
      
      let nextAppointment = null;
      try {
        nextAppointment = await Appointment.findOne({
          where: { 
            mother_id: mother.mother_id, 
            status: 'scheduled', 
            appointment_date: { [Op.gte]: new Date() } 
          },
          order: [['appointment_date', 'ASC']]
        });
      } catch (err) {
        console.warn('Error querying nextAppointment:', err.message);
      }

      const displayId = mother.mother_code || `MOM-${mother.mother_id}`;

      return {
        id: displayId,
        mother_id: mother.mother_id,
        mother_code: mother.mother_code,
        name: mother.full_name || mother.User?.name || 'Unnamed Patient',
        nic: mother.nic || '',
        phone: mother.emergency_contact_phone || mother.User?.phone_no || '',
        weeks: mother.weeks || 0,
        bloodType: mother.blood_group || 'Not specified',
        edd: mother.expected_delivery_date,
        lastVisit: lastVisit ? new Date(lastVisit.visit_date).toLocaleDateString() : 'No visits',
        nextSchedule: nextAppointment ? new Date(nextAppointment.appointment_date).toLocaleDateString() : 'Not scheduled',
        visitStatus: lastVisit ? 'recent' : 'upcoming'
      };
    }));

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const stats = {
      todayVisits: formattedMothers.filter(m => m.nextSchedule === today).length,
      pending: formattedMothers.filter(m => m.visitStatus === 'upcoming').length,
      overdue: formattedMothers.filter(m => m.nextSchedule && new Date(m.nextSchedule) < new Date()).length,
      thisWeek: formattedMothers.filter(m => {
        const scheduleDate = new Date(m.nextSchedule);
        return scheduleDate >= thisWeek && scheduleDate <= nextWeek;
      }).length
    };

    return successResponse(res, { mothers: formattedMothers, stats });
  } catch (error) {
    console.error('Error fetching assigned mothers:', error);
    return errorResponse(res, 'Error fetching mothers: ' + error.message);
  }
};

// Helper to sanitize incoming visit payload for database integrity
const sanitizeVisitData = (data) => {
  const parseNum = (val) => (val !== undefined && val !== null && val !== '' && !isNaN(val) ? Number(val) : null);
  const parseStr = (val) => (val !== undefined && val !== null && String(val).trim() !== '' ? String(val).trim() : null);

  let formattedTime = null;
  if (data.visit_time) {
    const timeStr = String(data.visit_time).trim();
    const match12 = timeStr.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
    if (match12) {
      let hours = parseInt(match12[1], 10);
      const minutes = match12[2];
      const seconds = match12[3] || '00';
      const modifier = match12[4];
      if (modifier) {
        if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
      }
      formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    } else if (/^\d{2}:\d{2}(:\d{2})?$/.test(timeStr)) {
      formattedTime = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    }
  }

  return {
    visit_date: data.visit_date || new Date().toISOString().split('T')[0],
    visit_time: formattedTime,
    gestational_weeks: parseNum(data.gestational_weeks),
    blood_pressure_systolic: parseNum(data.blood_pressure_systolic),
    blood_pressure_diastolic: parseNum(data.blood_pressure_diastolic),
    weight_kg: parseNum(data.weight_kg),
    fetal_heart_rate: parseNum(data.fetal_heart_rate),
    fundal_height_cm: parseNum(data.fundal_height_cm),
    edema: ['none', 'mild', 'moderate', 'severe'].includes(data.edema) ? data.edema : 'none',
    fetal_movement: ['normal', 'decreased', 'increased', 'absent'].includes(data.fetal_movement) ? data.fetal_movement : 'normal',
    hemoglobin_level: parseNum(data.hemoglobin_level),
    urine_albumin: parseStr(data.urine_albumin) || 'Normal',
    urine_sugar: parseStr(data.urine_sugar) || 'Normal',
    patient_complaints: parseStr(data.patient_complaints),
    clinical_notes: parseStr(data.clinical_notes),
    referrals: parseStr(data.referrals),
    next_visit_date: parseStr(data.next_visit_date),
    visit_type: data.visit_type || 'antenatal'
  };
};

// Helper to find mother by any identifier (id, code, name, nic, phone)
const findMotherByIdOrQuery = async (queryStr) => {
  if (!queryStr) return null;
  const clean = decodeURIComponent(String(queryStr)).trim();
  if (!clean) return null;

  try {
    // 1. Try exact mother_id if numeric
    if (!isNaN(clean) && Number(clean) > 0) {
      const byId = await Mother.findOne({
        where: { mother_id: Number(clean), is_deleted: false },
        include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }]
      });
      if (byId) return byId;
    }

    // 2. Try extract ID if formatted as MOM-123 or MOM-26-0009
    const momMatch = clean.match(/^MOM-(?:2\d-)?0*(\d+)$/i);
    if (momMatch && momMatch[1]) {
      const num = Number(momMatch[1]);
      const byNum = await Mother.findOne({
        where: {
          [Op.or]: [
            { mother_id: num },
            { mother_code: clean }
          ],
          is_deleted: false
        },
        include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }]
      });
      if (byNum) return byNum;
    }

    // 3. Try exact mother_code
    let mother = await Mother.findOne({
      where: { mother_code: clean, is_deleted: false },
      include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }]
    });
    if (mother) return mother;

    // 4. Try exact or partial NIC
    mother = await Mother.findOne({
      where: {
        [Op.or]: [
          { nic: clean },
          { nic: { [Op.like]: `%${clean}%` } }
        ],
        is_deleted: false
      },
      include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }]
    });
    if (mother) return mother;

    // 5. Try full_name or mother_code partial match
    mother = await Mother.findOne({
      where: {
        [Op.or]: [
          { mother_code: { [Op.like]: `%${clean}%` } },
          { full_name: { [Op.like]: `%${clean}%` } }
        ],
        is_deleted: false
      },
      include: [{ model: User, attributes: ['name', 'email', 'phone_no'] }]
    });
    if (mother) return mother;

    // 6. Try User name or phone search
    mother = await Mother.findOne({
      where: { is_deleted: false },
      include: [{
        model: User,
        attributes: ['name', 'email', 'phone_no'],
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${clean}%` } },
            { phone_no: { [Op.like]: `%${clean}%` } }
          ]
        }
      }]
    });

    return mother;
  } catch (err) {
    console.error('Error in findMotherByIdOrQuery:', err);
    return null;
  }
};

// Get mother details for clinic visit
const getMotherForVisit = async (req, res) => {
  try {
    const { motherId } = req.params;
    const mother = await findMotherByIdOrQuery(motherId);

    if (!mother) {
      return errorResponse(res, 'Mother not found', 404);
    }

    // Get health education checklist
    let healthEducation = [];
    try {
      healthEducation = await HealthEducationChecklist.findAll({
        where: { mother_id: mother.mother_id }
      });

      // If no checklist exists, create default ones
      if (!healthEducation || healthEducation.length === 0) {
        const defaultTopics = [
          'Nutrition & Supplements',
          'Breastfeeding Preparation',
          'Signs of Labor',
          'Warning Signs (PIH/Eclampsia)'
        ];
        
        for (const topic of defaultTopics) {
          await HealthEducationChecklist.create({
            mother_id: mother.mother_id,
            topic_title: topic,
            is_completed: false
          });
        }
        
        healthEducation = await HealthEducationChecklist.findAll({
          where: { mother_id: mother.mother_id }
        });
      }
    } catch (err) {
      console.warn('Checklist fetch error:', err.message);
      healthEducation = [];
    }

    // Get draft visit if exists
    let draftVisit = null;
    try {
      draftVisit = await ClinicVisit.findOne({
        where: { mother_id: mother.mother_id, status: 'draft' },
        order: [['created_at', 'DESC']]
      });
    } catch (err) {
      console.warn('Draft visit fetch error:', err.message);
    }

    let latestVisit = null;
    try {
      latestVisit = await ClinicVisit.findOne({
        where: { mother_id: mother.mother_id, status: 'completed' },
        order: [['visit_date', 'DESC']]
      });
    } catch (err) {
      console.warn('Latest visit fetch error:', err.message);
    }

    // Get visit history
    let visitHistory = [];
    try {
      visitHistory = await ClinicVisit.findAll({
        where: { mother_id: mother.mother_id, status: 'completed', is_deleted: false },
        order: [['visit_date', 'DESC']],
        limit: 5
      });
    } catch (err) {
      console.warn('Visit history fetch error:', err.message);
      visitHistory = [];
    }

    const displayId = mother.mother_code || `MOM-${mother.mother_id}`;

    const result = {
      mother: {
        id: displayId,
        mother_id: mother.mother_id,
        mother_code: mother.mother_code,
        name: mother.full_name || mother.User?.name || 'Unnamed Patient',
        nic: mother.nic || '',
        phone: mother.emergency_contact_phone || mother.User?.phone_no || '',
        weeks: mother.weeks || 0,
        bloodType: mother.blood_group || 'Not specified',
        edd: mother.expected_delivery_date
      },
      vitals: {
        bp: latestVisit ? `${latestVisit.blood_pressure_systolic}/${latestVisit.blood_pressure_diastolic}` : '--/--',
        weight: latestVisit?.weight_kg || mother.current_weight || '--',
        fetalHeartRate: latestVisit?.fetal_heart_rate || '--'
      },
      labTests: {
        hbLevel: latestVisit?.hemoglobin_level || '--',
        urineProtein: latestVisit?.urine_albumin || 'Normal',
        urineSugar: latestVisit?.urine_sugar || 'Normal'
      },
      healthEducation: (healthEducation || []).map(item => ({
        id: item.checklist_id,
        title: item.topic_title,
        completed: item.is_completed
      })),
      visitHistory: (visitHistory || []).map(visit => ({
        date: new Date(visit.visit_date).toLocaleDateString(),
        bp: `${visit.blood_pressure_systolic}/${visit.blood_pressure_diastolic}`,
        weight: `${visit.weight_kg}kg`,
        fhr: visit.fetal_heart_rate,
        notes: visit.clinical_notes
      })),
      draftVisit: draftVisit
    };

    return successResponse(res, result);
  } catch (error) {
    console.error('Error fetching mother details:', error);
    return errorResponse(res, 'Error fetching mother details: ' + error.message);
  }
};

// Save draft visit
const saveDraftVisit = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { motherId } = req.params;
    const sanitizedData = sanitizeVisitData(req.body);
    const { health_education_checklist } = req.body;
    
    const mother = await findMotherByIdOrQuery(motherId);

    if (!mother) {
      await transaction.rollback();
      return errorResponse(res, 'Mother not found', 404);
    }
    
    // Check if draft exists
    let draft = await ClinicVisit.findOne({
      where: { mother_id: mother.mother_id, status: 'draft' },
      transaction
    });
    
    if (draft) {
      await draft.update({
        ...sanitizedData,
        status: 'draft',
        recorded_by: req.user.user_id
      }, { transaction });
    } else {
      draft = await ClinicVisit.create({
        mother_id: mother.mother_id,
        ...sanitizedData,
        status: 'draft',
        recorded_by: req.user.user_id
      }, { transaction });
    }

    // Update health education checklist if provided
    if (Array.isArray(health_education_checklist) && health_education_checklist.length > 0) {
      for (const item of health_education_checklist) {
        if (item.id) {
          await HealthEducationChecklist.update(
            { is_completed: !!item.completed, completed_at: item.completed ? new Date() : null },
            { where: { mother_id: mother.mother_id, checklist_id: item.id }, transaction }
          );
        }
      }
    }
    
    await transaction.commit();
    
    return successResponse(res, { draft }, 'Draft saved successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Error saving draft:', error);
    return errorResponse(res, 'Error saving draft: ' + error.message);
  }
};

// Complete visit
const completeVisit = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { motherId } = req.params;
    const sanitizedData = sanitizeVisitData(req.body);
    const { health_education_checklist } = req.body;
    
    const mother = await findMotherByIdOrQuery(motherId);

    if (!mother) {
      await transaction.rollback();
      return errorResponse(res, 'Mother not found', 404);
    }
    
    // Create completed visit record
    const visit = await ClinicVisit.create({
      mother_id: mother.mother_id,
      ...sanitizedData,
      status: 'completed',
      recorded_by: req.user.user_id
    }, { transaction });
    
    // Update mother's current weight and weeks if provided
    if (sanitizedData.weight_kg !== null) {
      await Mother.update({ current_weight: sanitizedData.weight_kg }, { where: { mother_id: mother.mother_id }, transaction });
    }
    if (sanitizedData.gestational_weeks !== null) {
      await Mother.update({ weeks: sanitizedData.gestational_weeks }, { where: { mother_id: mother.mother_id }, transaction });
    }
    
    // Update health education checklist
    if (Array.isArray(health_education_checklist) && health_education_checklist.length > 0) {
      for (const item of health_education_checklist) {
        if (item.id) {
          await HealthEducationChecklist.update(
            { is_completed: !!item.completed, completed_at: item.completed ? new Date() : null },
            { where: { mother_id: mother.mother_id, checklist_id: item.id }, transaction }
          );
        }
      }
    }
    
    // Delete/Cancel any draft visits
    await ClinicVisit.update(
      { status: 'cancelled' },
      { where: { mother_id: mother.mother_id, status: 'draft' }, transaction }
    );
    
    // Schedule next appointment if next_visit_date provided
    if (sanitizedData.next_visit_date) {
      await Appointment.create({
        mother_id: mother.mother_id,
        appointment_date: sanitizedData.next_visit_date,
        appointment_type: 'checkup',
        status: 'scheduled',
        notes: 'Follow-up visit scheduled during clinic visit'
      }, { transaction });
    }
    
    await transaction.commit();
    
    return successResponse(res, { visit }, 'Visit completed successfully', 201);
  } catch (error) {
    await transaction.rollback();
    console.error('Error completing visit:', error);
    return errorResponse(res, 'Error completing visit: ' + error.message);
  }
};

module.exports = {
  getAssignedMothers,
  getMotherForVisit,
  saveDraftVisit,
  completeVisit
};