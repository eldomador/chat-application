'use client';

import * as React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import type { Message } from './types';

export interface MessageSearchProps {
  isFocused?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClickAway?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onSelect?: (result: Message) => void;
  query?: string;
  results?: Message[];
}

export const MessageSearch = React.forwardRef<HTMLDivElement, MessageSearchProps>(function MessageSearch(
  {
    onChange,
    onClickAway = () => {
      // noop
    },
    onFocus,
    query = '',
    results = [],
    onSelect = () => {
      // noop
    },
  },
  ref
) {
  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <Stack ref={ref} spacing={2} tabIndex={-1}>
        <OutlinedInput
          onChange={onChange}
          onFocus={onFocus}
          placeholder="Search messages"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          value={query}
        />
        {results.length > 0 && (
          <List>
            {results.map((result) => (
              <ListItem key={result.id}>
                <ListItemButton onClick={() => onSelect(result)}>
                  <ListItemText primary={result.content} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </ClickAwayListener>
  );
});
