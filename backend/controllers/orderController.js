const OrderModel = require('../models/orderModel');
const CartModel = require('../models/cartModel');
const db = require('../config/db');

const orderController = {
    async checkout(req, res) {
        const { alamatPengiriman } = req.body;

        if (!alamatPengiriman) {
            return res.status(400).json({ message: 'Alamat pengiriman wajib diisi' });
        }

        try {
            const cartItems = await CartModel.getByUser(req.user.id);

            if (cartItems.length === 0) {
                return res.status(400).json({ message: 'Keranjang masih kosong' });
            }

            const totalHarga = cartItems.reduce((sum, item) => sum + (item.harga * item.qty), 0);

            const orderId = await OrderModel.create(req.user.id, totalHarga, alamatPengiriman);

            for (const item of cartItems) {
                await OrderModel.addItem(orderId, item.product_id, item.ukuran, item.qty, item.harga);
            }

            await CartModel.clearCart(req.user.id);

            res.status(201).json({ message: 'Checkout berhasil', orderId });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getMyOrders(req, res) {
        try {
            const orders = await OrderModel.getByUser(req.user.id);
            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getOrderDetail(req, res) {
        try {
            const order = await OrderModel.getById(req.params.id);

            if (!order) {
                return res.status(404).json({ message: 'Order tidak ditemukan' });
            }

            // Cek kepemilikan order (kecuali admin)
            if (order.user_id !== req.user.id && req.user.role !== 'admin') {
                return res.status(403).json({ message: 'Akses ditolak' });
            }

            const items = await OrderModel.getItems(order.id);
            res.json({ ...order, items });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async getAllOrders(req, res) {
        try {
            const orders = await OrderModel.getAll();
            res.json(orders);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    },

    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            await OrderModel.updateStatus(req.params.id, status);
            res.json({ message: 'Status order berhasil diupdate' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Terjadi kesalahan server' });
        }
    }
};

module.exports = orderController;
