const ReviewModel = require('../models/reviewModel');

const reviewController = {
    async create(req, res) {
        try {
            const { productId, rating, komentar } = req.body;

            if (!productId || !rating) {
                return res.status(400).json({ message: 'Data tidak lengkap' });
            }

            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: 'Rating harus antara 1-5' });
            }

            const reviewId = await ReviewModel.create(productId, req.user.id, rating, komentar);
            res.status(201).json({ message: 'Review berhasil ditambahkan', reviewId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getAll(req, res) {
        try {
            const reviews = await ReviewModel.findAll();
            res.json(reviews);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async delete(req, res) {
        try {
            const affectedRows = await ReviewModel.delete(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: 'Review tidak ditemukan' });
            }
            res.json({ message: 'Review berhasil dihapus' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
};

module.exports = reviewController;
