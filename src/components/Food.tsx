import React, { useState, useEffect } from 'react';
import { useFoodSearchStore } from '../store/foodStore';
import './FoodSearchComponent.css';

const Food: React.FC = () => {
  const [searchText, setSearchText] = useState<string>('');
  const {
    searchedFoodResult,
    loading,
    error,
    lastSearchTerm,
  } = useFoodSearchStore();

  const { searchFoodItem, clearSearch } = useFoodSearchStore();



  useEffect(() => {
    if (lastSearchTerm) {
      setSearchText(lastSearchTerm);
    }

  }, [lastSearchTerm]);
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
    <div className="food-search-container">
      <h1 className="food-title">
        חיפוש קלוריות במזון
      </h1>
      <form onSubmit={handleSearch} className="food-search-form">
        <input
          type="text"
          placeholder="חיפוש מזון (לדוגמה: בננה)"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          disabled={loading}
          className="food-search-input"
          id="food-search-input"
          name="foodSearch"
          autoComplete="off"
        />
        <button type="submit" disabled={loading} className="food-btn">
          {loading ? (
            <>
               מחפש...
            </>
          ) : (
            "חיפוש"
          )}
      



  </button>
  <button type="button" onClick={handleClear} disabled={loading} className="food-btn secondary">
    נקה חיפוש
  </button>
 </form>

      {loading && (
        <p className="loading-message">
           טוען מידע על קלוריות...
        </p>
      )}

      {error && <p className="error-message">שגיאה: {error}</p>}

      {searchedFoodResult && !loading && !error && (

        <div className="food-result-card fade-in">
          <div className="result-header">
            <h2>תוצאה עבור: {searchedFoodResult.name}</h2>
          </div>
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

      <div className="refetch-button-wrapper">
        <button
          onClick={() => lastSearchTerm && searchFoodItem(lastSearchTerm)}
          disabled={loading || !lastSearchTerm}
          className="refetch-button food-btn"
        >
          רענן חיפוש נוכחי
        </button>
      </div>
    </div>
  );
};

export default Food;