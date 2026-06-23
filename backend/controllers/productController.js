const ProductModel = require('../models/productModel');

const productController = {
    async getAll(req, res) {
        try {
            const { search, brand, kategori, minHarga, maxHarga } = req.query;
            const products = await ProductModel.findAll({ search, brand, kategori, minHarga, maxHarga });
            res.json(products);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getById(req, res) {
        try {
            const product = await ProductModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }
            const sizes = await ProductModel.getSizes(product.id);
            const reviews = await ProductModel.getReviews(product.id);

            res.json({ ...product, sizes, reviews });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async create(req, res) {
        try {
            const { nama, brand, kategori, harga, deskripsi } = req.body;
            let sizes = req.body.sizes;
            
            // sizes might come as a JSON string when using FormData
            if (typeof sizes === 'string') {
                try {
                    sizes = JSON.parse(sizes);
                } catch (e) {
                    console.error('Error parsing sizes', e);
                }
            }

            if (!nama || !brand || !kategori || !harga) {
                return res.status(400).json({ message: 'Data produk tidak lengkap' });
            }

            let gambar = req.body.gambar || '';
            if (req.file) {
                // Konversi backslash ke slash agar URL valid
                gambar = 'http://localhost:3000/' + req.file.path.replace(/\\/g, '/');
            }

            const productId = await ProductModel.create({ nama, brand, kategori, harga, deskripsi, gambar });

            if (Array.isArray(sizes)) {
                for (const s of sizes) {
                    await ProductModel.addSize(productId, s.ukuran, s.stok);
                }
            }

            res.status(201).json({ message: 'Produk berhasil ditambahkan', productId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async update(req, res) {
        try {
            const { nama, brand, kategori, harga, deskripsi } = req.body;
            let gambar = req.body.gambar || '';
            
            if (req.file) {
                gambar = 'http://localhost:3000/' + req.file.path.replace(/\\/g, '/');
            } else if (!gambar) {
                const oldProduct = await ProductModel.findById(req.params.id);
                if (oldProduct) gambar = oldProduct.gambar;
            }

            await ProductModel.update(req.params.id, { nama, brand, kategori, harga, deskripsi, gambar });
            res.json({ message: 'Produk berhasil diupdate' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async delete(req, res) {
        try {
            await ProductModel.delete(req.params.id);
            res.json({ message: 'Produk berhasil dihapus' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async updateStok(req, res) {
        try {
            const { ukuran, stok } = req.body;
            await ProductModel.updateStok(req.params.id, ukuran, stok);
            res.json({ message: 'Stok berhasil diupdate' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
};

module.exports = productController;
