const { Appointment, Mother } = require('../models');
const { success, error } = require('../utils/response');

const getMyAppointments = async (req, res) => {
  try {
    const mother = await Mother.findOne({
      where: { user_id: req.user.user_id }
    });

    if (!mother) return error(res, 'Mother profile not found', 404);

    const appointments = await Appointment.findAll({
      where: { mother_id: mother.mother_id },
      order: [['appointment_date', 'DESC']]
    });

    return success(res, { appointments });
  } catch (err) {
    return error(res, 'Error fetching appointments');
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
      ...req.body
    });

    return success(res, { appointment }, 'Appointment created', 201);
  } catch (err) {
    return error(res, 'Error creating appointment');
  }
};

const updateAppointment = async (req, res) => {
  try {
    await Appointment.update(req.body, {
      where: { appointment_id: req.params.id }
    });

    const updated = await Appointment.findByPk(req.params.id);
    return success(res, { appointment: updated }, 'Appointment updated');
  } catch (err) {
    return error(res, 'Error updating appointment');
  }
};

module.exports = { getMyAppointments, createAppointment, updateAppointment };