import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Journal = () => {
  return (
    <section className="bg-blacky flex flex-col gap-10 px-7 text-white lg:h-screen lg:flex-row lg:items-center lg:justify-center">
      <div className="lg:hidden">
        {' '}
        <h2 className="flex flex-col pt-15 text-center text-4xl font-semibold">
          CLEAN <span className="font-roslindale-medium-italic">Journal</span>
        </h2>
        <p className="mt-5 text-center">
          Tips on self-care, fragrance layering, and elegant living — from the world of ParfumÉlite.
        </p>
      </div>

      <div className="text-blacky mt-7 flex flex-col items-center md:w-1/2 lg:mt-0 lg:w-1/2">
        <Image
          src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747367485/u4637976442_A_minimalistic_and_elegant_perfume_advertisement._18ad129d-eafd-4b7a-a7d7-ce36f1b67c48_2_ipeaqa.png"
          alt="perfume"
          width={1000}
          height={1000}
          className="object-cover lg:h-[70vh]"
        />
        <div className="bg-white px-7 py-4">
          <h3 className="text-2xl font-semibold"> The Scent of First Light</h3>
          <p className="text-gray-500">
            How morning air inspired our newest unisex fragrance. There’s something sacred in the
            stillness before sunrise — the hush of the world, the dew on petals, and the breath of
            cool air against skin. LUMIÈRE, our latest...
          </p>{' '}
          <div className="mt-7 flex justify-between">
            <p>19/04/2025</p>
            <Link href="/" className="underline">
              Read more
            </Link>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2">
        <div className="hidden lg:block">
          {' '}
          <h2 className="flex flex-col pt-15 text-center text-4xl font-semibold lg:pt-0 lg:text-6xl">
            CLEAN <span className="font-roslindale-medium-italic">Journal</span>
          </h2>
          <p className="mt-5 text-center">
            Tips on self-care, fragrance layering, and elegant living — from the world of
            ParfumÉlite.
          </p>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="text-blacky mt-7 items-start md:w-1/2">
            <Image
              src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747367485/u4637976442_A_minimalistic_and_elegant_perfume_advertisement._18ad129d-eafd-4b7a-a7d7-ce36f1b67c48_2_ipeaqa.png"
              alt="perfume"
              width={1000}
              height={1000}
              className="w-full object-cover lg:h-60"
            />
            <div className="h-30 bg-white px-7 py-4">
              <h3 className="text-2xl font-semibold"> The Scent of First Light</h3>

              <div className="mt-7 flex justify-between">
                <p>19/04/2025</p>
                <Link href="/" className="underline">
                  Read more
                </Link>
              </div>
            </div>
          </div>
          <div className="text-blacky mt-7 items-start md:w-1/2">
            <Image
              src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747367485/u4637976442_A_minimalistic_and_elegant_perfume_advertisement._18ad129d-eafd-4b7a-a7d7-ce36f1b67c48_2_ipeaqa.png"
              alt="perfume"
              width={1000}
              height={1000}
              className="w-full object-cover lg:h-60"
            />
            <div className="h-30 bg-white px-7 py-4">
              <h3 className="text-2xl font-semibold"> The Scent of First Light</h3>

              <div className="mt-7 flex justify-between">
                <p>19/04/2025</p>
                <Link href="/" className="underline">
                  Read more
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journal;
