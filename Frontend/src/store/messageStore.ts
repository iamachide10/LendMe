import { create } from 'zustand';
import { Conversation, Message } from '../types/message.types';

interface MessageState {
  conversations: Conversation[];
  activeMessages: Message[];
  unreadCount: number;
  setConversations: (conversations: Conversation[]) => void;
  setActiveMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  setUnreadCount: (count: number) => void;
}

export const useMessageStore = create<MessageState>(set => ({
  conversations: [],
  activeMessages: [],
  unreadCount: 0,
  setConversations: conversations => set({ conversations }),
  setActiveMessages: messages => set({ activeMessages: messages }),
  appendMessage: message =>
    set(state => ({ activeMessages: [...state.activeMessages, message] })),
  setUnreadCount: count => set({ unreadCount: count }),
}));