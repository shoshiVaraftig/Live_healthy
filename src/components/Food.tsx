import React, { useState } from 'react';

interface Product {
  id: string;
  product_name_he?: string;
  product_name?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
  };
}

function Food() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      <ul>
  {searchResults.slice(0, 5).map((product) => (
    <li key={product.id}>
      {product.product_name_he || product.product_name || 'שם לא זמין'}
      {typeof product.nutriments?.['energy-kcal_100g'] === 'number' && (
        <> – {product.nutriments['energy-kcal_100g']} קק"ל ל-100 גרם</>
      )}
    </li>
  ))}
</ul>
    }

    setLoading(true);
    setError(null);

    const apiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      searchTerm
// ...existing code...
    )}&action=process&json=1&lc=he&fields=id,product_name_he,product_name,nutriments`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'YourAppName/1.0 (yourcontact@email.com)', // חשוב להוסיף User-Agent
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.products || []);
    } catch (e: any) {
      setError(e.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>חפש מאכל:</h2>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'מחפש...' : 'חפש'}
      </button>

      {error && <p style={{ color: 'red' }}>שגיאה: {error}</p>}

      {searchResults.length > 0 && (
        <div>
          <h3>תוצאות חיפוש:</h3>
          <ul>
            {searchResults.map((product) => (
              <li key={product.id}>
                
                {product.product_name_he || product.product_name || 'שם לא זמין'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchResults.length === 0 && !loading && searchTerm.trim() !== '' && (
        <p>לא נמצאו תוצאות עבור "{searchTerm}".</p>
      )}
    </div>
  );
}

export default Food;