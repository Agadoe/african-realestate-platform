const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateToken);

// AI services
router.post('/search', aiController.semanticSearch);
router.post('/recommendations', aiController.getRecommendations);
router.post('/property-score', aiController.calculatePropertyScore);
router.post('/price-prediction', aiController.predictPropertyPrice);

module.exports = router;