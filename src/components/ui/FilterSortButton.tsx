'use client';
import { useFilterStore } from '@/stores';
import { ArrowDownUp } from 'lucide-react';

const FilterSortButton = () => {
  const { openFilter } = useFilterStore();

  return (
    <div>
      <button
        onClick={openFilter}
        className="border-blacky flex cursor-pointer items-center gap-1 rounded-sm border px-2 transition-colors hover:bg-gray-50 lg:hidden"
      >
        <ArrowDownUp size={18} strokeWidth={1.25} /> Filter & Sort
      </button>
    </div>
  );
};

export default FilterSortButton;
