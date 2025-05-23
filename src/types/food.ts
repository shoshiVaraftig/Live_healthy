import Food from "../components/Food";

 export interface Food 
{ 
       id: string; // או number, תלוי במה שה-Backend מחזיר. אם ה-Backend שולח 0, כנראה שזה מספר.
  name: string; // שיניתי מ-foodName ל-name כדי להתאים למבנה שלך
  calories: number;
  category: string; // אם יש רשימה סגורה של קטגוריות, עדיף להשתמש ב-Union Type או Enum
  servingSize?: string; 
}
