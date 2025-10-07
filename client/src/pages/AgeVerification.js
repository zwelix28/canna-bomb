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


const AgeVerificationContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 20px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(1000px 400px at 10% -10%, rgba(16,185,129,0.12), transparent 60%),
      radial-gradient(900px 300px at 90% 110%, rgba(52,211,153,0.08), transparent 70%);
    pointer-events: none;
  }
`;

const VerificationCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 28px 22px;
  max-width: 460px;
  width: 100%;
  text-align: center;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  animation: ${fadeIn} 0.6s ease-out;
  position: relative;
`;

const Logo = styled.div`
  font-size: 1.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.6;
`;

const AgeIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.18) 100%);
  border: 1px solid rgba(16,185,129,0.35);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 6px auto 16px;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.18);
  
  svg {
    width: 28px;
    height: 28px;
    color: #10b981;
  }
`;

const WarningText = styled.div`
  background: rgba(245, 158, 11, 0.10);
  border: 1px solid rgba(245, 158, 11, 0.30);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  text-align: left;
  
  h3 {
    color: #fde68a;
    font-size: 0.9rem;
    font-weight: 700;
    margin-bottom: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  p {
    color: #fef3c7;
    font-size: 0.85rem;
    line-height: 1.5;
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`;

const ConfirmButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 6px 18px rgba(16, 185, 129, 0.30);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.35);
  }
`;

const DeclineButton = styled.button`
  flex: 1;
  background: rgba(255,255,255,0.06);
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.08);
    border-color: rgba(255,255,255,0.24);
    color: #e2e8f0;
  }
`;

const FooterText = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 14px;
  line-height: 1.6;
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
