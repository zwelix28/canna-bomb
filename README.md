# 🌿 Canna Bomb - E-commerce Application

A modern, user-friendly e-commerce platform for cannabis products with seamless ordering experience.

## ✨ Features

- **User Authentication**: Secure registration and login with age verification (21+)
- **Product Catalog**: Browse cannabis products by category with detailed information
- **Shopping Cart**: Add, update, and manage cart items
- **Secure Checkout**: Integrated payment processing with Stripe
- **Order Management**: Track order status and history
- **Responsive Design**: Modern UI/UX optimized for all devices
- **Admin Panel**: Manage products, orders, and users
- **Inventory Management**: Comprehensive product management for administrators

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Stripe** for payment processing
- **bcryptjs** for password hashing

### Frontend
- **React 18** with h

ooks
- **React Router** for navigation
- **Styled Components** for styling
- **Axios** for API communication
- **React Toastify** for notifications

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Stripe account for payment processing

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd canna-bomb
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   # Copy environment example
   cp server/env.example server/.env
   
   # Edit server/.env with your configuration
   MONGODB_URI=mongodb://localhost:27017/canna-bomb
   JWT_SECRET=your-super-secret-jwt-key
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

4. **Start the application**
   ```bash
   # Development mode (both frontend and backend)
   npm run dev
   
   # Or start separately
   npm run server    # Backend only
   npm run client    # Frontend only
   ```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products with filtering
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/category/:category` - Get products by category
- `POST /api/products` - Create new product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update/:productId` - Update cart item
- `DELETE /api/cart/remove/:productId` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status
- `PUT /api/orders/:id/cancel` - Cancel order

### Checkout
- `POST /api/orders` - Create collection order from checkout
- `GET /api/cart/summary` - Get cart summary for checkout
- **Collection Orders**: Walk-in and pre-order pickup system
- **Tip Integration**: Percentage-based and custom tip amounts
- **Pickup Scheduling**: Date and time selection for collection

### Payments
- `POST /api/payments/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/confirm` - Confirm payment

## 🎨 UI Components

- **Header**: Navigation with cart icon, user menu, and role-based navigation links
- **ProductCard**: Product display with add to cart functionality
- **Cart**: Shopping cart management
- **Checkout**: Payment and shipping information
- **Forms**: Login, registration, and profile forms
- **Inventory Management**: Admin panel for comprehensive product management

## 🔒 Security Features

- Age verification (21+ requirement)
- JWT token authentication
- Password hashing with bcrypt
- Protected routes
- Input validation and sanitization

## 🧭 Navigation & User Experience

### Header Navigation
- **Public Links**: Home, Products (accessible to all users)
- **Admin Links**: Inventory management (visible only to administrators)
- **User Links**: Orders (visible to authenticated users)
- **Smart Navigation**: Links appear/disappear based on user role and authentication status

## 🛒 Checkout & Collection System

### Checkout Features
- **Collection-Based**: Walk-in and pre-order collection system
- **Auto-Population**: User profile details automatically filled for seamless checkout
- **Collection Scheduling**: Pickup date and time selection for the next 7 days
- **Tip System**: Percentage-based or custom tip amounts
- **Order Notes**: Special instructions and preparation preferences
- **Form Validation**: Real-time error checking and user feedback
- **Order Summary**: Live order totals with tax and tip calculations
- **Terms Acceptance**: Required terms and conditions acceptance
- **Marketing Consent**: Optional marketing communications opt-in

### Collection Methods
- **Walk-in Orders**: Immediate pickup for instant gratification
- **Pre-orders**: Scheduled pickup for convenience and preparation time
- **Collection Times**: Available from 9:00 AM to 8:00 PM
- **Pickup Window**: Next 7 days for flexible scheduling

### Form Validation
- **Required Fields**: All essential information validation
- **Email Format**: Proper email address verification
- **Address Completion**: Complete address information required
- **Terms Acceptance**: Mandatory terms and conditions agreement
- **Real-time Feedback**: Immediate error display and correction

## 📦 Order Management & Tracking

### Order Features
- **Order History**: Complete view of all user orders with status tracking
- **Order Details**: Comprehensive order information including items, pricing, and shipping
- **Order Tracking**: Visual timeline showing order progress from placement to delivery
- **Order Actions**: Cancel pending orders, reorder delivered items
- **Shipping Information**: Detailed shipping and billing address display
- **Payment Status**: Real-time payment status tracking and updates

### Order Statuses
- **Pending**: Order received and confirmed
- **Processing**: Order being prepared for shipment
- **Shipped**: Order in transit with tracking
- **Delivered**: Order successfully delivered
- **Cancelled**: Order cancelled by user or system

### Tracking Features
- **Visual Timeline**: Step-by-step order progress visualization
- **Tracking Numbers**: Display shipping tracking information
- **Estimated Delivery**: Show expected delivery dates
- **Status Updates**: Real-time order status changes

## 🏪 Inventory Management (Admin Only)

### Product Management
- **Add New Products**: Complete product creation with all cannabis-specific attributes
- **Edit Products**: Update product information, descriptions, and specifications
- **Stock Control**: Manage inventory levels and stock quantities
- **Sale Management**: Set and update sale prices for promotional campaigns
- **Product Deletion**: Remove products from inventory

### Product Attributes
- **Basic Info**: Name, description, category, brand, price
- **Cannabis Specific**: THC/CBD content, strain, effects, flavors
- **Inventory**: Stock quantity, weight, weight units
- **Media**: Image URLs, tags for categorization
- **Pricing**: Regular price, sale price with automatic discount calculation

### Admin Features
- **Role-based Access**: Only administrators can access inventory management
- **Real-time Updates**: Changes reflect immediately in the product catalog
- **Bulk Operations**: Efficient management of multiple products
- **Search & Filter**: Quick product location and management

## 📱 Responsive Design

- Mobile-first approach
- Grid-based layouts
- Flexible components
- Touch-friendly interactions

## 🚀 Deployment

### Backend
```bash
cd server
npm run build
npm start
```

### Frontend
```bash
cd client
npm run build
# Deploy build folder to your hosting service
```

## 📝 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/canna-bomb
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## ⚠️ Important Notes

- **Age Verification**: Users must be 21+ to register and purchase
- **Legal Compliance**: Ensure compliance with local cannabis laws
- **Payment Processing**: Stripe integration requires proper setup
- **Data Security**: Implement proper security measures for production

## 🆘 Support

For support and questions, please open an issue in the repository.

---

**Disclaimer**: This application is for educational purposes. Ensure compliance with all applicable laws and regulations regarding cannabis sales and e-commerce in your jurisdiction.
