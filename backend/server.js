const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import configurations
const { connectDB, sequelize } = require('./config/db');
const corsOptions = require('./config/corsConfig');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

// Import routes
const authRoutes = require('./routes/auth.routes');
const motherRoutes = require('./routes/mother.routes');
const maternalRecordRoutes = require('./routes/maternalRecord.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const vaccinationRoutes = require('./routes/vaccination.routes');
const thriposhaRoutes = require('./routes/thriposha.routes');
const clinicRoutes = require('./routes/clinic.routes');
const notificationRoutes = require('./routes/notification.routes');
const providerRoutes = require('./routes/provider.routes');
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require('./routes/admin.routes');

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(logger);

// Static files (for uploads)
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mothers', motherRoutes);
app.use('/api/records', maternalRecordRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/vaccinations', vaccinationRoutes);
app.use('/api/thriposha', thriposhaRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Pearl MOM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: sequelize.authenticate() ? 'connected' : 'disconnected'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;