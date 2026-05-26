const { Mother, User, Midwife, ThriposhaEligibility, NutritionSupplement } = require('../models');
const { success, error } = require('../utils/response');
const { calculateBMI } = require('../utils/bmiCalculator');
const { sequelize } = require('../config/db');
const { Op } = require('sequelize');

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
    console.error('Error fetching Thriposha status:', err);
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
    console.error('Error fetching history:', err);
    return error(res, 'Error fetching history');
  }
};

// Assess Thriposha eligibility
const assessEligibility = async (req, res) => {
  try {
    const { mother_id, gestational_week, notes } = req.body;

    // Find mother by mother_code or mother_id
    let mother = null;
    if (mother_id) {
      if (isNaN(parseInt(mother_id))) {
        mother = await Mother.findOne({ 
          where: { mother_code: mother_id, is_deleted: false }
        });
      } else {
        mother = await Mother.findOne({ 
          where: { mother_id: parseInt(mother_id), is_deleted: false }
        });
      }
    }

    if (!mother) {
      return error(res, 'Mother not found. Please check the Mother ID.', 404);
    }

    // Get BMI from mother's data
    let bmi = null;
    if (mother.current_weight && mother.height && mother.height > 0) {
      bmi = calculateBMI(mother.current_weight, mother.height);
    }

    let isEligible = false;
    let recommendedPackets = 1;

    // Eligibility logic based on BMI
    if (bmi) {
      if (bmi < 18.5) {
        isEligible = true;
        recommendedPackets = 2;
      } else if (bmi >= 30) {
        isEligible = true;
        recommendedPackets = 2;
      } else if (bmi >= 18.5 && bmi <= 24.9) {
        isEligible = true;
        recommendedPackets = 1;
      } else {
        isEligible = true;
        recommendedPackets = 1;
      }
    } else {
      isEligible = true;
      recommendedPackets = 1;
    }

    // Check if already has an eligibility record
    const existingEligibility = await ThriposhaEligibility.findOne({
      where: { mother_id: mother.mother_id },
      order: [['assessed_date', 'DESC']]
    });

    let eligibility;
    if (existingEligibility) {
      await existingEligibility.update({
        assessed_date: new Date(),
        gestational_week: gestational_week || mother.weeks || 20,
        mother_weight_kg: mother.current_weight,
        bmi: bmi,
        is_eligible: isEligible,
        ineligibility_reason: null,
        assessed_by: req.user.user_id,
        notes: notes || `BMI: ${bmi}, Week: ${gestational_week || mother.weeks || 20}`
      });
      eligibility = existingEligibility;
    } else {
      eligibility = await ThriposhaEligibility.create({
        mother_id: mother.mother_id,
        assessed_date: new Date(),
        gestational_week: gestational_week || mother.weeks || 20,
        mother_weight_kg: mother.current_weight,
        bmi: bmi,
        is_eligible: isEligible,
        ineligibility_reason: null,
        assessed_by: req.user.user_id,
        notes: notes || `BMI: ${bmi}, Week: ${gestational_week || mother.weeks || 20}`
      });
    }

    return success(res, { 
      eligibility, 
      is_eligible: isEligible, 
      bmi, 
      recommended_packets: recommendedPackets,
      mother_name: mother.full_name,
      mother_code: mother.mother_code
    }, 'Eligibility assessment completed', 201);
  } catch (err) {
    console.error('Error assessing eligibility:', err);
    return error(res, 'Error assessing eligibility: ' + err.message);
  }
};

// Get list of currently eligible mothers from thriposha_eligibilities
const getEligibleMothers = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({ where: { user_id: req.user.user_id } });

    let query = `
      SELECT 
        e.eligibility_id,
        e.mother_id,
        e.assessed_date,
        e.gestational_week,
        e.bmi,
        e.is_eligible,
        e.notes,
        m.full_name,
        m.mother_code,
        m.weeks,
        m.address,
        m.district,
        m.emergency_contact_phone,
        m.current_weight,
        m.height
      FROM thriposha_eligibilities e
      JOIN mothers m ON e.mother_id = m.mother_id
      WHERE e.is_eligible = 1
        AND m.is_deleted = 0
    `;

    const replacements = [];
    
    if (midwife) {
      query += ` AND m.assigned_midwife_id = ?`;
      replacements.push(midwife.midwife_id);
    }

    query += ` ORDER BY e.assessed_date DESC`;

    const eligibleRows = await sequelize.query(query, {
      replacements,
      type: sequelize.QueryTypes.SELECT
    });

    console.log('Eligible mothers found:', eligibleRows.length);

    const eligibleMothers = eligibleRows.map(row => ({
      id: row.eligibility_id,
      name: row.full_name,
      motherId: row.mother_code,
      week: row.gestational_week ? `${row.gestational_week}th Week` : (row.weeks ? `${row.weeks}th Week` : 'N/A'),
      packets: row.bmi ? ((parseFloat(row.bmi) < 18.5 || parseFloat(row.bmi) >= 30) ? 2 : 1) : 1,
      assessedDate: new Date(row.assessed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      bmi: row.bmi || 'N/A',
      phone: row.emergency_contact_phone || 'N/A',
      address: row.address || 'N/A',
      status: 'Eligible',
      lastDistribution: row.assessed_date ? new Date(row.assessed_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A',
      notes: row.notes || 'Eligibility assessment available'
    }));

    return success(res, { eligible_mothers: eligibleMothers });
  } catch (err) {
    console.error('Error fetching eligible mothers:', err);
    return error(res, 'Error fetching eligible mothers: ' + err.message);
  }
};

