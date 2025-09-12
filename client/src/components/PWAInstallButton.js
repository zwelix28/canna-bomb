import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { pwaUtils } from '../utils/pwaUtils';

const InstallButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }
`;

const InstallIcon = styled.span`
  font-size: 16px;
`;

const InstallText = styled.span`
  font-weight: 600;
`;

const PWAInstallButton = ({ className, showText = true }) => {
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check PWA installation status
    const checkStatus = () => {
      const pwaInfo = pwaUtils.getPWAInfo();
      setCanInstall(pwaInfo.canInstall);
      setIsInstalled(pwaInfo.isInstalled);
    };

    checkStatus();

    // Listen for PWA events
    const handleBeforeInstallPrompt = () => {
      setCanInstall(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setCanInstall(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    
    try {
      const success = await pwaUtils.installPWA();
      if (success) {
        setIsInstalled(true);
        setCanInstall(false);
      }
    } catch (error) {
      console.error('PWA installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  // Don't render if already installed or can't install
  if (isInstalled || !canInstall) {
    return null;
  }

  return (
    <InstallButton
      className={className}
      onClick={handleInstall}
      disabled={isInstalling}
    >
      <InstallIcon>📱</InstallIcon>
      {showText && (
        <InstallText>
          {isInstalling ? 'Installing...' : 'Install App'}
        </InstallText>
      )}
    </InstallButton>
  );
};

export default PWAInstallButton;



