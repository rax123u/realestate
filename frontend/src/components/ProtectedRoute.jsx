import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false, requireListingAccess = false }) {
  const { user, loading, isAdmin, canManageListings } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-paper)' }}>
        <div className="spinner" aria-label="Loading" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireListingAccess && !canManageListings) return <Navigate to="/" replace />;

  return children;
}
