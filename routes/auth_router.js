const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController');

/**
 * @route POST api/v1/auth/register
 * @desc Register new User
 * @access Public
 */
router.post('/register', AuthController.registerUser);

/**
 * @route POST api/v1/auth/login
 * @desc Login a User
 * @access Public
 */
router.post('/login', AuthController.loginUser);

module.exports = router;
