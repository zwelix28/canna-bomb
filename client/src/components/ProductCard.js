import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';

const Card = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #fbfffd 60%, #f2fff8 100%);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 22px rgba(16, 185, 129, 0.12);
  border: 2px solid #ffffff;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 22px 44px rgba(16, 185, 129, 0.18);
    border-color: #d6ffe9;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(16, 185, 129, 0.12);
    }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(52, 211, 153, 0.05) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  background: transparent;
  transition: transform 0.4s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const SaleBadge = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
  z-index: 2;
`;

const Content = styled.div`
  padding: 20px;
  position: relative;
  z-index: 2;
`;

const Category = styled.div`
  color: #10b981;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 10px;
`;

const Title = styled(Link)`
  color: #0f172a;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  margin-bottom: 10px;
  display: block;
  line-height: 1.3;
  
  &:hover {
    color: #10b981;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 8px;
    line-height: 1.2;
  }
`;

const Description = styled.p`
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 12px;
    -webkit-line-clamp: 1;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const SalePrice = styled.span`
  font-size: 1.2rem;
  font-weight: 800;
  color: #ef4444;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 500;
`;

const ProductInfo = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 11px;
  color: #64748b;
  
  /* Hide on mobile PWA for cleaner look */
  @media (max-width: 768px) {
    display: none;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 3px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #12d8a5 0%, #10b981 60%, #0ea97a 100%);
  color: white;
  border: none;
  padding: 12px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 18px rgba(16, 185, 129, 0.35);
  
  &:hover {
    background: linear-gradient(135deg, #10b981 0%, #0ea97a 50%, #0d8f68 100%);
    transform: translateY(-2px);
    box-shadow: 0 10px 24px rgba(16, 185, 129, 0.4);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SimplifiedPriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
  justify-content: flex-start;
`;

const SimplifiedContent = styled.div`
  padding: 20px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
`;

const QuantityButton = styled.button`
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    color: white;
    border-color: #10b981;
    transform: scale(1.05);
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 6px;
  padding: 6px;
  font-size: 13px;
  font-weight: 600;
  background: #f8fafc;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
  }
`;

const ProductCard = ({ product, simplified = false }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product._id, quantity);
    setAddingToCart(false);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleQuantityIncrement = () => {
    if (quantity < product.stockQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const isOnSale = product.salePrice && product.salePrice < product.price;

  if (simplified) {
    return (
      <Card>
        <ImageContainer>
          <ProductImage 
            src={product.images[0] || '/placeholder-product.svg'} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              // Prevent infinite onError loop and set correct placeholder
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder-product.svg';
            }}
          />
          {isOnSale && (
            <SaleBadge>
              {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
            </SaleBadge>
          )}
        </ImageContainer>
        
        <SimplifiedContent>
          <Category>{product.category}</Category>
          <Title to={`/products/${product._id}`}>{product.name}</Title>
          <Description>{product.description}</Description>
          
          <SimplifiedPriceSection>
            {isOnSale ? (
              <>
                <SalePrice>R{product.salePrice.toFixed(2)}</SalePrice>
                <OriginalPrice>R{product.price.toFixed(2)}</OriginalPrice>
              </>
            ) : (
              <Price>R{product.price.toFixed(2)}</Price>
            )}
          </SimplifiedPriceSection>
          
          <AddToCartButton
            onClick={handleAddToCart}
            disabled={addingToCart || product.stockQuantity === 0}
          >
            {addingToCart ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </AddToCartButton>
        </SimplifiedContent>
      </Card>
    );
  }

  return (
    <Card>
      <ImageContainer>
        <ProductImage 
          src={product.images[0] || '/placeholder-product.svg'} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            // Prevent infinite onError loop and set correct placeholder
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/placeholder-product.svg';
          }}
        />
        {isOnSale && (
          <SaleBadge>
            {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
          </SaleBadge>
        )}
      </ImageContainer>
      
      <Content>
        <Category>{product.category}</Category>
        <Title to={`/products/${product._id}`}>{product.name}</Title>
        <Description>{product.description}</Description>
        
        <ProductInfo>
          {product.thcContent && (
            <InfoItem>
              <span>THC:</span>
              <span>{product.thcContent}%</span>
            </InfoItem>
          )}
          {product.cbdContent && (
            <InfoItem>
              <span>CBD:</span>
              <span>{product.cbdContent}%</span>
            </InfoItem>
          )}
          <InfoItem>
            <span>Stock:</span>
            <span>{product.stockQuantity}</span>
          </InfoItem>
        </ProductInfo>
        
        <PriceSection>
          {isOnSale ? (
            <>
              <SalePrice>R{product.salePrice.toFixed(2)}</SalePrice>
              <OriginalPrice>R{product.price.toFixed(2)}</OriginalPrice>
            </>
          ) : (
            <Price>R{product.price.toFixed(2)}</Price>
          )}
        </PriceSection>
        
        <QuantitySelector>
          <QuantityButton onClick={handleQuantityDecrement}>-</QuantityButton>
          <QuantityInput
            type="number"
            min="1"
            max={product.stockQuantity}
            value={quantity}
            onChange={handleQuantityChange}
          />
          <QuantityButton onClick={handleQuantityIncrement}>+</QuantityButton>
        </QuantitySelector>
        
        <AddToCartButton
          onClick={handleAddToCart}
          disabled={addingToCart || product.stockQuantity === 0}
        >
          {addingToCart ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </AddToCartButton>
      </Content>
    </Card>
  );
};

export default ProductCard;
