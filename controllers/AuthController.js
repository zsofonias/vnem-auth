const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const User = require('../models/User');

const createToken = user => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const sendResWithToken = (user, statusCode, res) => {
  const token = createToken(user);
  user.password = undefined;
  return res.status(statusCode).json({
    success: true,
    status: 'success',
    token,
    user
  });
};

const registerUser = catchAsync(async (req, res, next) => {
  await User.create(req.body);
  return res.status(201).json({
    success: true,
    status: 'success',
    message: 'User Registered'
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Email and Password are required', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.verifyPassword(password, user.password))) {
    return next(new AppError('Incorrect Email or Password', 400));
  }
  sendResWithToken(user, 200, res);
});

module.exports = {
  registerUser,
  loginUser
};
