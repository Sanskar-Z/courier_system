-- Run this file to add the missing tables to an EXISTING database
-- WITHOUT dropping and recreating everything.
-- Use this instead of re-running schema.sql if you already have data.

USE courier_system;

-- Add delivery_failures table if it doesn't exist
CREATE TABLE IF NOT EXISTS delivery_failures (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id     INT NOT NULL,
    attempt_number  INT NOT NULL DEFAULT 1,
    failure_reason  TEXT NOT NULL,
    retry_scheduled DATETIME,
    resolved        BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE
);

-- Add damage_logs table if it doesn't exist
CREATE TABLE IF NOT EXISTS damage_logs (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    shipment_id         INT NOT NULL,
    damage_description  TEXT NOT NULL,
    reported_by         INT,
    severity            ENUM('Minor', 'Major', 'Critical') DEFAULT 'Minor',
    reported_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Verify both tables now exist
SHOW TABLES LIKE 'delivery_failures';
SHOW TABLES LIKE 'damage_logs';
