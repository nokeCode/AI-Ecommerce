const express = require('express');
const router = express.Router();

const { handleChatMessage } = require('../controllers/chatController');

// Accept text/plain and JSON payloads for streaming transports
router.post('/', express.text({ type: '*/*' }), handleChatMessage);

module.exports = router;
