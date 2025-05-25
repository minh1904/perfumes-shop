'use client';

import { create } from 'zustand';

interface FilterState {
  isOpenFilter: boolean;
  openFilter: () => void;
  closeFilter: () => void;
  toggleFilter: () => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  isOpenFilter: false,
  openFilter: () => set({ isOpenFilter: true }),
  closeFilter: () => set({ isOpenFilter: false }),
  toggleFilter: () => set((state) => ({ isOpenFilter: !state.isOpenFilter })),
}));
