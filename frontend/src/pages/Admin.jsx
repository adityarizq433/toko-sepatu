import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

export default function Admin() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'brands', or 'orders'
  
  // Overview / Analytics state
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  // Product state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Order state
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  // Product Form state
  const [formData, setFormData] = useState({
    nama: '',
    brand: '',
    kategori: 'Sneakers',
    harga: '',
    deskripsi: '',
    gambar: '' // Untuk URL
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [sizes, setSizes] = useState([{ ukuran: 40, stok: 10 }]);

  // Edit Product state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: null, nama: '', brand: '', kategori: 'Sneakers', harga: '', deskripsi: '', gambar: '' });
  const [editImageFile, setEditImageFile] = useState(null);

  // Brand state
  const [brands, setBrands] = useState([]);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandFormData, setBrandFormData] = useState({ nama: '', logo: '' });
  const [brandImageFile, setBrandImageFile] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchProducts();
    fetchBrands();
    fetchOrders();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await api.get('/admin/analytics');
      setAnalytics(res.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrderLoading(true);
      const res = await api.get('/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success(`Status Order LK-${id} berhasil diupdate ke ${status}`);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error(error.response?.data?.message || 'Gagal memperbarui status pesanan');
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

  const fetchBrands = async () => {
    try {
      setBrandLoading(true);
      const res = await api.get('/brands');
      setBrands(res.data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setBrandLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = Number(value);
    setSizes(newSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { ukuran: 41, stok: 0 }]);
  };

  const removeSizeField = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nama', formData.nama);
      data.append('brand', formData.brand);
      data.append('kategori', formData.kategori);
      data.append('harga', formData.harga);
      data.append('deskripsi', formData.deskripsi);
      
      if (imageFile) {
        data.append('gambarFile', imageFile);
      } else {
        data.append('gambar', formData.gambar);
      }
      
      data.append('sizes', JSON.stringify(sizes));
      
      await api.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Produk berhasil ditambahkan ke Database Oracle!');
      
      setFormData({
        nama: '', brand: '', kategori: 'Sneakers', harga: '', deskripsi: '', gambar: ''
      });
      setImageFile(null);
      setSizes([{ ukuran: 40, stok: 10 }]);
      
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Gagal menyimpan produk. Pastikan Backend & Database berjalan (Tidak error ORA-28000).');
    }
  };

  const handleDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col items-center">
        <p className="mb-4 text-sm font-medium">Yakin ingin menghapus produk ini?</p>
        <div className="flex space-x-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/products/${id}`);
                toast.success('Produk berhasil dihapus');
                fetchProducts();
              } catch (error) {
                console.error('Error deleting:', error);
                toast.error(error.response?.data?.message || 'Gagal menghapus produk. Produk mungkin ada di pesanan aktif.');
              }
            }} 
            className="bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-600"
          >
            Hapus
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-gray-200 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: `delete-prod-${id}` });
  };

  const openEditModal = (product) => {
    setEditFormData({
      id: product.id,
      nama: product.nama,
      brand: product.brand,
      kategori: product.kategori,
      harga: product.harga,
      deskripsi: product.deskripsi || '',
      gambar: product.gambar || ''
    });
    setEditImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nama', editFormData.nama);
      data.append('brand', editFormData.brand);
      data.append('kategori', editFormData.kategori);
      data.append('harga', editFormData.harga);
      data.append('deskripsi', editFormData.deskripsi);
      
      if (editImageFile) {
        data.append('gambarFile', editImageFile);
      } else {
        data.append('gambar', editFormData.gambar);
      }
      
      await api.put(`/products/${editFormData.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Produk berhasil diupdate!');
      setIsEditModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Gagal mengupdate produk.');
    }
  };

  const handleBrandSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('nama', brandFormData.nama);
      
      if (brandImageFile) {
        data.append('logoFile', brandImageFile);
      } else {
        data.append('logo', brandFormData.logo);
      }
      
      await api.post('/brands', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Brand berhasil ditambahkan!');
      
      setBrandFormData({ nama: '', logo: '' });
      setBrandImageFile(null);
      
      fetchBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan brand.');
    }
  };

  const handleBrandDelete = (id) => {
    toast((t) => (
      <div className="flex flex-col items-center">
        <p className="mb-4 text-sm font-medium">Yakin ingin menghapus brand ini?</p>
        <div className="flex space-x-2">
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/brands/${id}`);
                toast.success('Brand berhasil dihapus');
                fetchBrands();
              } catch (error) {
                console.error('Error deleting brand:', error);
                toast.error('Gagal menghapus brand');
              }
            }} 
            className="bg-red-500 text-white px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-red-600"
          >
            Hapus
          </button>
          <button 
            onClick={() => toast.dismiss(t.id)} 
            className="bg-gray-200 text-black px-4 py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </div>
    ), { duration: Infinity, id: `delete-brand-${id}` });
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase">System Management</p>
        </div>
      </div>

      <div className="flex space-x-6 mb-12 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'overview' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'products' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Products
        </button>
        <button 
          onClick={() => setActiveTab('brands')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'brands' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Brands
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === 'orders' ? 'border-b-2 border-black text-black' : 'text-gray-400 hover:text-black'}`}
        >
          Orders
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-8">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase border-b border-gray-200 pb-4">Store Analytics</h2>
          {analyticsLoading ? (
            <div className="flex justify-center items-center h-40"><div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Total Revenue</p>
                <h3 className="text-3xl font-black">Rp {analytics?.totalRevenue?.toLocaleString('id-ID')}</h3>
              </div>
              <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Total Orders</p>
                <h3 className="text-3xl font-black">{analytics?.totalOrders}</h3>
              </div>
              <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Total Customers</p>
                <h3 className="text-3xl font-black">{analytics?.totalCustomers}</h3>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Tambah Produk */}
        <div className="lg:col-span-1 glass p-8 rounded-none bg-gray-50/50">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b border-gray-200 pb-4">Add New Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Nama Produk</label>
              <input type="text" name="nama" value={formData.nama} onChange={handleInputChange} required 
                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="Contoh: Air Jordan 1 High"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Brand</label>
                <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} required 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Nike"
                />
              </div>
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Kategori</label>
                <select name="kategori" value={formData.kategori} onChange={handleInputChange}
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                >
                  <option value="Sneakers">Sneakers</option>
                  <option value="Designer">Designer</option>
                  <option value="Boots">Boots</option>
                  <option value="Running">Running</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Harga (Rp)</label>
              <input type="number" name="harga" value={formData.harga} onChange={handleInputChange} required 
                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                placeholder="2500000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Gambar Produk (Upload atau URL)</label>
              <div className="flex flex-col space-y-3">
                <input type="file" accept="image/*" onChange={handleFileChange} 
                  className="w-full bg-gray-50 border border-gray-200 px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                />
                <span className="text-xs text-gray-400 font-medium italic text-center">--- ATAU GUNAKAN URL ---</span>
                <input type="text" name="gambar" value={formData.gambar} onChange={handleInputChange} 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Deskripsi</label>
              <textarea name="deskripsi" value={formData.deskripsi} onChange={handleInputChange} rows="3"
                className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
              ></textarea>
            </div>

            {/* Variasi Ukuran & Stok */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500">Ukuran & Stok</label>
                <button type="button" onClick={addSizeField} className="text-xs font-bold text-black border border-black px-3 py-1 hover:bg-black hover:text-white transition-colors">
                  + Add Size
                </button>
              </div>
              
              <div className="space-y-3">
                {sizes.map((size, index) => (
                  <div key={index} className="flex space-x-4 items-end bg-gray-50 p-4 border border-gray-100">
                    <div className="w-1/2">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Ukuran (EU)</label>
                      <input type="number" value={size.ukuran} onChange={(e) => handleSizeChange(index, 'ukuran', e.target.value)} 
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="Contoh: 40" />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 mb-1">Jumlah Stok</label>
                      <input type="number" value={size.stok} onChange={(e) => handleSizeChange(index, 'stok', e.target.value)} 
                        className="w-full bg-white border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black" placeholder="Contoh: 10" />
                    </div>
                    {sizes.length > 1 && (
                      <button type="button" onClick={() => removeSizeField(index)} className="text-red-500 hover:text-red-700 pb-2">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-8 flex justify-center items-center space-x-2">
              <Plus size={18} /> <span>Save Product</span>
            </button>
          </form>
        </div>

        {/* Daftar Produk */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b border-gray-200 pb-4">Product Inventory ({products.length})</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-40"><div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div></div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>Belum ada produk di database.</p>
              <p className="text-sm mt-2">Gunakan form di samping untuk menambahkan sepatu pertama Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold tracking-widest uppercase text-gray-500">
                    <th className="py-4 px-4 font-medium">Product</th>
                    <th className="py-4 px-4 font-medium">Brand</th>
                    <th className="py-4 px-4 font-medium">Price</th>
                    <th className="py-4 px-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      key={product.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-100 overflow-hidden shrink-0">
                          {product.gambar ? <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover mix-blend-multiply" /> : <div className="w-full h-full bg-gray-200"></div>}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{product.nama}</p>
                          <p className="text-xs text-gray-400">{product.kategori}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600 uppercase tracking-wider text-xs">{product.brand}</td>
                      <td className="py-4 px-4 text-sm font-medium">Rp {product.harga.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4 text-right flex justify-end space-x-3">
                        <button onClick={() => openEditModal(product)} className="text-gray-400 hover:text-black transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      )}

      {activeTab === 'brands' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form Tambah Brand */}
          <div className="lg:col-span-1 glass p-8 rounded-none bg-gray-50/50">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b border-gray-200 pb-4">Add New Brand</h2>
            
            <form onSubmit={handleBrandSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Nama Brand</label>
                <input type="text" value={brandFormData.nama} onChange={(e) => setBrandFormData({...brandFormData, nama: e.target.value})} required 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Contoh: Nike"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Logo Brand (Upload atau URL)</label>
                <div className="flex flex-col space-y-3">
                  <input type="file" accept="image/*" onChange={(e) => setBrandImageFile(e.target.files[0])} 
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                  />
                  <span className="text-xs text-gray-400 font-medium italic text-center">--- ATAU GUNAKAN URL ---</span>
                  <input type="text" value={brandFormData.logo} onChange={(e) => setBrandFormData({...brandFormData, logo: e.target.value})} 
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-black text-white px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-gray-800 transition-colors mt-8 flex justify-center items-center space-x-2">
                <Plus size={18} /> <span>Save Brand</span>
              </button>
            </form>
          </div>

          {/* Daftar Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b border-gray-200 pb-4">Brand List ({brands.length})</h2>
            
            {brandLoading ? (
              <div className="flex justify-center items-center h-40"><div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div></div>
            ) : brands.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <p>Belum ada brand di database.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs font-bold tracking-widest uppercase text-gray-500">
                      <th className="py-4 px-4 font-medium">Logo</th>
                      <th className="py-4 px-4 font-medium">Brand Name</th>
                      <th className="py-4 px-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand) => (
                      <motion.tr 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        key={brand.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="w-24 h-12 bg-white flex items-center justify-center p-2 rounded border border-gray-100">
                            <img src={brand.logo} alt={brand.nama} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm font-bold tracking-wider uppercase text-gray-800">{brand.nama}</td>
                        <td className="py-4 px-4 text-right flex justify-end space-x-3 items-center h-full pt-6">
                          <button onClick={() => handleBrandDelete(brand.id)} className="text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase mb-8 border-b border-gray-200 pb-4">Order Management ({orders.length})</h2>
          
          {orderLoading ? (
            <div className="flex justify-center items-center h-40"><div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full"></div></div>
          ) : orders.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p>Belum ada pesanan yang masuk.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-xs font-bold tracking-widest uppercase text-gray-500">
                    <th className="py-4 px-4 font-medium">Order ID</th>
                    <th className="py-4 px-4 font-medium">Customer</th>
                    <th className="py-4 px-4 font-medium">Address</th>
                    <th className="py-4 px-4 font-medium">Total</th>
                    <th className="py-4 px-4 font-medium">Date</th>
                    <th className="py-4 px-4 font-medium text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <motion.tr 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      key={order.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="py-4 px-4 font-bold text-sm">LK-{order.id}</td>
                      <td className="py-4 px-4">
                        <p className="text-sm font-bold">{order.nama_user}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="py-4 px-4 text-xs text-gray-600 max-w-[200px] truncate" title={order.alamat_pengiriman}>
                        {order.alamat_pengiriman}
                      </td>
                      <td className="py-4 px-4 text-sm font-medium">Rp {order.total_harga?.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4 text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString('id-ID')}
                        <div className="mt-2">
                          <button onClick={() => openOrderDetails(order.id)} className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 border-b border-black pb-0.5">
                            View Items
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select 
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                          className={`text-xs font-bold tracking-widest uppercase px-3 py-2 border outline-none cursor-pointer ${
                            order.status === 'pending' ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                            order.status === 'diproses' ? 'bg-orange-50 text-orange-800 border-orange-200' :
                            order.status === 'dikirim' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                            'bg-green-50 text-green-800 border-green-200'
                          }`}
                        >
                          <option value="pending">PENDING</option>
                          <option value="diproses">DIPROSES</option>
                          <option value="dikirim">DIKIRIM</option>
                          <option value="selesai">SELESAI</option>
                        </select>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Product Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto pt-24 pb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 max-w-2xl w-full"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest">Edit Product</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-black font-bold">X</button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Nama Produk</label>
                <input type="text" value={editFormData.nama} onChange={(e) => setEditFormData({...editFormData, nama: e.target.value})} required 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Brand</label>
                  <input type="text" value={editFormData.brand} onChange={(e) => setEditFormData({...editFormData, brand: e.target.value})} required 
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Kategori</label>
                  <select value={editFormData.kategori} onChange={(e) => setEditFormData({...editFormData, kategori: e.target.value})}
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                  >
                    <option value="Sneakers">Sneakers</option>
                    <option value="Designer">Designer</option>
                    <option value="Boots">Boots</option>
                    <option value="Running">Running</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Harga (Rp)</label>
                <input type="number" value={editFormData.harga} onChange={(e) => setEditFormData({...editFormData, harga: e.target.value})} required 
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Gambar Produk (Upload Baru atau Ubah URL)</label>
                <div className="flex flex-col space-y-3">
                  <input type="file" accept="image/*" onChange={(e) => setEditImageFile(e.target.files[0])} 
                    className="w-full bg-gray-50 border border-gray-200 px-4 py-2 text-sm"
                  />
                  <input type="text" value={editFormData.gambar} onChange={(e) => setEditFormData({...editFormData, gambar: e.target.value})} 
                    className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                    placeholder="Atau gunakan URL gambar..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Deskripsi</label>
                <textarea value={editFormData.deskripsi} onChange={(e) => setEditFormData({...editFormData, deskripsi: e.target.value})} rows="3"
                  className="w-full bg-white border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-3 font-bold text-xs tracking-widest uppercase text-gray-500 hover:text-black">Cancel</button>
                <button type="submit" className="bg-black text-white px-8 py-3 font-bold text-xs tracking-widest uppercase hover:bg-gray-800 transition-colors">Save Changes</button>
              </div>
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
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Customer: <strong className="text-black">{selectedOrder.nama_user}</strong> ({selectedOrder.email})</p>
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-1">Status: <strong className="text-black">{selectedOrder.status}</strong></p>
              <p className="text-sm text-gray-500 uppercase tracking-widest">Alamat: <span className="text-black">{selectedOrder.alamat_pengiriman}</span></p>
            </div>
            
            <div className="space-y-4 mb-6">
              {selectedOrder.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div>
                    <p className="font-bold text-sm uppercase tracking-widest mb-1">{item.nama} (ID: {item.product_id})</p>
                    <p className="text-xs text-gray-500">Size: {item.ukuran} | Qty: {item.qty} | Rp {item.harga_satuan?.toLocaleString('id-ID')}</p>
                  </div>
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

    </div>
  );
}
