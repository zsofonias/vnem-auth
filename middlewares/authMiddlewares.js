const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const User = require('../models/User');

const protect = catchAsync(async (req, res, next) => {
  console.log(req.headers.authorization);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const tokenSplited = req.headers.authorization.split(' ');
    token = tokenSplited[1];
    if (token === 'Bearer') token = tokenSplited[2];
  } else if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  if (!token) {
    return next(new AppError('Access Denied: Login Required', 401));
  }
  const jwtPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(jwtPayload.id);
  if (!currentUser) {
    return next(
      new AppError('Authentication Failed: User no longer Exists', 400)
    );
  }
  if (currentUser.isPasswordChanged(jwtPayload.iat)) {
    return next(
      new AppError('Access Denied: Token has Expired, Login Required', 401)
    );
  }
  req.user = currentUser;
  next();
});

module.exports = {
  protect
};
