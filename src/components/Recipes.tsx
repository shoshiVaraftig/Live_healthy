import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaClock, FaUtensils } from 'react-icons/fa';

// ייבוא קובץ ה-CSS החדש
import './Recipes.css';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  likes: number;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  });

  useEffect(() => {
    // Fetch recipes from server
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipes');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        const data = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    // Apply search filter
    const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Apply dietary filters
    const matchesFilters = 
      (!filter.vegetarian || recipe.vegetarian) &&
      (!filter.vegan || recipe.vegan) &&
      (!filter.glutenFree || recipe.glutenFree) &&
      (!filter.dairyFree || recipe.dairyFree);
    
    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (filterName: keyof typeof filter) => {
    setFilter({
      ...filter,
      [filterName]: !filter[filterName],
    });
  };

  return (
    <div className="recipes-container">
      <div className="page-header">
        <h1 className="page-title">מתכונים בריאים</h1>
        <p className="page-description">גלו מגוון מתכונים טעימים ובריאים שיעזרו לכם לשמור על אורח חיים בריא</p>
      </div>
      
      {/* Search and filters */}
      <div className="search-filter-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="חפש מתכונים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <FaSearch className="search-icon" />
        </div>
        
        <div className="filter-buttons-container">
          <button
            onClick={() => handleFilterChange('vegetarian')}
            className={`filter-button ${filter.vegetarian ? 'active' : 'inactive'}`}
          >
            צמחוני
          </button>
          <button
            onClick={() => handleFilterChange('vegan')}
            className={`filter-button ${filter.vegan ? 'active' : 'inactive'}`}
          >
            טבעוני
          </button>
          <button
            onClick={() => handleFilterChange('glutenFree')}
            className={`filter-button ${filter.glutenFree ? 'active' : 'inactive'}`}
          >
            ללא גלוטן
          </button>
          <button
            onClick={() => handleFilterChange('dairyFree')}
            className={`filter-button ${filter.dairyFree ? 'active' : 'inactive'}`}
          >
            ללא מוצרי חלב
          </button>
        </div>
      </div>
      
      {/* Recipes grid */}
      {loading ? (
        <div className="loading-spinner-wrapper">
          <div className="loading-spinner"></div>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="recipe-card"
            >
              <div className="recipe-image-wrapper">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="recipe-image"
                />
                <div className="recipe-likes">
                  <FaHeart className="recipe-likes-icon" />
                  <span className="">{recipe.likes}</span>
                </div>
              </div>
              
              <div className="recipe-content">
                <h3 className="recipe-title">{recipe.title}</h3>
                
                <div className="recipe-meta">
                  <div className="meta-item">
                    <FaClock className="meta-icon" />
                    <span>{recipe.readyInMinutes} דקות</span>
                  </div>
                  <div className="meta-item">
                    <FaUtensils className="meta-icon" />
                    <span>{recipe.servings} מנות</span>
                  </div>
                </div>
                
                <div className="dietary-tags-container">
                  {recipe.vegetarian && (
                    <span className="dietary-tag">צמחוני</span>
                  )}
                  {recipe.vegan && (
                    <span className="dietary-tag">טבעוני</span>
                  )}
                  {recipe.glutenFree && (
                    <span className="dietary-tag">ללא גלוטן</span>
                  )}
                  {recipe.dairyFree && (
                    <span className="dietary-tag">ללא מוצרי חלב</span>
                  )}
                </div>
                
                <button className="view-recipe-button">
                  צפה במתכון
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recipes-found">
          <div className="no-recipes-found-content">
            <h3 className="no-recipes-title">לא נמצאו מתכונים</h3>
            <p className="no-recipes-text">לא נמצאו מתכונים התואמים את החיפוש שלך. נסה לשנות את הסינון או לחפש מתכון אחר.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter({ vegetarian: false, vegan: false, glutenFree: false, dairyFree: false });
              }}
              className="clear-filter-button"
            >
              נקה סינון
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes;