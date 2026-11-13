import { Navigate, Outlet } from 'react-router-dom';

import { useAuth } from './AuthContext';

type RequireAuthProps = { ownerOnly?: boolean };

export default function RequireAuth({ ownerOnly = false }: RequireAuthProps) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (ownerOnly && !user.is_owner) return <Navigate to="/" replace />;

  return <Outlet />;
}
