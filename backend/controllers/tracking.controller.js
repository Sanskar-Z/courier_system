import db from '../config/db.js';
import { sendEmail } from '../utils/email.js';

export const getTrackingHistory = async (req, res, next) => {
    try {
        const { tracking_no } = req.params;
        const [shipments] = await db.query('SELECT * FROM shipments WHERE tracking_no = ?', [tracking_no]);
        
        if (shipments.length === 0) return res.status(404).json({ error: 'Shipment not found' });
        
        const shipment = shipments[0];
        
        // get status
        const [statusList] = await db.query('SELECT current_state, updated_at FROM shipment_status WHERE shipment_id = ?', [shipment.id]);
        shipment.current_status = statusList.length > 0 ? statusList[0].current_state : 'Booked';
        
        // get events
        const [events] = await db.query('SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_time DESC', [shipment.id]);
        
        // get deliveries
        const [deliveries] = await db.query('SELECT * FROM deliveries WHERE shipment_id = ?', [shipment.id]);
        shipment.delivery = deliveries.length > 0 ? deliveries[0] : null;

        res.json({ shipment, events });
    } catch (err) {
        next(err);
    }
};

export const addEvent = async (req, res, next) => {
    try {
        const { shipment_id, status, location, description } = req.body;
        
        await db.query('INSERT INTO tracking_events (shipment_id, status, location, description) VALUES (?, ?, ?, ?)', 
        [shipment_id, status, location, description]);
        
        res.status(201).json({ message: 'Tracking event added' });
    } catch (err) {
        next(err);
    }
};

export const getEventsByShipmentId = async (req, res, next) => {
    try {
        const { shipment_id } = req.query;
        if (!shipment_id) return res.status(400).json({ error: 'shipment_id is required' });
        
        const [events] = await db.query('SELECT * FROM tracking_events WHERE shipment_id = ? ORDER BY event_time DESC', [shipment_id]);
        res.json(events);
    } catch (err) {
        next(err);
    }
};

export const reportDelay = async (req, res, next) => {
    try {
        const { shipment_id, reason } = req.body;
        await db.query('CALL sp_calculate_delay(?, ?)', [shipment_id, reason]);

        const [emailData] = await db.query('SELECT c.email, s.tracking_no FROM shipments s JOIN customers c ON s.customer_id = c.id WHERE s.id = ?', [shipment_id]);
        if (emailData.length > 0) {
            await sendEmail(emailData[0].email, 'Delay Detected', `Your shipment ${emailData[0].tracking_no} has a reported delay: ${reason}. SLA dates have been adjusted.`);
        }

        res.status(201).json({ message: 'Delay reported, SLA dates updated' });
    } catch (err) {
        next(err);
    }
};
