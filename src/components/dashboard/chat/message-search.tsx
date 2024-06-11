import * as React from 'react';
import { InputAdornment, OutlinedInput } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

import { Message } from './types';

export interface MessageSearchProps {
  searchQuery: string;
  searchResults: Message[];
  currentResultIndex: number;
  onSearchChange: (query: string) => void;
  onNextResult: () => void;
  onPreviousResult: () => void;
}

export function MessageSearch({
  searchQuery,
  searchResults,
  currentResultIndex,
  onSearchChange,
  onNextResult,
  onPreviousResult,
}: MessageSearchProps): React.JSX.Element {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearchChange(query);
  };

  return (
    <React.Fragment>
      <OutlinedInput
        placeholder="Search messages"
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
      />
      {searchResults.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2">
            {currentResultIndex + 1}/{searchResults.length}
          </Typography>
          <IconButton onClick={onPreviousResult}>
            <Typography>{'<'}</Typography>
          </IconButton>
          <IconButton onClick={onNextResult}>
            <Typography>{'>'}</Typography>
          </IconButton>
        </Box>
      )}
    </React.Fragment>
  );
}
