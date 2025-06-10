// src/App.tsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PersonalArea from './components/PersonalArea';
import Food from './components/Food';
import Recipes from './components/Recipes';
import Home from './components/Home'; // זהו ה-Navbar שלך!
import Login from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import Register from "./components/Register";
import About from "./components/About";
import { initAuth } from './store/authStore';

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 דקות
      cacheTime: 1000 * 60 * 10, // 10 דקות
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  useEffect(() => {
    initAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        {/* ה-Navbar (קומפוננטת Home) מרונדר כאן, מחוץ ל-Routes */}
        {/* זה מבטיח שהוא יופיע בכל העמודים */}
        <Home /> 

        {/* עוטף את כל התוכן של העמודים כדי להתמודד עם ה-padding-top */}
        <div className="main-content-wrapper">
          <Routes>
            {/* עמוד הבית האמיתי - כעת זו קומפוננטה נפרדת או תוכן פשוט */}
            {/* בעבר, Home הייתה גם Navbar וגם עמוד הבית. כעת, Home היא רק Navbar. */}
            {/* לכן, נצטרך להחליט מה יהיה עמוד הבית. ניתן ליצור קומפוננטה חדשה בשם למשל HomePageContent. */}
            <Route path="/" element={
              // כאן תוכל למקם את תוכן עמוד הבית שלך
              // לדוגמה, אם היה לך Logo בקומפוננטת Home ששייך לעמוד הבית בלבד:
              <div>
                 {/* <Logo /> אם ה-Logo שייך רק לעמוד הבית */}
                <h1 style={{textAlign: 'center', marginTop: '3rem', color: '#15803d'}}>ברוכים הבאים ל-Live Healthy!</h1>
                <p style={{textAlign: 'center', fontSize: '1.1rem', color: '#4a5568'}}>המסע שלך לחיים בריאים יותר מתחיל כאן.</p>
                {/* כל תוכן נוסף של עמוד הבית */}
              </div>
            } />
            <Route path="/food" element={<Food />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/personal-area"
              element={
                <PrivateRoute>
                  <PersonalArea />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;