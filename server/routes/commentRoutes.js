const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments } = require('../controllers/commentController');
const { check } = require('express-validator'); // Import check
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Removed express.json() middleware from here - relying on parent router
// Removed logging middleware from here - logging in parent router

router.route('/')
  .post( protect,
  addComment) // Add a comment to a ticket
  .get( protect, getComments); // Get comments for a ticket

module.exports = router; 