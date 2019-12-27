const crypto = require('crypto');
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
  const token = `Bearer ${createToken(user)}`;
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

const forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Request Failed: User not found', 400));
  }
  const passwordResetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    success: true,
    status: 'success',
    // message: '',
    passwordResetToken
  });
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedResetToken,
    passwordResetExpires: { $gte: Date.now() }
  });
  if (!user) {
    return next(
      new AppError('Request Denied: Token invalid or has expired', 400)
    );
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  sendResWithToken(user, 200, res);
});

const updatePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.password ||
    !req.body.newPassword ||
    !req.body.confirmNewPassword
  ) {
    return next(
      new AppError(
        'Request Failed: current password, new password and confirmed new password are required',
        400
      )
    );
  }
  const user = await User.findById(req.user.id).select('+password');
  if (!user) {
    return next(new AppError('Request Failed: User dose not exist', 400));
  }
  const isPasswordCorrect = await user.verifyPassword(
    req.body.password,
    user.password
  );
  if (!isPasswordCorrect) {
    return next(new AppError('Incorrect current password', 400));
  }
  user.password = req.body.newPassword;
  user.confirmPassword = req.body.confirmNewPassword;
  await user.save();
  sendResWithToken(user, 200, res);
});

module.exports = {
  registerUser,
  loginUser,
  forgetPassword,
  resetPassword,
  updatePassword
};
