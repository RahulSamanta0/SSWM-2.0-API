import pool from '../config/database.js';

/**
 * Get GP/Municipality Statistics
 * Returns aggregate counts for Block dashboard
 */
export const getGpMunStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_gp_mun_stats(?, @total_gps, @total_mun, @total_collectors, @avg_eff, @total_houses, @total_alerts, @error, @msg);
             SELECT @total_gps AS total_gps, @total_mun AS total_municipalities, @total_collectors AS total_collectors,
                    @avg_eff AS avg_efficiency, @total_houses AS total_households, @total_alerts AS total_alerts,
                    @error AS error_code, @msg AS message;`,
            [userId]
        );

        const result = rows[1]?.[0]; // OUT parameters at index 1

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
                totalGPs: result.total_gps || 0,
                totalMunicipalities: result.total_municipalities || 0,
                totalCollectors: result.total_collectors || 0,
                avgEfficiency: parseFloat(result.avg_efficiency) || 0,
                totalHouseholds: result.total_households || 0,
                totalAlerts: result.total_alerts || 0
            }
        };

    } catch (error) {
        console.error('Get GP/Mun stats service error:', error);
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            sqlMessage: error.sqlMessage
        });
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Add Gram Panchayat
 * Auto-generates GP code and creates admin account
 */
export const addGramPanchayatService = async (userId, gpData) => {
    try {
        const { name, population, areaSqkm, adminUsername, adminEmail, adminFullName, adminPhone, adminPassword } = gpData;

        // Hash password
        const bcrypt = (await import('bcryptjs')).default;
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const [rows] = await pool.query(
            `CALL sp_add_gram_panchayat(?, ?, ?, ?, ?, ?, ?, ?, ?, @gp_id, @gp_code, @admin_id, @error, @msg);
             SELECT @gp_id AS gp_id, @gp_code AS gp_code, @admin_id AS admin_user_id, @error AS error_code, @msg AS message;`,
            [userId, name, population || null, areaSqkm || null, adminUsername, adminEmail, adminFullName, adminPhone || null, passwordHash]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to add Gram Panchayat'
            };
        }

        return {
            error_code: 0,
            message: 'Gram Panchayat and admin account created successfully',
            data: {
                gpId: result.gp_id,
                gpCode: result.gp_code,
                adminUserId: result.admin_user_id,
                adminUsername: adminUsername,
                adminEmail: adminEmail
            }
        };

    } catch (error) {
        console.error('Add GP service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while adding Gram Panchayat',
            error: error.message
        };
    }
};

/**
 * Add Municipality
 * Auto-generates Municipality code and creates admin account
 */
export const addMunicipalityService = async (userId, munData) => {
    try {
        const { name, population, areaSqkm, wardsCount, adminUsername, adminEmail, adminFullName, adminPhone, adminPassword } = munData;

        // Hash password
        const bcrypt = (await import('bcryptjs')).default;
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const [rows] = await pool.query(
            `CALL sp_add_municipality(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @mun_id, @mun_code, @admin_id, @error, @msg);
             SELECT @mun_id AS mun_id, @mun_code AS mun_code, @admin_id AS admin_user_id, @error AS error_code, @msg AS message;`,
            [userId, name, population || null, areaSqkm || null, wardsCount || null, adminUsername, adminEmail, adminFullName, adminPhone || null, passwordHash]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to add Municipality'
            };
        }

        return {
            error_code: 0,
            message: 'Municipality and admin account created successfully',
            data: {
                munId: result.mun_id,
                munCode: result.mun_code,
                adminUserId: result.admin_user_id,
                adminUsername: adminUsername,
                adminEmail: adminEmail
            }
        };

    } catch (error) {
        console.error('Add Municipality service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while adding Municipality',
            error: error.message
        };
    }
};

/**
 * Get GP/Municipality List
 * Combined list with type filter and pagination
 */
export const getGpMunListService = async (userId, filters) => {
    try {
        const {
            type = 'all',
            page = 1,
            pageSize = 10
        } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_gp_mun_list(?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, type, page, pageSize]
        );

        // Validate result structure
        if (!rows || rows.length < 3) {
            return {
                error_code: 1,
                message: 'Stored procedure sp_get_gp_mun_list may not be loaded'
            };
        }

        const items = rows[0] || [];
        const result = rows[2]?.[0]; // OUT parameters at index 2 (with UNION queries)

        if (!result || result.error_code !== 0) {
            console.error('List error:', result?.error_code, result?.message);
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
                items: items,
                pagination: {
                    currentPage: page,
                    pageSize: pageSize,
                    totalRecords: totalRecords,
                    totalPages: totalPages
                }
            }
        };

    } catch (error) {
        console.error('Get GP/Mun list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching list',
            error: error.message
        };
    }
};
