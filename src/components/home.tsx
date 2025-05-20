import { BiUser } from "react-icons/bi";
import { BsFillCupHotFill } from "react-icons/bs";
import { BsClipboardHeart } from "react-icons/bs";
import { BsChatDots } from "react-icons/bs";
import { BsInfoCircle } from "react-icons/bs";
import './home.css';
import { Link } from "react-router-dom";
function Home ()  {
  return (
    <div className="color">
<div >

<nav className="w-full flex justify-around items-center py-4 bg-gray-100 border-b border-b-green-500">
<div className="flex flex-col items-center">
  <div className="mb-2">
    <BiUser size={25} color="#15803d" />
  </div>
<Link to="/personal-area" className="topics hover:underline">
    Personal
  </Link></div>

<div className="flex flex-col items-center">
  <div className="mb-2">
    <BsFillCupHotFill size={25} color="#15803d" />
  </div>
 <Link to="/food" className="topics hover:underline">
Food  </Link></div>

<div className="flex flex-col items-center">
  <div className="mb-2">
    <BsClipboardHeart size={25} color="#15803d" />
  </div>
 <Link to="/recipes" className="topics hover:underline">
Recipes  </Link></div>

<div className="flex flex-col items-center">
  <div className="mb-2">
    <BsInfoCircle size={25} color="#15803d" />
  </div>
<Link to="/about" className="topics hover:underline">
    About Us
  </Link></div>
</nav>
<h1 className="live-healthy-title">Live <span>healthy</span></h1>
      <button  className="but" 
        aria-label="צ'אט בוט">
<BsChatDots size={40} color="#15803d"/>
      </button>
    </div>
    </div>
  );
};

export default Home;