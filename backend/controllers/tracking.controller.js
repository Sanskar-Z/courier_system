const db = require('../config/db');

exports.getTrackingHistory = async (req, res, next) => {
    try {
        const { tracking_no } = req.params;
        const [shipments] = await db.query('SELECT * FROM shipments WHERE tracking_no = ?', [tracking_no]);
        
        if (shipments.length === 0) return res.status(404).json({ error: 'Shipment not found' });
        
        const shipment = shipments[0];
        
        // get status
        const [statusList] = await db.query('SELECT current_state, updated_at FROM shipment_status WHERE shipment_id = ?', [shipment.id]);
        shipment.current_status = statusList.length > 0 ? statusList[0] : null;
        
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

exports.addEvent = async (req, res, next) => {
    try {
        const { shipment_id, status, location, description } = req.body;
        
        await db.query('INSERT INTO tracking_events (shipment_id, status, location, description) VALUES (?, ?, ?, ?)', 
        [shipment_id, status, location, description]);
        
        res.status(201).json({ message: 'Tracking event added' });
    } catch (err) {
        next(err);
    }
};

exports.reportDelay = async (req, res, next) => {
    try {
        const { shipment_id, reason } = req.body;
        await db.query('CALL sp_calculate_delay(?, ?)', [shipment_id, reason]);
        res.status(201).json({ message: 'Delay reported, SLA dates updated' });
    } catch (err) {
        next(err);
    }
};
