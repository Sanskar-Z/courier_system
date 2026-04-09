import db from '../config/db.js';

export const createShipment = async (req, res, next) => {
    try {
        const { sender_name, sender_address, receiver_name, receiver_address, weight, service_type, customer_id: bodyCustomerId } = req.body;

        if (!sender_name || !sender_address || !receiver_name || !receiver_address || !weight || !service_type) {
            return res.status(400).json({ error: 'Missing shipment fields' });
        }

        const serviceTypeMap = {
            standard: 'Standard',
            express: 'Express',
            overnight: 'Overnight'
        };
        const normalizedServiceType = String(service_type).trim().toLowerCase();
        const canonicalServiceType = serviceTypeMap[normalizedServiceType];
        if (!canonicalServiceType) {
            return res.status(400).json({ error: 'Invalid service type' });
        }

        let customer_id;
        if (req.user.role === 'customer') {
            const [cust] = await db.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
            console.log(req.user.id)
            if (cust.length === 0) return res.status(403).json({ error: 'Customer profile not found' });
            customer_id = cust[0].id;
        } else {
            customer_id = bodyCustomerId;
            if (!customer_id) return res.status(400).json({ error: 'Customer ID is required for staff or admin bookings' });
        }

        const insertShipment = async () => {
            const [slaRows] = await db.query('SELECT id, max_delivery_hours FROM sla WHERE service_type = ? LIMIT 1', [canonicalServiceType]);
            let sla_id;
            let maxDeliveryHours;

            if (slaRows.length > 0) {
                sla_id = slaRows[0].id;
                maxDeliveryHours = slaRows[0].max_delivery_hours;
            } else {
                const serviceTypeDefaults = {
                    Standard: { hours: 72, description: 'Standard 3-day delivery via land transport.' },
                    Express: { hours: 24, description: 'Next day delivery via air.' },
                    Overnight: { hours: 12, description: 'Overnight priority delivery within region.' }
                };
                const defaults = serviceTypeDefaults[canonicalServiceType];
                if (!defaults) {
                    const error = new Error('Invalid service type');
                    error.status = 400;
                    throw error;
                }

                const [slaResult] = await db.query(
                    'INSERT INTO sla (service_type, max_delivery_hours, description) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id = LAST_INSERT_ID(id)',
                    [canonicalServiceType, defaults.hours, defaults.description]
                );
                sla_id = slaResult.insertId;
                maxDeliveryHours = defaults.hours;
            }

            const tracking_no = `TRK${new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14)}${Math.floor(Math.random() * 1000)}`;
            const rateMap = { Standard: 5.0, Express: 10.0, Overnight: 20.0 };
            const rate = rateMap[canonicalServiceType] ?? 5.0;
            const base_charge = parseFloat(weight) * rate;

            const [result] = await db.query(
                'INSERT INTO shipments (tracking_no, customer_id, sender_name, sender_address, receiver_name, receiver_address, weight, service_type, sla_id, expected_delivery_date, base_charge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_ADD(NOW(), INTERVAL ? HOUR), ?)',
                [tracking_no, customer_id, sender_name, sender_address, receiver_name, receiver_address, weight, canonicalServiceType, sla_id, maxDeliveryHours, base_charge]
            );

            const shipment_id = result.insertId;
            await db.query('INSERT INTO shipment_status (shipment_id, current_state) VALUES (?, ?)', [shipment_id, 'Booked']);

            return { shipment_id, tracking_no };
        };

        try {
            const [result] = await db.query('CALL sp_create_shipment(?, ?, ?, ?, ?, ?, ?, @p_shipment_id, @p_tracking_no)',
                [customer_id, sender_name, sender_address, receiver_name, receiver_address, weight, canonicalServiceType]);
            const [[{ p_shipment_id, p_tracking_no }]] = await db.query('SELECT @p_shipment_id AS p_shipment_id, @p_tracking_no AS p_tracking_no');
            return res.status(201).json({ message: 'Shipment created successfully', shipment_id: p_shipment_id, tracking_no: p_tracking_no });
        } catch (err) {
            if (err.code === 'ER_SP_DOES_NOT_EXIST' || err.message.includes('does not exist') || err.message.includes('Invalid Service Type')) {
                const { shipment_id, tracking_no } = await insertShipment();
                return res.status(201).json({ message: 'Shipment created successfully', shipment_id, tracking_no });
            }
            throw err;
        }
    } catch (err) {
        next(err);
    }
};

export const getShipments = async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        let query = 'SELECT s.*, c.full_name as customer_name, cou.name as courier_name FROM shipments s JOIN customers c ON s.customer_id = c.id LEFT JOIN couriers cou ON s.courier_id = cou.id';
        let params = [];
        let customerId = null;
        
        if (req.user.role === 'customer') {
            const [cust] = await db.query('SELECT id FROM customers WHERE user_id = ?', [req.user.id]);
            if (cust.length === 0) return res.status(403).json({ error: 'Customer profile not found' });
            customerId = cust[0].id;
            query += ' WHERE s.customer_id = ?';
            params.push(customerId);
        }
        
        query += ' ORDER BY s.created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);
        const [shipments] = await db.query(query, params);
        
        // Also fetch status for each
        const [statuses] = await db.query('SELECT * FROM shipment_status');
        const statusMap = {};
        statuses.forEach(s => statusMap[s.shipment_id] = s.current_state);
        
        shipments.forEach(s => {
            s.current_status = statusMap[s.id] || 'Booked';
        });

        const [total] = await db.query('SELECT COUNT(*) AS count FROM shipments' + (req.user.role === 'customer' ? ' WHERE customer_id = ?' : ''), req.user.role === 'customer' ? [customerId] : []);
        res.json({ shipments, total: total[0].count, page: parseInt(page), limit: parseInt(limit) });
    } catch (err) {
        next(err);
    }
};

export const assignCourier = async (req, res, next) => {
    try {
        const { courier_id } = req.body;
        const { id } = req.params;
        
        await db.query('UPDATE shipments SET courier_id = ? WHERE id = ?', [courier_id, id]);
        
        res.json({ message: 'Courier assigned successfully' });
    } catch (err) {
        next(err);
    }
};

export const getSLAReport = async (req, res, next) => {
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

export const linkHub = async (req, res, next) => {
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
