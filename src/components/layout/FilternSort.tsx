'use client';
import { useFilterStore } from '@/stores';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';

const FilternSort = () => {
  const { isOpenFilter, closeFilter } = useFilterStore();
  useEffect(() => {
    if (isOpenFilter) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenFilter]);
  return (
    <div
      className={`absolute top-0 left-0 z-[9999] h-screen w-full bg-white px-8 duration-500 lg:hidden ${isOpenFilter ? 'translate-y-0 opacity-100' : '-translate-y-[200%]'} `}
    >
      <div className="mt-10 flex items-center justify-between">
        <p className="text-[16px] font-semibold">Filter and sort</p>
        <X
          size={40}
          strokeWidth={1.25}
          onClick={closeFilter}
          className="cursor-pointer duration-400 hover:rotate-180"
        />
      </div>
      <div>
        <p>Sort by</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {sort.map((item) => (
            <p className="border-blacky cursor-pointer rounded-sm border px-3 py-1" key={item.id}>
              {item.type}
            </p>
          ))}
        </div>
      </div>

      <p className="mt-5">Filter by</p>
      <div>
        <p className="text-[16px] font-semibold">Gender</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {gender.map((item) => (
            <p className="border-blacky cursor-pointer rounded-sm border px-3 py-1" key={item.id}>
              {item.type}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[16px] font-semibold">Brand</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {brand.map((item) => (
            <p className="border-blacky cursor-pointer rounded-sm border px-3 py-1" key={item.id}>
              {item.brand}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilternSort;

export const sort = [
  { id: 1, type: 'A to Z' },
  { id: 2, type: 'Z to A' },
  { id: 3, type: 'Price: Low to High' },
  { id: 4, type: 'Price: High to Low' },
  { id: 5, type: 'Most Popular' },
  { id: 6, type: 'Least Popular' },
];
export const gender = [
  { id: 1, type: 'Women' },
  { id: 2, type: 'Men' },
  { id: 3, type: 'Unisex' },
];
export const brand = [
  { id: 1, brand: 'Creed' },
  { id: 2, brand: 'Chanel' },
  { id: 3, brand: 'Tom Ford' },
  { id: 4, brand: 'Yves Saint Laurent' },
  { id: 5, brand: 'Dior' },
  { id: 6, brand: 'Amouage' },
  { id: 7, brand: 'Byredo' },
  { id: 8, brand: 'Maison Francis Kurkdjian' },
  { id: 9, brand: 'Jo Malone' },
  { id: 10, brand: 'Guerlain' },
];
