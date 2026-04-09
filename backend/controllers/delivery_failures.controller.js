import db from '../config/db.js';

export const logDeliveryFailure = async (req, res) => {
    const { shipment_id, reason, retry_scheduled } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO delivery_failures (shipment_id, reason, retry_scheduled) VALUES (?, ?, ?)',
            [shipment_id, reason, retry_scheduled]
        );
        res.status(201).json({ message: 'Delivery failure logged', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDeliveryFailures = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM delivery_failures ORDER BY created_at DESC LIMIT ? OFFSET ?',
            [parseInt(limit), offset]
        );
        const [count] = await db.execute('SELECT COUNT(*) as total FROM delivery_failures');
        res.json({ failures: rows, total: count[0].total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};