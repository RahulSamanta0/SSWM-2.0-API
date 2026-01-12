import pool from '../../config/database.js';
import bcrypt from 'bcrypt';

/**
 * Get District Block Admins Statistics
 */
export const getDistrictBlockAdminsStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_district_block_admins_stats(?, @total, @active, @total_admins, @active_admins, @error, @msg);
             SELECT @total AS total_blocks, @active AS active_blocks, 
                    @total_admins AS total_block_admins, @active_admins AS active_block_admins,
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
                activeBlocks: result.active_blocks || 0,
                totalBlockAdmins: result.total_block_admins || 0,
                activeBlockAdmins: result.active_block_admins || 0
            }
        };

    } catch (error) {
        console.error('Get district block admins stats service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching statistics',
            error: error.message
        };
    }
};

/**
 * Get District Block Admins List
 */
export const getDistrictBlockAdminsListService = async (userId, filters) => {
    try {
        const { search = null, page = 1, pageSize = 15 } = filters;

        const [rows] = await pool.query(
            `CALL sp_get_district_block_admins_list(?, ?, ?, ?, @total, @error, @msg);
             SELECT @total AS total_records, @error AS error_code, @msg AS message;`,
            [userId, search, page, pageSize]
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
                    blockId: item.block_id,
                    blockName: item.block_name,
                    blockCode: item.block_code,
                    totalGps: item.total_gps || 0,
                    totalMunicipalities: item.total_municipalities || 0,
                    blockIsActive: item.block_is_active,
                    adminId: item.admin_id,
                    adminName: item.admin_name,
                    adminUsername: item.admin_username,
                    adminEmail: item.admin_email,
                    adminPhone: item.admin_phone,
                    adminIsActive: item.admin_is_active
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
        console.error('Get district block admins list service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while fetching list',
            error: error.message
        };
    }
};

/**
 * Add Block with Admin
 */
export const addBlockWithAdminService = async (userId, blockData) => {
    try {
        const {
            blockName,
            adminFullName,
            adminUsername,
            adminEmail,
            adminPhone,
            adminPassword
        } = blockData;

        // Hash password
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        const [rows] = await pool.query(
            `CALL sp_add_block_with_admin(?, ?, ?, ?, ?, ?, ?, @block_id, @block_code, @admin_id, @error, @msg);
             SELECT @block_id AS block_id, @block_code AS block_code, @admin_id AS admin_id,
                    @error AS error_code, @msg AS message;`,
            [userId, blockName, adminFullName, adminUsername, adminEmail, adminPhone, passwordHash]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to add block with admin'
            };
        }

        return {
            error_code: 0,
            message: 'Block and admin created successfully',
            data: {
                blockId: result.block_id,
                blockCode: result.block_code,
                adminId: result.admin_id
            }
        };

    } catch (error) {
        console.error('Add block with admin service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while adding block with admin',
            error: error.message
        };
    }
};

/**
 * Update Block
 */
export const updateBlockService = async (userId, blockId, blockData) => {
    try {
        const {
            blockName,
            adminFullName,
            adminEmail,
            adminPhone
        } = blockData;

        const [rows] = await pool.query(
            `CALL sp_update_block(?, ?, ?, ?, ?, ?, @error, @msg);
             SELECT @error AS error_code, @msg AS message;`,
            [userId, blockId, blockName, adminFullName, adminEmail, adminPhone]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            return {
                error_code: result?.error_code || 1,
                message: result?.message || 'Failed to update block'
            };
        }

        return {
            error_code: 0,
            message: 'Block updated successfully'
        };

    } catch (error) {
        console.error('Update block service error:', error);
        return {
            error_code: 1,
            message: 'An error occurred while updating block',
            error: error.message
        };
    }
};
