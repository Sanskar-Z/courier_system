require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/auth.routes');
const shipmentRoutes = require('./routes/shipment.routes');
const trackingRoutes = require('./routes/tracking.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const hubsRoutes = require('./routes/hubs.routes');
const couriersRoutes = require('./routes/couriers.routes');
const employeesRoutes = require('./routes/employees.routes');

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
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
