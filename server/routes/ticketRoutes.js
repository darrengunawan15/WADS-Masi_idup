const express = require('express');
const router = express.Router();
const { createTicket, getTickets, getTicketById, updateTicket, deleteTicket, assignTicket, uploadFileAttachment, getDailyTicketStats, getAverageResponseTime, getCustomerTickets } = require('../controllers/ticketController');
const { addComment, getComments } = require('../controllers/commentController'); // Import comment controller functions
const { protect, authorize } = require('../middleware/authMiddleware');
const { check } = require('express-validator'); // Import check
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
}).array('files', 10); // Accept up to 10 files per ticket

// Add a middleware to log the request body before comment routes are used
router.use('/:ticketId/comments', (req, res, next) => {
  console.log('Ticket Routes (before comments) - Request Body:', req.body);
  next();
}, require('./commentRoutes'));

/**
 * @swagger
 * /api/tickets/stats/daily:
 *   get:
 *     summary: Get daily ticket statistics (Staff and Admin only)
 *     tags: [Tickets, Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily ticket counts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: date
 *                     description: Date in YYYY-MM-DD format
 *                   count:
 *                     type: integer
 *                     description: Number of tickets created on this date
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.route('/stats/daily').get(protect, authorize(['staff', 'admin']), getDailyTicketStats);

/**
 * @swagger
 * /api/tickets/stats/response-time:
 *   get:
 *     summary: Get average response time per day (Staff and Admin only)
 *     tags: [Tickets, Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Average response time per day (in hours)
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     format: date
 *                     description: Date in YYYY-MM-DD format
 *                   averageResponseTimeHours:
 *                     type: number
 *                     description: Average response time in hours for that day
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       500:
 *         description: Server error
 */
router.route('/stats/response-time').get(protect, authorize(['staff', 'admin']), getAverageResponseTime);

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
  .post(protect, upload, [
    check('subject', 'Subject is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Invalid category ID').optional().isMongoId(),
  ], createTicket) // Only authenticated users (customers) can create tickets, with validation
  .get(protect, authorize(['staff', 'admin']), getTickets); // Only staff and admin can get all tickets

/**
 * @swagger
 * /api/tickets/customer:
 *   get:
 *     summary: Get all tickets for the authenticated customer
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tickets for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Ticket'
 *       401:
 *         description: Not authenticated
 */
router.get('/customer', protect, getCustomerTickets);

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
 *                 enum: [unassigned, in progress, resolved]
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
    check('status', 'Invalid status').optional().isIn(['unassigned', 'in progress', 'resolved']),
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