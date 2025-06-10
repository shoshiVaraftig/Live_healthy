// src/components/Home.tsx (שם מתאים יותר יהיה Navbar.tsx)
import { BiUser } from "react-icons/bi";
import { BsFillCupHotFill, BsClipboardHeart, BsChatDots, BsInfoCircle } from "react-icons/bs";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import './home.css'; // ייבוא ה-CSS של ה-Navbar
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
// import Logo from './logo.tsx'; // אם ה-Logo שייך ל-Navbar, השאר אותו. אחרת, הסר.

function Home() { // אם שינית את השם ל-Navbar, עדכן כאן גם
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  // ה-useLocation וה-isHomePage כבר לא נחוצים כאן כי ה-Navbar גלובלי
  // const location = useLocation();
  // const isHomePage = location.pathname === "/" || location.pathname === "/home";

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); // סגור תפריט במעבר לדסקטופ
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <> {/* Fragment עוטף את ה-Navbar וכפתור הצ'אט */}
      {/* כפתור המבורגר למסכים קטנים */}
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

      {/* סרגל הניווט הראשי */}
      <nav className={`
        navbar 
        ${isMobile && isMenuOpen ? 'navbar-mobile-open' : ''} 
      `}>
        {/* תוכן ה-Navbar */}
        {/* אם ה-Logo שייך ל-Navbar, שים אותו כאן */}
        {/* <div className="navbar-logo"><Logo /></div> */}

        <div className="flex flex-col items-center">
          <div className="mb-2">
            <BiUser size={25} color="#15803d" />
          </div>
          <Link to="/personal-area" className="topics" onClick={() => isMobile && setIsMenuOpen(false)}>
            Personal
          </Link>
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

      {/* כפתור הצ'אט-בוט - נשאר כאן אם הוא שייך ל-Navbar באופן קבוע */}
      <button className="but" aria-label="chat-bot">
        <BsChatDots size={40} color="#15803d"/>
      </button>
    </>
  );
};

export default Home; // או Navbar אם שינית את השם