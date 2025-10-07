import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import api from '../utils/axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  RiRobot2Line,
  RiRefreshLine,
  RiLightbulbLine,
  RiAlertLine,
  RiBarChart2Line,
  RiShoppingCart2Line,
  RiMoneyDollarCircleLine,
  RiUserLine,
  RiArrowUpLine,
  RiArrowDownLine,
  RiSparklingLine,
  RiLineChartLine
} from 'react-icons/ri';

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`;

const AIContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const AIContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const AIHeader = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding: 0 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #8b5cf6 40%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
`;

const AIBadge = styled.span`
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  font-size: 0.6rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
`;

const AnalyzeButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px auto 0;
  font-size: 1rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    animation: ${props => props.$analyzing ? 'spin 1s linear infinite' : 'none'};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const InsightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
`;

const InsightCard = styled.div`
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2);
    border-color: rgba(139, 92, 246, 0.4);
  }
`;

const InsightIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
  background: ${props => props.color || 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)'};
`;

const InsightTitle = styled.h3`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

const InsightContent = styled.div`
  font-size: 1.1rem;
  color: #e2e8f0;
  line-height: 1.6;
  font-weight: 500;
`;

const AIAnalysisSection = styled.div`
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  svg {
    color: #a78bfa;
  }
`;

const AnalysisContent = styled.div`
  color: #cbd5e1;
  line-height: 1.8;
  font-size: 0.95rem;
  
  p {
    margin-bottom: 16px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    color: #e2e8f0;
    font-weight: 600;
  }
  
  ul {
    margin: 12px 0;
    padding-left: 24px;
  }
  
  li {
    margin-bottom: 8px;
  }
`;

const LoadingPlaceholder = styled.div`
  background: linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.2) 50%, rgba(139, 92, 246, 0.1) 100%);
  background-size: 1000px 100%;
  animation: ${shimmer} 2s infinite;
  border-radius: 8px;
  height: 20px;
  margin-bottom: 12px;
  
  &:last-child {
    width: 60%;
  }
`;

const PredictionCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const PredictionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PredictionValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #a78bfa;
  margin-bottom: 8px;
`;

const PredictionDetail = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &.positive {
    color: #34d399;
  }
  
  &.negative {
    color: #fca5a5;
  }
`;

const TrendGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const TrendCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(139, 92, 246, 0.3);
    background: rgba(255,255,255,0.08);
  }
`;

const TrendLabel = styled.div`
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TrendValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #e2e8f0;
  margin-bottom: 4px;
`;

const TrendChange = styled.div`
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &.positive {
    color: #34d399;
  }
  
  &.negative {
    color: #fca5a5;
  }
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
  
  svg {
    animation: ${pulse} 1.5s ease-in-out infinite;
    font-size: 48px;
    color: #a78bfa;
  }
`;

