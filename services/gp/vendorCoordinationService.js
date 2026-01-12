import pool from '../../config/database.js';

/**
 * Get vendor coordination statistics
 */
export const getVendorStatsService = async (userId) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_vendor_stats(?, @total, @active, @onboarding, @inactive, @error, @msg);
             SELECT @total as total_vendors, @active as active_vendors, @onboarding as onboarding_vendors, @inactive as inactive_vendors, @error as error_code, @msg as message;`,
            [userId]
        );

        const result = rows[1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve vendor statistics');
        }

        return {
            totalVendors: result.total_vendors || 0,
            activeVendors: result.active_vendors || 0,
            onboardingVendors: result.onboarding_vendors || 0,
            inactiveVendors: result.inactive_vendors || 0
        };
    } catch (error) {
        throw error;
    }
};

/**
 * Get vendors list
 */
export const getVendorsListService = async (userId, search) => {
    try {
        const [rows] = await pool.query(
            `CALL sp_get_vendors_list(?, ?, @error, @msg);
             SELECT @error as error_code, @msg as message;`,
            [userId, search]
        );

        const result = rows[rows.length - 1]?.[0];

        if (!result || result.error_code !== 0) {
            throw new Error(result?.message || 'Failed to retrieve vendors list');
        }

        // vendors data is in rows[0]
        const vendors = rows[0] || [];

        return vendors.map(vendor => ({
            id: vendor.id,
            name: vendor.vendor_name,
            type: vendor.vendor_type,
            contact: vendor.contact_phone,
            status: vendor.status,
            lastPickup: vendor.last_pickup_at ? new Date(vendor.last_pickup_at).toLocaleString() : '-'
        }));
    } catch (error) {
        throw error;
    }
};
