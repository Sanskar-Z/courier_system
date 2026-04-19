USE courier_system;

-- ─────────────────────────────────────────────────────────────────────────────
-- SEED DATA — Full realistic dataset for all 15 tables
-- Run AFTER schema.sql
-- ─────────────────────────────────────────────────────────────────────────────


-- ── 1. SLA Policies ──────────────────────────────────────────────────────────
INSERT INTO sla (service_type, max_delivery_hours, description) VALUES
  ('Standard',  72, 'Standard ground delivery up to 72 hours'),
  ('Express',   24, 'Priority express delivery within 24 hours'),
  ('Overnight', 12, 'Guaranteed overnight delivery within 12 hours');


-- ── 2. Hubs ──────────────────────────────────────────────────────────────────
INSERT INTO hubs (name, location, capacity) VALUES
  ('Mumbai Central Hub', 'Andheri East, Mumbai, MH 400069', 300),
  ('Delhi North Hub',    'Rohini, Delhi, DL 110085',        250),
  ('Pune Depot',         'Hinjawadi, Pune, MH 411057',      150),
  ('Bangalore Hub',      'Whitefield, Bangalore, KA 560066', 200),
  ('Chennai South Hub',  'Porur, Chennai, TN 600116',       120);


-- ── 3. Users (passwords are bcrypt of "password123") ─────────────────────────
-- Hash = bcrypt("password123", 10)
INSERT INTO users (username, password_hash, role) VALUES
  ('admin_raj',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
  ('staff_priya',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff'),
  ('staff_rahul',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'staff'),
  ('cust_amit',    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
  ('cust_sneha',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
  ('cust_vikram',  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
  ('cust_meera',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer'),
  ('cust_arjun',   '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'customer');
-- All accounts: login with password "password123"


-- ── 4. Customers ─────────────────────────────────────────────────────────────
INSERT INTO customers (user_id, full_name, phone, email, address) VALUES
  (4, 'Amit Shah',    '9876501234', 'amit.shah@example.com',   '12 MG Road, Andheri, Mumbai 400053'),
  (5, 'Sneha Patil',  '9876502345', 'sneha.patil@example.com', '45 BKC, Bandra, Mumbai 400051'),
  (6, 'Vikram Nair',  '9876503456', 'vikram.nair@example.com', '7 Koregaon Park, Pune 411001'),
  (7, 'Meera Joshi',  '9876504567', 'meera.joshi@example.com', '88 Indiranagar, Bangalore 560038'),
  (8, 'Arjun Kumar',  '9876505678', 'arjun.kumar@example.com', '23 T Nagar, Chennai 600017');


-- ── 5. Employees ─────────────────────────────────────────────────────────────
INSERT INTO employees (user_id, hub_id, role) VALUES
  (1, 1, 'Admin Manager'),
  (2, 1, 'Senior Staff'),
  (3, 2, 'Staff Officer');


-- ── 6. Couriers ──────────────────────────────────────────────────────────────
INSERT INTO couriers (name, vehicle_type, contact_number, status, current_hub_id) VALUES
  ('Ravi Singh',    'Bike',  '9000101001', 'Active',   1),
  ('Suresh Kumar',  'Bike',  '9000102002', 'Active',   1),
  ('Deepak Verma',  'Van',   '9000103003', 'Active',   2),
  ('Anita Sharma',  'Bike',  '9000104004', 'On Leave', 3),
  ('Mohan Das',     'Truck', '9000105005', 'Active',   4),
  ('Lakshmi Rao',   'Bike',  '9000106006', 'Active',   1);


-- ── 7. Shipments (created via stored procedure logic manually here) ──────────
INSERT INTO shipments
  (tracking_no, customer_id, courier_id, sender_name, sender_address,
   receiver_name, receiver_address, weight, service_type, sla_id,
   base_charge, expected_delivery_date, is_sla_breached, is_deleted)
VALUES
  ('TRK20240419001', 1, 1, 'Amit Shah',   '12 MG Road Mumbai',    'Priya Mehta',   '5 Andheri West Mumbai',   2.5,  'Express',   2, 25.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), FALSE, FALSE),
  ('TRK20240419002', 1, 2, 'Amit Shah',   '12 MG Road Mumbai',    'Rohan Gupta',   '78 Dadar Mumbai',         1.2,  'Standard',  1,  6.00, DATE_ADD(NOW(), INTERVAL  72 HOUR), FALSE, FALSE),
  ('TRK20240419003', 2, 3, 'Sneha Patil', '45 BKC Mumbai',        'Raj Sharma',    '22 Connaught Place Delhi',8.0,  'Overnight', 3,160.00, DATE_ADD(NOW(), INTERVAL  12 HOUR), FALSE, FALSE),
  ('TRK20240419004', 2, 1, 'Sneha Patil', '45 BKC Mumbai',        'Anil Kapoor',   '99 Juhu Mumbai',          0.8,  'Standard',  1,  4.00, DATE_ADD(NOW(), INTERVAL  72 HOUR), TRUE,  FALSE),
  ('TRK20240419005', 3, 5, 'Vikram Nair', '7 Koregaon Park Pune', 'Sunita Rao',    '15 MG Road Bangalore',    15.0, 'Express',   2,150.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), FALSE, FALSE),
  ('TRK20240419006', 3, 5, 'Vikram Nair', '7 Koregaon Park Pune', 'Kavya Reddy',   '31 Jubilee Hills Hyd',    3.5,  'Standard',  1, 17.50, DATE_ADD(NOW(), INTERVAL  72 HOUR), FALSE, FALSE),
  ('TRK20240419007', 4, 6, 'Meera Joshi', '88 Indiranagar Blr',   'Neha Singh',    '12 Lajpat Nagar Delhi',   22.0, 'Overnight', 3,440.00, DATE_ADD(NOW(), INTERVAL  12 HOUR), TRUE,  FALSE),
  ('TRK20240419008', 4, NULL,'Meera Joshi','88 Indiranagar Blr',   'Ananya Das',    '6 Park Street Kolkata',   5.0,  'Express',   2, 50.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), FALSE, FALSE),
  ('TRK20240419009', 5, 3, 'Arjun Kumar', '23 T Nagar Chennai',   'Kiran Patel',   '44 CG Road Ahmedabad',    9.5,  'Standard',  1, 47.50, DATE_ADD(NOW(), INTERVAL  72 HOUR), FALSE, FALSE),
  ('TRK20240419010', 5, 4, 'Arjun Kumar', '23 T Nagar Chennai',   'Pallavi Iyer',  '88 Adyar Chennai',        2.0,  'Express',   2, 20.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), TRUE,  FALSE),
  ('TRK20240419011', 1, 2, 'Amit Shah',   '12 MG Road Mumbai',    'Deepa Menon',   '9 Thrissur Kerala',       7.5,  'Standard',  1, 37.50, DATE_ADD(NOW(), INTERVAL  72 HOUR), FALSE, FALSE),
  ('TRK20240419012', 2, NULL,'Sneha Patil','45 BKC Mumbai',        'Farhan Khan',   '17 Lucknow UP',           1.0,  'Express',   2, 10.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), FALSE, FALSE),
  ('TRK20240419013', 3, 6, 'Vikram Nair', '7 Koregaon Park Pune', 'Geeta Pillai',  '5 Ernakulam Kerala',      4.5,  'Overnight', 3, 90.00, DATE_ADD(NOW(), INTERVAL  12 HOUR), FALSE, FALSE),
  ('TRK20240419014', 1, 1, 'Amit Shah',   '12 MG Road Mumbai',    'Harsh Mehta',   '30 Nariman Point Mumbai',  0.5, 'Standard',  1,  2.50, DATE_ADD(NOW(), INTERVAL  72 HOUR), FALSE, FALSE),
  ('TRK20240419015', 4, 5, 'Meera Joshi', '88 Indiranagar Blr',   'Isha Gupta',    '55 Gurgaon Haryana',      11.0, 'Express',   2,110.00, DATE_ADD(NOW(), INTERVAL  24 HOUR), TRUE,  FALSE);


-- ── 8. Shipment Status ───────────────────────────────────────────────────────
INSERT INTO shipment_status (shipment_id, current_state) VALUES
  (1,  'Out for Delivery'),
  (2,  'In Transit'),
  (3,  'Delivered'),
  (4,  'Delayed'),
  (5,  'Arrived at Hub'),
  (6,  'Booked'),
  (7,  'Delivered'),
  (8,  'Booked'),
  (9,  'In Transit'),
  (10, 'Delayed'),
  (11, 'In Transit'),
  (12, 'Booked'),
  (13, 'Out for Delivery'),
  (14, 'In Transit'),
  (15, 'Delayed');


-- ── 9. Tracking Events ───────────────────────────────────────────────────────
INSERT INTO tracking_events (shipment_id, status, location, description, event_time) VALUES
  (1, 'Booked',            'Mumbai Hub',          'Shipment booked and confirmed',               DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (1, 'In Transit',        'Andheri Depot',        'Picked up by courier Ravi Singh',            DATE_SUB(NOW(), INTERVAL 1 HOUR)),
  (1, 'Out for Delivery',  'Customer Area',        'Out for final delivery',                      NOW()),
  (2, 'Booked',            'Mumbai Hub',          'Shipment created',                            DATE_SUB(NOW(), INTERVAL 5 HOUR)),
  (2, 'In Transit',        'Mumbai Sorting',       'In transit to destination hub',              DATE_SUB(NOW(), INTERVAL 3 HOUR)),
  (3, 'Booked',            'Mumbai Hub',          'Overnight shipment booked',                   DATE_SUB(NOW(), INTERVAL 14 HOUR)),
  (3, 'In Transit',        'Delhi Hub',           'Arrived at Delhi Hub',                        DATE_SUB(NOW(), INTERVAL 8 HOUR)),
  (3, 'Out for Delivery',  'Connaught Place',      'Out for delivery',                           DATE_SUB(NOW(), INTERVAL 4 HOUR)),
  (3, 'Delivered',         'Final Destination',    'Delivered to Raj Sharma',                    DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (4, 'Booked',            'Mumbai Hub',          'Shipment created',                            DATE_SUB(NOW(), INTERVAL 80 HOUR)),
  (4, 'In Transit',        'Pune Depot',          'Forwarded to Pune depot',                    DATE_SUB(NOW(), INTERVAL 70 HOUR)),
  (4, 'Delayed',           'System',              'Weather disruption on NH-8',                  DATE_SUB(NOW(), INTERVAL 60 HOUR)),
  (7, 'Booked',            'Bangalore Hub',       'Overnight package booked',                    DATE_SUB(NOW(), INTERVAL 16 HOUR)),
  (7, 'In Transit',        'Delhi Hub',           'In transit',                                  DATE_SUB(NOW(), INTERVAL 14 HOUR)),
  (7, 'Delivered',         'Final Destination',   'Delivered to Neha Singh — SLA breached',     DATE_SUB(NOW(), INTERVAL 2 HOUR)),
  (9, 'Booked',            'Chennai Hub',         'Shipment booked',                             DATE_SUB(NOW(), INTERVAL 20 HOUR)),
  (9, 'In Transit',        'Ahmedabad Hub',       'Package in transit',                          DATE_SUB(NOW(), INTERVAL 10 HOUR)),
  (10,'Booked',            'Chennai Hub',         'Express booking confirmed',                   DATE_SUB(NOW(), INTERVAL 30 HOUR)),
  (10,'Delayed',           'System',              'Strike at sorting facility',                  DATE_SUB(NOW(), INTERVAL 20 HOUR));


-- ── 10. Deliveries ───────────────────────────────────────────────────────────
INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status, recipient_signature, notes) VALUES
  (3, 3, DATE_SUB(NOW(), INTERVAL 2 HOUR),  'Successful', 'Raj Sharma',  'Delivered at gate'),
  (7, 6, DATE_SUB(NOW(), INTERVAL 2 HOUR),  'Successful', 'Neha Singh',  'SLA breached — 2h late. Left at door.');


-- ── 11. Delay Logs ───────────────────────────────────────────────────────────
INSERT INTO delay_logs (shipment_id, delay_reason, reported_at) VALUES
  (4,  'Weather disruption — heavy rain on NH-8',              DATE_SUB(NOW(), INTERVAL 60 HOUR)),
  (10, 'Labour strike at sorting facility in Chennai',         DATE_SUB(NOW(), INTERVAL 20 HOUR)),
  (15, 'Incorrect address — re-routing required',              DATE_SUB(NOW(), INTERVAL 5 HOUR));


-- ── 12. Shipment Hubs ────────────────────────────────────────────────────────
INSERT INTO shipment_hubs (shipment_id, hub_id, visit_id, arrival_time, departure_time, status) VALUES
  (1, 1, 1, DATE_SUB(NOW(), INTERVAL 3 HOUR),  DATE_SUB(NOW(), INTERVAL 2 HOUR), 'Departed'),
  (3, 1, 1, DATE_SUB(NOW(), INTERVAL 14 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR),'Departed'),
  (3, 2, 1, DATE_SUB(NOW(), INTERVAL 10 HOUR), DATE_SUB(NOW(), INTERVAL 7 HOUR), 'Departed'),
  (5, 4, 1, DATE_SUB(NOW(), INTERVAL 6 HOUR),  NULL,                             'Processing'),
  (9, 5, 1, DATE_SUB(NOW(), INTERVAL 18 HOUR), DATE_SUB(NOW(), INTERVAL 12 HOUR),'Departed');


-- ── 13. Audit Logs (usually auto-generated by trigger — adding samples) ───────
INSERT INTO audit_logs (user_id, action, table_name, record_id) VALUES
  (1, 'UPDATE_SHIPMENT', 'shipments', 1),
  (1, 'UPDATE_SHIPMENT', 'shipments', 5),
  (2, 'UPDATE_SHIPMENT', 'shipments', 9),
  (1, 'DELETE_SHIPMENT', 'shipments', 15),
  (2, 'UPDATE_SHIPMENT', 'shipments', 3);


-- ── 14. Delivery Failures ────────────────────────────────────────────────────
--  These are shipments where courier could NOT deliver (customer absent, etc.)
INSERT INTO delivery_failures (shipment_id, attempt_number, failure_reason, retry_scheduled, resolved) VALUES
  (4,  1, 'Customer not home during scheduled delivery window',  DATE_ADD(NOW(), INTERVAL 1 DAY),  FALSE),
  (4,  2, 'Gate locked — no buzzer response after 10 minutes',  DATE_ADD(NOW(), INTERVAL 2 DAY),  FALSE),
  (8,  1, 'Building access denied — no entry pass available',   DATE_ADD(NOW(), INTERVAL 1 DAY),  FALSE),
  (10, 1, 'Incorrect floor number — unable to locate recipient',NULL,                              FALSE),
  (12, 1, 'Recipient refused delivery — said wrong item',       NULL,                              FALSE),
  (15, 1, 'Address incomplete — landmark missing',              DATE_ADD(NOW(), INTERVAL 1 DAY),  FALSE),
  (6,  1, 'Courier met with minor accident — rescheduled',      DATE_ADD(NOW(), INTERVAL 2 DAY),  TRUE);
  -- resolved=TRUE  → eligible for physical DELETE via DELETE /api/delivery-failures/:id


-- ── 15. Damage Logs ──────────────────────────────────────────────────────────
--  Reports filed by staff when packages are found damaged
--  reported_by = user_id of staff (2 = staff_priya, 3 = staff_rahul, 1 = admin_raj)
INSERT INTO damage_logs (shipment_id, damage_description, reported_by, severity) VALUES
  (2,  'Outer carton severely dented — inner product intact after inspection', 2, 'Minor'),
  (5,  'Water seepage from sorting facility — packaging soaked',               2, 'Major'),
  (9,  'Package torn open at seam — electronic components exposed',            3, 'Critical'),
  (11, 'Corner impact damage — fragile sticker ignored, glass cracked',        3, 'Major'),
  (13, 'Label partially detached — risk of mis-delivery, re-labelled at hub',  1, 'Minor'),
  (14, 'Parcel arrived open — contents intact, taped and sealed at Pune Hub',  2, 'Minor'),
  (15, 'Significant crush damage — product likely unusable, customer notified',3, 'Critical');
