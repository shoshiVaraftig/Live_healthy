import React, { useState, useEffect } from 'react';
import { useFoodSearchStore } from '../store/foodStore';
import './FoodSearchComponent.css'; // <--- ייבוא קובץ ה-CSS החדש

const Food: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');

  const {
    searchedFoodResult,
    loading,
    error,
    lastSearchTerm,
    checkAndRefetchIfStale,
  } = useFoodSearchStore();

  const { searchFoodItem, clearSearch } = useFoodSearchStore();

  useEffect(() => {
    if (lastSearchTerm) {
      setSearchText(lastSearchTerm);
      // ייתכן שלא נרצה לרפרש אוטומטית ב-useEffect, אלא רק בטעינה ראשונית של העמוד
      // או כשיש צורך. checkAndRefetchIfStale פחות רלוונטי כאן אלא אם כן
      // מדובר בקריאה מחדש של נתונים על בסיס זמן.
      // אם הכוונה היא לרענן את הנתונים אם המשתמש חזר לעמוד לאחר זמן,
      // המיקום הזה עשוי להיות בסדר.
      // checkAndRefetchIfStale();
    }
  }, [lastSearchTerm, checkAndRefetchIfStale]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchText.trim()) {
      searchFoodItem(searchText);
    } else {
      clearSearch();
    }
  };

  const handleClear = () => {
    setSearchText('');
    clearSearch();
  };

  return (
    <div className="food-search-container"> {/* <--- קלאס עוטף חדש */}
      <h1>Food Calorie Search</h1> {/* הוסר "with Local Storage" מהכותרת */}
      <form onSubmit={handleSearch} className="food-search-form"> {/* <--- קלאס חדש לטופס */}
        <input
          type="text"
          placeholder="חיפוש מזון (לדוגמה: בננה)" 
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={loading}
          className="food-search-input" 
          id="food-search-input"
          name="foodSearch"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'מחפש...' : 'חיפוש'} 
        </button>
        <button type="button" onClick={handleClear} disabled={loading}>
          נקה חיפוש 
        </button>
      </form>

      {loading && <p className="loading-message">טוען מידע על קלוריות...</p>} {/* <--- הודעות מצב מעוצבות */}

      {error && <p className="error-message">שגיאה: {error}</p>}

      {searchedFoodResult && !loading && !error && (
        <div className="food-result-card"> {/* <--- כרטיס תוצאה מעוצב */}
          <h2>תוצאה עבור: {searchedFoodResult.name}</h2>
          <p><strong>מזהה:</strong> {searchedFoodResult.id}</p>
          <p><strong>קלוריות:</strong> {searchedFoodResult.calories}</p>
          <p><strong>קטגוריה:</strong> {searchedFoodResult.category}</p>
          {searchedFoodResult.servingSize && (
            <p><strong>גודל מנה:</strong> {searchedFoodResult.servingSize}</p>
          )}
        </div>
      )}

      {!searchedFoodResult && !loading && !error && searchText.trim() && (
        <p className="no-results-message">לא נמצאו תוצאות עבור "{searchText}". נסה שם מזון אחר.</p>
      )}

      <div className="refetch-button-wrapper"> {/* עוטף את כפתור הרענון */}
        <button onClick={() => lastSearchTerm && searchFoodItem(lastSearchTerm)} disabled={loading || !lastSearchTerm} className="refetch-button">
          רענן חיפוש נוכחי {/* <--- כפתור רענן בעברית */}
        </button>
      </div>
    </div>
  );
};

export default Food;