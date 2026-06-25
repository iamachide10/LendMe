import axiosInstance from './axiosInstance';
import { Item, ItemFilters } from '../types/item.types';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface CreateItemRequest {
  title: string;
  description: string;
  category: Item['category'];
  dailyPrice: number;
}

export const getItems = async (page = 0, size = 20): Promise<Item[]> => {
  const res = await axiosInstance.get<PageResponse<Item>>('/items', {
    params: { page, size },
  });
  return res.data.content;
};

export const getItemById = async (id: string): Promise<Item> => {
  const res = await axiosInstance.get(`/items/${id}`);
  return res.data;
};

export const searchItems = async (filters: ItemFilters): Promise<Item[]> => {
  const res = await axiosInstance.get<PageResponse<Item>>('/items/search', {
    params: filters,
  });
  return res.data.content;
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

export const uploadItemImage = async (itemId: string, uri: string): Promise<Item> => {
  const formData = new FormData();
  const filename = uri.split('/').pop() || `photo.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('file', {
    uri,
    name: filename,
    type,
  } as any);

  const res = await axiosInstance.post(`/items/${itemId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};