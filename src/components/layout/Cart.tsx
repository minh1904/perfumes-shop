'use client';
import { useCartStore, useMenuStore } from '@/stores';
import { MoveRight, X } from 'lucide-react';

import React, { useEffect } from 'react';
import CartItems from '../ui/CartItems';
import Link from 'next/link';

const Cart = () => {
  const { isOpenCart, closeCart, getTotalItems, getTotalPrice, items } = useCartStore();
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
      className={`fixed top-0 right-0 z-[9999] flex h-screen w-full transform flex-col bg-white transition-transform duration-500 md:w-[40rem] ${isOpenCart ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between px-12 py-10 text-5xl">
        <p className="relative font-normal">
          Cart <span className="absolute text-[1.5rem]">({getTotalItems()})</span>
        </p>
        <X
          size={40}
          strokeWidth={1.25}
          onClick={closeCart}
          className="cursor-pointer duration-400 hover:rotate-180"
        />
      </div>

      {/* Scrollable Items */}
      <div className="flex-1 overflow-y-auto px-12">
        <CartItems />
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="shrink-0 border-t border-gray-200 px-12 py-6">
          <div className="mb-4 flex justify-between text-2xl font-normal">
            <p>Total</p>
            <p>${getTotalPrice().toFixed(2)}</p>
          </div>
          <Link
            href="/checkout"
            className="border-blacky bg-blacky relative mx-auto flex w-[80%] items-center gap-2 rounded-full border py-5"
          >
            <p className="mx-auto text-lg font-normal text-white uppercase underline">Checkout</p>
            <p className="absolute right-3 rounded-full bg-white p-3">
              <MoveRight strokeWidth={1.25} className="text-blacky" />
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
