const express = require('express');
const axios = require('axios');
const router = express.Router();

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