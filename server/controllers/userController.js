const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const Ticket = require('../models/Ticket');

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('Received registration request'); // Log at the start
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Registration validation errors:', errors.array()); // Log validation errors
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, password, role } = req.body;
  console.log('Registration data:', { name, email, password: '[HIDDEN]', role }); // Log received data (hide password)

  const userExists = await User.findOne({ email });
  console.log('Check if user exists:', userExists ? 'Exists' : 'Does not exist'); // Log if user exists

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Create user with default role 'customer' if not provided (or if frontend shouldn't set role)
  const user = await User.create({
    name,
    email,
    password, // Password hashing is handled in the User model pre-save hook
    role: role || 'customer', // Default role to customer if not provided
  });

  console.log('Attempted to create user:', user ? user.email : 'Failed'); // Log after create

  if (user) {
    // Generate both access and refresh tokens
    const accessToken = generateToken(user._id, 'access');
    const refreshToken = generateToken(user._id, 'refresh');

    // Store refresh token in the user document
    user.refreshToken = refreshToken;
    await user.save();
    console.log('User saved with tokens'); // Log after save

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      accessToken, // Send access token
      refreshToken, // Send refresh token
    });
    console.log('Registration successful, response sent'); // Log success
  } else {
    console.log('Invalid user data during creation'); // Log if create failed
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  console.log('Received login request'); // Log at the start
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array()); // Log validation errors
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { email, password } = req.body;
  console.log('Attempting login for email:', email); // Log email

  const user = await User.findOne({ email });
  console.log('User found:', user ? user.email : 'None'); // Log if user found

  if (user) {
    console.log('DEBUG: Entered password:', password);
    console.log('DEBUG: Stored hash:', user.password);
  }

  // Check if user exists and password matches
  if (user && (await user.matchPassword(password))) {
      console.log('Password matches, generating tokens'); // Log successful match
      // Generate new access and refresh tokens on login
      const accessToken = generateToken(user._id, 'access');
      const refreshToken = generateToken(user._id, 'refresh');

      // Update the refresh token in the user document
      user.refreshToken = refreshToken;
      await user.save();
      console.log('Tokens generated and user saved'); // Log after token save

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      accessToken, // Send new access token
      refreshToken, // Send new refresh token
    });
    console.log('Login successful, response sent'); // Log success
  } else {
    console.log('Invalid email or password'); // Log invalid credentials
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Refresh access token
// @route   POST /api/users/refresh
// @access  Public (using refresh token)
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(401);
        throw new Error('Refresh token not provided');
    }

    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

        // Find user by decoded ID and check if the refresh token matches the one stored
        const user = await User.findById(decoded.id);

        if (!user || user.refreshToken !== refreshToken) {
            res.status(401);
            throw new Error('Invalid refresh token');
        }

        // Generate a new access token
        const newAccessToken = generateToken(user._id, 'access');

        // Optionally, implement refresh token rotation here by generating a new refresh token
        // and invalidating the old one.

        res.json({ accessToken: newAccessToken });

    } catch (error) {
        res.status(401);
        // More specific error message based on JWT verification failure
         if (error.name === 'TokenExpiredError') {
             throw new Error('Refresh token expired');
         } else if (error.name === 'JsonWebTokenError') {
             throw new Error('Invalid refresh token signature');
         } else {
             throw new Error('Failed to refresh access token');
         }
    }
});

// @desc    Logout user / clear cookies
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body; // Expect refresh token in body

    if (!refreshToken) {
         // If no refresh token is sent, simply acknowledge logout client-side
         res.status(200).json({ message: 'Logout successful (client-side)' });
         return;
    }

    try {
        // Find the user by their refresh token and remove it
        const user = await User.findOne({ refreshToken });

        if (user) {
            user.refreshToken = null;
            await user.save();
        }

        // In a real application with cookies, you would clear the httpOnly cookie here.
        // Since we are using local storage, clearing local storage is handled client-side.

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
         // Log the error but still send a success response to the client
         // as client-side logout (clearing local storage) has likely happened.
         console.error('Error during backend logout process:', error);
         res.status(200).json({ message: 'Logout initiated, but backend process encountered an issue.' });
    }
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  // Find all users, excluding password
  const users = await User.find({}).select('-password');

  res.status(200).json(users);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  console.log('Update request for userId:', req.params.userId);
  const user = await User.findById(req.params.userId);
  console.log('User found:', user);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, email, password, role, status } = req.body;

  // Only allow role change if:
  // - The user is not staff, or
  // - The new role is not admin/customer, or
  // - The user is admin changing their own role
  const isRoleChange = role && role !== user.role;
  const isStaffToAdminOrCustomer = user.role === 'staff' && (role === 'admin' || role === 'customer');
  const isSelf = req.user._id.toString() === user._id.toString();

  if (isRoleChange && isStaffToAdminOrCustomer && !isSelf) {
    // Check for unresolved tickets assigned to this staff
    const unresolvedTickets = await Ticket.find({ assignedTo: user._id, status: { $ne: 'resolved' } });
    if (unresolvedTickets.length > 0) {
      res.status(400);
      throw new Error('There are still tickets assigned to this staff that are not resolved.');
    }
  }

  // Allow admins to change their own role
  if (isRoleChange && isSelf && user.role === 'admin') {
    // No restriction
  } else if (isRoleChange && isStaffToAdminOrCustomer) {
    // Already checked above
  }

  // Update user fields
  user.name = name || user.name;
  user.email = email || user.email;
  user.password = password ? await user.hashPassword(password) : user.password;
  user.role = role || user.role;
  user.status = status || user.status;

  await user.save();

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  console.log('DEBUG updateProfile: path=', req.path, 'method=', req.method, 'user=', req.user);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  console.log('Profile update request received');
  const user = await User.findById(req.user._id);
  console.log('User found:', user ? user.email : 'None');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const { name, currentPassword, newPassword, phoneNumber } = req.body;

  // Enforce required name field
  if (!name) {
    res.status(400);
    throw new Error('Name is required');
  }
  user.name = name;

  // Update phone number if provided
  if (phoneNumber !== undefined) {
    user.phoneNumber = phoneNumber;
  }

  // Handle password update if provided
  if (currentPassword && newPassword) {
    console.log('DEBUG: Attempting password change');
    console.log('DEBUG: Entered currentPassword:', currentPassword);
    const isMatch = await user.matchPassword(currentPassword);
    console.log('DEBUG: isMatch result:', isMatch);
    if (!isMatch) {
      res.status(400);
      throw new Error('Current password is incorrect');
    }
    console.log('DEBUG: New password before hashing:', newPassword);
    user.password = newPassword;
    console.log('DEBUG: New password set (pre-save hook will hash):', user.password);
  }

  // Handle profile picture update if provided
  if (req.file) {
    // Upload to Cloudinary and store the secure_url
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`,
      {
        folder: 'wads-masi_idup/profile_pictures',
        resource_type: 'image',
      }
    );
    user.profilePicture = result.secure_url;
  }

  await user.save();
  console.log('DEBUG: User document after save:', user);

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture,
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getAllUsers,
  updateUser,
  updateProfile,
}; 