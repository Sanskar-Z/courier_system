-- Seed data for Courier System

-- 1. SLA Data
INSERT INTO sla (service_type, max_delivery_hours, description) VALUES
('Standard', 72, 'Standard 3-day delivery via land transport.'),
('Express', 24, 'Next day delivery via air.'),
('Overnight', 12, 'Overnight priority delivery within region.');

-- 2. Hubs
INSERT INTO hubs (name, location, capacity) VALUES
('NYC Central Hub', 'New York, NY', 10000),
('LA Transit Hub', 'Los Angeles, CA', 8000),
('Chicago Main Hub', 'Chicago, IL', 5000);

-- 3. Users & Profiles (Admin, Customers, Staff)
-- Passwords are 'password123' hashed with bcrypt (rounds 10)
INSERT INTO users (username, password_hash, role) VALUES
('admin1', '$2b$10$wT5gKjW1aV3.E.kK25Nzx.Z0aN8c9MhZ7uU.9vPzT8Z9.C8Y.X0mS', 'admin'),
('courier_john', '$2b$10$wT5gKjW1aV3.E.kK25Nzx.Z0aN8c9MhZ7uU.9vPzT8Z9.C8Y.X0mS', 'staff'),
('customer_alice', '$2b$10$wT5gKjW1aV3.E.kK25Nzx.Z0aN8c9MhZ7uU.9vPzT8Z9.C8Y.X0mS', 'customer'),
('customer_bob', '$2b$10$wT5gKjW1aV3.E.kK25Nzx.Z0aN8c9MhZ7uU.9vPzT8Z9.C8Y.X0mS', 'customer');

INSERT INTO employees (user_id, hub_id, role) VALUES
(1, 1, 'Manager'),
(2, 1, 'Courier Coordinator');

INSERT INTO customers (user_id, full_name, phone, email, address) VALUES
(3, 'Alice Smith', '555-0101', 'alice@example.com', '123 Apple St, NY'),
(4, 'Bob Johnson', '555-0202', 'bob@example.com', '456 Banana Rd, CA');

-- 4. Couriers
INSERT INTO couriers (name, vehicle_type, contact_number, status, current_hub_id) VALUES
('John Doe', 'Van', '555-1001', 'Active', 1),
('Jane Roe', 'Truck', '555-1002', 'Active', 2);

-- 5. Complete Shipment Lifecycle Example 1 (Successful & SLA Met)
-- Created via stored procedure to auto-generate tracking and dates
CALL sp_create_shipment(
    1, -- customer_alice (customer ID 1)
    'Alice Smith', '123 Apple St, NY',
    'Eve Adams', '789 Cherry Blvd, MI',
    10.5, 'Express',
    @ship_id_1, @trk_1
);
-- Assign Courier
UPDATE shipments SET courier_id = 1 WHERE id = @ship_id_1;
-- Add Tracking Event (In Transit)
INSERT INTO tracking_events (shipment_id, status, location, description)
VALUES (@ship_id_1, 'In Transit', 'NYC Central Hub', 'Package picked up and sorted.');
-- Hub linking
INSERT INTO shipment_hubs (shipment_id, hub_id, arrival_time, departure_time)
VALUES (@ship_id_1, 1, NOW(), DATE_ADD(NOW(), INTERVAL 2 HOUR));
-- Add Tracking Event (Out for Delivery)
INSERT INTO tracking_events (shipment_id, status, location, description)
VALUES (@ship_id_1, 'Out for Delivery', 'MI Local Hub', 'Out for final delivery.');
-- Update Delivery to signal completion (triggers SLA evaluation)
INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status, recipient_signature, notes)
VALUES (@ship_id_1, 1, DATE_ADD(NOW(), INTERVAL 5 HOUR), 'Successful', 'Eve A.', 'Left at front door.');

-- 6. Complete Shipment Lifecycle Example 2 (Delayed & SLA Breached)
CALL sp_create_shipment(
    2, -- customer_bob (customer ID 2)
    'Bob Johnson', '456 Banana Rd, CA',
    'Charlie Brown', '321 Dogwood Ln, IL',
    25.0, 'Overnight',
    @ship_id_2, @trk_2
);
-- Assign Courier
UPDATE shipments SET courier_id = 2 WHERE id = @ship_id_2;
-- In transit
INSERT INTO tracking_events (shipment_id, status, location, description)
VALUES (@ship_id_2, 'In Transit', 'LA Transit Hub', 'Left facility.');
-- Report Delay
CALL sp_calculate_delay(@ship_id_2, 'Severe weather conditions delayed flight.');
-- Delivery happened very late
INSERT INTO deliveries (shipment_id, courier_id, delivery_time, status, recipient_signature, notes)
VALUES (@ship_id_2, 2, DATE_ADD(NOW(), INTERVAL 48 HOUR), 'Successful', 'C. Brown', 'Finally delivered.');

