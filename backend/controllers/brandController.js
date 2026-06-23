const BrandModel = require('../models/brandModel');
const path = require('path');
const fs = require('fs');

const BrandController = {
    async getBrands(req, res) {
        try {
            const brands = await BrandModel.findAll();
            // Prefix the logo with the server URL if it's a local upload
            const brandsWithUrl = brands.map(brand => {
                if (brand.logo && !brand.logo.startsWith('http')) {
                    brand.logo = `${req.protocol}://${req.get('host')}/uploads/${brand.logo}`;
                }
                return brand;
            });
            res.json(brandsWithUrl);
        } catch (error) {
            console.error('Error in getBrands:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    },

    async createBrand(req, res) {
        try {
            const { nama } = req.body;
            let logo = req.body.logo;

            if (req.file) {
                logo = req.file.filename;
            }

            if (!nama || !logo) {
                return res.status(400).json({ message: 'Nama dan logo wajib diisi' });
            }

            const brandId = await BrandModel.create({ nama, logo });
            res.status(201).json({ message: 'Brand berhasil ditambahkan', id: brandId });
        } catch (error) {
            console.error('Error in createBrand:', error);
            // Handle unique constraint error
            if (error.errorNum === 1) {
                return res.status(400).json({ message: 'Merek sudah ada' });
            }
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    },

    async deleteBrand(req, res) {
        try {
            const { id } = req.params;
            // Fetch brand to delete its logo file if it exists
            const brand = await BrandModel.findById(id);
            if (!brand) {
                return res.status(404).json({ message: 'Merek tidak ditemukan' });
            }

            await BrandModel.delete(id);

            // Delete logo file if it's not a URL
            if (brand.logo && !brand.logo.startsWith('http')) {
                const filePath = path.join(__dirname, '..', 'uploads', brand.logo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            }

            res.json({ message: 'Brand berhasil dihapus' });
        } catch (error) {
            console.error('Error in deleteBrand:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = BrandController;
