'use client';
import { useUrlSync } from '@/hooks/useUrlSync';
import { useFilterStore } from '@/stores';
import React from 'react';

interface FilterOptions {
  genders: (string | null)[];
  brands: ({ id: number; name: string; slug: string } | null)[];
}

interface FilterProps {
  filterOptions: FilterOptions;
}

const Filter = ({ filterOptions }: FilterProps) => {
  const { clearAllFilters, selectedBrands, selectedGenders, toggleBrand, toggleGender } =
    useFilterStore();

  const { updateUrl } = useUrlSync();

  // Hàm xử lý khi chọn gender
  const handleGenderToggle = (genderValue: string) => {
    toggleGender(genderValue);
    updateUrl();
  };

  // Hàm xử lý khi chọn brand
  const handleBrandToggle = (brandValue: string) => {
    toggleBrand(brandValue);
    updateUrl();
  };
  const handleClearAll = () => {
    clearAllFilters();
    updateUrl();
  };

  // Lọc bỏ giá trị null
  const validGenders = filterOptions.genders.filter((item): item is string => item !== null);
  const validBrands = filterOptions.brands.filter(
    (item): item is { id: number; name: string; slug: string } => item !== null,
  );

  return (
    <div className="mt-15 hidden w-[20%] lg:block">
      <div className="flex justify-between">
        <p className="mt-5">Filter by</p>{' '}
        <p
          onClick={handleClearAll}
          className="mt-5 cursor-pointer pr-5 text-[14px] text-blue-600 hover:text-blue-900"
        >
          Clear all
        </p>
      </div>

      {/* Filter Gender */}
      {filterOptions.genders.length > 0 ? (
        <div>
          <div className="flex justify-between">
            <p className="mt-5">Genders</p>{' '}
            <p
              onClick={() => {
                useFilterStore.getState().clearGenders();
                updateUrl();
              }}
              className="mt-5 cursor-pointer pr-5 text-[14px] text-blue-600 hover:text-blue-900"
            >
              Clear all
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {validGenders.map((item) => (
              <p
                className={`border-blacky cursor-pointer rounded-sm border px-3 py-1 ${
                  selectedGenders.includes(item)
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                }`}
                key={item}
                onClick={() => handleGenderToggle(item)}
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p>No gender options available</p>
      )}

      {/* Filter Brand */}
      {filterOptions.brands.length > 0 ? (
        <div className="mt-5">
          <div className="flex justify-between">
            <p className="mt-5">Brands</p>{' '}
            <p
              onClick={() => {
                useFilterStore.getState().clearBrands();
                updateUrl();
              }}
              className="mt-5 cursor-pointer pr-5 text-[14px] text-blue-600 hover:text-blue-900"
            >
              Clear all
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {validBrands.map((item) => (
              <p
                className={`border-blacky cursor-pointer rounded-sm border px-3 py-1 ${
                  selectedBrands.includes(item.name)
                    ? 'border-black bg-black text-white'
                    : 'border-gray-300 hover:border-gray-500 hover:bg-gray-50'
                }`}
                key={item.id}
                onClick={() => handleBrandToggle(item.name)}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <p>No brand options available</p>
      )}
    </div>
  );
};

export default Filter;
