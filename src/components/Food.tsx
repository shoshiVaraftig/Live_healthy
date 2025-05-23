// src/components/FoodSearchComponent.tsx
import React, { useState, useEffect } from 'react';
import { useFoodSearchStore } from '../store/foodStore';

const FoodSearchComponent: React.FC = () => {
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
      checkAndRefetchIfStale();
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
    <div>
      <h1>Food Calorie Search (with Local Storage)</h1>
      <form onSubmit={handleSearch}>
       <input
  type="text"
  placeholder="Enter food name (e.g., banana)"
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  disabled={loading}
  id="food-search-input" // <-- הוסף ID
  name="foodSearch" // <-- הוסף Name (אופציונלי אם לא שולחים טופס רגיל)
/>
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
        <button type="button" onClick={handleClear} disabled={loading}>
          Clear Search
        </button>
      </form>

      {loading && <p>Loading calorie information...</p>}

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {searchedFoodResult && !loading && !error && (
        <div>
          <h2>Result for: {searchedFoodResult.name}</h2> {/* שימו לב ל-name */}
          <p>ID: {searchedFoodResult.id}</p>
          <p>Calories: {searchedFoodResult.calories}</p>
          <p>Category: {searchedFoodResult.category}</p>
          {searchedFoodResult.servingSize && ( // מציג רק אם קיים
            <p>Serving Size: {searchedFoodResult.servingSize}</p>
          )}
        </div>
      )}

      {!searchedFoodResult && !loading && !error && searchText.trim() && (
        <p>No results found for "{searchText}". Try another food name.</p>
      )}

      <button onClick={() => lastSearchTerm && searchFoodItem(lastSearchTerm)} disabled={loading || !lastSearchTerm}>
        Refetch Current Search
      </button>
    </div>
  );
};

export default FoodSearchComponent;