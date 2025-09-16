import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode

// הגדרת ממשק (interface) למשתמש
export interface User {
  id: number;
  username: string;
  email: string;
}

// הגדרת ממשק למצב האימות (ה-Store עצמו)
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // מצב טעינה ראשוני בעת אתחול האפליקציה

  // פונקציות לניהול המצב
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (status: boolean) => void;
  setIsLoading: (status: boolean) => void;
  initializeAuth: () => void; // פונקציה לאתחול המצב מה-localStorage
}

// יצירת ה-Store באמצעות Zustand
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // מתחיל בטעינה

  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('jwt_token', token);
    } else {
      localStorage.removeItem('jwt_token');
    }
  },

  setUser: (user) => set({ user }),
  setIsAuthenticated: (status) => set({ isAuthenticated: status }),
  setIsLoading: (status) => set({ isLoading: status }),

  // פונקציה לאתחול מצב האימות בעת טעינת האפליקציה
  initializeAuth: () => {
    const storedToken = localStorage.getItem('jwt_token');
    if (storedToken) {
      try {
        const decodedToken: any = jwtDecode(storedToken);
        // בדוק אם הטוקן לא פג תוקף (אופציונלי אך מומלץ)
        if (decodedToken.exp * 1000 > Date.now()) { // exp הוא זמן בתאריך יוניקס בשניות
          const user: User = {
            id: decodedToken.userId || decodedToken.jti, // sub או jti הם לרוב ה-ID
            username: decodedToken.name || decodedToken.unique_name, // שדות נפוצים לשם משתמש
            email: decodedToken.email, // שדה נפוץ לאימייל
          };
          set({
            token: storedToken,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // טוקן פג תוקף
          localStorage.removeItem('jwt_token');
          set({ token: null, user: null, isAuthenticated: false, isLoading: false });
        }
      } catch (error) {
        console.error('Error decoding stored JWT or token is invalid:', error);
        localStorage.removeItem('jwt_token'); // נקה טוקן פגום
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ token: null, user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

// פונקציית אתחול שתיקרא פעם אחת ב-App.tsx
export const initAuth = () => {
  useAuthStore.getState().initializeAuth();
};