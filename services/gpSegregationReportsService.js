import pool from '../config/database.js';

/**
 * Get segregation statistics
 */
export const getSegregationStatsService = async (userId, dateFrom, dateTo) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_segregation_stats(?, ?, ?, @dry_pct, @wet_pct, @mixed_pct, @total_wards, @error, @msg);
             SELECT @dry_pct as dry_pct, @wet_pct as wet_pct, @mixed_pct as mixed_pct, @total_wards as total_wards, @error as error_code, @msg as message;`,
            [userId, dateFrom, dateTo]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve segregation statistics');
        }

        return {
            dryPct: parseFloat(result.dry_pct) || 0,
            wetPct: parseFloat(result.wet_pct) || 0,
            mixedPct: parseFloat(result.mixed_pct) || 0,
            totalWards: result.total_wards || 0
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get ward-wise segregation data
 */
export const getSegregationByWardService = async (userId, dateFrom, dateTo, search) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_segregation_by_ward(?, ?, ?, ?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId, dateFrom, dateTo, search]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve ward-wise segregation data');
        }

        // ward data is in rows[0]
        const wards = rows[0] || [];

        return wards.map(ward => ({
            ward: ward.ward_number,
            dryPct: parseFloat(ward.dry_pct) || 0,
            wetPct: parseFloat(ward.wet_pct) || 0,
            mixedPct: parseFloat(ward.mixed_pct) || 0,
            totalKg: parseFloat(ward.total_kg) || 0
        }));
    } catch (error) {
        throw error;
    }
};
