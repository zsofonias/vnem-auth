const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const Email = require('../utils/Email');

const User = require('../models/User');

const createToken = user => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      verified: user.verified
    },
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
  const newUser = await User.create(req.body);
  const accountVerificationToken = newUser.createAccountVerificationToken();
  newUser.save({ validateBeforeSave: false });

  // send verification link to email
  try {
    const accountVerificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/activate-account/${accountVerificationToken}`;
    const emailMessage = `
    Account created successfully!
    Activate Your account using this link:
    ${accountVerificationUrl}
    `;
    // send the email
    const newEmail = new Email(newUser, accountVerificationUrl);
    await newEmail.send('Verify Your Account', emailMessage);
    return res.status(201).json({
      success: true,
      status: 'success',
      message: 'User Registered, Verification Link Sent to email'
    });
  } catch (err) {
    return next(new AppError('Error: Email sending failed'));
  }
});

const verifyAccount = catchAsync(async (req, res, next) => {
  const hashedVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    accountVerificationToken: hashedVerificationToken,
    accountVerificationExpires: { $gt: Date.now() }
  });
  if (!user) {
    return next(
      new AppError('Request Denied: Token invalid or has expired', 400)
    );
  }

  user.verified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });
  sendResWithToken(user, 200, res);
});

const resendVerificationToken = catchAsync(async (req, res, next) => {
  if (!req.body.email) {
    return next(new AppError('Request Failed: Email is required', 400));
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('Request Denied: Email Does not exist', 400));
  }
  const accountVerificationToken = user.createAccountVerificationToken();
  await user.save({ validateBeforeSave: false });
  try {
    const accountVerificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/activate-account/${accountVerificationToken}`;
    const emailMessage = `
    Account created successfully!
    Activate Your account using this link:
    ${accountVerificationUrl}
    `;
    // send the email
    const newEmail = new Email(user, accountVerificationUrl);
    await newEmail.send('Verify Your Account', emailMessage);
    return res.status(201).json({
      success: true,
      status: 'success',
      message: 'Account Verification Link Sent to email'
    });
  } catch (err) {
    return next(new AppError('Error: Email sending failed'));
  }
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

  // send reset token to email
  try {
    const passwordResetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/reset-password/${passwordResetToken}`;
    const emailMessage = `
      You Have to reset your Password!
      Reset Your Password using this link:
      ${passwordResetUrl}
    `;
    // send password reset url to email
    const newEmail = new Email(user, passwordResetUrl);
    await newEmail.send('Reset Your Password', emailMessage);

    return res.status(200).json({
      success: true,
      status: 'success',
      message: 'Password Reset token sent to your email',
      passwordResetToken
    });
  } catch (err) {
    return next(new AppError('Error: Email sending failed.'));
  }
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
  verifyAccount,
  resendVerificationToken,
  loginUser,
  forgetPassword,
  resetPassword,
  updatePassword
};
