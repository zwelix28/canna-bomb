import React, { createContext, useContext, useState } from 'react';
import NotificationComponent from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 4000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Auto-remove after duration
    setTimeout(() => {
      removeNotification(id);
    }, newNotification.duration);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const showSuccess = (message, title = 'Success') => {
    addNotification({
      type: 'success',
      message,
      title,
      duration: 3000
    });
  };

  const showError = (message, title = 'Error') => {
    addNotification({
      type: 'error',
      message,
      title,
      duration: 5000
    });
  };

  const showInfo = (message, title = 'Info') => {
    addNotification({
      type: 'info',
      message,
      title,
      duration: 4000
    });
  };

  const value = {
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map(notification => (
        <NotificationComponent
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </NotificationContext.Provider>
  );
};

