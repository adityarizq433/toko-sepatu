const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.RAJAONGKIR_API_KEY;
const BASE_URL = 'https://api.rajaongkir.com/starter';

// Helper for axios instance
const rajaOngkirAPI = axios.create({
  baseURL: BASE_URL,
  headers: {
    key: API_KEY
  }
});

const mockProvinces = [
  { province_id: '1', province: 'Bali' },
  { province_id: '5', province: 'DI Yogyakarta' },
  { province_id: '6', province: 'DKI Jakarta' },
  { province_id: '9', province: 'Jawa Barat' },
  { province_id: '10', province: 'Jawa Tengah' },
  { province_id: '11', province: 'Jawa Timur' }
];

const mockCities = {
  '1': [{ city_id: '17', type: 'Kabupaten', city_name: 'Badung', province_id: '1' }, { city_id: '114', type: 'Kota', city_name: 'Denpasar', province_id: '1' }],
  '5': [{ city_id: '39', type: 'Kabupaten', city_name: 'Bantul', province_id: '5' }, { city_id: '50', type: 'Kota', city_name: 'Yogyakarta', province_id: '5' }],
  '6': [{ city_id: '152', type: 'Kota', city_name: 'Jakarta Pusat', province_id: '6' }, { city_id: '153', type: 'Kota', city_name: 'Jakarta Selatan', province_id: '6' }],
  '9': [{ city_id: '22', type: 'Kota', city_name: 'Bandung', province_id: '9' }, { city_id: '54', type: 'Kota', city_name: 'Bekasi', province_id: '9' }, { city_id: '78', type: 'Kota', city_name: 'Bogor', province_id: '9' }],
  '10': [{ city_id: '398', type: 'Kota', city_name: 'Semarang', province_id: '10' }, { city_id: '445', type: 'Kota', city_name: 'Surakarta (Solo)', province_id: '10' }],
  '11': [{ city_id: '444', type: 'Kota', city_name: 'Surabaya', province_id: '11' }, { city_id: '256', type: 'Kota', city_name: 'Malang', province_id: '11' }, { city_id: '420', type: 'Kabupaten', city_name: 'Sidoarjo', province_id: '11' }]
};

const mockCosts = [
  { service: 'REG', description: 'Layanan Reguler', cost: [{ value: 15000, etd: '2-3', note: '' }] },
  { service: 'YES', description: 'Yakin Esok Sampai', cost: [{ value: 25000, etd: '1-1', note: '' }] },
  { service: 'OKE', description: 'Ongkos Kirim Ekonomis', cost: [{ value: 10000, etd: '4-5', note: '' }] }
];

const shippingController = {
  // Ambil daftar provinsi
  async getProvinces(req, res) {
    try {
      const response = await rajaOngkirAPI.get('/province', { timeout: 3000 });
      res.json(response.data.rajaongkir.results);
    } catch (error) {
      console.warn('RajaOngkir API failed, using fallback mock data for provinces.');
      res.json(mockProvinces);
    }
  },

  // Ambil daftar kota berdasarkan provinsi
  async getCities(req, res) {
    const { provinceId } = req.params;
    try {
      const response = await rajaOngkirAPI.get(`/city?province=${provinceId}`, { timeout: 3000 });
      res.json(response.data.rajaongkir.results);
    } catch (error) {
      console.warn('RajaOngkir API failed, using fallback mock data for cities.');
      res.json(mockCities[provinceId] || []);
    }
  },

  // Hitung ongkos kirim
  async calculateCost(req, res) {
    const { origin, destination, weight, courier } = req.body;

    if (!origin || !destination || !weight || !courier) {
      return res.status(400).json({ message: 'Lengkapi origin, destination, weight, dan courier' });
    }

    try {
      const response = await rajaOngkirAPI.post('/cost', {
        origin,
        destination,
        weight,
        courier
      }, { timeout: 3000 });
      res.json(response.data.rajaongkir.results[0]); 
    } catch (error) {
      console.warn('RajaOngkir API failed, using fallback mock data for costs.');
      res.json({
         code: courier,
         name: courier.toUpperCase(),
         costs: mockCosts
      });
    }
  }
};

module.exports = shippingController;
