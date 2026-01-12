import pool from '../../config/database.js';

/**
 * Get route statistics for dashboard
 */
export const getRoutesStatsService = async (userId) => {
    try {
        console.log('DEBUG: getRoutesStatsService called with userId:', userId);
        const [rows] = await pool.query(
            `CALL sp_get_gp_routes_stats(?, @total_routes, @total_collectors, @total_households, @avg_households, @error_code, @message);
       SELECT @total_routes as total_routes, @total_collectors as total_collectors, @total_households as total_households, @avg_households as avg_households, @error_code as error_code, @message as message;`,
            [userId]
        );
        console.log('DEBUG: DB Raw Rows:', JSON.stringify(rows, null, 2));

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve route statistics');
        }

        return {
            totalRoutes: result.total_routes || 0,
            totalCollectors: result.total_collectors || 0,
            totalHouseholds: result.total_households || 0,
            avgHouseholds: parseFloat(result.avg_households) || 0
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get paginated list of routes
 */
export const getRoutesListService = async (userId, search, page, pageSize) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_gp_routes_list(?, ?, ?, ?, @total_records, @timestamp, @error_code, @message);
       SELECT @total_records as total_records, @timestamp as timestamp, @error_code as error_code, @message as message;`,
            [userId, search, page, pageSize]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve routes list');
        }

        // results[0] contains the routes list
        const routes = rows[0] || [];

        return {
            routes: routes.map(route => ({
                id: route.id,
                routeName: route.route_name,
                routeCode: route.route_code,
                wards: route.wards || '',
                collectorName: route.collector_name || 'Unassigned',
                collectorUserId: route.collector_user_id,
                householdCount: route.household_count || 0,
                createdAt: route.created_at
            })),
            totalRecords: result.total_records || 0,
            timestamp: result.timestamp
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Create a new route
 */
export const createRouteService = async (userId, routeName, houseIds, collectorId) => {
    try {
        // Convert houseIds array to JSON string
        const houseIdsJson = houseIds && houseIds.length > 0 ? JSON.stringify(houseIds) : null;

        const [rows] = await pool.query(
            `CALL sp_create_gp_route(?, ?, NULL, ?, ?, @route_id, @error_code, @message);
       SELECT @route_id as route_id, @error_code as error_code, @message as message;`,
            [userId, routeName, houseIdsJson, collectorId]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to create route');
        }

        return {
            routeId: result.route_id,
            message: result.message
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get distinct wards for dropdown
 */
export const getWardsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            'CALL sp_get_gp_wards(?)',
            [userId]
        );

        // results[0] contains the wards list
        const wards = rows[0] || [];

        return wards.map(w => w.ward_number);
    } catch (error) {
        throw error;
    }
};

/**
 * Get houses in a specific ward for dropdown
 */
export const getHousesByWardService = async (userId, wardNumber) => {
    try {
        const [rows] = await pool.query(
            'CALL sp_get_gp_houses_by_ward(?, ?)',
            [userId, wardNumber]
        );

        // results[0] contains the houses list
        const houses = rows[0] || [];

        return houses.map(h => ({
            id: h.id,
            houseCode: h.house_code,
            headOfHousehold: h.head_of_household,
            address: h.address
        }));
    } catch (error) {
        throw error;
    }
};
