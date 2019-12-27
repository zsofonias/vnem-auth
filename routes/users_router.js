const express = require('express');

const router = express.Router();

const AuthController = require('../controllers/AuthController');

/**
 * @route POST api/v1/users/register
 * @desc Register new User
 * @access Public
 */
router.post('/register', AuthController.registerUser);

module.exports = router;
