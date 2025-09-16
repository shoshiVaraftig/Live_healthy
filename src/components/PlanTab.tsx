// src/components/PlanTab.tsx

import React, { useState, useEffect } from 'react';
import type { UpdateUserData } from "./PersonalArea";
import type { PersonalArea as UserDataFromApi } from "../types/personal";
import type { Recipe } from '../types/recipe';



// ✅ The Food type as defined in PersonalArea
type Food = {
    id: number;
    name: string;
    calories: number;
    servingSize: string;
};

interface Props {
    personalData: UserDataFromApi;
    isEditing: boolean;
    editFormData: UpdateUserData;
    handleFormChange: (e: React.ChangeEvent<any>) => void;
    setEditFormData: React.Dispatch<React.SetStateAction<UpdateUserData>>;
    handleSave: (e: React.FormEvent) => void;
    handleEdit: () => void;
    handleCancel: () => void;
    savingChanges: boolean;
    allFoods: Food[];
}

const PlanTab: React.FC<Props> = ({
    personalData,
    isEditing,
    editFormData,
    
    setEditFormData,
    handleSave,
    handleEdit,
    handleCancel,
    savingChanges,
    allFoods
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFoods, setFilteredFoods] = useState<Food[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const results = allFoods.filter(food =>
                food.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).slice(0, 10);
            setFilteredFoods(results);
        } else {
            setFilteredFoods([]);
        }
    }, [searchTerm, allFoods]);

    const handleAddFavorite = (food: Food) => {
        const newFavorite = { id: food.id.toString(), title: food.name };
        const currentFavorites = Array.isArray(editFormData.favoriteRecipes)
            ? editFormData.favoriteRecipes
            : [];
        
        // מניעת כפילויות
        if (!currentFavorites.find(r => r.id === newFavorite.id)) {
            setEditFormData({
                ...editFormData,
                favoriteRecipes: [...currentFavorites, newFavorite],
            });
            setSearchTerm(''); // ניקוי שדה החיפוש
        }
    };

    // ✅ השתמש ברשימת המתכונים מה-props - גם בזמן עריכה וגם בזמן תצוגה
    const displayedFavoriteRecipes =personalData?.favoriteRecipes;

    return (
        <div className="plan-tab-content">
            <h2 className="section-title">תוכנית התזונה שלי</h2>

            {isEditing ? (
                <form onSubmit={handleSave}>
                    <h3 className="section-subtitle">עדכון תוכנית תזונה</h3>
                    
                    <div className="form-group">
                        <label className="form-label" htmlFor="recipe-search">הוסף מתכון אהוב:</label>
                        <input
                            id="recipe-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="form-input"
                            placeholder="התחל להקליד שם מתכון..."
                        />
                        {filteredFoods.length > 0 && (
                            <ul className="recipe-results-list">
                                {filteredFoods.map(food => (
                                    <li key={food.id} onClick={() => handleAddFavorite(food)}>
                                        {food.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="form-group">
                        <h3 className="section-subtitle">מתכונים אהובים שנבחרו</h3>
                        <ul className="selected-recipes-list">
                            {Array.isArray(displayedFavoriteRecipes) && displayedFavoriteRecipes.length > 0 ? (
                                displayedFavoriteRecipes.map(data => (
                                    <li key={data.id}>
                                        {data.recipe.Title}
                                        <button
                                            type="button"
                                            onClick={() => setEditFormData({
                                                ...editFormData,
                                                favoriteRecipes: editFormData.favoriteRecipes?.filter(r => r.id !== data.id),
                                            })}
                                            className="remove-recipe-button"
                                        >
                                            &times;
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <li>עדיין לא בחרת מתכונים.</li>
                            )}
                        </ul>
                    </div>

                    <div className="button-group">
                        <button type="submit" className="save-button-green" disabled={savingChanges}>
                            {savingChanges ? 'שומר שינויים...' : 'שמור'}
                        </button>
                        <button type="button" onClick={handleCancel} className="cancel-button">ביטול</button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="plan-content-columns">
                        <div className="plan-column-item">
                            <div className="diet-plan-card">
                                <h3 className="section-subtitle">מתכונים אהובים</h3>
                                <ul className="diet-plan-text favorite-recipes-list">
                                    {Array.isArray(displayedFavoriteRecipes) && displayedFavoriteRecipes.length > 0 ? (
                                        displayedFavoriteRecipes.map(data => (
                                            <li key={data.id}>
                                                <button
                                                    className="favorite-recipe-link"
                                                    onClick={() => setSelectedRecipe(data.recipe)}
                                                >
                                                    {data.recipe.Title}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>לא נבחרו מתכונים.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                </>
            )}

            {selectedRecipe && (
              <div className="recipe-modal-backdrop">
    <div className="recipe-modal">
        <button className="close-button" onClick={() => setSelectedRecipe(null)}>
            &times;
        </button>
        <h2 className="modal-title">{selectedRecipe.Title}</h2>
        
        {/* ✅ שינוי עבור המרכיבים */}
        <h4 className="modal-subtitle">מרכיבים:</h4>
        {Array.isArray(selectedRecipe.Ingredients) && (
            <ul className="ingredients-list">
                {selectedRecipe.Ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        )}

        {/* ✅ שינוי עבור הוראות ההכנה */}
        <h4 className="modal-subtitle">הוראות הכנה:</h4>
        {Array.isArray(selectedRecipe.Instructions) && (
            <ol className="instructions-list">
                {selectedRecipe.Instructions.map((item, index) => (
                    <p key={index}>{item}</p>
                ))}
            </ol>
        )}
    </div>
</div>
            )}
        </div>
    );
};

export default PlanTab;