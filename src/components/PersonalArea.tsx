import React, { useState, useEffect } from 'react';

// הנח שיש לך ממשק למשתמש שמגיע מהשרת
interface User {
  name: string;
  email: string;
  weight?: number;
  height?: number;
  goals?: string;
  dietPlan?: string;
}

function PersonalArea() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile'); // profile, stats, plan

  // כאן תהיה קריאה לשרת לקבלת נתוני המשתמש
  useEffect(() => {
    // קריאת API לשרת שלך תהיה כאן
    // setUser(data מהשרת)
    // setLoading(false)
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-t-[#0d9488] border-r-[#0d9488] border-b-[#0d9488] border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="max-w-4xl mx-auto p-6">
        {/* כותרת ראשית */}
        <div className="bg-[#ffffff] rounded-xl shadow-md p-8 mb-6 text-center border-b-4 border-[#0d9488]">
          <h1 className="text-3xl font-bold text-[#0f172a] mb-2">אזור אישי</h1>
          <p className="text-[#64748b]">ברוך הבא, {user?.name}</p>
        </div>

        {/* תפריט לשוניות */}
        <div className="flex justify-center mb-8 bg-[#ffffff] rounded-lg shadow-sm p-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'profile'
                ? 'bg-[#0d9488] text-[#ffffff]'
                : 'bg-transparent text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            פרופיל
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'stats'
                ? 'bg-[#0d9488] text-[#ffffff]'
                : 'bg-transparent text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            נתונים
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'plan'
                ? 'bg-[#0d9488] text-[#ffffff]'
                : 'bg-transparent text-[#475569] hover:bg-[#f1f5f9]'
            }`}
          >
            תוכנית תזונה
          </button>
        </div>

        {/* תוכן הלשונית הנבחרת */}
        <div className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden">
          {activeTab === 'profile' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6 text-center">הפרופיל שלי</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-center p-6 bg-[#f8fafc] rounded-xl">
                  <div className="w-32 h-32 bg-[#0d9488] rounded-full flex items-center justify-center text-[#ffffff] text-4xl font-bold mb-4">
                    {user?.name?.charAt(0)}
                  </div>
                  <h3 className="text-xl font-semibold text-[#0f172a]">{user?.name}</h3>
                  <p className="text-[#64748b] mt-1">{user?.email}</p>
                </div>
                
                <div className="bg-[#f8fafc] rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#0f172a] mb-4 text-right">פרטים אישיים</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
                      <span className="font-medium text-[#0f172a]">{user?.weight} ק"ג</span>
                      <span className="text-[#64748b]">משקל</span>
                    </div>
                    
                    <div className="flex justify-between items-center border-b border-[#e2e8f0] pb-2">
                      <span className="font-medium text-[#0f172a]">{user?.height} ס"מ</span>
                      <span className="text-[#64748b]">גובה</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-[#0f172a]">
                        {user?.weight && user?.height ? 
                          Math.round(user.weight / Math.pow(user.height / 100, 2)) : '-'}
                      </span>
                      <span className="text-[#64748b]">BMI</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-[#f8fafc] rounded-xl">
                <h3 className="text-xl font-semibold text-[#0f172a] mb-4 text-right">המטרות שלי</h3>
                <p className="text-[#334155] text-right">{user?.goals}</p>
              </div>
              
              <div className="mt-6 flex justify-center">
                <button className="px-6 py-3 bg-[#0d9488] text-[#ffffff] rounded-lg hover:bg-[#0f766e] transition-colors duration-300 shadow-md">
                  עדכון פרטים
                </button>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6 text-center">הנתונים שלי</h2>
              
              {/* כאן יוצגו הנתונים מהשרת */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-[#f8fafc] rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#0d9488] mb-2">{/* משקל נוכחי מהשרת */}</div>
                  <div className="text-[#64748b]">משקל נוכחי (ק"ג)</div>
                </div>
                
                <div className="bg-[#f8fafc] rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#0d9488] mb-2">{/* משקל יעד מהשרת */}</div>
                  <div className="text-[#64748b]">משקל יעד (ק"ג)</div>
                </div>
                
                <div className="bg-[#f8fafc] rounded-xl p-6 text-center">
                  <div className="text-4xl font-bold text-[#0d9488] mb-2">{/* הפרש מהשרת */}</div>
                  <div className="text-[#64748b]">נותרו (ק"ג)</div>
                </div>
              </div>
              
              <div className="bg-[#f8fafc] rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-[#0f172a] mb-4 text-right">התקדמות</h3>
                <div className="w-full h-4 bg-[#e2e8f0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0d9488] rounded-full" 
                    style={{ width: '0%' }} // אחוז ההתקדמות יגיע מהשרת
                  ></div>
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-[#64748b] text-sm">יעד</span>
                  <span className="text-[#64748b] text-sm">
                    {/* אחוז ההתקדמות מהשרת */}% הושלמו
                  </span>
                  <span className="text-[#64748b] text-sm">התחלה</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-[#0f172a] mb-6 text-center">תוכנית התזונה שלי</h2>
              
              <div className="bg-[#f8fafc] rounded-xl p-6 mb-8">
                <h3 className="text-xl font-semibold text-[#0f172a] mb-4 text-right">סוג תזונה</h3>
                <p className="text-[#334155] text-right">{user?.dietPlan}</p>
              </div>
              
              <div className="bg-[#f8fafc] rounded-xl p-6">
                <h3 className="text-xl font-semibold text-[#0f172a] mb-4 text-right">המלצות יומיות</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-[#ffffff] p-4 rounded-lg border border-[#e2e8f0] text-center">
                    <div className="text-2xl font-bold text-[#0d9488] mb-1">
                      {/* קלוריות מהשרת */}
                    </div>
                    <div className="text-[#64748b] text-sm">קלוריות</div>
                  </div>
                  
                  <div className="bg-[#ffffff] p-4 rounded-lg border border-[#e2e8f0] text-center">
                    <div className="text-2xl font-bold text-[#0d9488] mb-1">
                      {/* חלבונים מהשרת */}
                    </div>
                    <div className="text-[#64748b] text-sm">חלבונים</div>
                  </div>
                  
                  <div className="bg-[#ffffff] p-4 rounded-lg border border-[#e2e8f0] text-center">
                    <div className="text-2xl font-bold text-[#0d9488] mb-1">
                      {/* מים מהשרת */}
                    </div>
                    <div className="text-[#64748b] text-sm">מים</div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-center">
                  <button className="px-6 py-3 bg-[#0d9488] text-[#ffffff] rounded-lg hover:bg-[#0f766e] transition-colors duration-300 shadow-md">
                    הורדת תפריט שבועי
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PersonalArea;
