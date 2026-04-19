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

// Q11 — Hub activity: hubs with linked shipments (RIGHT JOIN + GROUP BY + HAVING)
export const getHubActivity = async (req, res, next) => {
    try {
        const [hubs] = await db.query(`
            SELECT h.id, h.name AS hub_name, h.location, h.capacity,
                   COUNT(sh.id) AS active_shipments
            FROM shipment_hubs sh
            RIGHT JOIN hubs h ON sh.hub_id = h.id
            GROUP BY h.id, h.name, h.location, h.capacity
            ORDER BY active_shipments DESC
        `);
        res.json({ hubs });
    } catch (err) { next(err); }
};

// Q12 — Top customers with >2 shipments (INNER JOIN + GROUP BY + HAVING + SUM)
export const getTopCustomers = async (req, res, next) => {
    try {
        const [customers] = await db.query(`
            SELECT c.id, c.full_name, c.email, c.phone,
                   COUNT(s.id) AS total_shipments,
                   SUM(s.base_charge) AS total_charged
            FROM customers c
            JOIN shipments s ON c.id = s.customer_id
            WHERE s.is_deleted = FALSE
            GROUP BY c.id, c.full_name, c.email, c.phone
            HAVING COUNT(s.id) > 2
            ORDER BY total_shipments DESC
        `);
        res.json({ customers });
    } catch (err) { next(err); }
};

// Q14 — Customers who have at least one SLA-breached shipment (EXISTS subquery)
export const getSlaBreachedCustomers = async (req, res, next) => {
    try {
        const [customers] = await db.query(`
            SELECT DISTINCT c.id, c.full_name, c.email
            FROM customers c
            WHERE EXISTS (
                SELECT 1 FROM shipments s
                WHERE s.customer_id = c.id
                  AND s.is_sla_breached = TRUE
                  AND s.is_deleted = FALSE
            )
        `);
        res.json({ customers });
    } catch (err) { next(err); }
};

// Q15 — Shipments heavier than average weight (scalar subquery)
export const getHeavyShipments = async (req, res, next) => {
    try {
        const [shipments] = await db.query(`
            SELECT id, tracking_no, weight, service_type, base_charge
            FROM shipments
            WHERE weight > (
                SELECT AVG(weight) FROM shipments WHERE is_deleted = FALSE
            )
            AND is_deleted = FALSE
            ORDER BY weight DESC
        `);
        res.json({ shipments });
    } catch (err) { next(err); }
};

// Q16 — Latest tracking event per shipment (correlated subquery)
export const getLatestTrackingPerShipment = async (req, res, next) => {
    try {
        const [results] = await db.query(`
            SELECT s.tracking_no, s.sender_name, s.receiver_name,
                   te.status AS latest_status,
                   te.location AS latest_location,
                   te.event_time AS latest_event_time
            FROM shipments s
            JOIN tracking_events te ON s.id = te.shipment_id
            WHERE te.event_time = (
                SELECT MAX(event_time)
                FROM tracking_events
                WHERE shipment_id = s.id
            )
            AND s.is_deleted = FALSE
            LIMIT 50
        `);
        res.json({ results });
    } catch (err) { next(err); }
};

// Q23 — SELF JOIN: active courier pairs stationed at the same hub
export const getCouriersAtSameHub = async (req, res, next) => {
    try {
        const [pairs] = await db.query(`
            SELECT c1.id AS courier1_id, c1.name AS courier1_name,
                   c2.id AS courier2_id, c2.name AS courier2_name,
                   c1.current_hub_id AS shared_hub_id,
                   h.name AS hub_name
            FROM couriers c1
            JOIN couriers c2
                ON c1.current_hub_id = c2.current_hub_id AND c1.id < c2.id
            JOIN hubs h ON h.id = c1.current_hub_id
            WHERE c1.current_hub_id IS NOT NULL
              AND c1.status = 'Active'
              AND c2.status = 'Active'
        `);
        res.json({ pairs });
    } catch (err) { next(err); }
};

