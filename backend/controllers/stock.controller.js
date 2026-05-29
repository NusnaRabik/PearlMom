const ThriposhaStock = require('../models/ThriposhaStock');
const ThriposhaStockSettings = require('../models/ThriposhaStockSettings');
const VaccineStock = require('../models/VaccineStock');
const { successResponse, errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// ==================== THRIPOSHA STOCK ====================

// Get Thriposha stock summary
const getThriposhaStock = async (req, res) => {
  try {
    const batches = await ThriposhaStock.findAll({
      where: { status: { [Op.ne]: 'expired' } },
      order: [['expiry_date', 'ASC']]
    });

    const totalReceived = batches.reduce((sum, b) => sum + b.packets_received, 0);
    const totalDistributed = batches.reduce((sum, b) => sum + b.packets_distributed, 0);
    const totalDamaged = batches.reduce((sum, b) => sum + b.packets_damaged, 0);
    const totalExpired = batches.reduce((sum, b) => sum + b.packets_expired, 0);
    const remainingStock = totalReceived - totalDistributed - totalDamaged - totalExpired;

    const settings = await ThriposhaStockSettings.findOne();
    const lowStockThreshold = settings?.low_stock_threshold || 200;

    return successResponse(res, {
      summary: {
        total_received: totalReceived,
        total_distributed: totalDistributed,
        total_damaged: totalDamaged,
        total_expired: totalExpired,
        remaining_stock: remainingStock,
        low_stock_threshold: lowStockThreshold,
        is_low_stock: remainingStock <= lowStockThreshold
      },
      batches
    });
  } catch (error) {
    console.error('Error fetching Thriposha stock:', error);
    return errorResponse(res, 'Failed to fetch stock data');
  }
};

// Add new Thriposha stock batch
const addThriposhaBatch = async (req, res) => {
  try {
    const { batch_number, packets_received, received_date, expiry_date, supplier, batch_notes } = req.body;

    const existingBatch = await ThriposhaStock.findOne({ where: { batch_number } });
    if (existingBatch) {
      return errorResponse(res, 'Batch number already exists', 400);
    }

    const batch = await ThriposhaStock.create({
      batch_number,
      packets_received,
      packets_distributed: 0,
      packets_damaged: 0,
      packets_expired: 0,
      received_date,
      expiry_date,
      supplier,
      batch_notes,
      status: 'active',
      created_by: req.user.user_id
    });

    return successResponse(res, { batch }, 'Stock batch added successfully');
  } catch (error) {
    console.error('Error adding Thriposha batch:', error);
    return errorResponse(res, 'Failed to add stock batch');
  }
};

// Update Thriposha stock settings
const updateThriposhaSettings = async (req, res) => {
  try {
    const { low_stock_threshold, critical_stock_threshold, alert_email } = req.body;

    let settings = await ThriposhaStockSettings.findOne();
    if (settings) {
      await settings.update({
        low_stock_threshold,
        critical_stock_threshold,
        alert_email,
        updated_by: req.user.user_id
      });
    } else {
      settings = await ThriposhaStockSettings.create({
        low_stock_threshold,
        critical_stock_threshold,
        alert_email,
        updated_by: req.user.user_id
      });
    }

    return successResponse(res, { settings }, 'Settings updated successfully');
  } catch (error) {
    console.error('Error updating settings:', error);
    return errorResponse(res, 'Failed to update settings');
  }
};

// ==================== VACCINE STOCK ====================

// Get all vaccine stock
const getAllVaccineStock = async (req, res) => {
  try {
    const vaccines = await VaccineStock.findAll({
      where: { status: { [Op.ne]: 'expired' } },
      order: [['expiry_date', 'ASC']]
    });

    // Group by vaccine name for summary
    const summary = {};
    vaccines.forEach(v => {
      const name = v.vaccine_name;
      if (!summary[name]) {
        summary[name] = {
          vaccine_name: name,
          vaccine_type: v.vaccine_type,
          total_received: 0,
          total_used: 0,
          total_damaged: 0,
          total_expired: 0,
          remaining: 0,
          batches: []
        };
      }
      summary[name].total_received += v.doses_received;
      summary[name].total_used += v.doses_used;
      summary[name].total_damaged += v.doses_damaged;
      summary[name].total_expired += v.doses_expired;
      summary[name].remaining += (v.doses_received - v.doses_used - v.doses_damaged - v.doses_expired);
      summary[name].batches.push(v);
    });

    return successResponse(res, {
      summary: Object.values(summary),
      all_batches: vaccines
    });
  } catch (error) {
    console.error('Error fetching vaccine stock:', error);
    return errorResponse(res, 'Failed to fetch vaccine stock');
  }
};

// Get vaccine stock by type
const getVaccineStockByType = async (req, res) => {
  try {
    const { vaccineType } = req.params;
    const vaccines = await VaccineStock.findAll({
      where: { 
        vaccine_type: vaccineType,
        status: { [Op.ne]: 'expired' }
      },
      order: [['expiry_date', 'ASC']]
    });

    const totalReceived = vaccines.reduce((sum, v) => sum + v.doses_received, 0);
    const totalUsed = vaccines.reduce((sum, v) => sum + v.doses_used, 0);
    const totalDamaged = vaccines.reduce((sum, v) => sum + v.doses_damaged, 0);
    const totalExpired = vaccines.reduce((sum, v) => sum + v.doses_expired, 0);
    const remaining = totalReceived - totalUsed - totalDamaged - totalExpired;

    return successResponse(res, {
      summary: {
        vaccine_type: vaccineType,
        total_received: totalReceived,
        total_used: totalUsed,
        total_damaged: totalDamaged,
        total_expired: totalExpired,
        remaining
      },
      batches: vaccines
    });
  } catch (error) {
    console.error('Error fetching vaccine stock by type:', error);
    return errorResponse(res, 'Failed to fetch vaccine stock');
  }
};

// Add new vaccine batch
const addVaccineBatch = async (req, res) => {
  try {
    const {
      vaccine_name, vaccine_type, batch_number, manufacturer,
      doses_received, received_date, expiry_date,
      storage_temperature, purchase_order_number, supplier, lot_number, notes
    } = req.body;

    const existingBatch = await VaccineStock.findOne({ where: { batch_number } });
    if (existingBatch) {
      return errorResponse(res, 'Batch number already exists', 400);
    }

    const batch = await VaccineStock.create({
      vaccine_name,
      vaccine_type,
      batch_number,
      manufacturer,
      doses_received,
      doses_used: 0,
      doses_damaged: 0,
      doses_expired: 0,
      received_date,
      expiry_date,
      storage_temperature,
      purchase_order_number,
      supplier,
      lot_number,
      notes,
      status: 'active',
      created_by: req.user.user_id
    });

    return successResponse(res, { batch }, 'Vaccine batch added successfully');
  } catch (error) {
    console.error('Error adding vaccine batch:', error);
    return errorResponse(res, 'Failed to add vaccine batch');
  }
};

// Record vaccine usage (deduct from stock)
const recordVaccineUsage = async (req, res) => {
  try {
    const { batch_id, doses_used } = req.body;

    const batch = await VaccineStock.findByPk(batch_id);
    if (!batch) {
      return errorResponse(res, 'Batch not found', 404);
    }

    const newUsed = batch.doses_used + doses_used;
    const remaining = batch.doses_received - newUsed - batch.doses_damaged - batch.doses_expired;

    await batch.update({ doses_used: newUsed });

    // Update status if exhausted
    if (remaining <= 0) {
      await batch.update({ status: 'exhausted' });
    }

    return successResponse(res, { batch, remaining }, 'Usage recorded successfully');
  } catch (error) {
    console.error('Error recording vaccine usage:', error);
    return errorResponse(res, 'Failed to record usage');
  }
};

// Get expiring batches
const getExpiringBatches = async (req, res) => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const thriposhaExpiring = await ThriposhaStock.findAll({
      where: {
        expiry_date: { [Op.lte]: thirtyDaysFromNow },
        status: 'active',
        [Op.and]: [
          sequelize.literal('packets_received - packets_distributed - packets_damaged - packets_expired > 0')
        ]
      },
      order: [['expiry_date', 'ASC']]
    });

    const vaccineExpiring = await VaccineStock.findAll({
      where: {
        expiry_date: { [Op.lte]: thirtyDaysFromNow },
        status: 'active',
        [Op.and]: [
          sequelize.literal('doses_received - doses_used - doses_damaged - doses_expired > 0')
        ]
      },
      order: [['expiry_date', 'ASC']]
    });

    return successResponse(res, {
      thriposha: thriposhaExpiring,
      vaccines: vaccineExpiring
    });
  } catch (error) {
    console.error('Error fetching expiring batches:', error);
    return errorResponse(res, 'Failed to fetch expiring batches');
  }
};

module.exports = {
  getThriposhaStock,
  addThriposhaBatch,
  updateThriposhaSettings,
  getAllVaccineStock,
  getVaccineStockByType,
  addVaccineBatch,
  recordVaccineUsage,
  getExpiringBatches
};