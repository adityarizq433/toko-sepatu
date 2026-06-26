import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Package, MapPin, User, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();

  // Profile Edit State
  const [profileData, setProfileData] = useState({ nama: '', email: '', no_hp: '', password: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({ label: '', alamat: '', is_default: false });

  // Order Details & Review State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ productId: null, productName: '', rating: 5, komentar: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    let fetchOrdersFn = null;

    if (storedUser && storedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setProfileData({ nama: parsedUser.nama || parsedUser.name || '', email: parsedUser.email || '', no_hp: parsedUser.no_hp || '', password: '' });
        
        fetchOrdersFn = () => {
          api.get('/orders/my-orders').then(res => {
            setOrders(res.data || []);
            setLoading(false);
          }).catch(err => {
            console.error(err);
            setLoading(false);
          });
        };
        fetchOrdersFn();
        
        window.addEventListener('orderUpdated', fetchOrdersFn);
        fetchAddresses();
      } catch (e) {
        console.error('Failed to parse user', e);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }

    return () => {
      if (fetchOrdersFn) {
        window.removeEventListener('orderUpdated', fetchOrdersFn);
      }
    };
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authStateChanged'));
    toast.success('Logged out successfully');
    navigate('/login');
  };



  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data || []);
    } catch (err) {
      console.error('Failed to fetch addresses', err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      await api.put('/users/profile', profileData);
      
      // Update local storage user data
      const updatedUser = { ...user, nama: profileData.nama, email: profileData.email, no_hp: profileData.no_hp };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      console.error('Update profile error:', err);
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/addresses', addressForm);
      toast.success('Alamat berhasil ditambahkan!');
      setIsAddressModalOpen(false);
      setAddressForm({ label: '', alamat: '', is_default: false });
      fetchAddresses();
    } catch (err) {
      toast.error('Gagal menambahkan alamat');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      toast.success('Alamat dihapus');
      fetchAddresses();
    } catch (err) {
      toast.error('Gagal menghapus alamat');
    }
  };

  const openOrderDetails = async (orderId) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
      setIsOrderModalOpen(true);
    } catch (err) {
      toast.error('Gagal mengambil detail pesanan');
    }
  };

  const openReviewModal = (item) => {
    setReviewForm({ productId: item.product_id, productName: item.nama || 'Produk', rating: 5, komentar: '' });
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reviews', {
        productId: reviewForm.productId,
        rating: reviewForm.rating,
        komentar: reviewForm.komentar
      });
      toast.success('Ulasan berhasil dikirim!');
      setIsReviewModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mengirim ulasan');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-32">
      <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div className="mb-16">
          <h1 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-2">My Account</h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">Welcome back, {user.nama || user.name}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
              <div className="flex items-center space-x-4 mb-8 pb-8 border-b border-gray-100">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-xl font-bold rounded-full">
                  {(user.nama || user.name || 'U').charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-lg">{user.nama || user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between p-4 font-bold tracking-widest uppercase text-xs transition-colors ${activeTab === 'profile' ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                >
                  <div className="flex items-center space-x-3"><User size={18} /><span>Profile Info</span></div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 font-bold tracking-widest uppercase text-xs transition-colors ${activeTab === 'orders' ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                >
                  <div className="flex items-center space-x-3"><Package size={18} /><span>My Orders</span></div>
                  <ChevronRight size={16} />
                </button>
                <button 
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between p-4 font-bold tracking-widest uppercase text-xs transition-colors ${activeTab === 'addresses' ? 'bg-gray-50 text-black' : 'text-gray-500 hover:bg-gray-50 hover:text-black'}`}
                >
                  <div className="flex items-center space-x-3"><MapPin size={18} /><span>Addresses</span></div>
                  <ChevronRight size={16} />
                </button>
                <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 hover:bg-red-50 text-red-500 font-bold tracking-widest uppercase text-xs transition-colors mt-8">
                  <div className="flex items-center space-x-3"><LogOut size={18} /><span>Log Out</span></div>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 min-h-[400px]">
              {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4 inline-block">Order History</h2>
                  <div className="space-y-6">
                    {loading ? (
                      <p className="text-gray-500">Loading orders...</p>
                    ) : orders.length === 0 ? (
                      <p className="text-gray-500">Belum ada pesanan.</p>
                    ) : orders.map((order, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        key={order.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-200 hover:border-black transition-colors"
                      >
                        <div className="mb-4 sm:mb-0">
                          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Order LK-{order.id}</p>
                          <h4 className="font-bold text-lg mb-1">{new Date(order.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                          <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleTimeString('id-ID')}</p>
                        </div>
                        <div className="text-left sm:text-right mt-4 sm:mt-0 flex flex-col sm:items-end">
                          <p className="font-bold text-lg mb-1">Rp {order.total_harga?.toLocaleString('id-ID')}</p>
                          <span className={`inline-block px-3 py-1 text-xs font-bold tracking-widest uppercase mb-3 ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.status === 'diproses' ? 'bg-orange-100 text-orange-800' :
                            order.status === 'dikirim' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                          <button onClick={() => openOrderDetails(order.id)} className="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black border-b border-black pb-1">
                            View Details
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4 inline-block">Profile Info</h2>
                  <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-md">
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Full Name</label>
                      <input type="text" value={profileData.nama} onChange={(e) => setProfileData({...profileData, nama: e.target.value})} required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Email Address</label>
                      <input type="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Phone Number</label>
                      <input type="text" value={profileData.no_hp} onChange={(e) => setProfileData({...profileData, no_hp: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" placeholder="Contoh: 08123456789" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">New Password (Kosongkan jika tidak ingin ganti)</label>
                      <input type="password" value={profileData.password} onChange={(e) => setProfileData({...profileData, password: e.target.value})} className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={isUpdatingProfile} className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-4 disabled:bg-gray-400">
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </motion.div>
              )}

              {activeTab === 'addresses' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h2 className="text-xl font-black uppercase tracking-tighter mb-8 border-b-4 border-black pb-4 inline-block">Saved Addresses</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="border border-gray-200 p-6 relative group hover:border-black transition-colors">
                        {addr.is_default === 1 && (
                          <span className="absolute -top-3 left-4 bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1">Default</span>
                        )}
                        <h3 className="font-bold mb-2 tracking-widest uppercase text-xs">{addr.label}</h3>
                        <p className="text-sm text-gray-600 mb-4 h-16 overflow-hidden">{addr.alamat}</p>
                        <button onClick={() => handleDeleteAddress(addr.id)} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-700">Hapus</button>
                      </div>
                    ))}
                  </div>

                  <div onClick={() => setIsAddressModalOpen(true)} className="border border-dashed border-gray-300 p-8 text-center bg-gray-50 hover:bg-white hover:border-black transition-colors cursor-pointer">
                    <MapPin size={32} className="mx-auto mb-4 text-gray-400" />
                    <h3 className="font-bold mb-2 text-sm uppercase tracking-widest">Add New Address</h3>
                    <p className="text-sm text-gray-500">Save addresses for faster checkout on future orders.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 max-w-md w-full relative">
            <button onClick={() => setIsAddressModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold">X</button>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6">Tambahkan Alamat Baru</h2>
            <form onSubmit={handleAddAddress} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Label Alamat</label>
                <input type="text" value={addressForm.label} onChange={(e) => setAddressForm({...addressForm, label: e.target.value})} placeholder="Contoh: Rumah, Kantor, Apartemen" required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Alamat Lengkap</label>
                <textarea value={addressForm.alamat} onChange={(e) => setAddressForm({...addressForm, alamat: e.target.value})} rows="4" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos" required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors"></textarea>
              </div>
              <div className="flex items-center space-x-3">
                <input type="checkbox" id="is_default" checked={addressForm.is_default} onChange={(e) => setAddressForm({...addressForm, is_default: e.target.checked})} className="w-4 h-4 accent-black" />
                <label htmlFor="is_default" className="text-sm font-medium text-gray-700">Jadikan alamat utama (Default)</label>
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-4">
                Simpan Alamat
              </button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Order Details Modal */}
      {isOrderModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 max-w-2xl w-full relative">
            <button onClick={() => setIsOrderModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold">X</button>
            <h2 className="text-xl font-black uppercase tracking-widest mb-2 border-b-4 border-black pb-4 inline-block">Order LK-{selectedOrder.id}</h2>
            <div className="mb-6 mt-4">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Status: <strong className="text-black">{selectedOrder.status}</strong></p>
              <p className="text-sm text-gray-500 uppercase tracking-widest">Alamat: <span className="text-black">{selectedOrder.alamat_pengiriman}</span></p>
            </div>
            
            <div className="space-y-4 mb-6">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest mb-1">Produk ID: {item.product_id}</p>
                    <p className="text-xs text-gray-500">Size: {item.ukuran} | Qty: {item.qty} | Rp {item.harga_satuan?.toLocaleString('id-ID')}</p>
                  </div>
                  {selectedOrder.status === 'selesai' && (
                    <button onClick={() => openReviewModal(item)} className="text-[10px] font-bold tracking-widest uppercase bg-black text-white px-3 py-2 hover:bg-gray-800">
                      Beri Ulasan
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex justify-between items-center border-t border-black pt-4">
              <span className="font-bold uppercase tracking-widest text-sm">Total</span>
              <span className="font-black text-xl">Rp {selectedOrder.total_harga?.toLocaleString('id-ID')}</span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 max-w-md w-full relative">
            <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black font-bold">X</button>
            <h2 className="text-xl font-black uppercase tracking-widest mb-6">Tulis Ulasan</h2>
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Rating (1-5)</label>
                <select value={reviewForm.rating} onChange={(e) => setReviewForm({...reviewForm, rating: Number(e.target.value)})} className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors">
                  <option value={5}>⭐⭐⭐⭐⭐ (5) Sangat Bagus</option>
                  <option value={4}>⭐⭐⭐⭐ (4) Bagus</option>
                  <option value={3}>⭐⭐⭐ (3) Lumayan</option>
                  <option value={2}>⭐⭐ (2) Kurang</option>
                  <option value={1}>⭐ (1) Sangat Kurang</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Komentar</label>
                <textarea value={reviewForm.komentar} onChange={(e) => setReviewForm({...reviewForm, komentar: e.target.value})} rows="4" placeholder="Bagaimana kualitas produk ini?" required className="w-full border-b-2 border-gray-200 py-3 outline-none focus:border-black transition-colors"></textarea>
              </div>
              <button type="submit" className="w-full bg-black text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-4">
                Kirim Ulasan
              </button>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
