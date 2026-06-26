import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold uppercase mb-4">Produk tidak ditemukan</h1>
        <Link to="/shop" className="text-sm underline uppercase tracking-widest">Kembali ke Shop</Link>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      toast.error('Pilih ukuran terlebih dahulu!');
      return;
    }
    
    try {
      await api.post('/cart', {
        productId: product.id,
        ukuran: selectedSize,
        qty: 1
      });
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success(`Berhasil menambahkan ${product.nama} (Ukuran: ${selectedSize}) ke Keranjang!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Gagal menambahkan ke keranjang');
    }
  };



  return (
    <div className="pt-24 pb-16 min-h-screen bg-white">
      <div className="container mx-auto px-6 lg:px-12">
        <Link to="/shop" className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden"
          >
            {product.gambar ? (
              <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover mix-blend-multiply" />
            ) : (
              <div className="w-full h-full bg-gray-200"></div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-4 text-gray-500">{product.brand}</p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-6 leading-none">
              {product.nama}
            </h1>
            <p className="text-2xl font-medium mb-8">Rp {product.harga.toLocaleString('id-ID')}</p>
            
            <p className="text-gray-600 leading-relaxed mb-12">
              {product.deskripsi || "Tidak ada deskripsi untuk produk ini."}
            </p>

            {/* Size Selector */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold tracking-widest uppercase">Select Size (EU)</span>
                <span onClick={() => setShowSizeGuide(true)} className="text-xs text-gray-400 underline cursor-pointer hover:text-black transition-colors">Size Guide</span>
              </div>
              
              {product.sizes && product.sizes.length > 0 ? (
                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((s) => {
                    const isOutOfStock = s.stok <= 0;
                    const isSelected = selectedSize === s.ukuran;
                    return (
                      <button
                        key={s.id}
                        disabled={isOutOfStock}
                        onClick={() => setSelectedSize(s.ukuran)}
                        className={`py-3 border text-sm font-medium transition-colors ${
                          isOutOfStock 
                            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed line-through' 
                            : isSelected 
                              ? 'border-black bg-black text-white' 
                              : 'border-gray-200 hover:border-black'
                        }`}
                      >
                        {s.ukuran}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-red-500">Stok habis / Ukuran tidak tersedia.</p>
              )}
            </div>

            {/* Actions */}
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white px-8 py-5 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex justify-center items-center space-x-3 group mb-12"
            >
              <ShoppingBag size={18} className="transform group-hover:scale-110 transition-transform" />
              <span>Add to Cart</span>
            </button>

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8 mt-12">
              <h2 className="text-xl font-black uppercase tracking-widest mb-6">Customer Reviews</h2>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="space-y-6 max-h-96 overflow-y-auto pr-4">
                  {product.reviews.map(review => (
                    <div key={review.id} className="border-b border-gray-100 pb-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-bold uppercase">{review.nama_user || 'Anonymous'}</span>
                        <span className="text-gray-300">|</span>
                        <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                      </div>
                      <p className="text-sm text-gray-600">{review.komentar}</p>
                      <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Belum ada ulasan untuk produk ini.</p>
              )}
            </div>
          </motion.div>
        </div>
    </div>
      
      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 max-w-lg w-full relative"
          >
            <button onClick={() => setShowSizeGuide(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl font-bold">
              ✕
            </button>
            <h2 className="text-2xl font-black uppercase tracking-widest mb-6">Size Guide</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="py-3 px-4 font-bold uppercase tracking-widest">EU</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-widest">US (Men)</th>
                    <th className="py-3 px-4 font-bold uppercase tracking-widest">Panjang (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">39</td><td className="py-3 px-4">6.5</td><td className="py-3 px-4">24.5</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">40</td><td className="py-3 px-4">7</td><td className="py-3 px-4">25.0</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">41</td><td className="py-3 px-4">8</td><td className="py-3 px-4">26.0</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">42</td><td className="py-3 px-4">8.5</td><td className="py-3 px-4">26.5</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">43</td><td className="py-3 px-4">9.5</td><td className="py-3 px-4">27.5</td></tr>
                  <tr className="border-b border-gray-100"><td className="py-3 px-4">44</td><td className="py-3 px-4">10</td><td className="py-3 px-4">28.0</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-xs text-gray-500 italic">* Ukuran panjang diukur dari tumit hingga ujung jari kaki.</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
