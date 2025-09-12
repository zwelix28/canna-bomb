import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { useNotification } from '../contexts/NotificationContext';
import { useAuth } from '../contexts/AuthContext';

const OrderDetailContainer = styled.div`
  min-height: 100vh;
  padding: 24px 0;
  background: #f8fafc;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px 0;
  }
`;

const OrderDetailContent = styled.div`
  max-width: 814px;
  margin: 0 auto;
  padding: 0 16px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 0 12px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #10b981;
  font-size: 19px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 19px;
  padding: 0;
  
  &:hover {
    color: #059669;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 12px;
    gap: 6px;
  }
`;

const OrderHeader = styled.div`
  background: white;
  border-radius: 10px;
  padding: 26px;
  margin-bottom: 19px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

const OrderTitle = styled.h1`
  font-size: 1.63rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }
`;

const OrderMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
  margin-bottom: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const MetaItem = styled.div`
  text-align: center;
`;

const MetaLabel = styled.p`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 7px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

const MetaValue = styled.p`
  color: #1e293b;
  font-weight: 600;
  font-size: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 6px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 8px;
    gap: 6px;
  }
`;

const StatusBadge = styled.span`
  padding: 7px 14px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 11px;
    border-radius: 12px;
  }
  
  &.pending {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.confirmed {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.processing {
    background: #dbeafe;
    color: #1e40af;
  }
  
  &.ready {
    background: #dcfce7;
    color: #166534;
  }
  
  &.completed {
    background: #dcfce7;
    color: #166534;
  }
  
  &.cancelled {
    background: #fee2e2;
    color: #991b1b;
  }
`;


const OrderGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 19px;
  margin-bottom: 19px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 12px;
  }
`;

const OrderItemsSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const OrderSummarySection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 26px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.22rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 19px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const ItemImage = styled.img`
  width: 66px;
  height: 66px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 6px;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 7px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 4px;
  }
`;

const ItemInfo = styled.p`
  color: #64748b;
  font-size: 11px;
  margin-bottom: 2px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const ItemPrice = styled.p`
  color: #1e293b;
  font-weight: 600;
  font-size: 15px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 9px 0;
  border-bottom: 1px solid #e2e8f0;
  
  &:last-child {
    border-bottom: none;
    font-weight: 600;
    font-size: 15px;
    color: #1e293b;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 6px 0;
    
    &:last-child {
      font-size: 13px;
    }
  }
`;

const SummaryLabel = styled.span`
  color: #64748b;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SummaryValue = styled.span`
  color: #1e293b;
  font-weight: 500;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const CollectionSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 26px;
  margin-bottom: 19px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

const CollectionTimeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const TimelineItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  position: relative;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 8px;
  }
  
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    left: 12px;
    top: 24px;
    width: 2px;
    height: 14px;
    background: ${props => props.active ? '#10b981' : '#e2e8f0'};
  }
`;

const TimelineContent = styled.div`
  flex: 1;
  padding: 14px;
  background: ${props => props.active ? '#f0fdf4' : '#f8fafc'};
  border-radius: 8px;
  border-left: 5px solid ${props => props.active ? '#10b981' : '#e2e8f0'};
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 10px;
    border-left: 3px solid ${props => props.active ? '#10b981' : '#e2e8f0'};
  }
`;

const TimelineTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 7px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

const TimelineDate = styled.p`
  color: #64748b;
  font-size: 11px;
  margin-bottom: 7px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 10px;
    margin-bottom: 4px;
  }
`;

const TimelineDescription = styled.p`
  color: #64748b;
  font-size: 11px;
  line-height: 1.5;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const TimelineDot = styled.div`
  width: 33px;
  height: 33px;
  border-radius: 50%;
  background: ${props => props.active ? '#10b981' : '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.active ? 'white' : '#64748b'};
  font-weight: 600;
  flex-shrink: 0;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 11px;
  }
`;

const CustomerSection = styled.div`
  background: white;
  border-radius: 10px;
  padding: 26px;
  margin-bottom: 19px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
    border-radius: 8px;
  }
`;

const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const AddressCard = styled.div`
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 12px;
  }
`;

const AddressTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 9px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
  }
