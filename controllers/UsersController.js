const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/User');

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const getUserProfile = (req, res, next) => {
  return res.status(200).json({
    user: req.user
  });
};

module.exports = {
  getMe,
  getUserProfile
};
