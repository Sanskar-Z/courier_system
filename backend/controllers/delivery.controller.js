const db = require('../config/db');

exports.recordDelivery = async (req, res, next) => {
    try {
        const { shipment_id, courier_id, status, recipient_signature, notes } = req.body;
        
        const [existing] = await db.query('SELECT id FROM deliveries WHERE shipment_id = ?', [shipment_id]);
        
        if (existing.length > 0) {
            await db.query('UPDATE deliveries SET status = ?, recipient_signature = ?, notes = ?, delivery_time = NOW() WHERE shipment_id = ?', 
            [status, recipient_signature, notes, shipment_id]);
        } else {
            await db.query('INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status, recipient_signature, notes) VALUES (?, ?, NOW(), ?, ?, ?)', 
            [shipment_id, courier_id, status, recipient_signature, notes]);
        }
        
        res.json({ message: 'Delivery recorded successfully' });
    } catch (err) {
        next(err);
    }
};
