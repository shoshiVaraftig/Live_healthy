import React from 'react';
import { BsHeartFill, BsLightbulb, BsPeople } from 'react-icons/bs';
import { GiWeightScale } from 'react-icons/gi';
import { MdOutlineHealthAndSafety } from 'react-icons/md';

// ייבוא קובץ ה-CSS החדש
import './About.css';

// הערה: נראה שהרכיב Home מיובא כאן אבל לא בשימוש,
// אם הוא לא נחוץ, ניתן להסירו. אם כן, וודא שיש לו עיצוב משלו
// או שהוא מותאם לעיצובים החדשים.
// import Home from './home'; 

const About = () => {
  return (
    <div className="about-container">
      {/* <Home />  אם נחוץ, אחרת מחק */}
      <div className="about-header">
        <h1 className="about-title">
          אודות <span className="">Live Healthy</span>
        </h1>
      </div>
      
      <p className="about-intro-text">
        ברוכים הבאים ל-Live Healthy, המקום שבו בריאות ואיכות חיים נפגשים. 
        אנחנו מאמינים שתזונה נכונה היא המפתח לחיים בריאים ומאושרים יותר.
      </p>
      
      <div className="mission-section">
        <h2 className="section-title">
          המשימה שלנו
        </h2>
        <div className="mission-content">
          <div className="mission-icon">
            <BsHeartFill />
          </div>
          <p className="mission-text">
            המשימה שלנו היא לעזור לאנשים לחיות חיים בריאים יותר באמצעות תזונה מאוזנת, 
            מתכונים בריאים וטעימים, ומידע מקצועי שמותאם אישית לצרכים של כל אחד ואחת.
            אנחנו מאמינים שאוכל בריא יכול וצריך להיות טעים, מגוון ונגיש לכולם.
          </p>
        </div>
      </div>
      
      <div className="values-section">
        <h2 className="section-title">
          הערכים שלנו
        </h2>
        <div className="values-grid">
          <div className="value-card">
            <MdOutlineHealthAndSafety className="value-icon" />
            <h3 className="value-title">בריאות מעל הכל</h3>
            <p className="value-description">אנחנו מציבים את הבריאות שלכם בראש סדר העדיפויות, ומספקים מידע מבוסס מדעית.</p>
          </div>
          
          <div className="value-card">
            <BsLightbulb className="value-icon" />
            <h3 className="value-title">חדשנות</h3>
            <p className="value-description">אנחנו תמיד מחפשים דרכים חדשות ויצירתיות לשלב תזונה בריאה בחיי היומיום.</p>
          </div>
          
          <div className="value-card">
            <BsPeople className="value-icon" />
            <h3 className="value-title">קהילתיות</h3>
            <p className="value-description">אנחנו מאמינים בכוח של קהילה תומכת בדרך לאורח חיים בריא יותר.</p>
          </div>
          
          <div className="value-card">
            <GiWeightScale className="value-icon" />
            <h3 className="value-title">איזון</h3>
            <p className="value-description">אנחנו מעודדים גישה מאוזנת לתזונה, ללא דיאטות קיצוניות או הגבלות מיותרות.</p>
          </div>
        </div>
      </div>
      
      <div className="team-section">
        <h2 className="section-title">
          הצוות שלנו
        </h2>
        <div className="team-grid">
          <div className="team-member-card">
            <div className="team-member-avatar">
              <span>ד"ר</span>
            </div>
            <h3 className="team-member-name">ד"ר שרה כהן</h3>
            <p className="team-member-role">דיאטנית קלינית</p>
            <p className="team-member-description">מומחית בתזונה מותאמת אישית עם 15 שנות ניסיון בליווי תהליכי ירידה במשקל.</p>
          </div>
          
          <div className="team-member-card">
            <div className="team-member-avatar">
              <span>שף</span>
            </div>
            <h3 className="team-member-name">שף יוסי לוי</h3>
            <p className="team-member-role">שף ומפתח מתכונים</p>
            <p className="team-member-description">שף בעל ניסיון של 20 שנה, מתמחה בהפיכת מתכונים קלאסיים לגרסאות בריאות יותר.</p>
          </div>
          
          <div className="team-member-card">
            <div className="team-member-avatar">
              <span>M.Sc</span>
            </div>
            <h3 className="team-member-name">מיכל אברהם</h3>
            <p className="team-member-role">תזונאית ספורט</p>
            <p className="team-member-description">מומחית בתזונת ספורטאים, עם התמחות בבניית תפריטים מותאמים לפעילות גופנית.</p>
          </div>
        </div>
      </div>
      
      <div className="contact-section">
        <h2 className="contact-title">צרו קשר</h2>
        <p className="contact-text">
          יש לכם שאלות? רוצים לדעת עוד? אנחנו כאן בשבילכם!
          <br />
          שלחו לנו מייל ל-<a href="mailto:info@livehealthy.co.il">info@livehealthy.co.il</a> 
          או התקשרו ל-<a href="tel:+97235555555">03-5555555</a>
        </p>
      </div>
    </div>
  );
};

export default About;