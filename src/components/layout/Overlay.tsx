'use client';
import { useCartStore } from '@/stores';
import React from 'react';

export const Overlay = () => {
  const { isOpenCart, closeCart } = useCartStore();
  return (
    <div
      onClick={closeCart}
      className={`bg-blacky fixed top-0 left-0 z-[9998] hidden h-screen w-screen duration-500 md:block ${isOpenCart ? `pointer-events-auto opacity-50` : `pointer-events-none opacity-0`} `}
    ></div>
  );
};
