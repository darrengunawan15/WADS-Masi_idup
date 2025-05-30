const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, assignTicket, uploadFileAttachment } = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController'); // Import comment controller functions
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator'); // Import check

// Re-route into comment router
// This allows accessing comment routes via /api/tickets/:ticketId/comments
router.use('/:ticketId/comments', protect, require('./commentRoutes'));

router.route('/')
  .post(protect, [
    check('subject', 'Subject is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Invalid category ID').optional().isMongoId(),
  ], createTicket) // Only authenticated users (customers) can create tickets, with validation
  .get(protect, authorize(['staff', 'admin']), getTickets); // Only staff and admin can get all tickets

router.route('/:id')
  .get(protect, getTicketById) // Authenticated user (customer if owned, staff, admin) can get a ticket by ID
  .put(protect, [
    check('subject', 'Subject is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('status', 'Invalid status').optional().isIn(['open', 'in progress', 'closed']),
    check('assignedTo', 'Invalid assignedTo user ID').optional().isMongoId(),
    check('category', 'Invalid category ID').optional().isMongoId(),
  ], updateTicket) // Staff, Admin, (and potentially customer for status) can update a ticket, with validation
  .delete(protect, authorize(['admin']), deleteTicket); // Only admin can delete tickets

// Specific route for assigning tickets
router.route('/:id/assign')
  .put(protect, authorize(['staff', 'admin']), [
    check('assignedTo', 'User ID to assign is required').not().isEmpty(),
    check('assignedTo', 'Invalid user ID to assign').isMongoId(),
  ], assignTicket); // Only staff and admin can assign tickets, with validation

router.route('/:ticketId/upload')
  .post(protect, uploadFileAttachment); // Authenticated user can upload files to a ticket

module.exports = router; 