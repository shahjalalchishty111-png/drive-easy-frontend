import { Navigate } from 'react-router-dom';
import useUserRole from '../../hooks/useUserRole';
import Spinner from '../../components/Spinner';

// /dashboard → send the user to the dashboard matching their backend role.
export default function DashboardIndex() {
  const { role, roleLoading } = useUserRole();
  if (roleLoading) return <Spinner fullscreen label="Loading dashboard…" />;
  return <Navigate to={`/dashboard/${role}`} replace />;
}
