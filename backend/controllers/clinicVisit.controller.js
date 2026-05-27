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
      const lastVisit = await ClinicVisit.findOne({
        where: { mother_id: mother.mother_id, status: 'completed' },
        order: [['visit_date', 'DESC']]
      });
      
      const nextAppointment = await Appointment.findOne({
        where: { 
          mother_id: mother.mother_id, 
          status: 'scheduled', 
          appointment_date: { [Op.gte]: new Date() } 
        },
        order: [['appointment_date', 'ASC']]
      });

      return {
        id: mother.mother_code,
        name: mother.full_name,
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

// Get mother details for clinic visit (no midwife validation)
const getMotherForVisit = async (req, res) => {
  try {
    const { motherId } = req.params;
    
    const mother = await Mother.findOne({
      where: { mother_code: motherId, is_deleted: false },
      include: [
        { model: User, attributes: ['name', 'email', 'phone_no'] }
      ]
    });

    if (!mother) {
      return errorResponse(res, 'Mother not found', 404);
    }

    // Get health education checklist
    let healthEducation = await HealthEducationChecklist.findAll({
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
      
      // Fetch again after creation
      healthEducation = await HealthEducationChecklist.findAll({
        where: { mother_id: mother.mother_id }
      });
    }

    // Get draft visit if exists
    const draftVisit = await ClinicVisit.findOne({
      where: { mother_id: mother.mother_id, status: 'draft' },
      order: [['created_at', 'DESC']]
    });

    const latestVisit = await ClinicVisit.findOne({
      where: { mother_id: mother.mother_id, status: 'completed' },
      order: [['visit_date', 'DESC']]
    });

    // Get visit history
    const visitHistory = await ClinicVisit.findAll({
      where: { mother_id: mother.mother_id, status: 'completed', is_deleted: false },
      order: [['visit_date', 'DESC']],
      limit: 5
    });

    const result = {
      mother: {
        id: mother.mother_code,
        name: mother.full_name,
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
      healthEducation: healthEducation.map(item => ({
        id: item.checklist_id,
        title: item.topic_title,
        completed: item.is_completed
      })),
      visitHistory: visitHistory.map(visit => ({
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
    const visitData = req.body;
    
    const mother = await Mother.findOne({ where: { mother_code: motherId, is_deleted: false } });
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
      await draft.update(visitData, { transaction });
    } else {
      draft = await ClinicVisit.create({
        mother_id: mother.mother_id,
        ...visitData,
        status: 'draft',
        recorded_by: req.user.user_id
      }, { transaction });
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
    const { 
      visit_date, visit_time, gestational_weeks,
      blood_pressure_systolic, blood_pressure_diastolic,
      weight_kg, fetal_heart_rate, fundal_height_cm,
      edema, fetal_movement, hemoglobin_level,
      urine_albumin, urine_sugar, patient_complaints,
      clinical_notes, referrals, next_visit_date,
      health_education_checklist 
    } = req.body;
    
    const mother = await Mother.findOne({ where: { mother_code: motherId, is_deleted: false } });
    if (!mother) {
      await transaction.rollback();
      return errorResponse(res, 'Mother not found', 404);
    }
    
    // Create completed visit record
    const visit = await ClinicVisit.create({
      mother_id: mother.mother_id,
      visit_date: visit_date || new Date(),
      visit_time,
      gestational_weeks: gestational_weeks || mother.weeks,
      blood_pressure_systolic,
      blood_pressure_diastolic,
      weight_kg,
      fetal_heart_rate,
      fundal_height_cm,
      edema: edema || 'none',
      fetal_movement: fetal_movement || 'normal',
      hemoglobin_level,
      urine_albumin: urine_albumin || 'Normal',
      urine_sugar: urine_sugar || 'Normal',
      patient_complaints,
      clinical_notes,
      referrals,
      next_visit_date,
      status: 'completed',
      recorded_by: req.user.user_id
    }, { transaction });
    
    // Update mother's current weight and weeks
    if (weight_kg) {
      await Mother.update({ current_weight: weight_kg }, { where: { mother_id: mother.mother_id }, transaction });
    }
    if (gestational_weeks) {
      await Mother.update({ weeks: gestational_weeks }, { where: { mother_id: mother.mother_id }, transaction });
    }
    
    // Update health education checklist
    if (health_education_checklist && health_education_checklist.length > 0) {
      for (const item of health_education_checklist) {
        await HealthEducationChecklist.update(
          { is_completed: item.completed, completed_at: item.completed ? new Date() : null },
          { where: { mother_id: mother.mother_id, checklist_id: item.id }, transaction }
        );
      }
    }
    
    // Delete any draft visits
    await ClinicVisit.update(
      { status: 'cancelled' },
      { where: { mother_id: mother.mother_id, status: 'draft' }, transaction }
    );
    
    // Schedule next appointment if next_visit_date provided
    if (next_visit_date) {
      await Appointment.create({
        mother_id: mother.mother_id,
        appointment_date: next_visit_date,
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