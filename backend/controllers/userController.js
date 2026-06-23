const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userController = {
    async updateProfile(req, res) {
        try {
            const { nama, email, no_hp, password } = req.body;
            const userId = req.user.id;

            let query = 'UPDATE users SET nama = :nama, email = :email, no_hp = :no_hp';
            const binds = { nama, email, no_hp, userId };

            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                query += ', password = :password';
                binds.password = hashedPassword;
            }

            query += ' WHERE id = :userId';

            await db.query(query, binds);

            // Re-sign token if needed, or just send success
            res.json({ message: 'Profil berhasil diperbarui' });
        } catch (err) {
            console.error('Error updating profile:', err);
            res.status(500).json({ message: 'Terjadi kesalahan saat memperbarui profil' });
        }
    },

    async getAddresses(req, res) {
        try {
            const [rows] = await db.query(
                'SELECT * FROM user_addresses WHERE user_id = :userId ORDER BY is_default DESC, id DESC',
                { userId: req.user.id }
            );
            res.json(rows);
        } catch (err) {
            console.error('Error fetching addresses:', err);
            res.status(500).json({ message: 'Gagal mengambil alamat' });
        }
    },

    async addAddress(req, res) {
        try {
            const { label, alamat, is_default } = req.body;
            const userId = req.user.id;

            if (is_default) {
                // Remove default from other addresses
                await db.query('UPDATE user_addresses SET is_default = 0 WHERE user_id = :userId', { userId });
            }

            const sql = `INSERT INTO user_addresses (user_id, label, alamat, is_default) 
                         VALUES (:userId, :label, :alamat, :is_default)`;
            await db.query(sql, { userId, label, alamat, is_default: is_default ? 1 : 0 });

            res.json({ message: 'Alamat berhasil ditambahkan' });
        } catch (err) {
            console.error('Error adding address:', err);
            res.status(500).json({ message: 'Gagal menambahkan alamat' });
        }
    },

    async deleteAddress(req, res) {
        try {
            const addressId = req.params.id;
            const userId = req.user.id;
            
            await db.query('DELETE FROM user_addresses WHERE id = :addressId AND user_id = :userId', { addressId, userId });
            res.json({ message: 'Alamat berhasil dihapus' });
        } catch (err) {
            console.error('Error deleting address:', err);
            res.status(500).json({ message: 'Gagal menghapus alamat' });
        }
    }
};

module.exports = userController;
