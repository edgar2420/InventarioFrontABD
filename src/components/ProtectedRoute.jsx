import { Navigate } from 'react-router-dom';
import useAuth from '../../useAuth';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authState, loading } = useAuth();
  const { isAuthenticated, role } = authState;

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/publico-dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
