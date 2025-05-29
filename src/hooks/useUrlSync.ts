import { useFilterStore } from '@/stores';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect } from 'react';

export const useUrlSync = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncFromUrl, getUrlParams } = useFilterStore();

  // Sync từ URL khi component mount
  useEffect(() => {
    syncFromUrl(searchParams);
  }, [searchParams, syncFromUrl]);

  // Update URL khi filter state thay đổi
  const updateUrl = useCallback(
    (resetPage = true) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      const filterParams = getUrlParams();

      // Giữ lại các params khác (như search, category, etc.)
      const finalParams = new URLSearchParams(currentParams);

      // Remove old filter params
      finalParams.delete('sortBy');
      finalParams.delete('brands');
      finalParams.delete('genders');

      // Add new filter params
      filterParams.forEach((value, key) => {
        finalParams.set(key, value);
      });

      // Reset page khi filter thay đổi
      if (resetPage) {
        finalParams.set('page', '1');
      }

      // Update URL
      router.push(`?${finalParams.toString()}`);
    },
    [router, searchParams, getUrlParams],
  );

  return { updateUrl };
};
