import { Outlet } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

import { Layout as ChatLayout } from '@/components/dashboard/chat/layout';
import { Layout as DashboardLayout } from '@/components/dashboard/layout/layout';

export const route: RouteObject = {
  path: '',
  element: (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
  children: [
    {
      path: 'blank',
      lazy: async () => {
        const { Page } = await import('@/pages/dashboard/blank');
        return { Component: Page };
      },
    },
    {
      path: 'chat',
      element: (
        <ChatLayout>
          <Outlet />
        </ChatLayout>
      ),
      children: [
        {
          index: true,
          lazy: async () => {
            const { Page } = await import('@/pages/dashboard/chat/blank');
            return { Component: Page };
          },
        },
        {
          path: 'compose',
          lazy: async () => {
            const { Page } = await import('@/pages/dashboard/chat/compose');
            return { Component: Page };
          },
        },
        {
          path: ':threadType/:threadId',
          lazy: async () => {
            const { Page } = await import('@/pages/dashboard/chat/thread');
            return { Component: Page };
          },
        },
      ],
    },
  ],
};
