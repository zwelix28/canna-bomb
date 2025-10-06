import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../utils/axios';
import styled from 'styled-components';
import ProductCard from '../components/ProductCard';

const ProductsContainer = styled.div`
  min-height: 100vh;
  padding: 32px 0;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
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
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 30%, #34d399 60%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -0.8px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  font-weight: 500;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const FiltersSection = styled.div`
  max-width: 1400px;
  margin: 0 auto 50px;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    margin: 0 auto 32px;
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    margin: 0 auto 24px;
    padding: 0 12px;
  }
`;

const FiltersContainer = styled.div`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    border-radius: 10px;
    box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  
  @media (max-width: 768px) {
    gap: 5px;
  }
  
  @media (max-width: 480px) {
    gap: 4px;
  }
`;

const FilterLabel = styled.label`
  font-weight: 700;
  color: #e2e8f0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  
  @media (max-width: 768px) {
    font-size: 11px;
    letter-spacing: 0.3px;
  }
  
  @media (max-width: 480px) {
    font-size: 10px;
    letter-spacing: 0.2px;
  }
`;

const FilterSelect = styled.select`
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(16, 185, 129, 0.35);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 11px;
  }
`;

const FilterInput = styled.input`
  padding: 10px 14px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: rgba(16, 185, 129, 0.35);
    background: rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(16, 185, 129, 0.35);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #a3b0c2;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 11px;
  }
`;

const SearchBar = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 14px 18px;
  border: 2px solid rgba(16, 185, 129, 0.15);
  border-radius: 12px;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #10b981;
    background: white;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
    transform: translateY(-1px);
  }
  
  &:hover {
    border-color: rgba(16, 185, 129, 0.3);
    transform: translateY(-1px);
  }
  
  &::placeholder {
    color: #94a3b8;
    font-weight: 500;
  }
  
  @media (max-width: 768px) {
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 12px;
  }
`;

const SearchButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 3px 12px rgba(16, 185, 129, 0.3);
  
  &:hover {
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 11px;
  }
