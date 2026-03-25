'use strict';

const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { sendSuccess, sendError, sendPaginated } = require('../utils/responses');
const { getPaginationParams } = require('../utils/helpers');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return sendError(res, 404, 'NOT_FOUND', 'User not found');
    return sendSuccess(res, 200, user, 'Profile retrieved');
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return sendError(res, 404, 'NOT_FOUND', 'User not found');

    const { name, phone } = req.body;
    await user.update({ name, phone });

    const { password: _p, ...userData } = user.toJSON();
    return sendSuccess(res, 200, userData, 'Profile updated');
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return sendError(res, 404, 'NOT_FOUND', 'User not found');

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return sendError(res, 401, 'INVALID_CREDENTIALS', 'Current password is incorrect');

    const hashed = await bcrypt.hash(newPassword, 12);
    await user.update({ password: hashed });

    return sendSuccess(res, 200, null, 'Password changed successfully');
  } catch (err) {
    next(err);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    return sendPaginated(res, rows, count, page, limit, 'Users retrieved');
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, changePassword, getAllUsers };
