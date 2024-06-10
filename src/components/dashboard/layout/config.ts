import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export interface LayoutConfig {
  navItems: NavItemConfig[];
}

export const layoutConfig = {
  navItems: [
    {
      key: 'menu',
      items: [
        {
          key: 'chat',
          title: 'Chat',
          href: paths.authorizedPath.chat.base,
          icon: 'chats-circle',
          matcher: { type: 'startsWith', href: '/chat' },
        },
        {
          key: 'settings',
          title: 'Settings',
          href: paths.authorizedPath.settings.account,
          icon: 'gear',
          matcher: { type: 'startsWith', href: '/settings' },
        },
      ],
    },
  ],
} satisfies LayoutConfig;
