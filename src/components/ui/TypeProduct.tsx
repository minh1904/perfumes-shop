'use client';

import React, { useEffect, useState } from 'react';
import { HandCoins, ShoppingBasket } from 'lucide-react';
import { Product, ProductVariant } from '@/types/types';

const TypeProduct = ({ product }: { product: Product }) => {
  const [typeSelected, setTypeSelected] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(0);
  const increase = () => {
    setQuantity(quantity + 1);
  };
  const decrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (product.product_variants.length > 0) {
      setTypeSelected(product.product_variants[0]);
    }
  }, [product]);

  return (
    <div className="mt-4">
      <div className="flex gap-1">
        {product.product_variants.map((variant) => (
          <div
            key={variant.id}
            onClick={() => setTypeSelected(variant)}
            className={`inline-block cursor-pointer rounded-2xl border px-8 py-1 duration-300 ${
              typeSelected?.id === variant.id ? 'bg-blacky text-white' : 'border-gray-300'
            }`}
          >
            <p>{variant.volume_ml}ml</p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex items-center gap-2">
        <HandCoins size={22} strokeWidth={1.25} />
        <p className="text-3xl">{typeSelected?.price}$</p>
      </div>

      <div className="mt-4">
        <p className="">{product.short_description}</p>
      </div>
      <div className="flex items-center gap-6">
        <p>QTY</p>
        <div className="flex items-center gap-5">
          <p
            onClick={decrease}
            className="bg-blacky flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white"
          >
            -
          </p>
          <p className="text-2xl">{quantity}</p>
          <p
            onClick={increase}
            className="bg-blacky flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white"
          >
            +
          </p>
        </div>
      </div>
      <div className="bg-blacky mx-auto mt-10 flex h-15 w-99 cursor-pointer items-center justify-center gap-2 rounded-4xl text-2xl text-white uppercase">
        Add to cart <ShoppingBasket size={28} strokeWidth={1.25} />
      </div>
    </div>
  );
};

export default TypeProduct;
