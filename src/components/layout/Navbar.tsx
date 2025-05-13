import React from 'react';
import { Menu, Search, ShoppingBasket, UserRound } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="navbar">
      <Menu size={30} strokeWidth={1.25} absoluteStrokeWidth className="md:hidden" />
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
        />
        <div className="h-4 w-[1px] bg-gray-400"></div>
        <UserRound size={20} strokeWidth={1.25} className="cursor-pointer" />
      </div>
      <ShoppingBasket size={30} strokeWidth={1.25} absoluteStrokeWidth className="md:hidden" />
    </div>
  );
};

export default Navbar;
