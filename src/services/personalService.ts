// src/services/personalService.ts
import type { PersonalArea } from "../types/personal";
import { authService } from './authService';


const API_BASE_URL = 'http://localhost:5181';
export const personalService = {
  getPersonalArea: async (userId: number | undefined): Promise<PersonalArea> => {
    try {
      // הנקודה הסופית (endpoint) של ה-API שלך היא /api/User
      // בהנחה שה-backend יודע לזהות את המשתמש מהטוקן
      const data = await authService.fetchWithAuth<PersonalArea>(`${API_BASE_URL}/api/User/${userId}`, {
        method: 'GET',
      });
      console.log("Fetched personal data:", data);
      console.log("Height:", data.height);
      console.log("StartWeight:", data.startWeight);

      return data;
    } catch (error) {
      console.error('PersonalService - Failed to fetch personal area:', error);
      throw error;
    }

  },

  // פונקציית עדכון מידע אישי
  // כעת מקבלת גם את id המשתמש ושולחת PersonalArea מלא (או Partial)
  updatePersonalArea: async (userId: number | undefined, personalData: Partial<PersonalArea>): Promise<PersonalArea> => {
    try {
      // ה-API מצפה ל-PUT /api/User/{id}
      const data = await authService.fetchWithAuth<PersonalArea>(`${API_BASE_URL}/api/User/${userId}`, { // הוספנו את ה-userId לנתיב
        method: 'PUT', // נשאר PUT כפי שמוצג ב-Swagger
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(personalData), // שלח את ה-Partial<PersonalArea> כגוף הבקשה
      });
      return data;
    } catch (error) {
      console.error('PersonalService - Failed to update personal area:', error);
      throw error;
    }
  },

  // שלח רק את מה שצריך - בלי username ו־hashedPassword
  updatePartialPersonalArea: async (userId: number, updatePayload: {
    startWeight?: number;
    height?: number;
    chatPersonality?: string;
    dietaryPreferences?: {
      foodName: string;
      id: number;
      userId: number;
      like: string;
    }[];
  }) => {
    try {
      const data = await authService.fetchWithAuth(`${API_BASE_URL}/api/User/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatePayload),
      });
      return data;
    } catch (error) {
      console.error('PersonalService - Failed to PATCH personal area:', error);
      throw error;
    }
  },

};