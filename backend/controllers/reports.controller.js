import db from '../config/db.js';

export const getAdvancedReports = async (req, res, next) => {
    try {
        const [slaReport] = await db.query('SELECT * FROM sla_report_view');

        const [tracking] = await db.query('SELECT * FROM shipment_tracking_view LIMIT 50');

        const { tracking_no, status, date_from, date_to } = req.query;
        let query = 'SELECT * FROM shipments WHERE 1=1';
        let params = [];
        if (tracking_no) {
            query += ' AND tracking_no LIKE ?';
            params.push(`%${tracking_no}%`);
        }
        if (status) {
            query += ' AND id IN (SELECT shipment_id FROM shipment_status WHERE current_state = ?)';
            params.push(status);
        }
        if (date_from) {
            query += ' AND created_at >= ?';
            params.push(date_from);
        }
        if (date_to) {
            query += ' AND created_at <= ?';
            params.push(date_to);
        }
        const [searchResults] = await db.query(query, params);

        res.json({ slaReport, tracking, searchResults });
    } catch (err) {
        next(err);
    }
};

export const getTopCouriers = async (req, res, next) => {
    try {
        const query = `
            SELECT courier_id, COUNT(id) as number_of_deliveries 
            FROM deliveries 
            WHERE status = 'Successful' 
            GROUP BY courier_id 
            HAVING COUNT(id) > 5
        `;
        const [results] = await db.query(query);
        res.json({ top_couriers: results });
    } catch (err) {
        next(err);
    }
};