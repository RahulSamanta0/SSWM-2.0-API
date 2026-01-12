import pool from '../../config/database.js';

/**
 * Get collection tracking statistics
 */
export const getCollectionTrackingStatsService = async (userId, date) => {
    try {
        const targetDate = date || new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            `CALL sp_get_collection_tracking_stats(?, ?, @total_routes, @total_collected, @overall_completion_pct, @total_households, @error, @msg);
             SELECT @total_routes as total_routes, @total_collected as total_collected, @overall_completion_pct as overall_completion_pct, @total_households as total_households, @error as error_code, @msg as message;`,
            [userId, targetDate]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve collection tracking stats');
        }

        return {
            totalRoutes: result.total_routes || 0,
            totalCollected: result.total_collected || 0,
            overallCompletionPct: parseFloat(result.overall_completion_pct) || 0,
            totalHouseholds: result.total_households || 0
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get route-wise collection data
 */
export const getCollectionTrackingRoutesService = async (userId, date, search) => {
    try {
        const targetDate = date || new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            `CALL sp_get_collection_tracking_routes(?, ?, ?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId, targetDate, search]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve collection tracking routes');
        }

        // routes data is in rows[0]
        const routes = rows[0] || [];

        return routes.map(route => ({
            id: route.id,
            routeName: route.route_name,
            routeCode: route.route_code,
            totalHouseholds: route.total_households || 0,
            collectedCount: route.collected_count || 0,
            completionPct: parseFloat(route.completion_pct) || 0
        }));
    } catch (error) {
        throw error;
    }
};