const TestAI = () => {
  const { user } = useAuth();
  const { showError, showSuccess } = useNotification();
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [error, setError] = useState(null);

  const fetchBusinessData = useCallback(async () => {
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
    } catch (error) {
      console.error('Error fetching business data:', error);
      setError('Failed to load business data');
      showError('Failed to load business data', 'Error');
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchBusinessData();
    }
  }, [user, fetchBusinessData]);

  // Calculate business metrics for AI analysis
  const businessMetrics = useMemo(() => {
    const completedOrders = orders.filter(order => order.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const avgOrderValue = completedOrders.length > 0 ? totalRevenue / completedOrders.length : 0;
    
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);
    const recentOrders = orders.filter(order => new Date(order.createdAt) >= last30Days);
    const recentRevenue = recentOrders
      .filter(order => order.status === 'completed')
      .reduce((sum, order) => sum + (order.total || 0), 0);
    
    const topProducts = products
      .filter(p => p.salesCount > 0)
      .sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))
      .slice(0, 5);
    
    const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0);
    const outOfStockProducts = products.filter(p => p.stock === 0);
    
    const customersWithOrders = [...new Set(orders.map(order => order.user))].length;
    const conversionRate = users.length > 0 ? (customersWithOrders / users.length) * 100 : 0;
    
    return {
      totalRevenue,
      totalOrders: orders.length,
      completedOrders: completedOrders.length,
      avgOrderValue,
      recentRevenue,
      recentOrdersCount: recentOrders.length,
      topProducts,
      lowStockProducts: lowStockProducts.length,
      outOfStockProducts: outOfStockProducts.length,
      totalCustomers: users.length,
      activeCustomers: customersWithOrders,
      conversionRate,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      totalProducts: products.length
    };
  }, [orders, products, users]);

  const generateFallbackInsights = useCallback(() => {
    const { avgOrderValue, conversionRate, lowStockProducts, topProducts, recentRevenue, completedOrders } = businessMetrics;
    
    const insights = {
      summary: `Based on your business data, you have completed ${completedOrders} orders with an average order value of R${avgOrderValue.toFixed(2)}. Your conversion rate is ${conversionRate.toFixed(1)}%.`,
      predictions: {
        nextMonthRevenue: recentRevenue * 1.15,
        nextMonthOrders: Math.round(businessMetrics.recentOrdersCount * 1.1),
        growthRate: 15
      },
      recommendations: [
        conversionRate < 20 ? 'Consider improving your conversion rate through targeted marketing campaigns.' : 'Your conversion rate is healthy. Focus on customer retention.',
        lowStockProducts > 0 ? `You have ${lowStockProducts} products with low stock. Reorder soon to prevent stockouts.` : 'Inventory levels look good.',
        avgOrderValue < 500 ? 'Consider implementing upselling strategies to increase average order value.' : 'Your average order value is strong.',
        topProducts.length > 0 ? `Focus on promoting your top sellers: ${topProducts.slice(0, 3).map(p => p.name).join(', ')}.` : 'Build up your product catalog.'
      ],
      trends: [
        { metric: 'Revenue Trend', value: 'Upward', confidence: 85 },
        { metric: 'Customer Acquisition', value: 'Stable', confidence: 78 },
        { metric: 'Product Performance', value: 'Mixed', confidence: 72 }
      ]
    };
    
    setAiInsights(insights);
  }, [businessMetrics]);

  const analyzeWithAI = useCallback(async () => {
    try {
      setAnalyzing(true);
      
      // Prepare business context for AI analysis
      const businessContext = {
        metrics: businessMetrics,
        timeframe: '30 days',
        industryType: 'cannabis retail'
      };
      
      // Call backend API to analyze with OpenAI
      const response = await api.post('/api/ai/analyze-business', businessContext);
      
      setAiInsights(response.data);
      showSuccess('AI analysis completed successfully', 'Success');
    } catch (error) {
      console.error('Error analyzing with AI:', error);
      const errorMsg = error.response?.data?.error || 'Failed to analyze business data with AI';
      showError(errorMsg, 'AI Analysis Error');
      
      // Fallback to rule-based insights if AI fails
      generateFallbackInsights();
    } finally {
      setAnalyzing(false);
    }
  }, [businessMetrics, showError, showSuccess, generateFallbackInsights]);

  if (!user || user.role !== 'admin') {
    return (
      <AIContainer>
        <AIContent>
          <ErrorMessage>
            <h2>Access Denied</h2>
            <p>You must be an administrator to access AI Business Intelligence.</p>
          </ErrorMessage>
        </AIContent>
      </AIContainer>
    );
  }

  if (loading) {
    return (
      <AIContainer>
        <AIContent>
          <LoadingSpinner>
            <RiRobot2Line />
            <p>Loading AI Business Intelligence...</p>
          </LoadingSpinner>
        </AIContent>
      </AIContainer>
    );
  }

  return (
    <AIContainer>
      <AIContent>
        <AIHeader>
          <Title>
            <RiRobot2Line /> Test AI <AIBadge>Powered by GPT</AIBadge>
          </Title>
          <AnalyzeButton onClick={analyzeWithAI} disabled={analyzing} $analyzing={analyzing}>
            {analyzing ? (
              <>
                <RiRefreshLine /> Analyzing...
              </>
            ) : (
              <>
                <RiSparklingLine /> Run AI Analysis
              </>
            )}
          </AnalyzeButton>
        </AIHeader>

        {/* Business Metrics Overview */}
        <TrendGrid>
          <TrendCard>
            <TrendLabel>Total Revenue</TrendLabel>
            <TrendValue>R{businessMetrics.totalRevenue.toFixed(2)}</TrendValue>
            <TrendChange className="positive">
              <RiArrowUpLine /> Last 30 days: R{businessMetrics.recentRevenue.toFixed(2)}
            </TrendChange>
          </TrendCard>

          <TrendCard>
            <TrendLabel>Completed Orders</TrendLabel>
            <TrendValue>{businessMetrics.completedOrders}</TrendValue>
            <TrendChange className="positive">
              <RiArrowUpLine /> Avg Order Value: R{businessMetrics.avgOrderValue.toFixed(2)}
            </TrendChange>
          </TrendCard>

          <TrendCard>
            <TrendLabel>Conversion Rate</TrendLabel>
            <TrendValue>{businessMetrics.conversionRate.toFixed(1)}%</TrendValue>
            <TrendChange className={businessMetrics.conversionRate > 20 ? 'positive' : 'negative'}>
              {businessMetrics.conversionRate > 20 ? <RiArrowUpLine /> : <RiArrowDownLine />}
              {businessMetrics.activeCustomers}/{businessMetrics.totalCustomers} customers
            </TrendChange>
          </TrendCard>

          <TrendCard>
            <TrendLabel>Inventory Status</TrendLabel>
            <TrendValue>{businessMetrics.totalProducts}</TrendValue>
            <TrendChange className={businessMetrics.lowStockProducts > 0 ? 'negative' : 'positive'}>
              {businessMetrics.lowStockProducts > 0 ? <RiAlertLine /> : <RiArrowUpLine />}
              {businessMetrics.lowStockProducts} low stock alerts
            </TrendChange>
          </TrendCard>
        </TrendGrid>

        {/* AI Insights */}
        {analyzing && (
          <AIAnalysisSection>
            <SectionTitle>
              <RiRobot2Line /> AI is analyzing your business data...
            </SectionTitle>
            <AnalysisContent>
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
              <LoadingPlaceholder />
            </AnalysisContent>
          </AIAnalysisSection>
        )}

        {aiInsights && !analyzing && (
          <>
            {/* AI Summary */}
            <AIAnalysisSection>
              <SectionTitle>
                <RiLightbulbLine /> AI Business Intelligence Summary
              </SectionTitle>
              <AnalysisContent>
                <p>{aiInsights.summary}</p>
              </AnalysisContent>
            </AIAnalysisSection>

            {/* Predictive Analytics */}
            {aiInsights.predictions && (
              <AIAnalysisSection>
                <SectionTitle>
                  <RiLineChartLine /> Predictive Analytics
                </SectionTitle>
                <InsightsGrid>
                  <PredictionCard>
                    <PredictionTitle>
                      <RiMoneyDollarCircleLine /> Predicted Next Month Revenue
                    </PredictionTitle>
                    <PredictionValue>R{aiInsights.predictions.nextMonthRevenue?.toFixed(2) || '0.00'}</PredictionValue>
                    <PredictionDetail className="positive">
                      <RiArrowUpLine /> {aiInsights.predictions.growthRate || 0}% projected growth
                    </PredictionDetail>
                  </PredictionCard>

                  <PredictionCard>
                    <PredictionTitle>
                      <RiShoppingCart2Line /> Predicted Orders
                    </PredictionTitle>
                    <PredictionValue>{aiInsights.predictions.nextMonthOrders || 0}</PredictionValue>
                    <PredictionDetail className="positive">
                      <RiArrowUpLine /> Based on current trends
                    </PredictionDetail>
                  </PredictionCard>

                  <PredictionCard>
                    <PredictionTitle>
                      <RiUserLine /> Customer Growth Forecast
                    </PredictionTitle>
                    <PredictionValue>
                      {Math.round((businessMetrics.totalCustomers * (1 + (aiInsights.predictions.growthRate || 0) / 100)))}
                    </PredictionValue>
                    <PredictionDetail className="positive">
                      <RiArrowUpLine /> Estimated customer base
                    </PredictionDetail>
                  </PredictionCard>
                </InsightsGrid>
              </AIAnalysisSection>
            )}

            {/* AI Recommendations */}
            {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
              <AIAnalysisSection>
                <SectionTitle>
                  <RiSparklingLine /> AI-Powered Recommendations
                </SectionTitle>
                <InsightsGrid>
                  {aiInsights.recommendations.map((recommendation, index) => (
                    <InsightCard key={index}>
                      <InsightIcon color="linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)">
                        <RiLightbulbLine />
                      </InsightIcon>
                      <InsightTitle>Recommendation {index + 1}</InsightTitle>
                      <InsightContent>{recommendation}</InsightContent>
                    </InsightCard>
                  ))}
                </InsightsGrid>
              </AIAnalysisSection>
            )}

            {/* Trend Analysis */}
            {aiInsights.trends && aiInsights.trends.length > 0 && (
              <AIAnalysisSection>
                <SectionTitle>
                  <RiBarChart2Line /> Trend Analysis
                </SectionTitle>
                <TrendGrid>
                  {aiInsights.trends.map((trend, index) => (
                    <TrendCard key={index}>
                      <TrendLabel>{trend.metric}</TrendLabel>
                      <TrendValue>{trend.value}</TrendValue>
                      <TrendChange className="positive">
                        <RiArrowUpLine /> {trend.confidence}% confidence
                      </TrendChange>
                    </TrendCard>
                  ))}
                </TrendGrid>
              </AIAnalysisSection>
            )}
          </>
        )}

        {!aiInsights && !analyzing && (
          <AIAnalysisSection>
            <SectionTitle>
              <RiRobot2Line /> Ready for AI Analysis
            </SectionTitle>
            <AnalysisContent>
              <p>Click "Run AI Analysis" to get AI-powered insights, predictive analytics, and personalized recommendations for your business.</p>
              <p><strong>AI will analyze:</strong></p>
              <ul>
                <li>Revenue trends and projections</li>
                <li>Customer behavior patterns</li>
                <li>Product performance analysis</li>
                <li>Inventory optimization recommendations</li>
                <li>Growth opportunities and risks</li>
              </ul>
            </AnalysisContent>
          </AIAnalysisSection>
        )}
      </AIContent>
    </AIContainer>
  );
};

export default TestAI;
