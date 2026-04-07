-- Database: courier_system
DROP DATABASE IF EXISTS courier_system;
CREATE DATABASE courier_system;
USE courier_system;

-- 1. users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'staff', 'customer') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. customers
CREATE TABLE customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    address TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. sla (Service Level Agreement policies)
CREATE TABLE sla (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_type VARCHAR(50) NOT NULL UNIQUE,
    max_delivery_hours INT NOT NULL,
    description TEXT
);

-- 4. hubs
CREATE TABLE hubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location TEXT NOT NULL,
    capacity INT DEFAULT 0
);

-- 5. employees
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    hub_id INT,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (hub_id) REFERENCES hubs(id) ON DELETE SET NULL
);

-- 6. couriers
CREATE TABLE couriers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50),
    contact_number VARCHAR(20) NOT NULL,
    status ENUM('Active', 'Inactive', 'On Leave') DEFAULT 'Active',
    current_hub_id INT,
    FOREIGN KEY (current_hub_id) REFERENCES hubs(id) ON DELETE SET NULL
);

-- 7. shipments
CREATE TABLE shipments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tracking_no VARCHAR(50) UNIQUE,
    customer_id INT NOT NULL,
    courier_id INT,
    sender_name VARCHAR(100) NOT NULL,
    sender_address TEXT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_address TEXT NOT NULL,
    weight DECIMAL(10,2) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    sla_id INT NOT NULL,
    base_charge DECIMAL(10,2) DEFAULT 0,
    expected_delivery_date DATETIME,
    is_sla_breached BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE SET NULL,
    FOREIGN KEY (sla_id) REFERENCES sla(id)
);

-- 8. shipment_status
CREATE TABLE shipment_status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL UNIQUE,
    current_state ENUM('Booked', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'Delayed', 'Failed') DEFAULT 'Booked',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- 9. tracking_events
CREATE TABLE tracking_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    status ENUM('Booked', 'In Transit', 'Arrived at Hub', 'Out for Delivery', 'Delivered', 'Delayed', 'Failed') NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT,
    event_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- 10. deliveries
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL UNIQUE,
    courier_id INT NOT NULL,
    delivery_time DATETIME,
    status ENUM('Pending', 'Successful', 'Failed') DEFAULT 'Pending',
    recipient_signature TEXT,
    notes TEXT,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE CASCADE
);

-- 11. delay_logs
CREATE TABLE delay_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id INT NOT NULL,
    delay_reason TEXT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- 12. audit_logs
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 13. shipment_hubs
CREATE TABLE shipment_hubs (
    shipment_id INT NOT NULL,
    hub_id INT NOT NULL,
    arrival_time DATETIME,
    departure_time DATETIME,
    PRIMARY KEY (shipment_id, hub_id),
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (hub_id) REFERENCES hubs(id) ON DELETE CASCADE
);

-- INDEXES
CREATE INDEX idx_tracking_no ON shipments(tracking_no);
CREATE INDEX idx_shipment_customer ON shipments(customer_id);
CREATE INDEX idx_events_shipment ON tracking_events(shipment_id);

-- --------------------------------------------------------------------------------------
-- STORED PROCEDURES
-- --------------------------------------------------------------------------------------

DELIMITER //

-- Procedure 1: Create Shipment (auto tracking number)
CREATE PROCEDURE sp_create_shipment(
    IN p_customer_id INT,
    IN p_sender_name VARCHAR(100),
    IN p_sender_address TEXT,
    IN p_receiver_name VARCHAR(100),
    IN p_receiver_address TEXT,
    IN p_weight DECIMAL(10,2),
    IN p_service_type VARCHAR(50),
    OUT p_shipment_id INT,
    OUT p_tracking_no VARCHAR(50)
)
BEGIN
    DECLARE v_sla_id INT;
    DECLARE v_max_hours INT;
    DECLARE v_charges DECIMAL(10,2);
    
    -- Get SLA info
    SELECT id, max_delivery_hours INTO v_sla_id, v_max_hours FROM sla WHERE service_type = p_service_type LIMIT 1;
    
    IF v_sla_id IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Invalid Service Type';
    END IF;

    -- Generate tracking number
    SET p_tracking_no = CONCAT('TRK', DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), FLOOR(RAND() * 1000));
    
    -- Calculate expected delivery
    SET @expected = DATE_ADD(NOW(), INTERVAL v_max_hours HOUR);

    -- Insert DB
    INSERT INTO shipments (
        tracking_no, customer_id, sender_name, sender_address, receiver_name, receiver_address, 
        weight, service_type, sla_id, expected_delivery_date
    ) VALUES (
        p_tracking_no, p_customer_id, p_sender_name, p_sender_address, p_receiver_name, p_receiver_address, 
        p_weight, p_service_type, v_sla_id, @expected
    );
    
    SET p_shipment_id = LAST_INSERT_ID();
    
    -- Calculate base charges
    CALL sp_calculate_charges(p_shipment_id, v_charges);
    UPDATE shipments SET base_charge = v_charges WHERE id = p_shipment_id;
    
    -- Init status
    INSERT INTO shipment_status (shipment_id, current_state) VALUES (p_shipment_id, 'Booked');

