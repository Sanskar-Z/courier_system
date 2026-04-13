import db from '../config/db.js';

export const getCouriers = async (req, res, next) => {
    try {
        const [couriers] = await db.query('SELECT * FROM couriers');
        res.json(couriers);
    } catch (err) {
        next(err);
    }
};

export const createCourier = async (req, res, next) => {
    try {
        const { name, vehicle_type, contact_number, status, current_hub_id } = req.body;
        await db.query('INSERT INTO couriers (name, vehicle_type, contact_number, status, current_hub_id) VALUES (?, ?, ?, ?, ?)', 
        [name, vehicle_type, contact_number, status || 'Active', current_hub_id || null]);
        res.status(201).json({ message: 'Courier created successfully' });
    } catch (err) {
        next(err);
    }
};

export const updateCourier = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, vehicle_type, contact_number, status, current_hub_id } = req.body;
        await db.query('UPDATE couriers SET name = ?, vehicle_type = ?, contact_number = ?, status = ?, current_hub_id = ? WHERE id = ?', 
        [name, vehicle_type, contact_number, status || 'Active', current_hub_id || null, id]);
        res.json({ message: 'Courier updated successfully' });
    } catch (err) {
        next(err);
    }
};