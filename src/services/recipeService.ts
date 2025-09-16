// src/services/recipeService.ts

import type { Recipe } from '../types/recipe';

// ודא שכתובת ה-URL הזו נכונה ותואמת לפורט של שרת ה-Backend שלך (לרוב 5181 או 7xxx)
const API_BASE_URL = 'http://localhost:5181'; 

export const recipeService = {
    /**
     * פונקציה לקבלת מתכון מ-AI על בסיס שאילתה ופילטרים.
     * @param params אובייקט המכיל את מילת החיפוש והפילטרים התזונתיים.
     * @returns Promise שמחזיר אובייקט Recipe.
     */
    getRecipeFromAI: async (params: { 
        query: string; 
        vegetarian: boolean; 
        vegan: boolean; 
        glutenFree: boolean; 
        dairyFree: boolean 
    }): Promise<Recipe> => {
        const queryParams = new URLSearchParams({
            query: params.query,
            vegetarian: String(params.vegetarian),
            vegan: String(params.vegan),
            glutenFree: String(params.glutenFree),
            dairyFree: String(params.dairyFree)
        }).toString(); 
        const url = `${API_BASE_URL}/api/Recipe/searchAI?${queryParams}`;
        
        try {
            const response = await fetch(url);

            if (!response.ok) {
                // השרת שלנו מחזיר אובייקט Recipe גם במקרה של שגיאה 500
                // עם הודעת שגיאה בתוך השדות Title ו-Description.
                // אם הסטטוס אינו 2xx, ננסה לפענח את התגובה כ-Recipe (אובייקט השגיאה שלנו).
                const errorData: Recipe = await response.json().catch(() => ({
                    Title: "שגיאת שרת לא ידועה",
                    Description: "אירעה שגיאה בלתי צפויה מהשרת. אנא נסה שוב מאוחר יותר.",
                    Ingredients: [], Instructions: [], Image: "https://via.placeholder.com/300x200?text=Error",
                    ReadyInMinutes: null, Servings: null, Vegetarian: params.vegetarian, Vegan: params.vegan, GlutenFree: params.glutenFree, DairyFree: params.dairyFree, Likes: 0
                }));
                // למרות שזה שגיאת שרת, אנו מחזירים את אובייקט ה-Recipe שהשרת סיפק
                // כך שה-Store והקומפוננטה יוכלו להציג את הודעת השגיאה הידידותית.
                return errorData; 
            }

            const data: Recipe = await response.json();
            
            // ודא שהתמונה היא URL תקין; אחרת, השתמש בתמונת Placeholder.
            if (!data.Image || !data.Image.startsWith('http')) {
                data.Image = "https://via.placeholder.com/300x200?text=Recipe+Image";
            }

            return data;
        } catch (error) {
            console.error('Error in recipeService.getRecipeFromAI:', error);
            // במקרה של שגיאת רשת או שגיאת פענוח JSON, נחזיר מתכון שגיאה ידידותי.
            return {
                Title: "שגיאת חיבור",
                Description: `לא ניתן היה להתחבר לשרת. אנא ודא ששרת ה-Backend פועל (ודא את הכתובת: ${API_BASE_URL}).`,
                Ingredients: [], Instructions: [], Image: "https://via.placeholder.com/300x200?text=Network+Error",
                ReadyInMinutes: null, Servings: null, Vegetarian: params.vegetarian, Vegan: params.vegan, GlutenFree: params.glutenFree, DairyFree: params.dairyFree, Likes: 0
            };
        }
    },
};