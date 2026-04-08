import db from '../config/db.js';

export const getHubs = async (req, res, next) => {
    try {
        const [hubs] = await db.query('SELECT * FROM hubs');
        res.json(hubs);
    } catch (err) {
        next(err);
    }
};

export const createHub = async (req, res, next) => {
    try {
        const { name, location, capacity } = req.body;
        await db.query('INSERT INTO hubs (name, location, capacity) VALUES (?, ?, ?)', [name, location, capacity]);
        res.status(201).json({ message: 'Hub created successfully' });
    } catch (err) {
        next(err);
    }
};