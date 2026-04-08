-- Create admin user manually
-- Run this in your MySQL database

INSERT INTO users (username, password_hash, role) VALUES
('admin1', '$2b$10$wT5gKjW1aV3.E.kK25Nzx.Z0aN8c9MhZ7uU.9vPzT8Z9.C8Y.X0mS', 'admin')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);

-- Also create SLA entries if missing
INSERT INTO sla (service_type, max_delivery_hours, description) VALUES
('Standard', 72, 'Standard 3-day delivery via land transport.'),
('Express', 24, 'Next day delivery via air.'),
('Overnight', 12, 'Overnight priority delivery within region.')
ON DUPLICATE KEY UPDATE max_delivery_hours = VALUES(max_delivery_hours);