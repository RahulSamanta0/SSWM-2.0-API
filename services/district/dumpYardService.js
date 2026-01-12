import pool from '../../config/database.js';

/**
 * Get District Dump Sites Statistics
 */
export const getDistrictDumpSitesStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_dump_sites_stats(?, @total, @capacity, @usage, @utilization, @operational, @critical, @error, @msg);
             SELECT @total AS total_sites, @capacity AS total_capacity_mt, @usage AS current_usage_mt,
                    @utilization AS utilization_percentage, @operational AS operational_sites,
                    @critical AS critical_sites, @error AS error_code, @msg AS message;`,
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
                totalSites: result.total_sites || 0,
                totalCapacityMt: parseFloat(result.total_capacity_mt) || 0,
                currentUsageMt: parseFloat(result.current_usage_mt) || 0,
                utilizationPercentage: parseFloat(result.utilization_percentage) || 0,
                operationalSites: result.operational_sites || 0,
                criticalSites: result.critical_sites || 0
            }
        };

    } catch (error) {
        console.error('Get district dump stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Get District Dump Sites List
 */
export const getDistrictDumpSitesListService = async (userId, params) => {
    try {
        const { page, pageSize, search, status, siteType, blockId } = params;

        const [rows] = await pool.query(
            `CALL sp_get_district_dump_sites_list(?, ?, ?, ?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_count, @error AS error_code, @msg AS message;`,
            [userId, page, pageSize, search, status, siteType, blockId]
        );

        // Check result sets structure
        // The structure returned is: [ [sites...], {OkPacket}, [ [meta...] ] ]

        let sites = [];
        let meta = null;

        if (rows.length >= 3 && Array.isArray(rows[0])) {
            // Success path: sites is first element
            sites = rows[0];
            // Meta is in the last element (which is an array containing the meta row)
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            // Error path: Try to find the meta packet in the last element
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) {
                meta = lastElem[0];
            }
        }

        if (!meta || meta.error_code !== 0) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve dump sites list'
            };
        }

        return {
            error_code: 0,
            message: 'Dump sites retrieved successfully',
            data: {
                sites: sites.map(site => ({
                    id: site.id,
                    siteCode: site.site_code,
                    siteName: site.site_name,
                    siteType: site.site_type,
                    status: site.status,
                    totalCapacityMt: parseFloat(site.total_capacity_mt) || 0,
                    currentUsageMt: parseFloat(site.current_usage_mt) || 0,
                    utilizationPercentage: parseFloat(site.utilization_percentage) || 0,
                    address: site.address,
                    location: {
                        lat: parseFloat(site.latitude),
                        lng: parseFloat(site.longitude)
                    },
                    operationalHours: site.operational_hours,
                    blockName: site.block_name,
                    localBodyName: site.local_body_name,
                    localBodyType: site.local_body_type
                })),
                pagination: {
                    total: meta.total_count,
                    page: parseInt(page),
                    pageSize: parseInt(pageSize),
                    totalPages: Math.ceil(meta.total_count / pageSize)
                }
            }
        };

    } catch (error) {
        console.error('Get district dump list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching dump sites list',
            error: error.message
        };
    }
};
