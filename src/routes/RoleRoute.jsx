import { Navigate } from 'react-router-dom';
import useUserRole from '../hooks/useUserRole';
import Spinner from '../components/Spinner';

// Guards a route to specific roles. Assumes it is already inside a PrivateRoute
// (so a user is signed in). Redirects mismatched roles to their own dashboard.
export default function RoleRoute({ children, allow = [] }) {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) return <Spinner fullscreen label="Checking access…" />;

  if (!allow.includes(role)) {
    return <Navigate to={`/dashboard/${role}`} replace />;
  }

  return children;
}
