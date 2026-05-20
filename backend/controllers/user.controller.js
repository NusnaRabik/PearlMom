const { User, Mother, Midwife } = require('../models');
const { success, error } = require('../utils/response');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    return success(res, { users });
  } catch (err) {
    return error(res, 'Error fetching users');
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });
    if (!user) return error(res, 'User not found', 404);
    return success(res, { user });
  } catch (err) {
    return error(res, 'Error fetching user');
  }
};

module.exports = { getAllUsers, getUserById };