import db from '../config/db.js';

export const getAuditLogs = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const [logs] = await db.query('SELECT a.*, u.username FROM audit_logs a LEFT JOIN users u ON a.user_id = u.id ORDER BY a.created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
        const [total] = await db.query('SELECT COUNT(*) AS count FROM audit_logs');
        res.json({ logs, total: total[0].count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        next(err);
    }
};