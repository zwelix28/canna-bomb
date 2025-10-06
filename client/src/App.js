import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import AgeVerification from './pages/AgeVerification';
import RoleBasedHome from './components/RoleBasedHome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Inventory from './pages/Inventory';
import Statistics from './pages/Statistics';
import UserManagement from './pages/UserManagement';
import AIAnalytics from './pages/AIAnalytics';
import SalesDashboard from './pages/SalesDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TestOrder from './pages/TestOrder';
import TestStatistics from './pages/TestStatistics';

import ProtectedRoute from './components/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import { isAgeVerified } from './utils/ageVerification';

// Main App Content Component
const AppContent = () => {
  const { user } = useAuth();
  return (
    <div className="App">
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<RoleBasedHome />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          } />
          <Route path="/statistics" element={
            <ProtectedRoute>
              <Statistics />
            </ProtectedRoute>
          } />
          <Route path="/sales-dashboard" element={
            <ProtectedRoute adminOnly>
              <SalesDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/test-order" element={
            <ProtectedRoute adminOnly>
              <TestOrder />
            </ProtectedRoute>
          } />
          <Route path="/admin/advanced-statistics" element={
            <ProtectedRoute adminOnly>
              <TestStatistics />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/ai-analytics" element={
            <ProtectedRoute>
              <AIAnalytics />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      {user?.role !== 'admin' && <Footer />}
    </div>
  );
};

function App() {
  const { loading } = useAuth();
  const [ageVerified, setAgeVerified] = useState(false);
  const [checkingAge, setCheckingAge] = useState(true);

  useEffect(() => {
    // Check age verification status on component mount
    const verified = isAgeVerified();
    setAgeVerified(verified);
    setCheckingAge(false);
  }, []);

  // Listen for storage changes to update age verification status
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'ageVerified') {
        setAgeVerified(e.newValue === 'true');
      }
    };

    const handleAgeVerificationChange = (e) => {
      setAgeVerified(e.detail.verified);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('ageVerificationChanged', handleAgeVerificationChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('ageVerificationChanged', handleAgeVerificationChange);
    };
  }, []);

  if (loading || checkingAge) {
    return <LoadingSpinner />;
  }

  // If age not verified, show age verification page
  if (!ageVerified) {
    return <AgeVerification onAgeVerified={() => setAgeVerified(true)} />;
  }

  // If age verified, show the main app
  return <AppContent />;
}

export default App;
