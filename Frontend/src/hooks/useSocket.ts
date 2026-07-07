import { useEffect, useRef } from 'react';
import { Message } from '../types/message.types';
import { getMessages, sendMessageRest } from '../api/messageApi';

const POLL_INTERVAL = 3000; // Poll every 3 seconds

export const useSocket = (
  onMessage: (msg: Message) => void,
  conversationId: string,
  lastMessageId: string | null
) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMessageIdRef = useRef<string | null>(lastMessageId);

  useEffect(() => {
    lastMessageIdRef.current = lastMessageId;
  }, [lastMessageId]);

  useEffect(() => {
    if (!conversationId) return;

    const poll = async () => {
      try {
        const messages = await getMessages(conversationId);
        if (messages.length > 0) {
          const latest = messages[messages.length - 1];
          if (latest.id !== lastMessageIdRef.current) {
            lastMessageIdRef.current = latest.id;
            onMessage(latest);
          }
        }
      } catch {
        console.error('Polling failed');
      }
    };

    intervalRef.current = setInterval(poll, POLL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversationId]);

  const sendMessage = async (receiverId: string, content: string) => {
    return sendMessageRest(receiverId, content);
  };

  return { sendMessage };
};