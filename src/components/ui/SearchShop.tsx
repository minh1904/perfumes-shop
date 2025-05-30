'use client';
import { useUrlSync } from '@/hooks/useUrlSync';
import { useFilterStore } from '@/stores';
import React, { useEffect } from 'react';
import debounce from 'debounce';

const SearchShop = () => {
  const { search, setSearch } = useFilterStore();
  const { updateUrl } = useUrlSync();
  const debouncedUpdate = debounce(() => {
    updateUrl();
  }, 500);

  useEffect(() => {}, [search]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedUpdate();
  };

  return (
    <div>
      <input
        value={search}
        onChange={handleSearchChange}
        placeholder="Search"
        className="mt-20 w-full border-b text-2xl outline-none"
        autoFocus
      />
    </div>
  );
};

export default SearchShop;