END //

-- Procedure 2: Calculate Charges
CREATE PROCEDURE sp_calculate_charges(
    IN p_shipment_id INT,
    OUT p_total_charge DECIMAL(10,2)
)
BEGIN
    DECLARE v_weight DECIMAL(10,2);
    DECLARE v_service VARCHAR(50);
    DECLARE v_rate DECIMAL(10,2);
    
    SELECT weight, service_type INTO v_weight, v_service FROM shipments WHERE id = p_shipment_id;
    
    IF v_service = 'Standard' THEN SET v_rate = 5.0;
    ELSEIF v_service = 'Express' THEN SET v_rate = 10.0;
    ELSEIF v_service = 'Overnight' THEN SET v_rate = 20.0;
    ELSE SET v_rate = 5.0;
    END IF;
    
    SET p_total_charge = v_weight * v_rate;
END //

-- Procedure 3: SLA Evaluation
CREATE PROCEDURE sp_evaluate_sla(
    IN p_shipment_id INT,
    OUT p_is_breached BOOLEAN
)
BEGIN
    DECLARE v_expected DATETIME;
    DECLARE v_actual DATETIME;
    
    SELECT expected_delivery_date INTO v_expected FROM shipments WHERE id = p_shipment_id;
    SELECT delivery_time INTO v_actual FROM deliveries WHERE shipment_id = p_shipment_id LIMIT 1;
    
    IF v_actual > v_expected THEN
        SET p_is_breached = TRUE;
        UPDATE shipments SET is_sla_breached = TRUE WHERE id = p_shipment_id;
    ELSE
        SET p_is_breached = FALSE;
    END IF;
END //

-- Procedure 4: Delay Calculation
CREATE PROCEDURE sp_calculate_delay(
    IN p_shipment_id INT,
    IN p_reason TEXT
)
BEGIN
    INSERT INTO delay_logs (shipment_id, delay_reason) VALUES (p_shipment_id, p_reason);
    
    -- Extent expected delivery by 24h as policy
    UPDATE shipments 
    SET expected_delivery_date = DATE_ADD(expected_delivery_date, INTERVAL 24 HOUR)
    WHERE id = p_shipment_id;
    
    -- Insert Tracking event
    INSERT INTO tracking_events (shipment_id, status, location, description) 
    VALUES (p_shipment_id, 'Delayed', 'System', p_reason);
END //

DELIMITER ;

-- --------------------------------------------------------------------------------------
-- TRIGGERS
-- --------------------------------------------------------------------------------------

DELIMITER //

-- Trigger 1: Auto insert into audit_logs on update shipments
CREATE TRIGGER trg_audit_shipment_update
AFTER UPDATE ON shipments
FOR EACH ROW
BEGIN
    IF OLD.tracking_no != NEW.tracking_no OR OLD.courier_id != NEW.courier_id THEN
        INSERT INTO audit_logs (user_id, action, table_name, record_id)
        VALUES (NULL, 'UPDATE_SHIPMENT', 'shipments', NEW.id);
    END IF;
END //

-- Trigger 2: Update shipment_status when tracking_event inserted
CREATE TRIGGER trg_update_shipment_status_on_event
AFTER INSERT ON tracking_events
FOR EACH ROW
BEGIN
    UPDATE shipment_status 
    SET current_state = NEW.status 
    WHERE shipment_id = NEW.shipment_id;
END //

-- Trigger 3: Auto mark SLA breach
CREATE TRIGGER trg_auto_mark_sla_breach_on_delivery
AFTER UPDATE ON deliveries
FOR EACH ROW
BEGIN
    DECLARE is_breach BOOLEAN;
    IF NEW.status = 'Successful' AND OLD.status != 'Successful' THEN
        CALL sp_evaluate_sla(NEW.shipment_id, is_breach);
        
        -- Logging tracking event for delivery
        INSERT INTO tracking_events (shipment_id, status, location, description) 
        VALUES (NEW.shipment_id, 'Delivered', 'Final Destination', 'Shipment successfully delivered');
    END IF;
END //

DELIMITER ;
