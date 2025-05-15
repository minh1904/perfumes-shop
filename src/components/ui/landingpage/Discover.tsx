import { MoveRight } from 'lucide-react';

import ScrollProduct from './ScrollProduct';

const Discover = () => {
  interface Product {
    id: string;
    name: string;
    price: number;
    type: string;
    image: string | null;
  }

  const products: Product[] = [
    {
      id: 'product-001',
      name: 'Creed Viking EDP',
      price: 345,
      type: 'Creed',
      image: 'https://res.cloudinary.com/ddsnh547w/image/upload/v1747235751/download_1_rdmwy4.png',
    },
    {
      id: 'product-002',
      name: 'Bleu de Chanel Parfum',
      price: 165,
      type: 'Chanel',
      image: 'https://res.cloudinary.com/ddsnh547w/image/upload/v1747235751/download_1_rdmwy4.png',
    },
    {
      id: 'product-003',
      name: 'Dior Sauvage Elixir',
      price: 180,
      type: 'Dior',
      image: 'https://res.cloudinary.com/ddsnh547w/image/upload/v1747235751/download_1_rdmwy4.png',
    },
    {
      id: 'product-004',
      name: 'Tom Ford Oud Wood EDP',
      price: 250,
      type: 'Tom Ford',
      image: 'https://res.cloudinary.com/ddsnh547w/image/upload/v1747235751/download_1_rdmwy4.png',
    },
  ];
  return (
    <section className="discover-section">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-semibold uppercase">Discover</h2>
        <h2 className="font-roslindale-medium-italic text-4xl">Your Signature Scent</h2>
      </div>

      <div className="mb-8 flex items-center justify-between px-7">
        <div>
          <p className="text-4xl font-semibold">Masculine</p>
          <p className="font-roslindale-medium-italic text-4xl">Scent</p>
        </div>
        <div className="bg-blacky rounded-full p-4">
          <MoveRight strokeWidth={1.25} className="text-white" />
        </div>
      </div>

      <ScrollProduct products={products} />

      <p className="mt-10 px-7">
        Crafted for the bold and refined — fragrances that embody strength, depth, and undeniable
        charisma.
      </p>
    </section>
  );
};

export default Discover;
