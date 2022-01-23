import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardApp from './pages/DashboardApp';
import Products from './pages/Products';
import DocUploads from './pages/DocUploads';
import Blog from './pages/Blog';
import ViewUploads from './pages/ViewUploads';

import Requests from './pages/Requests';
import Upload from './pages/UploadStepper';
import NotFound from './pages/Page404';
import Profile from './pages/Profile';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" replace /> },
        { path: 'app', element: <DashboardApp /> },
        { path: 'requests', element: <Requests /> },
        { path: 'profile', element: <Profile /> },
        { path: 'products', element: <Products /> },
        { path: 'documents', element: <DocUploads /> },
        { path: 'upload', element: <Upload /> },
        { path: 'viewuploads', element: <ViewUploads /> },

        { path: 'blog', element: <Blog /> }
      ]
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: '404', element: <NotFound /> },
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: '*', element: <Navigate to="/404" /> }
      ]
    },
    { path: '*', element: <Navigate to="/404" replace /> }
  ]);
}
