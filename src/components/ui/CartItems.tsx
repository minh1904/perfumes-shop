'use client';

import { useSyncCart } from '@/hooks/useCart';
import { CartItem, useCartStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MoveRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const CartItems = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const { items: localItems } = useCartStore();

  const { mutate: syncCart } = useSyncCart();

  useEffect(() => {
    if (userId) {
      syncCart();
    }
  }, [userId, syncCart]);

  const { data: dbCart } = useQuery({
    queryKey: ['cart', userId],
    queryFn: () => axios.get(`/api/cart/${userId}`).then((res) => res.data),
    enabled: !!userId,
  });

  const itemsToRender = userId ? dbCart || [] : localItems;
  if (!itemsToRender || itemsToRender.length === 0)
    return (
      <div>
        {}
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
  return (
    <div className="space-y-6 px-8 py-4">
      {itemsToRender.map((item: CartItem) => (
        <div key={item.variantId} className="flex gap-5 border-b pb-4">
          <Image
            src={`${item.imageUrl}`}
            alt={item.productName}
            className="h-20 w-20 object-cover"
            width={600}
            height={600}
          />
          <div className="flex w-full flex-col justify-between">
            <p className="text-lg font-semibold">{item.productName}</p>
            <p className="text-sm text-gray-500">{item.volumeMl}ml</p>
            <div className="flex justify-between">
              <p className="">QTY: {item.quantity}</p>
              <p className="font-semibold"> ${item.price}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
