import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';
import { RiSearchLine, RiCheckLine, RiCloseLine, RiTimer2Line, RiTruckLine, RiCheckboxCircleLine, RiAlertLine } from 'react-icons/ri';

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

/* Removed unused StatsGrid/StatCard/StatNumber/StatLabel to fix CI ESLint warnings */

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
  position: ${props => props.isAdmin ? 'sticky' : 'static'};
  top: ${props => props.isAdmin ? '80px' : 'auto'};
  z-index: 5;
`;

const SearchInputWrap = styled.div`
  display: ${props => props.isAdmin ? 'flex' : 'none'};
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 8px 12px;
  min-width: 260px;
  color: #e2e8f0;
`;

const SearchInput = styled.input`
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  width: 220px;
  font-size: 14px;
  ::placeholder { color: #a3b0c2; }
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
  gap: ${props => props.isAdmin ? '12px' : '32px'};
  margin-bottom: ${props => props.isAdmin ? '24px' : '48px'};
`;

const OrderCard = styled.div`
  background: ${props => props.isAdmin ? 
    'rgba(255, 255, 255, 0.05)' :
    'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
  };
  backdrop-filter: ${props => props.isAdmin ? 'blur(20px)' : 'none'};
  border-radius: ${props => props.isAdmin ? '12px' : '24px'};
  padding: ${props => props.isAdmin ? '14px 16px' : '40px'};
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
  display: grid;
  grid-template-columns: ${props => props.isAdmin ? '24px 1.4fr 0.8fr auto' : '1fr'};
  align-items: center;
  margin-bottom: ${props => props.isAdmin ? '0' : '20px'};
  gap: ${props => props.isAdmin ? '12px' : '16px'};
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    margin-bottom: 12px;
    gap: 12px;
    flex-direction: column;
    align-items: stretch;
  }
`;

const SelectCell = styled.div`
  display: ${props => props.isAdmin ? 'block' : 'none'};
`;

const RowCheckbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const OrderNumber = styled.h3`
  font-size: ${props => props.isAdmin ? '1rem' : '1.3rem'};
  font-weight: 600;
  color: ${props => props.isAdmin ? '#ffffff' : '#1e293b'};
  margin-bottom: ${props => props.isAdmin ? '2px' : '8px'};
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
  font-size: ${props => props.isAdmin ? '13px' : '16px'};