// Get eligible mothers list with their distribution history
const getEligibleMothersWithDistributions = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({
      where: { user_id: req.user.user_id }
    });

    // Get recent distributions
    let distributionsQuery = `
      SELECT 
        ns.supplement_id,
        ns.mother_id,
        ns.distribution_date,
        ns.packets,
        ns.notes,
        m.full_name,
        m.mother_code,
        m.weeks,
        m.address,
        m.emergency_contact_phone,
        e.bmi
      FROM nutrition_supplements ns
      JOIN mothers m ON ns.mother_id = m.mother_id
      LEFT JOIN thriposha_eligibilities e ON m.mother_id = e.mother_id
      WHERE ns.supplement_type = 'thriposha'
        AND m.is_deleted = 0
    `;

    const replacements = [];

    if (midwife) {
      distributionsQuery += ` AND m.assigned_midwife_id = ?`;
      replacements.push(midwife.midwife_id);
    }

    distributionsQuery += ` ORDER BY ns.distribution_date DESC LIMIT 20`;

    const recentDistributions = await sequelize.query(distributionsQuery, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Format distributions for the log
    const formattedDistributions = recentDistributions.map(dist => ({
      id: dist.supplement_id,
      name: dist.full_name,
      motherId: dist.mother_code,
      week: dist.weeks ? `${dist.weeks}th Week` : 'N/A',
      packets: dist.packets || 1,
      date: new Date(dist.distribution_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      bmi: dist.bmi || 'N/A',
      phone: dist.emergency_contact_phone || 'N/A',
      address: dist.address || 'N/A',
      status: 'Active',
      lastDistribution: new Date(dist.distribution_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      notes: dist.notes || 'Regular Thriposha distribution'
    }));

    return success(res, { 
      recent_distributions: formattedDistributions
    });
  } catch (err) {
    console.error('Error fetching distributions:', err);
    return error(res, 'Error fetching distributions: ' + err.message);
  }
};

// Distribute Thriposha supplement
const distributeSupplement = async (req, res) => {
  try {
    const { mother_id, packets, notes, distribution_date } = req.body;
    
    // Find mother by mother_code or mother_id
    let mother = null;
    if (mother_id) {
      if (isNaN(parseInt(mother_id))) {
        mother = await Mother.findOne({ 
          where: { mother_code: mother_id, is_deleted: false }
        });
      } else {
        mother = await Mother.findOne({ 
          where: { mother_id: parseInt(mother_id), is_deleted: false }
        });
      }
    }
    
    if (!mother) {
      return error(res, 'Mother not found. Please check the Mother ID.', 404);
    }
    
    const distDate = distribution_date || new Date().toISOString().split('T')[0];
    const packetCount = parseInt(packets) || 1;
    
    // Insert distribution record
    await sequelize.query(
      `INSERT INTO nutrition_supplements 
       (mother_id, supplement_type, distribution_date, quantity, packets, is_eligible, distributed_by, notes)
       VALUES (?, 'thriposha', ?, ?, ?, 1, ?, ?)`,
      {
        replacements: [
          mother.mother_id,
          distDate,
          `${packetCount} packet(s)`,
          packetCount,
          req.user.user_id,
          notes || `Thriposha distribution - ${packetCount} packet(s)`
        ]
      }
    );
    
    return success(res, { 
      distribution: {
        mother_name: mother.full_name,
        mother_code: mother.mother_code,
        packets: packetCount,
        date: distDate
      }
    }, 'Thriposha distributed successfully', 201);
    
  } catch (err) {
    console.error('Error distributing supplement:', err);
    return error(res, 'Error distributing supplement: ' + err.message);
  }
};

// Get distribution history for a mother
const getDistributionHistory = async (req, res) => {
  try {
    const { motherId } = req.params;
    
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
    
    const history = await NutritionSupplement.findAll({
      where: { mother_id: mother.mother_id, supplement_type: 'thriposha' },
      order: [['distribution_date', 'DESC']]
    });
    
    return success(res, { history });
  } catch (err) {
    console.error('Error fetching history:', err);
    return error(res, 'Error fetching history');
  }
};

// Export report
const exportReport = async (req, res) => {
  try {
    const midwife = await Midwife.findOne({
      where: { user_id: req.user.user_id }
    });

    let query = `
      SELECT 
        ns.distribution_date,
        ns.packets,
        m.full_name,
        m.mother_code,
        m.weeks,
        e.bmi,
        e.is_eligible
      FROM nutrition_supplements ns
      JOIN mothers m ON ns.mother_id = m.mother_id
      LEFT JOIN thriposha_eligibilities e ON m.mother_id = e.mother_id
      WHERE ns.supplement_type = 'thriposha'
        AND m.is_deleted = 0
    `;

    const replacements = [];

    if (midwife) {
      query += ` AND m.assigned_midwife_id = ?`;
      replacements.push(midwife.midwife_id);
    }

    query += ` ORDER BY ns.distribution_date DESC`;

    const distributions = await sequelize.query(query, {
      replacements: replacements,
      type: sequelize.QueryTypes.SELECT
    });

    // Generate CSV content
    let csvContent = "Date,Mother Name,Mother Code,Weeks,Packets,BMI,Eligible\n";
    distributions.forEach(dist => {
      csvContent += `${dist.distribution_date},${dist.full_name},${dist.mother_code},${dist.weeks || 'N/A'},${dist.packets || 1},${dist.bmi || 'N/A'},${dist.is_eligible ? 'Yes' : 'No'}\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=thriposha_report_${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  } catch (err) {
    console.error('Error exporting report:', err);
    return error(res, 'Error exporting report: ' + err.message);
  }
};

module.exports = {
  getMyThriposhaStatus,
  getMyThriposhaHistory,
  assessEligibility,
  getEligibleMothers,
  getEligibleMothersWithDistributions,
  distributeSupplement,
  getDistributionHistory,
  exportReport
};