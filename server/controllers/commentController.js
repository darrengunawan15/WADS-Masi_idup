const Comment = require('../models/Comment');
const Ticket = require('../models/Ticket');
const { validationResult } = require('express-validator'); // Import validationResult

// @desc    Add a comment to a ticket
// @route   POST /api/tickets/:ticketId/comments
// @access  Authenticated User (Customer, Staff, Admin)
const addComment = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;
  const ticketId = req.params.ticketId;
  const authorId = req.user._id; // Get author ID from authenticated user
  const userRole = req.user.role;

  if (!content) {
    res.status(400).json({ message: 'Please provide comment content' });
    return;
  }

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if the user is authorized to comment on this ticket
    // Customers can only comment on their own tickets
    // Staff and Admin can comment on any ticket
    const isCustomerOwner = ticket.customer.equals(authorId);
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    if (!isCustomerOwner && !isStaffOrAdmin) {
      res.status(403).json({ message: `User role ${userRole} is not authorized to comment on this ticket` });
      return;
    }

    const comment = await Comment.create({
      ticket: ticketId,
      author: authorId,
      content,
    });

    // Add the comment reference to the ticket
    ticket.comments.push(comment._id);
    await ticket.save();

    // Populate the author in the created comment before sending the response
    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name role');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Get comments for a ticket
// @route   GET /api/tickets/:ticketId/comments
// @access  Authenticated User (Customer if owned, Staff, Admin) who can view the ticket
const getComments = async (req, res) => {
  const ticketId = req.params.ticketId;
  const userId = req.user._id;
  const userRole = req.user.role;

  try {
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      res.status(404).json({ message: 'Ticket not found' });
      return;
    }

    // Check if the user is authorized to view comments on this ticket
    // Same logic as viewing the ticket itself
    const isCustomerOwner = ticket.customer.equals(userId);
    const isStaffOrAdmin = userRole === 'staff' || userRole === 'admin';

    if (!isCustomerOwner && !isStaffOrAdmin) {
      res.status(403).json({ message: `User role ${userRole} is not authorized to view comments on this ticket` });
      return;
    }

    // Get comments and populate the author
    const comments = await Comment.find({ ticket: ticketId }).populate('author', 'name role');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { addComment, getComments }; 