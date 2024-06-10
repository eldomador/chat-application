import type { RouteObject } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

import { Page as NotFoundPage } from '@/pages/not-found';

import { route as authRoute } from './auth';
import { route as dashboardRoute } from './dashboard';

export const routes: RouteObject[] = [
  { path: '/', element: <Navigate to="/chat" replace /> },
  authRoute,
  dashboardRoute,
  { path: '*', element: <NotFoundPage /> },
];
