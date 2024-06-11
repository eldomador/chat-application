import * as React from 'react';
import { OutlinedInput } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { CaretLeft } from '@phosphor-icons/react/dist/ssr/CaretLeft';
import { CaretRight } from '@phosphor-icons/react/dist/ssr/CaretRight';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import { Message } from './types';

export interface MessageSearchProps {
  searchQuery: string;
  searchResults: Message[];
  currentResultIndex: number;
  onSearchChange: (query: string) => void;
  onNextResult: () => void;
  onPreviousResult: () => void;
  onCloseSearch: () => void;
}

export function MessageSearch({
  searchQuery,
  searchResults,
  currentResultIndex,
  onSearchChange,
  onNextResult,
  onPreviousResult,
  onCloseSearch,
}: MessageSearchProps): React.JSX.Element {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    onSearchChange(query);
  };
  const searchResultsExist = searchResults.length > 0;

  return (
    <React.Fragment>
      <OutlinedInput
        placeholder="Search messages"
        size="small"
        value={searchQuery}
        onChange={handleSearchChange}
        endAdornment={
          searchResultsExist && (
            <Typography variant="body2">
              {currentResultIndex + 1}/{searchResults.length}
            </Typography>
          )
        }
        sx={{ width: 200 }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton disabled={!searchResultsExist} size="small" onClick={onPreviousResult}>
          <CaretLeft size={32} />
        </IconButton>
        <IconButton disabled={!searchResultsExist} size="small" onClick={onNextResult}>
          <CaretRight size={32} />
        </IconButton>
        <IconButton size="small" onClick={onCloseSearch}>
          <XIcon size={32} />
        </IconButton>
      </Box>
    </React.Fragment>
  );
}
