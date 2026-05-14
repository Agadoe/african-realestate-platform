const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Public routes
router.get('/', agentController.getAgents);
router.get('/:id', agentController.getAgent);
router.get('/:id/reviews', agentController.getAgentReviews);

// Protected routes (require authentication)
router.use(authenticateToken);

// Agent profile management (agents can update their own profile)
router.put('/:id', authorizeRole(['agent']), agentController.updateAgent);
router.post('/:id/verify', authorizeRole(['agent']), agentController.verifyAgent);

module.exports = router;