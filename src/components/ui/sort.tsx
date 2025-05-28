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
  ArrowDownWideNarrow,
  ArrowDownZA,
  ArrowUp10,
  ArrowUpWideNarrow,
  ArrowUpZA,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface SortOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: SortOption[] = [
  {
    value: 'name_asc',
    label: 'Name: A to Z',
    icon: <ArrowUpZA size={18} strokeWidth={1.25} />,
  },
  {
    value: 'name_desc',
    label: 'Name: Z to A',
    icon: <ArrowDownZA size={18} strokeWidth={1.25} />,
  },
  {
    value: 'price_asc',
    label: 'Price: Low to High',
    icon: <ArrowUp10 size={18} strokeWidth={1.25} />,
  },
  {
    value: 'price_desc',
    label: 'Price: High to Low',
    icon: <ArrowDown10 size={18} strokeWidth={1.25} />,
  },
  {
    value: 'sale_desc',
    label: 'Most Popular',
    icon: <ArrowDownWideNarrow size={18} strokeWidth={1.25} />,
  },
  {
    value: 'sale_asc',
    label: 'Least Popular',
    icon: <ArrowUpWideNarrow size={18} strokeWidth={1.25} />,
  },
];

interface SortComponentProps {
  currentSort?: string;
  className?: string;
}

export const SortComponent = ({ currentSort, className }: SortComponentProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set('sortBy', value);
      } else {
        params.delete('sortBy');
      }

      // Reset về trang đầu khi sort
      params.set('page', '1');

      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className={className}>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort byy" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <div className="flex items-center gap-2">
                <span>{option.label}</span>
                {option.icon}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortComponent;
