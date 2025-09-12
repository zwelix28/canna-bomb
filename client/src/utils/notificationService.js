// Push Notification Service for Mobile PWA
class NotificationService {
  constructor() {
    this.subscription = null;
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Check if notifications are supported
  isNotificationSupported() {
    return this.isSupported;
  }

  // Request notification permission
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Subscribe to push notifications
  async subscribe() {
    if (!this.isSupported) {
      throw new Error('Push notifications are not supported');
    }

    try {
      const registration = await navigator.serviceWorker.ready;

      // Get VAPID public key from server if not provided via env
      let vapidKey = process.env.REACT_APP_VAPID_PUBLIC_KEY || '';
      if (!vapidKey) {
        const res = await fetch('/api/notifications/public-key', { headers: { 'Cache-Control': 'no-cache' } });
        if (res.ok) {
          const data = await res.json();
          vapidKey = data.publicKey || '';
        }
      }

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey)
      });

      this.subscription = subscription;
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      throw error;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe() {
    if (this.subscription) {
      await this.subscription.unsubscribe();
      this.subscription = null;
    }
  }

  // Get current subscription
  async getSubscription() {
    if (!this.isSupported) {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      return await registration.pushManager.getSubscription();
    } catch (error) {
      console.error('Failed to get subscription:', error);
      return null;
    }
  }

  // Helper function to convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Send subscription to server
  async sendSubscriptionToServer(subscription) {
    try {
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(subscription)
      });

      if (!response.ok) {
        throw new Error('Failed to send subscription to server');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to send subscription to server:', error);
      throw error;
    }
  }

  // Check if notifications are enabled in user profile
  async areNotificationsEnabled() {
    try {
      const token = localStorage.getItem('token');
      if (!token) return false;

      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const user = await response.json();
        return user.preferences?.notifications === true;
      }
      return false;
    } catch (error) {
      console.error('Failed to check notification preferences:', error);
      return false;
    }
  }

  // Update notification preferences in user profile
  async updateNotificationPreferences(enabled) {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token');

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          preferences: {
            notifications: enabled
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update notification preferences');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }

  // Initialize notification service
  async initialize() {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported');
      return false;
    }

    try {
      // Check if notifications are enabled in user profile
      const notificationsEnabled = await this.areNotificationsEnabled();
      if (!notificationsEnabled) {
        console.warn('Notifications disabled in user profile');
        return false;
      }

      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.warn('Notification permission denied');
        return false;
      }

      const subscription = await this.subscribe();
      await this.sendSubscriptionToServer(subscription);
      
      console.log('Notification service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
