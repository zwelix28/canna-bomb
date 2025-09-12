import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { generateStatisticsPDF } from '../utils/pdfGenerator';

const StatisticsContainer = styled.div`
  min-height: 100vh;
  padding: 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #475569 75%, #64748b 100%);
  position: relative;
  overflow: hidden;
  
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
`;

const StatisticsContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 24px;
  position: relative;
  z-index: 3;
`;

const StatisticsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 30%, #34d399 60%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
  letter-spacing: -1px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 12px;
    letter-spacing: -0.5px;
    
    &::after {
      width: 60px;
      bottom: -4px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 8px;
    letter-spacing: -0.3px;
    
    &::after {
      width: 50px;
      bottom: -3px;
    }
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.5;
  letter-spacing: 0.2px;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 14px;
    margin-bottom: 20px;
  }
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
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
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.005);
    box-shadow: 
      0 12px 36px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
    
    &::after {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 18px;
    border-radius: 14px;
    
    &:hover {
      transform: translateY(-2px) scale(1.002);
    }
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    border-radius: 12px;
    
    &:hover {
      transform: translateY(-1px);
    }
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
  
  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    font-size: 18px;
    margin-bottom: 14px;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

const StatTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.6rem;
    margin-bottom: 4px;
  }
`;

const StatChange = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ChartCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 
    0 6px 24px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 12px 36px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const ChartTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 1px;
  }
`;

const TableCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
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
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 
      0 16px 48px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 20px 16px;
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 2px solid rgba(16, 185, 129, 0.3);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(16, 185, 129, 0.08);
    transform: scale(1.01);
  }
`;

const TableCell = styled.td`
  padding: 20px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
  color: #e2e8f0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }
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
  
  background: ${props => {
    switch(props.status) {
      case 'low': return 'rgba(239, 68, 68, 0.15)';
      case 'medium': return 'rgba(245, 158, 11, 0.15)';
      case 'high': return 'rgba(16, 185, 129, 0.15)';
      case 'on-sale': return 'rgba(139, 92, 246, 0.15)';
      default: return 'rgba(100, 116, 139, 0.15)';
    }
  }};
  
  color: ${props => {
    switch(props.status) {
      case 'low': return '#fca5a5';
      case 'medium': return '#fbbf24';
      case 'high': return '#34d399';
      case 'on-sale': return '#a78bfa';
      default: return '#94a3b8';
    }
  }};
  
  border-color: ${props => {
    switch(props.status) {
      case 'low': return 'rgba(239, 68, 68, 0.3)';
      case 'medium': return 'rgba(245, 158, 11, 0.3)';
      case 'high': return 'rgba(16, 185, 129, 0.3)';
      case 'on-sale': return 'rgba(139, 92, 246, 0.3)';
      default: return 'rgba(100, 116, 139, 0.3)';
    }
  }};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #94a3b8;
  font-size: 1.2rem;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 40px 0;
`;

const ErrorMessage = styled.div`
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(10px);
`;

const PDFButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 
    0 8px 32px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 40px;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  letter-spacing: 0.5px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 16px 48px rgba(16, 185, 129, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    
    &:hover {
      transform: none;
      box-shadow: 0 8px 32px rgba(16, 185, 129, 0.4);
    }
  }
`;

const PDFButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`;

const EmailButton = styled(PDFButton)`
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%);
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
  font-size: 0.9rem;
  text-align: center;
  border: 1px solid rgba(16, 185, 129, 0.3);
  backdrop-filter: blur(10px);
  font-weight: 500;
`;

