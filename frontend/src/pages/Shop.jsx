import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products', { params: { search: searchQuery } });
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter(p => p.kategori.toLowerCase() === category.toLowerCase());

  const categories = ['All', 'Sneakers', 'Designer', 'Running', 'Boots'];

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">Shop Collection</h1>
            {searchQuery ? (
              <p className="text-sm text-gray-500 tracking-widest mt-2">
                SEARCH RESULTS FOR: <span className="text-black font-bold uppercase">"{searchQuery}"</span> ({filteredProducts.length})
              </p>
            ) : (
              <p className="text-sm text-gray-500 uppercase tracking-widest">{filteredProducts.length} Items</p>
            )}
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${
                  category === c ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-gray-800'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <p className="mb-2">Koleksi kosong.</p>
            <p className="text-sm">Belum ada sepatu di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
