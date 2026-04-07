const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ error: 'Access denied. No token provided.' });

    const token = header.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. Invalid format.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (ex) {
        res.status(400).json({ error: 'Invalid token.' });
    }
};

const authorize = (roles = []) => {
    if (typeof roles === 'string') {
        roles = [roles];
    }

    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authenticate, authorize };