`;

const AddressText = styled.p`
  color: #64748b;
  font-size: 11px;
  margin-bottom: 2px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 14px;
  justify-content: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  padding: 9px 19px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 12px 16px;
    font-size: 13px;
    width: 100%;
  }
  
  &.primary {
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.secondary {
    background: #64748b;
    color: white;
    
    &:hover {
      background: #475569;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 36px 12px;
  color: #64748b;
`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError, showInfo } = useNotification();
  
  const isAdmin = user?.role === 'admin';

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      console.log('=== FETCHING ORDER DETAIL START ===');
      console.log('Order ID:', id);
      console.log('User authenticated:', isAuthenticated);
      console.log('Token available:', !!localStorage.getItem('token'));
      
      const response = await api.get(`/api/orders/${id}`);
      console.log('Order detail response:', response);
      console.log('Order detail response data:', response.data);
      console.log('Response status:', response.status);
      
      setOrder(response.data);
      console.log('Order set successfully:', response.data._id);
      console.log('=== FETCHING ORDER DETAIL SUCCESS ===');
    } catch (error) {
      console.error('=== FETCHING ORDER DETAIL ERROR ===');
      console.error('Error fetching order:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error status:', error.response?.status);
      
      showError('Failed to fetch order details', 'Error');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && id) {
      fetchOrder();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, id]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await api.put(`/api/orders/${id}/cancel`);
        showSuccess('Order cancelled successfully', 'Order Cancelled');
        fetchOrder();
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to cancel order';
        showError(message, 'Error');
      }
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      await api.put(`/api/orders/${id}/status`, { status: newStatus });
      showSuccess(`Order status updated to ${newStatus}`, 'Status Updated');
      fetchOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      showError('Failed to update order status', 'Update Failed');
    }
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
        action: () => updateOrderStatus(nextStatus),
        className: 'primary'
      });
    }
    
    if (order.status === 'pending' && isAdmin) {
      actions.push({
        label: 'Cancel Order',
        action: () => updateOrderStatus('cancelled'),
        className: 'danger'
      });
    }
    
    return actions;
  };

  const getStatusColor = (status) => {
    const statusMap = {
      'pending': 'pending',
      'confirmed': 'confirmed',
      'processing': 'processing',
      'ready': 'ready',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || status || 'unknown';
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

  const formatCollectionDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCollectionTimelineSteps = () => {
    const steps = [
      {
        title: 'Order Placed',
        description: 'Your order has been received and confirmed',
        date: order?.createdAt,
        active: true,
        icon: '📋'
      },
      {
        title: 'Processing',
        description: 'Your order is being prepared for pickup',
        date: order?.status === 'processing' || order?.status === 'ready' || order?.status === 'completed' ? order?.createdAt : null,
        active: order?.status === 'processing' || order?.status === 'ready' || order?.status === 'completed',
        icon: '⚙️'
      },
      {
        title: 'Ready for Pickup',
        description: 'Your order is ready for collection',
        date: order?.status === 'ready' || order?.status === 'completed' ? order?.updatedAt : null,
        active: order?.status === 'ready' || order?.status === 'completed',
        icon: '✅'
      },
      {
        title: 'Completed',
        description: 'Your order has been collected',
        date: order?.status === 'completed' ? order?.updatedAt : null,
        active: order?.status === 'completed',
        icon: '🎉'
      }
    ];

    if (order?.status === 'cancelled') {
      steps.push({
        title: 'Cancelled',
        description: 'Your order has been cancelled',
        date: order?.updatedAt,
        active: true,
        icon: '❌'
      });
    }

    return steps;
  };

  if (!isAuthenticated) {
    return (
      <OrderDetailContainer>
        <OrderDetailContent>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1>Access Denied</h1>
            <p>Please log in to view order details.</p>
          </div>
        </OrderDetailContent>
      </OrderDetailContainer>
    );
  }

  if (loading) {
    return (
      <OrderDetailContainer>
        <LoadingSpinner>Loading order details...</LoadingSpinner>
      </OrderDetailContainer>
    );
  }

  if (!order) {
    return (
      <OrderDetailContainer>
        <OrderDetailContent>
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h1>Order Not Found</h1>
            <p>The order you're looking for doesn't exist.</p>
          </div>
        </OrderDetailContent>
      </OrderDetailContainer>
    );
  }

  return (
    <OrderDetailContainer>
      <OrderDetailContent>
        <BackButton onClick={() => navigate('/orders')}>
          ← Back to Orders
        </BackButton>

        <OrderHeader>
          <OrderTitle>Order #{order.orderNumber}</OrderTitle>
          
          <OrderMeta>
            <MetaItem>
              <MetaLabel>Order Date</MetaLabel>
              <MetaValue>{formatDate(order.createdAt)}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Total Items</MetaLabel>
              <MetaValue>{order.items.length}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Payment Method</MetaLabel>
              <MetaValue>{order.paymentMethod === 'collection' ? 'Collection Payment' : order.paymentMethod}</MetaValue>
            </MetaItem>
            <MetaItem>
              <MetaLabel>Collection Method</MetaLabel>
              <MetaValue>{order.collectionMethod === 'walk-in' ? 'Walk-in' : 'Pre-order'}</MetaValue>
            </MetaItem>
          </OrderMeta>

          <OrderStatus>
            <StatusBadge className={getStatusColor(order.status)}>
              {order.status}
            </StatusBadge>
          </OrderStatus>
        </OrderHeader>

        <OrderGrid>
          <OrderItemsSection>
            <SectionTitle>Order Items</SectionTitle>
            {order.items.map((item, index) => (
              <OrderItem key={index}>
                <ItemImage 
                  src={item.image || '/placeholder-product.jpg'} 
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemInfo>Category: {item.category}</ItemInfo>
                  <ItemInfo>Quantity: {item.quantity}</ItemInfo>
                  <ItemInfo>Price per item: R{item.price.toFixed(2)}</ItemInfo>
                </ItemDetails>
                <ItemPrice>R{(item.price * item.quantity).toFixed(2)}</ItemPrice>
              </OrderItem>
            ))}
          </OrderItemsSection>

          <OrderSummarySection>
            <SectionTitle>Order Summary</SectionTitle>
            <SummaryRow>
              <SummaryLabel>Subtotal</SummaryLabel>
              <SummaryValue>R{order.subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Tax</SummaryLabel>
              <SummaryValue>R{order.tax.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Tip</SummaryLabel>
              <SummaryValue>R{order.tip ? order.tip.toFixed(2) : '0.00'}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>R{order.total.toFixed(2)}</SummaryValue>
            </SummaryRow>
          </OrderSummarySection>
        </OrderGrid>

        {/* Collection Information */}
        {order.collectionDate && order.collectionTime && (
          <CollectionSection>
            <SectionTitle>Collection Information</SectionTitle>
            <CollectionTimeline>
              {getCollectionTimelineSteps().map((step, index) => (
                <TimelineItem 
                  key={index} 
                  active={step.active}
                  last={index === getCollectionTimelineSteps().length - 1}
                >
                  <TimelineDot active={step.active}>
                    {step.icon}
                  </TimelineDot>
                  <TimelineContent active={step.active}>
                    <TimelineTitle>{step.title}</TimelineTitle>
                    {step.date && (
                      <TimelineDate>{formatDate(step.date)}</TimelineDate>
                    )}
                    <TimelineDescription>{step.description}</TimelineDescription>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </CollectionTimeline>
            
            <div style={{ 
              marginTop: '24px', 
              padding: '20px', 
              background: '#f0fdf4', 
              borderRadius: '8px', 
              borderLeft: '4px solid #10b981' 
            }}>
              <h4 style={{ color: '#065f46', marginBottom: '8px' }}>🚶‍♂️ Pickup Details</h4>
              <p style={{ color: '#065f46', fontSize: '16px', marginBottom: '4px' }}>
                <strong>Date:</strong> {formatCollectionDate(order.collectionDate)}
              </p>
              <p style={{ color: '#065f46', fontSize: '16px', marginBottom: '4px' }}>
                <strong>Time:</strong> {order.collectionTime}
              </p>
              {order.preferredName && (
                <p style={{ color: '#065f46', fontSize: '16px' }}>
                  <strong>Name for pickup:</strong> {order.preferredName}
                </p>
              )}
            </div>
          </CollectionSection>
        )}

        {/* Customer Information - Show for admins or if customerInfo exists */}
        {(isAdmin || order.customerInfo) && (
          <CustomerSection>
            <SectionTitle>{isAdmin ? 'Customer Information' : 'Your Information'}</SectionTitle>
            <AddressGrid>
              <AddressCard>
                <AddressTitle>Customer Details</AddressTitle>
                {order.customerInfo ? (
                  <>
                    <AddressText>Name: {order.customerInfo.firstName} {order.customerInfo.lastName}</AddressText>
                    <AddressText>Email: {order.customerInfo.email}</AddressText>
                    <AddressText>Phone: {order.customerInfo.phone}</AddressText>
                  </>
                ) : order.user ? (
                  <>
                    <AddressText>Name: {order.user.firstName} {order.user.lastName}</AddressText>
                    <AddressText>Email: {order.user.email}</AddressText>
                  </>
                ) : (
                  <AddressText>Customer information not available</AddressText>
                )}
              </AddressCard>
              
              {order.orderNotes && (
                <AddressCard>
                  <AddressTitle>Order Notes</AddressTitle>
                  <AddressText>{order.orderNotes}</AddressText>
                </AddressCard>
              )}
            </AddressGrid>
          </CustomerSection>
        )}

        <OrderActions>
          {/* Admin Actions */}
          {isAdmin && getStatusActions(order).map((action, index) => (
            <ActionButton
              key={index}
              className={action.className}
              onClick={action.action}
            >
              {action.label}
            </ActionButton>
          ))}
          
          {/* Regular User Actions */}
          {!isAdmin && order.status === 'pending' && (
            <ActionButton 
              className="danger"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </ActionButton>
          )}
          
          {!isAdmin && order.status === 'completed' && (
            <ActionButton 
              className="secondary"
              onClick={() => {
                // TODO: Implement reorder functionality
                showInfo('Reorder functionality coming soon!', 'Coming Soon');
              }}
            >
              Reorder
            </ActionButton>
          )}
          
          <ActionButton 
            className="primary"
            onClick={() => navigate(isAdmin ? '/orders' : '/products')}
          >
            {isAdmin ? 'Back to Orders' : 'Continue Shopping'}
          </ActionButton>
        </OrderActions>
      </OrderDetailContent>
    </OrderDetailContainer>
  );
};

export default OrderDetail;
