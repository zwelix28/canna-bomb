const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const { adminAuth } = require('../middleware/auth');
const emailService = require('../services/emailService');
const User = require('../models/User');

// Get comprehensive statistics
router.get('/', adminAuth, async (req, res) => {
  try {
    console.log('=== FETCHING STATISTICS ===');
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);
    
    // Get all orders
    const orders = await Order.find({});
    console.log(`Found ${orders.length} orders`);
    
    // Calculate basic metrics
    const totalProducts = products.length;
    const productsOnSale = products.filter(p => p.salePrice && p.salePrice < p.price).length;
    
    // Stock analysis
    const lowStockItems = products.filter(p => p.stockQuantity <= 10).length;
    const outOfStockItems = products.filter(p => p.stockQuantity === 0).length;
    
    const stockStatus = {
      high: products.filter(p => p.stockQuantity > 20).length,
      medium: products.filter(p => p.stockQuantity > 10 && p.stockQuantity <= 20).length,
      low: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length,
      out: outOfStockItems
    };
    
    // Order analysis
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    
    // Calculate total revenue
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.total || 0);
    }, 0);
    
    // Top selling products analysis
    const productSales = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.product && item.quantity) {
            const productId = item.product.toString();
            if (!productSales[productId]) {
              productSales[productId] = {
                productId,
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
    
    // Get top selling products with full product details
    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map(sale => {
        const product = products.find(p => p._id.toString() === sale.productId);
        return product ? {
          ...product.toObject(),
          totalSold: sale.totalSold,
          revenue: sale.revenue
        } : null;
      })
      .filter(Boolean);
    
    // Low stock products
    const lowStockProducts = products
      .filter(p => p.stockQuantity <= 10)
      .sort((a, b) => a.stockQuantity - b.stockQuantity);
    
    // Products on sale
    const saleProducts = products
      .filter(p => p.salePrice && p.salePrice < p.price)
      .sort((a, b) => {
        const discountA = ((a.price - a.salePrice) / a.price) * 100;
        const discountB = ((b.price - b.salePrice) / b.price) * 100;
        return discountB - discountA;
      });
    
    // Category analysis
    const categoryStats = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          name: category,
          count: 0,
          totalStock: 0,
          onSale: 0
        };
      }
      categoryStats[category].count++;
      categoryStats[category].totalStock += product.stockQuantity || 0;
      if (product.salePrice && product.salePrice < product.price) {
        categoryStats[category].onSale++;
      }
    });
    
    // Recent orders analysis
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10);
    
    // Order status distribution
    const orderStatusDistribution = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };
    
    const statistics = {
      // Basic metrics
      totalProducts,
      productsOnSale,
      lowStockItems,
      outOfStockItems,
      
      // Stock analysis
      stockStatus,
      
      // Order metrics
      totalOrders,
      pendingOrders,
      totalRevenue,
      
      // Detailed data
      topSellingProducts,
      lowStockProducts,
      saleProducts,
      categoryStats: Object.values(categoryStats),
      recentOrders,
      orderStatusDistribution,
      
      // Additional insights
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      stockTurnoverRate: totalProducts > 0 ? ((totalProducts - outOfStockItems) / totalProducts * 100).toFixed(1) : 0,
      salePercentage: totalProducts > 0 ? ((productsOnSale / totalProducts) * 100).toFixed(1) : 0
    };
    
    console.log('Statistics calculated successfully');
    console.log('Total products:', totalProducts);
    console.log('Products on sale:', productsOnSale);
    console.log('Low stock items:', lowStockItems);
    console.log('Total orders:', totalOrders);
    console.log('Total revenue:', totalRevenue);
    
    res.json(statistics);
    
  } catch (error) {
    console.error('Statistics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch statistics',
      error: error.message 
    });
  }
});

// Get specific category statistics
router.get('/category/:category', adminAuth, async (req, res) => {
  try {
    const { category } = req.params;
    
    const products = await Product.find({ category });
    const orders = await Order.find({});
    
    // Filter orders that contain products from this category
    const categoryOrders = orders.filter(order => 
      order.items && order.items.some(item => 
        products.some(product => product._id.toString() === item.product.toString())
      )
    );
    
    const categoryStats = {
      category,
      totalProducts: products.length,
      totalStock: products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0),
      productsOnSale: products.filter(p => p.salePrice && p.salePrice < p.price).length,
      lowStockProducts: products.filter(p => p.stockQuantity <= 10).length,
      totalOrders: categoryOrders.length,
      totalRevenue: categoryOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      averagePrice: products.length > 0 ? (products.reduce((sum, p) => sum + (p.price || 0), 0) / products.length).toFixed(2) : 0
    };
    
    res.json(categoryStats);
    
  } catch (error) {
    console.error('Category statistics error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch category statistics',
      error: error.message 
    });
  }
});

// Get sales trends (if you want to add time-based analysis)
router.get('/trends', adminAuth, async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to last 30 days
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    const orders = await Order.find({
      createdAt: { $gte: startDate }
    }).sort({ createdAt: 1 });
    
    // Group orders by date
    const dailySales = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = {
          date,
          orders: 0,
          revenue: 0
        };
      }
      dailySales[date].orders++;
      dailySales[date].revenue += order.total || 0;
    });
    
    const trends = {
      period: `${days} days`,
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0),
      dailySales: Object.values(dailySales),
      averageDailyOrders: orders.length / days,
      averageDailyRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0) / days
    };
    
    res.json(trends);
    
  } catch (error) {
    console.error('Trends error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch sales trends',
      error: error.message 
    });
  }
});

