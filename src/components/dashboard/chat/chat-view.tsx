'use client';

import * as React from 'react';
import { Avatar, Badge, Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { Stack } from '@mui/system';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { User } from '@/types/user';
import { paths } from '@/paths';
import { useMediaQuery } from '@/hooks/use-media-query';
import { usePathname } from '@/hooks/use-pathname';
import { usePopover } from '@/hooks/use-popover';

import { UserPopover } from '../layout/user-popover/user-popover';
import { ChatContext } from './chat-context';
import { Sidebar } from './sidebar';

export interface ChatViewProps {
  children: React.ReactNode;
}

export function ChatView({ children }: ChatViewProps): React.JSX.Element {
  const {
    contacts,
    threads,
    messages,
    createThread,
    openDesktopSidebar,
    setOpenDesktopSidebar,
    openMobileSidebar,
    setOpenMobileSidebar,
  } = React.useContext(ChatContext);

  const navigate = useNavigate();

  const pathname = usePathname();

  // The layout does not have a direct access to the current thread id param, we need to extract it from the pathname.
  const segments = pathname.split('/').filter(Boolean);
  const currentThreadId = segments.length === 4 ? segments[segments.length - 1] : undefined;

  const mdDown = useMediaQuery('down', 'md');

  const handleContactSelect = React.useCallback(
    (contactId: string) => {
      const threadId = createThread({ type: 'direct', recipientId: contactId });

      navigate(paths.authorizedPath.chat.thread('direct', threadId));
    },
    [navigate, createThread]
  );

  const handleThreadSelect = React.useCallback(
    (threadType: string, threadId: string) => {
      navigate(paths.authorizedPath.chat.thread(threadType, threadId));
    },
    [navigate]
  );

  const user = {
    id: 'USR-000',
    name: 'Sofia Rivers',
    avatar: '/assets/avatar.png',
    email: 'test@mentortools.com',
  } satisfies User;

  function UserButton(): React.JSX.Element {
    const popover = usePopover<HTMLButtonElement>();

    return (
      <React.Fragment>
        <Box
          component="button"
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          sx={{ border: 'none', background: 'transparent', cursor: 'pointer', p: 0 }}
        >
          <Badge
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            color="success"
            sx={{
              '& .MuiBadge-dot': {
                border: '2px solid var(--MainNav-background)',
                borderRadius: '50%',
                bottom: '6px',
                height: '12px',
                right: '6px',
                width: '12px',
              },
            }}
            variant="dot"
          >
            <Avatar src={user.avatar} />
          </Badge>
        </Box>
        <UserPopover anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open} />
      </React.Fragment>
    );
  }

  return (
    <Box sx={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
      <Sidebar
        contacts={contacts}
        currentThreadId={currentThreadId}
        messages={messages}
        onCloseMobile={() => {
          setOpenMobileSidebar(false);
        }}
        onSelectContact={handleContactSelect}
        onSelectThread={handleThreadSelect}
        openDesktop={openDesktopSidebar}
        openMobile={openMobileSidebar}
        threads={threads}
      />
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', overflow: 'hidden' }}>
        <Box
          sx={{
            borderBottom: '1px solid var(--mui-palette-divider)',
            display: 'flex',
            justifyContent: 'space-between',
            flex: '0 0 auto',
            p: 2,
          }}
        >
          <IconButton
            onClick={() => {
              if (mdDown) {
                setOpenMobileSidebar((prev) => !prev);
              } else {
                setOpenDesktopSidebar((prev) => !prev);
              }
            }}
          >
            <ListIcon />
          </IconButton>
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: 'center', flex: '1 1 auto', justifyContent: 'flex-end' }}
          >
            <UserButton />
          </Stack>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
