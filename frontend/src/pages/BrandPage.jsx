import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';

export default function BrandPage() {
  const { brandName } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setLoading(true);
        // Fetch brand details
        const brandRes = await api.get('/brands');
        const foundBrand = brandRes.data.find(b => b.nama.toLowerCase() === brandName.toLowerCase());
        setBrand(foundBrand || { nama: brandName, logo: null });

        // Fetch products for this brand
        const prodRes = await api.get(`/products?brand=${encodeURIComponent(brandName)}`);
        const brandProducts = prodRes.data;
        setProducts(brandProducts);

        // Extract unique categories dynamically based on products available for this brand
        const uniqueCategories = ['All', ...new Set(brandProducts.map(p => p.kategori))];
        setCategories(uniqueCategories);
        setActiveCategory('All');
      } catch (err) {
        console.error('Error fetching brand data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [brandName]);

  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.kategori === activeCategory);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      {/* Brand Hero Section */}
      <div className="container mx-auto px-6 lg:px-12 mb-12">
        <div className="bg-gray-50 rounded-3xl p-12 lg:p-20 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
          {brand?.logo ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="h-32 md:h-48 w-full max-w-md relative z-10 mb-8 flex items-center justify-center mix-blend-multiply"
            >
              <img src={brand.logo} alt={brand.nama} className="max-h-full max-w-full object-contain" />
            </motion.div>
          ) : (
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase z-10 mb-6">{brandName}</h1>
          )}
          <p className="text-gray-500 uppercase tracking-[0.3em] text-sm font-semibold z-10">Official Collection</p>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12">
        {/* Dynamic Filter Tab */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-3xl font-black tracking-tight uppercase mb-2">Footwear</h2>
            <p className="text-sm text-gray-500 uppercase tracking-widest">{filteredProducts.length} Items</p>
          </div>

          <div className="flex space-x-6 mt-6 md:mt-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-xs font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-colors ${
                  activeCategory === c ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-gray-800'
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
            <p className="mb-2 text-lg">Koleksi kosong.</p>
            <p className="text-sm">Belum ada sepatu di kategori ini untuk {brand?.nama}.</p>
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
