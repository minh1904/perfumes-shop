'use client';
import { useCartStore } from '@/stores';
import { MoveRight, X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect } from 'react';

const Cart = () => {
  const { isOpen, closeCart } = useCartStore();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  return (
    <div
      className={`md: fixed top-0 right-0 z-[9999] h-screen w-screen transform bg-white transition-transform duration-500 md:w-[40rem] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
    >
      <div className="flex items-center justify-between px-12 py-10 text-5xl">
        <p className="relative font-normal">
          Cart <span className="absolute text-[1.5rem]">(0)</span>
        </p>
        <X
          size={40}
          strokeWidth={1.25}
          onClick={closeCart}
          className="cursor-pointer duration-400 hover:rotate-180"
        />
      </div>

      <div className="flex h-[calc(100vh-19rem)] flex-col items-center justify-center text-center text-6xl">
        <p className="mb-6 font-normal">
          Your cart is <br />
          <span className="font-roslindale-italic">empty</span>
        </p>
        <Link
          href="/shop"
          className="border-blacky relative flex items-center gap-2 rounded-full border px-20 py-4"
        >
          <p className="text-lg font-normal uppercase underline">Browse products</p>
          <p className="bg-blacky absolute right-3 rounded-full p-3">
            <MoveRight strokeWidth={1.25} className="text-white" />
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