// Q24 — NON-EQUI JOIN: shipments matched to SLA by service type + weight BETWEEN range
export const getShipmentSlaWeightMatch = async (req, res, next) => {
    try {
        const [results] = await db.query(`
            SELECT s.tracking_no, s.weight, s.service_type,
                   sl.max_delivery_hours, sl.description AS sla_policy
            FROM shipments s
            JOIN sla sl
                ON s.service_type = sl.service_type
               AND s.weight BETWEEN 0.5 AND 10.0
            WHERE s.is_deleted = FALSE
            ORDER BY s.weight DESC
        `);
        res.json({ results });
    } catch (err) { next(err); }
};

// Q25 — RIGHT JOIN: all hubs including those with no linked shipments
export const getHubCoverage = async (req, res, next) => {
    try {
        const [hubs] = await db.query(`
            SELECT h.id AS hub_id, h.name AS hub_name, h.location,
                   h.capacity, COUNT(sh.id) AS linked_shipments
            FROM shipment_hubs sh
            RIGHT JOIN hubs h ON sh.hub_id = h.id
            GROUP BY h.id, h.name, h.location, h.capacity
            ORDER BY linked_shipments DESC
        `);
        res.json({ hubs });
    } catch (err) { next(err); }
};

// Q26 — DISTINCT service types that have had at least one SLA breach
export const getBreachedServiceTypes = async (req, res, next) => {
    try {
        const [types] = await db.query(`
            SELECT DISTINCT service_type
            FROM shipments
            WHERE is_sla_breached = TRUE
              AND is_deleted = FALSE
            ORDER BY service_type
        `);
        res.json({ types });
    } catch (err) { next(err); }
};

// Q27 — Revenue aggregation per service type (AVG, MIN, MAX, SUM, COUNT)
export const getRevenueByService = async (req, res, next) => {
    try {
        const [revenue] = await db.query(`
            SELECT service_type,
                   COUNT(*) AS total_shipments,
                   ROUND(AVG(base_charge), 2) AS avg_charge,
                   MIN(base_charge) AS min_charge,
                   MAX(base_charge) AS max_charge,
                   SUM(base_charge) AS total_revenue
            FROM shipments
            WHERE is_deleted = FALSE
            GROUP BY service_type
            ORDER BY total_revenue DESC
        `);
        res.json({ revenue });
    } catch (err) { next(err); }
};

// Q28 — Top 5 heaviest undelivered shipments (ORDER BY + LIMIT + JOIN)
export const getHeaviestUndelivered = async (req, res, next) => {
    try {
        const [shipments] = await db.query(`
            SELECT s.id, s.tracking_no, s.weight, s.service_type,
                   ss.current_state
            FROM shipments s
            JOIN shipment_status ss ON s.id = ss.shipment_id
            WHERE ss.current_state != 'Delivered'
              AND s.is_deleted = FALSE
            ORDER BY s.weight DESC
            LIMIT 5
        `);
        res.json({ shipments });
    } catch (err) { next(err); }
};

// Q36 + Q37 — Stored function usage: fn_sla_status() and fn_delay_duration()
export const getShipmentFunctionReport = async (req, res, next) => {
    try {
        // Q36: fn_sla_status — SLA compliance label per shipment
        const [slaStatus] = await db.query(`
            SELECT s.id, s.tracking_no, s.service_type,
                   s.expected_delivery_date,
                   fn_sla_status(s.id) AS sla_status
            FROM shipments s
            WHERE s.is_deleted = FALSE
            ORDER BY s.id
            LIMIT 50
        `);

        // Q37: fn_delay_duration — hours delayed for successfully delivered shipments
        const [delayDuration] = await db.query(`
            SELECT s.id, s.tracking_no, s.service_type,
                   s.expected_delivery_date,
                   d.delivery_time,
                   fn_delay_duration(s.id) AS delay_hours
            FROM shipments s
            JOIN deliveries d ON s.id = d.shipment_id
            WHERE d.status = 'Successful'
              AND fn_delay_duration(s.id) > 0
            ORDER BY delay_hours DESC
            LIMIT 50
        `);

        res.json({ slaStatus, delayDuration });
    } catch (err) { next(err); }
};