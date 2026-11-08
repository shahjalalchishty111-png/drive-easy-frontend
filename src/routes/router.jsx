import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import NotFound from '../components/NotFound';
import AuthPage from '../pages/auth/AuthPage';
import HomePage from '../pages/home/HomePage';
import About from '../pages/About';
import CarsPage from '../pages/cars/CarsPage';
import CarDetailPage from '../pages/cars/CarDetailPage';
import CheckoutPage from '../pages/cars/CheckoutPage';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

import DashboardIndex from '../pages/dashboard/DashboardIndex';
import Settings from '../pages/dashboard/Settings';
import UserDashboard from '../pages/dashboard/UserDashboard';
import UserBookings from '../pages/dashboard/UserBookings';
import UserReviews from '../pages/dashboard/UserReviews';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import AdminUsers from '../pages/dashboard/AdminUsers';
import AdminBookings from '../pages/dashboard/AdminBookings';
import AdminCars from '../pages/dashboard/AdminCars';
import AdminReviews from '../pages/dashboard/AdminReviews';
import AgencyDashboard from '../pages/dashboard/AgencyDashboard';
import AgencyFleet from '../pages/dashboard/AgencyFleet';
import AgencyAddCar from '../pages/dashboard/AgencyAddCar';
import AgencyEditCar from '../pages/dashboard/AgencyEditCar';
import AgencyBookings from '../pages/dashboard/AgencyBookings';
import AgencyReviews from '../pages/dashboard/AgencyReviews';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthPage />,
  },

  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <About /> },
      { path: 'cars', element: <CarsPage /> },
      { path: 'cars/:id', element: <CarDetailPage /> },
      {
        path: 'checkout/:id',
        element: (
          <PrivateRoute>
            <CheckoutPage />
          </PrivateRoute>
        ),
      },
      { path: '*', element: <NotFound /> },
    ],
  },

  // Dashboard (protected)
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardIndex /> },

      // Customer
      { path: 'user', element: <RoleRoute allow={['user', 'admin', 'agency']}><UserDashboard /></RoleRoute> },
      { path: 'user/bookings', element: <RoleRoute allow={['user', 'admin', 'agency']}><UserBookings /></RoleRoute> },
      { path: 'user/reviews', element: <RoleRoute allow={['user', 'admin', 'agency']}><UserReviews /></RoleRoute> },
      { path: 'user/settings', element: <Settings /> },

      // Admin
      { path: 'admin', element: <RoleRoute allow={['admin']}><AdminDashboard /></RoleRoute> },
      { path: 'admin/users', element: <RoleRoute allow={['admin']}><AdminUsers /></RoleRoute> },
      { path: 'admin/bookings', element: <RoleRoute allow={['admin']}><AdminBookings /></RoleRoute> },
      { path: 'admin/cars', element: <RoleRoute allow={['admin']}><AdminCars /></RoleRoute> },
      { path: 'admin/reviews', element: <RoleRoute allow={['admin']}><AdminReviews /></RoleRoute> },
      { path: 'admin/settings', element: <RoleRoute allow={['admin']}><Settings /></RoleRoute> },

      // Agency
      { path: 'agency', element: <RoleRoute allow={['agency']}><AgencyDashboard /></RoleRoute> },
      { path: 'agency/fleet', element: <RoleRoute allow={['agency']}><AgencyFleet /></RoleRoute> },
      { path: 'agency/add-car', element: <RoleRoute allow={['agency']}><AgencyAddCar /></RoleRoute> },
      { path: 'agency/edit-car/:id', element: <RoleRoute allow={['agency']}><AgencyEditCar /></RoleRoute> },
      { path: 'agency/bookings', element: <RoleRoute allow={['agency']}><AgencyBookings /></RoleRoute> },
      { path: 'agency/reviews', element: <RoleRoute allow={['agency']}><AgencyReviews /></RoleRoute> },
      { path: 'agency/settings', element: <RoleRoute allow={['agency']}><Settings /></RoleRoute> },
    ],
  },
]);

export default router;
