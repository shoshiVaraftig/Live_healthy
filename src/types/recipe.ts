
export interface Recipe {
    Title: string;
    Image: string;
    Id: string;
    Description: string;
    Ingredients: string[];
    Instructions: string[];
    ReadyInMinutes: number | null; // יכול להיות null אם ה-AI לא סיפק
    Servings: number | null;      // יכול להיות null אם ה-AI לא סיפק
    Vegetarian: boolean;
    Vegan: boolean;
    GlutenFree: boolean;
    DairyFree: boolean;
    Likes: number; // גם אם תמיד 0 מה-AI, חשוב שיהיה במודל
}