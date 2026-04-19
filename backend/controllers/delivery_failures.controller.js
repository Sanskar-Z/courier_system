import db from '../config/db.js';

// Q39 — GET unresolved delivery failures with shipment tracking_no (INNER JOIN)
export const getDeliveryFailures = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const [failures] = await db.query(
            `SELECT df.id, df.shipment_id, df.attempt_number,
                    df.failure_reason, df.retry_scheduled, df.resolved,
                    s.tracking_no, s.receiver_name, s.receiver_address
             FROM delivery_failures df
             JOIN shipments s ON df.shipment_id = s.id
             WHERE df.resolved = FALSE
             ORDER BY df.attempt_number DESC, df.retry_scheduled ASC
             LIMIT ? OFFSET ?`,
            [parseInt(limit), offset]
        );

        const [total] = await db.query(
            'SELECT COUNT(*) AS count FROM delivery_failures WHERE resolved = FALSE'
        );

        res.json({ failures, total: total[0].count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) { next(err); }
};

// POST — log a new delivery failure record (from UI form)
export const createDeliveryFailure = async (req, res, next) => {
    try {
        const { shipment_id, attempt_number, failure_reason, retry_scheduled } = req.body;
        if (!shipment_id || !failure_reason) {
            return res.status(400).json({ error: 'shipment_id and failure_reason are required' });
        }
        const [result] = await db.query(
            `INSERT INTO delivery_failures (shipment_id, attempt_number, failure_reason, retry_scheduled, resolved)
             VALUES (?, ?, ?, ?, FALSE)`,
            [shipment_id, attempt_number || 1, failure_reason, retry_scheduled || null]
        );
        res.status(201).json({ message: 'Delivery failure logged', id: result.insertId });
    } catch (err) { next(err); }
};

// Q18 — Physical DELETE of a resolved delivery failure record
export const resolveDeliveryFailure = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Mark as resolved first
        await db.query('UPDATE delivery_failures SET resolved = TRUE WHERE id = ?', [id]);

        // Physical DELETE — Q18 (hard delete, not soft delete)
        const [result] = await db.query(
            'DELETE FROM delivery_failures WHERE id = ? AND resolved = TRUE',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found or not eligible for deletion' });
        }

        res.json({ message: 'Delivery failure record permanently deleted (physical DELETE)' });
    } catch (err) { next(err); }
};
