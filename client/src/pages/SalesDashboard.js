import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const SalesDashboardContainer = styled.div`
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

const SalesDashboardContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 60px 32px;
  position: relative;
  z-index: 3;
`;

const SalesDashboardHeader = styled.div`
  text-align: center;
  margin-bottom: 48px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3.2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 30%, #34d399 60%, #6ee7b7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 20px;
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
    width: 100px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    font-size: 2.4rem;
    margin-bottom: 16px;
    letter-spacing: -0.5px;
    
    &::after {
      width: 80px;
      bottom: -4px;
    }
  }
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.2rem;
  font-weight: 400;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  letter-spacing: 0.3px;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 16px;
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  background: ${props => props.active ? 
    'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  border: 1px solid ${props => props.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  
  &:hover {
    background: ${props => props.active ? 
      'linear-gradient(135deg, #059669 0%, #10b981 100%)' : 
      'rgba(255, 255, 255, 0.15)'
    };
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  }
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-bottom: 20px;
  }
`;

const MetricCard = styled.div`
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
    background: linear-gradient(90deg, ${props => props.color || '#10b981'} 0%, ${props => props.colorSecondary || '#34d399'} 50%, ${props => props.colorTertiary || '#6ee7b7'} 100%);
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.005);
    box-shadow: 
      0 12px 36px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const MetricIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: linear-gradient(135deg, ${props => props.color || '#10b981'} 0%, ${props => props.colorSecondary || '#34d399'} 50%, ${props => props.colorTertiary || '#6ee7b7'} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  
  ${MetricCard}:hover & {
    transform: scale(1.05) rotate(2deg);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const MetricTitle = styled.h3`
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MetricValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 8px;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const MetricChange = styled.div`
  font-size: 0.8rem;
  font-weight: 500;
  color: ${props => props.positive ? '#10b981' : props.neutral ? '#94a3b8' : '#ef4444'};
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ChartsSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
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

const ChartContainer = styled.div`
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
`;

const SimpleChart = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: 8px;
  padding: 8px 12px;
  overflow-y: auto;
`;

// Removed unused ChartBar component

// Removed unused ChartLabel component

// Removed unused ChartValue component

// Removed unused ChartItem component

// New chart types for better data representation
const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  height: 100%;
  padding: 8px;
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  min-height: 80px;
  max-height: 100px;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-1px);
  }
`;

const DataLabel = styled.div`
  font-size: 0.7rem;
  color: #94a3b8;
  font-weight: 500;
  text-align: center;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  line-height: 1.2;
`;

const DataValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.color || '#ffffff'};
  text-align: center;
  margin-bottom: 3px;
  line-height: 1.1;
`;

const DataSubtext = styled.div`
  font-size: 0.65rem;
  color: #64748b;
  text-align: center;
  line-height: 1.1;
  margin-bottom: 4px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin: 4px 0 0 0;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background: linear-gradient(90deg, ${props => props.color} 0%, ${props => props.colorSecondary} 100%);
  border-radius: 4px;
  transition: width 0.8s ease;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 40px;
  
  &:last-child {
    border-bottom: none;
  }
`;

const MetricLabel = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
`;

const MetricRowValue = styled.div`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
`;

const MetricPercentage = styled.div`
  font-size: 0.8rem;
  color: ${props => props.color || '#10b981'};
  font-weight: 500;
  margin-left: 8px;
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

