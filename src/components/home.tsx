// src/components/Home.tsx
import { BiUser } from "react-icons/bi";
import { BsFillCupHotFill, BsClipboardHeart, BsChatDots, BsInfoCircle } from "react-icons/bs";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import './home.css'; // ייבוא ה-CSS של ה-Navbar
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import { useAuthStore } from "../store/authStore";
// import Logo from './logo.tsx';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showChatBot, setShowChatBot] = useState(false);
  const { user } = useAuthStore(); // שימוש ב-hook לקבלת מידע על המשתמש המחובר
useEffect(() => {
    console.log("Current user state in Home component:", user);
}, [user]);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      {isMobile && (
        <button
          className="hamburger-button"
          onClick={toggleMenu}
          aria-label="תפריט"
        >
          {isMenuOpen ?
            <RiCloseLine size={25} color="#15803d" /> :
            <RiMenu3Line size={25} color="#15803d" />
          }
        </button>
      )}

      <nav className={`
        navbar
        ${isMobile && isMenuOpen ? 'navbar-mobile-open' : ''}
      `}>

        {/* לוגיקה שמציגה 'Personal' או 'Login' בהתאם למצב ההתחברות */}
        <div className="flex flex-col items-center">
          <div className="mb-2">
            <BiUser size={25} color="#15803d" />
          </div>
          {user ? (
            <Link to="/personal-area" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
              Personal
            </Link>
          ) : (
            <Link to="/login" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
              Login
            </Link>
          )}
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2">
            <BsFillCupHotFill size={25} color="#15803d" />
          </div>
          <Link to="/food" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
            Food
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2">
            <BsClipboardHeart size={25} color="#15803d" />
          </div>
          <Link to="/recipes" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
            Recipes
          </Link>
        </div>

        <div className="flex flex-col items-center">
          <div className="mb-2">
            <BsInfoCircle size={25} color="#15803d" />
          </div>
          <Link to="/about" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
            About Us
          </Link>
        </div>
      </nav>

      <button
        className="but"
        aria-label="chat-bot"
        onClick={() => setShowChatBot(prev => !prev)}
      >
        <BsChatDots size={40} color="#15803d" />
      </button>
      {showChatBot && (
        <div className="chatbot-container">
          <ChatBot />
        </div>
      )}

    </>
  );
};

export default Home;