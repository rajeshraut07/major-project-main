// middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const tokenRefresh = require('./tokenRefresh');

const adminAuth = (req, res, next) => {
    tokenRefresh(req, res, async (err) => {
        if (err) {
            console.error("Token refresh failed:", err.message);
            return res.status(401).json({ message: 'Token refresh failed' });
        }

        try {
            const token = req.header('Authorization')?.replace('Bearer ', '') || req.header('x-new-token');
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId);
            if (!user || user.role !== 'admin') {
                throw new Error();
            }
            req.user = user;
            next();
        } catch (error) {
            console.log(error);

            res.status(401).json({ message: 'Admin authentication failed' });
        }
    });
};

module.exports = adminAuth;