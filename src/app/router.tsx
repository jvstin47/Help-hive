import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RoleSelection } from '@/features/auth/RoleSelection';
import { Login } from '@/features/auth/Login';
import { Register } from '@/features/auth/Register';
import { ProtectedRoute } from './ProtectedRoute';

// Requester Pages
import { Onboarding } from '@/features/requester/pages/Onboarding';
import { RequesterDashboard } from '@/features/requester/pages/RequesterDashboard';
import { NewRequest } from '@/features/requester/pages/NewRequest';
import { RequestDetails } from '@/features/requester/pages/requests/RequestDetails';
import { Chat } from '@/features/requester/pages/requests/Chat';
import { RequesterProfile } from '@/features/requester/pages/profile/RequesterProfile';

// Volunteer Pages
import { VolunteerDashboard } from '@/features/volunteer/pages/VolunteerDashboard';
import { RequestDiscovery } from '@/features/volunteer/pages/requests/RequestDiscovery';
import { VolunteerRequestDetails } from '@/features/volunteer/pages/requests/VolunteerRequestDetails';
import { VolunteerProfile } from '@/features/volunteer/pages/profile/VolunteerProfile';

export const router = createBrowserRouter([
  {
    path: '/',
    // If we had a landing page, it would go here. For now, redirect to role selection.
    element: <Navigate to="/role-selection" replace />,
  },
  {
    path: '/role-selection',
    element: <RoleSelection />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    element: <ProtectedRoute allowedRoles={['requester']} />,
    children: [
      { path: '/requester/onboarding', element: <Onboarding /> },
      { path: '/requester/dashboard', element: <RequesterDashboard /> },
      { path: '/requester/new-request', element: <NewRequest /> },
      { path: '/requester/requests/:id', element: <RequestDetails /> },
      { path: '/requester/messages/:id', element: <Chat /> },
      { path: '/requester/profile', element: <RequesterProfile /> },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['volunteer']} />,
    children: [
      { path: '/volunteer/dashboard', element: <VolunteerDashboard /> },
      { path: '/volunteer/requests', element: <RequestDiscovery /> },
      { path: '/volunteer/requests/:id', element: <VolunteerRequestDetails /> },
      { path: '/volunteer/messages/:id', element: <Chat /> },
      { path: '/volunteer/profile', element: <VolunteerProfile /> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
