// src/store/foodSearchStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 1. הגדרת המודלים (Interfaces)
interface Food {
  imageUrl: string | undefined;
  name: string;
  calories: number;
  category: string;
  servingSize: string;
}

interface FoodItemRequest {
  query: string;
}

// 2. הגדרת מבנה המצב עבור הסטור
interface FoodSearchState {
  searchedFoodResult: Food | null;
  loading: boolean;
  error: string | null;
  lastSearchTerm: string | null;
  lastSearchTimestamp: number | null;
  
  searchFoodItem: (foodName: string) => Promise<void>;
  clearSearch: () => void;
}


// 3. יצירת ה-Zustand Store
export const useFoodSearchStore = create<FoodSearchState>()(
  persist(
    (set, get) => ({
      searchedFoodResult: null,
      loading: false,
      error: null,
      lastSearchTerm: null,
      lastSearchTimestamp: null,

      searchFoodItem: async (foodName: string) => {
        // מונע קריאות כפולות לאותו חיפוש
        if (get().loading && get().lastSearchTerm === foodName) {
          return;
        }

        set({ loading: true, error: null, searchedFoodResult: null, lastSearchTerm: foodName });

        try {
          const requestBody: FoodItemRequest = {
            query: foodName,
          };
          
          const response = await fetch('http://localhost:5181/api/Food/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
          }
          
          const foodData: Food = await response.json();
          
          // עדכון המצב עם התוצאה
          set({
            searchedFoodResult: foodData,
            loading: false,
            lastSearchTimestamp: Date.now(),
          });
        } catch (err: unknown) {
          console.error('Food Search Store Error during searchFoodItem:', err);
          let errorMessage = 'An unknown error occurred during search.';
          if (err instanceof Error) {
            errorMessage = err.message;
          }
          set({
            error: errorMessage,
            loading: false,
            searchedFoodResult: null,
            lastSearchTimestamp: null,
          });
        }
      },

      clearSearch: () => {
        set({ searchedFoodResult: null, error: null, loading: false, lastSearchTerm: null, lastSearchTimestamp: null });
      },
    }),
    {
      name: 'food-search-storage',
      storage: createJSONStorage(() => localStorage),
      // לוודא שה-partialize שומר את הנתונים הנכונים
      partialize: (state) => ({
        searchedFoodResult: state.searchedFoodResult,
        lastSearchTerm: state.lastSearchTerm,
        lastSearchTimestamp: state.lastSearchTimestamp,
      }),
    }
  )
);