import { BiUser } from "react-icons/bi";
import { BsFillCupHotFill } from "react-icons/bs";
import { BsClipboardHeart } from "react-icons/bs";
import { BsChatDots } from "react-icons/bs";
import { BsInfoCircle } from "react-icons/bs";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import './home.css';
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from './logo.tsx';

function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  // עקוב אחר שינויים בגודל המסך
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
    <div className="color">
      <div>
        {/* כפתור המבורגר למסכים קטנים */}
        {isMobile && (
          <button 
            className="fixed top-4 left-4 z-50 p-2 bg-white rounded-full shadow-md"
            onClick={toggleMenu}
            aria-label="תפריט"
            style={{ border: 'none', outline: 'none' }}
          >
            {isMenuOpen ? 
              <RiCloseLine size={25} color="#15803d" /> : 
              <RiMenu3Line size={25} color="#15803d" />
            }
          </button>
        )}

        <nav className={`
          w-full 
          ${isMobile ? (isMenuOpen ? 'flex' : 'hidden') : 'flex'} 
          ${isMobile ? 'flex-col' : 'flex-row'} 
          justify-around items-center 
          py-4 bg-white
          border-b border-b-green-500
          ${isMobile ? 'fixed inset-0 z-40 pt-16' : 'relative'}
          ${isMobile ? 'rounded-none' : 'rounded-b-[10rem]'}
        `}>
          <div className={`flex flex-col items-center ${isMobile ? 'my-4' : 'my-0'}`}>
            <div className="mb-2">
              <BiUser size={25} color="#15803d" />
            </div>
            <Link to="/personal-area" className="topics hover:underline" onClick={() => isMobile && setIsMenuOpen(false)}>
              Personal
            </Link>
          </div>

          <div className={`flex flex-col items-center ${isMobile ? 'my-4' : 'my-0'}`}>
            <div className="mb-2">
              <BsFillCupHotFill size={25} color="#15803d" />
            </div>
            <Link to="/food" className="topics hover:underline" onClick={() => isMobile && setIsMenuOpen(false)}>
              Food
            </Link>
          </div>

          <div className={`flex flex-col items-center ${isMobile ? 'my-4' : 'my-0'}`}>
            <div className="mb-2">
              <BsClipboardHeart size={25} color="#15803d" />
            </div>
            <Link to="/recipes" className="topics hover:underline" onClick={() => isMobile && setIsMenuOpen(false)}>
              Recipes
            </Link>
          </div>

          <div className={`flex flex-col items-center ${isMobile ? 'my-4' : 'my-0'}`}>
            <div className="mb-2">
              <BsInfoCircle size={25} color="#15803d" />
            </div>
            <Link to="/about" className="topics hover:underline" onClick={() => isMobile && setIsMenuOpen(false)}>
              About Us
            </Link>
          </div>
        </nav>

        <div className={`${isMenuOpen && isMobile ? 'pt-64' : 'pt-0'} transition-all duration-300`}>
          {isHomePage && <Logo />}
          <button className="but" aria-label="chat-bot">
            <BsChatDots size={40} color="#15803d"/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
