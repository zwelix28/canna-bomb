const express = require('express');
const webpush = require('web-push');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Function to check and configure VAPID keys
function configureVAPID() {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  
  console.log('VAPID Public Key exists:', !!vapidPublicKey);
  console.log('VAPID Private Key exists:', !!vapidPrivateKey);
  
  if (vapidPublicKey && vapidPrivateKey) {
    webpush.setVapidDetails(
      'mailto:admin@cannabomb.com',
      vapidPublicKey,
      vapidPrivateKey
    );
    console.log('Push notifications configured with VAPID keys');
    return true;
  } else {
    console.log('Push notifications disabled - VAPID keys not configured');
    console.log('Public Key:', vapidPublicKey ? 'Present' : 'Missing');
    console.log('Private Key:', vapidPrivateKey ? 'Present' : 'Missing');
    return false;
  }
}

// Initialize VAPID configuration
configureVAPID();

// Public endpoint to expose VAPID public key to clients
router.get('/public-key', (req, res) => {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  if (!vapidPublicKey) {
    return res.status(503).json({ error: 'VAPID public key not configured' });
  }
  res.json({ publicKey: vapidPublicKey });
});

// Subscribe to push notifications
router.post('/subscribe', auth, async (req, res) => {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (!vapidPublicKey || !vapidPrivateKey) {
    return res.status(503).json({ 
      error: 'Push notifications not configured - VAPID keys missing' 
    });
  }
  
  try {
    const { endpoint, keys } = req.body;
    const userId = req.user.id;

    // Save subscription to user's profile
    await User.findByIdAndUpdate(userId, {
      $set: {
        'preferences.pushSubscription': {
          endpoint,
          keys,
          subscriptionDate: new Date()
        }
      }
    });

    res.json({ 
      success: true, 
      message: 'Successfully subscribed to push notifications' 
    });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe to notifications' 
    });
  }
});

// Unsubscribe from push notifications
router.post('/unsubscribe', auth, async (req, res) => {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (!vapidPublicKey || !vapidPrivateKey) {
    return res.status(503).json({ 
      error: 'Push notifications not configured - VAPID keys missing' 
    });
  }
  
  try {
    const userId = req.user.id;

    // Remove subscription from user's profile
    await User.findByIdAndUpdate(userId, {
      $unset: {
        'preferences.pushSubscription': ""
      }
    });

    res.json({ 
      success: true, 
      message: 'Successfully unsubscribed from push notifications' 
    });
  } catch (error) {
    console.error('Unsubscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe from notifications' 
    });
  }
});

// Send push notification to specific user
async function sendNotificationToUser(userId, notificationData) {
  try {
    const user = await User.findById(userId);
    
    if (!user || !user.preferences?.pushSubscription) {
      console.log(`No push subscription found for user ${userId}`);
      return false;
    }

    const subscription = user.preferences.pushSubscription;
    const payload = JSON.stringify(notificationData);

    await webpush.sendNotification(subscription, payload);
    console.log(`Notification sent to user ${userId}`);
    return true;
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
    
    // If subscription is invalid, remove it
    if (error.statusCode === 410) {
      await User.findByIdAndUpdate(userId, {
        $unset: {
          'preferences.pushSubscription': ""
        }
      });
      console.log(`Removed invalid subscription for user ${userId}`);
    }
    
    return false;
  }
}

// Send order status notification
async function sendOrderNotification(userId, orderData) {
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
  
  if (!vapidPublicKey || !vapidPrivateKey) {
    console.log('Push notifications disabled - skipping order notification');
    return;
  }
  
  const statusMessages = {
    pending: {
      title: 'Order Placed! 🛍️',
      body: `Your order #${orderData.orderNumber} has been placed successfully. We'll notify you when it's ready for pickup.`,
      icon: '/icons/icon-192x192.png'
    },
    processing: {
      title: 'Order Processing 🔄',
      body: `Your order #${orderData.orderNumber} is being prepared. We'll let you know when it's ready!`,
      icon: '/icons/icon-192x192.png'
    },
    ready: {
      title: 'Order Ready for Pickup! ✅',
      body: `Your order #${orderData.orderNumber} is ready for collection. Please come by to pick it up.`,
      icon: '/icons/icon-192x192.png'
    },
    completed: {
      title: 'Order Completed 🎉',
      body: `Thank you! Your order #${orderData.orderNumber} has been completed. We hope you enjoy your products!`,
      icon: '/icons/icon-192x192.png'
    }
  };

  const message = statusMessages[orderData.status];
  if (!message) {
    console.log(`No notification message defined for status: ${orderData.status}`);
    return false;
  }

  const notificationData = {
    ...message,
    data: {
      orderId: orderData._id,
      orderNumber: orderData.orderNumber,
      status: orderData.status,
      total: orderData.total
    },
    url: `/orders/${orderData._id}`,
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    actions: [
      {
        action: 'view-order',
        title: 'View Order',
        icon: '/icons/action-view.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/action-close.png'
      }
    ]
  };

  return await sendNotificationToUser(userId, notificationData);
}

// Test notification endpoint (for development)
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const testNotification = {
      title: 'Test Notification 🧪',
      body: 'This is a test notification from Canna Bomb PWA!',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      data: {
        test: true
      },
      url: '/orders'
    };

    const success = await sendNotificationToUser(userId, testNotification);
    
    if (success) {
      res.json({ 
        success: true, 
        message: 'Test notification sent successfully' 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        message: 'Failed to send test notification' 
      });
    }
  } catch (error) {
    console.error('Test notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send test notification' 
    });
  }
});

module.exports = {
  router,
  sendOrderNotification,
  sendNotificationToUser
};
