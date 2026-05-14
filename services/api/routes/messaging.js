const express = require('express');
const router = express.Router();
const messagingController = require('../controllers/messagingController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateToken);

// Inquiries
router.post('/inquiries', messagingController.sendInquiry);
router.get('/inquiries/:userId', messagingController.getUserInquiries);

// Messages
router.post('/messages', messagingController.sendMessage);
router.get('/messages/:userId', messagingController.getUserMessages);

module.exports = router;