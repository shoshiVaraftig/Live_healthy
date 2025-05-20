import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersonalArea from './components/PersonalArea';
import Food from './components/Food';
import Recipes from './components/Recipes'; // נכון!import About from './components/About'; 
import Home from './components/home';
import Login from "./components/Login";
import { PrivateRoute } from "./components/PrivateRoute";
import Register from "./components/Register";
import About from "./components/About";
import './index.css'
import { AuthProvider } from "./components/AuthContext";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food" element={<Food />} />
<Route path="/recipes" element={<Recipes />} />    
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />          <Route path="/register" element={<Register />} />

          <Route
            path="/personal-area"
            element={
              <PrivateRoute>
                <PersonalArea />
              </PrivateRoute>}/>
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;