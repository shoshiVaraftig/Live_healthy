// src/services/foodService.ts

import type { Food } from '../types/food';
const API_BASE_URL = 'http://localhost:5181'; // *** וודא שזה נכון! ***

export const foodService = {
  getFoodCalories: async (foodName: string): Promise<Food> => {
    // השורה המתוקנת:
const url = `${API_BASE_URL}/api/food/search?foodName=${encodeURIComponent(foodName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      const errorDetail = await response.text();
      if (response.status === 404) {
        throw new Error(`Food "${foodName}" not found. Please try another name.`);
      }
      throw new Error(`Failed to fetch food calories: ${response.status} - ${errorDetail}`);
    }

    const data: Food = await response.json();
    
    return data;
  },
};