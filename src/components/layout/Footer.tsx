'use client';
import { MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="relative text-[14px]">
      <div className="bg-blacky absolute top-65 right-1/2 flex h-[37rem] w-[25rem] translate-x-1/2 flex-col items-center justify-center text-center text-white md:right-7 md:translate-x-0 lg:h-[46rem] lg:w-[37rem]">
        <h2 className="text-4xl font-semibold lg:text-6xl">HEAR MORE </h2>
        <h2 className="text-4xl font-semibold lg:text-6xl">FROM US</h2>
        <p className="mt-3 w-50 text-gray-500">Get the latest news about tips and new products.</p>
        <input
          type="text"
          placeholder="ENTER YOUR EMAIL"
          className="mt-10 rounded-full border p-4 px-13 outline-0 lg:text-2xl"
        />
        <div className="mt-10 flex h-32 flex-col items-center justify-center gap-2">
          <p className="rounded-full bg-white p-5">
            <MoveUpRight strokeWidth={1.25} className="text-blacky" />
          </p>

          <p className="underline">Subcribe</p>
        </div>
        <div className="w-70 border"></div>
        <p className="p-7 lg:px-20">
          No Spam, only quality articles to help you be more radient. You can opt out anytime.
        </p>
      </div>
      <div>
        <Image
          src="https://res.cloudinary.com/ddsnh547w/image/upload/v1747403894/aeru-official-ItrdjmvTdCY-unsplash_ejpusj.jpg"
          alt="perfume"
          width={1000}
          height={1000}
          className="h-[40rem] object-cover md:h-screen md:w-full"
        />
      </div>
      <div className="mt-50 xl:mt-30">
        <div className="flex gap-20 p-7">
          <div className="flex flex-col gap-0.5">
            <div className="text-gray-500">EXPLORE</div>
            <Link href="/shop" className="mt-2 font-semibold">
              Shop
            </Link>
            <Link href="/about" className="font-semibold">
              About
            </Link>
            <Link href="/journal" className="font-semibold">
              Journal
            </Link>
            <Link href="/gallery" className="font-semibold">
              Gallery
            </Link>
          </div>

          <div className="flex flex-col gap-0.5">
            <div className="text-gray-500">FOLLOW US</div>
            <Link href="/" className="mt-2 font-semibold">
              Facebook
            </Link>
            <Link href="/" className="font-semibold">
              Instagram
            </Link>
            <Link href="/" className="font-semibold">
              Tiktok
            </Link>
          </div>

          <div className="hidden flex-col gap-0.5 px-7 lg:flex">
            <div className="text-gray-500">CONTACT US</div>
            <p className="mt-2 font-semibold">pe@parfumelite.com</p>
            <p className="font-semibold">0000 - 1111 - 2222 </p>
          </div>
        </div>

        <div className="flex flex-col gap-0.5 px-7 lg:hidden">
          <div className="text-gray-500">CONTACT US</div>
          <p className="mt-2 font-semibold">pe@parfumelite.com</p>
          <p className="font-semibold">0000 - 1111 - 2222 </p>
        </div>
      </div>
      <Image
        src="/logo.png"
        alt="logo ParfumElite"
        width={500}
        height={500}
        className="mx-7 mt-3 w-30"
      ></Image>
      <p className="px-7 text-gray-500">
        Clean, Conscious, Clinical Skincare! Honest products that truly work
      </p>
      <div className="justify-between lg:flex">
        <p className="my-8 px-7">© 2025 ParfumÉlite, All Rights Reserved</p>
        <div className="mt-5 flex gap-2 px-7 text-gray-500 underline">
          <p className="cursor-pointer">Credits</p>
          <p className="cursor-pointer">Copywork by : Văn Minh</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
