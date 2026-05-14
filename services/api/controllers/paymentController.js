const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'GHS', description, metadata } = req.body;

    // Validate input
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      description: description || 'Property Transaction',
      metadata: {
        userId: req.user.id,
        ...metadata
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
};

// Confirm payment
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    // Validate input
    if (!paymentIntentId || !paymentMethodId) {
      return res.status(400).json({ error: 'Payment intent ID and payment method ID are required' });
    }

    // Confirm payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId
    });

    if (paymentIntent.status === 'succeeded') {
      // In a real implementation, this would save the transaction to a database
      // and update property status, agent commissions, etc.
      // For now, we'll just return a success message

      res.json({
        message: 'Payment confirmed successfully',
        paymentIntent
      });
    } else {
      res.status(400).json({ error: 'Payment confirmation failed' });
    }
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Failed to confirm payment' });
  }
};

// Get user's transactions
exports.getTransactions = async (req, res) => {
  try {
    // In a real implementation, this would fetch transactions from a database
    // For now, we'll return mock data

    const transactions = [
      {
        id: 'txn_1',
        amount: 150000,
        currency: 'GHS',
        status: 'succeeded',
        description: 'Property deposit payment',
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'txn_2',
        amount: 750000,
        currency: 'GHS',
        status: 'succeeded',
        description: 'Property purchase payment',
        createdAt: new Date('2024-01-20')
      }
    ];

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get a single transaction
exports.getTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    // In a real implementation, this would fetch transaction from a database
    // For now, we'll return mock data

    const transaction = {
      id: id,
      amount: 150000,
      currency: 'GHS',
      status: 'succeeded',
      description: 'Property deposit payment',
      paymentMethod: {
        type: 'card',
        card: {
          brand: 'visa',
          last4: '4242'
        }
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    };

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Create refund
exports.createRefund = async (req, res) => {
  try {
    const { paymentIntentId, amount, reason } = req.body;

    // Validate input
    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' });
    }

    // Create refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Convert to smallest currency unit
      reason: reason || 'requested_by_customer'
    });

    res.json({
      message: 'Refund processed successfully',
      refund
    });
  } catch (error) {
    console.error('Error creating refund:', error);
    res.status(500).json({ error: 'Failed to process refund' });
  }
};

// Handle webhook events
exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      // Then define and call a function to handle the event payment_intent.succeeded
      console.log('Payment succeeded:', paymentIntentSucceeded.id);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      // Then define and call a function to handle the event payment_intent.payment_failed
      console.log('Payment failed:', paymentIntentFailed.id);
      break;
    case 'charge.refunded':
      const chargeRefunded = event.data.object;
      // Then define and call a function to handle the event charge.refunded
      console.log('Charge refunded:', chargeRefunded.id);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.json({ received: true });
};