import pool from '../../config/database.js';

/**
 * Get GP Dashboard Overview
 * Comprehensive dashboard data for GP/Municipality admin
 */
export const getGpDashboardOverviewService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_gp_dashboard_overview(?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId]
        );

        // Validate result structure
        if (!rows || rows.length < 7) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_gp_dashboard_overview may not be loaded'
            };
        }

        const stats = rows[0]?.[0] || {};
        const collectionProgress = rows[1] || [];
        const recentActivities = rows[2] || [];
        const weeklyTrend = rows[3] || [];
        const wasteDistribution = rows[4] || [];
        const topCollectors = rows[5] || [];
        const result = rows[7]?.[0]; // OUT parameters at index 7

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
                    totalHouseholds: stats.total_households || 0,
                    totalCollectors: stats.total_collectors || 0,
                    totalRoutes: stats.total_routes || 0,
                    todaysCollection: stats.todays_collection || 0,
                    segregationRate: parseFloat(stats.segregation_rate) || 0,
                    activeAlerts: stats.active_alerts || 0
                },
                collectionProgress: collectionProgress.map(row => ({
                    routeId: row.route_id,
                    routeName: row.route_name,
                    totalHouses: row.total_houses || 0,
                    collectedToday: row.collected_today || 0,
                    completionPct: parseFloat(row.completion_pct) || 0,
                    collectorName: row.collector_name || 'Unassigned',
                    collectorStatus: row.collector_status || 'inactive'
                })),
                recentActivities: recentActivities.map(row => ({
                    id: row.id,
                    type: row.type,
                    message: row.message,
                    timestamp: row.timestamp,
                    status: row.status,
                    wasteKg: parseFloat(row.waste_kg) || 0
                })),
                quickAnalytics: {
                    weeklyTrend: weeklyTrend.map(row => ({
                        date: row.date,
                        day: row.day.substring(0, 3), // Mon, Tue, etc.
                        kg: parseFloat(row.total_kg) || 0,
                        houses: row.houses_collected || 0
                    })),
                    wasteDistribution: wasteDistribution.map(row => ({
                        category: row.category,
                        kg: parseFloat(row.kg) || 0,
                        percentage: parseInt(row.percentage) || 0
                    })),
                    topCollectors: topCollectors.map(row => ({
                        collectorName: row.collector_name,
                        collectionsCount: row.collections_count || 0,
                        totalWasteKg: parseFloat(row.total_waste_kg) || 0,
                        rating: parseFloat(row.rating) || 0
                    }))
                }
            }
        };

    } catch (error) {
        console.error('GP Dashboard service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching dashboard data',
            error: error.message
        };
    }
};
