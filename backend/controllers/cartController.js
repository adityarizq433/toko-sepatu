const CartModel = require('../models/cartModel');
const ProductModel = require('../models/productModel');

const cartController = {
    async getCart(req, res) {
        try {
            const items = await CartModel.getByUser(req.user.id);
            res.json(items);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async addToCart(req, res) {
        try {
            const { productId, ukuran, qty } = req.body;

            if (!productId || !ukuran || !qty) {
                return res.status(400).json({ message: 'Data tidak lengkap' });
            }

            const product = await ProductModel.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Produk tidak ditemukan' });
            }

            await CartModel.addItem(req.user.id, productId, ukuran, qty);
            res.status(201).json({ message: 'Produk ditambahkan ke keranjang' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async updateCartItem(req, res) {
        try {
            const { qty } = req.body;
            await CartModel.updateQty(req.params.id, req.user.id, qty);
            res.json({ message: 'Keranjang berhasil diupdate' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async removeCartItem(req, res) {
        try {
            await CartModel.removeItem(req.params.id, req.user.id);
            res.json({ message: 'Item berhasil dihapus dari keranjang' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
};

module.exports = cartController;
