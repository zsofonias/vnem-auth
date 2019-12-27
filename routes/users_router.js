const express = require('express');
const passport = require('passport');

const router = express.Router();

const UsersController = require('../controllers/UsersController');
const AuthMiddlewares = require('../middlewares/authMiddlewares');

/**
 * @route GET api/v1/users/profile
 * @desc Returns Current User data
 * @access Private
 */
router.get('/profile', AuthMiddlewares.protect, UsersController.getUserProfile);
// Using passport middleware
// router.get(
//   '/profile',
//   passport.authenticate('jwt', {
//     session: false
//   }),
//   UsersController.getUserProfile
// );

module.exports = router;
