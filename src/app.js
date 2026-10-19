const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shipmentRoutes = require('./routes/shipmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/orders', orderRoutes);
app.use('/api/shipments', shipmentRoutes);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Basic route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Ecommerce API is running'
    });
});

app.get('/health', async (req, res) => {
    try {
        const prisma = require('./config/prisma');

        await prisma.$queryRaw`SELECT 1`;

        return res.status(200).json({
            status: 'healthy',
            database: 'connected'
        });

    } catch (error) {
        return res.status(503).json({
            status: 'unhealthy',
            database: 'disconnected'
        });
    }
});
module.exports = app;