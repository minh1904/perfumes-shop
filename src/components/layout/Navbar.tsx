'use client';
import React from 'react';
import { Search, ShoppingBasket, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/stores';
import MenuIcon from '../ui/item/MenuIcon';

const Navbar = () => {
  const { openCart } = useCartStore();
  return (
    <div className="navbar">
      <div className="md:hidden">
        <MenuIcon />
      </div>

      <Image
        src="/logo.png"
        alt="Logo ParfumÉlite"
        width={0}
        height={0}
        sizes="100vw"
        className="h-15 w-auto object-contain"
      />
      <div className="navbar_middle">
        <Link href="/shop">shop</Link>
        <Link href="/shop">about</Link>
        <Link href="/shop">journal</Link>
        <Link href="/shop">gallery</Link>
      </div>
      <div className="navbar_right">
        <Search size={20} strokeWidth={1.25} className="cursor-pointer" />
        <ShoppingBasket
          size={20}
          strokeWidth={1.25}
          absoluteStrokeWidth
          className="cursor-pointer"
          onClick={openCart}
        />
        <div className="h-4 w-[1px] bg-gray-400"></div>
        <UserRound size={20} strokeWidth={1.25} className="cursor-pointer" />
      </div>
      <ShoppingBasket
        size={30}
        strokeWidth={1.25}
        absoluteStrokeWidth
        className="cursor-pointer md:hidden"
        onClick={openCart}
      />
    </div>
  );
};

export default Navbar;
