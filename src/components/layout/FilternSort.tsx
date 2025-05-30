'use client';
import { useUrlSync } from '@/hooks/useUrlSync';
import {
  ArrowDown10,
  ArrowDownWideNarrow,
  ArrowDownZA,
  ArrowUp10,
  ArrowUpWideNarrow,
  ArrowUpZA,
} from 'lucide-react';
import { X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFilterStore } from '@/stores';
import { FilterProps } from '../ui/Filter';

const FilternSort = ({ filterOptions }: FilterProps) => {
  const {
    isOpenFilter,
    closeFilter,
    selectedSort,
    selectedBrands,
    selectedGenders,
    setSort,
    toggleBrand,
    toggleGender,
    clearAllFilters,
  } = useFilterStore();

  const { updateUrl } = useUrlSync();

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

  const handleSortChange = (sortValue: string) => {
    setSort(sortValue);
    updateUrl();
  };

  const handleBrandToggle = (brandValue: string) => {
    toggleBrand(brandValue);
    updateUrl();
  };

  const handleGenderToggle = (genderValue: string) => {
    toggleGender(genderValue);
    updateUrl();
  };

  const handleClearAll = () => {
    clearAllFilters();
    updateUrl();
  };
  const validGenders = filterOptions.genders.filter((item): item is string => item !== null);
  const validBrands = filterOptions.brands.filter(
    (item): item is { id: number; name: string; slug: string } => item !== null,
  );
  return (
    <div
      className={`absolute top-0 left-0 z-[9999] h-screen w-full bg-white px-8 duration-500 lg:hidden ${
        isOpenFilter ? 'translate-y-0 opacity-100' : '-translate-y-[200%]'
      }`}
    >
      <div className="mt-10 flex items-center justify-between">
        <p className="text-[16px] font-semibold">Filter and sort</p>
        <div className="flex items-center gap-4">
          <button onClick={handleClearAll} className="text-sm text-blue-600 hover:text-blue-800">
            Clear All
          </button>
          <X
            size={40}
            strokeWidth={1.25}
            onClick={closeFilter}
            className="cursor-pointer duration-400 hover:rotate-180"
          />
        </div>
      </div>

      {/* Sort Section */}
      <div className="mt-6">
        <p className="mb-3 text-[16px] font-semibold">Sort by</p>
        <div className="flex flex-wrap gap-3">
          {sortOptions.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSortChange(item.value)}
              className={`cursor-pointer rounded-sm border px-3 py-2 text-sm transition-all duration-200 ${
                selectedSort === item.value
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.type}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-semibold">Filter by Gender</p>
          {validGenders.length > 0 && (
            <button
              onClick={() => {
                useFilterStore.getState().clearGenders();
                updateUrl();
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {validGenders.map((item) => (
            <button
              key={item}
              onClick={() => handleGenderToggle(item)}
              className={`cursor-pointer rounded-sm border px-3 py-2 text-sm transition-all duration-200 ${
                selectedGenders.includes(item)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[16px] font-semibold">Filter by Brand</p>
          {validBrands.length > 0 && (
            <button
              onClick={() => {
                useFilterStore.getState().clearBrands();
                updateUrl();
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          {validBrands.map((item) => (
            <button
              key={item.id}
              onClick={() => handleBrandToggle(item.slug)}
              className={`cursor-pointer rounded-sm border px-3 py-2 text-sm transition-all duration-200 ${
                selectedBrands.includes(item.slug)
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
              }`}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Applied Filters Summary */}
      {(selectedSort || selectedBrands.length > 0 || selectedGenders.length > 0) && (
        <div className="mt-6 border-t pt-4">
          <p className="mb-2 text-sm font-medium">Applied Filters:</p>
          <div className="space-y-1 text-sm text-gray-600">
            {selectedSort && <p>Sort: {sortOptions.find((s) => s.value === selectedSort)?.type}</p>}
            {selectedBrands.length > 0 && <p>Brands: {selectedBrands.length} selected</p>}
            {selectedGenders.length > 0 && <p>Genders: {selectedGenders.length} selected</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilternSort;

export const sortOptions = [
  {
    id: 1,
    type: 'A to Z',
    value: 'name_asc',
    label: 'Name: A to Z',
    icon: <ArrowUpZA size={18} strokeWidth={1.25} />,
  },
  {
    id: 2,
    type: 'Z to A',
    value: 'name_desc',
    label: 'Name: Z to A',
    icon: <ArrowDownZA size={18} strokeWidth={1.25} />,
  },
  {
    id: 3,
    type: 'Price: Low to High',
    value: 'price_asc',
    label: 'Price: Low to High',
    icon: <ArrowUp10 size={18} strokeWidth={1.25} />,
  },
  {
    id: 4,
    type: 'Price: High to Low',
    value: 'price_desc',
    label: 'Price: High to Low',
    icon: <ArrowDown10 size={18} strokeWidth={1.25} />,
  },
  {
    id: 5,
    type: 'Most Popular',
    value: 'sale_desc',
    label: 'Most Popular',
    icon: <ArrowDownWideNarrow size={18} strokeWidth={1.25} />,
  },
  {
    id: 6,
    type: 'Least Popular',
    value: 'sale_asc',
    label: 'Least Popular',
    icon: <ArrowUpWideNarrow size={18} strokeWidth={1.25} />,
  },
];
