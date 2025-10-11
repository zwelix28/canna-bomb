import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  RiShoppingCart2Line, 
  RiDashboardLine, 
  RiArrowUpLine,
  RiArrowDownLine,
  RiMoneyDollarCircleLine,
  RiUserLine,
  RiStarLine,
  RiRefreshLine,
  RiEyeLine,
  RiHeartLine,
  RiUserAddLine,
  RiUserUnfollowLine
} from 'react-icons/ri';

const SalesContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const SalesContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const SalesHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding: 0 24px;
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
  margin: 16px auto 0;
  
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

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const MetricCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #10b981;
  margin-bottom: 8px;
`;

const MetricLabel = styled.div`
  font-size: 0.9rem;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

const MetricDescription = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
`;

const CustomerInsightsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InsightCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
`;

const InsightList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InsightItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  background: rgba(255,255,255,0.04);
  border-radius: 8px;
  border-left: 3px solid ${props => props.color || '#10b981'};
`;

const InsightIcon = styled.div`
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

const InsightContent = styled.div`
  flex: 1;
`;

const InsightTitle = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 2px;
`;

const InsightValue = styled.div`
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

const TestSales = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const fetchSalesData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [productsRes, ordersRes, usersRes] = await Promise.all([
        api.get('/api/products/admin/all'),
        api.get('/api/orders/admin'),
        api.get('/api/users')
      ]);
      
      setProducts(productsRes.data.products || productsRes.data);
      setOrders(ordersRes.data.orders || ordersRes.data);
      setUsers(usersRes.data.users || usersRes.data);
      
      // Debug logging
      console.log('Sales data:', { orders: ordersRes.data.orders || ordersRes.data, users: usersRes.data.users || usersRes.data });
    } catch (error) {
      console.error('Error fetching sales data:', error);
      setError('Failed to load sales data');
      showError('Failed to load sales data', 'Error');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchSalesData();
    }
  }, [user, fetchSalesData]);

  // Sales Metrics Calculations
  const salesMetrics = useMemo(() => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalCustomers = users.length;
    const customersWithOrders = [...new Set(orders.map(order => order.user))].length;
    
    // Conversion Rate (customers who made purchases / total customers)
    const conversionRate = totalCustomers > 0 ? (customersWithOrders / totalCustomers) * 100 : 0;
    
    // Customer Lifetime Value (average revenue per customer)
    const customerLifetimeValue = customersWithOrders > 0 ? totalRevenue / customersWithOrders : 0;
    
    // Churn Rate (customers who haven't ordered in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentCustomers = [...new Set(orders
      .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
      .map(order => order.user))].length;
    const churnRate = customersWithOrders > 0 ? ((customersWithOrders - recentCustomers) / customersWithOrders) * 100 : 0;
    
    // Retention Rate (opposite of churn)
    const retentionRate = 100 - churnRate;
    
    return {
      completedOrders: completedOrders.length,
      totalRevenue,
      conversionRate,
      customerLifetimeValue,
      churnRate,
      retentionRate,
      totalCustomers,
      customersWithOrders
    };
  }, [orders, users]);

  const topSellingProducts = useMemo(() => {
    return products
      .filter(product => product.salesCount > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);
  }, [products]);

  const revenueTrendData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last7Days.map(date => {
      const dayOrders = orders.filter(order => 
        order.createdAt && order.createdAt.split('T')[0] === date && order.status === 'completed'
      );
      return {
        date,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length
      };
    });
  }, [orders]);

  const customerAcquisitionData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    return last30Days.map(date => {
      const dayUsers = users.filter(user => 
        user.createdAt && user.createdAt.split('T')[0] === date
      );
      return {
        date,
        newCustomers: dayUsers.length
      };
    });
  }, [users]);

  if (!user || user.role !== 'admin') {
    return (
      <SalesContainer>
        <SalesContent>
          <ErrorMessage>
            <h2>Access Denied</h2>
            <p>You must be an administrator to access this page.</p>
          </ErrorMessage>
        </SalesContent>
      </SalesContainer>
    );
  }

  if (loading) {
    return (
      <SalesContainer>
        <SalesContent>
          <LoadingSpinner>Loading sales analytics...</LoadingSpinner>
        </SalesContent>
      </SalesContainer>
    );
  }

  if (error) {
    return (
      <SalesContainer>
        <SalesContent>
          <ErrorMessage>
            <h2>Error Loading Data</h2>
            <p>{error}</p>
            <RefreshButton onClick={fetchSalesData}>
              <RiRefreshLine /> Retry
            </RefreshButton>
          </ErrorMessage>
        </SalesContent>
      </SalesContainer>
    );
  }

  return (
    <SalesContainer>
      <SalesContent>
        <SalesHeader>
          <Title>Test Sales</Title>
          <RefreshButton onClick={fetchSalesData}>
            <RiRefreshLine /> Refresh Data
          </RefreshButton>
        </SalesHeader>

        {/* Key Sales Metrics */}
        <StatsGrid>
          <StatCard>
            <StatIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
              <RiShoppingCart2Line />
            </StatIcon>
            <StatNumber>{salesMetrics.completedOrders}</StatNumber>
            <StatLabel>Orders Completed</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> Completed sales
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)">
              <RiArrowUpLine />
            </StatIcon>
            <StatNumber>{salesMetrics.conversionRate.toFixed(1)}%</StatNumber>
            <StatLabel>Conversion Rate</StatLabel>
            <StatChange className={salesMetrics.conversionRate > 20 ? "positive" : "negative"}>
              {salesMetrics.conversionRate > 20 ? <RiArrowUpLine /> : <RiArrowDownLine />}
              {salesMetrics.conversionRate > 20 ? "Strong" : "Needs improvement"}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
              <RiMoneyDollarCircleLine />
            </StatIcon>
            <StatNumber>R{salesMetrics.customerLifetimeValue.toFixed(2)}</StatNumber>
            <StatLabel>Customer Lifetime Value</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> Average per customer
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)">
              <RiUserUnfollowLine />
            </StatIcon>
            <StatNumber>{salesMetrics.churnRate.toFixed(1)}%</StatNumber>
            <StatLabel>Churn Rate</StatLabel>
            <StatChange className={salesMetrics.churnRate < 20 ? "positive" : "negative"}>
              {salesMetrics.churnRate < 20 ? <RiArrowDownLine /> : <RiArrowUpLine />}
              {salesMetrics.churnRate < 20 ? "Low churn" : "High churn"}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
              <RiHeartLine />
            </StatIcon>
            <StatNumber>{salesMetrics.retentionRate.toFixed(1)}%</StatNumber>
            <StatLabel>Retention Rate</StatLabel>
            <StatChange className={salesMetrics.retentionRate > 80 ? "positive" : "negative"}>
              {salesMetrics.retentionRate > 80 ? <RiArrowUpLine /> : <RiArrowDownLine />}
              {salesMetrics.retentionRate > 80 ? "Strong retention" : "Needs attention"}
            </StatChange>
          </StatCard>

          <StatCard>
            <StatIcon color="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)">
              <RiUserAddLine />
            </StatIcon>
            <StatNumber>{salesMetrics.totalCustomers}</StatNumber>
            <StatLabel>Total Customers</StatLabel>
            <StatChange className="positive">
              <RiArrowUpLine /> Customer base
            </StatChange>
          </StatCard>
        </StatsGrid>

        {/* Revenue Trend Chart */}
        <DashboardCard style={{ marginBottom: '24px' }}>
          <CardTitle>
            <RiArrowUpLine /> Revenue Trend (Last 7 Days)
          </CardTitle>
          <ChartContainer>
            {revenueTrendData.map((day, index) => (
              <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                <ChartBar 
                  style={{ 
                    height: `${Math.max(20, (day.revenue / Math.max(...revenueTrendData.map(d => d.revenue), 1)) * 200)}px` 
                  }}
                  title={`${day.date}: R${day.revenue.toFixed(2)} (${day.orders} orders)`}
                />
                <ChartLabel>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</ChartLabel>
              </div>
            ))}
          </ChartContainer>
        </DashboardCard>

        {/* Dashboard Grid */}
        <DashboardGrid>
          {/* Customer Acquisition */}
          <DashboardCard>
            <CardTitle>
              <RiUserAddLine /> Customer Acquisition (Last 30 Days)
            </CardTitle>
            <ChartContainer>
              {customerAcquisitionData.slice(-7).map((day, index) => (
                <div key={day.date} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                  <ChartBar 
                    style={{ 
                      height: `${Math.max(20, (day.newCustomers / Math.max(...customerAcquisitionData.slice(-7).map(d => d.newCustomers), 1)) * 200)}px` 
                    }}
                    title={`${day.date}: ${day.newCustomers} new customers`}
                  />
                  <ChartLabel>{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</ChartLabel>
                </div>
              ))}
            </ChartContainer>
          </DashboardCard>

          {/* Top Performing Products */}
          <DashboardCard>
            <CardTitle>
              <RiStarLine /> Top Performing Products
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
                      <ProductSales>{product.salesCount || 0} sales • R{(product.price || 0).toFixed(2)}</ProductSales>
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

        {/* Advanced Sales Metrics */}
        <MetricsGrid>
          <MetricCard>
            <MetricValue>R{salesMetrics.totalRevenue.toFixed(2)}</MetricValue>
            <MetricLabel>Total Revenue</MetricLabel>
            <MetricDescription>Revenue from all completed orders</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricValue>{salesMetrics.customersWithOrders}</MetricValue>
            <MetricLabel>Active Customers</MetricLabel>
            <MetricDescription>Customers who have made at least one purchase</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricValue>{(salesMetrics.totalRevenue / Math.max(salesMetrics.completedOrders, 1)).toFixed(2)}</MetricValue>
            <MetricLabel>Average Order Value</MetricLabel>
            <MetricDescription>Average revenue per completed order</MetricDescription>
          </MetricCard>

          <MetricCard>
            <MetricValue>{((salesMetrics.customersWithOrders / Math.max(salesMetrics.totalCustomers, 1)) * 100).toFixed(1)}%</MetricValue>
            <MetricLabel>Customer Activation Rate</MetricLabel>
            <MetricDescription>Percentage of registered users who made purchases</MetricDescription>
          </MetricCard>
        </MetricsGrid>

        {/* Customer Insights */}
        <CustomerInsightsGrid>
          <InsightCard>
            <CardTitle>
              <RiEyeLine /> Customer Behavior Insights
            </CardTitle>
            <InsightList>
              <InsightItem color="#10b981">
                <InsightIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
                  <RiArrowUpLine />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>High-Value Customers</InsightTitle>
                  <InsightValue>{Math.round(salesMetrics.customersWithOrders * 0.2)} customers generate 80% of revenue</InsightValue>
                </InsightContent>
              </InsightItem>

              <InsightItem color="#3b82f6">
                <InsightIcon color="linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)">
                  <RiUserLine />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>Customer Acquisition</InsightTitle>
                  <InsightValue>{customerAcquisitionData.slice(-7).reduce((sum, day) => sum + day.newCustomers, 0)} new customers this week</InsightValue>
                </InsightContent>
              </InsightItem>

              <InsightItem color="#f59e0b">
                <InsightIcon color="linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)">
                  <RiShoppingCart2Line />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>Purchase Frequency</InsightTitle>
                  <InsightValue>Average {(salesMetrics.completedOrders / Math.max(salesMetrics.customersWithOrders, 1)).toFixed(1)} orders per customer</InsightValue>
                </InsightContent>
              </InsightItem>
            </InsightList>
          </InsightCard>

          <InsightCard>
            <CardTitle>
              <RiDashboardLine /> Sales Performance Insights
            </CardTitle>
            <InsightList>
              <InsightItem color="#ef4444">
                <InsightIcon color="linear-gradient(135deg, #ef4444 0%, #fca5a5 100%)">
                  <RiArrowDownLine />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>Churn Risk</InsightTitle>
                  <InsightValue>{Math.round(salesMetrics.customersWithOrders * (salesMetrics.churnRate / 100))} customers at risk of churning</InsightValue>
                </InsightContent>
              </InsightItem>

              <InsightItem color="#8b5cf6">
                <InsightIcon color="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)">
                  <RiStarLine />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>Revenue Growth</InsightTitle>
                  <InsightValue>Potential revenue increase: R{(salesMetrics.customerLifetimeValue * salesMetrics.customersWithOrders * 0.1).toFixed(2)}</InsightValue>
                </InsightContent>
              </InsightItem>

              <InsightItem color="#10b981">
                <InsightIcon color="linear-gradient(135deg, #10b981 0%, #34d399 100%)">
                  <RiHeartLine />
                </InsightIcon>
                <InsightContent>
                  <InsightTitle>Customer Satisfaction</InsightTitle>
                  <InsightValue>{salesMetrics.retentionRate > 80 ? 'High satisfaction' : 'Needs improvement'} based on retention</InsightValue>
                </InsightContent>
              </InsightItem>
            </InsightList>
          </InsightCard>
        </CustomerInsightsGrid>
      </SalesContent>
    </SalesContainer>
  );
};

export default TestSales;
