import pool from '../../config/database.js';

/**
 * Get District Vehicles Statistics
 */
export const getDistrictVehiclesStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_vehicles_stats(?, @total, @active, @maintenance, @inactive, @error, @msg);
             SELECT @total AS total_vehicles, @active AS active_vehicles, 
                    @maintenance AS in_maintenance, @inactive AS inactive,
                    @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve statistics'
            };
        }

        return {
            error_code: 0,
            message: 'Statistics retrieved successfully',
            data: {
                totalVehicles: result.total_vehicles || 0,
                activeVehicles: result.active_vehicles || 0,
                inMaintenance: result.in_maintenance || 0,
                inactive: result.inactive || 0
            }
        };

    } catch (error) {
        console.error('Get district vehicles stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Get District Vehicles List
 */
export const getDistrictVehiclesListService = async (userId, filters) => {
    try {
        const {
            blockId = null,
            status = null,
            vehicleType = null,
            search = null,
            page = 1,
            pageSize = 15
        } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_district_vehicles_list(?, ?, ?, ?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, blockId, status, vehicleType, search, page, pageSize]
        );

        let items = [];
        let result = null;

        if (rows.length >= 3) {
            items = rows[0] || [];
            result = rows[2]?.[0];
        } else if (rows.length >= 2) {
            result = rows[rows.length - 1]?.[0];
        } else {
            return {
                error_code: 1,
                message: 'Stored procedure returned unexpected result structure'
            };
        }

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to retrieve list'
            };
        }

        const totalRecords = result.total_records || 0;
        const totalPages = Math.ceil(totalRecords / pageSize);

        return {
            error_code: 0,
            message: 'List retrieved successfully',
            data: {
                items: items.map(item => ({
                    vehicleId: item.vehicle_id,
                    registrationNumber: item.registration_number,
                    vehicleType: item.vehicle_type,
                    capacityKg: parseFloat(item.capacity_kg) || 0,
                    status: item.status,
                    isActive: item.is_active,
                    lastMaintenanceDate: item.last_maintenance_date,
                    nextMaintenanceDate: item.next_maintenance_date,
                    totalKmDriven: parseFloat(item.total_km_driven) || 0,
                    blockId: item.block_id,
                    blockName: item.block_name,
                    assignedToName: item.assigned_to_name,
                    assignedToType: item.assigned_to_type,
                    assignedCollector: item.assigned_collector
                })),
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get district vehicles list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching list',
            error: error.message
        };
    }
};
