'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { Archive as ArchiveIcon } from '@phosphor-icons/react/dist/ssr/Archive';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { Camera as CameraIcon } from '@phosphor-icons/react/dist/ssr/Camera';
import { DotsThree as DotsThreeIcon } from '@phosphor-icons/react/dist/ssr/DotsThree';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import { Prohibit as ProhibitIcon } from '@phosphor-icons/react/dist/ssr/Prohibit';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';

import type { User } from '@/types/user';
import { usePopover } from '@/hooks/use-popover';

import { MessageSearch } from './message-search';
import type { Message, Thread } from './types';

const user = {
  id: 'USR-000',
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  email: 'test@mentortools.com',
} satisfies User;

export interface ThreadToolbarProps {
  thread: Thread;
  messages: Message[];
  searchQuery: string;
  searchResults: Message[];
  currentResultIndex: number;
  onSearchChange: (query: string) => void;
  onNextResult: () => void;
  onPreviousResult: () => void;
}

export function ThreadToolbar({
  thread,
  searchQuery,
  searchResults,
  currentResultIndex,
  onSearchChange,
  onNextResult,
  onPreviousResult,
}: ThreadToolbarProps): React.JSX.Element {
  const popover = usePopover<HTMLButtonElement>();
  const recipients = (thread.participants ?? []).filter((participant) => participant.id !== user.id);
  const [showMessageSearch, setMessageSearch] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          alignItems: 'center',
          borderBottom: '1px solid var(--mui-palette-divider)',
          flex: '0 0 auto',
          justifyContent: 'space-between',
          minHeight: '64px',
          px: 2,
          py: 1,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', minWidth: 0 }}>
          <AvatarGroup
            max={2}
            sx={{
              '& .MuiAvatar-root': {
                fontSize: 'var(--fontSize-xs)',
                ...(thread.type === 'group'
                  ? { height: '24px', ml: '-16px', width: '24px', '&:nth-of-type(2)': { mt: '12px' } }
                  : { height: '36px', width: '36px' }),
              },
            }}
          >
            {recipients.map((recipient) => (
              <Avatar key={recipient.id} src={recipient.avatar} />
            ))}
          </AvatarGroup>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap variant="subtitle2">
              {recipients.map((recipient) => recipient.name).join(', ')}
            </Typography>
            {thread.type === 'direct' ? (
              <Typography color="text.secondary" variant="caption">
                Recently active
              </Typography>
            ) : null}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          {showMessageSearch ? (
            <MessageSearch
              searchQuery={searchQuery}
              searchResults={searchResults}
              currentResultIndex={currentResultIndex}
              onSearchChange={onSearchChange}
              onNextResult={onNextResult}
              onPreviousResult={onPreviousResult}
            />
          ) : (
            <IconButton onClick={() => setMessageSearch(true)}>
              <MagnifyingGlassIcon />
            </IconButton>
          )}
          <IconButton>
            <PhoneIcon />
          </IconButton>
          <IconButton>
            <CameraIcon />
          </IconButton>
          <Tooltip title="More options">
            <IconButton onClick={popover.handleOpen} ref={popover.anchorRef}>
              <DotsThreeIcon weight="bold" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
      <Menu anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open}>
        <MenuItem>
          <ListItemIcon>
            <ProhibitIcon />
          </ListItemIcon>
          <Typography>Block</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <TrashIcon />
          </ListItemIcon>
          <Typography>Delete</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ArchiveIcon />
          </ListItemIcon>
          <Typography>Archive</Typography>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <BellIcon />
          </ListItemIcon>
          <Typography>Mute</Typography>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
