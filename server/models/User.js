const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto'); // Import crypto

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['customer', 'staff', 'admin'],
      default: 'customer',
    },
    phoneNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    profilePicture: {
      type: String,
      default: null,
    },
    refreshTokens: [String], // Add refreshTokens field as an array of strings
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to generate and save refresh token
userSchema.methods.generateRefreshToken = async function () {
  const refreshToken = crypto.randomBytes(40).toString('hex');
  this.refreshTokens.push(refreshToken);
  await this.save();
  return refreshToken;
};

// Method to remove refresh token (e.g., on logout)
userSchema.methods.removeRefreshToken = async function (refreshToken) {
  this.refreshTokens = this.refreshTokens.filter(token => token !== refreshToken);
  await this.save();
};

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 