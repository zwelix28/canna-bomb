import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import notificationService from '../utils/notificationService';
import { useNotification } from '../contexts/NotificationContext';

const SettingsContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

const SettingsTitle = styled.h3`
  color: #1e293b;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SettingsDescription = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 20px 0;
  line-height: 1.5;
`;

const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SettingInfo = styled.div`
  flex: 1;
`;

const SettingLabel = styled.h4`
  color: #374151;
  font-size: 1rem;
  font-weight: 500;
  margin: 0 0 4px 0;
`;

const SettingDescription = styled.p`
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
`;

const ToggleContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + .toggle-slider {
    background-color: #10b981;
  }
  
  &:checked + .toggle-slider:before {
    transform: translateX(20px);
  }
  
  &:focus + .toggle-slider {
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const ToggleSlider = styled.div`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: #cbd5e1;
  border-radius: 24px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    border-radius: 50%;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const StatusText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.enabled ? '#10b981' : '#6b7280'};
  margin-left: 12px;
`;

const TestButton = styled.button`
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 12px;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
    transform: none;
  }
`;

const NotificationSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    checkNotificationSupport();
    checkNotificationStatus();
  }, [checkNotificationStatus]);

  const checkNotificationSupport = () => {
    const supported = notificationService.isNotificationSupported();
    setIsSupported(supported);
  };

  const checkNotificationStatus = useCallback(async () => {
    if (isSupported) {
      const permission = Notification.permission;
      const profileEnabled = await notificationService.areNotificationsEnabled();
      setNotificationsEnabled(permission === 'granted' && profileEnabled);
    }
  }, [isSupported]);

  const handleToggleNotifications = async () => {
    if (!isSupported) {
      showError('Notifications are not supported in this browser');
      return;
    }

    setIsLoading(true);
    try {
      if (notificationsEnabled) {
        // Disable notifications
        await notificationService.updateNotificationPreferences(false);
        setNotificationsEnabled(false);
        showSuccess('Notifications disabled');
      } else {
        // Enable notifications
        await notificationService.updateNotificationPreferences(true);
        const initialized = await notificationService.initialize();
        if (initialized) {
          setNotificationsEnabled(true);
          showSuccess('Notifications enabled! You\'ll receive updates about your orders.');
        } else {
          showError('Failed to enable notifications. Please try again.');
        }
      }
    } catch (error) {
      console.error('Notification setup failed:', error);
      showError('Failed to enable notifications. Please check your browser settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const testNotification = async () => {
    if (!notificationsEnabled) {
      showError('Please enable notifications first');
      return;
    }

    try {
      if (Notification.permission === 'granted') {
        new Notification('Canna Bomb Test', {
          body: 'This is a test notification from Canna Bomb!',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png'
        });
        showSuccess('Test notification sent!');
      } else {
        showError('Notification permission not granted');
      }
    } catch (error) {
      console.error('Test notification failed:', error);
      showError('Failed to send test notification');
    }
  };

  if (!isSupported) {
    return (
      <SettingsContainer>
        <SettingsTitle>
          🔔 Notification Settings
        </SettingsTitle>
        <SettingsDescription>
          Configure your notification preferences to stay updated on your orders.
        </SettingsDescription>
        <SettingItem>
          <SettingInfo>
            <SettingLabel>Push Notifications</SettingLabel>
            <SettingDescription>
              Notifications are not supported in this browser
            </SettingDescription>
          </SettingInfo>
          <ToggleContainer>
            <ToggleInput
              type="checkbox"
              checked={false}
              disabled
            />
            <ToggleSlider className="toggle-slider" />
          </ToggleContainer>
        </SettingItem>
      </SettingsContainer>
    );
  }

  return (
    <SettingsContainer>
      <SettingsTitle>
        🔔 Notification Settings
      </SettingsTitle>
      <SettingsDescription>
        Configure your notification preferences to stay updated on your orders.
      </SettingsDescription>
      
      <SettingItem>
        <SettingInfo>
          <SettingLabel>Push Notifications</SettingLabel>
          <SettingDescription>
            Receive instant notifications when your order status changes
          </SettingDescription>
        </SettingInfo>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ToggleContainer>
            <ToggleInput
              type="checkbox"
              checked={notificationsEnabled}
              onChange={handleToggleNotifications}
              disabled={isLoading}
            />
            <ToggleSlider className="toggle-slider" />
          </ToggleContainer>
          <StatusText enabled={notificationsEnabled}>
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </StatusText>
        </div>
      </SettingItem>

      {notificationsEnabled && (
        <div>
          <TestButton onClick={testNotification}>
            Send Test Notification
          </TestButton>
        </div>
      )}
    </SettingsContainer>
  );
};

export default NotificationSettings;
