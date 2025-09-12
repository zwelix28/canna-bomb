import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  max-width: 400px;
  width: 100%;
  
  @media (max-width: 768px) {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
`;

const Notification = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';
      case 'error': return 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
      case 'info': return 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)';
      default: return 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)';
    }
  }};
  color: white;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  animation: ${props => props.isVisible ? slideIn : slideOut} 0.3s ease-out;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    border-radius: 10px;
    margin-bottom: 8px;
    gap: 10px;
  }
`;

const Icon = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  
  @media (max-width: 768px) {
    font-size: 18px;
    min-width: 18px;
  }
`;

const Content = styled.div`
  flex: 1;
  
  .title {
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 2px;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 13px;
    }
  }
  
  .message {
    font-size: 13px;
    opacity: 0.9;
    line-height: 1.3;
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
  }
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
  
  @media (max-width: 768px) {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }
`;

const NotificationComponent = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, notification.duration || 4000);

    return () => clearTimeout(timer);
  }, [notification.duration, handleClose]);

  const getIcon = (type) => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'info': return 'ℹ';
      default: return '•';
    }
  };

  const getTitle = (type) => {
    switch (type) {
      case 'success': return 'Success';
      case 'error': return 'Error';
      case 'info': return 'Info';
      default: return 'Notification';
    }
  };

  return (
    <NotificationContainer>
      <Notification type={notification.type} isVisible={isVisible}>
        <Icon>{getIcon(notification.type)}</Icon>
        <Content>
          <div className="title">{notification.title || getTitle(notification.type)}</div>
          <div className="message">{notification.message}</div>
        </Content>
        <CloseButton onClick={handleClose}>×</CloseButton>
      </Notification>
    </NotificationContainer>
  );
};

export default NotificationComponent;
