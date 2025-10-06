import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Home from '../pages/Home';

const RoleBasedHome = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is authenticated and is admin, redirect to admin dashboard
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // If user is admin, don't render anything (will redirect)
  if (isAuthenticated && user?.role === 'admin') {
    return null;
  }

  // For non-admin users or unauthenticated users, show the regular home page
  return <Home />;
};

export default RoleBasedHome;
