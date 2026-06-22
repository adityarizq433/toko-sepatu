import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Form state
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

  useEffect(() => {
    fetchProducts();
  }, []);

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
      alert('Produk berhasil ditambahkan ke Database Oracle!');
      
      setFormData({
        nama: '', brand: '', kategori: 'Sneakers', harga: '', deskripsi: '', gambar: ''
      });
      setImageFile(null);
      setSizes([{ ukuran: 40, stok: 10 }]);
      
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk. Pastikan Backend & Database berjalan (Tidak error ORA-28000).');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-6 lg:px-12 py-12">
      <div className="flex justify-between items-end border-b border-gray-200 pb-6 mb-12">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-2 tracking-widest uppercase">Product Management</p>
        </div>
      </div>

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
                        <button className="text-gray-400 hover:text-black transition-colors"><Edit2 size={16} /></button>
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
    </div>
  );
}
