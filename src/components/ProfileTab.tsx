import React from 'react';
import type { PersonalArea as UserDataFromApi } from '../types/personal'

interface Props {
  personalData: UserDataFromApi;
  editFormData: any;
  isEditing: boolean;
  saveError: string | null;
  saveSuccess: boolean;
  savingChanges: boolean;
  handleFormChange: (e: React.ChangeEvent<any>) => void;
  handleSaveClick: (e: React.FormEvent) => void;
  handleEditClick: () => void;
  handleCancelEdit: () => void;
  personalityOptions: { value: string, label: string }[];
  personalityLabels: Record<string, string>;
}

const ProfileTab: React.FC<Props> = ({
  personalData,
  editFormData,
  isEditing,
  saveError,
  saveSuccess,
  savingChanges,
  handleFormChange,
  handleSaveClick,
  handleEditClick,
  handleCancelEdit,
  personalityOptions,
  personalityLabels
}) => {
  const calculateBMI = () => {
    if (personalData?.currentWeight && editFormData.height) {
      const heightInMeters = editFormData.height / 100;
      if (heightInMeters === 0) return '-';
      return Math.round(personalData.currentWeight / Math.pow(heightInMeters, 2));
    }
    return '-';
  };

  return (
    <div className="profile-tab-content">
      <h2 className="section-title">הפרופיל שלי</h2>
      {isEditing ? (
        <form onSubmit={handleSaveClick} className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="currentWeight" className="form-label">משקל נוכחי (ק"ג):</label>
            <input
              type="number"
              id="currentWeight"
              name="currentWeight"
              value={editFormData.currentWeight ?? ''}
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
                <option key={opt.value} value={opt.value}>{opt.label}</option>
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
              ) : 'שמור שינויים'}
            </button>
            <button type="button" onClick={handleCancelEdit} className="secondary-button">בטל</button>
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
                  <span className="info-value">{personalData?.currentWeight || '-'} ק"ג</span>
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
            <button onClick={handleEditClick} className="primary-button">עדכון פרטים</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;
