/**
 * ProtectedRoute Component
 * 
 * Wrapper component that protects routes requiring authentication
 * Redirects unauthenticated users to login page
 * 
 * @module components/common/ProtectedRoute
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/**
 * Props for ProtectedRoute component
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Required user roles (optional) */
  requiredRoles?: string[];
  /** Required single role (simplified) */
  requiredRole?: string;
  /** Redirect path for unauthorized users */
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Checks user authentication and authorization before rendering children
 * Shows loading state during authentication check
 * 
 * @component
 * @example
 * ```tsx
 * <ProtectedRoute requiredRoles={['admin', 'organizer']}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles,
  requiredRole,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <p>Loading...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Check role-based access if required
  const rolesToCheck = requiredRole ? [requiredRole] : requiredRoles || [];
  
  if (rolesToCheck.length > 0) {
    const userRole = user.role?.toLowerCase();
    const hasRequiredRole = rolesToCheck.some(role => {
      const requiredRoleNormalized = role.toLowerCase();
      // Admin has access to everything
      if (userRole === 'admin') return true;
      // Organizer has access to organizer and user content
      if (userRole === 'organizer' && (requiredRoleNormalized === 'organizer' || requiredRoleNormalized === 'user')) return true;
      // User has access only to user content
      return userRole === requiredRoleNormalized;
    });
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render children if authenticated and authorized
  return <>{children}</>;
};