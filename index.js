import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import householdRoutes from './routes/householdRoutes.js';
import gpMunicipalityRoutes from './routes/gpMunicipalityRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import dumpYardRoutes from './routes/dumpYardRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import gpCollectorsRoutes from './routes/gpCollectorsRoutes.js';
import gpRoutesRoutes from './routes/gpRoutesRoutes.js';
import gpCollectionTrackingRoutes from './routes/gpCollectionTrackingRoutes.js';
import gpSegregationReportsRoutes from './routes/gpSegregationReportsRoutes.js';
import gpDumpMonitoringRoutes from './routes/gpDumpMonitoringRoutes.js';
import gpVendorCoordinationRoutes from './routes/gpVendorCoordinationRoutes.js';
import gpReportsRoutes from './routes/gpReportsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/gp-municipality', gpMunicipalityRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dump-yards', dumpYardRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gp/collectors', gpCollectorsRoutes);
app.use('/api/gp/routes', gpRoutesRoutes);
app.use('/api/gp/collection-tracking', gpCollectionTrackingRoutes);
app.use('/api/gp/segregation-reports', gpSegregationReportsRoutes);
app.use('/api/gp/dump-monitoring', gpDumpMonitoringRoutes);
app.use('/api/gp/vendor-coordination', gpVendorCoordinationRoutes);
app.use('/api/gp/reports', gpReportsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    statusCode: 404
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    statusCode: 500,
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Smart Waste Management System - Backend API     ║
╠════════════════════════════════════════════════════╣
║   Server running on port: ${PORT.toString().padEnd(30)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(35)}║
║   Database: ${(process.env.DB_NAME || '').padEnd(38)}║
╚════════════════════════════════════════════════════╝
    `);
});

export default app;
