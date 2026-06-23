const BrandModel = require('../models/brandModel');
const path = require('path');
const fs = require('fs');

const BrandController = {
    async getBrands(req, res) {
        try {
            const brands = await BrandModel.findAll();
            // Cloudinary provides the full URL already, so no prefixing is needed
            res.json(brands);
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
                logo = req.file.path; // Cloudinary URL
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

            // Note: Since logo is now hosted on Cloudinary, we could use the cloudinary 
            // uploader.destroy API to delete it from the cloud, but for now we'll 
            // just delete the record from the database to avoid breaking anything.

            res.json({ message: 'Brand berhasil dihapus' });
        } catch (error) {
            console.error('Error in deleteBrand:', error);
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

module.exports = BrandController;
