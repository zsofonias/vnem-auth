const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController');
const AuthMiddlewares = require('../middlewares/authMiddlewares');

/**
 * @route POST api/v1/auth/register
 * @desc Register new User
 * @access Public
 */
router.post('/register', AuthController.registerUser);

/**
 * @route GET api/v1/auth/verify-account/:token
 * @desc Verify Account
 * @access Public
 */
router.get('/verify-account/:token', AuthController.verifyAccount);

/**
 * @route POST api/v1/auth/request-verify
 * @desc Send Verification token to email
 * @access Public
 */
router.post('/request-verify', AuthController.resendVerificationToken);

/**
 * @route POST api/v1/auth/login
 * @desc Login a User
 * @access Public
 */
router.post('/login', AuthController.loginUser);

/**
 * @route POST api/v1/auth/forget-password
 * @desc Forget Password
 * @access Public
 */
router.post('/forget-password', AuthController.forgetPassword);

/**
 * @route POST api/v1/auth/reset-password/:token
 * @desc Reset Password
 * @access Public
 */
router.post('/reset-password/:token', AuthController.resetPassword);

/**
 * @route POST api/v1/auth/update-password
 * @desc Update Password
 * @access Private
 */
router.post(
  '/update-password',
  AuthMiddlewares.protect,
  AuthController.updatePassword
);

module.exports = router;
