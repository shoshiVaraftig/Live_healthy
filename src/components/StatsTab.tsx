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

const StatsTab: React.FC<Props> = ({
    personalData,
    isEditing,
    editFormData,
    handleFormChange,
    handleSave,
    handleEdit,
    handleCancel,
    savingChanges
}) => {
    const start = personalData?.startWeight ?? null;
    const goal = personalData?.goalWeight ?? null;
    const current = personalData?.currentWeight ?? null;

    const calcProgress = () => {
        if (!start || !goal) return 0;
        const progress = ((start - current) / (start - goal)) * 100;
        return Math.max(0, Math.min(100, progress));
    };

    return (
        <div className="stats-tab-content">
            <h2 className="section-title">הנתונים שלי</h2>

            {isEditing ? (
                <form onSubmit={handleSave}>
                    <div className="form-group">
                        <label>משקל יעד (ק"ג):</label>
                        <input
                            type="number"
                            name="goalWeight"
                            value={
                                typeof editFormData.goalWeight === 'number' && !isNaN(editFormData.goalWeight)
                                    ? editFormData.goalWeight
                                    : ''
                            }
                            onChange={handleFormChange}
                            className="form-input"
                        />

                    </div>
                    <div className="form-group">
                        <label>משקל נוכחי (ק"ג):</label>
                        <input
                            type="number"
                            name="currentWeight"
                            value={
                                typeof editFormData.currentWeight === 'number' && !isNaN(editFormData.currentWeight)
                                    ? editFormData.currentWeight
                                    : ''
                            }
                            onChange={handleFormChange}
                            className="form-input"
                        />
                    </div>


                    <div className="form-actions-group">
                        <button type="submit" className="primary-button" disabled={savingChanges}>
                            {savingChanges ? "שומר..." : "שמור"}
                        </button>
                        <button type="button" onClick={handleCancel} className="secondary-button">
                            בטל
                        </button>
                    </div>
                </form>
            ) : (
                <>
                    <div className="stats-grid-container">
                        <div className="stat-item-card">
                            <div className="stat-number">{current ?? '-'}</div>
                            <div className="stat-label">משקל נוכחי (ק"ג)</div>
                        </div>
                        <div className="stat-item-card">
                            <div className="stat-number">{goal ?? '-'}</div>
                            <div className="stat-label">משקל יעד (ק"ג)</div>
                        </div>
                        <div className="stat-item-card">
                            <div className="stat-number">
                                {start && goal ? (goal - start).toFixed(1) : '-'}
                            </div>
                            <div className="stat-label">נותרו (ק"ג)</div>
                        </div>
                    </div>
                    <div className="progress-card">
                        <h3 className="section-subtitle">התקדמות</h3>

                        <div className="progress-bar-container">
                            {start && goal && (
                                <div
                                    className="progress-bar-fill"
                                    style={{ width: `${calcProgress().toFixed(0)}%` }}
                                ></div>
                            )}
                        </div>

                        <div className="progress-labels">
                            <span>יעד</span>
                            <span className="progress-percentage">
                                {start && goal
                                    ? `${(start - current).toFixed(1)} ק"ג מתוך ${(start - goal).toFixed(1)} ק"ג (${calcProgress().toFixed(0)}% הושלמו)`
                                    : 'אין מספיק נתונים'}
                            </span>
                            <span>התחלה</span>
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

export default StatsTab;
