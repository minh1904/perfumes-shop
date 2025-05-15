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
}

const CartProduct = ({ products }: ProductProps) => {
  return (
    <div className="mt-7 pl-7">
      {' '}
      <div className="bg-masculine flex h-[35rem] w-96 flex-col justify-between rounded-3xl p-5">
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
    </div>
  );
};

export default CartProduct;
