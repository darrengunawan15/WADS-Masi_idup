const express = require('express');
const router = express.Router({ mergeParams: true });
const { addComment, getComments } = require('../controllers/commentController');
const { check } = require('express-validator'); // Import check
const { protect } = require('../middleware/authMiddleware'); // Import protect middleware

// Removed express.json() middleware from here - relying on parent router
// Removed logging middleware from here - logging in parent router

/**
 * @swagger
 * /api/tickets/{ticketId}/comments:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Comments]
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
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *             properties:
 *               comment:
 *                 type: string
 *                 description: The comment text
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Ticket not found
 *   get:
 *     summary: Get all comments for a ticket
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ticketId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ticket ID
 *     responses:
 *       200:
 *         description: List of comments for the ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Ticket not found
 */
router.route('/')
  .post( protect,
  addComment) // Add a comment to a ticket
  .get( protect, getComments); // Get comments for a ticket

module.exports = router; 