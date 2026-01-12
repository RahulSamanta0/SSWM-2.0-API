import pool from '../../config/database.js';

/**
 * Get Vehicle Statistics
 * Returns counts by status for block
 */
export const getVehicleStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_vehicle_stats(?, @total, @on_route, @workshop, @standby, @error, @msg);
             SELECT @total AS total_vehicles, @on_route AS on_route, @workshop AS in_workshop, 
                    @standby AS standby, @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0]; // OUT parameters at index 1

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve vehicle statistics'
            };
        }

        return {
            error_code: 0,
            message: 'Vehicle statistics retrieved successfully',
            data: {
                totalVehicles: result.total_vehicles || 0,
                onRoute: result.on_route || 0,
                inWorkshop: result.in_workshop || 0,
                standby: result.standby || 0
            }
        };

    } catch (error) {
        console.error('Get vehicle stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching vehicle statistics',
            error: error.message
        };
    }
};

/**
 * Add Vehicle
 * Creates vehicle and assigns to GP or Municipality
 */
export const addVehicleService = async (userId, vehicleData) => {
    try {
        const { registrationNumber, vehicleType, capacityKg, gpId, municipalityId } = vehicleData;

        const [rows] = await pool.query(
            `CALL sp_add_vehicle(?, ?, ?, ?, ?, ?, @vehicle_id, @error, @msg);
             SELECT @vehicle_id AS vehicle_id, @error AS error_code, @msg AS message;`,
            [userId, registrationNumber, vehicleType, capacityKg || null, gpId || null, municipalityId || null]
        );

        const result = rows[1]?.[0]; // OUT parameters at index 1

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to add vehicle'
            };
        }

        return {
            error_code: 0,
            message: 'Vehicle added successfully',
            data: {
                vehicleId: result.vehicle_id
            }
        };

    } catch (error) {
        console.error('Add vehicle service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while adding vehicle',
            error: error.message
        };
    }
};

/**
 * Get Vehicles List
 * Returns paginated list with filters
 */
export const getVehiclesListService = async (userId, filters) => {
    try {
        const { type = 'all', page = 1, pageSize = 15 } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_vehicles_list(?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, type, page, pageSize]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_vehicles_list may not be loaded'
            };
        }

        const vehicles = rows[0] || [];
        const result = rows[2]?.[0]; // OUT parameters at index 2 (with SELECT results)

        if (!result || result.error_code !== 0) {
            console.error('List vehicles error:', result?.error_code, result?.message);
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve vehicles list'
            };
        }

        const totalRecords = result.total_records || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            error_code: 0,
            message: 'Vehicles list retrieved successfully',
            data: {
                vehicles: vehicles,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get vehicles list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching vehicles list',
            error: error.message
        };
    }
};
