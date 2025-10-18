import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  // Don't render children until auth check is complete
  // This prevents useEffect hooks from firing before redirect
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
