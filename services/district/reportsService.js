import pool from '../../config/database.js';

/**
 * Get District Collection Trends
 */
export const getDistrictCollectionTrendsService = async (userId, filters) => {
    try {
        const { startDate, endDate, blockId } = filters;

        // Use current month if no dates provided
        const finalStartDate = startDate || new Date(new Date().setDate(1)).toISOString().split('T')[0];
        const finalEndDate = endDate || new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            `CALL sp_get_district_collection_trends(?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, finalStartDate, finalEndDate, blockId]
        );

        // Expected: [ [trends], {Ok}, [meta] ]
        let trends = [];
        let meta = null;

        if (rows.length >= 3) {
            trends = rows[0];
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) meta = lastElem[0];
        }

        if (!meta || meta.error_code !== 0) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve trends'
            };
        }

        return {
            error_code: 0,
            message: 'Trends retrieved successfully',
            data: {
                trends: trends.map(t => ({
                    date: t.collection_date,
                    totalCollections: t.total_collections,
                    totalWasteKg: parseFloat(t.total_waste_kg) || 0,
                    dryWasteKg: parseFloat(t.dry_waste_kg) || 0,
                    wetWasteKg: parseFloat(t.wet_waste_kg) || 0,
                    eWasteKg: parseFloat(t.e_waste_kg) || 0,
                    rejectWasteKg: parseFloat(t.reject_waste_kg) || 0
                }))
            }
        };
    } catch (error) {
        console.error('Get district trends service error:', error);
        return { error_code: 1, message: 'Internal server error', error: error.message };
    }
};

/**
 * Get District Waste Distribution
 */
export const getDistrictWasteDistributionService = async (userId, filters) => {
    try {
        const { startDate, endDate, blockId } = filters;

        const finalStartDate = startDate || new Date(new Date().setDate(1)).toISOString().split('T')[0];
        const finalEndDate = endDate || new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            `CALL sp_get_district_waste_distribution(?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, finalStartDate, finalEndDate, blockId]
        );

        let distribution = [];
        let meta = null;

        if (rows.length >= 3) {
            distribution = rows[0];
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) meta = lastElem[0];
        }

        if (!meta || meta.error_code !== 0) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve distribution'
            };
        }

        // Calculate total for percentages
        const totalWeight = distribution.reduce((sum, item) => sum + (parseFloat(item.weight_kg) || 0), 0);

        return {
            error_code: 0,
            message: 'Distribution retrieved successfully',
            data: {
                distribution: distribution.map(d => ({
                    category: d.category,
                    weightKg: parseFloat(d.weight_kg) || 0,
                    percentage: totalWeight > 0 ? ((parseFloat(d.weight_kg) / totalWeight) * 100).toFixed(2) : 0
                })),
                totalWeightKg: totalWeight
            }
        };
    } catch (error) {
        console.error('Get district distribution service error:', error);
        return { error_code: 1, message: 'Internal server error', error: error.message };
    }
};

/**
 * Get District Block Performance
 */
export const getDistrictBlockPerformanceService = async (userId, filters) => {
    try {
        const { startDate, endDate } = filters;
        const finalStartDate = startDate || new Date(new Date().setDate(1)).toISOString().split('T')[0];
        const finalEndDate = endDate || new Date().toISOString().split('T')[0];

        const [rows] = await pool.query(
            `CALL sp_get_district_block_performance_report(?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, finalStartDate, finalEndDate]
        );

        let blocks = [];
        let meta = null;

        if (rows.length >= 3) {
            blocks = rows[0];
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) meta = lastElem[0];
        }

        if (!meta || meta.error_code !== 0) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve block performance'
            };
        }

        return {
            error_code: 0,
            message: 'Block performance retrieved successfully',
            data: {
                blocks: blocks.map(b => ({
                    blockId: b.block_id,
                    blockName: b.block_name,
                    totalHouseholds: b.total_households,
                    householdsServed: b.households_served,
                    totalWasteKg: parseFloat(b.total_waste_kg) || 0,
                    efficiencyPercentage: parseFloat(b.efficiency_percentage) || 0
                }))
            }
        };
    } catch (error) {
        console.error('Get district block performance service error:', error);
        return { error_code: 1, message: 'Internal server error', error: error.message };
    }
};

/**
 * Get District Activity Logs
 */
export const getDistrictActivityLogsService = async (userId, limit = 50) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_activity_logs(?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, limit]
        );

        let logs = [];
        let meta = null;

        if (rows.length >= 3) {
            logs = rows[0];
            meta = rows[rows.length - 1]?.[0];
        } else if (rows.length >= 1) {
            const lastElem = rows[rows.length - 1];
            if (Array.isArray(lastElem)) meta = lastElem[0];
        }

        if (!meta || meta.error_code !== 0) {
            return {
                error_code: meta?.error_code || 1,
                message: meta?.message || 'Failed to retrieve activity logs'
            };
        }

        return {
            error_code: 0,
            message: 'Activity logs retrieved successfully',
            data: {
                logs: logs.map(l => ({
                    id: l.id,
                    type: l.type,
                    description: l.description,
                    timestamp: l.created_at,
                    status: l.status,
                    collectorCode: l.collector_code,
                    blockName: l.block_name
                }))
            }
        };
    } catch (error) {
        console.error('Get district activity logs service error:', error);
        return { error_code: 1, message: 'Internal server error', error: error.message };
    }
};
