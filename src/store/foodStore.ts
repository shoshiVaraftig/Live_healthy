// src/store/foodSearchStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { foodService } from '../services/foodService';

import type { Food } from '../types/food'; // וודא שאתה מייבא את ה-interface המעודכן!
 // וודא שאתה מייבא את ה-interface המעודכן!

// הגדרת מבנה המצב עבור הסטור
interface FoodSearchState {
  searchedFoodResult: Food | null; // התוצאה כעת היא מסוג Food החדש
  loading: boolean;
  error: string | null;
  lastSearchTerm: string | null;
  lastSearchTimestamp: number | null;

  searchFoodItem: (foodName: string) => Promise<void>;
  clearSearch: () => void;
  checkAndRefetchIfStale: () => Promise<void>;
}

const STALE_TIME_MS = 1000 * 60 * 10; // 10 דקות

export const useFoodSearchStore = create<FoodSearchState>()(
  persist(
    (set, get) => ({
      searchedFoodResult: null,
      loading: false,
      error: null,
      lastSearchTerm: null,
      lastSearchTimestamp: null,

      searchFoodItem: async (foodName: string) => {
        if (get().loading && get().lastSearchTerm === foodName) {
          return;
        }

        set({ loading: true, error: null, searchedFoodResult: null, lastSearchTerm: foodName });

        try {
          const result = await foodService.getFoodCalories(foodName);
          set({
            searchedFoodResult: result, // ה-result הוא כבר מסוג Food החדש
            loading: false,
            lastSearchTimestamp: Date.now(),
          });
        } catch (err: any) {
          console.error('Food Search Store Error during searchFoodItem:', err);
          set({
            error: err.message || 'An unknown error occurred during search.',
            loading: false,
            searchedFoodResult: null,
            lastSearchTimestamp: null,
          });
        }
      },

      clearSearch: () => {
        set({ searchedFoodResult: null, error: null, loading: false, lastSearchTerm: null, lastSearchTimestamp: null });
      },

      checkAndRefetchIfStale: async () => {
        const { lastSearchTerm, lastSearchTimestamp, loading } = get();

        if (!lastSearchTerm || loading || !lastSearchTimestamp || (Date.now() - lastSearchTimestamp < STALE_TIME_MS)) {
          return;
        }

        console.log(`Data for "${lastSearchTerm}" is stale. Refetching...`);
        await get().searchFoodItem(lastSearchTerm);
      },
    }),
    {
      name: 'food-search-storage',
      storage: createJSONStorage(() => localStorage),
      // לוודא שה-partialize שומר את הנתונים החדשים בצורה נכונה
      partialize: (state) => ({
        searchedFoodResult: state.searchedFoodResult,
        lastSearchTerm: state.lastSearchTerm,
        lastSearchTimestamp: state.lastSearchTimestamp,
      }),
    }
  )
);