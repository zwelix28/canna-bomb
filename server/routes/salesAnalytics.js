const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');

// Get comprehensive sales analytics with time filtering
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('=== FETCHING SALES ANALYTICS ===');
    
    const { period = '7d' } = req.query;
    console.log('Period:', period);
    
    // Calculate date range based on period
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }
    
    console.log('Date range:', startDate.toISOString(), 'to', now.toISOString());
    
    // Get orders in the specified period
    const currentPeriodOrders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    }).sort({ createdAt: 1 });
    
    // Get previous period orders for comparison
    const previousPeriodStart = new Date(startDate);
    const previousPeriodEnd = new Date(startDate);
    
    switch (period) {
      case '7d':
        previousPeriodStart.setDate(startDate.getDate() - 7);
        break;
      case '1m':
        previousPeriodStart.setMonth(startDate.getMonth() - 1);
        break;
      case '3m':
        previousPeriodStart.setMonth(startDate.getMonth() - 3);
        break;
      case '6m':
        previousPeriodStart.setMonth(startDate.getMonth() - 6);
        break;
    }
    
    const previousPeriodOrders = await Order.find({
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });
    
    console.log(`Current period orders: ${currentPeriodOrders.length}`);
    console.log(`Previous period orders: ${previousPeriodOrders.length}`);
    
    // Calculate current period metrics
    const currentRevenue = currentPeriodOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const currentCompletedOrders = currentPeriodOrders.filter(o => o.status === 'completed').length;
    const currentTotalOrders = currentPeriodOrders.length;
    
    // Calculate previous period metrics
    const previousRevenue = previousPeriodOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const previousCompletedOrders = previousPeriodOrders.filter(o => o.status === 'completed').length;
    const previousTotalOrders = previousPeriodOrders.length;
    
    // Calculate growth rates
    const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;
    const orderGrowth = previousTotalOrders > 0 ? ((currentTotalOrders - previousTotalOrders) / previousTotalOrders) * 100 : 0;
    
    // Calculate conversion rate (completed orders / total orders)
    const conversionRate = currentTotalOrders > 0 ? (currentCompletedOrders / currentTotalOrders) * 100 : 0;
    
    // Calculate average order value
    const averageOrderValue = currentTotalOrders > 0 ? currentRevenue / currentTotalOrders : 0;
    
    // Get all users for customer analytics
    const allUsers = await User.find({ role: 'user' });
    const totalCustomers = allUsers.length;
    
    // Calculate customer lifetime value (total revenue / total customers)
    const allOrders = await Order.find({});
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const customerLifetimeValue = totalCustomers > 0 ? totalRevenue / totalCustomers : 0;
    
    // Calculate churn rate (simplified - users who haven't ordered in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeCustomers = await User.find({
      role: 'user',
      $or: [
        { lastOrderDate: { $gte: thirtyDaysAgo } },
        { createdAt: { $gte: thirtyDaysAgo } }
      ]
    });
    
    const churnRate = totalCustomers > 0 ? ((totalCustomers - activeCustomers.length) / totalCustomers) * 100 : 0;
    
    // Calculate retention rate (inverse of churn)
    const retentionRate = 100 - churnRate;
    
    // Generate revenue trend data (daily breakdown)
    const revenueTrend = [];
    const daysDiff = Math.ceil((now - startDate) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i < Math.min(daysDiff, 30); i++) {
      const dayStart = new Date(startDate);
      dayStart.setDate(startDate.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);
      
      const dayOrders = currentPeriodOrders.filter(order => 
        order.createdAt >= dayStart && order.createdAt < dayEnd
      );
      
      const dayRevenue = dayOrders.reduce((sum, order) => sum + (order.total || 0), 0);
      
      revenueTrend.push({
        period: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: dayRevenue
      });
    }
    
    // Order status distribution
    const orderStatusDistribution = [
      { status: 'Completed', count: currentPeriodOrders.filter(o => o.status === 'completed').length, color: '#10b981', colorSecondary: '#34d399' },
      { status: 'Pending', count: currentPeriodOrders.filter(o => o.status === 'pending').length, color: '#f59e0b', colorSecondary: '#fbbf24' },
      { status: 'Processing', count: currentPeriodOrders.filter(o => o.status === 'processing').length, color: '#3b82f6', colorSecondary: '#60a5fa' },
      { status: 'Ready', count: currentPeriodOrders.filter(o => o.status === 'ready').length, color: '#8b5cf6', colorSecondary: '#a78bfa' },
      { status: 'Cancelled', count: currentPeriodOrders.filter(o => o.status === 'cancelled').length, color: '#ef4444', colorSecondary: '#f87171' }
    ];
    
    // Top performing products
    const productSales = {};
    currentPeriodOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.product && item.quantity) {
            const productId = item.product.toString();
            if (!productSales[productId]) {
              productSales[productId] = {
                productId,
                name: item.name || 'Unknown Product',
                totalSold: 0,
                revenue: 0
              };
            }
            productSales[productId].totalSold += item.quantity;
            productSales[productId].revenue += (item.price || 0) * item.quantity;
          }
        });
      }
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
    
    // Customer acquisition data (new customers per period)
    const customerAcquisition = [];
    const acquisitionPeriods = period === '7d' ? 7 : period === '1m' ? 4 : period === '3m' ? 12 : 24;
    
    for (let i = 0; i < acquisitionPeriods; i++) {
      const periodStart = new Date(startDate);
      if (period === '7d') {
        periodStart.setDate(startDate.getDate() + i);
      } else {
        periodStart.setDate(startDate.getDate() + (i * (period === '1m' ? 7 : period === '3m' ? 7 : 7)));
      }
      const periodEnd = new Date(periodStart);
      periodEnd.setDate(periodStart.getDate() + (period === '7d' ? 1 : 7));
      
      const newCustomers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: periodStart, $lt: periodEnd }
      });
      
      customerAcquisition.push({
        period: periodStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        newCustomers
      });
    }
    
    const salesAnalytics = {
      // Core metrics
      totalRevenue: currentRevenue,
      completedOrders: currentCompletedOrders,
      totalOrders: currentTotalOrders,
      averageOrderValue,
      
      // Growth metrics
      revenueGrowth,
      orderGrowth,
      
      // Business metrics
      conversionRate,
      customerLifetimeValue,
      churnRate,
      retentionRate,
      
      // Chart data
      revenueTrend,
      orderStatusDistribution,
      topProducts,
      customerAcquisition,
      
      // Period info
      period,
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString()
    };
    
    console.log('Sales analytics calculated successfully');
    console.log('Total revenue:', currentRevenue);
    console.log('Completed orders:', currentCompletedOrders);
    console.log('Conversion rate:', conversionRate.toFixed(2) + '%');
    console.log('Customer lifetime value:', customerLifetimeValue.toFixed(2));
    console.log('Churn rate:', churnRate.toFixed(2) + '%');
    console.log('Retention rate:', retentionRate.toFixed(2) + '%');
    
    res.json(salesAnalytics);
    
  } catch (error) {
    console.error('Sales analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sales analytics',
      error: error.message 
    });
  }
});

