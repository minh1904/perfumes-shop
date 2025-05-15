import { MoveRight } from 'lucide-react';

import ScrollProduct from './ScrollProduct';
import Image from 'next/image';

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
    <section className="discover-section my-10">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-semibold uppercase md:text-6xl">Discover</h2>
        <h2 className="font-roslindale-medium-italic text-4xl md:text-6xl">Your Signature Scent</h2>
      </div>

      <div className="flex w-full md:h-screen">
        <div className="hidden w-1/2 md:block">
          <Image
            src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747302392/u4637976442_A_close-up_of_a_mans_face_with_tanned_skin_and_sh_175b64eb-dddb-426a-9ef0-bf5790bf42c4_2_bkw352.png"
            alt="A man with parfume"
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between py-5 md:w-1/2 2xl:py-15">
          <div className="flex items-center justify-between px-7">
            <div>
              <p className="text-4xl font-semibold xl:text-6xl 2xl:text-7xl">Masculine</p>
              <p className="font-roslindale-medium-italic text-4xl xl:text-6xl 2xl:text-7xl">
                Scent
              </p>
            </div>
            <div className="bg-blacky rounded-full p-4">
              <MoveRight strokeWidth={1.25} className="text-white" />
            </div>
          </div>{' '}
          <div className="my-5 pl-10">
            <ScrollProduct products={products} bgColor="bg-masculine" />
          </div>
          <p className="px-7">
            Crafted for the bold and refined — fragrances that embody strength, depth, and
            undeniable charisma.
          </p>
        </div>
      </div>

      <div className="flex w-full md:h-screen">
        <div className="flex w-full flex-col justify-between py-5 md:w-1/2 2xl:py-15">
          <div className="flex items-center justify-between px-7">
            <div>
              <p className="text-4xl font-semibold xl:text-6xl 2xl:text-7xl">Feminine</p>
              <p className="font-roslindale-medium-italic text-4xl xl:text-6xl 2xl:text-7xl">
                Scent
              </p>
            </div>
            <div className="bg-blacky rounded-full p-4">
              <MoveRight strokeWidth={1.25} className="text-white" />
            </div>
          </div>{' '}
          <div className="my-5 pl-10">
            <ScrollProduct products={products} bgColor="bg-feminine" />
          </div>
          <p className="px-7">
            Romantic, radiant, and unforgettable — fragrances that celebrate femininity in all its
            beauty.
          </p>
        </div>
        <div className="hidden w-1/2 md:block">
          <Image
            src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747304484/u4637976442_A_close-up_of_a_womans_face_with_naturally_bright_s_c217c97d-6e74-4c3c-a173-fc273933a190_mbeggr.png"
            alt="A girl with parfume"
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <div className="flex w-full md:h-screen">
        <div className="hidden w-1/2 md:block">
          <Image
            src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747304808/u4637976442_A_close-up_of_a_man_and_a_woman_standing_close_sh_5c565840-5aa1-4f0d-81a7-0cccd292c9db_1_sgnuj7.png"
            alt="A couple with parfume"
            width={1000}
            height={1000}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex w-full flex-col justify-between py-5 md:w-1/2 2xl:py-15">
          <div className="flex items-center justify-between px-7">
            <div>
              <p className="text-4xl font-semibold xl:text-6xl 2xl:text-7xl">Unisex </p>
              <p className="font-roslindale-medium-italic text-4xl xl:text-6xl 2xl:text-7xl">
                Scent
              </p>
            </div>
            <div className="bg-blacky rounded-full p-4">
              <MoveRight strokeWidth={1.25} className="text-white" />
            </div>
          </div>{' '}
          <div className="my-5 pl-10">
            <ScrollProduct products={products} bgColor="bg-unisex" />
          </div>
          <p className="px-7">
            Crafted for the bold and refined — fragrances that embody strength, depth, and
            undeniable charisma.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Discover;
