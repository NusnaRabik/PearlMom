const { Mother, ThriposhaEligibility, NutritionSupplement } = require('../models');
const { success, error } = require('../utils/response');
const { calculateBMI } = require('../utils/bmiCalculator');

// Get mother's Thriposha status
const getMyThriposhaStatus = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const latestAssessment = await ThriposhaEligibility.findOne({
      where: { mother_id: mother.mother_id },
      order: [['assessed_date', 'DESC']]
    });

    const recentDistributions = await NutritionSupplement.findAll({
      where: { mother_id: mother.mother_id, supplement_type: 'thriposha' },
      order: [['distribution_date', 'DESC']],
      limit: 5
    });

    return success(res, {
      current_weight: mother.current_weight,
      height: mother.height,
      bmi: calculateBMI(mother.current_weight, mother.height),
      eligibility: latestAssessment,
      distributions: recentDistributions
    });
  } catch (err) {
    return error(res, 'Error fetching Thriposha status');
  }
};

// Get mother's Thriposha history
const getMyThriposhaHistory = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const history = await NutritionSupplement.findAll({
      where: { mother_id: mother.mother_id, supplement_type: 'thriposha' },
      order: [['distribution_date', 'DESC']]
    });

    return success(res, { history });
  } catch (err) {
    return error(res, 'Error fetching history');
  }
};

// Assess Thriposha eligibility
const assessEligibility = async (req, res) => {
  try {
    const { mother_id, gestational_week, mother_weight_kg, notes } = req.body;

    const mother = await Mother.findByPk(mother_id);
    if (!mother) return error(res, 'Mother not found', 404);

    const bmi = calculateBMI(mother_weight_kg, mother.height);

    let isEligible = false;
    let ineligibilityReason = null;

    if (bmi < 18.5) {
      isEligible = true;
    } else if (bmi >= 18.5 && bmi < 25 && gestational_week > 20) {
      const expectedWeight = mother.height - 105;
      if (mother_weight_kg < expectedWeight * 0.9) {
        isEligible = true;
      } else {
        ineligibilityReason = 'Weight is within normal range for gestational age';
      }
    } else {
      ineligibilityReason = 'BMI is above the threshold for Thriposha supplementation';
    }

    const eligibility = await ThriposhaEligibility.create({
      mother_id,
      assessed_date: new Date(),
      gestational_week,
      mother_weight_kg,
      bmi,
      is_eligible: isEligible,
      ineligibility_reason: ineligibilityReason,
      assessed_by: req.user.user_id,
      notes
    });

    return success(res, { eligibility, is_eligible: isEligible, bmi, reason: ineligibilityReason }, 'Eligibility assessment completed', 201);
  } catch (err) {
    return error(res, 'Error assessing eligibility');
  }
};

// Get eligible mothers list
const getEligibleMothers = async (req, res) => {
  try {
    const midwife = await require('../models').Midwife.findOne({
      where: { user_id: req.user.user_id }
    });

    let whereClause = {};
    if (midwife) whereClause.assigned_midwife_id = midwife.midwife_id;

    const eligibleMothers = await Mother.findAll({
      where: { ...whereClause, is_deleted: false },
      include: [{
        model: ThriposhaEligibility,
        where: { is_eligible: true },
        order: [['assessed_date', 'DESC']],
        limit: 1
      }]
    });

    return success(res, { mothers: eligibleMothers });
  } catch (err) {
    return error(res, 'Error fetching eligible mothers');
  }
};

// Distribute Thriposha supplement
const distributeSupplement = async (req, res) => {
  try {
    const { mother_id, quantity, notes } = req.body;

    const latestEligibility = await ThriposhaEligibility.findOne({
      where: { mother_id, is_eligible: true },
      order: [['assessed_date', 'DESC']]
    });

    if (!latestEligibility) {
      return error(res, 'Mother is not currently eligible for Thriposha', 400);
    }

    const distribution = await NutritionSupplement.create({
      mother_id,
      supplement_type: 'thriposha',
      distribution_date: new Date(),
      quantity: quantity || 'Standard pack',
      is_eligible: true,
      distributed_by: req.user.user_id,
      notes
    });

    return success(res, { distribution }, 'Thriposha distributed successfully', 201);
  } catch (err) {
    return error(res, 'Error distributing supplement');
  }
};

module.exports = {
  getMyThriposhaStatus,
  getMyThriposhaHistory,
  assessEligibility,
  getEligibleMothers,
  distributeSupplement
};