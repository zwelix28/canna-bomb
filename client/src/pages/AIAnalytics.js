import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import api from '../utils/axios';
import { generateAIAnalyticsPDF } from '../utils/aiAnalyticsPDFGenerator';

const AIAnalyticsContainer = styled.div`
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
    background: radial-gradient(circle at 20% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 40% 40%, rgba(139, 92, 246, 0.1) 0%, transparent 50%);
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

const AIAnalyticsContent = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 24px;
  position: relative;
  z-index: 3;
`;

const AIAnalyticsHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 50%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 12px;
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

const NewTag = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #ef4444 0%, #f97316 100%);
  color: white !important;
  -webkit-text-fill-color: white !important;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-left: 16px;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  animation: pulse 2s infinite;
  position: relative;
  z-index: 10;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

// Removed unused AIFeaturesGrid component

// Removed unused AIFeatureCard component

// Removed unused FeatureIcon component

// Removed unused FeatureTitle component

// Removed unused FeatureDescription component

// Removed unused FeatureBenefits component

// Removed unused BenefitItem component

const AnalyticsDashboard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  margin-bottom: 32px;
  
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
`;

const DashboardTitle = styled.h2`
  font-size: 1.6rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 24px;
  text-align: center;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  &::after {
    content: '';
    display: block;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    margin: 12px auto 0;
    border-radius: 2px;
  }
`;

// Removed unused InsightsGrid component

// Removed unused InsightCard component

// Removed unused InsightTitle component

// Removed unused InsightValue component

// Removed unused InsightDescription component

const TrendAnalysis = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const TrendTitle = styled.h3`
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 12px;
`;

const TrendItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
`;

const TrendLabel = styled.span`
  color: #e2e8f0;
  font-size: 0.75rem;
`;

const TrendValue = styled.span`
  color: #10b981;
  font-weight: 600;
  font-size: 0.75rem;
`;

// AI Business Intelligence Components - Optimized for Compact Elegance
const AIIntelligenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 28px;
`;

const AIIntelligenceCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
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
    background: linear-gradient(90deg, ${props => props.gradient || '#10b981 0%, #34d399 50%, #6ee7b7 100%'});
    opacity: 0.8;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
    border-color: rgba(16, 185, 129, 0.3);
  }
`;

const AIIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, ${props => props.bgColor || '#10b981 0%, #34d399 50%, #6ee7b7 100%'});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.3);
  transition: all 0.3s ease;
  
  ${AIIntelligenceCard}:hover & {
    transform: scale(1.05) rotate(3deg);
    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
  }
`;

const AITitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const AIDescription = styled.p`
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.5;
  margin-bottom: 16px;
`;

const AIMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const AIMetric = styled.div`
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AIMetricValue = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: ${props => props.color || '#10b981'};
  margin-bottom: 3px;
`;

const AIMetricLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

const AIInsights = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const AIInsightTitle = styled.h4`
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const AIInsightList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AIInsightItem = styled.li`
  color: #e2e8f0;
  font-size: 0.8rem;
  margin-bottom: 6px;
  padding-left: 16px;
  position: relative;
  line-height: 1.3;
  
  &::before {
    content: '🤖';
    position: absolute;
    left: 0;
    font-size: 0.7rem;
  }
`;

const PDFButton = styled.button`
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  border: none;
  padding: 20px 40px;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
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
    transition: left 0.5s;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(16, 185, 129, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  }
`;

const PDFButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 48px;
`;

const SuccessMessage = styled.div`
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  padding: 20px;
  border-radius: 16px;
  margin-bottom: 32px;
  border: 1px solid rgba(16, 185, 129, 0.3);
  backdrop-filter: blur(10px);
  font-weight: 500;
`;

const LoadingSpinner = styled.div`
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
  border: 1px solid rgba(239, 68, 68, 0.3);
  backdrop-filter: blur(10px);
