const express = require('express');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock email service for testing
const mockEmailService = {
  async sendOrderPlacedEmail(user, order) {
    console.log('📧 MOCK EMAIL: Order Placed');
    console.log(`   To: ${user.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Total: R${order.total}`);
    return true;
  },

  async sendOrderStatusEmail(user, order, status) {
    console.log(`📧 MOCK EMAIL: Order ${status.toUpperCase()}`);
    console.log(`   To: ${user.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Status: ${status}`);
    return true;
  },

  async sendOrderInvoiceEmail(user, order) {
    console.log('📧 MOCK EMAIL: Invoice');
    console.log(`   To: ${user.email}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Total: R${order.total}`);
    return true;
  },

  async sendAdminNewOrderEmail(adminEmail, order, user) {
    console.log('📧 MOCK EMAIL: Admin New Order Alert');
    console.log(`   To: ${adminEmail}`);
    console.log(`   Order: ${order.orderNumber}`);
    console.log(`   Customer: ${user.firstName} ${user.lastName}`);
    return true;
  }
};

// Test email endpoint with mock service
router.post('/test-mock-email', auth, async (req, res) => {
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
        result = await mockEmailService.sendOrderPlacedEmail(mockUser, mockOrder);
        message = 'Order placed email sent';
        break;
      case 'order-confirmed':
        result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'confirmed');
        message = 'Order confirmed email sent';
        break;
      case 'order-processing':
        result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'processing');
        message = 'Order processing email sent';
        break;
      case 'order-ready':
        result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'ready');
        message = 'Order ready email sent';
        break;
      case 'order-completed':
        result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'completed');
        message = 'Order completed email sent';
        break;
      case 'invoice':
        result = await mockEmailService.sendOrderInvoiceEmail(mockUser, mockOrder);
        message = 'Invoice email sent';
        break;
      case 'admin-new-order':
        result = await mockEmailService.sendAdminNewOrderEmail(req.user.email, mockOrder, mockUser);
        message = 'Admin new order email sent';
        break;
      default:
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid email type. Valid types: order-placed, order-confirmed, order-processing, order-ready, order-completed, invoice, admin-new-order' 
        });
    }

    res.json({ 
      success: true, 
      message: `${message} successfully to ${userEmail || req.user.email}`,
      emailType,
      orderNumber: mockOrder.orderNumber
    });
  } catch (error) {
    console.error('Mock email test error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending mock email', 
      error: error.message 
    });
  }
});

// Test all email types at once
router.post('/test-all-emails', auth, async (req, res) => {
  try {
    const { userEmail } = req.body;
    const testEmail = userEmail || req.user.email;
    
    const mockOrder = {
      orderNumber: 'CB-TEST-ALL-123456',
      createdAt: new Date(),
      total: 250.00,
      subtotal: 200.00,
      tax: 16.00,
      tip: 34.00,
      items: [
        {
          name: 'Test Product 1',
          quantity: 1,
          price: 100.00,
          total: 100.00,
          category: 'flower'
        },
        {
          name: 'Test Product 2',
          quantity: 1,
          price: 100.00,
          total: 100.00,
          category: 'edibles'
        }
      ],
      collectionDate: '2025-09-11',
      collectionTime: '3:00 PM',
      estimatedPickup: '2025-09-11 at 3:00 PM',
      customerInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        phone: '+27 12 345 6789'
      }
    };

    const mockUser = {
      firstName: 'Test',
      lastName: 'User',
      email: testEmail
    };

    const emailTypes = [
      'order-placed',
      'order-confirmed', 
      'order-processing',
      'order-ready',
      'order-completed',
      'invoice',
      'admin-new-order'
    ];

    const results = [];
    
    for (const emailType of emailTypes) {
      try {
        let result = false;
        switch (emailType) {
          case 'order-placed':
            result = await mockEmailService.sendOrderPlacedEmail(mockUser, mockOrder);
            break;
          case 'order-confirmed':
            result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'confirmed');
            break;
          case 'order-processing':
            result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'processing');
            break;
          case 'order-ready':
            result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'ready');
            break;
          case 'order-completed':
            result = await mockEmailService.sendOrderStatusEmail(mockUser, mockOrder, 'completed');
            break;
          case 'invoice':
            result = await mockEmailService.sendOrderInvoiceEmail(mockUser, mockOrder);
            break;
          case 'admin-new-order':
            result = await mockEmailService.sendAdminNewOrderEmail(req.user.email, mockOrder, mockUser);
            break;
        }
        
        results.push({
          emailType,
          success: result,
          message: result ? 'Sent successfully' : 'Failed to send'
        });
      } catch (error) {
        results.push({
          emailType,
          success: false,
          message: `Error: ${error.message}`
        });
      }
    }

    res.json({
      success: true,
      message: `Tested ${results.length} email types`,
      results,
      testEmail
    });
  } catch (error) {
    console.error('All emails test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing all emails',
      error: error.message
    });
  }
});

module.exports = router;
