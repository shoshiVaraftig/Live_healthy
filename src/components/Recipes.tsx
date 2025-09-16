import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState } from 'react';
import { FaSearch, FaClock, FaUtensils } from 'react-icons/fa';
import './Recipes.css';
import { useRecipeStore } from '../store/recipeStore';
import { usePersonalStore } from '../store/personalStore';
import { useAuthStore } from '../store/authStore';
import { personalService } from '../services/personalService';
import { useEffect } from 'react';
const Recipes: React.FC = () => {
    const { currentRecipe, loading, error, hasSearched, fetchRecipe, clearRecipeState } = useRecipeStore();
    const { user } = useAuthStore();
    const { personalData } = usePersonalStore();
    
    // ✅ הוספנו משתנה מצב חדש לניהול מצב השמירה
    const [isSaved, setIsSaved] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState({
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
    });
    const [isSaving, setIsSaving] = useState(false);

 useEffect(() => {
        // מנקה את מצב המתכון והחיפוש כאשר הקומפוננטה נטענת
        clearRecipeState();
        setIsSaved(false);
    }, [clearRecipeState]); 

    const handleSearch = () => {
        if (!searchTerm.trim()) {
            toast.error('אנא הזן שם של מתכון לחיפוש.', { className: 'toast2' });
            return;
        }
        fetchRecipe({ query: searchTerm, ...filter });
        // ✅ איפוס מצב השמירה כאשר מחפשים מתכון חדש
        setIsSaved(false);
    };

    const handleFilterChange = (filterName: keyof typeof filter) => {
        setFilter({
            ...filter,
            [filterName]: !filter[filterName],
        });
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setFilter({ vegetarian: false, vegan: false, glutenFree: false, dairyFree: false });
        clearRecipeState();
        // ✅ איפוס מצב השמירה כאשר מנקים את החיפוש
        setIsSaved(false);
    };

    const handleSaveFavorite = async () => {
        // ✅ בדיקה מקומית מיידית - אם המתכון כבר נשמר, מונעים שמירה חוזרת
        if (isSaved) {
            toast.info('המתכון כבר נשמר בהצלחה.');
            return;
        }

        if (!user?.id || !currentRecipe) {
            toast.error('שגיאה: לא ניתן לשמור את המתכון. חסרים נתונים.');
            return;
        }

        setIsSaving(true);

        try {
            await personalService.addFavoriteRecipe(user.id, currentRecipe);
            // ✅ הגדרת מצב isSaved ל-true לאחר שמירה מוצלחת
            setIsSaved(true);
            toast.success('המתכון נשמר בהצלחה ברשימת מועדפים.');
        } catch (err) {
            console.error("שגיאה בשמירת מתכון:", err);
            toast.error('שגיאה בשמירת המתכון. אנא נסה שוב.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="recipes-container">
            <div className="page-header">
                <h1 className="page-title">מתכונים מותאמים</h1>
                <p className="page-description">
                    הזינו מילת מפתח למתכון יחד עם העדפות תזונתיות, וקבלו מתכון ייחודי ממאמן התזונה שלנו!
                </p>
            </div>

            {/* Search and filters */}
            <div className="search-filter-section">
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="חפש מתכון (לדוגמה: עוגת שוקולד ללא גלוטן)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSearch();
                            }
                        }}
                    />
                    <button onClick={handleSearch} className="search-button">
                        <FaSearch className="search-icon" /> חפש מתכון
                    </button>
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

            {/* Display AI Recipe or messages */}
            {loading ? (
                <div className="loading-spinner-wrapper">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">מחפש מתכון מיוחד עבורך...</p>
                </div>
            ) : hasSearched && error ? (
                <div className="error-display">
                    <h3 className="error-title">שגיאה:</h3>
                    <p className="error-text">
                        {error}
                    </p>
                    <button onClick={handleClearSearch} className="clear-filter-button">
                        נקה חיפוש
                    </button>
                </div>
            ) : hasSearched && currentRecipe ? (
                <div className="recipe-card-display">
                    <h2 className="gpt-recipe-title">{currentRecipe.Title}</h2>
                   

                    {currentRecipe.Description && (
                        <p className="gpt-recipe-description">{currentRecipe.Description}</p>
                    )}

                    <div className="gpt-recipe-meta">
                        {currentRecipe.ReadyInMinutes !== undefined && currentRecipe.ReadyInMinutes !== null && currentRecipe.ReadyInMinutes > 0 && (
                            <div className="meta-item">
                                <FaClock className="meta-icon" />
                                <span>{currentRecipe.ReadyInMinutes} דקות הכנה</span>
                            </div>
                        )}
                        {currentRecipe.Servings !== undefined && currentRecipe.Servings !== null && currentRecipe.Servings > 0 && (
                            <div className="meta-item">
                                <FaUtensils className="meta-icon" />
                                <span>{currentRecipe.Servings} מנות</span>
                            </div>
                        )}
                    </div>

                    <div className="dietary-tags-container">
                        {currentRecipe.Vegetarian && <span className="dietary-tag">צמחוני</span>}
                        {currentRecipe.Vegan && <span className="dietary-tag">טבעוני</span>}
                        {currentRecipe.GlutenFree && <span className="dietary-tag">ללא גלוטן</span>}
                        {currentRecipe.DairyFree && <span className="dietary-tag">ללא מוצרי חלב</span>}
                    </div>

                    {Array.isArray(currentRecipe.Ingredients) && currentRecipe.Ingredients.length > 0 && currentRecipe.Ingredients[0] !== "אין מרכיבים זמינים" && (
                        <>
                            <h3 className="section-title">מרכיבים:</h3>
                            <ul className="gpt-recipe-list ingredients-list">
                                {currentRecipe.Ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {Array.isArray(currentRecipe.Instructions) && currentRecipe.Instructions.length > 0 && currentRecipe.Instructions[0] !== "אין הוראות זמינות" && (
                        <>
                            <h3 className="section-title">הוראות הכנה:</h3>
                            <ol className="gpt-recipe-list instructions-list">
                                {currentRecipe.Instructions.map((instruction, index) => (
                                    <li key={index}>{instruction}</li>
                                ))}
                            </ol>
                        </>
                    )}

                    <div className="button-group">
                        <button
                            onClick={handleSaveFavorite}
                            className="save-favorite-button"
                            // ✅ השינוי העיקרי: הכפתור מנוטרל אם המתכון כבר נשמר או אם הוא בתהליך שמירה
                            disabled={isSaving || isSaved}
                        >
                            {isSaving ? 'שומר...' : isSaved ? '✅ נשמר במועדפים' : '⭐ הוסף למועדפים'}
                        </button>
                        <button onClick={handleClearSearch} className="clear-search-button">
                            חיפוש מתכון חדש
                        </button>
                    </div>
                </div>
            ) : (
                <div className="initial-search-prompt">
                    <p>הזינו את המתכון שאתם רוצים לחפש בשורת החיפוש למעלה.</p>
                </div>
            )}
        </div>
    );
};

export default Recipes;