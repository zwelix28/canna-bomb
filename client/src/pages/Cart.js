import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

const CartContainer = styled.div`
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 50%, #f1f5f9 100%);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 20px 0;
  }
`;

const CartContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const CartHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    margin-bottom: 24px;
  }
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 700;
  background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
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
  font-weight: 400;
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.5;
`;

const CartLayout = styled.div`
  display: grid;
  grid-template-columns: 1.8fr 1fr;
  gap: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

const CartItems = styled.div`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 16px;
  }
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto auto;
  gap: 20px;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid rgba(16, 185, 129, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background: rgba(16, 185, 129, 0.03);
    border-radius: 16px;
    padding: 20px 16px;
    margin: 0 -16px;
    transform: translateY(-2px);
  }
  
  /* Mobile PWA optimizations - Invisible grid for perfect alignment */
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    gap: 8px;
    padding: 16px 0;
    align-items: start;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
    border-radius: 8px;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  /* Mobile PWA optimizations - Grid positioning */
  @media (max-width: 768px) {
    gap: 4px;
    grid-column: 2;
    grid-row: 1;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
  line-height: 1.3;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 0.95rem;
    line-height: 1.2;
    flex: 1;
  }
`;

const ItemCategory = styled.span`
  color: #10b981;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 10px;
    letter-spacing: 0.3px;
  }
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ItemPrice = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  
  /* Hide individual price on mobile PWA to avoid duplication */
  @media (max-width: 768px) {
    display: none;
  }
`;

const ItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  /* Mobile PWA optimizations - Grid positioning */
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: center;
    margin-top: 8px;
    gap: 6px;
  }
`;

const QuantityButton = styled.button`
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  color: #10b981;
  
  &:hover {
    background: #10b981;
    color: white;
    border-color: #10b981;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 6px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 40px;
    padding: 4px;
    font-size: 12px;
    border-radius: 6px;
  }
`;

const ItemTotal = styled.div`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  text-align: right;
  
  /* Mobile PWA optimizations - Grid positioning */
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    grid-row: 3;
    text-align: center;
    margin-top: 8px;
    font-size: 1rem;
  }
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: #f87171;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    color: #ef4444;
    text-decoration: underline;
  }
  
  /* Mobile PWA optimizations - Right side positioning */
  @media (max-width: 768px) {
    font-size: 11px;
    padding: 2px 0;
    margin-left: 8px;
    flex-shrink: 0;
  }
`;

const CartSummary = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
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
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%);
  }
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(16, 185, 129, 0.08);
  
  &:last-child {
    border-bottom: none;
    font-weight: 700;
    font-size: 1.2rem;
    color: #0f172a;
    margin-top: 8px;
    padding-top: 16px;
    border-top: 2px solid rgba(16, 185, 129, 0.15);
  }
`;

const SummaryLabel = styled.span`
  color: #64748b;
  font-weight: 500;
  font-size: 14px;
`;

const SummaryValue = styled.span`
  color: #0f172a;
  font-weight: 600;
  font-size: 14px;
`;

const CheckoutButton = styled(Link)`
  display: block;
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  text-align: center;
  padding: 16px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  margin-top: 24px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #64748b;
  
  h2 {
    font-size: 2.2rem;
    font-weight: 600;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #0f172a 0%, #10b981 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  p {
    font-size: 1.1rem;
    margin-bottom: 32px;
    line-height: 1.5;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  padding: 16px 32px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.25);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.35);
  }
`;

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const { showSuccess, showError } = useNotification();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(productId));
    
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      showError('Failed to update quantity', 'Update Failed');
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      showSuccess('Item removed from cart', 'Removed from Cart');
    } catch (error) {
      showError('Failed to remove item', 'Remove Failed');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
        showSuccess('Cart cleared successfully', 'Cart Cleared');
      } catch (error) {
        showError('Failed to clear cart', 'Clear Cart Failed');
      }
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <CartContainer>
        <CartContent>
          <EmptyCart>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <ContinueShoppingButton to="/products">
              Continue Shopping
            </ContinueShoppingButton>
          </EmptyCart>
        </CartContent>
      </CartContainer>
    );
  }

  const subtotal = cart.total;
  const total = subtotal;

  return (
    <CartContainer>
      <CartContent>
        <CartHeader>
          <Title>Shopping Cart</Title>
          <Subtitle>Review your items and proceed to checkout</Subtitle>
        </CartHeader>

        <CartLayout>
          <CartItems>
            {cart.items.map((item) => (
              <CartItem key={item.product._id}>
                <ItemImage 
                  src={item.product.images[0] || '/placeholder-product.jpg'} 
                  alt={item.product.name}
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
                
                <ItemInfo>
                  <ProductDetails>
                    <ItemName>{item.product.name}</ItemName>
                    <ItemCategory>{item.product.category}</ItemCategory>
                  </ProductDetails>
                  <RemoveButton onClick={() => handleRemoveItem(item.product._id)}>
                    Remove
                  </RemoveButton>
                </ItemInfo>
                
                <ItemPrice>R{item.price.toFixed(2)}</ItemPrice>
                
                <ItemQuantity>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || updatingItems.has(item.product._id)}
                  >
                    -
                  </QuantityButton>
                  
                  <QuantityInput
                    type="number"
                    min="1"
                    max={item.product.stockQuantity}
                    value={item.quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (value > 0 && value <= item.product.stockQuantity) {
                        handleQuantityChange(item.product._id, value);
                      }
                    }}
                    disabled={updatingItems.has(item.product._id)}
                  />
                  
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stockQuantity || updatingItems.has(item.product._id)}
                  >
                    +
                  </QuantityButton>
                </ItemQuantity>
                
                <ItemTotal>R{(item.price * item.quantity).toFixed(2)}</ItemTotal>
              </CartItem>
            ))}
            
            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <button
                onClick={handleClearCart}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  textDecoration: 'underline',
                  transition: 'color 0.3s ease',
                  padding: '8px 0'
                }}
                onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                onMouseLeave={(e) => e.target.style.color = '#f87171'}
              >
                Clear Cart
              </button>
            </div>
          </CartItems>

          <CartSummary>
            <SummaryTitle>Order Summary</SummaryTitle>
            
            <SummaryRow>
              <SummaryLabel>Total ({cart.itemCount} items)</SummaryLabel>
              <SummaryValue>R{total.toFixed(2)}</SummaryValue>
            </SummaryRow>

            <CheckoutButton to="/checkout">
              Proceed to Checkout
            </CheckoutButton>
            
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link 
                to="/products"
                style={{
                  color: '#10b981',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: '500',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#059669'}
                onMouseLeave={(e) => e.target.style.color = '#10b981'}
              >
                Continue Shopping
              </Link>
            </div>
          </CartSummary>
        </CartLayout>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;
