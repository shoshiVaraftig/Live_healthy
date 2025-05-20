import React, { useState, useEffect } from 'react';
import { FaSearch, FaHeart, FaClock, FaUtensils } from 'react-icons/fa';

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
    <div className="container mx-auto px-4 py-8 max-w-6xl" dir="rtl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#15803d] mb-2">מתכונים בריאים</h1>
        <p className="text-[#15803d] opacity-80 max-w-2xl mx-auto">גלו מגוון מתכונים טעימים ובריאים שיעזרו לכם לשמור על אורח חיים בריא</p>
      </div>
      
      {/* Search and filters - FIXED: search bar width */}
      <div className="mb-8 flex flex-col items-center">
        <div className="relative mb-5 max-w-md mx-auto">
          <input
            type="text"
            placeholder="חפש מתכונים..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pr-10 border border-[#15803d] rounded-full focus:outline-none focus:ring-2 focus:ring-[#15803d] transition-all bg-white"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#15803d]" />
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => handleFilterChange('vegetarian')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter.vegetarian 
                ? 'bg-[#15803d] text-white' 
                : 'bg-[#e8f5e9] text-[#15803d] hover:bg-[#c8e6c9]'
            }`}
          >
            צמחוני
          </button>
          <button
            onClick={() => handleFilterChange('vegan')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter.vegan 
                ? 'bg-[#15803d] text-white' 
                : 'bg-[#e8f5e9] text-[#15803d] hover:bg-[#c8e6c9]'
            }`}
          >
            טבעוני
          </button>
          <button
            onClick={() => handleFilterChange('glutenFree')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter.glutenFree 
                ? 'bg-[#15803d] text-white' 
                : 'bg-[#e8f5e9] text-[#15803d] hover:bg-[#c8e6c9]'
            }`}
          >
            ללא גלוטן
          </button>
          <button
            onClick={() => handleFilterChange('dairyFree')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter.dairyFree 
                ? 'bg-[#15803d] text-white' 
                : 'bg-[#e8f5e9] text-[#15803d] hover:bg-[#c8e6c9]'
            }`}
          >
            ללא מוצרי חלב
          </button>
        </div>
      </div>
      
      {/* Recipes grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#e8f5e9] border-t-[#15803d]"></div>
        </div>
      ) : filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div 
              key={recipe.id} 
              className="recipe-card bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all border border-[#e8f5e9]"
            >
              <div className="relative h-48">
                <img 
                  src={recipe.image} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-white p-2 rounded-full shadow-sm flex items-center">
                  <FaHeart className="text-[#dc2626]" />
                  <span className="text-xs font-medium mr-1">{recipe.likes}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-3 text-[#15803d]">{recipe.title}</h3>
                
                <div className="flex justify-between text-sm text-[#15803d] opacity-80 mb-4">
                  <div className="flex items-center">
                    <FaClock className="ml-1.5" />
                    <span>{recipe.readyInMinutes} דקות</span>
                  </div>
                  <div className="flex items-center">
                    <FaUtensils className="ml-1.5" />
                    <span>{recipe.servings} מנות</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.vegetarian && (
                    <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#15803d] text-xs rounded-full">צמחוני</span>
                  )}
                  {recipe.vegan && (
                    <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#15803d] text-xs rounded-full">טבעוני</span>
                  )}
                  {recipe.glutenFree && (
                    <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#15803d] text-xs rounded-full">ללא גלוטן</span>
                  )}
                  {recipe.dairyFree && (
                    <span className="px-2.5 py-1 bg-[#e8f5e9] text-[#15803d] text-xs rounded-full">ללא מוצרי חלב</span>
                  )}
                </div>
                
                <button className="w-full py-2 bg-[#15803d] text-white rounded-full hover:bg-[#166534] transition-all font-medium">
                  צפה במתכון
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-[#f7fee7] rounded-xl border border-[#e8f5e9]">
          <div className="max-w-md mx-auto">
            <h3 className="text-xl font-semibold text-[#15803d] mb-2">לא נמצאו מתכונים</h3>
            <p className="text-[#15803d] opacity-80 mb-6">לא נמצאו מתכונים התואמים את החיפוש שלך. נסה לשנות את הסינון או לחפש מתכון אחר.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilter({ vegetarian: false, vegan: false, glutenFree: false, dairyFree: false });
              }}
              className="px-5 py-2 bg-[#15803d] text-white rounded-full hover:bg-[#166534] transition-all font-medium"
            >
              נקה סינון
            </button>
          </div>
        </div>
      )}

      {/* CSS Styles */}
      <style jsx>{`
        /* Add any custom styles here */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .recipe-card {
          animation: fadeIn 0.5s ease-in-out;
        }

        /* Add smooth transitions */
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          transition-duration: 300ms;
        }

        /* Custom scrollbar for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #15803d;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #166534;
        }

        /* Ensure RTL text direction works properly */
        [dir="rtl"] input {
          text-align: right;
        }

        /* Add hover effects for recipe cards */
        .recipe-card:hover {
          transform: translateY(-4px);
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
          .grid {
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Recipes;
