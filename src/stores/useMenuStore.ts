'use client';

import { create } from 'zustand';

interface MenuState {
  isOpenMenu: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  isOpenMenu: false,
  openMenu: () => set({ isOpenMenu: true }),
  closeMenu: () => set({ isOpenMenu: false }),
  toggleMenu: () => set((state) => ({ isOpenMenu: !state.isOpenMenu })),
}));
