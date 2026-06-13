/**
 * ProtectedRoute.tsx
 * 
 * Wrapper component for react-router routes that require authentication.
 * Checks the authStore; if the user is not authenticated, redirects them
 * to the /login page, preserving the routing history.
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
