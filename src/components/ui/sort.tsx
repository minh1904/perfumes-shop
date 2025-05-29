'use client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useUrlSync } from '@/hooks/useUrlSync';
import { sortOptions } from '../layout/FilternSort';
import { useFilterStore } from '@/stores';

interface SortComponentProps {
  className?: string;
}

export const SortComponent = ({ className }: SortComponentProps) => {
  const { selectedSort, setSort } = useFilterStore();
  const { updateUrl } = useUrlSync();

  const handleSortChange = (value: string) => {
    setSort(value);
    updateUrl();
  };

  return (
    <div className={className}>
      <Select value={selectedSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sort by" />
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
