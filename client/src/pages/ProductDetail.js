import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import styled from 'styled-components';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';

const ProductDetailContainer = styled.div`
  min-height: 100vh;
  padding: 20px 0;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 10px 0;
  }
`;

const ProductContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }
`;

const ImageSection = styled.div`
  position: sticky;
  top: 100px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    position: static;
  }
`;

const MainImage = styled.img`
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    height: 250px;
    border-radius: 8px;
    margin-bottom: 16px;
  }
`;

const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: border-color 0.2s ease;
  
  &.active {
    border-color: #10b981;
  }
  
  &:hover {
    border-color: #10b981;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    height: 60px;
    border-radius: 6px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ProductHeader = styled.div`
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding-bottom: 16px;
  }
`;

const Category = styled.div`
  color: #10b981;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 12px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 8px;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.2;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 12px;
    line-height: 1.3;
  }
`;

const Brand = styled.div`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 16px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 12px;
  }
`;

const PriceSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }
`;

const Price = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SalePrice = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: #ef4444;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #94a3b8;
  text-decoration: line-through;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const SaleBadge = styled.div`
  background: #ef4444;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
  }
`;

const Description = styled.div`
  color: #374151;
  line-height: 1.7;
  font-size: 1.1rem;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const ProductSpecs = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 24px 0;
  
  /* Hide on mobile PWA - use MobileSpecsGrid instead */
  @media (max-width: 768px) {
    display: none;
  }
`;

const SpecItem = styled.div`
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  
  h4 {
    color: #64748b;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    text-transform: uppercase;
  }
  
  p {
    color: #1e293b;
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 12px;
    border-radius: 6px;
    
    h4 {
      font-size: 12px;
      margin-bottom: 6px;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

/* Mobile PWA Data Grid for Product Specs */
const MobileSpecsGrid = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin: 12px 0;
    width: 100%;
  }
`;

const MobileSpecItem = styled.div`
  background: #f8fafc;
  padding: 10px 8px;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #e2e8f0;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  .spec-label {
    color: #64748b;
    font-size: 10px;
    font-weight: 500;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .spec-value {
    color: #1e293b;
    font-weight: 600;
    font-size: 13px;
    line-height: 1.2;
  }
`;

const EffectsAndFlavors = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const EffectsSection = styled.div`
  h3 {
    color: #1e293b;
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 12px;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    h3 {
      font-size: 1rem;
      margin-bottom: 8px;
    }
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const Tag = styled.span`
  background: #e2e8f0;
  color: #374151;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 12px;
    border-radius: 16px;
  }
`;

const PurchaseSection = styled.div`
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding-top: 16px;
  }
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 12px;
    margin-bottom: 16px;
  }
`;

const QuantityLabel = styled.label`
  font-weight: 500;
  color: #374151;
  font-size: 16px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const QuantityButton = styled.button`
  background: #f1f5f9;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 18px;
  transition: background-color 0.2s ease;
  
  &:hover {
    background: #e2e8f0;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
    font-size: 16px;
    border-radius: 6px;
  }
`;

const QuantityInput = styled.input`
  width: 60px;
  text-align: center;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px;
  font-size: 16px;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: #10b981;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    width: 50px;
    padding: 6px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: #10b981;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
  
  &:hover {
    background: #059669;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    padding: 14px;
    font-size: 1rem;
    border-radius: 6px;
    margin-bottom: 12px;
  }
`;

