import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';

export const ProtectedRoute: React.FC<{ allowedRoles?: ('requester' | 'volunteer' | 'admin')[] }> = ({ allowedRoles }) => {
  const { session, loading } = useAuth();
  const { role, isLoadingRole } = useRole();
  const location = useLocation();

  if (loading || isLoadingRole) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-pulse bg-primary/20 h-12 w-12 rounded-full mb-4"></div>
        <p className="text-muted-foreground text-lg">Loading securely...</p>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/role-selection" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    // Redirect to their respective dashboard if they try to access a page they don't have permission for
    if (role === 'volunteer') return <Navigate to="/volunteer/dashboard" replace />;
    if (role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/requester/dashboard" replace />;
  }

  return <Outlet />;
};
