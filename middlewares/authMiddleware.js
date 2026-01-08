import jwt from 'jsonwebtoken';

/**
 * Authentication Middleware
 * Verifies JWT token and attaches user data to request
 */
export const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required',
                statusCode: 401
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token',
                    statusCode: 403
                });
            }

            // Attach user data to request
            req.user = decoded;
            next();
        });

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            statusCode: 500
        });
    }
};

/**
 * Role-Based Authorization Middleware
 * Checks if user has required role
 * Usage: authorizeRole('state_admin', 'district_admin')
 */
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            const userRole = req.user?.role;

            if (!userRole) {
                return res.status(401).json({
                    success: false,
                    message: 'User role not found',
                    statusCode: 401
                });
            }

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access forbidden - Insufficient permissions',
                    statusCode: 403
                });
            }

            next();

        } catch (error) {
            console.error('Authorization middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error',
                statusCode: 500
            });
        }
    };
};
