import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import styled from 'styled-components';
import PWAInstallButton from './PWAInstallButton';
import {
  RiLeafFill,
  RiShoppingCart2Line,
  RiUser3Line,
  RiMenu3Fill,
  RiCloseLine,
  RiLogoutBoxRLine,
  RiClipboardLine,
  RiBarChart2Line,
  RiDashboardLine,
  RiRobot2Line,
  RiGroupLine,
  RiTestTubeLine,
  RiArrowUpLine
} from 'react-icons/ri';

const HeaderContainer = styled.header`
  background: radial-gradient(1200px 400px at 10% -20%, rgba(16, 185, 129, 0.12), transparent 60%),
              linear-gradient(135deg, #0b1222 0%, #121c2f 55%, #1e293b 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(16, 185, 129, 0.25);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 6px 28px rgba(0, 0, 0, 0.18);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.9) 50%, transparent 100%);
  }
`;

const Nav = styled.nav`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  
  @media (max-width: 768px) {
    height: 70px;
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    height: 64px;
    padding: 0 12px;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 900;
  text-decoration: none;
  letter-spacing: -0.8px;
  position: relative;
  background: linear-gradient(135deg, #e7fff5 0%, #a7f3d0 35%, #34d399 70%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  transition: transform 0.3s ease, filter 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    inset: -8px -12px;
    background: linear-gradient(125deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 50%, rgba(16,185,129,0.08) 100%);
    border-radius: 14px;
    filter: blur(6px);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.08);
  }
  
  &:hover::after { opacity: 1; }
  
  @media (max-width: 768px) {
    font-size: 22px;
    letter-spacing: -0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 19px;
    letter-spacing: -0.3px;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 12px 20px;
  border-radius: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent 0%, rgba(16, 185, 129, 0.1) 50%, transparent 100%);
    transition: left 0.5s ease;
  }
  
  &:hover {
    color: #10b981;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(52, 211, 153, 0.18) 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25);
    
    &::before {
      left: 100%;
    }
  }
  
  &.active {
    color: #10b981;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(52, 211, 153, 0.22) 100%);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.28);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const CartIcon = styled(Link)`
  position: relative;
  color: #ffffff;
  font-size: 17px;
  text-decoration: none;
  padding: 8px;
  border-radius: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%);
  border: 1px solid rgba(255, 255, 255, 0.24);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #10b981;
    background: linear-gradient(180deg, rgba(16,185,129,0.25) 0%, rgba(16,185,129,0.12) 100%);
    border-color: rgba(16, 185, 129, 0.35);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
  }
  
  @media (max-width: 768px) {
    font-size: 16px;
    padding: 7px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding: 6px;
    border-radius: 6px;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 700;
  border: 2px solid #0f172a;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  
  @media (max-width: 768px) {
    width: 14px;
    height: 14px;
    font-size: 8px;
    top: -5px;
    right: -5px;
  }
  
  @media (max-width: 480px) {
    width: 12px;
    height: 12px;
    font-size: 7px;
    top: -4px;
    right: -4px;
  }
`;

const UserMenu = styled.div`
  position: relative;
`;

const UserButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px;
  border-radius: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  height: 40px;
  
  &:hover {
    background: linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.1) 100%);
    border-color: rgba(16, 185, 129, 0.35);
    color: #10b981;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 6px;
    border-radius: 10px;
    min-width: 36px;
    height: 36px;
  }
  
  @media (max-width: 480px) {
    padding: 5px;
    border-radius: 8px;
    min-width: 32px;
    height: 32px;
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 12px;
  
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
  
  @media (max-width: 480px) {
    width: 20px;
    height: 20px;
    font-size: 10px;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: radial-gradient(800px 200px at 0% 0%, rgba(16,185,129,0.12), transparent 55%),
              rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(16, 185, 129, 0.28);
  border-radius: 16px;
  box-shadow: 0 24px 28px -8px rgba(0, 0, 0, 0.45), 0 10px 16px -6px rgba(0, 0, 0, 0.18);
  min-width: 220px;
  z-index: 1000;
  display: ${props => props.isOpen ? 'block' : 'none'};
  margin-top: 12px;
  overflow: hidden;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: linear-gradient(135deg, rgba(16,185,129,0.16) 0%, rgba(52,211,153,0.16) 100%);
    color: #10b981;
    padding-left: 24px;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 14px 20px;
  background: none;
  border: none;
  color: #f87171;
  text-align: left;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  
  &:hover {
    background: linear-gradient(135deg, rgba(248,113,113,0.16) 0%, rgba(239,68,68,0.16) 100%);
    color: #ef4444;
    padding-left: 24px;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
`;

const AuthButton = styled(Link)`
  padding: 12px 24px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
  }
  
  &.login {
    color: #e2e8f0;
    border: 2px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
    
    &:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: #10b981;
      color: #10b981;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
    }
    
    @media (max-width: 768px) {
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(16, 185, 129, 0.15);
      }
    }
    
    @media (max-width: 480px) {
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
  
  &.register {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    border: 2px solid transparent;
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
    
    @media (max-width: 768px) {
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
      }
    }
    
    @media (max-width: 480px) {
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 18px;
  color: #e2e8f0;
  cursor: pointer;
  padding: 10px;
  border-radius: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    background: linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.1) 100%);
    color: #10b981;
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    display: block;
    padding: 8px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    font-size: 14px;
    border-radius: 6px;
    
    &:hover {
      transform: none;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 16px;
    padding: 8px;
    border-radius: 8px;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: radial-gradient(1200px 400px at 10% -20%, rgba(16, 185, 129, 0.12), transparent 60%),
              linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.35);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transform: translateY(${props => props.isOpen ? '0' : '-10px'});
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuContent = styled.div`
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const MobileNavLink = styled(Link)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  
  &:hover {
    background: linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(52,211,153,0.18) 100%);
    color: #10b981;
    transform: translateX(4px);
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding: 10px 14px;
  }
