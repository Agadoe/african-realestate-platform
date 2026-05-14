const express = require('express');
const router = express.Router();
const neighborhoodController = require('../controllers/neighborhoodController');

// Public routes
router.get('/', neighborhoodController.getNeighborhoods);
router.get('/:id', neighborhoodController.getNeighborhood);
router.get('/:id/intelligence', neighborhoodController.getNeighborhoodIntelligence);

module.exports = router;