const StockInfo = styled.div`
  text-align: center;
  color: #64748b;
  font-size: 14px;
  
  &.in-stock {
    color: #10b981;
  }
  
  &.low-stock {
    color: #f59e0b;
  }
  
  &.out-of-stock {
    color: #ef4444;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #10b981;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    text-decoration: underline;
  }
  
  /* Mobile PWA optimizations */
  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 16px;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showError } = useNotification();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      showError('Product not found', 'Error');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

  const handleAddToCart = async () => {
    setAddingToCart(true);
    const result = await addToCart(product._id, quantity);
    if (result.success) {
      setQuantity(1);
    }
    setAddingToCart(false);
  };

  useEffect(() => {
    fetchProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <ProductDetailContainer>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          Loading product...
        </div>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return null;
  }

  const isOnSale = product.salePrice && product.salePrice < product.price;

  const getStockStatus = () => {
    if (product.stockQuantity === 0) return 'out-of-stock';
    if (product.stockQuantity <= 10) return 'low-stock';
    return 'in-stock';
  };

  const getStockText = () => {
    if (product.stockQuantity === 0) return 'Out of Stock';
    if (product.stockQuantity <= 10) return `Only ${product.stockQuantity} left`;
    return `${product.stockQuantity} in stock`;
  };

  return (
    <ProductDetailContainer>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <BackButton onClick={() => navigate('/products')}>
          ← Back to Products
        </BackButton>
      </div>
      
      <ProductContent>
        <ImageSection>
          <MainImage 
            src={product.images[selectedImage] || '/placeholder-product.svg'} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder-product.svg';
            }}
          />
          
          {product.images.length > 1 && (
            <ThumbnailGrid>
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={index === selectedImage ? 'active' : ''}
                  onClick={() => setSelectedImage(index)}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/placeholder-product.svg';
                  }}
                />
              ))}
            </ThumbnailGrid>
          )}
        </ImageSection>

        <ProductInfo>
          <ProductHeader>
            <Category>{product.category}</Category>
            <Title>{product.name}</Title>
            <Brand>by {product.brand}</Brand>
            
            <PriceSection>
              {isOnSale ? (
                <>
                  <SalePrice>R{product.salePrice.toFixed(2)}</SalePrice>
                  <OriginalPrice>R{product.price.toFixed(2)}</OriginalPrice>
                  <SaleBadge>
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </SaleBadge>
                </>
              ) : (
                <Price>R{product.price.toFixed(2)}</Price>
              )}
            </PriceSection>
          </ProductHeader>

          <Description>{product.description}</Description>

          {/* Desktop Product Specs */}
          <ProductSpecs>
            {product.thcContent && (
              <SpecItem>
                <h4>THC Content</h4>
                <p>{product.thcContent}%</p>
              </SpecItem>
            )}
            
            {product.cbdContent && (
              <SpecItem>
                <h4>CBD Content</h4>
                <p>{product.cbdContent} {product.weightUnit === 'ml' ? 'mg/ml' : '%'}</p>
              </SpecItem>
            )}
            
            <SpecItem>
              <h4>Weight</h4>
              <p>{product.weight} {product.weightUnit}</p>
            </SpecItem>
            
            {product.strain && (
              <SpecItem>
                <h4>Strain</h4>
                <p>{product.strain}</p>
              </SpecItem>
            )}
          </ProductSpecs>

          {/* Mobile PWA Data Grid for Product Specs */}
          <MobileSpecsGrid>
            {product.thcContent && (
              <MobileSpecItem>
                <div className="spec-label">THC</div>
                <div className="spec-value">{product.thcContent}%</div>
              </MobileSpecItem>
            )}
            
            {product.cbdContent && (
              <MobileSpecItem>
                <div className="spec-label">CBD</div>
                <div className="spec-value">{product.cbdContent} {product.weightUnit === 'ml' ? 'mg/ml' : '%'}</div>
              </MobileSpecItem>
            )}
            
            <MobileSpecItem>
              <div className="spec-label">Weight</div>
              <div className="spec-value">{product.weight} {product.weightUnit}</div>
            </MobileSpecItem>
            
            {product.strain && (
              <MobileSpecItem>
                <div className="spec-label">Strain</div>
                <div className="spec-value">{product.strain}</div>
              </MobileSpecItem>
            )}
          </MobileSpecsGrid>

          {(product.effects.length > 0 || product.flavors.length > 0) && (
            <EffectsAndFlavors>
              {product.effects.length > 0 && (
                <EffectsSection>
                  <h3>Effects</h3>
                  <TagList>
                    {product.effects.map((effect, index) => (
                      <Tag key={index}>{effect}</Tag>
                    ))}
                  </TagList>
                </EffectsSection>
              )}
              
              {product.flavors.length > 0 && (
                <EffectsSection>
                  <h3>Flavors</h3>
                  <TagList>
                    {product.flavors.map((flavor, index) => (
                      <Tag key={index}>{flavor}</Tag>
                    ))}
                  </TagList>
                </EffectsSection>
              )}
            </EffectsAndFlavors>
          )}

          <PurchaseSection>
            <QuantitySelector>
              <QuantityLabel>Quantity:</QuantityLabel>
              <QuantityControls>
                <QuantityButton 
                  onClick={handleQuantityDecrement}
                  disabled={quantity <= 1}
                >
                  -
                </QuantityButton>
                <QuantityInput
                  type="number"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
                <QuantityButton 
                  onClick={handleQuantityIncrement}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </QuantityButton>
              </QuantityControls>
            </QuantitySelector>

            <AddToCartButton
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity === 0}
            >
              {addingToCart ? 'Adding...' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
            </AddToCartButton>

            <StockInfo className={getStockStatus()}>
              {getStockText()}
            </StockInfo>
          </PurchaseSection>
        </ProductInfo>
      </ProductContent>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
