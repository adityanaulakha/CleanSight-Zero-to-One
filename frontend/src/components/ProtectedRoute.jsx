import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required but user doesn't have the right role
  if (allowedRoles.length > 0 && (!userRole || !allowedRoles.includes(userRole))) {
    // Redirect to appropriate dashboard based on user's actual role
    if (user && userRole) {
      const roleRoutes = {
        'citizen': '/dashboard',
        'ragpicker': '/r/tasks',
        'institution': '/org/dashboard',
        'admin': '/admin/overview'
      };
      return <Navigate to={roleRoutes[userRole] || '/dashboard'} replace />;
    }
    
    // If no valid role, redirect to login
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
