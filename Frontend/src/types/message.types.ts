export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  isRead: boolean;
  sentAt: string;
}

export interface Conversation {
  id: string;
  participant1: string;
  participant2: string;
  otherUserName: string;
  otherUserPhoto?: string;
  lastMessage?: string;
  unreadCount: number;
  createdAt: string;
}