'use client';

import * as React from 'react';

import type { Contact, Message, MessageType, Participant, Thread } from './types';

function noop(): void {
  return undefined;
}

export type CreateThreadParams = { type: 'direct'; recipientId: string } | { type: 'group'; recipientIds: string[] };

export interface CreateMessageParams {
  threadId: string;
  type: MessageType;
  content: string;
}

export interface ChatContextValue {
  contacts: Contact[];
  threads: Thread[];
  messages: Map<string, Message[]>;
  createThread: (params: CreateThreadParams) => string;
  markAsRead: (threadId: string) => void;
  createMessage: (params: CreateMessageParams) => void;
  openDesktopSidebar: boolean;
  setOpenDesktopSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  openMobileSidebar: boolean;
  setOpenMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ChatContext = React.createContext<ChatContextValue>({
  contacts: [],
  threads: [],
  messages: new Map(),
  createThread: noop as () => string,
  markAsRead: noop,
  createMessage: noop,
  openDesktopSidebar: true,
  setOpenDesktopSidebar: noop,
  openMobileSidebar: true,
  setOpenMobileSidebar: noop,
});

export interface ChatProviderProps {
  children: React.ReactNode;
  contacts: Contact[];
  threads: Thread[];
  messages: Message[];
}

const generalResponses = [
  'Ok',
  'Nice',
  'Sounds good!',
  'I agree',
  'Sure',
  'Absolutely',
  'No problem',
  'Got it',
  'Great',
  'Fantastic',
];

export function ChatProvider({
  children,
  contacts: initialContacts = [],
  threads: initialLabels = [],
  messages: initialMessages = [],
}: ChatProviderProps): React.JSX.Element {
  const [contacts, setContacts] = React.useState<Contact[]>(initialContacts);
  const [threads, setThreads] = React.useState<Thread[]>(initialLabels);
  const [messages, setMessages] = React.useState<Map<string, Message[]>>(() =>
    initialMessages.reduce((acc, curr) => {
      const byThread = acc.get(curr.threadId) ?? [];
      byThread.unshift(curr);
      acc.set(curr.threadId, byThread);
      return acc;
    }, new Map<string, Message[]>())
  );
  const [openDesktopSidebar, setOpenDesktopSidebar] = React.useState<boolean>(true);
  const [openMobileSidebar, setOpenMobileSidebar] = React.useState<boolean>(false);

  const handleCreateThread = React.useCallback(
    (params: CreateThreadParams): string => {
      const userId = 'USR-000';

      let thread = threads.find((thread) => {
        if (params.type === 'direct') {
          if (thread.type !== 'direct') {
            return false;
          }
          return thread.participants
            .filter((participant) => participant.id !== userId)
            .find((participant) => participant.id === params.recipientId);
        }

        if (thread.type !== 'group') {
          return false;
        }

        const recipientIds = thread.participants
          .filter((participant) => participant.id !== userId)
          .map((participant) => participant.id);
        if (params.recipientIds.length !== recipientIds.length) {
          return false;
        }

        return params.recipientIds.every((recipientId) => recipientIds.includes(recipientId));
      });

      if (thread) {
        return thread.id;
      }

      const participants: Participant[] = [{ id: 'USR-000', name: 'Sofia Rivers', avatar: '/assets/avatar.png' }];

      if (params.type === 'direct') {
        const contact = contacts.find((contact) => contact.id === params.recipientId);
        if (!contact) {
          throw new Error(`Contact with id "${params.recipientId}" not found`);
        }
        participants.push({ id: contact.id, name: contact.name, avatar: contact.avatar });
      } else {
        params.recipientIds.forEach((recipientId) => {
          const contact = contacts.find((contact) => contact.id === recipientId);
          if (!contact) {
            throw new Error(`Contact with id "${recipientId}" not found`);
          }
          participants.push({ id: contact.id, name: contact.name, avatar: contact.avatar });
        });
      }

      thread = { id: `TRD-${Date.now()}`, type: params.type, participants, unreadCount: 0 } satisfies Thread;

      const updatedThreads = [thread, ...threads];
      setThreads(updatedThreads);

      return thread.id;
    },
    [contacts, threads]
  );

  const handleMarkAsRead = React.useCallback(
    (threadId: string) => {
      const thread = threads.find((thread) => thread.id === threadId);
      if (!thread) {
        return;
      }

      const updatedThreads = threads.map((threadToUpdate) => {
        if (threadToUpdate.id !== threadId) {
          return threadToUpdate;
        }
        return { ...threadToUpdate, unreadCount: 0 };
      });

      setThreads(updatedThreads);
    },
    [threads]
  );

  const handleCreateMessage = React.useCallback(
    (params: CreateMessageParams): void => {
      const newMessage: Message = {
        id: `MSG-${Date.now()}`,
        threadId: params.threadId,
        type: params.type,
        author: { id: 'USR-000', name: 'Sofia Rivers', avatar: '/assets/avatar.png' },
        content: params.content,
        createdAt: new Date(),
      };

      setMessages((prevMessages) => {
        const updatedMessages = new Map(prevMessages);
        const threadMessages = updatedMessages.get(params.threadId) ?? [];
        updatedMessages.set(params.threadId, [...threadMessages, newMessage]);
        return updatedMessages;
      });

      const thread = threads.find((t) => t.id === params.threadId);
      if (thread) {
        const otherParticipants = thread.participants.filter((p) => p.id !== 'USR-000');
        if (otherParticipants.length > 0) {
          const responder = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
          setTimeout(() => {
            const randomResponse = generalResponses[Math.floor(Math.random() * generalResponses.length)];
            const responseMessage: Message = {
              id: `MSG-${Date.now() + 1}`,
              threadId: params.threadId,
              type: 'text',
              author: { id: responder.id, name: responder.name, avatar: responder.avatar },
              content: randomResponse,
              createdAt: new Date(),
            };

            setMessages((prevMessages) => {
              const updatedMessages = new Map(prevMessages);
              const threadMessages = updatedMessages.get(params.threadId) ?? [];
              updatedMessages.set(params.threadId, [...threadMessages, responseMessage]);
              return updatedMessages;
            });
          }, 1000);
        }
      }
    },
    [messages, threads]
  );

  return (
    <ChatContext.Provider
      value={{
        contacts,
        threads,
        messages,
        createThread: handleCreateThread,
        markAsRead: handleMarkAsRead,
        createMessage: handleCreateMessage,
        openDesktopSidebar,
        setOpenDesktopSidebar,
        openMobileSidebar,
        setOpenMobileSidebar,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
