import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

export default function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(null);
  
  // Shipping states
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [costs, setCosts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCourier, setSelectedCourier] = useState('');
  const [selectedService, setSelectedService] = useState(null); // { service, cost }

  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    phone: '',
    kodepos: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
    fetchProvinces();
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined') {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(prev => ({ ...prev, nama: parsedUser.nama || parsedUser.name || '', phone: parsedUser.no_hp || '' }));
      fetchAddresses();
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const res = await api.get('/users/addresses');
      setAddresses(res.data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

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

  const fetchProvinces = async () => {
    try {
      const res = await api.get('/shipping/provinces');
      setProvinces(res.data);
    } catch (error) {
      console.error('Error fetching provinces:', error);
    }
  };

  const fetchCities = async (provinceId) => {
    try {
      const res = await api.get(`/shipping/cities/${provinceId}`);
      setCities(res.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchCosts = async (cityId, courier) => {
    const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);
    const weight = totalQty * 1000; // 1kg per item
    
    try {
      const res = await api.post('/shipping/cost', {
        origin: '444', // Surabaya
        destination: cityId,
        weight: weight,
        courier: courier
      });
      setCosts(res.data.costs || []);
    } catch (error) {
      console.error('Error fetching costs:', error);
      toast.error('Gagal mengambil data ongkos kirim');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (e) => {
    const addrId = e.target.value;
    if (!addrId) return;
    const selected = addresses.find(a => a.id.toString() === addrId);
    if (selected) {
      const match = selected.alamat.match(/\b\d{5}\b/g);
      const extractedKodePos = match ? match[match.length - 1] : '';
      setFormData(prev => ({
        ...prev,
        alamat: selected.alamat,
        kodepos: extractedKodePos
      }));
    }
  };

  const handleProvinceChange = (e) => {
    const val = e.target.value;
    setSelectedProvince(val);
    setSelectedCity('');
    setCosts([]);
    setSelectedService(null);
    if (val) {
      fetchCities(val);
    } else {
      setCities([]);
    }
  };

  const handleCityChange = (e) => {
    const val = e.target.value;
    setSelectedCity(val);
    setCosts([]);
    setSelectedService(null);
    if (val && selectedCourier) {
      fetchCosts(val, selectedCourier);
    }
  };

  const handleCourierChange = (e) => {
    const val = e.target.value;
    setSelectedCourier(val);
    setCosts([]);
    setSelectedService(null);
    if (selectedCity && val) {
      fetchCosts(selectedCity, val);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedService) {
      return toast.error('Silakan pilih layanan ongkos kirim terlebih dahulu');
    }

    const provinceName = provinces.find(p => p.province_id === selectedProvince)?.province;
    const cityName = cities.find(c => c.city_id === selectedCity)?.city_name;
    
    const alamatLengkap = `${formData.nama} | ${formData.phone} | ${formData.alamat}, ${cityName}, ${provinceName}, ${formData.kodepos}`;
    const kurirLengkap = `${selectedCourier.toUpperCase()} - ${selectedService.service}`;
    
    try {
      await api.post('/orders/checkout', {
        alamatPengiriman: alamatLengkap,
        ongkir: selectedService.cost,
        kurir: kurirLengkap
      });
      window.dispatchEvent(new Event('cartUpdated'));
      setIsSuccess(true);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Gagal memproses pesanan. Silakan coba lagi.');
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + (item.harga * item.qty), 0);
  const ongkirCost = selectedService ? selectedService.cost : 0;
  const grandTotal = subtotal + ongkirCost;

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
            to="/profile" 
            className="inline-block bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors w-full"
          >
            Lihat Pesanan Saya
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
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h3 className="text-lg font-bold tracking-widest uppercase mb-8 border-b border-gray-100 pb-4">Shipping Details</h3>
            
            {addresses.length > 0 && (
              <div className="mb-8 p-6 border border-gray-200 bg-gray-50">
                <label className="block text-xs font-bold tracking-widest uppercase mb-4 text-gray-500">Pilih Alamat Tersimpan</label>
                <select onChange={handleAddressSelect} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors bg-white">
                  <option value="">-- Ketik Manual atau Pilih Alamat --</option>
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id}>{addr.label} - {addr.alamat.substring(0, 50)}...</option>
                  ))}
                </select>
                <p className="mt-3 text-xs text-gray-400 italic">* Pilih Provinsi dan Kota secara manual di bawah untuk menghitung ongkos kirim.</p>
              </div>
            )}

            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Nama Lengkap</label>
                <input type="text" name="nama" required value={formData.nama} onChange={handleInputChange} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Nomor HP</label>
                <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" placeholder="081234567890" />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Alamat Jalan</label>
                <textarea name="alamat" required value={formData.alamat} onChange={handleInputChange} rows="3" className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors resize-none" placeholder="Jl. Sudirman No. 123"></textarea>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Provinsi</label>
                  <select required value={selectedProvince} onChange={handleProvinceChange} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black bg-white">
                    <option value="">Pilih Provinsi</option>
                    {provinces.map(p => (
                      <option key={p.province_id} value={p.province_id}>{p.province}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Kota/Kabupaten</label>
                  <select required value={selectedCity} onChange={handleCityChange} disabled={!selectedProvince} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black bg-white disabled:bg-gray-100">
                    <option value="">Pilih Kota</option>
                    {cities.map(c => (
                      <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Kode Pos</label>
                  <input type="text" name="kodepos" required value={formData.kodepos} onChange={handleInputChange} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black transition-colors" placeholder="10000" />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase mb-2">Kurir Pengiriman</label>
                  <select required value={selectedCourier} onChange={handleCourierChange} className="w-full border border-gray-200 p-4 focus:outline-none focus:border-black bg-white">
                    <option value="">Pilih Kurir</option>
                    <option value="jne">JNE</option>
                    <option value="pos">POS Indonesia</option>
                    <option value="tiki">TIKI</option>
                  </select>
                </div>
              </div>

              {costs.length > 0 && (
                <div className="mt-8">
                  <label className="block text-xs font-bold tracking-widest uppercase mb-4">Layanan Pengiriman</label>
                  <div className="space-y-3">
                    {costs.map((c, i) => (
                      <label key={i} className={`flex items-center p-4 border cursor-pointer transition-colors ${selectedService?.service === c.service ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <input 
                          type="radio" 
                          name="shipping_service" 
                          className="mr-4 accent-black w-4 h-4"
                          onChange={() => setSelectedService({ service: c.service, cost: c.cost[0].value })}
                          checked={selectedService?.service === c.service}
                        />
                        <div className="flex-1">
                          <p className="font-bold uppercase text-sm">{c.service}</p>
                          <p className="text-xs text-gray-500">{c.description} ({c.cost[0].etd} Hari)</p>
                        </div>
                        <p className="font-medium text-sm">Rp {c.cost[0].value.toLocaleString('id-ID')}</p>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
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
                      <p className="text-xs text-gray-500 mt-1">Size: {item.ukuran} | Qty: {item.qty} | Wgt: 1kg</p>
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
                  <span className="text-gray-500">Ongkos Kirim ({cartItems.reduce((a,c)=>a+c.qty,0)} kg)</span>
                  <span className="font-medium">{ongkirCost > 0 ? `Rp ${ongkirCost.toLocaleString('id-ID')}` : '-'}</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-8">
                <span className="font-bold uppercase tracking-widest">Grand Total</span>
                <span className="text-xl font-black">Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={!selectedService}
                className="w-full bg-black text-white px-6 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors flex justify-center items-center disabled:bg-gray-300 disabled:cursor-not-allowed"
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
