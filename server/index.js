const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables BEFORE importing routes/services that depend on them
dotenv.config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const paymentRoutes = require('./routes/payments');
const statisticsRoutes = require('./routes/statistics');
const userRoutes = require('./routes/users');
const aiAnalyticsRoutes = require('./routes/aiAnalytics');
const salesAnalyticsRoutes = require('./routes/salesAnalytics');
const { router: notificationsRoutes } = require('./routes/notifications');
const testEmailRoutes = require('./routes/testEmail');
const testEmailMockRoutes = require('./routes/testEmailMock');
const emailService = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/canna-bomb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/ai-analytics', aiAnalyticsRoutes);
app.use('/api/sales-analytics', salesAnalyticsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/test', testEmailRoutes);
app.use('/api/test-mock', testEmailMockRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Canna Bomb API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Email service: ${emailService.transporter ? 'INITIALIZED' : 'DISABLED'}`);
});
