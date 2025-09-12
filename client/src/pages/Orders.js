import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const OrdersContainer = styled.div`
  min-height: 100vh;
  padding: 0;
  background: ${props => props.isAdmin ? 
    'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%)' :
    'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
  };
  position: relative;
  overflow: hidden;
  
  ${props => props.isAdmin && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(52, 211, 153, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.05) 0%, transparent 50%);
      z-index: 1;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
      z-index: 2;
    }
  `}
`;

const OrdersContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: ${props => props.isAdmin ? '40px 24px' : '60px 32px'};
  position: relative;
  z-index: 3;
`;

const OrdersHeader = styled.div`
  text-align: center;
  margin-bottom: ${props => props.isAdmin ? '40px' : '64px'};
  position: relative;
`;

const Title = styled.h1`
  font-size: ${props => props.isAdmin ? '2.8rem' : '3.5rem'};
  font-weight: 900;
  background: ${props => props.isAdmin ? 
    'linear-gradient(135deg, #ffffff 0%, #10b981 30%, #34d399 60%, #6ee7b7 100%)' :
    'linear-gradient(135deg, #0f172a 0%, #10b981 100%)'
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.isAdmin ? '16px' : '24px'};
  letter-spacing: -1px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  
  ${props => props.isAdmin && `
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 120px;
      height: 3px;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      border-radius: 2px;
    }
  `}
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled.p`
  color: ${props => props.isAdmin ? '#94a3b8' : '#64748b'};
  font-size: 1.2rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  letter-spacing: 0.3px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${props => props.isAdmin ? '200px' : '280px'}, 1fr));
  gap: ${props => props.isAdmin ? '20px' : '32px'};
  margin-bottom: ${props => props.isAdmin ? '32px' : '48px'};
  
  /* Mobile PWA optimizations for administrators */
  @media (max-width: 768px) {
    display: ${props => props.isAdmin ? 'grid' : 'none'};
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled.div`
  background: ${props => props.isAdmin ? 
    'rgba(255, 255, 255, 0.05)' :
    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  backdrop-filter: ${props => props.isAdmin ? 'blur(20px)' : 'none'};
  border-radius: ${props => props.isAdmin ? '16px' : '24px'};
  padding: ${props => props.isAdmin ? '24px' : '40px'};
  box-shadow: ${props => props.isAdmin ? 
    '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' :
    '0 4px 20px rgba(0, 0, 0, 0.08)'
  };
  text-align: center;
  border: ${props => props.isAdmin ? 
    '1px solid rgba(255, 255, 255, 0.1)' :
    '1px solid rgba(16, 185, 129, 0.1)'
  };
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  ${props => props.isAdmin && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
      opacity: 0.8;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  `}
  
  &:hover {
    transform: ${props => props.isAdmin ? 'translateY(-8px) scale(1.02)' : 'translateY(-4px)'};
    box-shadow: ${props => props.isAdmin ? 
      '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' :
      '0 8px 30px rgba(0, 0, 0, 0.12)'
    };
    border-color: ${props => props.isAdmin ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
    
    ${props => props.isAdmin && `
      &::after {
        opacity: 1;
      }
    `}
  }
  
  /* Mobile PWA optimizations for administrators */
  @media (max-width: 768px) {
    padding: ${props => props.isAdmin ? '16px 12px' : '40px'};
    border-radius: ${props => props.isAdmin ? '12px' : '24px'};
    
    &:hover {
      transform: ${props => props.isAdmin ? 'translateY(-2px)' : 'translateY(-4px)'};
    }
  }
`;

const StatNumber = styled.div`
  font-size: ${props => props.isAdmin ? '2.2rem' : '3rem'};
  font-weight: 900;
  background: ${props => props.isAdmin ? 
    'linear-gradient(135deg, #ffffff 0%, #10b981 100%)' :
    `linear-gradient(135deg, ${props.color || '#10b981'} 0%, ${props.color || '#10b981'}CC 100%)`
  };
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: ${props => props.isAdmin ? '8px' : '12px'};
  position: relative;
  z-index: 1;
  text-shadow: ${props => props.isAdmin ? '0 2px 4px rgba(0, 0, 0, 0.3)' : 'none'};
  
  /* Mobile PWA optimizations for administrators */
  @media (max-width: 768px) {
    font-size: ${props => props.isAdmin ? '1.8rem' : '3rem'};
    margin-bottom: 6px;
  }
`;

const StatLabel = styled.div`
  color: ${props => props.isAdmin ? '#94a3b8' : '#64748b'};
  font-size: ${props => props.isAdmin ? '0.85rem' : '1rem'};
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  font-family: ${props => props.isAdmin ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : 'inherit'};
  
  /* Mobile PWA optimizations for administrators */
  @media (max-width: 768px) {
    font-size: ${props => props.isAdmin ? '0.75rem' : '1rem'};
    letter-spacing: 0.5px;
  }
`;

const FilterBar = styled.div`
  display: flex;
  gap: ${props => props.isAdmin ? '12px' : '16px'};
  margin-bottom: ${props => props.isAdmin ? '24px' : '32px'};
  flex-wrap: wrap;
  align-items: center;
  background: ${props => props.isAdmin ? 'rgba(255, 255, 255, 0.05)' : 'transparent'};
  backdrop-filter: ${props => props.isAdmin ? 'blur(20px)' : 'none'};
  border-radius: ${props => props.isAdmin ? '16px' : '0'};
  padding: ${props => props.isAdmin ? '16px' : '0'};
  border: ${props => props.isAdmin ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'};
`;

const FilterButton = styled.button`
  padding: ${props => props.isAdmin ? '10px 18px' : '14px 24px'};
  border: ${props => props.isAdmin ? 
    `2px solid ${props.active ? '#10b981' : 'rgba(255, 255, 255, 0.2)'}` :
    `2px solid ${props.active ? '#10b981' : 'rgba(16, 185, 129, 0.2)'}`
  };
  background: ${props => props.isAdmin ? 
    (props.active ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'rgba(255, 255, 255, 0.05)') :
    (props.active ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)')
  };
  color: ${props => props.isAdmin ? 
    (props.active ? 'white' : '#ffffff') :
    (props.active ? 'white' : '#0f172a')
  };
  border-radius: ${props => props.isAdmin ? '10px' : '12px'};
  font-weight: 600;
  font-size: ${props => props.isAdmin ? '0.9rem' : '1rem'};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: ${props => props.isAdmin ? 'blur(10px)' : 'none'};
  font-family: ${props => props.isAdmin ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : 'inherit'};
  
  &:hover {
    border-color: #10b981;
    background: ${props => props.isAdmin ? 
      (props.active ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(16, 185, 129, 0.2)') :
      (props.active ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 'rgba(16, 185, 129, 0.1)')
    };
    transform: translateY(-2px);
    box-shadow: ${props => props.isAdmin ? '0 8px 24px rgba(16, 185, 129, 0.3)' : '0 4px 12px rgba(16, 185, 129, 0.2)'};
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: ${props => props.isAdmin ? '8px 12px' : '10px 16px'};
    font-size: ${props => props.isAdmin ? '0.8rem' : '0.9rem'};
    border-radius: 8px;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: ${props => props.isAdmin ? '20px' : '32px'};
  margin-bottom: ${props => props.isAdmin ? '32px' : '48px'};
`;

const OrderCard = styled.div`
  background: ${props => props.isAdmin ? 
    'rgba(255, 255, 255, 0.05)' :
    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  backdrop-filter: ${props => props.isAdmin ? 'blur(20px)' : 'none'};
  border-radius: ${props => props.isAdmin ? '16px' : '24px'};
  padding: ${props => props.isAdmin ? '24px' : '40px'};
  box-shadow: ${props => props.isAdmin ? 
    '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' :
    '0 4px 20px rgba(0, 0, 0, 0.08)'
  };
  border: ${props => props.isAdmin ? 
    '1px solid rgba(255, 255, 255, 0.1)' :
    '1px solid rgba(16, 185, 129, 0.1)'
  };
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  
  ${props => props.isAdmin && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
      opacity: 0.8;
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
  `}
  
  &:hover {
    border-color: ${props => props.isAdmin ? 'rgba(16, 185, 129, 0.3)' : 'rgba(16, 185, 129, 0.3)'};
    transform: ${props => props.isAdmin ? 'translateY(-8px) scale(1.02)' : 'translateY(-6px)'};
    box-shadow: ${props => props.isAdmin ? 
      '0 20px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)' :
      '0 20px 40px rgba(16, 185, 129, 0.15)'
    };
    
    ${props => props.isAdmin && `
      &::after {
        opacity: 1;
      }
    `}
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: ${props => props.isAdmin ? '16px' : '20px'};
    border-radius: ${props => props.isAdmin ? '12px' : '16px'};
    
    &:hover {
      transform: ${props => props.isAdmin ? 'translateY(-4px)' : 'translateY(-3px)'};
    }
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${props => props.isAdmin ? '16px' : '20px'};
  gap: 16px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    margin-bottom: 12px;
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.h3`
  font-size: ${props => props.isAdmin ? '1.1rem' : '1.3rem'};
  font-weight: 600;
  color: ${props => props.isAdmin ? '#ffffff' : '#1e293b'};
  margin-bottom: ${props => props.isAdmin ? '6px' : '8px'};
  font-family: ${props => props.isAdmin ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : 'inherit'};
`;

const OrderDate = styled.p`
  color: ${props => props.isAdmin ? '#94a3b8' : '#64748b'};
  font-size: ${props => props.isAdmin ? '12px' : '14px'};
  margin-bottom: 4px;
`;

const CustomerName = styled.p`
  color: ${props => props.isAdmin ? '#ffffff' : '#1e293b'};
  font-weight: 500;
  font-size: ${props => props.isAdmin ? '14px' : '16px'};
`;

const OrderTotalText = styled.p`
  color: ${props => props.isAdmin ? '#ffffff' : '#1e293b'};
  font-weight: 600;
  font-size: ${props => props.isAdmin ? '14px' : '16px'};
`;

const OrderStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
`;

const StatusBadge = styled.span`
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  backdrop-filter: blur(10px);
  border: 1px solid;
  transition: all 0.3s ease;
  font-family: ${props => props.isAdmin ? "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" : 'inherit'};
  
  background: ${props => {
    if (props.isAdmin) {
      switch (props.status) {
        case 'pending': return 'rgba(245, 158, 11, 0.15)';
        case 'confirmed': return 'rgba(59, 130, 246, 0.15)';
        case 'processing': return 'rgba(245, 158, 11, 0.15)';
        case 'ready': return 'rgba(16, 185, 129, 0.15)';
        case 'completed': return 'rgba(16, 185, 129, 0.15)';
        case 'cancelled': return 'rgba(239, 68, 68, 0.15)';
        default: return 'rgba(100, 116, 139, 0.15)';
      }
    } else {
      switch (props.status) {
        case 'pending': return '#fef3c7';
        case 'confirmed': return '#dbeafe';
        case 'processing': return '#fef3c7';
        case 'ready': return '#dcfce7';
        case 'completed': return '#dcfce7';
        case 'cancelled': return '#fee2e2';
        default: return '#f3f4f6';
      }
    }
  }};
  
  color: ${props => {
    if (props.isAdmin) {
      switch (props.status) {
        case 'pending': return '#fbbf24';
        case 'confirmed': return '#60a5fa';
        case 'processing': return '#fbbf24';
        case 'ready': return '#34d399';
        case 'completed': return '#34d399';
        case 'cancelled': return '#fca5a5';
        default: return '#94a3b8';
      }
    } else {
      switch (props.status) {
        case 'pending': return '#92400e';
        case 'confirmed': return '#1e40af';
        case 'processing': return '#92400e';
        case 'ready': return '#166534';
        case 'completed': return '#166534';
        case 'cancelled': return '#991b1b';
        default: return '#6b7280';
      }
    }
  }};
  
  border-color: ${props => {
    if (props.isAdmin) {
      switch (props.status) {
        case 'pending': return 'rgba(245, 158, 11, 0.3)';
        case 'confirmed': return 'rgba(59, 130, 246, 0.3)';
        case 'processing': return 'rgba(245, 158, 11, 0.3)';
        case 'ready': return 'rgba(16, 185, 129, 0.3)';
        case 'completed': return 'rgba(16, 185, 129, 0.3)';
        case 'cancelled': return 'rgba(239, 68, 68, 0.3)';
        default: return 'rgba(100, 116, 139, 0.3)';
      }
    } else {
      return 'transparent';
    }
  }};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.isAdmin ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none'};
  }
`;

const StatusTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  
  /* Hide status timeline on mobile PWA for cleaner look */
  @media (max-width: 768px) {
    display: none;
  }
`;

const TimelineStep = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${props => props.active ? '#10b981' : '#9ca3af'};
  font-weight: ${props => props.active ? '600' : '400'};
`;

const TimelineDot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.active ? '#10b981' : '#d1d5db'};
`;

const NotificationBanner = styled.div`
  background: ${props => {
    switch (props.status) {
      case 'ready': return '#dcfce7';
      case 'completed': return '#dcfce7';
      case 'cancelled': return '#fee2e2';
      default: return '#f0f9ff';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status) {
      case 'ready': return '#10b981';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#0ea5e9';
    }
  }};
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NotificationIcon = styled.span`
  font-size: 16px;
`;

const NotificationText = styled.div`
  color: ${props => {
    switch (props.status) {
      case 'ready': return '#166534';
      case 'completed': return '#166534';
      case 'cancelled': return '#991b1b';
      default: return '#0c4a6e';
    }
  }};
  font-weight: 500;
  font-size: 14px;
`;

const OrderItems = styled.div`
  margin-bottom: 20px;
  
  /* Hide order items on mobile PWA for cleaner look */
  @media (max-width: 768px) {
    display: none;
  }
`;

const ItemList = styled.div`
  display: grid;
  gap: 12px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ItemImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  object-fit: cover;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  color: #1e293b;
`;

const ItemQuantity = styled.div`
  color: #64748b;
  font-size: 14px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const TotalLabel = styled.div`
  font-weight: 600;
  color: #1e293b;
`;

const TotalAmount = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #10b981;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 8px;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 12px 20px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &.primary {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #059669 0%, #10b981 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
    }
  }
  
  &.secondary {
    background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    color: #374151;
    
    &:hover {
      background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
      transform: translateY(-1px);
    }
  }
  
  &.danger {
    background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    
    &:hover {
      background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(239, 68, 68, 0.4);
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 13px;
    border-radius: 8px;
    width: 100%;
  }
`;

const CollectionInfo = styled.div`
  background: #f0f9ff;
  border: 1px solid #0ea5e9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
  
  /* Hide collection info on mobile PWA for cleaner look */
  @media (max-width: 768px) {
    display: none;
  }
`;

const CollectionTitle = styled.h4`
  color: #0c4a6e;
  font-weight: 600;
  margin-bottom: 8px;
`;

const CollectionDetails = styled.div`
  color: #0369a1;
  font-size: 14px;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
  font-size: 1.1rem;
`;

const NoOrders = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const Orders = () => {
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { showSuccess, showError } = useNotification();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    ready: 0,
    completed: 0
  });
  const navigate = useNavigate();

  const isAdmin = user?.role === 'admin';

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching orders...');
      
      // Use admin endpoint for admins, regular endpoint for users
      const endpoint = isAdmin ? '/api/orders/admin' : '/api/orders';
      const response = await api.get(endpoint);
      console.log('Orders response:', response);
      console.log('Orders response data:', response.data);
      
      // Handle different response structures
      let allOrders = [];
      if (response.data && response.data.orders) {
        allOrders = response.data.orders;
      } else if (Array.isArray(response.data)) {
        allOrders = response.data;
      } else {
        allOrders = [];
      }
      
      // Filter orders based on status
      let filteredOrders = statusFilter === 'all' 
        ? allOrders 
        : allOrders.filter(order => order.status === statusFilter);
      
      // Sort orders: pending first, then completed, then others by date (newest first)
      filteredOrders.sort((a, b) => {
        // Define status priority: pending = 0, completed = 1, others = 2
        const getStatusPriority = (status) => {
          if (status === 'pending') return 0;
          if (status === 'completed') return 1;
          return 2;
        };
        
        const statusPriorityA = getStatusPriority(a.status);
        const statusPriorityB = getStatusPriority(b.status);
        
        // If status priority is different, sort by priority
        if (statusPriorityA !== statusPriorityB) {
          return statusPriorityA - statusPriorityB;
        }
        
        // If same status priority, sort by date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      
      setOrders(filteredOrders);
      
      // Calculate stats
      const statsData = {
        total: allOrders.length,
        pending: allOrders.filter(o => o.status === 'pending').length,
        processing: allOrders.filter(o => o.status === 'processing').length,
        ready: allOrders.filter(o => o.status === 'ready').length,
        completed: allOrders.filter(o => o.status === 'completed').length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Error fetching orders:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      
      if (error.response?.status === 401) {
        showError('Please login to view your orders', 'Authentication Required');
      } else {
        showError('Failed to fetch orders', 'Error');
      }
      setOrders([]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, statusFilter, showError]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, statusFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/api/orders/${orderId}/status`, { status: newStatus });
      showSuccess(`Order status updated to ${newStatus}`, 'Order Updated');
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Failed to update order status', 'Update Failed');
    }
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending': return 'confirmed';
      case 'confirmed': return 'processing';
      case 'processing': return 'ready';
      case 'ready': return 'completed';
      default: return null;
    }
  };

  const getStatusActions = (order) => {
    const actions = [];
    const nextStatus = getNextStatus(order.status);
    
    if (nextStatus && isAdmin) {
      actions.push({
        label: `Mark as ${nextStatus}`,
        action: () => updateOrderStatus(order._id, nextStatus),
        className: 'primary'
      });
    }
    
    if (order.status === 'pending' && isAdmin) {
      actions.push({
        label: 'Cancel Order',
        action: () => updateOrderStatus(order._id, 'cancelled'),
        className: 'danger'
      });
    }
    
    return actions;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isAuthenticated) {
    return (
      <OrdersContainer>
        <OrdersContent>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1>Access Denied</h1>
            <p>Please log in to view your orders.</p>
          </div>
        </OrdersContent>
      </OrdersContainer>
    );
  }

  if (loading) {
    return (
      <OrdersContainer>
        <LoadingSpinner>Loading orders...</LoadingSpinner>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer isAdmin={isAdmin}>
      <OrdersContent isAdmin={isAdmin}>
        <OrdersHeader isAdmin={isAdmin}>
          <Title isAdmin={isAdmin}>{isAdmin ? 'Order Management' : 'My Orders'}</Title>
          <Subtitle isAdmin={isAdmin}>
            {isAdmin ? 'Process and track customer orders' : 'Track your order history and status'}
          </Subtitle>
        </OrdersHeader>

        {/* Stats Dashboard - Show for admins or if user has orders */}
        {(isAdmin || stats.total > 0) && (
          <StatsGrid isAdmin={isAdmin}>
            <StatCard isAdmin={isAdmin} color="#3b82f6">
              <StatNumber isAdmin={isAdmin} color="#3b82f6">{stats.total}</StatNumber>
              <StatLabel isAdmin={isAdmin}>Total Orders</StatLabel>
            </StatCard>
            <StatCard isAdmin={isAdmin} color="#f59e0b">
              <StatNumber isAdmin={isAdmin} color="#f59e0b">{stats.pending}</StatNumber>
              <StatLabel isAdmin={isAdmin}>Pending</StatLabel>
            </StatCard>
            <StatCard isAdmin={isAdmin} color="#f59e0b">
              <StatNumber isAdmin={isAdmin} color="#f59e0b">{stats.processing}</StatNumber>
              <StatLabel isAdmin={isAdmin}>Processing</StatLabel>
            </StatCard>
            <StatCard isAdmin={isAdmin} color="#10b981">
              <StatNumber isAdmin={isAdmin} color="#10b981">{stats.ready}</StatNumber>
              <StatLabel isAdmin={isAdmin}>Ready</StatLabel>
            </StatCard>
            <StatCard isAdmin={isAdmin} color="#10b981">
              <StatNumber isAdmin={isAdmin} color="#10b981">{stats.completed}</StatNumber>
              <StatLabel isAdmin={isAdmin}>Completed</StatLabel>
            </StatCard>
          </StatsGrid>
        )}

        {/* Filter Bar - Show for admins or if user has orders */}
        {(isAdmin || stats.total > 0) && (
          <FilterBar isAdmin={isAdmin}>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'all'} 
              onClick={() => setStatusFilter('all')}
            >
              All Orders
            </FilterButton>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'pending'} 
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </FilterButton>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'confirmed'} 
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmed
            </FilterButton>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'processing'} 
              onClick={() => setStatusFilter('processing')}
            >
              Processing
            </FilterButton>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'ready'} 
              onClick={() => setStatusFilter('ready')}
            >
              Ready
            </FilterButton>
            <FilterButton 
              isAdmin={isAdmin}
              active={statusFilter === 'completed'} 
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </FilterButton>
          </FilterBar>
        )}

        {orders.length === 0 ? (
          <NoOrders>
            <h3>No orders found</h3>
            <p>{isAdmin ? 'Orders will appear here as customers place them' : 'Start shopping to see your orders here'}</p>
          </NoOrders>
        ) : (
          <OrdersGrid isAdmin={isAdmin}>
            {orders.map(order => (
              <OrderCard key={order._id} isAdmin={isAdmin} onClick={() => handleOrderClick(order._id)}>
                {/* Status Notification Banner */}
                {(order.status === 'ready' || order.status === 'completed' || order.status === 'cancelled') && (
                  <NotificationBanner status={order.status}>
                    <NotificationIcon>
                      {order.status === 'ready' && '✅'}
                      {order.status === 'completed' && '🎉'}
                      {order.status === 'cancelled' && '❌'}
                    </NotificationIcon>
                    <NotificationText>
                      {order.status === 'ready' && 'Your order is ready for pickup!'}
                      {order.status === 'completed' && 'Your order has been completed!'}
                      {order.status === 'cancelled' && 'Your order has been cancelled.'}
                    </NotificationText>
                  </NotificationBanner>
                )}
                
                <OrderHeader isAdmin={isAdmin}>
                  <OrderInfo>
                    <OrderNumber isAdmin={isAdmin}>{order.orderNumber}</OrderNumber>
                    <OrderDate isAdmin={isAdmin}>
                      {formatDate(order.createdAt)}
                    </OrderDate>
                    {isAdmin ? (
                      <CustomerName isAdmin={isAdmin}>
                        {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                      </CustomerName>
                                         ) : (
                       <OrderTotalText isAdmin={isAdmin}>Total: R{order.total.toFixed(2)}</OrderTotalText>
                     )}
                  </OrderInfo>
                  <OrderStatus>
                    <StatusBadge isAdmin={isAdmin} status={order.status}>
                      {order.status}
                    </StatusBadge>
                    
                    {/* Status Timeline */}
                    <StatusTimeline>
                      <TimelineStep active={['pending', 'confirmed', 'processing', 'ready', 'completed'].includes(order.status)}>
                        <TimelineDot active={['pending', 'confirmed', 'processing', 'ready', 'completed'].includes(order.status)} />
                        <span>Order Placed</span>
                      </TimelineStep>
                      <TimelineStep active={['confirmed', 'processing', 'ready', 'completed'].includes(order.status)}>
                        <TimelineDot active={['confirmed', 'processing', 'ready', 'completed'].includes(order.status)} />
                        <span>Confirmed</span>
                      </TimelineStep>
                      <TimelineStep active={['processing', 'ready', 'completed'].includes(order.status)}>
                        <TimelineDot active={['processing', 'ready', 'completed'].includes(order.status)} />
                        <span>Processing</span>
                      </TimelineStep>
                      <TimelineStep active={['ready', 'completed'].includes(order.status)}>
                        <TimelineDot active={['ready', 'completed'].includes(order.status)} />
                        <span>Ready</span>
                      </TimelineStep>
                      <TimelineStep active={order.status === 'completed'}>
                        <TimelineDot active={order.status === 'completed'} />
                        <span>Completed</span>
                      </TimelineStep>
                    </StatusTimeline>
                  </OrderStatus>
                </OrderHeader>

                <CollectionInfo>
                  <CollectionTitle>Collection Information</CollectionTitle>
                  <CollectionDetails>
                    <div><strong>Method:</strong> {order.collectionMethod}</div>
                    <div><strong>Date:</strong> {order.collectionDate}</div>
                    <div><strong>Time:</strong> {order.collectionTime}</div>
                    <div><strong>Preferred Name:</strong> {order.preferredName}</div>
                    {order.orderNotes && (
                      <div><strong>Notes:</strong> {order.orderNotes}</div>
                    )}
                  </CollectionDetails>
                </CollectionInfo>

                <OrderItems>
                  <ItemList>
                    {order.items.map((item, index) => (
                      <Item key={index}>
                        <ItemInfo>
                          <ItemImage 
                            src={item.image || '/placeholder-product.jpg'} 
                            alt={item.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <ItemDetails>
                            <ItemName>{item.name}</ItemName>
                            <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                          </ItemDetails>
                        </ItemInfo>
                        <ItemPrice>R{item.total.toFixed(2)}</ItemPrice>
                      </Item>
                    ))}
                  </ItemList>
                </OrderItems>

                <OrderTotal>
                  <TotalLabel>Total</TotalLabel>
                  <TotalAmount>R{order.total.toFixed(2)}</TotalAmount>
                </OrderTotal>

                {/* Action Buttons - Only show for admins */}
                {isAdmin && (
                  <ActionButtons onClick={(e) => e.stopPropagation()}>
                    {getStatusActions(order).map((action, index) => (
                      <ActionButton
                        key={index}
                        className={action.className}
                        onClick={action.action}
                      >
                        {action.label}
                      </ActionButton>
                    ))}
                  </ActionButtons>
                )}
              </OrderCard>
            ))}
          </OrdersGrid>
        )}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;
