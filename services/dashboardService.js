import pool from '../config/database.js';

/**
 * Get Dashboard Overview
 * Returns complete dashboard data in one call
 */
export const getDashboardOverviewService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_dashboard_overview(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId]
        );

        // Validate result structure
        if (!rows || rows.length < 6) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_dashboard_overview may not be loaded'
            };
        }

        const stats = rows[0]?.[0] || {};
        const gpData = rows[1] || [];
        const municipalityData = rows[2] || [];
        const recentActivities = rows[3] || [];
        const result = rows[5]?.[0]; // OUT parameters at index 5

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve dashboard data'
            };
        }

        return {
            error_code: 0,
            message: 'Dashboard data retrieved successfully',
            data: {
                stats: {
                    totalGPs: stats.total_gps || 0,
                    totalMunicipalities: stats.total_municipalities || 0,
                    activeCollectors: stats.active_collectors || 0,
                    todaysCollection: parseFloat(stats.todays_collection) || 0,
                    avgEfficiency: parseFloat(stats.avg_efficiency) || 0,
                    totalHouseholds: stats.total_households || 0,
                    totalVehicles: stats.total_vehicles || 0,
                    totalAlerts: stats.total_alerts || 0
                },
                quickAnalytics: {
                    wasteProcessed: {
                        value: parseFloat(stats.todays_collection) || 0,
                        percentageChange: 10.2, // TODO: Calculate from yesterday's data
                        trend: 'up'
                    },
                    dumpYardUsage: {
                        percentage: parseFloat(stats.avg_efficiency) || 0,
                        status: parseFloat(stats.avg_efficiency) >= 80 ? 'Good' : parseFloat(stats.avg_efficiency) >= 60 ? 'Fair' : 'Poor'
                    },
                    routesCompleted: {
                        completed: gpData.filter(gp => parseFloat(gp.collection) > 0).length + municipalityData.filter(m => parseFloat(m.collection) > 0).length,
                        total: gpData.length + municipalityData.length,
                        percentage: gpData.length + municipalityData.length > 0
                            ? ((gpData.filter(gp => parseFloat(gp.collection) > 0).length + municipalityData.filter(m => parseFloat(m.collection) > 0).length) / (gpData.length + municipalityData.length) * 100).toFixed(1)
                            : 0
                    },
                    scheduledTasks: {
                        count: stats.total_alerts || 0
                    }
                },
                gpData: gpData.map(gp => ({
                    id: gp.id,
                    name: gp.name,
                    collectors: gp.collectors || 0,
                    collection: parseFloat(gp.collection) || 0,
                    efficiency: parseFloat(gp.efficiency) || 0,
                    status: gp.status,
                    vehicles: gp.vehicles || 0,
                    routes: gp.routes || 0,
                    alerts: gp.alerts || 0,
                    trend: gp.trend,
                    households: gp.households || 0
                })),
                municipalityData: municipalityData.map(m => ({
                    id: m.id,
                    name: m.name,
                    collectors: m.collectors || 0,
                    collection: parseFloat(m.collection) || 0,
                    efficiency: parseFloat(m.efficiency) || 0,
                    status: m.status,
                    vehicles: m.vehicles || 0,
                    routes: m.routes || 0,
                    alerts: m.alerts || 0,
                    trend: m.trend,
                    households: m.households || 0
                })),
                gpChartData: gpData.map(gp => ({
                    name: gp.name,
                    collection: parseFloat(gp.collection) || 0
                })),
                municipalityChartData: municipalityData.map(m => ({
                    name: m.name,
                    collection: parseFloat(m.collection) || 0
                })),
                recentActivities: recentActivities.map(activity => ({
                    id: activity.id,
                    type: activity.type,
                    locationName: activity.location_name,
                    locationType: activity.location_type,
                    message: activity.message,
                    timestamp: activity.timestamp,
                    status: activity.status
                }))
            }
        };

    } catch (error) {
        console.error('Get dashboard overview service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching dashboard data',
            error: error.message
        };
    }
};
