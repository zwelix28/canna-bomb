const express = require('express');
const emailService = require('../services/emailService');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Test email endpoint
router.post('/test-email', auth, async (req, res) => {
  try {
    const { emailType, userEmail } = req.body;
    
    // Mock order data for testing
    const mockOrder = {
      orderNumber: 'CB-TEST-123456',
      createdAt: new Date(),
      total: 150.00,
      subtotal: 120.00,
      tax: 9.60,
      tip: 20.40,
      items: [
        {
          name: 'Test Product',
          quantity: 2,
          price: 60.00,
          total: 120.00,
          category: 'flower'
        }
      ],
      collectionDate: '2025-09-11',
      collectionTime: '2:00 PM',
      estimatedPickup: '2025-09-11 at 2:00 PM',
      customerInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: userEmail || req.user.email,
        phone: '+27 12 345 6789'
      }
    };

    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      email: userEmail || req.user.email
    };

    let result = false;
    let message = '';

    switch (emailType) {
      case 'order-placed':
        result = await emailService.sendOrderPlacedEmail(mockUser, mockOrder);
        message = 'Order placed email sent';
        break;
      case 'order-confirmed':
        result = await emailService.sendOrderStatusEmail(mockUser, mockOrder, 'confirmed');
        message = 'Order confirmed email sent';
        break;
      case 'order-processing':
        result = await emailService.sendOrderStatusEmail(mockUser, mockOrder, 'processing');
        message = 'Order processing email sent';
        break;
      case 'order-ready':
        result = await emailService.sendOrderStatusEmail(mockUser, mockOrder, 'ready');
        message = 'Order ready email sent';
        break;
      case 'order-completed':
        result = await emailService.sendOrderStatusEmail(mockUser, mockOrder, 'completed');
        message = 'Order completed email sent';
        break;
      case 'invoice':
        result = await emailService.sendOrderInvoiceEmail(mockUser, mockOrder);
        message = 'Invoice email sent';
        break;
      case 'admin-new-order':
        result = await emailService.sendAdminNewOrderEmail(req.user.email, mockOrder, mockUser);
        message = 'Admin new order email sent';
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email type. Valid types: order-placed, order-confirmed, order-processing, order-ready, order-completed, invoice, admin-new-order' 
        });
    }

    if (result) {
      res.json({ 
        success: true, 
        message: `${message} successfully to ${userEmail || req.user.email}` 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to send email. Check email configuration.' 
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending test email', 
      error: error.message 
    });
  }
});

module.exports = router;