`;

const MobileAuthSection = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MobileAuthButton = styled(Link)`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  text-decoration: none;
  font-weight: 700;
  padding: 14px 20px;
  border-radius: 12px;
  text-align: center;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background: rgba(16, 185, 129, 0.2);
      border-color: rgba(16, 185, 129, 0.3);
    }
  }
  
  @media (max-width: 480px) {
    padding: 12px 18px;
    font-size: 14px;
  }
`;

const MobileUserInfo = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const MobileUserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 14px;
`;

const MobileUserDetails = styled.div`
  flex: 1;
`;

const MobileUserName = styled.div`
  font-weight: 700;
  color: #e2e8f0;
  font-size: 16px;
`;

const MobileUserRole = styled.div`
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const MobileLogoutButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  border: none;
  font-weight: 700;
  padding: 12px 20px;
  border-radius: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
  }
  
  @media (max-width: 480px) {
    padding: 10px 18px;
    font-size: 14px;
  }
`;

const NewTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.6rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-left: 8px;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsDropdownOpen(false); // Close desktop dropdown when opening mobile menu
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return 'U';
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/">
          <RiLeafFill /> Canna Bomb
        </Logo>
        
        <NavLinks>
          <NavLink to="/products">Products</NavLink>
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin">Admin</NavLink>
          )}
        </NavLinks>
        
        <RightSection>
          <PWAInstallButton showText={false} />
          <CartIcon to="/cart" aria-label="Cart">
            <RiShoppingCart2Line />
            {itemCount > 0 && <CartBadge>{itemCount}</CartBadge>}
          </CartIcon>
          
          {isAuthenticated ? (
            <UserMenu>
              <UserButton onClick={toggleDropdown}>
                <UserAvatar>
                  {getUserInitials(user?.firstName, user?.lastName)}
                </UserAvatar>
              </UserButton>
              <DropdownMenu isOpen={isDropdownOpen}>
                <DropdownItem to="/profile" onClick={() => setIsDropdownOpen(false)}>
                  <RiUser3Line /> Profile
                </DropdownItem>
                {user?.role === 'admin' && (
                  <>
                    <DropdownItem to="/inventory" onClick={() => setIsDropdownOpen(false)}>
                      <RiDashboardLine /> Inventory
                    </DropdownItem>
                    <DropdownItem to="/admin/test-sales" onClick={() => setIsDropdownOpen(false)}>
                      <RiArrowUpLine /> Sales
                    </DropdownItem>
                    <DropdownItem to="/admin/test-order" onClick={() => setIsDropdownOpen(false)}>
                      <RiTestTubeLine /> Order Management
                    </DropdownItem>
                    <DropdownItem to="/admin/advanced-statistics" onClick={() => setIsDropdownOpen(false)}>
                      <RiBarChart2Line /> Statistics & Business Insight
                    </DropdownItem>
                <DropdownItem to="/ai-analytics" onClick={() => setIsDropdownOpen(false)} style={{ fontSize: '14px' }}>
                  <RiRobot2Line /> AI Analytics <NewTag>New</NewTag>
                </DropdownItem>
                    <DropdownItem to="/users" onClick={() => setIsDropdownOpen(false)}>
                      <RiGroupLine /> Users
                    </DropdownItem>
                  </>
                )}
                <LogoutButton onClick={handleLogout}>
                  <RiLogoutBoxRLine /> Logout
                </LogoutButton>
              </DropdownMenu>
            </UserMenu>
          ) : (
            <AuthButtons>
              <AuthButton to="/login" className="login">
                Login
              </AuthButton>
              <AuthButton to="/register" className="register">
                Register
              </AuthButton>
            </AuthButtons>
          )}
          
          <MobileMenuButton onClick={toggleMobileMenu} aria-label="Toggle menu">
            {isMobileMenuOpen ? <RiCloseLine /> : <RiMenu3Fill />}
          </MobileMenuButton>
        </RightSection>
      </Nav>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileMenuContent>
          <MobileNavLinks>
            <MobileNavLink to="/products" onClick={closeMobileMenu}>
              <RiClipboardLine /> Products
            </MobileNavLink>
          </MobileNavLinks>
          
          {isAuthenticated ? (
            <>
              <MobileUserInfo>
                <MobileUserAvatar>
                  {getUserInitials(user?.firstName, user?.lastName)}
                </MobileUserAvatar>
                <MobileUserDetails>
                  <MobileUserName>{user?.firstName || 'User'}</MobileUserName>
                  <MobileUserRole>{user?.role || 'Customer'}</MobileUserRole>
                </MobileUserDetails>
              </MobileUserInfo>
              {/* Admin links live under profile dropdown, not in mobile menu */}
              <MobileLogoutButton onClick={handleLogout}>
                🚪 Logout
              </MobileLogoutButton>
            </>
          ) : (
            <MobileAuthSection>
              <MobileAuthButton to="/login" onClick={closeMobileMenu}>
                Login
              </MobileAuthButton>
              <MobileAuthButton to="/register" onClick={closeMobileMenu} className="secondary">
                Register
              </MobileAuthButton>
            </MobileAuthSection>
          )}
        </MobileMenuContent>
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
