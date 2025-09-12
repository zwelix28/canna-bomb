const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_your_stripe_key');
const Order = require('../models/Order');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Order already paid' });
    }
    
    // Create payment intent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    // Update order with payment intent ID
    order.paymentIntentId = paymentIntent.id;
    await order.save();
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Confirm payment
router.post('/confirm', auth, async (req, res) => {
  try {
    const { orderId, paymentIntentId } = req.body;
    
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Verify payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status === 'succeeded') {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
      
      res.json({ 
        message: 'Payment confirmed successfully',
        order 
      });
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payment status
router.get('/status/:orderId', auth, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    });
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json({
      paymentStatus: order.paymentStatus,
      status: order.status,
      paymentIntentId: order.paymentIntentId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Webhook for Stripe events (for production)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update order status
    const order = await Order.findOne({ paymentIntentId: paymentIntent.id });
    if (order) {
      order.paymentStatus = 'paid';
      order.status = 'confirmed';
      await order.save();
    }
  }
  
  res.json({ received: true });
});

module.exports = router;
