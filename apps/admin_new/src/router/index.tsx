import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Layout from '../components/Layout';
import FilmList from '../pages/film/FilmList';
import CinemaList from '../pages/cinema/CinemaList';
import RoleList from '../pages/system/RoleList';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'films',
        element: <FilmList />,
      },
      {
        path: 'cinemas',
        element: <CinemaList />,
      },
      {
        path: 'roles',
        element: <RoleList />,
      },
      {
        path: '',
        element: <Dashboard />, // Default to dashboard
      }
    ],
  },
]);
