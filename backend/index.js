import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();

import authRoutes from './routes/auth.routes.js';
import shipmentRoutes from './routes/shipment.routes.js';
import trackingRoutes from './routes/tracking.routes.js';
import deliveryRoutes from './routes/delivery.routes.js';
import hubsRoutes from './routes/hubs.routes.js';
import couriersRoutes from './routes/couriers.routes.js';
import employeesRoutes from './routes/employees.routes.js';

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/hubs', hubsRoutes);
app.use('/api/couriers', couriersRoutes);
app.use('/api/employees', employeesRoutes);

app.get('/', (req, res) => res.json({ message: 'Courier System API' }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Internal Server Error', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
