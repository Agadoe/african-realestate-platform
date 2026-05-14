const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateToken);

// User profile management
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);

// User favorites
router.get('/:id/favorites', userController.getUserFavorites);
router.post('/:id/favorites', userController.addFavorite);
router.delete('/:id/favorites/:propertyId', userController.removeFavorite);

module.exports = router;