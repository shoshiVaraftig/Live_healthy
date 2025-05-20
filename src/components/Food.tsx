import { useState } from 'react';

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
      return;
    }

    setLoading(true);
    setError(null);

    const apiUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(
      searchTerm
    )}&action=process&json=1&lc=he&fields=id,product_name_he,product_name,nutriments`;
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'YourAppName/1.0 (yourcontact@email.com)',
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
    <div className="flex justify-center items-center min-h-screen bg-[#f5f7fa] p-4">
      <div className="max-w-md bg-[#ffffff] rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold text-[#1f2937] mb-6 text-center">חפש מאכל</h2>
        
        <div className="flex mb-6">
          <button 
            onClick={handleSearch} 
            disabled={loading}
            className="px-4 py-2 bg-[#0d9488] text-[#ffffff] rounded-r-lg hover:bg-[#0f766e] transition-colors duration-300 disabled:bg-[#99f6e4] disabled:cursor-not-allowed"
          >
            {loading ? 'מחפש...' : 'חפש'}
          </button>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow px-4 py-2 border border-[#d1d5db] rounded-l-lg focus:outline-none focus:ring-1 focus:ring-[#14b8a6] text-right"
            placeholder="הקלד שם מאכל..."
          />
        </div>

        {error && (
          <div className="p-3 mb-4 bg-[#fef2f2] border-r-4 border-[#ef4444] rounded-md text-right">
            <p className="text-[#b91c1c] text-sm">שגיאה: {error}</p>
          </div>
        )}

        {searchResults.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-[#374151] mb-3 text-center">תוצאות חיפוש</h3>
            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
              {searchResults.slice(0, 5).map((product) => (
                <div 
                  key={product.id} 
                  className="p-3 bg-[#f9fafb] rounded-lg border border-[#f3f4f6] hover:border-[#d1d5db] transition-colors duration-200 text-right"
                >
                  <p className="text-[#1f2937] font-medium text-sm">
                    {product.product_name_he || product.product_name || 'שם לא זמין'}
                  </p>
                  {typeof product.nutriments?.['energy-kcal_100g'] === 'number' && (
                    <p className="text-[#4b5563] text-xs mt-1">
                      {product.nutriments['energy-kcal_100g']} קק"ל ל-100 גרם
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && !loading && searchTerm.trim() !== '' && (
          <div className="text-center p-4 bg-[#f9fafb] rounded-lg">
            <p className="text-[#4b5563] text-sm">לא נמצאו תוצאות עבור "{searchTerm}".</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Food;
