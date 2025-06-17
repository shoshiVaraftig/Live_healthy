import React, { useState, useEffect } from 'react';
import type { PersonalArea as UserDataFromApi } from "../types/personal";
import type { Food } from "../types/food";
import type { UpdateUserData } from "./PersonalArea"; // ודא שקובץ זה מייצא את הממשק

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
  handleFormChange,
  setEditFormData,
  handleSave,
  handleEdit,
  handleCancel,
  savingChanges
}) => {
  const [foodQuery, setFoodQuery] = useState('');
  const [allFoods, setAllFoods] = useState<Food[]>([]);

  useEffect(() => {
    fetch("http://localhost:5181/api/food")
      .then(res => res.json())
      .then(data => setAllFoods(data))
      .catch(err => console.error("שגיאה בטעינת מאכלים:", err));
  }, []);

  const selectedFoods: string[] = editFormData.dietaryPreferenceFoodNames || [];

  const filteredSuggestions = allFoods.filter(f =>
    f.name.includes(foodQuery) &&
    !selectedFoods.includes(f.name)
  ).slice(0, 8);

  return (
    <div className="plan-tab-content">
      <h2 className="section-title">תוכנית התזונה שלי</h2>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="programLevel">בחר תוכנית תזונה:</label>
            <select
              id="programLevel"
              name="programLevel"
              className="form-input"
              value={editFormData.programLevel || ''}
              onChange={handleFormChange}
            >
              <option value="">בחר תוכנית</option>
              <option value="תוכנית מתונה 1600 קלוריות">תוכנית מתונה 1600 קלוריות</option>
              <option value="תוכנית סטנדרט 1200 קלוריות">תוכנית סטנדרט 1200 קלוריות</option>
              <option value="תוכנית אקספרס 1000 קלוריות">תוכנית אקספרס 1000 קלוריות</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="foodSearch">העדפות תזונה (מאכלים):</label>
            <input
              type="text"
              id="foodSearch"
              className="form-input"
              placeholder="חפש מאכל..."
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
            />
            {foodQuery && filteredSuggestions.length > 0 && (
              <ul className="food-suggestions-list">
                {filteredSuggestions.map((food) => (
                  <li
                    key={food.id}
                    onClick={() => {
                      const newList = [...selectedFoods, food.name];
                      setEditFormData((prev: UpdateUserData) => {
                        const updated = {
                          ...prev,
                          dietaryPreferenceFoodNames: newList
                        };
                        console.log("מאכל נבחר ונשמר בטופס:", updated);
                        return updated;
                      });
                      setFoodQuery('');
                    }}

                  >
                    {food.name} ({food.calories} קלוריות, {food.servingSize})
                  </li>
                ))}
              </ul>
            )}
            <div className="selected-foods-list">
              {selectedFoods.map((food, idx) => (
                <span key={idx} className="selected-food-item">
                  {food}
                  <button
                    type="button"
                    onClick={() => {
                      const updated = selectedFoods.filter(f => f !== food);
                      setEditFormData((prev: UpdateUserData) => ({
                        ...prev,
                        dietaryPreferenceFoodNames: updated
                      }));
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions-group">
            <button type="submit" className="edit-button-green" disabled={savingChanges}>
              {savingChanges ? "שומר..." : "שמור"}
            </button>
            <button type="button" onClick={handleCancel} className="secondary-button">בטל</button>
          </div>
        </form>
      ) : (
        <>
          <div className="plan-content-columns">
            <div className="plan-column-item">
              <div className="diet-plan-card">
                <h3 className="section-subtitle">סוג תוכנית</h3>
                <div className="diet-plan-text">
                  {personalData.programLevel || "לא הוגדרה תוכנית."}
                </div>
              </div>
              <div className="diet-plan-card">
                <h3 className="section-subtitle">מאכלים מועדפים</h3>
                <ul className="diet-plan-text">
                  {personalData.dietaryPreferences?.length ? (
                    personalData.dietaryPreferences.map((item, i) => (
                      <li key={item.id || i}>{item.foodName}</li>
                    ))
                  ) : (
                    <li>לא נבחרו מאכלים.</li>
                  )}
                </ul>
              </div>
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
            <button onClick={handleEdit} className="edit-button-green">ערוך</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanTab;
