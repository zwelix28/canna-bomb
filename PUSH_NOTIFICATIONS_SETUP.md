# 📱 Push Notifications Setup Guide

## Required Environment Variables

### Backend (.env in server folder)
```bash
MONGODB_URI=mongodb://localhost:27017/canna-bomb
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5001

# Push Notification VAPID Keys
VAPID_PUBLIC_KEY=BBtKhYNjqMNtOgkYYRpqI30-3_tcKpZdCP3TaWV59XzNVkQV48kx9-p1_k0cq043ihgO1DZ3mN-KVGg0FGpwQvw
VAPID_PRIVATE_KEY=BnH9GyLMg4IwhLhZBeeAk9PF-pvozjFaRKbaNEtPRtw
```

### Frontend (.env in client folder)
```bash
# Push Notification VAPID Public Key
REACT_APP_VAPID_PUBLIC_KEY=BBtKhYNjqMNtOgkYYRpqI30-3_tcKpZdCP3TaWV59XzNVkQV48kx9-p1_k0cq043ihgO1DZ3mN-KVGg0FGpwQvw
```

## Setup Instructions

1. **Create Environment Files:**
   ```bash
   # Create backend .env file
   touch server/.env
   
   # Create frontend .env file  
   touch client/.env
   ```

2. **Add the environment variables above to the respective .env files**

3. **Install Dependencies:**
   ```bash
   cd server && npm install web-push
   ```

4. **Test Notification Service:**
   - Run the application
   - Open the PWA on mobile
   - Allow notifications when prompted
   - Place a test order to receive notifications

## Features Implemented

### ✅ Service Worker Enhanced
- **Push notification handling** with custom data parsing
- **Notification click handling** that redirects to orders page
- **Order-specific notification actions** (View Order, Close)

### ✅ Backend API Endpoints
- `POST /api/notifications/subscribe` - Subscribe to push notifications
- `POST /api/notifications/unsubscribe` - Unsubscribe from notifications
- `POST /api/notifications/test` - Send test notification (development)

### ✅ Notification Triggers
- **Order Placed**: When user creates a new order
- **Order Processing**: When admin changes status to processing
- **Order Ready**: When admin marks order ready for pickup
- **Order Completed**: When order is marked as completed

### ✅ React Components
- **NotificationService**: Utility class for managing push notifications
- **NotificationPermission**: React component for requesting permission
- **Integration**: Added to main App.js for automatic setup

### ✅ User Experience
- **Permission banner** appears for new users
- **Smart prompting** (only shows once, respects user choice)
- **Mobile-optimized** notification permission UI
- **Automatic subscription** management

## Notification Flow

1. **User visits PWA** → Permission banner appears
2. **User allows notifications** → Service worker subscribes to push
3. **User places order** → Receives "Order Placed" notification
4. **Admin updates status** → User receives status update notification
5. **User clicks notification** → Opens orders page with order details

## Testing

### Test Notification (Development)
```bash
# Send test notification to authenticated user
curl -X POST http://localhost:5001/api/notifications/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Order Status Updates
1. Place an order through the PWA
2. Login as admin and change order status
3. Check mobile device for push notifications

## Security Notes

⚠️ **IMPORTANT:**
- Keep `VAPID_PRIVATE_KEY` secret and secure
- The `VAPID_PUBLIC_KEY` can be shared with clients
- Add `.env` files to your `.gitignore`
- Use environment variables in production deployments

## Browser Support

- ✅ Chrome/Edge (desktop & mobile)
- ✅ Firefox (desktop & mobile)  
- ✅ Safari (iOS 16.4+, macOS 13+)
- ❌ Internet Explorer (not supported)

## Troubleshooting

### Notifications not working?
1. Check browser permissions in Settings
2. Verify VAPID keys are correctly set
3. Ensure service worker is registered
4. Check console for error messages
5. Test on HTTPS (required for PWA features)
