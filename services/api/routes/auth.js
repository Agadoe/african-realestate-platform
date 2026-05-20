const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/security');

// Public routes with rate limiting for auth endpoints
router.post('/login', authLimiter, authController.login);
router.post('/register', authLimiter, authController.register);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', authLimiter, authController.resetPassword);

module.exports = router;