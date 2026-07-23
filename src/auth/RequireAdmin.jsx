import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { canAccessAdmin } from '../utils/permissions';

export function RequireAdmin({ children, onRedirect }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5FBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-500 font-medium text-sm">Verifying authorization...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (onRedirect) {
      setTimeout(() => onRedirect('Login'), 0);
    }
    return null;
  }

  if (!canAccessAdmin(role)) {
    if (onRedirect) {
      setTimeout(() => onRedirect('Home'), 0);
    }
    return null;
  }

  return children;
}
