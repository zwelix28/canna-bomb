import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  RiBarChart2Line, 
  RiShoppingCart2Line, 
  RiDashboardLine, 
  RiAlertLine, 
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoneyDollarCircleLine,
  RiStarLine,
  RiRefreshLine
} from 'react-icons/ri';

const StatisticsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const StatisticsContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const StatisticsHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const RefreshButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.3);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 20px;
  color: white;
  background: ${props => props.color || 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
`;

const StatChange = styled.div`
  font-size: 0.7rem;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.positive {
    color: #34d399;
  }
  
  &.negative {
    color: #fca5a5;
  }
  
  &.neutral {
    color: #94a3b8;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const DashboardCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChartContainer = styled.div`
  height: 300px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 16px 0;
`;

const ChartBar = styled.div`
  flex: 1;
  background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
  border-radius: 4px 4px 0 0;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: linear-gradient(180deg, #059669 0%, #10b981 100%);
    transform: scaleY(1.05);
  }
`;

const ChartLabel = styled.div`
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  margin-top: 8px;
  transform: rotate(-45deg);
  white-space: nowrap;
`;

const TopProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.08);
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(16, 185, 129, 0.3);
    background: rgba(255,255,255,0.06);
  }
`;

const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  background: rgba(255,255,255,0.04);
`;

const ProductInfo = styled.div`
  flex: 1;
`;

const ProductName = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2px;
`;

const ProductSales = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const ProductRank = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
`;

const AlertsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const AlertCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
`;

const AlertList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const AlertItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  border-left: 3px solid ${props => props.color || '#10b981'};
`;

const AlertIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: white;
  background: ${props => props.color || 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2px;
`;

const AlertDescription = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const RevenueChart = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
`;

const RevenueGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const RevenueItem = styled.div`
  text-align: center;
  padding: 12px;
  background: rgba(255,255,255,0.04);
  border-radius: 10px;
`;

const RevenueValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 4px;
`;

const RevenueLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #fca5a5;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 12px;
  margin: 20px 0;
`;

const TestStatistics = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, productsRes, ordersRes] = await Promise.all([
        api.get('/api/statistics'),
        api.get('/api/products/admin/all'),
        api.get('/api/orders/admin')
      ]);
      
      setStats(statsRes.data);
      setProducts(productsRes.data.products || productsRes.data);
      setOrders(ordersRes.data.orders || ordersRes.data);
      
      // Debug logging
      console.log('Statistics data:', statsRes.data);
      console.log('Orders data:', ordersRes.data.orders || ordersRes.data);
      console.log('First order structure:', (ordersRes.data.orders || ordersRes.data)[0]);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      setError('Failed to load statistics data');
      showError('Failed to load statistics', 'Error');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchStatistics();
    }
  }, [user, fetchStatistics]);

  const topSellingProducts = useMemo(() => {
    return products
      .filter(product => product.salesCount > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);
  }, [products]);

  const lowStockProducts = useMemo(() => {
    return products.filter(product => product.stockQuantity <= 10 && product.stockQuantity > 0);
  }, [products]);

  const outOfStockProducts = useMemo(() => {
    return products.filter(product => product.stockQuantity === 0);
  }, [products]);

  const productsOnSale = useMemo(() => {
    return products.filter(product => product.salePrice && product.salePrice < product.price);
  }, [products]);

  const revenueData = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingRevenue = orders
      .filter(order => order.status === 'pending')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    const completedRevenue = orders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    return {
      total: totalRevenue,
      pending: pendingRevenue,
      completed: completedRevenue,
      average: orders.length > 0 ? totalRevenue / orders.length : 0
    };
  }, [orders]);

  const salesChartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.createdAt && order.createdAt.split('T')[0] === date
      );
      return {
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0)
      };
    });
  }, [orders]);

  if (!user || user.role !== 'admin') {
    return (
      <StatisticsContainer>
        <StatisticsContent>
          <ErrorMessage>
            <h2>Access Denied</h2>
            <p>You must be an administrator to access this page.</p>
          </ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

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
          <ErrorMessage>
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <RefreshButton onClick={fetchStatistics}>
              <RiRefreshLine /> Retry
            </RefreshButton>
          </ErrorMessage>
        </StatisticsContent>
      </StatisticsContainer>
    );
  }

  return (
    <StatisticsContainer>
      <StatisticsContent>
        <StatisticsHeader>
          <Title>Test Statistics</Title>
          <RefreshButton onClick={fetchStatistics}>
            <RiRefreshLine /> Refresh Data
          </RefreshButton>
        </StatisticsHeader>

        {/* Key Metrics */}
        <StatsGrid>
          <StatCard>
            <StatIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
              <RiDashboardLine />
            </StatIcon>
            <StatNumber>{stats?.totalProducts || products.length}</StatNumber>
            <StatLabel>Total Products</StatLabel>
            <StatChange className="neutral">
              <RiArrowUpLine /> All time
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
              <RiAlertLine />
            </StatIcon>
            <StatNumber>{lowStockProducts.length}</StatNumber>
            <StatLabel>Low Stock Items</StatLabel>
            <StatChange className={lowStockProducts.length > 0 ? "negative" : "positive"}>
              {lowStockProducts.length > 0 ? <RiArrowDownLine /> : <RiArrowUpLine />}
              {lowStockProducts.length > 0 ? "Needs attention" : "All good"}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)">
              <RiShoppingCart2Line />
            </StatIcon>
            <StatNumber>{productsOnSale.length}</StatNumber>
            <StatLabel>Products on Sale</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> Active promotions
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)">
              <RiShoppingCart2Line />
            </StatIcon>
            <StatNumber>{stats?.totalOrders || orders.length}</StatNumber>
            <StatLabel>Total Orders</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> All time
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
              <RiAlertLine />
            </StatIcon>
            <StatNumber>{stats?.pendingOrders || orders.filter(o => o.status === 'pending').length}</StatNumber>
            <StatLabel>Pending Orders</StatLabel>
            <StatChange className={orders.filter(o => o.status === 'pending').length > 0 ? "negative" : "positive"}>
              {orders.filter(o => o.status === 'pending').length > 0 ? <RiArrowDownLine /> : <RiArrowUpLine />}
              {orders.filter(o => o.status === 'pending').length > 0 ? "Needs processing" : "All processed"}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
              <RiMoneyDollarCircleLine />
            </StatIcon>
            <StatNumber>R{revenueData.total.toFixed(2)}</StatNumber>
            <StatLabel>Total Revenue</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> All time
            </StatChange>
          </StatCard>
        </StatsGrid>

        {/* Dashboard Grid */}
        <DashboardGrid>
          {/* Sales Chart */}
          <DashboardCard>
            <CardTitle>
              <RiBarChart2Line /> Sales Overview (Last 7 Days)
            </CardTitle>
            <ChartContainer>
              {salesChartData.map((day, index) => (
                <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <ChartBar 
                    style={{ 
                      height: `${Math.max(20, (day.orders / Math.max(...salesChartData.map(d => d.orders), 1)) * 200)}px` 
                    }}
                    title={`${day.date}: ${day.orders} orders, R${day.revenue.toFixed(2)}`}
                  />
                  <ChartLabel>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</ChartLabel>
                </div>
              ))}
            </ChartContainer>
          </DashboardCard>

          {/* Top Selling Products */}
          <DashboardCard>
            <CardTitle>
              <RiStarLine /> Top Selling Products
            </CardTitle>
            <TopProductsList>
              {topSellingProducts.length > 0 ? (
                topSellingProducts.map((product, index) => (
                  <ProductItem key={product._id}>
                    <ProductRank>{index + 1}</ProductRank>
                    <ProductImage 
                      src={product.images?.[0] || '/placeholder-product.jpg'} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-product.jpg';
                      }}
                    />
                    <ProductInfo>
                      <ProductName>{product.name}</ProductName>
                      <ProductSales>{product.salesCount || 0} sales</ProductSales>
                    </ProductInfo>
                  </ProductItem>
                ))
              ) : (
                <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px' }}>
                  No sales data available
                </div>
              )}
            </TopProductsList>
          </DashboardCard>
        </DashboardGrid>

        {/* Alerts Grid */}
        <AlertsGrid>
          {/* Low Stock Alerts */}
          <AlertCard>
            <CardTitle>
              <RiAlertLine /> Low Stock Alerts
            </CardTitle>
            <AlertList>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.slice(0, 5).map(product => (
                  <AlertItem key={product._id} color="#f59e0b">
                    <AlertIcon color="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
                      <RiAlertLine />
                    </AlertIcon>
                    <AlertContent>
                      <AlertTitle>{product.name}</AlertTitle>
                      <AlertDescription>Only {product.stockQuantity} units left</AlertDescription>
                    </AlertContent>
                  </AlertItem>
                ))
              ) : (
                <div style={{ color: '#34d399', textAlign: 'center', padding: '20px' }}>
                  ✅ All products have sufficient stock
                </div>
              )}
            </AlertList>
          </AlertCard>

          {/* Out of Stock Alerts */}
          <AlertCard>
            <CardTitle>
              <RiAlertLine /> Out of Stock Alerts
            </CardTitle>
            <AlertList>
              {outOfStockProducts.length > 0 ? (
                outOfStockProducts.slice(0, 5).map(product => (
                  <AlertItem key={product._id} color="#ef4444">
                    <AlertIcon color="linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)">
                      <RiAlertLine />
                    </AlertIcon>
                    <AlertContent>
                      <AlertTitle>{product.name}</AlertTitle>
                      <AlertDescription>Completely out of stock</AlertDescription>
                    </AlertContent>
                  </AlertItem>
                ))
              ) : (
                <div style={{ color: '#34d399', textAlign: 'center', padding: '20px' }}>
                  ✅ No products are out of stock
                </div>
              )}
            </AlertList>
          </AlertCard>
        </AlertsGrid>

        {/* Revenue Breakdown */}
        <RevenueChart>
          <CardTitle>
            <RiMoneyDollarCircleLine /> Revenue Breakdown
          </CardTitle>
          <RevenueGrid>
            <RevenueItem>
              <RevenueValue>R{revenueData.total.toFixed(2)}</RevenueValue>
              <RevenueLabel>Total Revenue</RevenueLabel>
            </RevenueItem>
            <RevenueItem>
              <RevenueValue>R{revenueData.completed.toFixed(2)}</RevenueValue>
              <RevenueLabel>Completed Orders</RevenueLabel>
            </RevenueItem>
            <RevenueItem>
              <RevenueValue>R{revenueData.pending.toFixed(2)}</RevenueValue>
              <RevenueLabel>Pending Orders</RevenueLabel>
            </RevenueItem>
            <RevenueItem>
              <RevenueValue>R{revenueData.average.toFixed(2)}</RevenueValue>
              <RevenueLabel>Average Order Value</RevenueLabel>
            </RevenueItem>
          </RevenueGrid>
        </RevenueChart>

        {/* Products on Sale */}
        <DashboardCard>
          <CardTitle>
              <RiArrowDownLine /> Products on Sale
          </CardTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {productsOnSale.length > 0 ? (
              productsOnSale.map(product => (
                <div key={product._id} style={{ 
                  padding: '12px', 
                  background: 'rgba(255,255,255,0.04)', 
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#e2e8f0', marginBottom: '4px' }}>
                    {product.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '6px' }}>
                    {product.category}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fca5a5' }}>
                      R{product.salePrice.toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', textDecoration: 'line-through' }}>
                      R{product.price.toFixed(2)}
                    </span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      background: '#ef4444', 
                      color: 'white', 
                      padding: '2px 6px', 
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}>
                      {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ color: '#94a3b8', textAlign: 'center', padding: '20px', gridColumn: '1 / -1' }}>
                No products are currently on sale
              </div>
            )}
          </div>
        </DashboardCard>
      </StatisticsContent>
    </StatisticsContainer>
  );
};

export default TestStatistics;
