export type ItemCategory =
  | 'ELECTRONICS'
  | 'CLOTHING'
  | 'TOOLS'
  | 'BOOKS'
  | 'SPORTS'
  | 'CAMPING'
  | 'PHOTOGRAPHY'
  | 'OTHER';

export interface ItemImage {
  id: string;
  imageUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Item {
  id: string;
  ownerId: string;
  ownerName: string;
  title: string;
  description: string;
  category: ItemCategory;
  dailyPrice: number;
  isAvailable: boolean;
  images: ItemImage[];
  createdAt: string;
}

export interface CreateItemRequest {
  title: string;
  description: string;
  category: ItemCategory;
  dailyPrice: number;
  images: string[];
}

export interface ItemFilters {
  category?: ItemCategory;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}