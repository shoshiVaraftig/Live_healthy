import React, { useEffect, useState } from 'react';

interface Recipe {
  id: number;
  name: string;
  description: string;
}

const Recipes: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recipes') // כתובת ה-API שלך
      .then(res => res.json())
      .then(data => setRecipes(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>טוען מתכונים...</div>;

  return (
    <div>
      <h2>Recipes</h2>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.name}</h3>
            <p>{recipe.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Recipes;