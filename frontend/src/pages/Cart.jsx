import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      setCartItems(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/cart/${id}`);
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const handleUpdateQty = async (id, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty < 1) return;
    try {
      await api.put(`/cart/${id}`, { qty: newQty });
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (error) {
      console.error('Error updating qty:', error);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#f8f8f8]">
      <div className="container mx-auto px-6 lg:px-12">
        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-12 border-b border-gray-200 pb-6">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <ShoppingBag size={48} className="text-gray-300 mb-6" />
            <h2 className="text-xl font-bold uppercase mb-4">Keranjang Anda Kosong</h2>
            <Link to="/shop" className="bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors">
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id} 
                  className="bg-white p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm"
                >
                  <div className="w-24 h-24 bg-gray-100 flex-shrink-0">
                    {item.gambar ? (
                      <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover mix-blend-multiply" />
                    ) : (
                      <div className="w-full h-full bg-gray-200"></div>
                    )}
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-center">
                    <p className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-1">{item.brand}</p>
                    <h3 className="text-lg font-bold uppercase line-clamp-1">{item.nama}</h3>
                    <p className="text-sm text-gray-500 mt-1">Size: {item.ukuran}</p>
                    <p className="text-sm font-bold mt-2">Rp {item.harga.toLocaleString('id-ID')}</p>
                  </div>

                  <div className="flex items-center gap-4 sm:ml-auto">
                    <div className="flex items-center border border-gray-200">
                      <button onClick={() => handleUpdateQty(item.id, item.qty, -1)} className="px-3 py-1 hover:bg-gray-100">-</button>
                      <span className="px-3 text-sm font-bold">{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item.id, item.qty, 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                    </div>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 shadow-sm sticky top-24">
                <h3 className="text-lg font-bold tracking-widest uppercase mb-6 border-b border-gray-100 pb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pengiriman</span>
                    <span className="font-medium">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
                  <span className="font-bold uppercase tracking-widest">Total</span>
                  <span className="text-xl font-black">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>

                <Link 
                  to="/checkout"
                  className="w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex justify-center items-center space-x-2 group"
                >
                  <span>Checkout</span>
                  <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
