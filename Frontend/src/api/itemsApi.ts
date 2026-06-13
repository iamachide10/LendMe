import axiosInstance from './axiosInstance';
import { Item, CreateItemRequest, ItemFilters } from '../types/item.types';

interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
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
    params: {
      keyword: filters.search,   // Spring expects 'keyword'
      category: filters.category,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
    },
  });
  return res.data.content;
};

export const createItem = async (data: CreateItemRequest): Promise<Item> => {
  const res = await axiosInstance.post('/items', data);
  return res.data;
};


export const uploadItemImage = async (
  itemId: string,
  imageUri: string
): Promise<void> => {
  const formData = new FormData();

  formData.append('file', {
    uri: imageUri,
    name: 'image.jpg',
    type: 'image/jpeg',
  } as any);

  await axiosInstance.post(
    `/items/${itemId}/images`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
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