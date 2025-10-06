import React, { useEffect, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 20px;
`;

const Header = styled.div`
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

const Tile = styled(Link)`
  display: block;
  text-decoration: none;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 14px;
  padding: 16px;
  color: #e2e8f0;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  &:hover { transform: translateY(-2px); border-color: #10b981; box-shadow: 0 8px 20px rgba(16,185,129,0.25); }
`;

const TileTitle = styled.div`
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #94a3b8;
  margin-bottom: 8px;
`;

const TileValue = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
`;

const Row = styled.div`
  margin-top: 24px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const Card = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
`;

const CardTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1rem;
  margin-bottom: 12px;
`;

const List = styled.div`
  display: grid;
  gap: 10px;
`;

const ListItem = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  color: #e2e8f0;
  text-decoration: none;
  &:hover { border-color: #10b981; }
`;

const Badge = styled.span`
  padding: 6px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(16,185,129,0.15);
  color: #34d399;
`;

const ControlsBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin: 8px 0 16px 0;
`;

const DateField = styled.input`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: #e2e8f0;
  padding: 8px 10px;
  border-radius: 10px;
`;

const SmallButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' : 'rgba(255,255,255,0.06)'};
  color: ${props => props.active ? '#ffffff' : '#94a3b8'};
  border: 1px solid ${props => props.active ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.12)'};
  padding: 8px 10px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
`;

const ChartWrap = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
`;

const ChartTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1rem;
  margin-bottom: 16px;
  position: relative;
  padding-bottom: 6px;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 36px;
    height: 2px;
    background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
    border-radius: 1px;
    opacity: 0.9;
  }
`;

const ChartArea = styled.div`
  height: 300px;
  display: flex;
  align-items: flex-end;
  gap: 6px;
  padding: 0;
  margin-top: 8px;
`;

const Bar = styled.div`
  width: 10px;
  background: linear-gradient(180deg, #10b981 0%, #34d399 100%);
  border-radius: 6px 6px 0 0;
  box-shadow: 0 4px 12px rgba(16,185,129,0.3);
`;

const BarLabel = styled.div`
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
  margin-top: 6px;
`;

const AxisLabel = styled.div`
  font-size: 10px;
  color: #94a3b8;
  text-align: right;
  min-width: 24px;
`;

const Tooltip = styled.div`
  background: rgba(15, 23, 42, 0.95);
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 11px;
  margin-bottom: 6px;
  white-space: nowrap;
`;

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(() => new Date(Date.now() - 7*24*60*60*1000).toISOString().slice(0,10));
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0,10));
  const [trends, setTrends] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartHeightPx = 300;

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/statistics', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load admin stats');
      const data = await res.json();
      setStats(data);
    } catch (e) {
      setStats(null);
    }
  }, []);

  const fetchTrends = useCallback(async () => {
    // Always fetch last 30 days for the Orders per day chart
    try {
      const res = await fetch(`/api/statistics/trends?period=30`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to load trends');
      const data = await res.json();
      setTrends(data);
    } catch (e) {
      setTrends(null);
    }
  }, []);

  useEffect(() => { if (user?.role === 'admin') { fetchStats(); fetchTrends(); } }, [user, fetchStats, fetchTrends]);

  const dailyOrderSeries = useMemo(() => {
    const series = (trends?.dailySales || []).map(d => ({
      date: d.date,
      orders: d.orders
    }));
    const max = Math.max(1, ...series.map(s => s.orders));
    return { series, max };
  }, [trends]);

  const yMax = useMemo(() => Math.max(1, dailyOrderSeries.max), [dailyOrderSeries.max]);

  const yTicks = useMemo(() => {
    const maxTickEven = Math.max(2, Math.ceil(yMax / 2) * 2);
    const ticks = [];
    for (let v = maxTickEven; v >= 0; v -= 2) ticks.push(v);
    return ticks;
  }, [yMax]);

  const recentDisplayOrders = useMemo(() => {
    const orders = stats?.recentOrders || [];
    const statusPriority = {
      pending: 0,
      processing: 1,
      ready: 2, // ready for pick up
      confirmed: 3,
      completed: 4,
      cancelled: 5
    };
    return [...orders]
      .sort((a, b) => {
        const ap = statusPriority[a.status] ?? 99;
        const bp = statusPriority[b.status] ?? 99;
        if (ap !== bp) return ap - bp;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 10);
  }, [stats]);

  if (user?.role !== 'admin') return null;

  return (
    <Container>
      <Content>
        <Header>
          <Title>Admin Dashboard</Title>
        </Header>

        <ControlsBar>
          <SmallButton
            type="button"
            onClick={() => {
              const sd = new Date(); sd.setDate(sd.getDate() - 7);
              setStartDate(sd.toISOString().slice(0,10));
              setEndDate(new Date().toISOString().slice(0,10));
              fetchTrends();
            }}
          >Last 7 days</SmallButton>
          <SmallButton
            type="button"
            onClick={() => {
              const sd = new Date(); sd.setDate(sd.getDate() - 30);
              setStartDate(sd.toISOString().slice(0,10));
              setEndDate(new Date().toISOString().slice(0,10));
              fetchTrends();
            }}
          >Last 30 days</SmallButton>
          <DateField type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
          <span style={{ color:'#94a3b8', fontSize:12 }}>to</span>
          <DateField type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
          <SmallButton type="button" onClick={fetchTrends}>Apply</SmallButton>
        </ControlsBar>

        <Grid>
          <Tile to="/admin/test-order">
            <TileTitle>Total Orders</TileTitle>
            <TileValue>{stats?.totalOrders ?? '—'}</TileValue>
          </Tile>
          <Tile to="/admin/test-order">
            <TileTitle>Pending Orders</TileTitle>
            <TileValue>{stats?.pendingOrders ?? '—'}</TileValue>
          </Tile>
          <Tile to="/statistics">
            <TileTitle>Total Products</TileTitle>
            <TileValue>{stats?.totalProducts ?? '—'}</TileValue>
          </Tile>
          <Tile to="/statistics">
            <TileTitle>Low Stock Items</TileTitle>
            <TileValue>{stats?.lowStockItems ?? '—'}</TileValue>
          </Tile>
          {/* Revenue tile removed per request; date filter above replaces it */}
        </Grid>

        <Row>
          <Card>
            <CardTitle>
              Recent Orders {recentDisplayOrders.length > 0 && (
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>({recentDisplayOrders.length})</span>
              )}
            </CardTitle>
            <List>
              {recentDisplayOrders.map((o) => (
                <ListItem key={o._id} to="/admin/test-order">
                  <span style={{ fontWeight: 600 }}>
                    {o.customerInfo?.firstName || o.user?.firstName || 'Customer'} {o.customerInfo?.lastName || o.user?.lastName || ''}
                  </span>
                  <Badge style={{
                    background: o.status === 'pending' ? 'rgba(245, 158, 11, 0.15)'
                      : o.status === 'confirmed' ? 'rgba(59, 130, 246, 0.15)'
                      : o.status === 'processing' ? 'rgba(99, 102, 241, 0.15)'
                      : o.status === 'ready' ? 'rgba(16, 185, 129, 0.15)'
                      : o.status === 'completed' ? 'rgba(16, 185, 129, 0.20)'
                      : 'rgba(239, 68, 68, 0.15)',
                    color: o.status === 'pending' ? '#f59e0b'
                      : o.status === 'confirmed' ? '#3b82f6'
                      : o.status === 'processing' ? '#6366f1'
                      : o.status === 'ready' ? '#10b981'
                      : o.status === 'completed' ? '#10b981'
                      : '#ef4444'
                  }}>
                    {new Date(o.createdAt).toLocaleDateString()} • {o.status}
                  </Badge>
                </ListItem>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <div style={{ color: '#94a3b8' }}>No recent orders</div>
              )}
            </List>
          </Card>

          <Card>
            <CardTitle>Quick Links</CardTitle>
            <List>
              <ListItem to="/admin/test-order" style={{ padding:'8px' }}><span style={{ fontSize: '0.9rem' }}>Manage Orders</span><Badge>Go</Badge></ListItem>
              <ListItem to="/statistics" style={{ padding:'8px' }}><span style={{ fontSize: '0.9rem' }}>Inventory & Stats</span><Badge>Go</Badge></ListItem>
              <ListItem to="/sales-dashboard" style={{ padding:'8px' }}><span style={{ fontSize: '0.9rem' }}>Sales Analytics</span><Badge>Go</Badge></ListItem>
              <ListItem to="/users" style={{ padding:'8px' }}><span style={{ fontSize: '0.9rem' }}>Users</span><Badge>Go</Badge></ListItem>
            </List>

            <ChartWrap>
              <ChartTitle>Orders per day</ChartTitle>
              <div style={{ display:'flex', alignItems:'flex-end' }}>
                {/* Y-axis with order counts */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', justifyContent:'space-between', height: chartHeightPx, marginRight: 10 }}>
                  {yTicks.map((v) => (
                    <AxisLabel key={v}>{v}</AxisLabel>
                  ))}
                </div>
                <ChartArea>
                  {dailyOrderSeries.series.map((d, idx) => (
                    <div
                      key={idx}
                      style={{ display:'flex', flexDirection:'column', alignItems:'center' }}
                      onMouseEnter={() => setHoveredIndex(idx)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      {hoveredIndex === idx && (
                        <Tooltip>
                          {new Date(d.date).toLocaleDateString(undefined, { month:'short', day:'numeric' })}: {d.orders} orders
                        </Tooltip>
                      )}
                      <Bar style={{ height: `${(d.orders / yMax) * chartHeightPx}px` }} />
                      <BarLabel>{new Date(d.date).toLocaleDateString(undefined, { month:'short', day:'numeric' })}</BarLabel>
                    </div>
                  ))}
                  {dailyOrderSeries.series.length === 0 && (
                    <div style={{ color:'#94a3b8' }}>No data for selected period</div>
                  )}
                </ChartArea>
              </div>
            </ChartWrap>
          </Card>
        </Row>
      </Content>
    </Container>
  );
}
