// src/App.tsx
import React from 'react'; // חשוב ש-React יהיה מיובא
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersonalArea from './components/PersonalArea';
import Food from './components/Food';
import Recipes from './components/Recipes';
import Home from './components/home';
import Login from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import Register from "./components/Register";
import About from "./components/About";
// אין צורך לייבא את './index.css' כאן אם הוא כבר מיובא ב-main.tsx
import { AuthProvider } from "./components/AuthContext";
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


// צור instance חדש של QueryClient (אפשר להשאיר את זה כאן או להעביר לקובץ configuration נפרד אם הוא גדל)
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
  return (
    // כל ה-Providers עוטפים את ה-BrowserRouter וה-Routes
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} /> {/* כלי הפיתוח של React Query */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
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
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;