const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticate, authorize } = require('../middleware/auth.middleware');

router.get('/', authenticate, authorize(['admin', 'staff']), async (req, res, next) => {
    try {
        const [hubs] = await db.query('SELECT * FROM hubs');
        res.json(hubs);
    } catch (err) {
        next(err);
    }
});

router.post('/', authenticate, authorize(['admin']), async (req, res, next) => {
    try {
        const { name, location, capacity } = req.body;
        await db.query('INSERT INTO hubs (name, location, capacity) VALUES (?, ?, ?)', [name, location, capacity]);
        res.status(201).json({ message: 'Hub created successfully' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
