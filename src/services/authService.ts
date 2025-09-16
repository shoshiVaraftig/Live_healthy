// src/services/authService.ts
import { useAuthStore, type User } from '../store/authStore';
import { jwtDecode } from 'jwt-decode';

const API_BASE_URL = 'http://localhost:5181';

interface AuthResponse {
    token: string;
}



export const authService = {
    // ✅ פונקציית ההתחברות מתוקנת
    login: async (credentials: { username: string; password: string }): Promise<User> => {
        const { setToken, setUser, setIsAuthenticated } = useAuthStore.getState();

        try {
            const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: credentials.username,
                    Password: credentials.password
                }),
            });

            if (!response.ok) {
                const errorDetail = await response.text();
                throw new Error(`Login failed: ${response.status} - ${errorDetail}`);
            }

            const data: AuthResponse = await response.json();
            setToken(data.token);
            const decoded:any = jwtDecode(data.token);
            const userObject: User = {
                id: decoded.userId,
                username: decoded.name || decoded.unique_name,
                email: decoded.email,
            };
            setUser(userObject);
            setIsAuthenticated(true);
            console.log('User logged in successfully and store updated.');
            console.log("Decoded token:", decoded);

            return userObject; // ✅ מחזיר את אובייקט המשתמש
        } catch (error) {
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
            console.error('AuthService - Login failed:', error);
            throw error;
        }
    },

    // ✅ פונקציה להתנתקות - נשארה זהה
    logout: (): void => {
        const { setToken, setUser, setIsAuthenticated } = useAuthStore.getState();
        setToken(null);
        setUser(null);
        setIsAuthenticated(false);
        console.log('User logged out.');
    },

    // ✅ פונקציה זו תשמש כ-middleware עבור כל בקשות ה-API המוגנות
    fetchWithAuth: async <T>(url: string, options?: RequestInit): Promise<T> => {
        const token = useAuthStore.getState().token;
        const logout = authService.logout;

        const headers = {
            ...options?.headers,
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
            'Content-Type': 'application/json',
        };

        const response = await fetch(url, { ...options, headers });
 if (response.status === 204) {
      return null as T; // או החזר אובייקט ריק אם יש צורך בכך
    }
        if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
                console.error('Authentication error (401/403). Logging out...');
                logout();
                throw new Error(`Authentication failed: ${response.status}. Please log in again.`);
            }
            const errorDetail = await response.text();
            throw new Error(`API call failed: ${response.status} - ${errorDetail}`);
        }

        // if (response.status === 204) {
        //     return {} as T;
        // }

        return response.json() as Promise<T>;
    },
};