import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { isAgeVerified, setAgeVerified } from '../utils/ageVerification';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const AgeVerificationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const VerificationCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 60px 40px;
  max-width: 500px;
  width: 100%;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.2);
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981 0%, #059669 50%, #10b981 100%);
    border-radius: 24px 24px 0 0;
  }
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64748b;
  margin-bottom: 40px;
  line-height: 1.6;
`;

const AgeIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 30px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  animation: ${pulse} 2s infinite;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
`;

const WarningText = styled.div`
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  text-align: left;
  
  h3 {
    color: #92400e;
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: #92400e;
    font-size: 0.9rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 30px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const DeclineButton = styled.button`
  flex: 1;
  background: transparent;
  color: #64748b;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #475569;
  }
`;

const FooterText = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 30px;
  line-height: 1.4;
`;

const AgeVerification = ({ onAgeVerified }) => {
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    // Check if user has already verified their age
    if (isAgeVerified()) {
      onAgeVerified && onAgeVerified();
    }
  }, [navigate, onAgeVerified]);

  const handleConfirm = () => {
    setIsVerifying(true);
    
    // Store verification using utility function
    setAgeVerified(true);
    
    // Notify parent component
    onAgeVerified && onAgeVerified();
    
    // Add a small delay for better UX
    setTimeout(() => {
      // No need to navigate since parent will handle the state change
    }, 500);
  };

  const handleDecline = () => {
    // Redirect to a safe page or show a message
    alert('You must be 18 or older to access this website. Thank you for your understanding.');
  };

  return (
    <AgeVerificationContainer>
      <VerificationCard>
        <Logo>CannaBomb</Logo>
        
        <AgeIcon>
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </AgeIcon>
        
        <Title>Age Verification Required</Title>
        <Subtitle>
          You must be 18 years or older to access this website. 
          Please confirm your age to continue.
        </Subtitle>
        
        <WarningText>
          <h3>
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l9 4.9V17c0 5.55-3.84 10.74-9 12-5.16-1.26-9-6.45-9-12V6.9L12 2z"/>
            </svg>
            Legal Notice
          </h3>
          <p>
            This website contains information about cannabis products and is intended 
            for adults only. By proceeding, you confirm that you are 18 years of age 
            or older and agree to our terms of service.
          </p>
        </WarningText>
        
        <ButtonGroup>
          <ConfirmButton onClick={handleConfirm} disabled={isVerifying}>
            {isVerifying ? 'Verifying...' : 'I am 18+ - Enter'}
          </ConfirmButton>
          <DeclineButton onClick={handleDecline}>
            I am under 18
          </DeclineButton>
        </ButtonGroup>
        
        <FooterText>
          By clicking "I am 18+ - Enter", you agree to our Terms of Service and 
          acknowledge that you are of legal age to view cannabis-related content.
        </FooterText>
      </VerificationCard>
    </AgeVerificationContainer>
  );
};

export default AgeVerification;
