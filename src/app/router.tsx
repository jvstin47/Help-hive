import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

const RoleSelection = React.lazy(() => import('@/features/auth/RoleSelection').then(m => ({ default: m.RoleSelection })));
const Login = React.lazy(() => import('@/features/auth/Login').then(m => ({ default: m.Login })));
const Register = React.lazy(() => import('@/features/auth/Register').then(m => ({ default: m.Register })));

const Onboarding = React.lazy(() => import('@/features/requester/pages/Onboarding').then(m => ({ default: m.Onboarding })));
const RequesterDashboard = React.lazy(() => import('@/features/requester/pages/RequesterDashboard').then(m => ({ default: m.RequesterDashboard })));
const NewRequest = React.lazy(() => import('@/features/requester/pages/NewRequest').then(m => ({ default: m.NewRequest })));
const RequestDetails = React.lazy(() => import('@/features/requester/pages/requests/RequestDetails').then(m => ({ default: m.RequestDetails })));
const Chat = React.lazy(() => import('@/features/requester/pages/requests/Chat').then(m => ({ default: m.Chat })));
const RequesterProfile = React.lazy(() => import('@/features/requester/pages/profile/RequesterProfile').then(m => ({ default: m.RequesterProfile })));

const VolunteerDashboard = React.lazy(() => import('@/features/volunteer/pages/VolunteerDashboard').then(m => ({ default: m.VolunteerDashboard })));
const RequestDiscovery = React.lazy(() => import('@/features/volunteer/pages/requests/RequestDiscovery').then(m => ({ default: m.RequestDiscovery })));
const VolunteerRequestDetails = React.lazy(() => import('@/features/volunteer/pages/requests/VolunteerRequestDetails').then(m => ({ default: m.VolunteerRequestDetails })));
const VolunteerProfile = React.lazy(() => import('@/features/volunteer/pages/profile/VolunteerProfile').then(m => ({ default: m.VolunteerProfile })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
  </div>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6 text-center">
    <h1 className="text-4xl font-black text-stone-900 mb-4">404 - Page Not Found</h1>
    <p className="text-lg text-stone-500 mb-8">The page you're looking for doesn't exist.</p>
    <a href="/" className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-colors">
      Go back home
    </a>
  </div>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/role-selection" replace />,
  },
  {
    path: '/role-selection',
    element: withSuspense(RoleSelection),
  },
  {
    path: '/login',
    element: withSuspense(Login),
  },
  {
    path: '/register',
    element: withSuspense(Register),
  },
  {
    element: <ProtectedRoute allowedRoles={['requester']} />,
    children: [
      { path: '/requester/onboarding', element: withSuspense(Onboarding) },
      { path: '/requester/dashboard', element: withSuspense(RequesterDashboard) },
      { path: '/requester/new-request', element: withSuspense(NewRequest) },
      { path: '/requester/requests/:id', element: withSuspense(RequestDetails) },
      { path: '/requester/messages/:id', element: withSuspense(Chat) },
      { path: '/requester/profile', element: withSuspense(RequesterProfile) },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['volunteer']} />,
    children: [
      { path: '/volunteer/dashboard', element: withSuspense(VolunteerDashboard) },
      { path: '/volunteer/requests', element: withSuspense(RequestDiscovery) },
      { path: '/volunteer/requests/:id', element: withSuspense(VolunteerRequestDetails) },
      { path: '/volunteer/messages/:id', element: withSuspense(Chat) },
      { path: '/volunteer/profile', element: withSuspense(VolunteerProfile) },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
