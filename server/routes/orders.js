const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');
const { sendOrderNotification } = require('./notifications');
const emailService = require('../services/emailService');

const router = express.Router();

// Create new order from cart
router.post('/', auth, async (req, res) => {
  try {
    console.log('=== ORDER CREATION START ===');
    console.log('User ID:', req.user._id);
    console.log('Request body:', req.body);
    
    const { 
      items, 
      subtotal, 
      tax, 
      tip, 
      total, 
      paymentStatus, 
      paymentMethod, 
      collectionMethod,
      collectionDate,
      collectionTime,
      preferredName,
      customerInfo,
      orderNotes,
      estimatedPickup,
      shippingAddress, 
      billingAddress, 
      notes 
    } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    console.log('Cart found:', !!cart);
    console.log('Cart items count:', cart?.items?.length || 0);
    
    if (!cart || cart.items.length === 0) {
      console.log('Cart is empty or not found');
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    // Validate stock and calculate totals
    let calculatedSubtotal = 0;
    const orderItems = [];
    
    for (const item of cart.items) {
      const product = item.product;
      console.log('Processing item:', item.product.name, 'Quantity:', item.quantity, 'Stock:', product.stockQuantity);
      
      if (product.stockQuantity < item.quantity) {
        console.log('Insufficient stock for:', product.name);
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }
      
      const itemTotal = (item.product.salePrice || item.product.price) * item.quantity;
      calculatedSubtotal += itemTotal;
      
      orderItems.push({
        product: product._id,
        name: product.name,
        price: item.product.salePrice || item.product.price,
        quantity: item.quantity,
        total: itemTotal,
        category: product.category,
        image: product.images && product.images.length > 0 ? product.images[0] : ''
      });
      
      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockQuantity: -item.quantity }
      });
    }
    
    console.log('Order items prepared:', orderItems.length);
    console.log('Calculated subtotal:', calculatedSubtotal);
    
    // Use provided values or calculate defaults
    const finalSubtotal = subtotal || calculatedSubtotal;
    const finalTax = tax || (finalSubtotal * 0.08); // 8% tax
    const finalTip = tip || 0;
    const finalTotal = total || (finalSubtotal + finalTax + finalTip);
    
    console.log('Final values - Subtotal:', finalSubtotal, 'Tax:', finalTax, 'Tip:', finalTip, 'Total:', finalTotal);
    
    // Create order
    const orderData = {
      user: req.user._id,
      items: orderItems,
      subtotal: finalSubtotal,
      tax: finalTax,
      tip: finalTip,
      total: finalTotal,
      paymentStatus: paymentStatus || 'pending',
      paymentMethod: paymentMethod || 'collection',
      
      // Collection Information
      collectionMethod: collectionMethod || 'walk-in',
      collectionDate: collectionDate,
      collectionTime: collectionTime,
      preferredName: preferredName,
      estimatedPickup: estimatedPickup,
      
      // Customer Information
      customerInfo: customerInfo || {
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
        phone: req.user.phone
      },
      
      // Notes
      notes: notes,
      orderNotes: orderNotes,
      
      // Legacy fields for backward compatibility
      shippingAddress: shippingAddress,
      billingAddress: billingAddress
    };
    
    console.log('Order data prepared:', orderData);
    
    const order = new Order(orderData);
    console.log('Order instance created');
    
    await order.save();
    console.log('Order saved successfully. Order ID:', order._id);
    console.log('Order Number:', order.orderNumber);
    
    // Send order placed notification
    try {
      await sendOrderNotification(req.user._id, order);
      console.log('Order placed notification sent');
    } catch (error) {
      console.error('Failed to send order notification:', error);
    }

    // Send order placed email to user
    try {
      await emailService.sendOrderPlacedEmail(req.user, order);
      console.log('Order placed email sent to user');
    } catch (error) {
      console.error('Failed to send order placed email:', error);
    }

    // Send new order email to admin
    try {
      const adminUsers = await User.find({ role: 'admin' });
      for (const admin of adminUsers) {
        await emailService.sendAdminNewOrderEmail(admin.email, order, req.user);
        console.log(`New order email sent to admin: ${admin.email}`);
      }
    } catch (error) {
      console.error('Failed to send admin new order email:', error);
    }
    
    // Clear cart
    cart.items = [];
    await cart.save();
    console.log('Cart cleared');
    
    console.log('=== ORDER CREATION SUCCESS ===');
    res.status(201).json(order);
  } catch (error) {
    console.error('=== ORDER CREATION ERROR ===');
    console.error('Order creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user's orders
router.get('/', auth, async (req, res) => {
  try {
    console.log('=== FETCHING ORDERS ===');
    console.log('User ID:', req.user._id);
    
    const { page = 1, limit = 10, status } = req.query;
    
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Order.countDocuments(filter);
    
    console.log('Orders found:', orders.length);
    console.log('Total orders:', total);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (admin only) - must come before /:id route
router.get('/admin', adminAuth, async (req, res) => {
  try {
    console.log('=== FETCHING ADMIN ORDERS ===');
    console.log('Admin user:', req.user.email);
    
    const orders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });
    
    console.log('Total orders found:', orders.length);
    
    res.json({ orders });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    console.log('=== FETCHING ORDER DETAIL ===');
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    console.log('Order ID:', req.params.id);
    
    // Build query - admins can view any order, regular users can only view their own
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    
    const order = await Order.findOne(query).populate('items.product');
    
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }
    
    console.log('Order found:', order.orderNumber);
    res.json(order);
  } catch (error) {
    console.error('Error fetching order detail:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status (admin only)
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    console.log('=== UPDATING ORDER STATUS ===');
    console.log('Order ID:', req.params.id);
    console.log('New status:', req.body.status);
    console.log('Admin user:', req.user.email);
    
    const { status } = req.body;
    const orderId = req.params.id;
    
    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const oldStatus = order.status;
    order.status = status;
    await order.save();
    
    console.log(`Order ${order.orderNumber} status updated from ${oldStatus} to ${status}`);
    
    // Send status update notification
    try {
      await sendOrderNotification(order.user, order);
      console.log(`Status update notification sent for order ${order.orderNumber}`);
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }

    // Send status update email to user
    try {
      const user = await User.findById(order.user);
      if (user) {
        await emailService.sendOrderStatusEmail(user, order, status);
        console.log(`Status update email sent to user for order ${order.orderNumber}`);
        
        // Send invoice email when order is completed
        if (status === 'completed') {
          await emailService.sendOrderInvoiceEmail(user, order);
          console.log(`Invoice email sent to user for completed order ${order.orderNumber}`);
        }
      }
    } catch (error) {
      console.error('Failed to send status update email:', error);
    }
    
    // Populate user info for response
    await order.populate('user', 'firstName lastName email');
    
    res.json({ 
      message: 'Order status updated successfully',
      order 
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel order
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    console.log('=== CANCELLING ORDER ===');
    console.log('User ID:', req.user._id);
    console.log('User role:', req.user.role);
    console.log('Order ID:', req.params.id);
    
    // Build query - admins can cancel any order, regular users can only cancel their own
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      query.user = req.user._id;
    }
    
    const order = await Order.findOne(query);
    
    if (!order) {
      console.log('Order not found');
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
    }
    
    order.status = 'cancelled';
    await order.save();
    
    console.log(`Order ${order.orderNumber} cancelled by ${req.user.role}`);
    
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stockQuantity: item.quantity }
      });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
