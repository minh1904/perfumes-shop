'use client';
import React from 'react';
import { Search, ShoppingBasket, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore, useSearchStore } from '@/stores';
import MenuIcon from '../ui/MenuIcon';
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const { openCart } = useCartStore();
  const { openSearch } = useSearchStore();
  return (
    <div className="navbar">
      <div className="md:hidden">
        <MenuIcon />
      </div>

      <Link href="/">
        <Image
          src="/logo.png"
          alt="Logo ParfumÉlite"
          width={0}
          height={0}
          sizes="100vw"
          className="h-15 w-auto object-contain"
        />
      </Link>

      <div className="navbar_middle">
        <Link href="/shop">shop</Link>
        <Link href="/about">about</Link>
        <Link href="/journal">journal</Link>
        <Link href="/gallery">gallery</Link>
      </div>
      <div className="navbar_right">
        <Search onClick={openSearch} size={20} strokeWidth={1.25} className="cursor-pointer" />
        <ShoppingBasket
          size={20}
          strokeWidth={1.25}
          absoluteStrokeWidth
          className="cursor-pointer"
          onClick={openCart}
        />
        <div className="h-4 w-[1px] bg-gray-400"></div>
        <Link className={`${userId ? 'hidden' : ''}`} href="/login">
          <UserRound size={20} strokeWidth={1.25} className="cursor-pointer" />
        </Link>
        <Link className={`${userId ? '' : 'hidden'}`} href="/account">
          <UserRound size={20} strokeWidth={1.25} className="cursor-pointer" />
        </Link>
      </div>
      <div className="flex gap-1.5 md:hidden">
        <Search onClick={openSearch} size={30} strokeWidth={1.25} className="cursor-pointer" />
        <ShoppingBasket
          size={30}
          strokeWidth={1.25}
          absoluteStrokeWidth
          className="cursor-pointer"
          onClick={openCart}
        />
      </div>
    </div>
  );
};

export default Navbar;
