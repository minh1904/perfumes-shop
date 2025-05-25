'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowDown10,
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowDownZA,
  ArrowUp10,
  ArrowUpWideNarrow,
  ArrowUpZA,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import { useFilterStore } from '@/stores';
import { brand, gender } from '@/components/layout/FilternSort';
import axios from 'axios';
import { Product } from '@/components/layout/Search';
import { useQuery } from '@tanstack/react-query';

const Page = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { openFilter } = useFilterStore();
  console.log(searchTerm);
  const fetchProducts = async () => {
    const response = await axios.get('../api/products');
    if (response.status !== 200) throw new Error('Failed to fetch products');
    return response.data.products as Product[];
  };

  const { data: products } = useQuery({
    queryKey: ['searchbarProducts'],
    queryFn: fetchProducts,
  });

  const fuse = useMemo(() => {
    if (!products) return null;
    return new Fuse(products, {
      keys: [{ name: 'name', weight: 0.6 }],
      threshold: 0.4,
    });
  }, [products]);

  const searchResults = useMemo(() => {
    if (!products) return [];
    if (!searchTerm) return products.map((product) => ({ item: product }));
    if (!fuse) return [];
    return fuse.search(searchTerm).slice(0, 6);
  }, [fuse, searchTerm, products]);
  return (
    <div className="min-h-screen max-w-full overflow-x-hidden">
      <div className="w-full lg:flex">
        <div className="mt-15 hidden w-[20%] pl-10 lg:block">
          <p className="mt-5">Filter by</p>
          <div>
            <p className="text-[16px] font-semibold">Gender</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {gender.map((item) => (
                <p
                  className="border-blacky cursor-pointer rounded-sm border px-3 py-1"
                  key={item.id}
                >
                  {item.type}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-[16px] font-semibold">Brand</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {brand.map((item) => (
                <p
                  className="border-blacky cursor-pointer rounded-sm border px-3 py-1"
                  key={item.id}
                >
                  {item.brand}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:w-[80%]">
          <input
            placeholder="Search"
            className="mx-7 mt-20 w-full border-b text-2xl outline-none"
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="mt-5 ml-7 flex justify-between text-[16px]">
            <p>Products {searchResults.length} results</p>
            <p
              onClick={openFilter}
              className="border-blacky flex cursor-pointer items-center gap-1 rounded-sm border px-2 lg:hidden"
            >
              <ArrowDownUp size={18} strokeWidth={1.25} /> Filter & Sort
            </p>
            <div className="hidden lg:block">
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option3">
                    Name: A to Z <ArrowUpZA size={32} strokeWidth={1.25} />
                  </SelectItem>
                  <SelectItem value="option4">
                    Name: Z to A <ArrowDownZA size={32} strokeWidth={1.25} />
                  </SelectItem>
                  <SelectItem value="option1">
                    Price: Low to High <ArrowUp10 size={32} strokeWidth={1.25} />{' '}
                  </SelectItem>
                  <SelectItem value="option2">
                    Price: High to Low <ArrowDown10 size={32} strokeWidth={1.25} />
                  </SelectItem>

                  <SelectItem value="option5">
                    Most Popular <ArrowDownWideNarrow size={32} strokeWidth={1.25} />
                  </SelectItem>
                  <SelectItem value="option6">
                    Least Popular <ArrowUpWideNarrow size={32} strokeWidth={1.25} />
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <div className="mt-4 ml-7 grid h-full grid-cols-2 gap-2 text-base md:grid-cols-3 lg:grid-cols-4 lg:overflow-y-auto">
              {searchResults.map((results) => (
                <div
                  key={results.item.id}
                  className="bg-masculine flex h-96 flex-col justify-between rounded-md py-3 lg:h-[25rem] 2xl:h-[32rem]"
                >
                  <p className="mx-auto min-w-36 rounded-full bg-black px-2 py-2 text-center text-white md:grid-cols-3 lg:grid-cols-4">
                    {results.item.brand}
                  </p>
                  <Image
                    src={`${results.item.image_url}`}
                    alt={`${results.item.image_alt}`}
                    width={600}
                    height={600}
                    className="mx-auto h-60 w-60 object-cover"
                  />
                  <div className="pl-5">
                    <p>{results.item.name}</p>
                    <p>{results.item.price}$</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
