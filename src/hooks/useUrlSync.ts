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

      // Giữ lại các params khác không liên quan đến filter
      const finalParams = new URLSearchParams();

      // Copy tất cả params hiện tại trừ những cái sẽ được override
      currentParams.forEach((value, key) => {
        if (!['sortBy', 'brands', 'genders', 'search', 'page'].includes(key)) {
          finalParams.set(key, value);
        }
      });

      // Add new filter params từ store
      filterParams.forEach((value, key) => {
        finalParams.set(key, value);
      });

      // Reset page khi filter thay đổi
      if (resetPage) {
        finalParams.set('page', '1');
      } else {
        // Giữ lại page hiện tại nếu không reset
        const currentPage = currentParams.get('page');
        if (currentPage) {
          finalParams.set('page', currentPage);
        }
      }

      // Update URL
      router.push(`?${finalParams.toString()}`, { scroll: false });
    },
    [router, searchParams, getUrlParams],
  );

  return { updateUrl };
};
