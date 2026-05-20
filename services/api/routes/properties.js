const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const { authenticateToken } = require('../middleware/auth');
const { validateRequest } = require('../middleware/security');

// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);
router.post('/search', propertyController.searchProperties);

// Protected routes (require authentication)
router.use(authenticateToken);

// Agent and owner routes with validation
router.post('/', validateRequest('createProperty'), propertyController.createProperty);
router.put('/:id', validateRequest('updateProperty'), propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

// Owner: get their own listings
router.get('/my-listings', propertyController.getMyListings);

// User favorites routes
router.get('/favorites/:userId', propertyController.getUserFavorites);
router.post('/favorites/:userId', propertyController.addFavorite);
router.delete('/favorites/:userId/:propertyId', propertyController.removeFavorite);

// AI recommendation routes
router.get('/recommendations/:userId', propertyController.getRecommendations);

module.exports = router;