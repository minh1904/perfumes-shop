'use client';

import { signoutUserAction } from '@/actions/sign-out-action';
import { useMenuStore } from '@/stores';
import Link from 'next/link';
import React, { useEffect } from 'react';

const Menu = () => {
  const { isOpenMenu } = useMenuStore();

  const clickHandle = async () => {
    await signoutUserAction();
  };

  useEffect(() => {
    if (isOpenMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenMenu]);
  return (
    <div
      className={`fixed top-0 left-0 z-[9980] flex h-screen w-screen transform flex-col justify-between bg-white transition-transform duration-500 md:hidden md:w-[40rem] ${isOpenMenu ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="mt-30 ml-7 flex flex-col gap-4">
        <Link href="/shop" className="text-6xl font-normal duration-400 hover:translate-x-10">
          Shop
        </Link>
        <Link href="/about" className="text-6xl font-normal duration-400 hover:translate-x-10">
          About
        </Link>
        <Link href="/journal" className="text-6xl font-normal duration-400 hover:translate-x-10">
          Journal
        </Link>
        <Link href="/gallery" className="text-6xl font-normal duration-400 hover:translate-x-10">
          Gallery
        </Link>

        <Link href="/login" className="text-6xl font-normal duration-400 hover:translate-x-10">
          Sign Up/Login
        </Link>
      </div>
      <div className="mb-10 flex flex-col gap-0.5 px-7 lg:hidden">
        <div className="text-gray-500" onClick={clickHandle}>
          CONTACT US
        </div>
        <p className="font-semibold">pe@parfumelite.com</p>
        <p className="font-semibold">0000 - 1111 - 2222 </p>
      </div>
    </div>
  );
};

export default Menu;
