'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { ChatContext } from './chat-context';
import { MessageAdd } from './message-add';
import { MessageBox } from './message-box';
import { ThreadToolbar } from './thread-toolbar';
import type { Message, MessageType, Thread, ThreadType } from './types';

function useThread(threadId: string): Thread | undefined {
  const { threads } = React.useContext(ChatContext);

  return threads.find((thread) => thread.id === threadId);
}

function useMessages(threadId: string): Message[] {
  const { messages } = React.useContext(ChatContext);

  return messages.get(threadId) ?? [];
}

export interface ThreadViewProps {
  threadId: string;
  threadType: ThreadType;
}

export function ThreadView({ threadId }: ThreadViewProps): React.JSX.Element | null {
  const { createMessage, markAsRead } = React.useContext(ChatContext);

  const thread = useThread(threadId);

  const messages = useMessages(threadId);

  const messagesRef = React.useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Message[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = React.useState(0);

  const handleThreadChange = React.useCallback(() => {
    markAsRead(threadId);
  }, [threadId, markAsRead]);

  React.useEffect(() => {
    handleThreadChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Prevent infinite loop
  }, [threadId]);

  const handleSendMessage = React.useCallback(
    async (type: MessageType, content: string) => {
      createMessage({ threadId, type, content });
    },
    [threadId, createMessage]
  );

  React.useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const results = messages.filter((message) => message.content.toLowerCase().includes(query.toLowerCase()));
      setSearchResults(results);
      setCurrentResultIndex(0);
      if (results.length > 0 && messagesRef.current) {
        const element = document.getElementById(results[0].id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleNextResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentResultIndex + 1) % searchResults.length;
      setCurrentResultIndex(nextIndex);
      const element = document.getElementById(searchResults[nextIndex].id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handlePreviousResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = (currentResultIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentResultIndex(prevIndex);
      const element = document.getElementById(searchResults[prevIndex].id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (!thread) {
    return (
      <Box sx={{ alignItems: 'center', display: 'flex', flex: '1 1 auto', justifyContent: 'center' }}>
        <Typography color="textSecondary" variant="h6">
          Thread not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', minHeight: 0 }}>
      <ThreadToolbar
        messages={messages}
        thread={thread}
        searchQuery={searchQuery}
        searchResults={searchResults}
        currentResultIndex={currentResultIndex}
        onSearchChange={handleSearchChange}
        onNextResult={handleNextResult}
        onPreviousResult={handlePreviousResult}
      />
      <Stack ref={messagesRef} spacing={2} sx={{ flex: '1 1 auto', overflowY: 'auto', p: 3 }}>
        {messages.map((message) => (
          <MessageBox key={message.id} message={message} searchQuery={searchQuery} />
        ))}
      </Stack>
      <MessageAdd onSend={handleSendMessage} />
    </Box>
  );
}
