const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res, next) => {
    try {
        // Ignored role from req.body to prevent privilege escalation
        const { username, password, full_name, phone, email, address } = req.body;
        
        // Basic check
        const [users] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (users.length > 0) return res.status(400).json({ error: 'Username already exists' });

        const hash = await bcrypt.hash(password, 10);
        
        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();
            const [result] = await conn.query('INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)', [username, hash, 'customer']);
            
            await conn.query('INSERT INTO customers (user_id, full_name, phone, email, address) VALUES (?, ?, ?, ?, ?)', 
            [result.insertId, full_name, phone, email, address]);
            
            await conn.commit();
            conn.release();
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            await conn.rollback();
            conn.release();
            next(err);
        }
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
        
        const user = users[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });
        
        const token = jwt.sign({ id: user.id, role: user.role, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        let details = {};
        if (user.role === 'customer') {
            const [cust] = await db.query('SELECT * FROM customers WHERE user_id = ?', [user.id]);
            details = cust[0] || {};
        } else if (user.role === 'staff' || user.role === 'admin') {
            const [emp] = await db.query('SELECT * FROM employees WHERE user_id = ?', [user.id]);
            details = emp ? emp[0] : {};
        }
        
        res.json({ token, role: user.role, user: { id: user.id, username, details } });
    } catch (err) {
        next(err);
    }
};