const Statistics = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/statistics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStatistics(data);
    } catch (error) {
      console.error('Statistics fetch error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!statistics) return;
    
    try {
      setGeneratingPDF(true);
      setPdfSuccess(null);
      
      const result = await generateStatisticsPDF(statistics, containerRef);
      
      if (result.success) {
        setPdfSuccess(`PDF report "${result.fileName}" generated successfully!`);
        // Clear success message after 5 seconds
        setTimeout(() => setPdfSuccess(null), 5000);
      } else {
        setError(`PDF generation failed: ${result.error}`);
      }
    } catch (error) {
      console.error('PDF generation error:', error);
      setError(`PDF generation failed: ${error.message}`);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleEmailReport = async () => {
    if (!statistics) return;
    try {
      setEmailSending(true);
      setEmailSuccess(null);
      setError(null);
      const resp = await fetch('/api/statistics/email-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({})
      });
      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data.message || 'Failed to email report');
      }
      setEmailSuccess(data.message || 'Report emailed to administrators');
      setTimeout(() => setEmailSuccess(null), 5000);
    } catch (err) {
      console.error('Email report error:', err);
      setError(err.message);
    } finally {
      setEmailSending(false);
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { status: 'out', label: 'Out of Stock' };
    if (quantity <= 10) return { status: 'low', label: 'Low Stock' };
    if (quantity <= 20) return { status: 'medium', label: 'Medium Stock' };
    return { status: 'high', label: 'High Stock' };
  };

  if (loading) {
    return (
      <StatisticsContainer>
        <StatisticsContent>
          <LoadingSpinner>Loading statistics...</LoadingSpinner>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  if (error) {
    return (
      <StatisticsContainer>
        <StatisticsContent>
          <StatisticsHeader>
            <Title>Statistics</Title>
            <Subtitle>Inventory and sales analytics dashboard</Subtitle>
          </StatisticsHeader>
          <ErrorMessage>
            Error loading statistics: {error}
          </ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  if (!statistics) {
    return (
      <StatisticsContainer>
        <StatisticsContent>
          <StatisticsHeader>
            <Title>Statistics</Title>
            <Subtitle>Inventory and sales analytics dashboard</Subtitle>
          </StatisticsHeader>
          <ErrorMessage>
            No statistics data available
          </ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer ref={containerRef}>
      <StatisticsContent>
        <StatisticsHeader>
          <Title>Statistics</Title>
          <Subtitle>Inventory and sales analytics dashboard</Subtitle>
        </StatisticsHeader>

        {pdfSuccess && (
          <SuccessMessage>
            {pdfSuccess}
          </SuccessMessage>
        )}
        {emailSuccess && (
          <SuccessMessage>
            {emailSuccess}
          </SuccessMessage>
        )}

        {/* PDF Generation Button */}
        <PDFButtonContainer>
          <PDFButton 
            onClick={handleGeneratePDF} 
            disabled={generatingPDF || !statistics}
          >
            {generatingPDF ? (
              <>
                <span>🔄</span>
                Generating PDF...
              </>
            ) : (
              <>
                <span>📄</span>
                Generate PDF Report
              </>
            )}
          </PDFButton>
          <div style={{ width: 16 }} />
          <EmailButton 
            onClick={handleEmailReport}
            disabled={emailSending || !statistics}
          >
            {emailSending ? (
              <>
                <span>✉️</span>
                Sending...
              </>
            ) : (
              <>
                <span>📧</span>
                Email Executive Report
              </>
            )}
          </EmailButton>
        </PDFButtonContainer>

        {/* Key Metrics Dashboard */}
        <DashboardGrid>
          <StatCard>
            <StatIcon>📦</StatIcon>
            <StatTitle>Total Products</StatTitle>
            <StatValue>{statistics.totalProducts}</StatValue>
            <StatChange positive={statistics.totalProducts > 0}>
              {statistics.totalProducts > 0 ? '↗' : '→'} Active inventory
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon>⚠️</StatIcon>
            <StatTitle>Low Stock Items</StatTitle>
            <StatValue>{statistics.lowStockItems}</StatValue>
            <StatChange positive={statistics.lowStockItems === 0}>
              {statistics.lowStockItems === 0 ? '✓' : '⚠'} Stock levels
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon>💰</StatIcon>
            <StatTitle>Products on Sale</StatTitle>
            <StatValue>{statistics.productsOnSale}</StatValue>
            <StatChange positive={statistics.productsOnSale > 0}>
              {statistics.productsOnSale > 0 ? '↗' : '→'} Currently discounted
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon>📊</StatIcon>
            <StatTitle>Total Orders</StatTitle>
            <StatValue>{statistics.totalOrders}</StatValue>
            <StatChange positive={statistics.totalOrders > 0}>
              {statistics.totalOrders > 0 ? '↗' : '→'} All time orders
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon>🛒</StatIcon>
            <StatTitle>Pending Orders</StatTitle>
            <StatValue>{statistics.pendingOrders}</StatValue>
            <StatChange positive={statistics.pendingOrders === 0}>
              {statistics.pendingOrders === 0 ? '✓' : '⏳'} Awaiting processing
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon>💵</StatIcon>
            <StatTitle>Total Revenue</StatTitle>
            <StatValue>R{statistics.totalRevenue?.toFixed(2) || '0.00'}</StatValue>
            <StatChange positive={statistics.totalRevenue > 0}>
              {statistics.totalRevenue > 0 ? '↗' : '→'} Lifetime sales
            </StatChange>
          </StatCard>
        </DashboardGrid>

        {/* Charts Section */}
        <ChartsGrid>
          {/* Top Selling Products */}
          <ChartCard>
            <ChartTitle>Top Selling Products</ChartTitle>
            {statistics.topSellingProducts && statistics.topSellingProducts.length > 0 ? (
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Product</TableHeader>
                    <TableHeader>Sales</TableHeader>
                    <TableHeader>Revenue</TableHeader>
                    <TableHeader>Stock</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {statistics.topSellingProducts.slice(0, 5).map((product, index) => (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ProductImage 
                            src={product.images?.[0] || '/placeholder-product.jpg'} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{product.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell style={{ fontWeight: '600' }}>{product.totalSold || 0}</TableCell>
                      <TableCell style={{ fontWeight: '600' }}>R{((product.totalSold || 0) * (product.salePrice || product.price)).toFixed(2)}</TableCell>
                      <TableCell>
                        <StatusBadge status={getStockStatus(product.stockQuantity).status}>
                          {product.stockQuantity}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                No sales data available
              </div>
            )}
          </ChartCard>

          {/* Stock Status Overview */}
          <ChartCard>
            <ChartTitle>Stock Status Overview</ChartTitle>
            {statistics.stockStatus && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>High Stock</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(statistics.stockStatus.high / statistics.totalProducts) * 100}%`, 
                        height: '100%', 
                        background: '#10b981' 
                      }} />
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{statistics.stockStatus.high}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Medium Stock</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(statistics.stockStatus.medium / statistics.totalProducts) * 100}%`, 
                        height: '100%', 
                        background: '#f59e0b' 
                      }} />
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{statistics.stockStatus.medium}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Low Stock</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(statistics.stockStatus.low / statistics.totalProducts) * 100}%`, 
                        height: '100%', 
                        background: '#ef4444' 
                      }} />
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{statistics.stockStatus.low}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Out of Stock</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '100px', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(statistics.stockStatus.out / statistics.totalProducts) * 100}%`, 
                        height: '100%', 
                        background: '#6b7280' 
                      }} />
                    </div>
                    <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{statistics.stockStatus.out}</span>
                  </div>
                </div>
              </div>
            )}
          </ChartCard>
        </ChartsGrid>

        {/* Detailed Tables */}
        <TableCard>
          <ChartTitle>Low Stock Alert</ChartTitle>
          {statistics.lowStockProducts && statistics.lowStockProducts.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Current Stock</TableHeader>
                  <TableHeader>Status</TableHeader>
                  <TableHeader>Price</TableHeader>
                  <TableHeader>Category</TableHeader>
                </tr>
              </thead>
              <tbody>
                {statistics.lowStockProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <ProductImage 
                          src={product.images?.[0] || '/placeholder-product.jpg'} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = '/placeholder-product.jpg';
                          }}
                        />
                        <div>
                          <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{product.name}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.description?.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: '600', color: product.stockQuantity === 0 ? '#ef4444' : '#f59e0b' }}>
                      {product.stockQuantity}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={getStockStatus(product.stockQuantity).status}>
                        {getStockStatus(product.stockQuantity).label}
                      </StatusBadge>
                    </TableCell>
                    <TableCell style={{ fontWeight: '600' }}>
                      R{product.salePrice ? product.salePrice.toFixed(2) : product.price.toFixed(2)}
                      {product.salePrice && (
                        <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '500' }}>
                          On Sale!
                        </div>
                      )}
                    </TableCell>
                    <TableCell style={{ fontSize: '0.9rem', color: '#64748b' }}>
                      {product.category}
                    </TableCell>
                  </TableRow>
                ))}
              </tbody>
            </Table>
          ) : (
            <div style={{ textAlign: 'center', color: '#34d399', padding: '40px' }}>
              ✅ All products have adequate stock levels
            </div>
          )}
        </TableCard>

        <TableCard>
          <ChartTitle>Products on Sale</ChartTitle>
          {statistics.saleProducts && statistics.saleProducts.length > 0 ? (
            <Table>
              <thead>
                <tr>
                  <TableHeader>Product</TableHeader>
                  <TableHeader>Original Price</TableHeader>
                  <TableHeader>Sale Price</TableHeader>
                  <TableHeader>Discount</TableHeader>
                  <TableHeader>Stock</TableHeader>
                </tr>
              </thead>
              <tbody>
                {statistics.saleProducts.map((product) => {
                  const discount = ((product.price - product.salePrice) / product.price * 100).toFixed(0);
                  return (
                    <TableRow key={product._id}>
                      <TableCell>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ProductImage 
                            src={product.images?.[0] || '/placeholder-product.jpg'} 
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = '/placeholder-product.jpg';
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#ffffff' }}>{product.name}</div>
                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{product.category}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell style={{ textDecoration: 'line-through', color: '#64748b' }}>
                        R{product.price.toFixed(2)}
                      </TableCell>
                      <TableCell style={{ fontWeight: '600', color: '#10b981' }}>
                        R{product.salePrice.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status="on-sale">
                          {discount}% OFF
                        </StatusBadge>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStockStatus(product.stockQuantity).status}>
                          {product.stockQuantity}
                        </StatusBadge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </tbody>
            </Table>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
              No products currently on sale
            </div>
          )}
        </TableCard>
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default Statistics;
