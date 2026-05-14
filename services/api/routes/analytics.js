const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateToken);

// Analytics tracking
router.post('/views', analyticsController.trackView);
router.post('/searches', analyticsController.trackSearch);
router.post('/conversions', analyticsController.trackConversion);

// Analytics reports
router.get('/reports', analyticsController.getAnalyticsReport);
router.get('/reports/user/:userId', analyticsController.getUserAnalytics);

module.exports = router;