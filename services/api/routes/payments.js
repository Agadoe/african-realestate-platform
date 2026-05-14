const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Protected routes (require authentication)
router.use(authenticateToken);

// Payment intents
router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/confirm-payment', paymentController.confirmPayment);

// Transactions
router.get('/transactions', paymentController.getTransactions);
router.get('/transactions/:id', paymentController.getTransaction);

// Refunds
router.post('/refunds', paymentController.createRefund);

// Webhooks
router.post('/webhook', express.raw({type: 'application/json'}), paymentController.handleWebhook);

module.exports = router;