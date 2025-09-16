// src/components/PersonalArea.tsx

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

export interface UpdateUserData {
    height?: number;
    goalWeight?: number;
    currentWeight?: number;
    programLevel?: string;
    chatPersonality?: string;
    dietaryPreferenceFoodNames?: string[];
    // ✅ הוספתי שדה זה כדי לסנכרן עם הקוד
    favoriteRecipes?: { id: string; title: string }[];
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
    const [editingTab, setEditingTab] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<UpdateUserData>({});
    const [savingChanges, setSavingChanges] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
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

            // ✅ כאן השינוי החשוב! סנכרון הנתונים עם ה-editFormData
            setEditFormData({
                goalWeight: currentUser.goalWeight || undefined,
                currentWeight: currentUser.currentWeight || undefined,
                height: currentUser.height || undefined,
                chatPersonality: currentUser.chatPersonality || '',
                programLevel: currentUser.programLevel || '',
                dietaryPreferenceFoodNames: currentUser.dietaryPreferences?.map(p => p.foodName) || [],
                // ✅ עדכון favoriteRecipes מתוך הנתונים המלאים
                favoriteRecipes: currentUser.favoriteRecipes?.map(fr => ({
                    id: fr.recipeId.toString(),
                    title: fr.recipe?.title || ''
                })) || []
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
                payload.programLevel = editFormData.programLevel;
            if (Array.isArray(editFormData.dietaryPreferenceFoodNames)) {
                payload.dietaryPreferences = editFormData.dietaryPreferenceFoodNames
                    .map((name: string) => {
                        const food = allFoods.find(f => f.name === name);
                        if (!food) return null;
                        return {
                            foodName: food.name,
                            userId: Number(userId),
                            like: 'like'
                        };
                    })
                    .filter(Boolean);
            }
             // ✅ הוספה של favoriteRecipes לפיילוד
            if (Array.isArray(editFormData.favoriteRecipes)) {
                payload.favoriteRecipes = editFormData.favoriteRecipes.map(recipe => ({
                    userId: userId,
                    recipeId: Number(recipe.id),
                }));
            }
        }

        return payload;
    }

    const handleEdit = (tabName: string) => {
        setEditingTab(tabName);
        setSaveSuccess(false);
        setSaveError(null);
    };

    const handleCancel = () => {
        setEditingTab(null);
        setSaveSuccess(false);
        setSaveError(null);
    };

    const handleSave = async (tabName: string) => {
        try {
            if (!user?.id) throw new Error("User ID missing");
            setSavingChanges(true);

            const payload = buildUpdatePayloadByTab(tabName, editFormData, user.id, allFoods);
            await personalService.updatePartialPersonalArea(user.id, payload);

            await fetchPersonalData(); // מקבל את הנתונים המעודכנים
            setSaveSuccess(true);
            setEditingTab(null);
        } catch (err: any) {
            setSaveError(err.message || 'שגיאה בשמירה');
        } finally {
            setSavingChanges(false);
        }
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
                            handleSaveClick={() => handleSave('profile')}
                            personalityOptions={personalityOptions}
                            personalityLabels={personalityLabels}
                            isEditing={editingTab === 'profile'}
                            handleEditClick={() => handleEdit('profile')}
                            handleCancelEdit={handleCancel}
                        />
                    )}

                    {activeTab === 'stats' && (
                        <StatsTab
                            personalData={personalData!}
                            isEditing={editingTab === 'stats'}
                            editFormData={editFormData}
                            handleFormChange={handleFormChange}
                            handleSave={() => handleSave('stats')}
                            handleEdit={() => handleEdit('stats')}
                            handleCancel={handleCancel}
                            savingChanges={savingChanges}
                        />
                    )}

                    {activeTab === 'plan' && (
                        <PlanTab
                            allFoods={allFoods}
                            personalData={personalData!}
                            isEditing={editingTab === 'plan'}
                            editFormData={editFormData}
                            handleFormChange={handleFormChange}
                            setEditFormData={setEditFormData}
                            handleSave={() => handleSave('plan')}
                            handleEdit={() => handleEdit('plan')}
                            handleCancel={handleCancel}
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