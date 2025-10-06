import React from 'react';
import styled from 'styled-components';
import { RiMapPin2Line, RiPhoneLine, RiMailLine, RiFacebookBoxFill, RiInstagramLine, RiTwitterXLine, RiLinkedinBoxFill } from 'react-icons/ri';

const FooterContainer = styled.footer`
  background:
    radial-gradient(1000px 300px at 0% 0%, rgba(16,185,129,0.12), transparent 55%),
    linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
  color: white;
  margin-top: auto;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(16,185,129,0.9) 50%, transparent 100%);
  }
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 20px 40px;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 50px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 40px 20px 30px;
  }
`;

const BrandSection = styled.div`
  h3 {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 20px;
    letter-spacing: -0.5px;
  }
  
  p {
    color: #cfe7dc;
    line-height: 1.7;
    font-size: 1rem;
    margin-bottom: 24px;
    max-width: 300px;
  }
`;

const ContactInfo = styled.div`
  margin-top: 20px;
  
  .contact-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
    color: #94a3b8;
    font-size: 0.95rem;
    
    .icon { margin-right: 12px; font-size: 1.1rem; color: #10b981; }
  }
`;

const FooterSection = styled.div`
  h4 {
    color: #ffffff;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 20px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 30px;
      height: 2px;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      border-radius: 1px;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 12px;
  }
  
  a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    display: inline-block;
    position: relative;
    
    &:hover {
      color: #10b981;
      transform: translateX(4px);
    }
    
    &::before {
      content: '';
      position: absolute;
      left: -16px;
      top: 50%;
      transform: translateY(-50%);
      width: 0;
      height: 1px;
      background: #10b981;
      transition: width 0.3s ease;
    }
    
    &:hover::before {
      width: 12px;
    }
  }
  
  p {
    color: #94a3b8;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 8px;
  }
  
  /* Hide on mobile devices (PWA) */
  @media (max-width: 768px) {
    display: none;
  }
`;

const SocialLinks = styled.div`
  margin-top: 24px;
  
  h5 {
    color: #ffffff;
    font-size: 1rem;
    margin-bottom: 16px;
    font-weight: 500;
  }
  
  .social-icons {
    display: flex;
    gap: 12px;
  }
  
  .social-icon { width: 40px; height: 40px; background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #10b981; font-size: 1.2rem; transition: all 0.3s ease; cursor: pointer; }
  .social-icon:hover { background: rgba(16,185,129,0.2); border-color: #10b981; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(51, 65, 85, 0.5);
  margin-top: 40px;
  padding: 24px 20px;
  background: rgba(15, 23, 42, 0.5);
  
  .bottom-content {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .copyright {
    color: #94a3b8;
    font-size: 0.9rem;
    margin: 0;
  }
  
  .legal-links {
    display: flex;
    gap: 24px;
    
    @media (max-width: 768px) {
      gap: 16px;
      display: none; /* Hide legal links on mobile for cleaner PWA experience */
    }
    
    a {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s ease;
      
      &:hover {
        color: #10b981;
      }
    }
  }
`;

const AgeWarning = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 20px;
  
  .warning-text {
    color: #fca5a5;
    font-size: 0.85rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    
    .icon {
      margin-right: 8px;
      font-size: 1rem;
    }
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <BrandSection>
          <h3>🌿 Canna Bomb</h3>
          <p>
            Premium cannabis products for the discerning enthusiast. 
            Quality, safety, and satisfaction guaranteed with every purchase.
          </p>
          
          <ContactInfo>
            <div className="contact-item"><span className="icon"><RiMapPin2Line /></span><span>Cape Town, Western Cape 8000</span></div>
            <div className="contact-item"><span className="icon"><RiPhoneLine /></span><span>+27 (0) 21 123 4567</span></div>
            <div className="contact-item"><span className="icon"><RiMailLine /></span><span>info@cannabomb.co.za</span></div>
          </ContactInfo>
          
          <SocialLinks>
            <h5>Follow Us</h5>
            <div className="social-icons">
              <div className="social-icon" aria-label="Facebook"><RiFacebookBoxFill /></div>
              <div className="social-icon" aria-label="Instagram"><RiInstagramLine /></div>
              <div className="social-icon" aria-label="Twitter"><RiTwitterXLine /></div>
              <div className="social-icon" aria-label="LinkedIn"><RiLinkedinBoxFill /></div>
            </div>
          </SocialLinks>
        </BrandSection>
        
        <FooterSection>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/products">Products</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/faq">FAQ</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </FooterSection>
        
        <FooterSection>
          <h4>Legal & Safety</h4>
          <p>Must be 21+ to purchase</p>
          <p>Valid ID required</p>
          <p>Local laws apply</p>
          <p>Consume responsibly</p>
          
          <AgeWarning>
            <div className="warning-text">
              <span className="icon">⚠️</span>
              <span>Age verification required for all purchases</span>
            </div>
          </AgeWarning>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <div className="bottom-content">
          <p className="copyright">
            &copy; 2024 Canna Bomb. All rights reserved.
          </p>
          <div className="legal-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookie Policy</a>
            <a href="/accessibility">Accessibility</a>
          </div>
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
