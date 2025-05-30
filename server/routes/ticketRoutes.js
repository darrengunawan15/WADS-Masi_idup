const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, assignTicket, uploadFileAttachment } = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController'); // Import comment controller functions
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator'); // Import check

// Re-route into comment router
/**
 * @swagger
 * /api/tickets/{ticketId}/comments:
 *   parameters:
 *     - in: path
 *       name: ticketId
 *       schema:
 *         type: string
 *       required: true
 *       description: The ticket ID
 *   get:
 *     summary: Get all comments for a ticket
 *     tags: [Tickets, Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment' # Assuming you will define a Comment schema
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Ticket not found
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Tickets, Comments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *             properties:
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Ticket not found
 */
// This allows accessing comment routes via /api/tickets/:ticketId/comments
router.use('/:ticketId/comments', protect, require('./commentRoutes'));

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket (Authenticated users only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string # Assuming category ID is a string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket' # Assuming you will define a Ticket schema
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *   get:
 *     summary: Get all tickets (Staff and Admin only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 */
router.route('/')
  .post(protect, [
    check('subject', 'Subject is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Invalid category ID').optional().isMongoId(),
  ], createTicket) // Only authenticated users (customers) can create tickets, with validation
  .get(protect, authorize(['staff', 'admin']), getTickets); // Only staff and admin can get all tickets

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID (Authenticated user if owned, Staff, or Admin)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (if not staff/admin and not the ticket owner)
 *       404:
 *         description: Ticket not found
 *   put:
 *     summary: Update a ticket (Staff, Admin, and potentially customer for status)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [open, in progress, closed]
 *               assignedTo:
 *                 type: string # Assuming user ID is a string
 *               category:
 *                 type: string # Assuming category ID is a string
 *     responses:
 *       200:
 *         description: Ticket updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Ticket not found
 *   delete:
 *     summary: Delete a ticket (Admin only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Ticket not found
 */
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

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   put:
 *     summary: Assign a ticket (Staff and Admin only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - assignedTo
 *             properties:
 *               assignedTo:
 *                 type: string # Assuming user ID is a string
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ticket'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Ticket not found
 */
// Specific route for assigning tickets
router.route('/:id/assign')
  .put(protect, authorize(['staff', 'admin']), [
    check('assignedTo', 'User ID to assign is required').not().isEmpty(),
    check('assignedTo', 'Invalid user ID to assign').isMongoId(),
  ], assignTicket); // Only staff and admin can assign tickets, with validation

/**
 * @swagger
 * /api/tickets/{ticketId}/upload:
 *   post:
 *     summary: Upload a file attachment to a ticket (Authenticated users only)
 *     tags: [Tickets, File Attachments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileAttachment' # Assuming you will define a FileAttachment schema
 *       400:
 *         description: Invalid input or file upload failed
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Ticket not found
 */
router.route('/:ticketId/upload')
  .post(protect, uploadFileAttachment); // Authenticated user can upload files to a ticket

module.exports = router; 