// Get sales performance by product category
router.get('/by-category', adminAuth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    });
    
    const categorySales = {};
    
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const category = item.category || 'Uncategorized';
          if (!categorySales[category]) {
            categorySales[category] = {
              category,
              revenue: 0,
              orders: 0,
              unitsSold: 0
            };
          }
          categorySales[category].revenue += (item.price || 0) * (item.quantity || 0);
          categorySales[category].unitsSold += item.quantity || 0;
        });
      }
    });
    
    // Count unique orders per category
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        const categoriesInOrder = new Set();
        order.items.forEach(item => {
          categoriesInOrder.add(item.category || 'Uncategorized');
        });
        categoriesInOrder.forEach(category => {
          if (categorySales[category]) {
            categorySales[category].orders++;
          }
        });
      }
    });
    
    const categoryPerformance = Object.values(categorySales)
      .sort((a, b) => b.revenue - a.revenue);
    
    res.json(categoryPerformance);
    
  } catch (error) {
    console.error('Category sales analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch category sales analytics',
      error: error.message 
    });
  }
});

// Get customer segmentation analytics
router.get('/customer-segments', adminAuth, async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3m':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '6m':
        startDate.setMonth(now.getMonth() - 6);
        break;
    }
    
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: now }
    });
    
    // Customer segmentation based on order value
    const customerSegments = {
      highValue: { count: 0, revenue: 0, threshold: 500 },
      mediumValue: { count: 0, revenue: 0, threshold: 200 },
      lowValue: { count: 0, revenue: 0, threshold: 0 }
    };
    
    const customerTotals = {};
    
    orders.forEach(order => {
      const customerId = order.user?.toString();
      if (customerId) {
        if (!customerTotals[customerId]) {
          customerTotals[customerId] = { totalSpent: 0, orderCount: 0 };
        }
        customerTotals[customerId].totalSpent += order.total || 0;
        customerTotals[customerId].orderCount++;
      }
    });
    
    Object.values(customerTotals).forEach(customer => {
      if (customer.totalSpent >= customerSegments.highValue.threshold) {
        customerSegments.highValue.count++;
        customerSegments.highValue.revenue += customer.totalSpent;
      } else if (customer.totalSpent >= customerSegments.mediumValue.threshold) {
        customerSegments.mediumValue.count++;
        customerSegments.mediumValue.revenue += customer.totalSpent;
      } else {
        customerSegments.lowValue.count++;
        customerSegments.lowValue.revenue += customer.totalSpent;
      }
    });
    
    res.json(customerSegments);
    
  } catch (error) {
    console.error('Customer segmentation analytics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch customer segmentation analytics',
      error: error.message 
    });
  }
});

module.exports = router;
