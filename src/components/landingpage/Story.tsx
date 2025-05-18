import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const Story = () => {
  return (
    <div className="pt-18 lg:h-screen">
      {' '}
      <div className="hidden justify-around text-6xl lg:flex">
        {' '}
        <h2 className="font-bold">OUR</h2>
        <h2 className="font-roslindale-italic">Story</h2>
      </div>
      <div className="flex flex-col items-center lg:mt-10 lg:flex-row">
        <h2 className="m-10 text-4xl font-semibold lg:hidden lg:basis-1/2">
          OUR <span className="font-roslindale-medium-italic">Story</span>
        </h2>
        <div className="text-center text-6xl font-semibold lg:basis-1/2">
          <Image
            src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747322645/Molton_Brown_Bluewater_pqatnp.jpg"
            alt="showcase"
            width={1000}
            height={1000}
            className="px-8"
          />
        </div>
        <div className="flex flex-col items-center justify-center lg:basis-1/2">
          <p className="mt-10 text-2xl font-semibold">Born from Scent. Built on Emotion</p>
          <p className="mt-3 px-7">
            In a world overwhelmed by trends, ParfumÉlite was born from a simple desire: to bring
            back the soul of fragrance. Our journey began not in laboratories, but in memories — the
            warmth of a lover’s embrace, the confidence before a first meeting, the nostalgia of a
            childhood summer. Every bottle we craft holds more than aroma, it carries emotion,
            character, and presence. We don’t believe in scents for categories. We believe in scents
            for people — for stories, for moments, for legacy. At ParfumÉlite, we seek out the rare,
            the refined, and the real. Each fragrance is a tribute to authenticity, made to linger
            long after you{"'"}
            ve left the room. This is not just perfume. This is how you’ll be remembered.
          </p>
          <div className="flex h-32 items-center justify-center gap-2">
            <Link href="/about" className="bg-blacky rounded-full p-5">
              <MoveUpRight strokeWidth={1.25} className="text-white" />
            </Link>

            <Link href="/about" className="underline">
              About us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
