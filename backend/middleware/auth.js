const jwt = require('jsonwebtoken');
require('dotenv').config();

// Middleware untuk verifikasi token JWT
function verifyToken(req, res, next) {
    // SEMENTARA: Bypass login agar bisa test Cart sebagai Guest (id: 1)
    req.user = { id: 1, role: 'admin' };
    next();
    
    /* 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan, silakan login' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid atau sudah expired' });
        }
        req.user = decoded; // { id, email, role }
        next();
    });
    */
}

// Middleware untuk cek role admin
function verifyAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak, hanya untuk admin' });
    }
    next();
}

module.exports = { verifyToken, verifyAdmin };
