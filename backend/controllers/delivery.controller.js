import db from '../config/db.js';
import { sendEmail } from '../utils/email.js';

export const recordDelivery = async (req, res, next) => {
    try {
        const { shipment_id, courier_id, status, recipient_signature, notes } = req.body;
        const proof_path = req.file ? req.file.path : null;

        const [existing] = await db.query('SELECT id FROM deliveries WHERE shipment_id = ?', [shipment_id]);

        const updatedNotes = proof_path ? `${notes || ''} [PROOF UPLOADED: ${proof_path}]` : notes;

        if (existing.length > 0) {
            await db.query('UPDATE deliveries SET status = ?, recipient_signature = ?, notes = ?, delivery_time = NOW() WHERE shipment_id = ?',
                [status, recipient_signature, updatedNotes, shipment_id]);
        } else {
            await db.query('INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status, recipient_signature, notes) VALUES (?, ?, NOW(), ?, ?, ?)',
                [shipment_id, courier_id, status, recipient_signature, updatedNotes]);

            if (status === 'Successful') {
                await db.query('INSERT INTO tracking_events (shipment_id, status, location, description) VALUES (?, ?, ?, ?)',
                    [shipment_id, 'Delivered', 'Final Destination', 'Shipment successfully delivered']);
            }
        }

        await db.query('UPDATE shipment_status SET current_state = ? WHERE shipment_id = ?', [status === 'Successful' ? 'Delivered' : status, shipment_id]);

        const [emailData] = await db.query('SELECT c.email FROM shipments s JOIN customers c ON s.customer_id = c.id WHERE s.id = ?', [shipment_id]);
        if (emailData.length > 0) {
            const subject = status === 'Successful' ? 'Delivery Completed' : 'Delivery Attempt Failed';
            await sendEmail(emailData[0].email, subject, `The delivery attempt for your shipment was marked as ${status}.`);
        }

        res.json({ message: 'Delivery recorded successfully' });
    } catch (err) {
        next(err);
    }
};

export const getDeliveryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [deliveries] = await db.query('SELECT * FROM deliveries WHERE id = ?', [id]);
        if (deliveries.length === 0) return res.status(404).json({ error: 'Delivery not found' });
        res.json(deliveries[0]);
    } catch (err) {
        next(err);
    }
};
