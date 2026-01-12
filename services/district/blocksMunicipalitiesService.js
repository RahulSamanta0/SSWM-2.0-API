import pool from '../../config/database.js';

/**
 * Get District Blocks & Municipalities Statistics
 */
export const getDistrictBlocksMunStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_blocks_mun_stats(?, @blocks, @gps, @muns, @pop, @area, @error, @msg);
             SELECT @blocks AS total_blocks, @gps AS total_gps, @muns AS total_municipalities,
                    @pop AS total_population, @area AS total_area,
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
                totalBlocks: result.total_blocks || 0,
                totalGPs: result.total_gps || 0,
                totalMunicipalities: result.total_municipalities || 0,
                totalPopulation: result.total_population || 0,
                totalArea: parseFloat(result.total_area) || 0
            }
        };

    } catch (error) {
        console.error('Get district blocks/municipalities stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Get District Blocks & Municipalities List
 */
export const getDistrictBlocksMunListService = async (userId, filters) => {
    try {
        const { type = 'all', search = null, page = 1, pageSize = 15 } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_district_blocks_mun_list(?, ?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, type, search, page, pageSize]
        );

        // Check results
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
                message: 'Stored procedure sp_get_district_blocks_mun_list returned unexpected result structure'
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
                    id: item.id,
                    type: item.type,
                    name: item.name,
                    code: item.code,
                    blockName: item.block_name,
                    totalGps: item.total_gps,
                    totalMunicipalities: item.total_municipalities,
                    totalWards: item.total_wards,
                    population: item.population,
                    areaSqKm: parseFloat(item.area_sq_km) || 0,
                    municipalityType: item.municipality_type,
                    isActive: item.is_active
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
        console.error('Get district blocks/municipalities list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching list',
            error: error.message
        };
    }
};
