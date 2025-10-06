import React, { useEffect, useMemo, useState, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/axios';
import { RiTimer2Line, RiCheckLine, RiTruckLine, RiCheckboxCircleLine, RiCloseLine, RiSearchLine } from 'react-icons/ri';

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0b1222 0%, #0f172a 50%, #1e293b 100%);
`;

const Wrap = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ffffff 0%, #10b981 60%, #34d399 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 20px;
  height: calc(100vh - 120px);
  @media (max-width: 1024px) { 
    grid-template-columns: 1fr; 
    height: auto;
  }
`;

const Panel = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const DetailPanel = styled(Panel)`
  height: 100%;
  overflow: auto;
`;

const SectionTitle = styled.h3`
  color: #e2e8f0;
  font-size: 1rem;
  margin-bottom: 12px;
`;

const SearchWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 12px;
  padding: 8px 12px;
  color: #e2e8f0;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #e2e8f0;
  font-size: 14px;
`;

const OrdersList = styled.div`
  display: grid;
  gap: 8px;
  flex: 1;
  overflow: auto;
  padding-right: 4px;
`;

const Row = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 8px;
  align-items: center;
  padding: 10px;
  border-radius: 12px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  color: #e2e8f0;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
  &:hover { border-color: #10b981; box-shadow: 0 6px 16px rgba(16,185,129,0.20); }
  &:focus { outline: none; box-shadow: 0 0 0 2px rgba(16,185,129,0.35); }
`;

const OrderNum = styled.div`
  font-weight: 700;
  color: #ffffff;
`;

const OrderMeta = styled.div`
  color: #94a3b8;
  font-size: 11px;
`;

const Badge = styled.span`
  padding: 4px 8px;
  border-radius: 10px;
  font-size: 11px;
  border: 1px solid;
  background: ${p => p.status === 'pending' ? 'rgba(245, 158, 11, 0.15)'
    : p.status === 'confirmed' ? 'rgba(59, 130, 246, 0.15)'
    : p.status === 'processing' ? 'rgba(99, 102, 241, 0.15)'
    : p.status === 'ready' ? 'rgba(16, 185, 129, 0.15)'
    : p.status === 'completed' ? 'rgba(16, 185, 129, 0.20)'
    : 'rgba(239, 68, 68, 0.15)'};
  color: ${p => p.status === 'pending' ? '#fbbf24'
    : p.status === 'confirmed' ? '#60a5fa'
    : p.status === 'processing' ? '#6366f1'
    : p.status === 'ready' ? '#34d399'
    : p.status === 'completed' ? '#34d399'
    : '#fca5a5'};
  border-color: ${p => p.status === 'pending' ? 'rgba(245, 158, 11, 0.3)'
    : p.status === 'confirmed' ? 'rgba(59, 130, 246, 0.3)'
    : p.status === 'processing' ? 'rgba(99, 102, 241, 0.3)'
    : p.status === 'ready' ? 'rgba(16, 185, 129, 0.3)'
    : p.status === 'completed' ? 'rgba(16, 185, 129, 0.3)'
    : 'rgba(239, 68, 68, 0.3)'};
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  min-height: 36px; /* reserve space to avoid shift when badge renders */
`;

const Stepper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 32px; /* reserve vertical space to avoid bounce when active styles change */
`;

const Step = styled.button`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${p => p.active ? '#10b981' : 'rgba(255,255,255,0.25)'};
  background: ${p => p.active ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.08)'};
  color: ${p => p.active ? '#10b981' : '#e2e8f0'};
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover { border-color: #10b981; color: #10b981; transform: translateY(-1px); }
`;

const Divider = styled.div`
  width: 16px;
  height: 2px;
  border-radius: 2px;
  background: ${p => p.filled ? '#10b981' : 'rgba(255,255,255,0.25)'};
`;

const Section = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px;
  margin-top: 8px;
  color: #e2e8f0;
  will-change: contents; /* hint to avoid jitter on content update */
`;

const Items = styled.div`
  display: grid;
  gap: 8px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
`;

export default function TestOrder() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const isAdmin = user?.role === 'admin';

  const loadOrders = useCallback(async () => {
    try {
      const res = await api.get('/api/orders/admin');
      const list = res.data?.orders || [];
      setOrders(list);
    } catch (e) {
      setOrders([]);
    }
  }, []);

  const refreshSelected = useCallback(() => {
    if (!selected) return;
    const refreshed = orders.find(o => o._id === selected._id);
    if (refreshed) setSelected(refreshed);
  }, [selected, orders]);

  useEffect(() => { if (isAdmin) { loadOrders(); } }, [isAdmin, loadOrders]);
  useEffect(() => { refreshSelected(); }, [refreshSelected]);
  useEffect(() => {
    if (!isAdmin) return;
    // avoid refresh right after selection to reduce perceived jitter
    let pending = false;
    const id = setInterval(async () => {
      if (pending) return;
      pending = true;
      await loadOrders();
      pending = false;
    }, 20000);
    return () => clearInterval(id);
  }, [isAdmin, loadOrders]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let filteredOrders = q ? orders.filter(o => {
      const num = (o.orderNumber || '').toLowerCase();
      const name = `${o.customerInfo?.firstName || ''} ${o.customerInfo?.lastName || ''}`.toLowerCase();
      return num.includes(q) || name.includes(q);
    }) : orders;
    
    // Sort by status priority: pending, processing, ready, confirmed, completed, cancelled
    const statusPriority = {
      pending: 0,
      processing: 1,
      ready: 2,
      confirmed: 3,
      completed: 4,
      cancelled: 5
    };
    
    return filteredOrders.sort((a, b) => {
      const priorityA = statusPriority[a.status] ?? 99;
      const priorityB = statusPriority[b.status] ?? 99;
      if (priorityA !== priorityB) return priorityA - priorityB;
      return new Date(b.createdAt) - new Date(a.createdAt); // newest first within same status
    });
  }, [orders, search]);

  // Auto-select first order when orders load
  useEffect(() => {
    if (filtered.length > 0 && !selected) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const statusIcon = useMemo(() => ({
    pending: <RiTimer2Line />, confirmed: <RiCheckLine />, processing: <RiTruckLine />, ready: <RiCheckboxCircleLine />, completed: <RiCheckboxCircleLine />, cancelled: <RiCloseLine />
  }), []);

  const updateStatus = async (orderId, status) => {
    if (isClicking) return; // prevent rapid re-click jitter
    setIsClicking(true);
    setUpdating(true);
    try {
      await api.put(`/api/orders/${orderId}/status`, { status });
      await loadOrders();
      // Refresh selected order after status update
      setTimeout(() => refreshSelected(), 100);
    } catch {}
    setUpdating(false);
    setTimeout(() => setIsClicking(false), 250);
  };

  const stages = ['pending','confirmed','processing','ready','completed'];

  if (!isAdmin) return null;

  return (
    <Page>
      <Wrap>
        <Header>
          <Title>Order Management</Title>
          <SearchWrap>
            <RiSearchLine />
            <SearchInput value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order number or recipient" />
          </SearchWrap>
        </Header>

        <Layout>
          <Panel>
            <SectionTitle>Orders</SectionTitle>
            <OrdersList>
              {filtered.map(o => (
                <Row key={o._id} onClick={() => setSelected(o)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(o); }}>
                  <OrderNum>{o.orderNumber}</OrderNum>
                  <OrderMeta>{(o.customerInfo?.firstName || '') + ' ' + (o.customerInfo?.lastName || '')}</OrderMeta>
                  <Badge status={o.status}>{statusIcon[o.status]} <span style={{ marginLeft: 4, textTransform: 'capitalize' }}>{o.status}</span></Badge>
                  <div style={{ gridColumn: '1 / -1', color: '#94a3b8', fontSize: 10, marginTop: 2 }}>{new Date(o.createdAt).toLocaleDateString()}</div>
                </Row>
              ))}
              {filtered.length === 0 && (
                <div style={{ color:'#94a3b8' }}>No orders</div>
              )}
            </OrdersList>
          </Panel>

          <DetailPanel>
            <SectionTitle>Details</SectionTitle>
            {!selected && (
              <div style={{ color:'#94a3b8' }}>Select an order to view and manage</div>
            )}
            {selected && (
              <>
                <DetailHeader>
                  <div style={{ color:'#e2e8f0', fontWeight: 700 }}>{selected.orderNumber}</div>
                  <Badge status={selected.status}>{statusIcon[selected.status]} <span style={{ marginLeft: 6, textTransform:'capitalize' }}>{selected.status}</span></Badge>
                </DetailHeader>

                <Stepper>
                  {stages.map((stage, idx, arr) => {
                    const active = arr.indexOf(selected.status) >= idx;
                    const onClick = () => updateStatus(selected._id, stage);
                    return (
                      <React.Fragment key={stage}>
                        <Step type="button" active={active} title={stage} onClick={onClick}>{idx+1}</Step>
                        {idx < arr.length - 1 && (
                          <Divider filled={arr.indexOf(selected.status) > idx} />
                        )}
                      </React.Fragment>
                    );
                  })}
                  <Step type="button" title="Cancel" onClick={() => updateStatus(selected._id, 'cancelled')}><RiCloseLine /></Step>
                </Stepper>

                <Section>
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>Recipient</div>
                  <div style={{ fontSize: 13 }}>{selected.customerInfo?.firstName || 'N/A'} {selected.customerInfo?.lastName || ''}</div>
                  <div style={{ color:'#94a3b8', fontSize: 11 }}>{selected.customerInfo?.email || 'N/A'}</div>
                </Section>

                <Section>
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>Collection</div>
                  <div style={{ fontSize: 12 }}>Method: {selected.collectionMethod || 'N/A'}</div>
                  <div style={{ fontSize: 12 }}>Date: {selected.collectionDate || 'N/A'}</div>
                  <div style={{ fontSize: 12 }}>Time: {selected.collectionTime || 'N/A'}</div>
                  {selected.orderNotes && <div style={{ fontSize: 12 }}>Notes: {selected.orderNotes}</div>}
                </Section>

                <Section>
                  <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 13 }}>Items ({selected.items?.length || 0})</div>
                  <Items>
                    {(selected.items || []).map((it, i) => (
                      <Item key={i}>
                        <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                          <img src={it.image || '/placeholder-product.svg'} alt={it.name} width={28} height={28} style={{ borderRadius: 4, objectFit:'cover' }} onError={(e) => { e.currentTarget.src = '/placeholder-product.svg'; }} />
                          <div>
                            <div style={{ fontWeight:600, fontSize: 12 }}>{it.name || 'Unknown Item'}</div>
                            <div style={{ color:'#94a3b8', fontSize:10 }}>Qty: {it.quantity || 0}</div>
                          </div>
                        </div>
                        <div style={{ fontWeight:700, fontSize: 12 }}>R{(it.total || 0).toFixed(2)}</div>
                      </Item>
                    ))}
                  </Items>
                </Section>

                <Section>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontWeight:700, fontSize: 13 }}>Total</div>
                    <div style={{ fontWeight:800, color:'#10b981', fontSize: 14 }}>R{(selected.total || 0).toFixed(2)}</div>
                  </div>
                </Section>
                {updating && <div style={{ marginTop:8, color:'#94a3b8', fontSize:12 }}>Updating...</div>}
              </>
            )}
          </DetailPanel>
        </Layout>
      </Wrap>
    </Page>
  );
}


