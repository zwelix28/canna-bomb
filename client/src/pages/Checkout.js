import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useNotification } from '../contexts/NotificationContext';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CheckoutContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #10b981 100%);
    z-index: 1;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 20px 0;
  }
`;

const CheckoutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const CheckoutHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.5px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
`;

const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const CheckoutForm = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const OrderSummary = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  height: fit-content;
  position: sticky;
  top: 100px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
    position: static;
    top: auto;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 24px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }
`;

const FormSection = styled.div`
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const FormLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 14px;
`;

const FormInput = styled.input`
  padding: 14px 16px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  font-size: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  &.error {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const FormSelect = styled.select`
  padding: 14px 16px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  font-size: 14px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  accent-color: #10b981;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #374151;
  cursor: pointer;
`;

const TipSection = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

const TipOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-top: 16px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin-top: 12px;
  }
`;

const TipButton = styled.button`
  padding: 14px 18px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  color: #0f172a;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #10b981;
    background: rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }
  
  &.selected {
    border-color: #10b981;
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 8px;
  }
`;

const CustomTipInput = styled.input`
  padding: 14px 16px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  border-radius: 10px;
  font-size: 14px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 10px 12px;
    font-size: 12px;
    border-radius: 8px;
  }
`;

const CollectionInfo = styled.div`
  background: #f0fdf4;
  border: 2px solid #10b981;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
`;

const CollectionTitle = styled.h3`
  color: #10b981;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CollectionText = styled.p`
  color: #065f46;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 0;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(16, 185, 129, 0.05);
    border-radius: 12px;
    padding: 16px 12px;
    margin: 0 -12px;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
  flex-shrink: 0;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 6px;
  line-height: 1.3;
`;

const ItemInfo = styled.p`
  color: #64748b;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 3px;
`;

const ItemPrice = styled.p`
  color: #0f172a;
  font-weight: 700;
  font-size: 15px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(226, 232, 240, 0.5);
  
  &:last-child {
    border-bottom: none;
    font-weight: 700;
    font-size: 16px;
    color: #0f172a;
    border-top: 2px solid rgba(16, 185, 129, 0.2);
    padding-top: 16px;
    margin-top: 8px;
  }
`;

const SummaryLabel = styled.span`
  color: #64748b;
  font-weight: 500;
`;

const SummaryValue = styled.span`
  color: #0f172a;
  font-weight: 600;
`;

const CheckoutActions = styled.div`
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-top: 32px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #475569 0%, #334155 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(100, 116, 139, 0.3);
  }
