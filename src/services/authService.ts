// src/services/authService.ts
import { useAuthStore } from '../store/authStore'; // ייבוא חנות ה-Zustand
// import { personalService } from './personalService'; // נצטרך את זה כדי לטפל בשגיאות 401 גלובליות - הערה: לא בשימוש כרגע בקוד, אך השארתי כהערה אם זה חשוב לך.
import type { PersonalArea } from '../types/personal';
import { jwtDecode } from 'jwt-decode'; // וודא שזה מיובא אם אתה משתמש בו

const API_BASE_URL = 'http://localhost:5181';

interface AuthResponse {
    token: string; // ה-JWT שהשרת מחזיר
}

export const authService = {
    // פונקציה לשליחת פרטי התחברות לשרת ושמירת ה-JWT
    login: async (credentials: { username: string; password: string }): Promise<void> => {
        const setToken = useAuthStore.getState().setToken;
        const setUser = useAuthStore.getState().setUser;
        const setIsAuthenticated = useAuthStore.getState().setIsAuthenticated;

        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Login failed: ${response.status} - ${errorDetail}`);
            }

            const data: AuthResponse = await response.json();
            setToken(data.token); // עדכון הטוקן בחנות Zustand וב-localStorage
            const decoded: any = jwtDecode(data.token);
            setUser({
                id: decoded.userId,
                username: decoded.name || decoded.unique_name,
                email: decoded.email,

            });
            setIsAuthenticated(true);
            console.log('User logged in successfully and store updated.');
            console.log("Decoded token:", decoded);


        } catch (error) {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            console.error('AuthService - Login failed:', error);
            throw error; // זורקים את השגיאה הלאה לקומפוננטה המשתמשת
        }
    },

    // פונקציה להרשמה
    register: async (userData:   PersonalArea): Promise<void> => { // עדכון ה-type כאן
        const setToken = useAuthStore.getState().setToken;
        const setUser = useAuthStore.getState().setUser;
        const setIsAuthenticated = useAuthStore.getState().setIsAuthenticated;

        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Registration failed: ${response.status} - ${errorDetail}`);
            }
            const data: AuthResponse = await response.json();
            setToken(data.token); // עדכון הטוקן בחנות Zustand וב-localStorage
            const decoded: any = jwtDecode(data.token);
            setUser({
                id: decoded.sub || decoded.jti,
                username: decoded.name || decoded.unique_name,
                email: decoded.email,
            });
            setIsAuthenticated(true);
            console.log('User registered and logged in successfully.');

        } catch (error) {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            console.error('AuthService - Registration failed:', error);
            throw error;
        }
    },

    // פונקציה להתנתקות
    logout: (): void => {
        const setToken = useAuthStore.getState().setToken;
        const setUser = useAuthStore.getState().setUser;
        const setIsAuthenticated = useAuthStore.getState().setIsAuthenticated;

        setToken(null); // מחיקת הטוקן מהחנות ומ-localStorage
        setUser(null);
        setIsAuthenticated(false);
        console.log('User logged out.');
    },

    // פונקציה זו תשמש כ-middleware עבור כל בקשות ה-API המוגנות
    fetchWithAuth: async <T>(url: string, options?: RequestInit): Promise<T> => {
        const token = useAuthStore.getState().token;
        const logout = authService.logout; // שימוש ב-logout מהשירות עצמו

        const headers = {
            ...options?.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Content-Type': 'application/json', // ברוב המקרים נרצה את זה
        };

        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.error('Authentication error (401/403). Logging out...');
                logout(); // התנתק אוטומטית
                throw new Error(`Authentication failed: ${response.status}. Please log in again.`);
            }
            const errorDetail = await response.text();
            throw new Error(`API call failed: ${response.status} - ${errorDetail}`);
        }

        if (response.status === 204) {
            return {} as T;
        }

        return response.json() as Promise<T>;
    },
};