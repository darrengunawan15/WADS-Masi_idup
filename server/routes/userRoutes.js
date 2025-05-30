const express = require('express');
const router = express.Router();
const { registerUser, loginUser, refreshAccessToken, logoutUser, getAllUsers, updateUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator');

router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
  ],
  registerUser
);
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

// Route for refreshing access token
router.post('/refresh', refreshAccessToken);

// Route for logging out
router.post('/logout', logoutUser);

// Admin route to get all users
router.get('/', protect, authorize(['admin']), getAllUsers);

// Admin route to update a user
router.put('/:userId', protect, authorize(['admin']), updateUser);

module.exports = router;