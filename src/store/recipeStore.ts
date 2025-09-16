/* src/store/recipeStore.ts */
import { create } from 'zustand';
import type { Recipe } from '../types/recipe';

// הגדרת סוגי נתונים
// interface Recipe {
//   Title: string;
//   Description?: string;
//   ReadyInMinutes?: number;
//   Servings?: number;
//   Ingredients?: string[];
//   Instructions?: string[];
//   Vegetarian?: boolean;
//   Vegan?: boolean;
//   GlutenFree?: boolean;
//   DairyFree?: boolean;
//   Image?: string;
//   // ✅ שינוי: הוספת שדה ID אופציונלי לטייפ
//   Id?: string;
// }

interface FilterParams {
  query: string;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
}

interface RecipeState {
  currentRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  fetchRecipe: (params: FilterParams) => Promise<void>;
  clearRecipeState: () => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  currentRecipe: null,
  loading: false,
  error: null,
  hasSearched: false,

  fetchRecipe: async (params: FilterParams) => {
    set({ loading: true, hasSearched: true, error: null });

    try {
      const response = await fetch('http://localhost:5181/api/Recipe/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          Query: params.query,
          IsVegetarian: params.vegetarian,
          IsVegan: params.vegan,
          IsGlutenFree: params.glutenFree,
          IsDairyFree: params.dairyFree
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || response.statusText || 'Server error occurred.';
        throw new Error(`HTTP error! Status: ${response.status}. ${errorMessage}`);
      }

      const recipeData: Recipe = await response.json();

      if (!recipeData.Title) {
        throw new Error('Invalid recipe data: Missing required fields.');
      }
      
 
    
      
      set({ 
        loading: false, 
        currentRecipe: recipeData, 
        error: null 
      });

    } catch (err: unknown) {
      console.error("Failed to fetch recipe:", err);
      let errorMessage = "התרחשה שגיאה בטעינת המתכון. אנא נסה שנית.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      set({ 
        loading: false, 
        currentRecipe: null, 
        error: errorMessage
      });
    }
  },

  clearRecipeState: () => {
    set({
      currentRecipe: null,
      loading: false,
      error: null,
      hasSearched: false,
    });
  },
}));