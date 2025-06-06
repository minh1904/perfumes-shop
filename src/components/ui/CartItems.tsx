'use client';

import { useRemoveFromCart, useSyncCart, useUpdateCartQuantity } from '@/hooks/useCart';
import { CartItem, useCartStore } from '@/stores';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

import { MoveRight, Trash2 } from 'lucide-react';

const CartItems = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { mutate: removeFromCart } = useRemoveFromCart();
  const { items: localItems } = useCartStore();

  const { mutate: syncCart } = useSyncCart();
  const { mutate: updateCartQuantity } = useUpdateCartQuantity();

  useEffect(() => {
    if (userId) {
      syncCart();
    }
  }, [userId, syncCart]);

  const itemsToRender = localItems;

  if (!itemsToRender || itemsToRender.length === 0)
    return (
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
    );

  return (
    <div className="space-y-6 px-8 py-4">
      {itemsToRender.map((item: CartItem) => (
        <div key={item.variant_id} className="flex gap-5 border-b pb-4">
          <Image
            src={item.image_url || '/placeholder.png'}
            alt={item.product_name}
            className="h-20 w-20 object-cover"
            width={600}
            height={600}
          />
          <div className="flex w-full flex-col justify-between">
            <div className="flex justify-between">
              <p className="text-lg font-semibold">{item.product_name}</p>
              <p>
                <Trash2
                  onClick={() => removeFromCart(item.variant_id)}
                  size={20}
                  strokeWidth={1.25}
                  className="cursor-pointer"
                />
              </p>
            </div>

            <p className="text-sm text-gray-500">{item.volume_ml}ml</p>
            <div className="flex justify-between">
              <p className="font-semibold"> ${(item.price * item.quantity).toFixed(2)}</p>
              <div className="flex items-center rounded-full border border-gray-200">
                <button
                  onClick={() =>
                    updateCartQuantity({
                      variant_id: item.variant_id,
                      quantity: item.quantity - 1,
                    })
                  }
                  className="hover:bg-blacky text-blacky flex h-7 w-6 cursor-pointer items-center justify-center rounded-l-full transition-colors hover:text-white"
                >
                  −
                </button>
                <span className="w-16 text-center text-lg font-medium">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartQuantity({
                      variant_id: item.variant_id,
                      quantity: item.quantity + 1,
                    })
                  }
                  className="hover:bg-blacky text-blacky flex h-7 w-6 cursor-pointer items-center justify-center rounded-r-full transition-colors hover:text-white"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
