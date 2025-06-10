// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore'; // ייבוא חנות ה-Zustand שלנו

interface PrivateRouteProps {
  children?: React.ReactNode; // שימוש ב-children אופציונלי להתאמה עם מבנה ה-Route
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore(); // קבלת מצב מחנות Zustand

  // בזמן שהאפליקציה בודקת את מצב האימות הראשוני (לדוגמה, קוראת מה-localStorage)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="w-16 h-16 border-4 border-t-[#0d9488] border-r-[#0d9488] border-b-[#0d9488] border-l-transparent rounded-full animate-spin"></div>
        <p className="mr-4 text-[#64748b]">טוען אימות...</p>
      </div>
    );
  }

  // אם המשתמש לא מאומת (ולא במצב טעינה)
  if (!isAuthenticated) {
    // נווט אותו לדף ההתחברות. ה-replace prop מבטיח שהוא לא יוכל לחזור לדף המוגן עם כפתור ה'אחורה' בדפדפן.
    return <Navigate to="/login" replace />;
  }

  // אם המשתמש מאומת, הצג את התוכן של הנתיב המוגן
  return children ? <>{children}</> : <Outlet />;
};