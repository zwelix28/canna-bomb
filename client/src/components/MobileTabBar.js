import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { RiHome5Line, RiShoppingBag3Line, RiUser3Line, RiDashboardLine, RiShoppingCart2Line } from 'react-icons/ri';
import { useAuth } from '../contexts/AuthContext';

const TabBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(15, 23, 42, 0.9);
  border-top: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  display: none;
  z-index: 1000;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Tabs = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 6px;
  padding: 8px 10px;
`;

const Tab = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px 6px;
  color: ${props => (props.$active ? '#10b981' : '#94a3b8')};
  text-decoration: none;
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.2s ease;

  svg { font-size: 20px; margin-bottom: 4px; }

  &:hover {
    background: rgba(255,255,255,0.06);
  }
`;

const MobileTabBar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  // Add class to body for mobile padding when tab bar is visible
  useEffect(() => {
    if (window.innerWidth <= 768) {
      document.body.classList.add('has-tab-bar');
      return () => {
        document.body.classList.remove('has-tab-bar');
      };
    }
  }, []);

  return (
    <TabBar>
      <Tabs>
        <Tab to="/" $active={isActive('/')}> <RiHome5Line /> Home</Tab>
        <Tab to="/products" $active={isActive('/products')}> <RiShoppingBag3Line /> Shop</Tab>
        <Tab to="/cart" $active={isActive('/cart')}> <RiShoppingCart2Line /> Cart</Tab>
        {user?.role === 'admin' ? (
          <Tab to="/admin" $active={isActive('/admin')}> <RiDashboardLine /> Admin</Tab>
        ) : (
          <Tab to="/orders" $active={isActive('/orders')}> <RiDashboardLine /> Orders</Tab>
        )}
        <Tab to="/profile" $active={isActive('/profile')}> <RiUser3Line /> Profile</Tab>
      </Tabs>
    </TabBar>
  );
};

export default MobileTabBar;


