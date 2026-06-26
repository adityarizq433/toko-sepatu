const db = require('../config/db');

const adminController = {
    async getAnalytics(req, res) {
        try {
            // Get total revenue (only completed or processing orders count, or just exclude pending)
            const [revenueRows] = await db.query(`SELECT SUM(total_harga) as total_revenue FROM orders WHERE status != 'pending'`);
            const totalRevenue = revenueRows[0]?.total_revenue || 0;

            // Get total orders
            const [orderRows] = await db.query(`SELECT COUNT(*) as total_orders FROM orders`);
            const totalOrders = orderRows[0]?.total_orders || 0;

            // Get total customers
            const [customerRows] = await db.query(`SELECT COUNT(*) as total_customers FROM users WHERE role = 'user'`);
            const totalCustomers = customerRows[0]?.total_customers || 0;

            // Get monthly revenue (last 6 months)
            const [monthlyRows] = await db.query(`
                SELECT 
                    DATE_FORMAT(created_at, '%b %Y') as month, 
                    SUM(total_harga) as revenue
                FROM orders 
                WHERE status != 'pending' 
                  AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
                GROUP BY DATE_FORMAT(created_at, '%b %Y'), DATE_FORMAT(created_at, '%Y-%m')
                ORDER BY DATE_FORMAT(created_at, '%Y-%m') ASC
            `);

            res.json({
                totalRevenue,
                totalOrders,
                totalCustomers,
                monthlySales: monthlyRows.map(row => ({
                    name: row.month,
                    sales: Number(row.revenue) || 0
                }))
            });
        } catch (err) {
            console.error('Error fetching analytics:', err);
            res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data statistik' });
        }
    }
};

module.exports = adminController;
