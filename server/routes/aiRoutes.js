const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * @swagger
 * /api/ai-chat:
 *   post:
 *     summary: Send a message to the AI chatbot and get a response
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message to the chatbot
 *     responses:
 *       200:
 *         description: AI chatbot response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                   description: The chatbot's reply
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
// POST /api/ai-chat
router.post('/ai-chat', async (req, res) => {
  try {
    const apiKey = process.env.DENSER_API_KEY;
    const chatbotId = process.env.DENSER_CHATBOT_ID;
    const { message } = req.body; // The frontend should send { message: "..." }

    const payload = {
      question: message,         // The user's message
      chatbotId: chatbotId,      // Your chatbot ID
      key: apiKey                // Your API key
    };

    const response = await axios.post('https://denser.ai/api/query', payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('Denser AI error:', err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data?.error || err.message });
  }
});

module.exports = router; 