import React from 'react';
import { BsHeartFill, BsLightbulb, BsPeople } from 'react-icons/bs';
import { GiWeightScale } from 'react-icons/gi';
import { MdOutlineHealthAndSafety } from 'react-icons/md';
import Home from './home';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Home></Home>
      <h1 className="text-center text-4xl md:text-5xl font-bold text-[#15803d] mb-12 tracking-wide font-['Montserrat','Assistant',Arial,sans-serif]">
        אודות <span className="text-[#81c784]">Live Healthy</span>
      </h1>
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <p className="text-lg text-gray-700 leading-relaxed font-['Roboto','Open_Sans',Arial,sans-serif]">
          ברוכים הבאים ל-Live Healthy, המקום שבו בריאות ואיכות חיים נפגשים. 
          אנחנו מאמינים שתזונה נכונה היא המפתח לחיים בריאים ומאושרים יותר.
        </p>
      </div>
      
      <div className="mb-16">
        <h2 className="text-center text-3xl font-bold text-[#15803d] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#81c784]">
          המשימה שלנו
        </h2>
        <div className="flex flex-col md:flex-row items-center bg-[#f6fff7] p-8 rounded-xl shadow-sm">
          <div className="flex-shrink-0 mb-6 md:mb-0 md:ml-8">
            <BsHeartFill size={60} className="text-[#15803d]" />
          </div>
          <p className="text-lg text-gray-700 leading-relaxed">
            המשימה שלנו היא לעזור לאנשים לחיות חיים בריאים יותר באמצעות תזונה מאוזנת, 
            מתכונים בריאים וטעימים, ומידע מקצועי שמותאם אישית לצרכים של כל אחד ואחת.
            אנחנו מאמינים שאוכל בריא יכול וצריך להיות טעים, מגוון ונגיש לכולם.
          </p>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-center text-3xl font-bold text-[#15803d] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#81c784]">
          הערכים שלנו
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <MdOutlineHealthAndSafety size={40} className="text-[#15803d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#15803d] mb-3">בריאות מעל הכל</h3>
            <p className="text-gray-600">אנחנו מציבים את הבריאות שלכם בראש סדר העדיפויות, ומספקים מידע מבוסס מדעית.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <BsLightbulb size={40} className="text-[#15803d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#15803d] mb-3">חדשנות</h3>
            <p className="text-gray-600">אנחנו תמיד מחפשים דרכים חדשות ויצירתיות לשלב תזונה בריאה בחיי היומיום.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <BsPeople size={40} className="text-[#15803d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#15803d] mb-3">קהילתיות</h3>
            <p className="text-gray-600">אנחנו מאמינים בכוח של קהילה תומכת בדרך לאורח חיים בריא יותר.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-md">
            <GiWeightScale size={40} className="text-[#15803d] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-[#15803d] mb-3">איזון</h3>
            <p className="text-gray-600">אנחנו מעודדים גישה מאוזנת לתזונה, ללא דיאטות קיצוניות או הגבלות מיותרות.</p>
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-center text-3xl font-bold text-[#15803d] mb-8 relative pb-4 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-[#81c784]">
          הצוות שלנו
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-32 h-32 bg-[#f6fff7] rounded-full flex items-center justify-center text-xl font-bold text-[#15803d] mx-auto mb-6">
              <span>ד"ר</span>
            </div>
            <h3 className="text-xl font-semibold text-[#15803d] mb-2">ד"ר שרה כהן</h3>
            <p className="text-[#81c784] font-medium mb-4">דיאטנית קלינית</p>
            <p className="text-gray-600">מומחית בתזונה מותאמת אישית עם 15 שנות ניסיון בליווי תהליכי ירידה במשקל.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-32 h-32 bg-[#f6fff7] rounded-full flex items-center justify-center text-xl font-bold text-[#15803d] mx-auto mb-6">
              <span>שף</span>
            </div>
            <h3 className="text-xl font-semibold text-[#15803d] mb-2">שף יוסי לוי</h3>
            <p className="text-[#81c784] font-medium mb-4">שף ומפתח מתכונים</p>
            <p className="text-gray-600">שף בעל ניסיון של 20 שנה, מתמחה בהפיכת מתכונים קלאסיים לגרסאות בריאות יותר.</p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm text-center">
            <div className="w-32 h-32 bg-[#f6fff7] rounded-full flex items-center justify-center text-xl font-bold text-[#15803d] mx-auto mb-6">
              <span>M.Sc</span>
            </div>
            <h3 className="text-xl font-semibold text-[#15803d] mb-2">מיכל אברהם</h3>
            <p className="text-[#81c784] font-medium mb-4">תזונאית ספורט</p>
            <p className="text-gray-600">מומחית בתזונת ספורטאים, עם התמחות בבניית תפריטים מותאמים לפעילות גופנית.</p>
          </div>
        </div>
      </div>
      
      <div className="bg-[#f6fff7] p-8 rounded-xl shadow-sm text-center">
        <h2 className="text-3xl font-bold text-[#15803d] mb-6">צרו קשר</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          יש לכם שאלות? רוצים לדעת עוד? אנחנו כאן בשבילכם!
          <br />
          שלחו לנו מייל ל-<a href="mailto:info@livehealthy.co.il" className="text-[#15803d] font-medium hover:text-[#81c784] hover:underline transition-colors">info@livehealthy.co.il</a> 
          או התקשרו ל-<a href="tel:+97235555555" className="text-[#15803d] font-medium hover:text-[#81c784] hover:underline transition-colors">03-5555555</a>
        </p>
      </div>
    </div>
  );
};

export default About;
