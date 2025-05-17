// stores/useCartStore.ts
'use client';

import { create } from 'zustand';

interface CartState {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  isOpen: false,
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
}));
