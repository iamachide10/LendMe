import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WEBSOCKET_URL } from '../utils/constants';
import { useAuthStore } from '../store/authStore';
import { Message } from '../types/message.types';

export const useSocket = (onMessage: (msg: Message) => void) => {
  const clientRef = useRef<Client | null>(null);
  const accessToken = useAuthStore(state => state.accessToken);

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: (str) => console.log('STOMP DEBUG:', str),
      onConnect: () => {
        console.log('STOMP connected!');
        client.subscribe('/user/queue/messages', (frame: IMessage) => {
          const msg: Message = JSON.parse(frame.body);
          onMessage(msg);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP error', frame);
      },
      onWebSocketError: (err) => {
        console.error('WebSocket error', err);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [accessToken]);

  const sendMessage = (receiverId: string, content: string) => {
  console.log('STOMP connected:', clientRef.current?.connected);

  if (!clientRef.current?.connected) {
    console.log('Socket is NOT connected');
    return;
  }

  console.log('Publishing message');

  clientRef.current.publish({
    destination: '/app/chat.send',
    body: JSON.stringify({ receiverId, content }),
  });
};

  return { sendMessage };
};