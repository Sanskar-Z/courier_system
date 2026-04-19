import db from '../config/db.js';

// Q38 — GET damage logs with shipment tracking info and reporting user (JOIN + LEFT JOIN)
export const getDamageLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [logs] = await db.query(
            `SELECT dl.id, dl.damage_description, dl.severity, dl.reported_at, dl.shipment_id,
                    s.tracking_no, s.sender_name, s.receiver_name,
                    u.username AS reported_by_user
             FROM damage_logs dl
             JOIN shipments s      ON dl.shipment_id = s.id
             LEFT JOIN users u     ON dl.reported_by  = u.id
             ORDER BY dl.reported_at DESC
             LIMIT ? OFFSET ?`,
            [parseInt(limit), offset]
        );

        const [total] = await db.query('SELECT COUNT(*) AS count FROM damage_logs');

        res.json({ logs, total: total[0].count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) { next(err); }
};

// POST — log a new damage report (from UI form)
export const createDamageLog = async (req, res, next) => {
    try {
        const { shipment_id, damage_description, severity } = req.body;
        const reported_by = req.user?.id || null;

        if (!shipment_id || !damage_description) {
            return res.status(400).json({ error: 'shipment_id and damage_description are required' });
        }

        const [result] = await db.query(
            `INSERT INTO damage_logs (shipment_id, damage_description, reported_by, severity)
             VALUES (?, ?, ?, ?)`,
            [shipment_id, damage_description, reported_by, severity || 'Minor']
        );
        res.status(201).json({ message: 'Damage log created', id: result.insertId });
    } catch (err) { next(err); }
};
