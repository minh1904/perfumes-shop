import { useMenuStore } from '@/stores';
import React from 'react';

const MenuIcon = () => {
  const { isOpenMenu, toggleMenu } = useMenuStore();
  return (
    <div>
      <div className="flex cursor-pointer flex-col gap-2" onClick={toggleMenu}>
        <div
          className={`w-7 border border-amber-950 duration-500 ${isOpenMenu ? `translate-y-1.5 rotate-45` : `rotate-0`}`}
        ></div>
        <div
          className={`w-7 border border-amber-950 duration-500 ${isOpenMenu ? `-translate-y-[3px] -rotate-45` : `rotate-0`}`}
        ></div>
      </div>
    </div>
  );
};

export default MenuIcon;
