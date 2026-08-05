const { Appointment, Mother, Clinic } = require('../models');
const { success, error } = require('../utils/response');
const { Op } = require('sequelize');

const formatTime24 = (timeStr) => {
  if (!timeStr || String(timeStr).trim() === '') return null;
  const str = String(timeStr).trim();
  const match12 = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2];
    const seconds = match12[3] || '00';
    const modifier = match12[4];
    if (modifier) {
      if (modifier.toUpperCase() === 'PM' && hours < 12) hours += 12;
      if (modifier.toUpperCase() === 'AM' && hours === 12) hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
  }
  if (/^\d{2}:\d{2}(:\d{2})?$/.test(str)) {
    return str.length === 5 ? `${str}:00` : str;
  }
  return null;
};

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

    const payload = {
      ...req.body,
      mother_id: mother.mother_id,
      status: req.body.status || 'scheduled',
      appointment_time: formatTime24(req.body.appointment_time),
      clinic_id: (req.body.clinic_id !== '' && req.body.clinic_id !== undefined && req.body.clinic_id !== null) ? Number(req.body.clinic_id) : null,
      notes: req.body.notes || null
    };

    const appointment = await Appointment.create(payload);

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
    const updates = { ...req.body };
    if (updates.appointment_time !== undefined) {
      updates.appointment_time = formatTime24(updates.appointment_time);
    }
    if (updates.clinic_id !== undefined) {
      updates.clinic_id = (updates.clinic_id !== '' && updates.clinic_id !== null) ? Number(updates.clinic_id) : null;
    }

    await Appointment.update(updates, {
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

const findMotherFlexible = async (motherId) => {
  if (!motherId) return null;
  const clean = decodeURIComponent(String(motherId)).trim();
  if (!clean) return null;

  if (!isNaN(clean) && Number(clean) > 0) {
    const byId = await Mother.findOne({ where: { mother_id: Number(clean), is_deleted: false } });
    if (byId) return byId;
  }

  const momMatch = clean.match(/^MOM-(?:2\d-)?0*(\d+)$/i);
  if (momMatch && momMatch[1]) {
    const num = Number(momMatch[1]);
    const byNum = await Mother.findOne({
      where: {
        [Op.or]: [{ mother_id: num }, { mother_code: clean }],
        is_deleted: false
      }
    });
    if (byNum) return byNum;
  }

  let mother = await Mother.findOne({ where: { mother_code: clean, is_deleted: false } });
  if (mother) return mother;

  mother = await Mother.findOne({
    where: {
      [Op.or]: [
        { mother_code: { [Op.like]: `%${clean}%` } },
        { full_name: { [Op.like]: `%${clean}%` } },
        { nic: { [Op.like]: `%${clean}%` } }
      ],
      is_deleted: false
    }
  });
  return mother;
};

const getAppointmentsByMotherId = async (req, res) => {
  try {
    const { motherId } = req.params;
    const mother = await findMotherFlexible(motherId);
    
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
    const { appointment_date, appointment_time, appointment_type, notes, clinic_id } = req.body;
    
    const mother = await findMotherFlexible(motherId);
    
    if (!mother) {
      return error(res, 'Mother not found', 404);
    }
    
    const appointment = await Appointment.create({
      mother_id: mother.mother_id,
      appointment_date: appointment_date || new Date().toISOString().split('T')[0],
      appointment_time: formatTime24(appointment_time),
      appointment_type: appointment_type || 'antenatal',
      clinic_id: (clinic_id !== '' && clinic_id !== undefined && clinic_id !== null) ? Number(clinic_id) : null,
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