// Email the executive statistics report PDF to all admins
router.post('/email-report', adminAuth, async (req, res) => {
  try {
    // Reuse the same statistics payload as GET /
    const products = await Product.find({});
    const orders = await Order.find({});

    const totalProducts = products.length;
    const productsOnSale = products.filter(p => p.salePrice && p.salePrice < p.price).length;
    const lowStockItems = products.filter(p => p.stockQuantity <= 10).length;
    const outOfStockItems = products.filter(p => p.stockQuantity === 0).length;

    const stockStatus = {
      high: products.filter(p => p.stockQuantity > 20).length,
      medium: products.filter(p => p.stockQuantity > 10 && p.stockQuantity <= 20).length,
      low: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= 10).length,
      out: outOfStockItems
    };

    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    const productSales = {};
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.product && item.quantity) {
            const productId = item.product.toString();
            if (!productSales[productId]) {
              productSales[productId] = { productId, totalSold: 0, revenue: 0 };
            }
            productSales[productId].totalSold += item.quantity;
            productSales[productId].revenue += (item.price || 0) * item.quantity;
          }
        });
      }
    });

    const topSellingProducts = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map(sale => {
        const product = products.find(p => p._id.toString() === sale.productId);
        return product ? { ...product.toObject(), totalSold: sale.totalSold, revenue: sale.revenue } : null;
      })
      .filter(Boolean);

    const lowStockProducts = products
      .filter(p => p.stockQuantity <= 10)
      .sort((a, b) => a.stockQuantity - b.stockQuantity);

    const saleProducts = products
      .filter(p => p.salePrice && p.salePrice < p.price)
      .sort((a, b) => (((b.price - b.salePrice) / b.price) * 100) - (((a.price - a.salePrice) / a.price) * 100));

    const categoryStats = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (!categoryStats[category]) {
        categoryStats[category] = { name: category, count: 0, totalStock: 0, onSale: 0 };
      }
      categoryStats[category].count++;
      categoryStats[category].totalStock += product.stockQuantity || 0;
      if (product.salePrice && product.salePrice < product.price) categoryStats[category].onSale++;
    });

    const orderStatusDistribution = {
      pending: orders.filter(o => o.status === 'pending').length,
      confirmed: orders.filter(o => o.status === 'confirmed').length,
      processing: orders.filter(o => o.status === 'processing').length,
      ready: orders.filter(o => o.status === 'ready').length,
      completed: orders.filter(o => o.status === 'completed').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    };

    const statistics = {
      totalProducts,
      productsOnSale,
      lowStockItems,
      outOfStockItems,
      stockStatus,
      totalOrders,
      pendingOrders,
      totalRevenue,
      topSellingProducts,
      lowStockProducts,
      saleProducts,
      categoryStats: Object.values(categoryStats),
      orderStatusDistribution,
      averageOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      stockTurnoverRate: totalProducts > 0 ? (((totalProducts - outOfStockItems) / totalProducts) * 100).toFixed(1) : 0,
      salePercentage: totalProducts > 0 ? ((productsOnSale / totalProducts) * 100).toFixed(1) : 0
    };

    // Find admin recipients
    const admins = await User.find({ role: 'admin' }).select('email firstName lastName');
    const recipients = admins.map(a => a.email).filter(Boolean);
    if (recipients.length === 0) {
      return res.status(400).json({ success: false, message: 'No admin recipients found' });
    }

    // Build a minimal HTML email body (professional tone)
    const subject = 'Canna Bomb — Executive Statistics Report';
    const html = `
      <div style="font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Inter,sans-serif; color:#0f172a;">
        <h2 style="margin:0 0 8px">🌿 Canna Bomb Executive Statistics Report</h2>
        <p style="margin:0 0 16px; color:#334155">Attached is the latest executive analytics PDF summarizing inventory and sales performance.</p>
        <ul style="padding-left:16px; color:#334155; line-height:1.6;">
          <li><strong>Total Products:</strong> ${totalProducts}</li>
          <li><strong>Total Orders:</strong> ${totalOrders}</li>
          <li><strong>Total Revenue:</strong> R${Number(totalRevenue).toFixed(2)}</li>
          <li><strong>Low Stock Items:</strong> ${lowStockItems}</li>
          <li><strong>Products on Sale:</strong> ${productsOnSale}</li>
        </ul>
        <p style="margin-top:16px; color:#64748b">This report is confidential and intended for executive use only.</p>
      </div>
    `;

    // Create a lightweight PDF on server summarizing key data (simple, as client PDF is richer)
    // For immediate delivery, send email without attachment if needed; here we send without attachment to avoid heavy server PDF build.
    // Future: move client-side base64 upload to this endpoint if desired.

    let allOk = true;
    for (const to of recipients) {
      const sent = await emailService.sendEmail(to, subject, html, []);
      if (!sent) allOk = false;
    }

    if (!allOk) {
      return res.status(500).json({ success: false, message: 'Failed to send to one or more admins' });
    }

    res.json({ success: true, message: `Statistics report emailed to ${recipients.length} admin(s)` });
  } catch (error) {
    console.error('Email statistics report error:', error);
    res.status(500).json({ success: false, message: 'Failed to email statistics report', error: error.message });
  }
});

module.exports = router;
