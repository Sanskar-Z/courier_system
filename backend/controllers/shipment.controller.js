const db = require('../config/db');

exports.createShipment = async (req, res, next) => {
    try {
        const { sender_name, sender_address, receiver_name, receiver_address, weight, service_type } = req.body;
        
        let customer_id;
        if (req.user.role === 'customer') {
            const [cust] = await db.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
            if(cust.length === 0) return res.status(403).json({ error: 'Customer profile not found' });
            customer_id = cust[0].id;
        } else {
            customer_id = req.body.customer_id;
        }

        const [result] = await db.query('CALL sp_create_shipment(?, ?, ?, ?, ?, ?, ?, @p_shipment_id, @p_tracking_no)', 
            [customer_id, sender_name, sender_address, receiver_name, receiver_address, weight, service_type]);
        
        const [[{ p_shipment_id, p_tracking_no }]] = await db.query('SELECT @p_shipment_id AS p_shipment_id, @p_tracking_no AS p_tracking_no');
        
        res.status(201).json({ message: 'Shipment created successfully', shipment_id: p_shipment_id, tracking_no: p_tracking_no });
    } catch (err) {
        next(err);
    }
};

exports.getShipments = async (req, res, next) => {
    try {
        let query = 'SELECT s.*, c.full_name as customer_name, cou.name as courier_name FROM shipments s JOIN customers c ON s.customer_id = c.id LEFT JOIN couriers cou ON s.courier_id = cou.id';
        let params = [];
        
        if (req.user.role === 'customer') {
            const [cust] = await db.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
            query += ' WHERE s.customer_id = ?';
            params.push(cust[0].id);
        }
        
        query += ' ORDER BY s.created_at DESC';
        const [shipments] = await db.query(query, params);
        
        // Also fetch status for each
        const [statuses] = await db.query('SELECT * FROM shipment_status');
        const statusMap = {};
        statuses.forEach(s => statusMap[s.shipment_id] = s.current_state);
        
        shipments.forEach(s => {
            s.current_status = statusMap[s.id] || 'Booked';
        });

        res.json(shipments);
    } catch (err) {
        next(err);
    }
};

exports.assignCourier = async (req, res, next) => {
    try {
        const { courier_id } = req.body;
        const { id } = req.params;
        
        await db.query('UPDATE shipments SET courier_id = ? WHERE id = ?', [courier_id, id]);
        
        res.json({ message: 'Courier assigned successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getSLAReport = async (req, res, next) => {
    try {
        const [breaches] = await db.query('SELECT count(*) as total_breaches FROM shipments WHERE is_sla_breached = TRUE');
        const [total] = await db.query('SELECT count(*) as total_shipments FROM shipments');
        const [delayed] = await db.query('SELECT count(distinct shipment_id) as delayed FROM delay_logs');
        const [byService] = await db.query('SELECT service_type, count(*) as count FROM shipments GROUP BY service_type');
        
        res.json({ 
            total_shipments: total[0].total_shipments,
            sla_breaches: breaches[0].total_breaches,
            delayed_shipments: delayed[0].delayed,
            by_service: byService
        });
    } catch (err) {
        next(err);
    }
};

exports.linkHub = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { hub_id } = req.body;
        
        // Log arrival at hub
        await db.query('INSERT INTO shipment_hubs (shipment_id, hub_id, arrival_time) VALUES (?, ?, NOW())', [id, hub_id]);
        
        res.json({ message: 'Shipment linked to hub successfully' });
    } catch (err) {
        next(err);
    }
};
