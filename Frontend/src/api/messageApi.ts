import axiosInstance from './axiosInstance';
import { Conversation, Message } from '../types/message.types';

export const getConversations = async (): Promise<Conversation[]> => {
  const res = await axiosInstance.get('/conversations');
  return res.data;
};

export const getMessages = async (conversationId: string): Promise<Message[]> => {
  const res = await axiosInstance.get(`/conversations/${conversationId}/messages`);
  return res.data;
};

export const sendMessageRest = async (
  receiverId: string,
  content: string
): Promise<Message> => {
  const res = await axiosInstance.post('/conversations/send', {
    receiverId,
    content,
  });
  return res.data;
};

export const startConversation = async (receiverId: string): Promise<Conversation> => {
  const res = await axiosInstance.post(`/conversations/start/${receiverId}`);
  return res.data;
};

export const markConversationAsRead = async (conversationId: string): Promise<void> => {
  await axiosInstance.put(`/conversations/${conversationId}/read`);
};