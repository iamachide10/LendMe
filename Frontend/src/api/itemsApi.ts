import axiosInstance from './axiosInstance';
import { Item, CreateItemRequest, ItemFilters } from '../types/item.types';

export const getItems = async (page = 0, size = 20): Promise<Item[]> => {
  const res = await axiosInstance.get('/items', { params: { page, size } });
  return res.data;
};

export const getItemById = async (id: string): Promise<Item> => {
  const res = await axiosInstance.get(`/items/${id}`);
  return res.data;
};

export const searchItems = async (filters: ItemFilters): Promise<Item[]> => {
  const res = await axiosInstance.get('/items/search', { params: filters });
  return res.data;
};

export const createItem = async (data: CreateItemRequest): Promise<Item> => {
  const res = await axiosInstance.post('/items', data);
  return res.data;
};

export const updateItem = async (
  id: string,
  data: Partial<CreateItemRequest>
): Promise<Item> => {
  const res = await axiosInstance.put(`/items/${id}`, data);
  return res.data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/items/${id}`);
};