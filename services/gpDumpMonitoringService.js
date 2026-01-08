import pool from '../config/database.js';

/**
 * Get dump monitoring statistics
 */
export const getDumpMonitoringStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_dump_monitoring_stats(?, @total_sites, @total_used_mt, @sites_high_usage, @available_capacity_mt, @error, @msg);
             SELECT @total_sites as total_sites, @total_used_mt as total_used_mt, @sites_high_usage as sites_high_usage, @available_capacity_mt as available_capacity_mt, @error as error_code, @msg as message;`,
            [userId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve dump monitoring statistics');
        }

        return {
            totalSites: result.total_sites || 0,
            totalUsedMt: parseFloat(result.total_used_mt) || 0,
            sitesHighUsage: result.sites_high_usage || 0,
            availableCapacityMt: parseFloat(result.available_capacity_mt) || 0
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get dump sites list
 */
export const getDumpSitesListService = async (userId, search) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_dump_sites_list(?, ?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId, search]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve dump sites list');
        }

        // sites data is in rows[0]
        const sites = rows[0] || [];

        return sites.map(site => ({
            id: site.id,
            siteName: site.site_name,
            location: site.location,
            capacityMt: parseFloat(site.capacity_mt) || 0,
            usedMt: parseFloat(site.used_mt) || 0,
            availableMt: parseFloat(site.available_mt) || 0,
            utilizationPct: parseFloat(site.utilization_pct) || 0,
            status: site.status
        }));
    } catch (error) {
        throw error;
    }
};
