'use client';
import { useCartStore } from '@/stores';
import React from 'react';

export const Overlay = () => {
  const { isOpen, closeCart } = useCartStore();
  return (
    <div
      onClick={closeCart}
      className={`bg-blacky pointer-events-none fixed top-0 left-0 z-[9998] h-screen w-screen duration-500 ${isOpen ? `opacity-50` : `opacity-0`} `}
    ></div>
  );
};
