'use client';

import { useSearchStore } from '@/stores';
import { X } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import Image from 'next/image';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
interface Signature {
  type: string;
  id: number;
  link: string;
}
interface PopularBrand {
  brandName: string;
  id: number;
  link: string;
}
interface PopularProduct {
  name: string;
  id: number;
  link: string;
}

const Signature: Signature[] = [
  { type: 'Masculine', id: 1, link: '/' },
  { type: 'Feminine', id: 2, link: '/' },
  { type: 'Unisex', id: 3, link: '/' },
];

const PopularBrand: PopularBrand[] = [
  { brandName: 'Mad of len', id: 1, link: '/' },
  { brandName: 'Mad', id: 2, link: '/' },
  { brandName: 'of len', id: 3, link: '/' },
  { brandName: 'Mad of', id: 4, link: '/' },
  { brandName: 'Mad len', id: 5, link: '/' },
  { brandName: 'Mad n', id: 6, link: '/' },
];

const PopularProduct: PopularProduct[] = [
  { name: 'Mad of len', id: 1, link: '/' },
  { name: 'Marie Jenae', id: 2, link: '/' },
  { name: 'of len', id: 3, link: '/' },
  { name: 'Mad of', id: 4, link: '/' },
  { name: 'Mad len', id: 5, link: '/' },
  { name: 'Mad n', id: 6, link: '/' },
];

type Product = {
  id: number;
  name: string;
  slug: string;
  brand: string;
  price: string;
  gender: string;
  short_description: string;
  image_url: string | null;
  image_alt: string | null;
};

const fetchPopularProducts = async () => {
  const response = await axios.get('/api/products');
  if (response.status !== 200) throw new Error('Failed to fetch products');
  return response.data.products as Product[];
};

const Search = () => {
  const { isOpenSearch, closeSearch } = useSearchStore();
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: products,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['popularProducts'],
    queryFn: fetchPopularProducts,
  });

  const fuse = useMemo(() => {
    if (!products) return null;
    return new Fuse(products, {
      keys: [
        { name: 'name', weight: 0.6 },
        { name: 'brand', weight: 0.3 },
        { name: 'short_description', weight: 0.1 },
        { name: 'gender', weight: 0.1 },
      ],
      threshold: 0.4,
    });
  }, [products]);

  const searchResults = useMemo(() => {
    if (!fuse || !searchTerm) return [];
    return fuse.search(searchTerm).slice(0, 6); // Lấy 3 kết quả đầu
  }, [fuse, searchTerm]);

  useEffect(() => {
    if (isOpenSearch) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpenSearch]);

  return (
    <div
      className={`fixed top-0 left-0 z-[9999] h-screen w-screen bg-white transition-transform duration-600 ease-in-out ${
        isOpenSearch ? 'translate-y-0 opacity-100' : '-translate-y-[200%]'
      }`}
    >
      {/* Header với close button */}
      <div className="relative flex items-center justify-between px-7 py-5">
        <div className="flex-1">
          <input
            placeholder="Search"
            className="w-full text-2xl outline-none"
            autoFocus
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <p className="mt-2 text-[13px] lg:text-base">
            Search for products, categories, information, inspiration, etc.
          </p>
        </div>
        <X
          size={40}
          strokeWidth={1.25}
          onClick={closeSearch}
          className="ml-4 cursor-pointer transition-transform duration-400 hover:rotate-180"
        />
      </div>

      {/* Scrollable content area */}
      <div className="h-[calc(100vh-120px)] w-screen flex-row-reverse overflow-y-auto pb-20 lg:flex lg:overflow-y-hidden">
        <div className="w-full px-7 text-[22px]">
          <div className="flex items-center justify-between">
            <p>Products {searchResults.length} results</p>
            <p className="text-base underline">View all results</p>
          </div>
          {/*Tìm sản phẩm*/}

          {searchResults && (
            <div className="mt-4 grid h-full grid-cols-2 gap-1 text-base md:grid-cols-3 lg:overflow-y-auto">
              {searchResults.map((results) => (
                <div
                  key={results.refIndex}
                  className="bg-masculine flex h-96 flex-col justify-between rounded-md py-3 lg:h-[30rem] 2xl:h-[38rem]"
                >
                  <p className="mx-auto min-w-36 rounded-full bg-black px-2 py-2 text-center text-white">
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
          )}
          {isLoading && <div>Loading...</div>}
          {error && <div>Error: {(error as Error).message}</div>}
          {/*Tìm sản phẩm*/}
        </div>

        <div className="w-[35rem]">
          <div className="mt-7 px-7">
            <p className="text-xl">Your Signature Scent</p>
            <div className="grid grid-cols-3 gap-1">
              {Signature.map((sig) => (
                <Link
                  className="hover:text-unisex underline transition-colors"
                  href={`${sig.link}`}
                  key={sig.id}
                >
                  {sig.type}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-3 px-7">
            <p className="text-xl">Popular Brands</p>
            <div className="grid grid-cols-3 gap-1">
              {PopularBrand.map((brand) => (
                <Link
                  className="hover:text-unisex underline transition-colors"
                  href={`${brand.link}`}
                  key={brand.id}
                >
                  {brand.brandName}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-3 px-7">
            <p className="text-xl">Popular Products</p>
            <div className="grid grid-cols-3 gap-1">
              {PopularProduct.map((prd) => (
                <Link
                  className="hover:text-unisex underline transition-colors"
                  href={`${prd.link}`}
                  key={prd.id}
                >
                  {prd.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom button for mobile */}
      <div className="fixed bottom-0 left-0 flex h-20 w-screen items-center justify-center bg-white lg:hidden">
        <div className="border-blacky mx-6 my-3 flex w-full items-center justify-center border bg-white py-4 text-[18px]">
          View all results
        </div>
      </div>
    </div>
  );
};

export default Search;