`;

const ClearButton = styled.button`
  padding: 14px 24px;
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, #475569 0%, #334155 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(100, 116, 139, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 11px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(256px, 1fr));
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  /* Mobile PWA Grid Layout */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 0 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 12px;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #64748b;
  
  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 12px;
    color: #0f172a;
  }
  
  p {
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #64748b;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 50px;
`;

const PageButton = styled.button`
  padding: 14px 22px;
  border: 2px solid rgba(16, 185, 129, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #0f172a;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  transition: border-color 0.3s ease, background-color 0.3s ease, transform 0.3s ease;
  
  &:hover {
    border-color: #10b981;
    color: #10b981;
    background: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
  }
  
  &.active {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    border-color: #10b981;
    color: white;
    box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    search: searchParams.get('search') || ''
  });

  const categories = [
    'flower', 'edibles', 'concentrates', 'topicals', 'vapes', 'accessories'
  ];

  const brands = [
    'Premium Cannabis Co', 'Wellness Edibles', 'Extract Masters', 
    'Healing Touch', 'VapeTech', 'GrindMaster', 'Classic Strains', 'Sweet Treats'
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if we're in production without a backend (Netlify demo mode)
      const isProduction = process.env.NODE_ENV === 'production';
      const hasApiUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL !== '';
      
      console.log('Environment check:', {
        isProduction,
        hasApiUrl,
        apiUrl: process.env.REACT_APP_API_URL
      });
      
      // Only show sample products if we're in production AND have no API URL
      if (isProduction && !hasApiUrl) {
        console.log('Demo mode: No API URL configured, showing sample products');
        // Show sample products immediately for Netlify demo
        const sampleProducts = [
        {
          _id: '1',
          name: 'Premium OG Kush',
          description: 'A classic indica strain known for its relaxing effects and earthy aroma.',
          price: 45.99,
          category: 'flower',
          brand: 'Premium Cannabis Co',
          stock: 25,
          images: ['/placeholder-product.svg'],
          thc: 22.5,
          cbd: 0.8
        },
        {
          _id: '2',
          name: 'CBD Gummy Bears',
          description: 'Delicious gummy bears infused with high-quality CBD for relaxation.',
          price: 29.99,
          category: 'edibles',
          brand: 'Wellness Edibles',
          stock: 50,
          images: ['/placeholder-product.svg'],
          thc: 0.3,
          cbd: 25.0
        },
        {
          _id: '3',
          name: 'Live Resin Concentrate',
          description: 'Premium live resin extract with exceptional flavor and potency.',
          price: 65.99,
          category: 'concentrates',
          brand: 'Extract Masters',
          stock: 15,
          images: ['/placeholder-product.svg'],
          thc: 85.2,
          cbd: 2.1
        },
        {
          _id: '4',
          name: 'CBD Pain Relief Cream',
          description: 'Topical cream infused with CBD for targeted pain relief.',
          price: 39.99,
          category: 'topicals',
          brand: 'Healing Touch',
          stock: 30,
          images: ['/placeholder-product.svg'],
          thc: 0.0,
          cbd: 500.0
        },
        {
          _id: '5',
          name: 'Vape Pen Starter Kit',
          description: 'Complete vape pen kit with premium cannabis oil cartridge.',
          price: 55.99,
          category: 'vapes',
          brand: 'VapeTech',
          stock: 20,
          images: ['/placeholder-product.svg'],
          thc: 75.0,
          cbd: 5.0
        },
        {
          _id: '6',
          name: 'Premium Grinder',
          description: 'High-quality 4-piece grinder with pollen catcher.',
          price: 24.99,
          category: 'accessories',
          brand: 'GrindMaster',
          stock: 40,
          images: ['/placeholder-product.svg'],
          thc: 0.0,
          cbd: 0.0
        }
      ];
      
        setProducts(sampleProducts);
        setTotalPages(1);
        setLoading(false);
        return;
      }
      
      // Normal API call for development or production with backend
      console.log('Making API call to:', process.env.REACT_APP_API_URL);
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...filters
      });

      const response = await api.get(`/api/products?${params}`);
      console.log('API response:', response.data);
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      
      // Update URL params
      const newSearchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) newSearchParams.set(key, value);
      });
      setSearchParams(newSearchParams);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      
      // Fallback: Show sample products when API is not available
      const sampleProducts = [
        {
          _id: '1',
          name: 'Premium OG Kush',
          description: 'A classic indica strain known for its relaxing effects and earthy aroma.',
          price: 45.99,
          category: 'flower',
          brand: 'Premium Cannabis Co',
          stock: 25,
          images: ['/placeholder-product.svg'],
          thc: 22.5,
          cbd: 0.8
        },
        {
          _id: '2',
          name: 'CBD Gummy Bears',
          description: 'Delicious gummy bears infused with high-quality CBD for relaxation.',
          price: 29.99,
          category: 'edibles',
          brand: 'Wellness Edibles',
          stock: 50,
          images: ['/placeholder-product.svg'],
          thc: 0.3,
          cbd: 25.0
        },
        {
          _id: '3',
          name: 'Live Resin Concentrate',
          description: 'Premium live resin extract with exceptional flavor and potency.',
          price: 65.99,
          category: 'concentrates',
          brand: 'Extract Masters',
          stock: 15,
          images: ['/placeholder-product.svg'],
          thc: 85.2,
          cbd: 2.1
        },
        {
          _id: '4',
          name: 'CBD Pain Relief Cream',
          description: 'Topical cream infused with CBD for targeted pain relief.',
          price: 39.99,
          category: 'topicals',
          brand: 'Healing Touch',
          stock: 30,
          images: ['/placeholder-product.svg'],
          thc: 0.0,
          cbd: 500.0
        },
        {
          _id: '5',
          name: 'Vape Pen Starter Kit',
          description: 'Complete vape pen kit with premium cannabis oil cartridge.',
          price: 55.99,
          category: 'vapes',
          brand: 'VapeTech',
          stock: 20,
          images: ['/placeholder-product.svg'],
          thc: 75.0,
          cbd: 5.0
        },
        {
          _id: '6',
          name: 'Premium Grinder',
          description: 'High-quality 4-piece grinder with pollen catcher.',
          price: 24.99,
          category: 'accessories',
          brand: 'GrindMaster',
          stock: 40,
          images: ['/placeholder-product.svg'],
          thc: 0.0,
          cbd: 0.0
        }
      ];
      
      setProducts(sampleProducts);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  useEffect(() => {
    fetchProducts();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchProducts();
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <ProductsContainer>
        <LoadingSpinner>Loading products...</LoadingSpinner>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      <ProductsHeader>
        <Title>Our Products</Title>
        <Subtitle>Discover premium cannabis products for your lifestyle</Subtitle>
      </ProductsHeader>

      <FiltersSection>
        <FiltersContainer>
          <SearchBar>
            <SearchInput
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <SearchButton onClick={handleSearch}>Search</SearchButton>
            <ClearButton onClick={clearFilters}>Clear</ClearButton>
          </SearchBar>

          <FiltersGrid>
            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <FilterSelect
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Brand</FilterLabel>
              <FilterSelect
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              >
                <option value="">All Brands</option>
                {brands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </FilterSelect>
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Min Price</FilterLabel>
              <FilterInput
                type="number"
                placeholder="Min price"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Max Price</FilterLabel>
              <FilterInput
                type="number"
                placeholder="Max price"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </FilterGroup>
          </FiltersGrid>
        </FiltersContainer>
      </FiltersSection>

      {products.length === 0 ? (
        <NoProducts>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms</p>
        </NoProducts>
      ) : (
        <>
          {products.some(p => p._id === '1') && (
            <div style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              border: '1px solid #f59e0b',
              borderRadius: '12px',
              padding: '16px',
              margin: '0 auto 32px',
              maxWidth: '1400px',
              textAlign: 'center',
              color: '#92400e',
              fontWeight: '500'
            }}>
              <strong>📱 Demo Mode:</strong> You're viewing sample products. Connect your backend to see real inventory.
            </div>
          )}
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </ProductsGrid>

          {totalPages > 1 && (
            <Pagination>
              <PageButton
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </PageButton>
              ))}
              
              <PageButton
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </PageButton>
            </Pagination>
          )}
        </>
      )}
    </ProductsContainer>
  );
};

export default Products;
