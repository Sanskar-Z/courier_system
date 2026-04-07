# Courier Shipment Tracking & Delivery SLA System

A complete end-to-end logistics platform ensuring real-world shipment lifecycle tracking, role-based workflows, and automated SLA breach detection.

## Structure
- `database/`: Contains MySQL schemas and procedure/trigger definitions up to 3NF, alongside a comprehensive seed file.
- `backend/`: Node.js Express API.
- `frontend/`: React Vite Tailwind SPA.

## Running Locally

1. **Database:**
   - Execute `database/schema.sql` in MySQL.
   - Execute `database/seed.sql` to populate sample users (admin1/password123, customer1/password123), SLAs, and complete shipment lifecycles.

2. **Backend:**
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## Features Demonstrated
1. **Triggers:** Auto SLA evaluation on successful delivery. Auto shipment current state update on tracking events.
2. **Procedures:** Auto tracking number generation and ETA calculation based on rigorous SLA logic.
3. **Roles:** Admin/Staff portal for visualization (Recharts), Customer dashboard for tracking.
4. **Normalized Database:** Over 12 interdependent entities properly constrained by foreign keys and indices.
