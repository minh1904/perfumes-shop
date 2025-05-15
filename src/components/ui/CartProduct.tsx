import { PackagePlus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface ProductProps {
  products: {
    id: string;
    name: string;
    price: number;
    type: string;
    image: string | null;
  };
  bgColor?: string;
}

const CartProduct = ({ products, bgColor }: ProductProps) => {
  return (
    <div
      className={` ${bgColor} flex h-[30rem] w-[19rem] flex-col justify-between rounded-3xl p-5`}
    >
      <div className="flex items-center justify-between">
        <p className="rounded-full bg-black px-10 py-2 text-white">{products.type}</p>
        <PackagePlus strokeWidth={1.25} />
      </div>
      <div>
        <Image src={`${products.image}`} alt={products.name} width={500} height={500} />
      </div>
      <div className="flex justify-between">
        <p>{products.name}</p>
        <p>{products.price}$</p>
      </div>
    </div>
  );
};

export default CartProduct;
