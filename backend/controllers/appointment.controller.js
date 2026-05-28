const { Appointment, Mother, Clinic } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

const getMyAppointments = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const appointments = await Appointment.findAll({
      where: { mother_id: mother.mother_id, is_deleted: false },
      include: [
        {
          model: Clinic,
          attributes: ['clinic_id', 'name', 'address', 'contact_number']
        }
      ],
      order: [['appointment_date', 'DESC']]
    });

    const formattedAppointments = appointments.map(app => ({
      appointment_id: app.appointment_id,
      appointment_date: app.appointment_date,
      appointment_time: app.appointment_time,
      appointment_type: app.appointment_type,
      status: app.status,
      notes: app.notes,
      clinic_name: app.Clinic ? app.Clinic.name : null,
      Clinic: app.Clinic ? {
        clinic_name: app.Clinic.name,
        address: app.Clinic.address,
        contact_number: app.Clinic.contact_number
      } : null
    }));

    return success(res, { appointments: formattedAppointments });
  } catch (err) {
    console.error('Error fetching appointments:', err);
    return error(res, 'Error fetching appointments: ' + err.message);
  }
};

const createAppointment = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const appointment = await Appointment.create({
      mother_id: mother.mother_id,
      status: 'scheduled',
      ...req.body
    });

    const createdAppointment = await Appointment.findByPk(appointment.appointment_id, {
      include: [{ model: Clinic, attributes: ['name', 'address', 'contact_number'] }]
    });

    return success(res, { appointment: createdAppointment }, 'Appointment created successfully', 201);
  } catch (err) {
    console.error('Error creating appointment:', err);
    return error(res, 'Error creating appointment: ' + err.message);
  }
};

const updateAppointment = async (req, res) => {
  try {
    await Appointment.update(req.body, {
      where: { appointment_id: req.params.id }
    });

    const updated = await Appointment.findByPk(req.params.id, {
      include: [{ model: Clinic, attributes: ['name', 'address', 'contact_number'] }]
    });
    
    return success(res, { appointment: updated }, 'Appointment updated successfully');
  } catch (err) {
    console.error('Error updating appointment:', err);
    return error(res, 'Error updating appointment: ' + err.message);
  }
};

const getUpcomingAppointments = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const appointments = await Appointment.findAll({
      where: {
        mother_id: mother.mother_id,
        status: 'scheduled',
        appointment_date: { [Op.gte]: new Date() },
        is_deleted: false
      },
      include: [{ model: Clinic, attributes: ['name', 'address', 'contact_number'] }],
      order: [['appointment_date', 'ASC']],
      limit: 5
    });

    return success(res, { appointments });
  } catch (err) {
    console.error('Error fetching upcoming appointments:', err);
    return error(res, 'Error fetching upcoming appointments');
  }
};

const getAppointmentsByMotherId = async (req, res) => {
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

    const appointments = await Appointment.findAll({
      where: { mother_id: mother.mother_id, is_deleted: false },
      include: [
        {
          model: Clinic,
          attributes: ['clinic_id', 'name', 'address', 'contact_number']
        }
      ],
      order: [['appointment_date', 'DESC']]
    });

    const formattedAppointments = appointments.map(app => ({
      appointment_id: app.appointment_id,
      appointment_date: app.appointment_date,
      appointment_time: app.appointment_time,
      appointment_type: app.appointment_type,
      status: app.status,
      notes: app.notes,
      clinic_name: app.Clinic ? app.Clinic.name : null
    }));

    return success(res, { appointments: formattedAppointments });
  } catch (err) {
    console.error('Error fetching appointments by mother ID:', err);
    return error(res, 'Error fetching appointments: ' + err.message);
  }
};

const addAppointmentForMother = async (req, res) => {
  try {
    const { motherId } = req.params;
    const { appointment_date, appointment_time, appointment_type, notes } = req.body;
    
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
    
    const appointment = await Appointment.create({
      mother_id: mother.mother_id,
      appointment_date,
      appointment_time: appointment_time || null,
      appointment_type: appointment_type || 'antenatal',
      status: 'scheduled',
      notes: notes || null
    });
    
    return success(res, { appointment }, 'Appointment created successfully', 201);
  } catch (err) {
    console.error('Error adding appointment for mother:', err);
    return error(res, 'Error adding appointment: ' + err.message);
  }
};

module.exports = { 
  getMyAppointments, 
  createAppointment, 
  updateAppointment,
  getUpcomingAppointments,
  getAppointmentsByMotherId,
  addAppointmentForMother
};