const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments } = require('../controllers/commentController');
const { check } = require('express-validator'); // Import check

router.route('/')
  .post( [
    check('content', 'Comment content is required').not().isEmpty(),
  ], addComment) // Add a comment to a ticket, with validation
  .get(getComments); // Get comments for a ticket

module.exports = router; 