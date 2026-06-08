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