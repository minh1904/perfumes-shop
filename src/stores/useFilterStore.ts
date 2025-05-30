import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Interfaces
export interface SortOption {
  id: number;
  type: string;
  value: string;
  icon?: React.ReactNode;
}

export interface Brand {
  id: number;
  brand: string;
  value?: string;
}

export interface Gender {
  id: number;
  type: string;
  value?: string;
}

interface FilterState {
  isOpenFilter: boolean;
  selectedSort: string;
  selectedBrands: string[];
  selectedGenders: string[];
  openFilter: () => void;
  closeFilter: () => void;
  setSort: (sortValue: string) => void;
  toggleBrand: (brandValue: string) => void;
  toggleGender: (genderValue: string) => void;
  clearAllFilters: () => void;
  clearBrands: () => void;
  clearGenders: () => void;
  syncFromUrl: (searchParams: URLSearchParams) => void;
  getUrlParams: () => URLSearchParams;
  search: string;
  gender: string[];
  brand: string[];
  page: number;
  setSearch: (search: string) => void;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      search: '',
      gender: [],
      brand: [],
      page: 1,
      isOpenFilter: false,
      selectedSort: '',
      selectedBrands: [],
      selectedGenders: [],
      openFilter: () => set({ isOpenFilter: true }),
      closeFilter: () => set({ isOpenFilter: false }),

      setSort: (sortValue: string) => set({ selectedSort: sortValue }),
      setSearch: (search) => set({ search, page: 1 }),
      toggleBrand: (brandValue: string) =>
        set((state) => ({
          selectedBrands: state.selectedBrands.includes(brandValue)
            ? state.selectedBrands.filter((b) => b !== brandValue)
            : [...state.selectedBrands, brandValue],
        })),

      toggleGender: (genderValue: string) =>
        set((state) => ({
          selectedGenders: state.selectedGenders.includes(genderValue)
            ? state.selectedGenders.filter((g) => g !== genderValue)
            : [...state.selectedGenders, genderValue],
        })),

      clearAllFilters: () =>
        set({
          selectedSort: '',
          selectedBrands: [],
          selectedGenders: [],
          search: '',
          page: 1,
        }),

      clearBrands: () => set({ selectedBrands: [], page: 1 }),
      clearGenders: () => set({ selectedGenders: [], page: 1 }),

      // URL Sync Methods
      syncFromUrl: (searchParams: URLSearchParams) => {
        const sortBy = searchParams.get('sortBy') || '';
        const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
        const genders = searchParams.get('genders')?.split(',').filter(Boolean) || [];
        const search = searchParams.get('search') || '';

        set({
          selectedSort: sortBy,
          selectedBrands: brands,
          selectedGenders: genders,
          search: search,
        });
      },

      getUrlParams: () => {
        const state = get();
        const params = new URLSearchParams();

        if (state.search) {
          params.set('search', state.search);
        }

        if (state.selectedSort) {
          params.set('sortBy', state.selectedSort);
        }

        if (state.selectedBrands.length > 0) {
          params.set('brands', state.selectedBrands.join(','));
        }

        if (state.selectedGenders.length > 0) {
          params.set('genders', state.selectedGenders.join(','));
        }

        return params;
      },
    }),
    {
      name: 'filter-storage',
      partialize: (state) => ({
        selectedSort: state.selectedSort,
        selectedBrands: state.selectedBrands,
        selectedGenders: state.selectedGenders,
        search: state.search,
      }),
    },
  ),
);
