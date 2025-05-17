'use client';

import { create } from 'zustand';

interface CartState {
  isOpenCart: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpenCart: false,
  openCart: () => set({ isOpenCart: true }),
  closeCart: () => set({ isOpenCart: false }),
  toggleCart: () => set((state) => ({ isOpenCart: !state.isOpenCart })),
}));
