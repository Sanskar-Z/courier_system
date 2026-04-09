import db from '../config/db.js';

export const logDamage = async (req, res) => {
    const { shipment_id, description, severity } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO damage_logs (shipment_id, description, severity) VALUES (?, ?, ?)',
            [shipment_id, description, severity]
        );
        res.status(201).json({ message: 'Damage logged', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDamageLogs = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM damage_logs ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [parseInt(limit), offset]
        );
        const [count] = await db.execute('SELECT COUNT(*) as total FROM damage_logs');
        res.json({ logs: rows, total: count[0].total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};