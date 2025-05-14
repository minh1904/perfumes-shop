import { Gem, Handshake, SearchCheck, Sparkle } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const Pledge = () => {
  return (
    <div className="pt-10 md:relative">
      <h2 className="pledge_title">
        Real Scent,
        <br className="md:hidden" />
        real story <br />
        for your <span className="font-roslindale-italic lowercase underline">essence</span>.
      </h2>
      <div className="pledge_des">
        Unreservedly honest products that truly work, <br />
        be kind to skin and the planet - no exceptions!
      </div>

      <div className="max-w-8xl relative mx-auto">
        <div className="pledge_card top-[10%] left-[5%] lg:left-[24%]">
          <Gem strokeWidth={1.25} className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-sm font-semibold md:text-base">Curated with Purpose</p>
          <p className="text-xs lg:text-base">
            We handpick fragrances from the world{"'"}s finest brands — so every scent you wear
            tells a story, not just a note.
          </p>
        </div>
        <div className="pledge_card top-[60%] left-[5%] lg:top-[33%]">
          <SearchCheck strokeWidth={1.25} className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-sm font-semibold md:text-base">Authenticity Guaranteed</p>
          <p className="text-xs lg:text-base">
            100% genuine perfumes, backed by invoices and verified sources. Trust your scent. Trust
            us.
          </p>
        </div>
        <div className="pledge_card top-[10%] right-[5%] lg:top-[48%] lg:right-[5%]">
          <Sparkle strokeWidth={1.25} className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-sm font-semibold md:text-base">Experience-First Service</p>
          <p className="text-xs lg:text-base">
            More than a transaction — we’re here to guide, inspire, and personalize every step of
            your fragrance journey.
          </p>
        </div>
        <div className="pledge_card top-[60%] right-[5%] lg:top-[70%] lg:right-[24%]">
          <Handshake strokeWidth={1.25} className="h-6 w-6 md:h-8 md:w-8" />
          <p className="text-sm font-semibold md:text-base">Curated with Purpose</p>
          <p className="text-xs lg:text-base">
            We handpick fragrances from the world{"'"}s finest brands — so every scent you wear
            tells a story, not just a note.
          </p>
        </div>

        {/* Container hình ảnh */}
        <div className="mx-auto max-w-5xl overflow-hidden md:relative">
          <div className="clip-ellipse" style={{ transform: 'rotate(47deg)' }}>
            <Image
              src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747143079/woman-makes-chemical-experiment_rqv9gq.jpg"
              width={500}
              height={500}
              alt=""
              className="w-full object-cover"
              style={{ transform: 'rotate(-47deg)' }}
            />
          </div>
        </div>
      </div>

      <div className="grid h-dvw w-[70%vw] grid-cols-2 p-10 text-center md:hidden">
        <div className="border-blacky flex w-full flex-col items-center justify-center border-r border-b px-7">
          <Gem strokeWidth={1.25} />
          <p className="pt-5 font-bold">Curated with Purpose</p>
        </div>
        <div className="border-blacky flex flex-col items-center justify-center border-b px-7">
          <SearchCheck strokeWidth={1.25} />
          <p className="pt-5 font-bold">Authenticity Guaranteed</p>
        </div>
        <div className="border-blacky flex flex-col items-center justify-center border-r px-7">
          <Sparkle strokeWidth={1.25} />
          <p className="pt-5 font-bold">Your Scent Concierge</p>
        </div>
        <div className="flex flex-col items-center justify-center px-7">
          <Handshake strokeWidth={1.25} />
          <p className="pt-5 font-bold">Experience-First Service</p>
        </div>
      </div>
    </div>
  );
};

export default Pledge;
