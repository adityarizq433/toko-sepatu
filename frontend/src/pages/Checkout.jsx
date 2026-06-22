import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    kota: '',
    kodepos: '',
    phone: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.length === 0) {
        navigate('/cart');
      }
      setCartItems(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    // Gabungkan alamat
    const alamatLengkap = `${formData.nama} | ${formData.phone} | ${formData.alamat}, ${formData.kota}, ${formData.kodepos}`;
    
    try {
      await api.post('/orders/checkout', {
        alamatPengiriman: alamatLengkap
      });
      // Panggil event agar icon keranjang di navbar berubah jadi 0
      window.dispatchEvent(new Event('cartUpdated'));
      setIsSuccess(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Gagal memproses pesanan. Silakan coba lagi.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.harga * item.qty), 0);

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] pt-24 pb-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-12 shadow-sm text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
          >
            <CheckCircle size={64} className="text-black mx-auto mb-6" />
          </motion.div>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-4">Order Berhasil!</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Terima kasih telah berbelanja di Langkah Kita. Pesanan Anda sedang diproses dan akan segera dikirim.
          </p>
          <Link 
            to="/shop" 
            className="inline-block bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors w-full"
          >
            Lanjutkan Belanja
          </Link>
        </motion.div>
      </div>
    );
  }

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
        <Link to="/cart" className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest uppercase text-gray-500 hover:text-black transition-colors mb-12">
          <ArrowLeft size={16} />
          <span>Back to Cart</span>
        </Link>

        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-12 border-b border-gray-200 pb-6">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Form Pengiriman */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3 className="text-lg font-bold tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">Shipping Details</h3>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Nama Lengkap</label>
                <input 
                  type="text" 
                  name="nama"
                  required
                  value={formData.nama}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Nomor HP</label>
                <input 
                  type="tel" 
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                  placeholder="081234567890"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Alamat Lengkap</label>
                <textarea 
                  name="alamat"
                  required
                  value={formData.alamat}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors resize-none"
                  placeholder="Jl. Sudirman No. 123"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Kota</label>
                  <input 
                    type="text" 
                    name="kota"
                    required
                    value={formData.kota}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                    placeholder="Jakarta"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Kode Pos</label>
                  <input 
                    type="text" 
                    name="kodepos"
                    required
                    value={formData.kodepos}
                    onChange={handleInputChange}
                    className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors"
                    placeholder="10000"
                  />
                </div>
              </div>
            </form>
          </motion.div>

          {/* Ringkasan Belanja */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="bg-white p-8 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">Order Summary</h3>
              
              <div className="space-y-6 mb-8 max-h-[40vh] overflow-y-auto pr-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                      {item.gambar && <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover mix-blend-multiply" />}
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold uppercase line-clamp-1">{item.nama}</p>
                      <p className="text-xs text-gray-500 mt-1">Size: {item.ukuran} | Qty: {item.qty}</p>
                    </div>
                    <p className="text-sm font-medium whitespace-nowrap">Rp {(item.harga * item.qty).toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-6 space-y-4 mb-8">
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

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex justify-center items-center"
              >
                Place Order
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
