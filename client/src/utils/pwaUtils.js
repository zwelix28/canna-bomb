// PWA Utility Functions
export class PWAUtils {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    this.setupInstallPrompt();
    this.setupConnectionListeners();
    this.checkInstallationStatus();
  }

  // Setup PWA install prompt
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log('PWA install prompt triggered');
      e.preventDefault();
      this.deferredPrompt = e;
      this.showInstallPrompt();
    });

    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed successfully');
      this.isInstalled = true;
      this.deferredPrompt = null;
      this.trackInstallation();
    });
  }

  // Show custom install prompt
  showInstallPrompt() {
    if (this.isInstalled || !this.deferredPrompt) return;

    const installNotification = document.createElement('div');
    installNotification.id = 'pwa-install-prompt';
    installNotification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 20px;
      right: 20px;
      background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
      color: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      animation: slideUp 0.3s ease-out;
    `;

    installNotification.innerHTML = `
      <div style="display: flex; align-items: center;">
        <span style="font-size: 24px; margin-right: 12px;">📱</span>
        <div>
          <div style="font-weight: 600; margin-bottom: 4px;">Install Canna Bomb</div>
          <div style="font-size: 14px; opacity: 0.9;">Get the app for a better experience</div>
        </div>
      </div>
      <div style="display: flex; gap: 8px;">
        <button id="installLater" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px;">Later</button>
        <button id="installNow" style="background: white; border: none; color: #10b981; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600;">Install</button>
      </div>
    `;

    // Add CSS animation
    if (!document.getElementById('pwa-styles')) {
      const style = document.createElement('style');
      style.id = 'pwa-styles';
      style.textContent = `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(installNotification);

    // Install button handler
    document.getElementById('installNow').addEventListener('click', async () => {
      await this.installPWA();
      this.hideInstallPrompt();
    });

    // Later button handler
    document.getElementById('installLater').addEventListener('click', () => {
      this.hideInstallPrompt();
    });

    // Auto-hide after 15 seconds
    setTimeout(() => {
      this.hideInstallPrompt();
    }, 15000);
  }

  // Hide install prompt
  hideInstallPrompt() {
    const prompt = document.getElementById('pwa-install-prompt');
    if (prompt) {
      prompt.style.animation = 'slideUp 0.3s ease-out reverse';
      setTimeout(() => {
        if (document.body.contains(prompt)) {
          document.body.removeChild(prompt);
        }
      }, 300);
    }
  }

  // Install PWA
  async installPWA() {
    if (!this.deferredPrompt) return false;

    try {
      this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      console.log('PWA install outcome:', outcome);
      
      if (outcome === 'accepted') {
        this.trackInstallation();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('PWA installation failed:', error);
      return false;
    }
  }

  // Check if PWA is installed
  checkInstallationStatus() {
    // Check if running in standalone mode
    this.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                      window.navigator.standalone === true;
    
    return this.isInstalled;
  }

  // Setup connection listeners
  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.showConnectionStatus('online');
      this.syncOfflineData();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.showConnectionStatus('offline');
    });
  }

  // Show connection status
  showConnectionStatus(status) {
    const existingStatus = document.getElementById('connection-status');
    if (existingStatus) {
      existingStatus.remove();
    }

    if (status === 'online') {
      const statusElement = document.createElement('div');
      statusElement.id = 'connection-status';
      statusElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(16, 185, 129, 0.9);
        color: white;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 14px;
        font-weight: 500;
        z-index: 10000;
        animation: slideDown 0.3s ease-out;
      `;
      statusElement.innerHTML = '🟢 Back Online';
      document.body.appendChild(statusElement);

      setTimeout(() => {
        if (document.body.contains(statusElement)) {
          statusElement.style.animation = 'slideDown 0.3s ease-out reverse';
          setTimeout(() => {
            if (document.body.contains(statusElement)) {
              document.body.removeChild(statusElement);
            }
          }, 300);
        }
      }, 3000);
    }
  }

  // Sync offline data when back online
  async syncOfflineData() {
    try {
      // Sync cart data
      await this.syncCartData();
      
      // Sync any pending orders
      await this.syncPendingOrders();
      
      console.log('Offline data synced successfully');
    } catch (error) {
      console.error('Failed to sync offline data:', error);
    }
  }

  // Sync cart data
  async syncCartData() {
    const cartData = localStorage.getItem('offline-cart');
    if (cartData) {
      try {
        const response = await fetch('/api/cart/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: cartData
        });

        if (response.ok) {
          localStorage.removeItem('offline-cart');
          console.log('Cart data synced successfully');
        }
      } catch (error) {
        console.error('Failed to sync cart data:', error);
      }
    }
  }

  // Sync pending orders
  async syncPendingOrders() {
    const pendingOrders = localStorage.getItem('pending-orders');
    if (pendingOrders) {
      try {
        const orders = JSON.parse(pendingOrders);
        for (const order of orders) {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(order)
          });

          if (response.ok) {
            console.log('Pending order synced successfully');
          }
        }
        
        localStorage.removeItem('pending-orders');
      } catch (error) {
        console.error('Failed to sync pending orders:', error);
      }
    }
  }

  // Store data offline
  storeOfflineData(key, data) {
    try {
      localStorage.setItem(`offline-${key}`, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Failed to store offline data:', error);
      return false;
    }
  }

  // Get offline data
  getOfflineData(key) {
    try {
      const data = localStorage.getItem(`offline-${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return null;
    }
  }

  // Track PWA installation
  trackInstallation() {
    // Track installation event for analytics
    if (typeof window !== 'undefined' && typeof window.gtag !== 'undefined') {
      window.gtag('event', 'pwa_install', {
        event_category: 'engagement',
        event_label: 'canna_bomb_app'
      });
    }

    // Store installation timestamp
    localStorage.setItem('pwa-installed', Date.now().toString());
  }

  // Check if PWA can be installed
  canInstall() {
    return !this.isInstalled && this.deferredPrompt !== null;
  }

  // Get PWA info
  getPWAInfo() {
    return {
      isInstalled: this.isInstalled,
      canInstall: this.canInstall(),
      isOnline: this.isOnline,
      displayMode: window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser'
    };
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Send notification
  sendNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        ...options
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    }
    return null;
  }
}

// Create global instance
export const pwaUtils = new PWAUtils();

// Export utility functions
export const {
  installPWA,
  canInstall,
  getPWAInfo,
  requestNotificationPermission,
  sendNotification,
  storeOfflineData,
  getOfflineData
} = pwaUtils;
