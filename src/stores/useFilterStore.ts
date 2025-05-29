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
  // UI States
  isOpenFilter: boolean;

  // Filter Data
  selectedSort: string;
  selectedBrands: string[];
  selectedGenders: string[];

  // Actions
  openFilter: () => void;
  closeFilter: () => void;
  setSort: (sortValue: string) => void;
  toggleBrand: (brandValue: string) => void;
  toggleGender: (genderValue: string) => void;
  clearAllFilters: () => void;
  clearBrands: () => void;
  clearGenders: () => void;

  // Sync với URL
  syncFromUrl: (searchParams: URLSearchParams) => void;
  getUrlParams: () => URLSearchParams;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      // Initial States
      isOpenFilter: false,
      selectedSort: '',
      selectedBrands: [],
      selectedGenders: [],

      // UI Actions
      openFilter: () => set({ isOpenFilter: true }),
      closeFilter: () => set({ isOpenFilter: false }),

      // Filter Actions
      setSort: (sortValue: string) => set({ selectedSort: sortValue }),

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
        }),

      clearBrands: () => set({ selectedBrands: [] }),
      clearGenders: () => set({ selectedGenders: [] }),

      // URL Sync Methods
      syncFromUrl: (searchParams: URLSearchParams) => {
        const sortBy = searchParams.get('sortBy') || '';
        const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
        const genders = searchParams.get('genders')?.split(',').filter(Boolean) || [];

        set({
          selectedSort: sortBy,
          selectedBrands: brands,
          selectedGenders: genders,
        });
      },

      getUrlParams: () => {
        const state = get();
        const params = new URLSearchParams();

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
      }),
    },
  ),
);