`;

const OrderTotalText = styled.p`
  color: ${props => props.isAdmin ? '#ffffff' : '#1e293b'};
  font-weight: 600;
  font-size: ${props => props.isAdmin ? '14px' : '16px'};
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Step = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid ${props => props.active ? '#10b981' : 'rgba(255,255,255,0.25)'};
  background: ${props => props.active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)'};
  color: ${props => props.active ? '#10b981' : '#e2e8f0'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #10b981; color: #10b981; transform: translateY(-1px); }
`;

const StepDivider = styled.div`
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: ${props => props.filled ? '#10b981' : 'rgba(255,255,255,0.25)'};
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
        case 'processing': return '#6366f1';
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
        case 'processing': return 'rgba(99, 102, 241, 0.3)';
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

/* Timeline components removed in compact admin view to reduce bundle and fix ESLint warnings */

const NotificationBanner = styled.div`
  background: ${props => props.isAdmin ? 'rgba(255, 255, 255, 0.06)' : (
    props.status === 'ready' || props.status === 'completed' ? '#dcfce7' : props.status === 'cancelled' ? '#fee2e2' : '#f0f9ff'
  )};
  border: ${props => props.isAdmin ? '1px solid rgba(255, 255, 255, 0.12)' : (
    props.status === 'ready' || props.status === 'completed' ? '1px solid #10b981' : props.status === 'cancelled' ? '1px solid #ef4444' : '1px solid #0ea5e9'
  )};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  backdrop-filter: ${props => props.isAdmin ? 'blur(16px)' : 'none'};
  color: ${props => props.isAdmin ? '#e2e8f0' : 'inherit'};
`;

const NotificationIcon = styled.span`
  font-size: 16px;
  display: inline-flex;
  align-items: center;
`;

const NotificationText = styled.div`
  color: ${props => props.isAdmin ? '#e2e8f0' : (
    props.status === 'ready' || props.status === 'completed' ? '#166534' : props.status === 'cancelled' ? '#991b1b' : '#0c4a6e'
  )};
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
  gap: 8px;
  flex-wrap: wrap;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 8px;
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 13px;
  
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

const IconAction = styled.button`
  padding: 8px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  color: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #10b981; color: #10b981; transform: translateY(-1px); }
`;

const BulkBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 12px;
  color: #e2e8f0;
`;

const BulkActions = styled.div`
  display: flex;
  gap: 8px;
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: ${props => props.isAdmin ? '#e2e8f0' : '#1f2937'};
`;

const Pager = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PagerButton = styled.button`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.isAdmin ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.2)'};
  background: ${props => props.isAdmin ? 'rgba(255,255,255,0.06)' : 'white'};
  color: inherit;
  cursor: pointer;
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const PerPageSelect = styled.select`
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid ${props => props.isAdmin ? 'rgba(255,255,255,0.2)' : 'rgba(16,185,129,0.2)'};
  background: ${props => props.isAdmin ? 'rgba(255,255,255,0.06)' : 'white'};
  color: inherit;
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
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState([]);
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

  // Persist and hydrate filters (admin)
  useEffect(() => {
    if (!isAdmin) return;
    try {
      const raw = localStorage.getItem('orders_filters');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.status) setStatusFilter(parsed.status);
        if (typeof parsed.perPage === 'number') setPerPage(parsed.perPage);
        if (typeof parsed.search === 'string') setSearch(parsed.search);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    const payload = { status: statusFilter, perPage, search };
    try { localStorage.setItem('orders_filters', JSON.stringify(payload)); } catch {}
  }, [isAdmin, statusFilter, perPage, search]);

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
      
      // Filter by status
      let filteredOrders = statusFilter === 'all' 
        ? allOrders 
        : allOrders.filter(order => order.status === statusFilter);
      
      // Search filter (by order number, customer name, email)
      const q = search.trim().toLowerCase();
      if (q) {
        filteredOrders = filteredOrders.filter(o => {
          const name = `${o.customerInfo?.firstName || ''} ${o.customerInfo?.lastName || ''}`.toLowerCase();
          const email = (o.customerInfo?.email || o.user?.email || '').toLowerCase();
          const num = (o.orderNumber || '').toLowerCase();
          return name.includes(q) || email.includes(q) || num.includes(q);
        });
      }
      
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
      setCurrentPage(1);
      
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
  }, [isAdmin, statusFilter, search, showError]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, statusFilter, search]);

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

  const statusIcon = useMemo(() => ({
    pending: <RiTimer2Line />, confirmed: <RiCheckLine />, processing: <RiTruckLine />, ready: <RiCheckboxCircleLine />, completed: <RiCheckboxCircleLine />, cancelled: <RiCloseLine />
  }), []);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(orders.length / perPage)), [orders.length, perPage]);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return orders.slice(start, start + perPage);
  }, [orders, currentPage, perPage]);

  const toggleSelected = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectAllOnPage = () => {
    const ids = pageSlice.map(o => o._id);
    setSelectedIds((prev) => Array.from(new Set([...prev, ...ids])));
  };

  const clearSelection = () => setSelectedIds([]);

  const bulkUpdate = async (newStatus) => {
    if (selectedIds.length === 0) return;
    try {
      await Promise.allSettled(selectedIds.map(id => api.put(`/api/orders/${id}/status`, { status: newStatus })));
      showSuccess(`Updated ${selectedIds.length} orders to ${newStatus}`, 'Bulk Update');
      clearSelection();
      fetchOrders();
    } catch (e) {
      showError('Bulk update failed for some orders', 'Bulk Update');
    }
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

        {/* Stats tiles removed from Orders page to avoid duplication with Admin Dashboard */}

        {/* Filter Bar - Show for admins or if user has orders */}
        {(isAdmin || stats.total > 0) && (
          <FilterBar isAdmin={isAdmin}>
            <SearchInputWrap isAdmin={isAdmin}>
              <RiSearchLine />
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders, customer, email"
                aria-label="Search orders"
              />
            </SearchInputWrap>
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
            {isAdmin && selectedIds.length > 0 && (
              <BulkBar>
                <div>{selectedIds.length} selected</div>
                <BulkActions>
                  <ActionButton className="primary" onClick={() => bulkUpdate('ready')}>Mark Ready</ActionButton>
                  <ActionButton className="primary" onClick={() => bulkUpdate('completed')}>Mark Completed</ActionButton>
                  <ActionButton className="danger" onClick={() => bulkUpdate('cancelled')}>Cancel</ActionButton>
                  <ActionButton className="secondary" onClick={clearSelection}>Clear</ActionButton>
                </BulkActions>
              </BulkBar>
            )}
          </FilterBar>
        )}

        {orders.length === 0 ? (
          <NoOrders>
            <h3>No orders found</h3>
            <p>{isAdmin ? 'Orders will appear here as customers place them' : 'Start shopping to see your orders here'}</p>
          </NoOrders>
        ) : (
          <OrdersGrid isAdmin={isAdmin}>
            {pageSlice.map(order => (
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
                  <SelectCell isAdmin={isAdmin}>
                    {isAdmin && (
                      <RowCheckbox
                        type="checkbox"
                        checked={selectedIds.includes(order._id)}
                        onChange={(e) => { e.stopPropagation(); toggleSelected(order._id); }}
                        onClick={(e) => e.stopPropagation()}
                        aria-label="Select order"
                      />
                    )}
                  </SelectCell>
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
                    <StatusBadge isAdmin={isAdmin} status={order.status} title={order.status}>
                      {statusIcon[order.status] || <RiAlertLine />} {order.status}
                    </StatusBadge>
                    {isAdmin && (
                      <div onClick={(e) => e.stopPropagation()}>
                        {getNextStatus(order.status) && (
                          <IconAction title={`Mark as ${getNextStatus(order.status)}`} onClick={() => updateOrderStatus(order._id, getNextStatus(order.status))}>
                            <RiCheckLine />
                          </IconAction>
                        )}
                        {order.status === 'pending' && (
                          <IconAction title="Cancel order" onClick={() => updateOrderStatus(order._id, 'cancelled')}>
                            <RiCloseLine />
                          </IconAction>
                        )}
                      </div>
                    )}
                  </OrderStatus>

                  {isAdmin && (
                    <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', marginTop: 8 }} onClick={(e) => e.stopPropagation()}>
                      <Stepper>
                        {['pending','confirmed','processing','ready','completed'].map((stage, idx, arr) => {
                          const active = arr.indexOf(order.status) >= idx;
                          const onClick = () => updateOrderStatus(order._id, stage);
                          return (
                            <React.Fragment key={stage}>
                              <Step type="button" active={active} title={stage} onClick={onClick}>{idx+1}</Step>
                              {idx < arr.length - 1 && (
                                <StepDivider filled={arr.indexOf(order.status) > idx} />
                              )}
                            </React.Fragment>
                          );
                        })}
                        <IconAction title="Cancel order" onClick={() => updateOrderStatus(order._id, 'cancelled')} style={{ marginLeft: 6 }}>
                          <RiCloseLine />
                        </IconAction>
                      </Stepper>
                    </div>
                  )}
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

                {/* Action Buttons - Only show for admins (kept, but compact icons above are primary) */}
                {isAdmin && getStatusActions(order).length > 0 && (
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

        {/* Pagination */}
        {(isAdmin || stats.total > 0) && orders.length > 0 && (
          <PaginationBar isAdmin={isAdmin}>
            <Pager>
              <PagerButton isAdmin={isAdmin} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</PagerButton>
              <span>Page {currentPage} of {totalPages}</span>
              <PagerButton isAdmin={isAdmin} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</PagerButton>
            </Pager>
            <div>
              <label htmlFor="perPage" style={{ marginRight: 8 }}>Per page</label>
              <PerPageSelect id="perPage" value={perPage} onChange={(e) => { setPerPage(parseInt(e.target.value)); setCurrentPage(1); }}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </PerPageSelect>
              {isAdmin && (
                <PagerButton style={{ marginLeft: 8 }} onClick={selectAllOnPage}>Select page</PagerButton>
              )}
            </div>
          </PaginationBar>
        )}
      </OrdersContent>
    </OrdersContainer>
  );
};

export default Orders;
