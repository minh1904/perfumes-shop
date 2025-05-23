'use client';

import { create } from 'zustand';

interface SearchState {
  isOpenSearch: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  isOpenSearch: false,
  openSearch: () => set({ isOpenSearch: true }),
  closeSearch: () => set({ isOpenSearch: false }),
  toggleSearch: () => set((state) => ({ isOpenSearch: !state.isOpenSearch })),
}));