const SalesDashboard = () => {
  const { user } = useAuth();
  const { showError } = useNotification();
  const [salesData, setSalesData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  const periods = [
    { key: '7d', label: 'Last 7 Days' },
    { key: '1m', label: '1 Month' },
    { key: '3m', label: '3 Months' },
    { key: '6m', label: '6 Months' }
  ];

  const fetchSalesData = useCallback(async (period) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/sales-analytics?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
      
      const data = await response.json();
      setSalesData(data);
    } catch (error) {
      console.error('Sales data fetch error:', error);
      setError(error.message);
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchSalesData(selectedPeriod);
    }
  }, [user, selectedPeriod, fetchSalesData]);

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  if (user?.role !== 'admin') {
    return (
      <SalesDashboardContainer>
        <SalesDashboardContent>
          <ErrorMessage>
            Access denied. This page is only available to administrators.
          </ErrorMessage>
        </SalesDashboardContent>
      </SalesDashboardContainer>
    );
  }

  if (loading) {
    return (
      <SalesDashboardContainer>
        <SalesDashboardContent>
          <LoadingSpinner>Loading sales analytics...</LoadingSpinner>
        </SalesDashboardContent>
      </SalesDashboardContainer>
    );
  }

  if (error) {
    return (
      <SalesDashboardContainer>
        <SalesDashboardContent>
          <SalesDashboardHeader>
            <Title>Sales Dashboard</Title>
            <Subtitle>Comprehensive sales analytics and business insights</Subtitle>
          </SalesDashboardHeader>
          <ErrorMessage>
            Error loading sales data: {error}
          </ErrorMessage>
        </SalesDashboardContent>
      </SalesDashboardContainer>
    );
  }

  if (!salesData) {
    return (
      <SalesDashboardContainer>
        <SalesDashboardContent>
          <SalesDashboardHeader>
            <Title>Sales Dashboard</Title>
            <Subtitle>Comprehensive sales analytics and business insights</Subtitle>
          </SalesDashboardHeader>
          <ErrorMessage>
            No sales data available
          </ErrorMessage>
        </SalesDashboardContent>
      </SalesDashboardContainer>
    );
  }

  return (
    <SalesDashboardContainer>
      <SalesDashboardContent>
        <SalesDashboardHeader>
          <Title>Sales Dashboard</Title>
          <Subtitle>Comprehensive sales analytics and business insights</Subtitle>
        </SalesDashboardHeader>

        {/* Period Filter */}
        <FilterSection>
          {periods.map(period => (
            <FilterButton
              key={period.key}
              active={selectedPeriod === period.key}
              onClick={() => handlePeriodChange(period.key)}
            >
              {period.label}
            </FilterButton>
          ))}
        </FilterSection>

        {/* Key Metrics */}
        <MetricsGrid>
          <MetricCard color="#10b981" colorSecondary="#34d399" colorTertiary="#6ee7b7">
            <MetricIcon color="#10b981" colorSecondary="#34d399" colorTertiary="#6ee7b7">💰</MetricIcon>
            <MetricTitle>Total Revenue</MetricTitle>
            <MetricValue>R{salesData.totalRevenue?.toFixed(2) || '0.00'}</MetricValue>
            <MetricChange positive={salesData.revenueGrowth > 0} neutral={salesData.revenueGrowth === 0}>
              {salesData.revenueGrowth > 0 ? '↗' : salesData.revenueGrowth < 0 ? '↘' : '→'} 
              {Math.abs(salesData.revenueGrowth || 0).toFixed(1)}% vs previous period
            </MetricChange>
          </MetricCard>

          <MetricCard color="#3b82f6" colorSecondary="#60a5fa" colorTertiary="#93c5fd">
            <MetricIcon color="#3b82f6" colorSecondary="#60a5fa" colorTertiary="#93c5fd">📊</MetricIcon>
            <MetricTitle>Orders Completed</MetricTitle>
            <MetricValue>{salesData.completedOrders || 0}</MetricValue>
            <MetricChange positive={salesData.orderGrowth > 0} neutral={salesData.orderGrowth === 0}>
              {salesData.orderGrowth > 0 ? '↗' : salesData.orderGrowth < 0 ? '↘' : '→'} 
              {Math.abs(salesData.orderGrowth || 0).toFixed(1)}% vs previous period
            </MetricChange>
          </MetricCard>

          <MetricCard color="#8b5cf6" colorSecondary="#a78bfa" colorTertiary="#c4b5fd">
            <MetricIcon color="#8b5cf6" colorSecondary="#a78bfa" colorTertiary="#c4b5fd">🎯</MetricIcon>
            <MetricTitle>Conversion Rate</MetricTitle>
            <MetricValue>{(salesData.conversionRate || 0).toFixed(1)}%</MetricValue>
            <MetricChange positive={salesData.conversionRate > 0} neutral={salesData.conversionRate === 0}>
              {salesData.conversionRate > 0 ? '↗' : '→'} 
              {salesData.conversionRate > 0 ? 'Active' : 'No data'}
            </MetricChange>
          </MetricCard>

          <MetricCard color="#f59e0b" colorSecondary="#fbbf24" colorTertiary="#fcd34d">
            <MetricIcon color="#f59e0b" colorSecondary="#fbbf24" colorTertiary="#fcd34d">👥</MetricIcon>
            <MetricTitle>Customer Lifetime Value</MetricTitle>
            <MetricValue>R{(salesData.customerLifetimeValue || 0).toFixed(2)}</MetricValue>
            <MetricChange positive={salesData.customerLifetimeValue > 0} neutral={salesData.customerLifetimeValue === 0}>
              {salesData.customerLifetimeValue > 0 ? '↗' : '→'} 
              {salesData.customerLifetimeValue > 0 ? 'Per customer' : 'No data'}
            </MetricChange>
          </MetricCard>

          <MetricCard color="#ef4444" colorSecondary="#f87171" colorTertiary="#fca5a5">
            <MetricIcon color="#ef4444" colorSecondary="#f87171" colorTertiary="#fca5a5">📉</MetricIcon>
            <MetricTitle>Churn Rate</MetricTitle>
            <MetricValue>{(salesData.churnRate || 0).toFixed(1)}%</MetricValue>
            <MetricChange positive={salesData.churnRate < 5} neutral={salesData.churnRate === 0}>
              {salesData.churnRate < 5 ? '✓' : salesData.churnRate > 0 ? '⚠' : '→'} 
              {salesData.churnRate < 5 ? 'Low churn' : salesData.churnRate > 0 ? 'Monitor' : 'No data'}
            </MetricChange>
          </MetricCard>

          <MetricCard color="#06b6d4" colorSecondary="#22d3ee" colorTertiary="#67e8f9">
            <MetricIcon color="#06b6d4" colorSecondary="#22d3ee" colorTertiary="#67e8f9">🔄</MetricIcon>
            <MetricTitle>Retention Rate</MetricTitle>
            <MetricValue>{(salesData.retentionRate || 0).toFixed(1)}%</MetricValue>
            <MetricChange positive={salesData.retentionRate > 70} neutral={salesData.retentionRate === 0}>
              {salesData.retentionRate > 70 ? '↗' : salesData.retentionRate > 0 ? '→' : '→'} 
              {salesData.retentionRate > 70 ? 'Excellent' : salesData.retentionRate > 0 ? 'Good' : 'No data'}
            </MetricChange>
          </MetricCard>
        </MetricsGrid>

        {/* Charts Section */}
        <ChartsSection>
          <ChartCard>
            <ChartTitle>Revenue Trend</ChartTitle>
            <ChartContainer>
              <DataGrid>
                {salesData.revenueTrend?.slice(0, 4).map((item, index) => (
                  <DataItem key={index}>
                    <DataLabel>{item.period}</DataLabel>
                    <DataValue color="#10b981">R{item.value.toFixed(0)}</DataValue>
                    <DataSubtext>
                      {((item.value / Math.max(...salesData.revenueTrend.map(t => t.value))) * 100).toFixed(0)}% of peak
                    </DataSubtext>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={Math.max(5, (item.value / Math.max(...salesData.revenueTrend.map(t => t.value))) * 100)}
                        color="#10b981"
                        colorSecondary="#34d399"
                      />
                    </ProgressBar>
                  </DataItem>
                ))}
              </DataGrid>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Order Status Distribution</ChartTitle>
            <ChartContainer>
              <SimpleChart>
                {salesData.orderStatusDistribution?.map((item, index) => (
                  <MetricRow key={index}>
                    <MetricLabel>{item.status}</MetricLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MetricRowValue>{item.count}</MetricRowValue>
                      <MetricPercentage color={item.color}>
                        {((item.count / salesData.totalOrders) * 100).toFixed(1)}%
                      </MetricPercentage>
                    </div>
                  </MetricRow>
                ))}
              </SimpleChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Top Performing Products</ChartTitle>
            <ChartContainer>
              <SimpleChart>
                {salesData.topProducts?.slice(0, 5).map((item, index) => (
                  <MetricRow key={index}>
                    <MetricLabel>{item.name}</MetricLabel>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <MetricRowValue>R{item.revenue.toFixed(0)}</MetricRowValue>
                      <MetricPercentage color="#8b5cf6">
                        {((item.revenue / Math.max(...salesData.topProducts.map(p => p.revenue))) * 100).toFixed(0)}%
                      </MetricPercentage>
                    </div>
                  </MetricRow>
                ))}
              </SimpleChart>
            </ChartContainer>
          </ChartCard>

          <ChartCard>
            <ChartTitle>Customer Acquisition</ChartTitle>
            <ChartContainer>
              <DataGrid>
                {salesData.customerAcquisition?.slice(0, 4).map((item, index) => (
                  <DataItem key={index}>
                    <DataLabel>{item.period}</DataLabel>
                    <DataValue color="#06b6d4">{item.newCustomers}</DataValue>
                    <DataSubtext>new customers</DataSubtext>
                    <ProgressBar>
                      <ProgressFill 
                        percentage={Math.max(5, (item.newCustomers / Math.max(...salesData.customerAcquisition.map(c => c.newCustomers))) * 100)}
                        color="#06b6d4"
                        colorSecondary="#22d3ee"
                      />
                    </ProgressBar>
                  </DataItem>
                ))}
              </DataGrid>
            </ChartContainer>
          </ChartCard>
        </ChartsSection>
      </SalesDashboardContent>
    </SalesDashboardContainer>
  );
};

export default SalesDashboard;
