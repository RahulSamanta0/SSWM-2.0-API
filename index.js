import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Auth Routes
import authRoutes from './routes/auth/authRoutes.js';

// Block Admin Routes
import blockDashboardRoutes from './routes/block/dashboardRoutes.js';
import blockReportsRoutes from './routes/block/reportsRoutes.js';
import blockGpMunicipalityRoutes from './routes/block/gpMunicipalityRoutes.js';
import blockVehiclesRoutes from './routes/block/vehiclesRoutes.js';
import blockDumpYardsRoutes from './routes/block/dumpYardsRoutes.js';

// District Admin Routes
import districtBlocksMunRoutes from './routes/district/blocksMunicipalitiesRoutes.js';
import districtBlockAdminsRoutes from './routes/district/blockAdminsRoutes.js';
import districtVehiclesRoutes from './routes/district/vehiclesRoutes.js';
import districtWasteOperationsRoutes from './routes/district/wasteOperationsRoutes.js';
import districtDumpYardRoutes from './routes/district/dumpYardRoutes.js';
import districtReportsRoutes from './routes/district/reportsRoutes.js';

// GP/Municipality Admin Routes
import gpDashboardRoutes from './routes/gp/dashboardRoutes.js';
import gpCollectorsRoutes from './routes/gp/collectorsRoutes.js';
import gpRoutesRoutes from './routes/gp/routesRoutes.js';
import gpCollectionTrackingRoutes from './routes/gp/collectionTrackingRoutes.js';
import gpSegregationReportsRoutes from './routes/gp/segregationReportsRoutes.js';
import gpDumpMonitoringRoutes from './routes/gp/dumpMonitoringRoutes.js';
import gpVendorCoordinationRoutes from './routes/gp/vendorCoordinationRoutes.js';
import gpReportsRoutes from './routes/gp/reportsRoutes.js';
import gpHouseholdsRoutes from './routes/gp/householdsRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',               // allow all origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false         // MUST be false when origin is '*'
}));

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

// ======================================================================================
// API ROUTES
// ======================================================================================

// Auth (Public)
app.use('/api/auth', authRoutes);

// Block Admin Routes (require block_admin role)
app.use('/api/block/dashboard', blockDashboardRoutes);
app.use('/api/block/reports', blockReportsRoutes);
app.use('/api/block/gp-municipality', blockGpMunicipalityRoutes);
app.use('/api/block/vehicles', blockVehiclesRoutes);
app.use('/api/block/dump-yards', blockDumpYardsRoutes);

// District Admin Routes (require district_admin role)
app.use('/api/district/blocks-municipalities', districtBlocksMunRoutes);
app.use('/api/district/block-admins', districtBlockAdminsRoutes);
app.use('/api/district/vehicles', districtVehiclesRoutes);
app.use('/api/district/waste-operations', districtWasteOperationsRoutes);
app.use('/api/district/dump-yard', districtDumpYardRoutes);
app.use('/api/district/reports', districtReportsRoutes);

// GP/Municipality Admin Routes (require gp_admin or municipality_admin role)
app.use('/api/gp/dashboard', gpDashboardRoutes);
app.use('/api/gp/collectors', gpCollectorsRoutes);
app.use('/api/gp/routes', gpRoutesRoutes);
app.use('/api/gp/collection-tracking', gpCollectionTrackingRoutes);
app.use('/api/gp/segregation-reports', gpSegregationReportsRoutes);
app.use('/api/gp/dump-monitoring', gpDumpMonitoringRoutes);
app.use('/api/gp/vendor-coordination', gpVendorCoordinationRoutes);
app.use('/api/gp/reports', gpReportsRoutes);
app.use('/api/gp/households', gpHouseholdsRoutes);

// ======================================================================================
// ERROR HANDLERS
// ======================================================================================

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
