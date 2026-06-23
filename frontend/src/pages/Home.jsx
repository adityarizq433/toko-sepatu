import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductCard from '../components/ui/ProductCard';
import HeroSlider from '../components/ui/HeroSlider';
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
      <HeroSlider />

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
              src="/editorial.png" 
              alt="Editorial Streetwear" 
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
