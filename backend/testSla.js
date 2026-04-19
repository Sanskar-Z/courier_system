import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function runTests() {
    const db = await mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'courier_system',
    });

    try {
        console.log("---- Testing SLA Logic ----");
        
        // Ensure SLA types exist
        await db.query(`INSERT IGNORE INTO sla (service_type, max_delivery_hours, description) VALUES ('Express', 24, 'Express'), ('Standard', 48, 'Standard')`);

        // Test Case 1: SLA Met
        await db.query(`CALL sp_create_shipment(1, 'SenderA', 'AddA', 'RecvA', 'AddA2', 5, 'Express', @p_id1, @p_trk1)`);
        const [[{ id1, trk1 }]] = await db.query(`SELECT @p_id1 as id1, @p_trk1 as trk1`);
        
        // Backdate shipment to simulate time passing (e.g., booked 10 hours ago)
        await db.query(`UPDATE shipments SET expected_delivery_date = DATE_ADD(NOW(), INTERVAL 14 HOUR) WHERE id = ?`, [id1]);
        
        // Insert Delivery
        await db.query(`INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status) VALUES (?, 1, NOW(), 'Pending')`, [id1]);
        await db.query(`UPDATE deliveries SET status = 'Successful', delivery_time = NOW() WHERE shipment_id = ?`, [id1]);

        const [[res1]] = await db.query(`SELECT is_sla_breached, fn_sla_status(?) as sla_status FROM shipments WHERE id = ?`, [id1, id1]);
        console.log(`Test Case 1 (Met): Tracking No: ${trk1} => fn_sla_status: '${res1.sla_status}', is_sla_breached: ${!!res1.is_sla_breached}`);


        // Test Case 2: SLA Breached
        await db.query(`CALL sp_create_shipment(1, 'SenderB', 'AddB', 'RecvB', 'AddB2', 5, 'Standard', @p_id2, @p_trk2)`);
        const [[{ id2, trk2 }]] = await db.query(`SELECT @p_id2 as id2, @p_trk2 as trk2`);
        
        // Backdate shipment by 50 hours (Expected was 48 hrs from now)
        await db.query(`UPDATE shipments SET expected_delivery_date = DATE_SUB(NOW(), INTERVAL 2 HOUR) WHERE id = ?`, [id2]);
        
        await db.query(`INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status) VALUES (?, 1, NOW(), 'Pending')`, [id2]);
        await db.query(`UPDATE deliveries SET status = 'Successful', delivery_time = NOW() WHERE shipment_id = ?`, [id2]);

        const [[res2]] = await db.query(`SELECT is_sla_breached, fn_sla_status(?) as sla_status FROM shipments WHERE id = ?`, [id2, id2]);
        console.log(`Test Case 2 (Breached): Tracking No: ${trk2} => fn_sla_status: '${res2.sla_status}', is_sla_breached: ${!!res2.is_sla_breached}`);


        // Test Case 3: Pending
        await db.query(`CALL sp_create_shipment(1, 'SenderC', 'AddC', 'RecvC', 'AddC2', 5, 'Standard', @p_id3, @p_trk3)`);
        const [[{ id3, trk3 }]] = await db.query(`SELECT @p_id3 as id3, @p_trk3 as trk3`);
        const [[res3]] = await db.query(`SELECT is_sla_breached, fn_sla_status(?) as sla_status FROM shipments WHERE id = ?`, [id3, id3]);
        console.log(`Test Case 3 (Pending): Tracking No: ${trk3} => fn_sla_status: '${res3.sla_status}', is_sla_breached: ${!!res3.is_sla_breached}`);

    } catch (e) {
        console.error(e);
    } finally {
        await db.end();
    }
}

runTests();
