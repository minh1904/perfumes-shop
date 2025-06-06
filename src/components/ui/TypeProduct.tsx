'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBasket } from 'lucide-react';
import { Product, ProductVariant } from '@/types/types';
import { useAddToCart } from '@/hooks/useCart';

const TypeProduct = ({ product }: { product: Product }) => {
  const [typeSelected, setTypeSelected] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { mutate: addToCart, isPending } = useAddToCart();

  const handleAddToCart = () => {
    if (!typeSelected) return;

    addToCart({
      variant_id: typeSelected.id,
      quantity,
      productData: {
        product_id: product.id,
        product_name: product.name,
        product_slug: product.slug,
        brand_name: product.brand?.name ?? '',
        volume_ml: typeSelected.volume_ml,
        price: parseFloat(typeSelected.price),
        sku: typeSelected.sku,
        image_url: product.images && product.images.length > 0 ? product.images[0].url : undefined,
      },
    });
  };
  const increase = () => {
    setQuantity(quantity + 1);
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    if (product.product_variants.length > 0) {
      setTypeSelected(product.product_variants[0]);
    }
  }, [product]);

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand tag */}
      <div className="inline-block w-fit rounded-full border border-gray-300 px-6 py-2 text-sm font-medium tracking-wide text-gray-600 uppercase">
        {product.brand?.name}
      </div>

      {/* Product name */}
      <h1 className="text-4xl leading-tight font-bold text-gray-900 md:text-5xl">{product.name}</h1>

      {/* Product variants */}
      <div className="flex gap-3">
        {product.product_variants.map((variant) => (
          <button
            key={variant.id}
            onClick={() => setTypeSelected(variant)}
            className={`border-blacky cursor-pointer rounded-full border px-6 py-2 text-sm font-medium transition-all duration-200 ${
              typeSelected?.id === variant.id
                ? 'bg-gray-900 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {variant.volume_ml} ml
          </button>
        ))}
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <span className="text-3xl font-bold text-gray-900 md:text-4xl">{typeSelected?.price}$</span>
      </div>

      {/* Description */}
      <div className="max-w-lg leading-relaxed text-gray-600">
        <p>{product.short_description}</p>
      </div>

      {/* Quantity selector */}
      <div className="flex items-center gap-6">
        <span className="text-sm font-medium tracking-wide text-gray-700 uppercase">QTY</span>
        <div className="flex items-center rounded-full border border-gray-200">
          <button
            onClick={decrease}
            className="hover:bg-blacky text-blacky flex h-10 w-10 cursor-pointer items-center justify-center rounded-l-full transition-colors hover:text-white"
          >
            −
          </button>
          <span className="w-16 text-center text-lg font-medium">{quantity}</span>
          <button
            onClick={increase}
            className="hover:bg-blacky text-blacky flex h-10 w-10 cursor-pointer items-center justify-center rounded-r-full transition-colors hover:text-white"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        disabled={isPending || !typeSelected}
        className="flex w-full transform cursor-pointer items-center justify-center gap-3 rounded-full bg-rose-400 px-8 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-xl"
      >
        ADD TO CART
        <ShoppingBasket size={24} strokeWidth={1.5} />
      </button>
    </div>
  );
};

export default TypeProduct;