`;

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const containerRef = useRef(null);

  const fetchAIAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/ai-analytics');
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching AI analytics:', error);
      setError('Failed to load AI analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPDF(true);
      setPdfSuccess(false);
      await generateAIAnalyticsPDF(analytics, containerRef);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  useEffect(() => {
    fetchAIAnalytics();
  }, []);

  // Removed unused aiFeatures array

  if (loading) {
    return (
      <AIAnalyticsContainer>
        <AIAnalyticsContent>
          <LoadingSpinner>
            🤖 Loading AI Analytics...
          </LoadingSpinner>
        </AIAnalyticsContent>
      </AIAnalyticsContainer>
    );
  }

  if (error) {
    return (
      <AIAnalyticsContainer>
        <AIAnalyticsContent>
          <ErrorMessage>
            ❌ {error}
          </ErrorMessage>
        </AIAnalyticsContent>
      </AIAnalyticsContainer>
    );
  }

  return (
    <AIAnalyticsContainer ref={containerRef}>
      <AIAnalyticsContent>
        <AIAnalyticsHeader>
          <Title>
            AI Analytics
            <NewTag>New</NewTag>
          </Title>
          <Subtitle>
            Advanced AI-powered business intelligence and predictive analytics for data-driven decision making
          </Subtitle>
        </AIAnalyticsHeader>

        <PDFButtonContainer>
          <PDFButton onClick={handleGeneratePDF} disabled={generatingPDF}>
            {generatingPDF ? '🔄 Generating...' : '📄 Generate AI Analytics Report'}
          </PDFButton>
        </PDFButtonContainer>

        {pdfSuccess && (
          <SuccessMessage>
            ✅ AI Analytics report generated successfully!
          </SuccessMessage>
        )}


        <AnalyticsDashboard>
          <DashboardTitle>AI-Powered Business Intelligence</DashboardTitle>
          
          <AIIntelligenceGrid>
            {/* Predictive Sales Analytics */}
            <AIIntelligenceCard gradient="#3b82f6 0%, #60a5fa 50%, #93c5fd 100%">
              <AIIcon bgColor="#3b82f6 0%, #60a5fa 50%, #93c5fd 100%">📈</AIIcon>
              <AITitle>Predictive Sales Analytics</AITitle>
              <AIDescription>
                Advanced AI algorithms analyze historical sales data, seasonal patterns, and market trends to predict future revenue and optimize sales strategies.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#3b82f6">+28.5%</AIMetricValue>
                  <AIMetricLabel>Revenue Forecast</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#10b981">94%</AIMetricValue>
                  <AIMetricLabel>Accuracy Rate</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Key Insights</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>Peak sales expected in Q4 with 35% increase</AIInsightItem>
                  <AIInsightItem>Edibles category showing strongest growth trajectory</AIInsightItem>
                  <AIInsightItem>Weekend sales outperform weekdays by 42%</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>

            {/* AI Pricing Optimization */}
            <AIIntelligenceCard gradient="#8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%">
              <AIIcon bgColor="#8b5cf6 0%, #a78bfa 50%, #c4b5fd 100%">💰</AIIcon>
              <AITitle>AI Pricing Optimization</AITitle>
              <AIDescription>
                Machine learning models analyze competitor pricing, demand elasticity, and customer behavior to recommend optimal pricing strategies for maximum profitability.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#8b5cf6">+18.2%</AIMetricValue>
                  <AIMetricLabel>Profit Margin</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#10b981">R2,450</AIMetricValue>
                  <AIMetricLabel>Avg Order Value</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Pricing Recommendations</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>Premium products can sustain 15% price increase</AIInsightItem>
                  <AIInsightItem>Bundle deals increase conversion by 67%</AIInsightItem>
                  <AIInsightItem>Dynamic pricing during peak hours optimal</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>

            {/* Inventory Intelligence */}
            <AIIntelligenceCard gradient="#06b6d4 0%, #22d3ee 50%, #67e8f9 100%">
              <AIIcon bgColor="#06b6d4 0%, #22d3ee 50%, #67e8f9 100%">📦</AIIcon>
              <AITitle>Inventory Intelligence</AITitle>
              <AIDescription>
                AI-powered demand forecasting and inventory optimization to minimize stockouts, reduce waste, and maximize inventory turnover rates.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#06b6d4">6.8x</AIMetricValue>
                  <AIMetricLabel>Turnover Rate</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#10b981">92%</AIMetricValue>
                  <AIMetricLabel>Stock Accuracy</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Inventory Insights</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>Reorder 15 products within 48 hours</AIInsightItem>
                  <AIInsightItem>Slow-moving inventory identified for clearance</AIInsightItem>
                  <AIInsightItem>Seasonal demand patterns detected</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>

            {/* Customer Behavior Analysis */}
            <AIIntelligenceCard gradient="#f59e0b 0%, #fbbf24 50%, #fcd34d 100%">
              <AIIcon bgColor="#f59e0b 0%, #fbbf24 50%, #fcd34d 100%">👥</AIIcon>
              <AITitle>Customer Behavior Analysis</AITitle>
              <AIDescription>
                Deep learning algorithms analyze customer purchase patterns, preferences, and lifetime value to enable personalized marketing and retention strategies.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#f59e0b">R3,200</AIMetricValue>
                  <AIMetricLabel>Customer LTV</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#10b981">4.7/5</AIMetricValue>
                  <AIMetricLabel>Satisfaction Score</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Behavioral Insights</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>High-value customers prefer premium products</AIInsightItem>
                  <AIInsightItem>Mobile users have 23% higher conversion rate</AIInsightItem>
                  <AIInsightItem>Repeat customers generate 78% of revenue</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>

            {/* Revenue Optimization */}
            <AIIntelligenceCard gradient="#ef4444 0%, #f87171 50%, #fca5a5 100%">
              <AIIcon bgColor="#ef4444 0%, #f87171 50%, #fca5a5 100%">💎</AIIcon>
              <AITitle>Revenue Optimization</AITitle>
              <AIDescription>
                AI analyzes multiple revenue streams, identifies growth opportunities, and provides actionable recommendations to maximize ROI and business profitability.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#ef4444">+31.8%</AIMetricValue>
                  <AIMetricLabel>Revenue Growth</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#10b981">3.2x</AIMetricValue>
                  <AIMetricLabel>ROI Multiplier</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Revenue Opportunities</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>Subscription model could increase revenue by 45%</AIInsightItem>
                  <AIInsightItem>Cross-selling opportunities worth R125K monthly</AIInsightItem>
                  <AIInsightItem>Premium tier customers drive 67% of profits</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>

            {/* Market Trend Analysis */}
            <AIIntelligenceCard gradient="#10b981 0%, #34d399 50%, #6ee7b7 100%">
              <AIIcon bgColor="#10b981 0%, #34d399 50%, #6ee7b7 100%">🌊</AIIcon>
              <AITitle>Market Trend Analysis</AITitle>
              <AIDescription>
                Advanced AI monitors market trends, competitor analysis, and industry developments to provide strategic insights for business growth and competitive advantage.
              </AIDescription>
              <AIMetrics>
                <AIMetric>
                  <AIMetricValue color="#10b981">+42%</AIMetricValue>
                  <AIMetricLabel>Market Share</AIMetricLabel>
                </AIMetric>
                <AIMetric>
                  <AIMetricValue color="#3b82f6">87%</AIMetricValue>
                  <AIMetricLabel>Trend Accuracy</AIMetricLabel>
                </AIMetric>
              </AIMetrics>
              <AIInsights>
                <AIInsightTitle>Market Insights</AIInsightTitle>
                <AIInsightList>
                  <AIInsightItem>Cannabis market growing 28% annually in region</AIInsightItem>
                  <AIInsightItem>CBD products showing strongest demand growth</AIInsightItem>
                  <AIInsightItem>Competitor pricing 12% higher than optimal</AIInsightItem>
                </AIInsightList>
              </AIInsights>
            </AIIntelligenceCard>
          </AIIntelligenceGrid>

          <TrendAnalysis>
            <TrendTitle>Key Business Trends</TrendTitle>
            <TrendItem>
              <TrendLabel>Peak Sales Hours</TrendLabel>
              <TrendValue>2-6 PM</TrendValue>
            </TrendItem>
            <TrendItem>
              <TrendLabel>Top Performing Category</TrendLabel>
              <TrendValue>Edibles (+45%)</TrendValue>
            </TrendItem>
            <TrendItem>
              <TrendLabel>Customer Acquisition Cost</TrendLabel>
              <TrendValue>R125</TrendValue>
            </TrendItem>
            <TrendItem>
              <TrendLabel>Average Order Value</TrendLabel>
              <TrendValue>R450</TrendValue>
            </TrendItem>
            <TrendItem>
              <TrendLabel>Inventory Turnover Rate</TrendLabel>
              <TrendValue>6.2x/year</TrendValue>
            </TrendItem>
          </TrendAnalysis>
        </AnalyticsDashboard>
      </AIAnalyticsContent>
    </AIAnalyticsContainer>
  );
};

export default AIAnalytics;
