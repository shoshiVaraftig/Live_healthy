import React from 'react';
import type { PersonalArea as UserDataFromApi } from "../types/personal";

interface Props {
  personalData: UserDataFromApi;
  isEditing: boolean;
  editFormData: any;
  handleFormChange: (e: React.ChangeEvent<any>) => void;
  handleSave: (e: React.FormEvent) => void;
  handleEdit: () => void;
  handleCancel: () => void;
  savingChanges: boolean;
}

const PlanTab: React.FC<Props> = ({
  personalData,
  isEditing,
  editFormData,
  handleFormChange,
  handleSave,
  handleEdit,
  handleCancel,
  savingChanges
}) => {
  return (
    <div className="plan-tab-content">
      <h2 className="section-title">תוכנית התזונה שלי</h2>

      {isEditing ? (
        <form onSubmit={handleSave}>
          <div className="form-group">
            <label htmlFor="dietaryPreferenceFoodName">תוכנית תזונה (מופרד בפסיקים):</label>
            <textarea
              name="dietaryPreferenceFoodName"
              id="dietaryPreferenceFoodName"
              rows={4}
              className="form-input"
              value={editFormData.dietaryPreferenceFoodNames?.join(', ') ?? ''}
              onChange={handleFormChange}
            ></textarea>
          </div>

          <div className="form-actions-group">
            <button type="submit" className="primary-button" disabled={savingChanges}>
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
                <h3 className="section-subtitle">סוג תזונה</h3>
                <ul className="diet-plan-text">
                  {personalData.dietaryPreferences?.length ? (
                    personalData.dietaryPreferences.map((item, i) => (
                      <li key={item.id || i}>{item.foodName}</li>
                    ))
                  ) : (
                    <li>לא הוגדרה תוכנית תזונה.</li>
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
            <button onClick={handleEdit} className="primary-button">ערוך</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PlanTab;
