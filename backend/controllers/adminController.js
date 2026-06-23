const db = require('../config/db');

const adminController = {
    async getAnalytics(req, res) {
        try {
            // Get total revenue
            const [revenueRows] = await db.query(`SELECT SUM(total_harga) as total_revenue FROM orders WHERE status != 'pending'`);
            const totalRevenue = revenueRows[0]?.total_revenue || 0;

            // Get total orders
            const [orderRows] = await db.query(`SELECT COUNT(*) as total_orders FROM orders`);
            const totalOrders = orderRows[0]?.total_orders || 0;

            // Get total customers
            const [customerRows] = await db.query(`SELECT COUNT(*) as total_customers FROM users WHERE role = 'user'`);
            const totalCustomers = customerRows[0]?.total_customers || 0;

            res.json({
                totalRevenue,
                totalOrders,
                totalCustomers
            });
        } catch (err) {
            console.error('Error fetching analytics:', err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data statistik' });
        }
    }
};

module.exports = adminController;
