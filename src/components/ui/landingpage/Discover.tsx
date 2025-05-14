import React from 'react';

import { MoveRight } from 'lucide-react';
import CartProduct from '../CartProduct';

const Discover = () => {
  return (
    <div>
      <div className="text-center">
        <h2 className="text-4xl font-semibold uppercase">Discover</h2>
        <h2 className="font-roslindale-medium-italic text-4xl">Your Signature Scent</h2>
      </div>
      <div className="mt-10 flex items-center justify-between px-7">
        <div>
          <p className="text-4xl font-semibold">Masculine</p>
          <p className="font-roslindale-medium-italic text-4xl">Scent</p>
        </div>
        <div className="bg-blacky rounded-full p-4">
          <MoveRight strokeWidth={1.25} className="text-white" />
        </div>
      </div>
      <CartProduct />
      <p className="mt-10 px-7">
        Crafted for the bold and refined — fragrances that embody strength, depth, and undeniable
        charisma.
      </p>
    </div>
  );
};

export default Discover;
