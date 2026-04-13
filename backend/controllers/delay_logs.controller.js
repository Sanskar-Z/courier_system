import db from '../config/db.js';

export const getDelayLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, shipment_id } = req.query;
        const offset = (page - 1) * limit;
        let query = 'SELECT d.*, s.tracking_no FROM delay_logs d JOIN shipments s ON d.shipment_id = s.id';
        const params = [];
        if (shipment_id) {
            query += ' WHERE d.shipment_id = ?';
            params.push(shipment_id);
        }
        query += ' ORDER BY d.reported_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);
        
        const [logs] = await db.query(query, params);
        
        let countQuery = 'SELECT COUNT(*) AS count FROM delay_logs';
        const countParams = [];
        if (shipment_id) {
            countQuery += ' WHERE shipment_id = ?';
            countParams.push(shipment_id);
        }
        const [total] = await db.query(countQuery, countParams);
        
        res.json({ logs, total: total[0].count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        next(err);
    }
};
