import { create } from 'zustand';
import { Item, ItemFilters } from '../types/item.types';

interface ItemState {
  items: Item[];
  selectedItem: Item | null;
  filters: ItemFilters;
  setItems: (items: Item[]) => void;
  setSelectedItem: (item: Item | null) => void;
  setFilters: (filters: ItemFilters) => void;
  clearFilters: () => void;
}

export const useItemStore = create<ItemState>(set => ({
  items: [],
  selectedItem: null,
  filters: {},
  setItems: items => set({ items }),
  setSelectedItem: item => set({ selectedItem: item }),
  setFilters: filters =>
    set(state => ({ filters: { ...state.filters, ...filters } })),
  clearFilters: () => set({ filters: {} }),
}));