`;

const PlaceOrderButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #64748b;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 14px;
`;

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [formData, setFormData] = useState({
    // Collection Information
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    
    // Collection Details
    collectionMethod: 'walk-in',
    collectionDate: '',
    collectionTime: '',
    preferredName: '',
    
    // Tip and Notes
    tipAmount: 0,
    tipPercentage: 0,
    customTip: '',
    orderNotes: '',
    
    // Additional Information
    termsAccepted: false,
    marketingConsent: false
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const tipOptions = [
    { percentage: 0, label: 'No Tip' },
    { percentage: 10, label: '10%' },
    { percentage: 15, label: '15%' },
    { percentage: 18, label: '18%' },
    { percentage: 20, label: '20%' },
    { percentage: 25, label: '25%' }
  ];

  const collectionTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
    '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM'
  ];

  // Calculate tip and totals
  const subtotal = cart.total;
  const tipAmount = formData.tipPercentage > 0 ? (subtotal * formData.tipPercentage / 100) : parseFloat(formData.customTip) || 0;
  const total = subtotal + tipAmount;

  // Get today's date and next 7 days for collection date selection
  const getCollectionDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'short', 
          day: 'numeric' 
        })
      });
    }
    return dates;
  };

  useEffect(() => {
    // Auto-populate form with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        preferredName: user.firstName || ''
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Handle tip percentage change
    if (name === 'tipPercentage') {
      setFormData(prev => ({
        ...prev,
        tipPercentage: parseFloat(value),
        customTip: ''
      }));
    }

    // Handle custom tip change
    if (name === 'customTip') {
      setFormData(prev => ({
        ...prev,
        customTip: value,
        tipPercentage: 0
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'collectionDate', 'collectionTime'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Terms acceptance validation
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== CHECKOUT SUBMIT START ===');
    console.log('Form validation result:', validateForm());
    
    if (!validateForm()) {
      showError('Please fix the errors in the form', 'Form Validation Failed');
      return;
    }
    
    setLoading(true);
    
    try {
      // Debug cart structure
      console.log('Cart items:', cart.items);
      console.log('Cart total:', cart.total);
      console.log('User info:', user);
      
      // Validate cart items structure
      if (!cart.items || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }
      
      // Create order for collection
      const orderData = {
        items: cart.items.map(item => {
          // Validate item structure
          if (!item.product) {
            console.error('Invalid item structure:', item);
            throw new Error('Invalid cart item structure');
          }
          
          return {
            product: item.product._id,
            name: item.product.name,
            price: item.product.salePrice || item.product.price,
            quantity: item.quantity,
            category: item.product.category || 'Unknown',
            image: item.product.images && item.product.images.length > 0 ? item.product.images[0] : ''
          };
        }),
        subtotal,
        tip: tipAmount,
        total: total,
        paymentStatus: 'pending',
        paymentMethod: 'collection',
        collectionMethod: formData.collectionMethod,
        collectionDate: formData.collectionDate,
        collectionTime: formData.collectionTime,
        preferredName: formData.preferredName,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        orderNotes: formData.orderNotes,
        estimatedPickup: `${formData.collectionDate} at ${formData.collectionTime}`
      };
      
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const order = await response.json();
      
      console.log('Response data:', order);
      
      if (!response.ok) {
        throw new Error(order.message || order.error || 'Failed to create order');
      }
      
      console.log('Order created successfully:', order._id);
      
      // Success!
      setOrderSuccess(true);
      clearCart();
      showSuccess('Order placed successfully! We\'ll see you soon for pickup.', 'Order Confirmed');
      
      // Redirect to order confirmation
      setTimeout(() => {
        console.log('Redirecting to order:', order._id);
        navigate(`/orders/${order._id}`);
      }, 2000);
      
    } catch (error) {
      console.error('=== CHECKOUT ERROR ===');
      console.error('Checkout error:', error);
      console.error('Error message:', error.message);
      showError(error.message || 'Checkout failed. Please try again.', 'Checkout Failed');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.items.length === 0) {
      navigate('/cart');
    }
  }, [cart.items.length, navigate]);

  if (cart.items.length === 0) {
    return (
      <CheckoutContainer>
        <LoadingSpinner>Redirecting to cart...</LoadingSpinner>
      </CheckoutContainer>
    );
  }

  if (orderSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div style={{ fontSize: '4rem', marginBottom: '24px' }}>✅</div>
        <h2 style={{ fontSize: '2rem', fontWeight: '600', color: '#1e293b', marginBottom: '16px' }}>
          Order Placed Successfully!
        </h2>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '32px' }}>
          Thank you for your order. We\'ll see you soon for pickup!
        </p>
        <p style={{ color: '#10b981', fontSize: '1rem' }}>
          Redirecting to order details...
        </p>
      </div>
    );
  }

  return (
    <CheckoutContainer>
      <CheckoutContent>
        <CheckoutHeader>
          <Title>Checkout</Title>
          <Subtitle>Complete your order for pickup</Subtitle>
        </CheckoutHeader>
        
        <CheckoutGrid>
          <CheckoutForm>
            <form onSubmit={handleSubmit}>
              {/* Collection Information */}
              <FormSection>
                <SectionTitle>Collection Information</SectionTitle>
                
                <CollectionInfo>
                  <CollectionTitle>
                    🚶‍♂️ Walk-in & Collection Orders
                  </CollectionTitle>
                  <CollectionText>
                    All orders are for collection at our store. No shipping available. 
                    Please select your preferred pickup date and time.
                  </CollectionText>
                </CollectionInfo>
                
                <FormGrid>
                  <FormGroup>
                    <FormLabel>First Name *</FormLabel>
                    <FormInput
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Last Name *</FormLabel>
                    <FormInput
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Email *</FormLabel>
                    <FormInput
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Phone *</FormLabel>
                    <FormInput
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Preferred Name for Pickup</FormLabel>
                    <FormInput
                      type="text"
                      name="preferredName"
                      value={formData.preferredName}
                      onChange={handleInputChange}
                      placeholder="Name to call when order is ready"
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Collection Method</FormLabel>
                    <FormSelect
                      name="collectionMethod"
                      value={formData.collectionMethod}
                      onChange={handleInputChange}
                    >
                      <option value="walk-in">Walk-in (Immediate)</option>
                      <option value="pre-order">Pre-order (Scheduled)</option>
                    </FormSelect>
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Collection Date *</FormLabel>
                    <FormSelect
                      name="collectionDate"
                      value={formData.collectionDate}
                      onChange={handleInputChange}
                      className={errors.collectionDate ? 'error' : ''}
                    >
                      <option value="">Select Date</option>
                      {getCollectionDates().map(date => (
                        <option key={date.value} value={date.value}>
                          {date.label}
                        </option>
                      ))}
                    </FormSelect>
                    {errors.collectionDate && <ErrorMessage>{errors.collectionDate}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FormLabel>Collection Time *</FormLabel>
                    <FormSelect
                      name="collectionTime"
                      value={formData.collectionTime}
                      onChange={handleInputChange}
                      className={errors.collectionTime ? 'error' : ''}
                    >
                      <option value="">Select Time</option>
                      {collectionTimes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </FormSelect>
                    {errors.collectionTime && <ErrorMessage>{errors.collectionTime}</ErrorMessage>}
                  </FormGroup>
                </FormGrid>
              </FormSection>

              {/* Tip Section */}
              <FormSection>
                <SectionTitle>Add a Tip</SectionTitle>
                <TipSection>
                  <TipOptions>
                    {tipOptions.map(option => (
                      <TipButton
                        key={option.percentage}
                        type="button"
                        className={formData.tipPercentage === option.percentage ? 'selected' : ''}
                        onClick={() => handleInputChange({
                          target: { name: 'tipPercentage', value: option.percentage }
                        })}
                      >
                        {option.label}
                      </TipButton>
                    ))}
                  </TipOptions>
                  
                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <FormLabel>Or enter custom tip amount (R)</FormLabel>
                    <CustomTipInput
                      type="number"
                      name="customTip"
                      value={formData.customTip}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      style={{ width: '120px' }}
                    />
                  </div>
                </TipSection>
              </FormSection>

              {/* Order Notes */}
              <FormSection>
                <SectionTitle>Order Notes</SectionTitle>
                <FormGroup>
                  <FormLabel>Special Instructions (Optional)</FormLabel>
                  <textarea
                    name="orderNotes"
                    value={formData.orderNotes}
                    onChange={handleInputChange}
                    placeholder="Any special requests, preparation preferences, or additional notes..."
                    style={{
                      padding: '12px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      minHeight: '80px',
                      resize: 'vertical',
                      width: '100%',
                      fontFamily: 'inherit'
                    }}
                  />
                </FormGroup>
              </FormSection>

              {/* Additional Information */}
              <FormSection>
                <SectionTitle>Additional Information</SectionTitle>
                
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    checked={formData.marketingConsent}
                    onChange={handleInputChange}
                  />
                  <CheckboxLabel htmlFor="marketingConsent">
                    I would like to receive updates about new products and special offers
                  </CheckboxLabel>
                </CheckboxGroup>
                
                <CheckboxGroup>
                  <Checkbox
                    type="checkbox"
                    id="termsAccepted"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    className={errors.termsAccepted ? 'error' : ''}
                  />
                  <CheckboxLabel htmlFor="termsAccepted">
                    I agree to the <a href="/terms" target="_blank" style={{ color: '#10b981' }}>Terms and Conditions</a> and <a href="/privacy" target="_blank" style={{ color: '#10b981' }}>Privacy Policy</a> *
                  </CheckboxLabel>
                  {errors.termsAccepted && <ErrorMessage>{errors.termsAccepted}</ErrorMessage>}
                </CheckboxGroup>
              </FormSection>

              {/* Checkout Actions */}
              <CheckoutActions>
                <BackButton type="button" onClick={() => navigate('/cart')}>
                  Back to Cart
                </BackButton>
                <PlaceOrderButton type="submit" disabled={loading}>
                  {loading ? 'Processing...' : `Place Order - R${total.toFixed(2)}`}
                </PlaceOrderButton>
              </CheckoutActions>
            </form>
          </CheckoutForm>

          <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            
            {/* Order Items */}
            {cart.items.map((item, index) => (
              <OrderItem key={index}>
                <ItemImage 
                  src={item.product.images[0] || '/placeholder-product.jpg'} 
                  alt={item.product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
                <ItemDetails>
                  <ItemName>{item.product.name}</ItemName>
                  <ItemInfo>Qty: {item.quantity}</ItemInfo>
                  <ItemInfo>Category: {item.product.category}</ItemInfo>
                </ItemDetails>
                <ItemPrice>R{((item.product.salePrice || item.product.price) * item.quantity).toFixed(2)}</ItemPrice>
              </OrderItem>
            ))}
            
            {/* Order Totals */}
            <SummaryRow>
              <SummaryLabel>Subtotal ({cart.itemCount} items)</SummaryLabel>
              <SummaryValue>R{subtotal.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Tip</SummaryLabel>
              <SummaryValue>R{tipAmount.toFixed(2)}</SummaryValue>
            </SummaryRow>
            <SummaryRow>
              <SummaryLabel>Total</SummaryLabel>
              <SummaryValue>R{total.toFixed(2)}</SummaryValue>
            </SummaryRow>
            
            {/* Collection Info */}
            {formData.collectionDate && formData.collectionTime && (
              <div style={{ 
                marginTop: '20px', 
                padding: '16px', 
                background: '#f0fdf4', 
                borderRadius: '8px',
                border: '1px solid #10b981'
              }}>
                <p style={{ 
                  color: '#065f46', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  margin: '0 0 8px 0' 
                }}>
                  📅 Pickup Scheduled
                </p>
                <p style={{ 
                  color: '#065f46', 
                  fontSize: '13px', 
                  margin: '0',
                  lineHeight: '1.4'
                }}>
                  {new Date(formData.collectionDate).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })} at {formData.collectionTime}
                </p>
              </div>
            )}
          </OrderSummary>
        </CheckoutGrid>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
