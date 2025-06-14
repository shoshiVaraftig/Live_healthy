// src/components/PersonalArea.tsx
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { personalService } from '../services/personalService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './PersonalArea.css';
import type { PersonalArea as UserDataFromApi } from "../types/personal";

// ממשק עבור נתוני הטופס שניתנים לעדכון - חלק מממשק PersonalArea
interface UpdateUserData extends Partial<UserDataFromApi> {
  height?: number; // זה עדיין שדה מקומי ל-UI, לא נשלח ל-API
  dietaryPreferenceFoodNames?: string[];
  chatPersonality?: string
}

function PersonalArea() {
  const [personalData, setPersonalData] = useState<UserDataFromApi | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');

  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<UpdateUserData>({});
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const personalityOptions = [
    { value: 'friendly', label: 'חברותי ותומך' },
    { value: 'strict', label: 'קשוח וממוקד' },
    { value: 'motivational', label: 'מדרבן ואנרגטי' },
    { value: 'scientific', label: 'הסברי ומדויק' },
  ];

  const personalityLabels: Record<string, string> = {
    friendly: 'חברותי ותומך',
    strict: 'קשוח וממוקד',
    motivational: 'מדרבן ואנרגטי',
    scientific: 'הסברי ומדויק',
  };

  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuthStore();
  const navigate = useNavigate();
  const fetchPersonalData = async () => {
    try {
      setLoadingData(true);
      if (!user?.id) throw new Error("User ID is missing");

      const currentUser = await personalService.getPersonalArea(user.id);

      console.log("👤 משתמש נוכחי:", currentUser);
      console.log("📏 גובה מהשרת:", currentUser.height);
      console.log("⚖️ משקל מהשרת:", currentUser.startWeight);

      setPersonalData(currentUser);
      setEditFormData({
        startWeight: currentUser.startWeight || undefined,
        height: currentUser.height || undefined,
        chatPersonality: currentUser.chatPersonality || '',
        dietaryPreferenceFoodNames: currentUser.dietaryPreferences?.map(p => p.foodName) || [],
      });

      setErrorData(null);
    } catch (err: any) {
      setErrorData(err.message);
      console.error('PersonalArea - Error fetching personal area:', err);
      if (!isAuthenticated) {
        navigate('/login');
      }
    } finally {
      setLoadingData(false);
    }
  };


  useEffect(() => {
    if (isLoadingAuth) {
      return;
    }

    if (isAuthenticated) {
      fetchPersonalData();
    } else {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, isLoadingAuth]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setSaveError(null);
    setSaveSuccess(false);
    if (personalData) {
      setEditFormData({
        startWeight: personalData.startWeight || undefined,
        height: personalData.height || 170,
        chatPersonality: personalData.chatPersonality || '',
        dietaryPreferenceFoodNames: personalData.dietaryPreferences?.map(p => p.foodName) || [],
      });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'startWeight' || name === 'height') {
      setEditFormData(prev => ({
        ...prev,
        [name]: Number(value),
      }));
    } else if (name === 'chatPersonality') {
      setEditFormData(prev => ({
        ...prev,
        chatPersonality: value,
      }));
    } else if (name === 'dietaryPreferenceFoodName') {
      const items = value
        .split(',')
        .map(v => v.trim())
        .filter(v => v !== '');

      setEditFormData(prev => ({
        ...prev,
        dietaryPreferenceFoodNames: items,
      }));
    }
  };


  const handleSaveClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingChanges(true);
    setSaveError(null);
    setSaveSuccess(false);


    try {
      if (!user?.id) { // ודא שיש ID למשתמש
        throw new Error("User ID is missing, cannot update personal area.");
      }

      // בונה את אובייקט העדכון בהתאם למה שה-API מצפה לו (Partial<PersonalArea>)
      const updatePayload: Partial<UserDataFromApi> = {
        // חשוב: ה-API מצפה לאובייקט PersonalArea מלא (או לפחות עם כל השדות שחובה)
        // מכיוון שזו בקשת PUT, נשלח את הנתונים המלאים הקיימים, בתוספת השינויים.
        ...personalData, // התחל עם הנתונים המלאים הקיימים
        // כעת דרוס את השדות ששונו מהטופס
        startWeight: editFormData.startWeight,
        chatPersonality: editFormData.chatPersonality,
      };

      // טיפול ב-dietaryPreference: אם foodName שונה, עדכן את כל האובייקט
      if (editFormData.dietaryPreferenceFoodNames !== undefined) {
        // צור מערך חדש של dietaryPreferences
        updatePayload.dietaryPreferences = editFormData.dietaryPreferenceFoodNames.map((name, index) => ({
          foodName: name,
          id: personalData?.dietaryPreferences?.[index]?.id || 0,
          userId: user.id,
          like: personalData?.dietaryPreferences?.[index]?.like ?? '',
        }));
      }



      // הסר שדות שאינם ניתנים לעדכון או שאינם נשלחים
      delete (updatePayload as any).id; // ה-ID ב-URL, לא בגוף הבקשה
      delete (updatePayload as any).password; // לא נשלח סיסמה בעדכון פרופיל
      await personalService.updatePartialPersonalArea(user.id, {
        startWeight: editFormData.startWeight,
        height: editFormData.height,
        chatPersonality: editFormData.chatPersonality,
        dietaryPreferences: (editFormData.dietaryPreferenceFoodNames || []).map((name) => ({
          foodName: name,
          id: 0,
          userId: user.id,
          like: ''
        }))
      });;// העבר את ה-ID וה-payload המעודכן
      await fetchPersonalData(); // רענן את הנתונים לאחר שמירה מוצלחת
      setSaveSuccess(true);
      setIsEditing(false); // חזור למצב צפייה לאחר שמירה
    } catch (err: any) {
      setSaveError(err.message || 'שגיאה בשמירת הנתונים.');
      console.error('PersonalArea - Error saving personal data:', err);
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSaveError(null);
    setSaveSuccess(false);
    if (personalData) {
      setEditFormData({
        startWeight: personalData.startWeight || undefined,
        height: personalData.height || undefined,
        chatPersonality: personalData.chatPersonality || '',
        dietaryPreferenceFoodNames: personalData.dietaryPreferences?.map(p => p.foodName) || [],
      });
    }
  };

  const calculateBMI = () => {
    if (personalData?.startWeight && editFormData.height) {
      const heightInMeters = editFormData.height / 100;
      if (heightInMeters === 0) return '-';
      return Math.round(personalData.startWeight / Math.pow(heightInMeters, 2));
    }
    return '-';
  };

  if (isLoadingAuth) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>בודק מצב אימות...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <div className="error-message">אין הרשאה. אנא התחבר.</div>;
  }

  if (loadingData) {
    return (
      <div className="loading-spinner-container">
        <div className="spinner"></div>
        <p>טוען מידע אישי...</p>
      </div>
    );
  }

  if (errorData) {
    return <div className="error-message">שגיאה בטעינת מידע אישי: {errorData}</div>;
  }

  if (!personalData) {
    return <div className="info-message">אין מידע אישי זמין.</div>;
  }

  return (
    <div className="personal-area-wrapper">
      <div className="personal-area-container">
        <div className="main-header-card">
          <h1 className="main-title">אזור אישי</h1>
          <p className="welcome-message">ברוך הבא, {personalData?.username || 'משתמש'}</p>
        </div>

        <div className="tabs-navigation">
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          >
            פרופיל
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}
          >
            נתונים
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}
          >
            תוכנית תזונה
          </button>
        </div>

        <div className="tab-content-card">
          {activeTab === 'profile' && (
            <div className="profile-tab-content">
              <h2 className="section-title">הפרופיל שלי</h2>

              {isEditing ? (
                <form onSubmit={handleSaveClick} className="edit-profile-form">
                  <div className="form-group">
                    <label htmlFor="startWeight" className="form-label">משקל נוכחי (ק"ג):</label>
                    <input
                      type="number"
                      id="startWeight"
                      name="startWeight"
                      value={editFormData.startWeight ?? ''}
                      onChange={handleFormChange}
                      className="form-input"
                      step="0.1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="height" className="form-label">גובה (ס"מ):</label>
                    <input
                      type="number"
                      id="height"
                      name="height"
                      value={editFormData.height ?? ''}
                      onChange={handleFormChange}
                      className="form-input"
                      step="1"
                      placeholder="הזן גובה"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="chatPersonality" className="form-label">מטרות / הערות:</label>
                    <select
                      id="chatPersonality"
                      name="chatPersonality"
                      value={editFormData.chatPersonality ?? ''}
                      onChange={handleFormChange}
                      className="form-input"
                    >
                      <option value="">בחר סגנון מאמן</option>
                      {personalityOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>


                  </div>
                  <div className="form-group">
                    <label htmlFor="dietaryPreferenceFoodName" className="form-label">תוכנית תזונה (טקסט חופשי):</label>
                    <textarea
                      id="dietaryPreferenceFoodName"
                      name="dietaryPreferenceFoodName"
                      value={editFormData.dietaryPreferenceFoodNames ?? ''}
                      onChange={handleFormChange}
                      className="form-input textarea-input"
                      rows={4}
                    ></textarea>
                  </div>

                  {saveError && <div className="error-message save-error">{saveError}</div>}
                  {saveSuccess && <div className="success-message">הפרטים נשמרו בהצלחה!</div>}

                  <div className="form-actions-group">
                    <button type="submit" className="primary-button" disabled={savingChanges}>
                      {savingChanges ? (
                        <>
                          <div className="spinner small-spinner"></div>
                          שומר...
                        </>
                      ) : (
                        'שמור שינויים'
                      )}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className="secondary-button">
                      בטל
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-display-content">
                  <div className="profile-content-columns">
                    <div className="profile-column-item">
                      <div className="profile-summary-card">
                        <div className="profile-avatar">
                          {personalData?.username?.charAt(0)}
                        </div>
                        <h3 className="profile-name">{personalData?.username}</h3>
                        <p className="profile-email">{personalData?.email}</p>
                      </div>
                    </div>

                    <div className="profile-column-item">
                      <div className="personal-info-card">
                        <h3 className="section-subtitle">פרטים אישיים</h3>
                        <div className="info-item">
                          <span className="info-value">{personalData?.startWeight || '-'} ק"ג</span>
                          <span className="info-label">משקל</span>
                        </div>
                        <div className="info-item">
                          <span className="info-value">{editFormData.height || '-'} ס"מ</span>
                          <span className="info-label">גובה</span>
                        </div>
                        <div className="info-item no-border">
                          <span className="bmi-value">{calculateBMI()}</span>
                          <span className="info-label">BMI</span>
                        </div>
                      </div>

                      <div className="goals-card">
                        <h3 className="section-subtitle">המטרות שלי</h3>
                        <p className="goals-text">
                          {personalityLabels[personalData?.chatPersonality ?? ''] || 'לא נבחר סגנון.'}
                        </p>
                      </div>

                    </div>
                  </div>

                  <div className="button-group">
                    <button onClick={handleEditClick} className="primary-button">
                      עדכון פרטים
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-tab-content">
              <h2 className="section-title">הנתונים שלי</h2>
              <div className="stats-grid-container">
                <div className="stat-item-card">
                  <div className="stat-number">{personalData?.startWeight || '-'}</div>
                  <div className="stat-label">משקל נוכחי (ק"ג)</div>
                </div>
                <div className="stat-item-card">
                  <div className="stat-number">{personalData?.goalWeight || '-'}</div>
                  <div className="stat-label">משקל יעד (ק"ג)</div>
                </div>
                <div className="stat-item-card">
                  <div className="stat-number">
                    {personalData?.startWeight && personalData?.goalWeight
                      ? (personalData.goalWeight - personalData.startWeight).toFixed(1)
                      : '-'}
                  </div>
                  <div className="stat-label">נותרו (ק"ג)</div>
                </div>
              </div>

              <div className="progress-card">
                <h3 className="section-subtitle">התקדמות</h3>
                <div className="progress-bar-container">
                  {personalData?.startWeight && personalData?.goalWeight && (
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.max(
                          0,
                          Math.min(
                            100,
                            ((personalData.startWeight - (personalData.weightTracing?.weight || personalData.startWeight)) /
                              (personalData.startWeight - personalData.goalWeight)) *
                            100
                          )
                        ) || 0
                          }%`,
                      }}
                    ></div>
                  )}
                </div>
                <div className="progress-labels">
                  <span>יעד</span>
                  <span className="progress-percentage">
                    {personalData?.startWeight && personalData?.goalWeight
                      ? `${Math.max(
                        0,
                        Math.min(
                          100,
                          ((personalData.startWeight - (personalData.weightTracing?.weight || personalData.startWeight)) /
                            (personalData.startWeight - personalData.goalWeight)) *
                          100
                        )
                      ).toFixed(0)
                      }% הושלמו`
                      : '0% הושלמו'}
                  </span>
                  <span>התחלה</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plan' && (
            <div className="plan-tab-content">
              <h2 className="section-title">תוכנית התזונה שלי</h2>
              <div className="plan-content-columns">
                <div className="plan-column-item">
                  <div className="diet-plan-card">
                    <h3 className="section-subtitle">סוג תזונה</h3>
                    v<ul className="diet-plan-text">
                      {personalData.dietaryPreferences?.length
                        ? personalData.dietaryPreferences.map((item, i) => (
                          <li key={item.id || i}>{item.foodName}</li>
                        ))
                        : <li>לא הוגדרה תוכנית תזונה.</li>}
                    </ul>                  </div>
                </div>
                <div className="plan-column-item">
                  <div className="daily-recommendations-card">
                    <h3 className="section-subtitle">המלצות יומיות</h3>
                    <div className="recommendations-grid-container">
                      <div className="recommendation-item">
                        <div className="recommendation-number">2000</div>
                        <div className="recommendation-label">קלוריות</div>
                      </div>
                      <div className="recommendation-item">
                        <div className="recommendation-number">150</div>
                        <div className="recommendation-label">חלבונים (גרם)</div>
                      </div>
                      <div className="recommendation-item">
                        <div className="recommendation-number">3</div>
                        <div className="recommendation-label">מים (ליטר)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="button-group">
                <button className="primary-button">
                  הורדת תפריט שבועי
                </button>
              </div>
            </div>
          )}
          <div className="logout-button-container">
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              התנתק
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalArea;