import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 1, 0.5, 1] }}
      className="group relative flex flex-col cursor-pointer"
    >
      <Link to={`/product/${product.id}`} className="absolute inset-0 z-10" />
      
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#f8f8f8] mb-4">
        <motion.img 
          src={product.gambar || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80'} 
          alt={product.nama}
          className="object-cover w-full h-full object-center mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
        />
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
          <button className="w-full bg-white text-black text-xs font-bold tracking-widest uppercase py-3 shadow-lg hover:bg-black hover:text-white transition-colors pointer-events-auto">
            Quick Add
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col space-y-1">
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-500">{product.brand}</span>
          <span className="text-sm font-medium">Rp {product.harga.toLocaleString('id-ID')}</span>
        </div>
        <h3 className="text-sm font-medium line-clamp-1">{product.nama}</h3>
        <p className="text-xs text-gray-400 capitalize">{product.kategori}</p>
      </div>
    </motion.div>
  );
}
