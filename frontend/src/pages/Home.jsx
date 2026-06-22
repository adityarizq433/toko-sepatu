import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import api from '../api/axios';

export default function Home() {
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        // Ambil 4 produk terbaru
        setLatestProducts(res.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching latest products:', error);
      }
    };
    fetchProducts();
  }, []);
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full bg-[#f4f4f4] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="text-[12vw] font-black uppercase tracking-tighter text-black/5 z-0 select-none whitespace-nowrap"
          >
            Langkah Kita
          </motion.h1>
        </div>
        
        <div className="container mx-auto px-6 lg:px-12 h-full flex flex-col justify-center relative z-10">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-gray-600"
            >
              The New Standard
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-5xl lg:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-8"
            >
              Elevate <br/> Your Stride.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Link 
                to="/shop" 
                className="inline-flex items-center space-x-4 bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors group"
              >
                <span>Shop Collection</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Floating Shoe Image (Decorative) */}
        <motion.div 
          initial={{ opacity: 0, x: 100, rotate: -10 }}
          animate={{ opacity: 1, x: 0, rotate: -15 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.25, 1, 0.5, 1] }}
          className="absolute right-[-10%] top-[20%] w-[60vw] max-w-[800px] pointer-events-none drop-shadow-2xl mix-blend-multiply"
        >
          <img 
            src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" 
            alt="Hero Sneaker" 
            className="w-full h-auto object-contain"
          />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-end mb-12 border-b border-gray-100 pb-6">
            <h2 className="text-3xl lg:text-4xl font-black tracking-tighter uppercase">Latest Drops</h2>
            <Link to="/shop" className="text-xs font-bold tracking-[0.2em] uppercase flex items-center space-x-2 group">
              <span>View All</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {latestProducts.length === 0 ? (
              <div className="col-span-full py-12 text-center text-gray-500">Belum ada produk. Tambahkan produk di halaman Admin.</div>
            ) : (
              latestProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))
            )}
          </div>
        </div>
      </section>
      
      {/* Editorial Section */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/2 aspect-[3/4] lg:aspect-[4/5] relative overflow-hidden bg-gray-900">
            <img 
              src="https://images.unsplash.com/photo-1552346154-21d32810baa3?auto=format&fit=crop&q=80" 
              alt="Editorial" 
              className="object-cover w-full h-full opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 cursor-pointer hover:scale-105"
            />
          </div>
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <span className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-400">Editorial</span>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tighter uppercase leading-none mb-8">
              The Architecture<br/>of Comfort
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 max-w-lg">
              Explore our curated selection of technical footwear that blurs the line between high fashion and everyday utility. Designed for the modern urban landscape.
            </p>
            <Link 
              to="/editorial" 
              className="self-start border border-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
            >
              Read the Story
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
