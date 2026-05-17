import { Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

type ProtectedRouteProps = {
  children: ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthLoading, isLoggedIn } = useAuth();
  const location = useLocation();

  if (isAuthLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          <p className="text-sm text-white/60">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}
