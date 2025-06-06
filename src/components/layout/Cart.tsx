'use client';
import { useCartStore, useMenuStore } from '@/stores';
import { X } from 'lucide-react';

import React, { useEffect } from 'react';
import CartItems from '../ui/CartItems';

const Cart = () => {
  const { isOpenCart, closeCart, items } = useCartStore();
  const { isOpenMenu } = useMenuStore();
  useEffect(() => {
    if (isOpenCart || isOpenMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenCart, isOpenMenu]);
  return (
    <div
      className={`md: fixed top-0 right-0 z-[9999] h-screen w-screen transform bg-white transition-transform duration-500 md:w-[40rem] ${isOpenCart ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-12 py-10 text-5xl">
        <p className="relative font-normal">
          Cart <span className="absolute text-[1.5rem]">({items.length})</span>
        </p>
        <X
          size={40}
          strokeWidth={1.25}
          onClick={closeCart}
          className="cursor-pointer duration-400 hover:rotate-180"
        />
      </div>

      <CartItems />
    </div>
  );
};

export default Cart;
