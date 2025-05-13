import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="hero_section">
      <h1 className="hero_title">
        <span className="font-roslindale-medium-italic text-pinky">Fragrance</span> is more
        <br />
        than a feeling <br />
        It{"'"}s your <span className="font-roslindale-medium-italic text-pinky">Signature</span>
      </h1>

      <Image
        src={
          'https://res.cloudinary.com/ddsnh547w/image/upload/v1747106811/bc5e0443-fdfc-46b6-8673-0f6f934db798_ajtqhh.png'
        }
        alt="Nước hoa màu hồng"
        width={500}
        height={500}
        className="hero_image"
      />

      <div className="hero_sp">
        <Link href="/shop " className="hero_cta1">
          Shop now
          <ArrowUpRight size={28} strokeWidth={1.25} />
        </Link>
        <p className="hero_des">
          At <span className="text-pinky italic">ParfumÉlite</span>, we believe scent is not just a
          fleeting emotion — it{"'"}s a statement. Every note, every essence is crafted to awaken
          desire and leave a lasting impression. With every spray, you don{"'"}t just wear a
          fragrance — you reveal who you are.{' '}
          <span className="text-pinky italic">Seductive. Timeless. Unforgettable.</span>
        </p>

        <Link href="/shop " className="hero_cta2">
          Shop now
          <ArrowUpRight size={28} strokeWidth={1.25} />
        </Link>
      </div>
    </section>
  );
};

export default Hero;
