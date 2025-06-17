import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { personalService } from '../services/personalService';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './PersonalArea.css';
import type { PersonalArea as UserDataFromApi } from "../types/personal";
import { usePersonalStore } from '../store/personalStore';
import ProfileTab from './ProfileTab';
import StatsTab from './StatsTab';
import PlanTab from './PlanTab';
import Food from './Food';

export interface UpdateUserData {
  height?: number;
  goalWeight?: number;
  currentWeight?: number;
  programLevel?: string;
  chatPersonality?: string;
  dietaryPreferenceFoodNames?: string[];
}

type Food = {
  id: number;
  name: string;
  calories: number;
  servingSize: string;
};

function PersonalArea() {
  const [personalData, setPersonalData] = useState<UserDataFromApi | null>(null);
  const { setPersonalData: setPersonalDataToStore } = usePersonalStore();
  const [loadingData, setLoadingData] = useState(true);
  const [errorData, setErrorData] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [editFormData, setEditFormData] = useState<UpdateUserData>({});
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editStats, setEditStats] = useState(false);
  const [editPlan, setEditPlan] = useState(false);
  const [allFoods, setAllFoods] = useState<Food[]>([]);


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
      setPersonalData(currentUser);
      setPersonalDataToStore(currentUser);
      setEditFormData({
        goalWeight: currentUser.goalWeight || undefined,
        currentWeight: currentUser.currentWeight || undefined,
        height: currentUser.height || undefined,
        chatPersonality: currentUser.chatPersonality || '',
        programLevel: currentUser.programLevel || '',
        dietaryPreferenceFoodNames: currentUser.dietaryPreferences?.map(p => p.foodName) || [],
      });

      setErrorData(null);
    } catch (err: any) {
      setErrorData(err.message);
      if (!isAuthenticated) navigate('/login');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isLoadingAuth) return;
    if (isAuthenticated) fetchPersonalData();
    else navigate('/login');
  }, [isAuthenticated, navigate, isLoadingAuth]);

  useEffect(() => {
    fetch("http://localhost:5181/api/food")
      .then(res => res.json())
      .then(data => setAllFoods(data))
      .catch(err => console.error("שגיאה בטעינת מאכלים:", err));
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const handleFormChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    const numericFields = ['startWeight', 'height', 'goalWeight', 'currentWeight'];

    setEditFormData(prev => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  function buildUpdatePayloadByTab(
    tab: string,
    editFormData: UpdateUserData,
    userId: number,
    allFoods: Food[]
  ) {
    const payload: any = {};

    if (tab === 'profile') {
      if (typeof editFormData.currentWeight === 'number')
        payload.currentWeight = editFormData.currentWeight;
      if (typeof editFormData.height === 'number')
        payload.height = editFormData.height;
      if (editFormData.chatPersonality)
        payload.chatPersonality = editFormData.chatPersonality;
    }

    if (tab === 'stats') {
      if (typeof editFormData.goalWeight === 'number')
        payload.goalWeight = editFormData.goalWeight;
      if (typeof editFormData.currentWeight === 'number')
        payload.currentWeight = editFormData.currentWeight;
    }

    if (tab === 'plan') {
      if (editFormData.programLevel?.trim())
        console.log("🟡 allFoods:", allFoods);
      console.log("🟡 selected food names:", editFormData.dietaryPreferenceFoodNames);

      if (Array.isArray(editFormData.dietaryPreferenceFoodNames)) {
        console.log("שמות שנשלחים לשרת:", editFormData.dietaryPreferenceFoodNames);
        payload.dietaryPreferences = editFormData.dietaryPreferenceFoodNames
          .map((name: string) => {
            const food = allFoods.find(f => f.name === name);
            console.log("🔍 מחפש התאמה:", name, "→", food);
            if (!food) return null;
            return {
              foodName: food.name,
              userId: Number(userId),
              like: 'like' // אם בעתיד יהיה "dislike" תוכל להרחיב
            };
          })
          .filter(Boolean); // הסרת null
        console.log("2שמות שנשלחים לשרת:", payload.dietaryPreferences);

      }
    }

    return payload;
  }


  const handleSaveByTab = async (tab: string, closeEdit: () => void) => {
    try {
      if (!user?.id) throw new Error("User ID missing");
      setSavingChanges(true);

      const payload = buildUpdatePayloadByTab(tab, editFormData, user.id, allFoods);
      console.log("📦 מה באמת נשלח:", JSON.stringify(payload, null, 2));
      await personalService.updatePartialPersonalArea(user.id, payload);

      await fetchPersonalData();
      setSaveSuccess(true);
      closeEdit();
    } catch (err: any) {
      setSaveError(err.message || 'שגיאה בשמירה');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveByTab('profile', () => setEditProfile(false));
  };

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveByTab('stats', () => setEditStats(false));
  };

  const handleSavePlan = (e: React.FormEvent) => {
    e.preventDefault();
    handleSaveByTab('plan', () => setEditPlan(false));
  };

  return (
    <div className="personal-area-wrapper">
      <div className="personal-area-container">
        <div className="main-header-card">
          <h1 className="main-title">אזור אישי</h1>
          <p className="welcome-message">ברוך הבא, {personalData?.username || 'משתמש'}</p>
        </div>

        <div className="tabs-navigation">
          <button onClick={() => setActiveTab('profile')} className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}>פרופיל</button>
          <button onClick={() => setActiveTab('stats')} className={`tab-button ${activeTab === 'stats' ? 'active' : ''}`}>נתונים</button>
          <button onClick={() => setActiveTab('plan')} className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`}>תוכנית תזונה</button>
        </div>

        <div className="tab-content-card">
          {activeTab === 'profile' && (
            <ProfileTab
              personalData={personalData!}
              editFormData={editFormData}
              saveError={saveError}
              saveSuccess={saveSuccess}
              savingChanges={savingChanges}
              handleFormChange={handleFormChange}
              handleSaveClick={handleSaveProfile}
              personalityOptions={personalityOptions}
              personalityLabels={personalityLabels}
              isEditing={editProfile}
              handleEditClick={() => {
                setEditProfile(true);
                setSaveError(null);
                setSaveSuccess(false);
              }}
              handleCancelEdit={() => {
                setEditProfile(false);
                setSaveError(null);
                setSaveSuccess(false);
              }}
            />
          )}

          {activeTab === 'stats' && (
            <StatsTab
              personalData={personalData!}
              isEditing={editStats}
              editFormData={editFormData}
              handleFormChange={handleFormChange}
              handleSave={handleSaveStats}
              handleEdit={() => {
                setEditStats(true);
                setSaveSuccess(false);
              }}
              handleCancel={() => {
                setEditStats(false);
                setSaveError(null);
                setSaveSuccess(false);
              }}
              savingChanges={savingChanges}
            />
          )}

          {activeTab === 'plan' && (
            <PlanTab
              allFoods={allFoods}
              personalData={personalData!}
              isEditing={editPlan}
              editFormData={editFormData}
              handleFormChange={handleFormChange}
              setEditFormData={setEditFormData}
              handleSave={handleSavePlan}
              handleEdit={() => {
                setEditPlan(true);
                setSaveSuccess(false);
              }}
              handleCancel={() => {
                setEditPlan(false);
                setSaveError(null);
                setSaveSuccess(false);
              }}
              savingChanges={savingChanges}
            />
          )}


          <div className="logout-button-container">
            <button onClick={handleLogout} className="logout-button">התנתק</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalArea;
