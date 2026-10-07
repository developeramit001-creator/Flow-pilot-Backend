// src/middleware/auth.js
import { verifyAccessToken } from '../utils/jwt.js';
import { query } from '../config/database.js';

/**
 * Authentication Middleware
 * Verifies Access Token from Cookie (HttpOnly)
 */
const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Cookie se token lo (Authorization header se nahi)
        const token = req.cookies?.accessToken;



        // ✅ Debug (optional)
        // console.log('Cookie:', req.cookies);
        // console.log('Token from cookie:', token);

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'UNAUTHORIZED',
                message: 'No token provided. Please login first.'
            });
        }

        // ✅ Verify Access Token
        const decoded = verifyAccessToken(token);

        // ✅ Check if user exists
        const result = await query('SELECT * FROM users WHERE id = $1', [decoded.id]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'UNAUTHORIZED',
                message: 'User not found. Please login again.'
            });
        }

        // ✅ Attach user to request
        req.user = result.rows[0];
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'TOKEN_EXPIRED',
                message: 'Access token expired. Please refresh token.'
            });
        }
        return res.status(401).json({
            success: false,
            error: 'INVALID_TOKEN',
            message: 'Invalid token. Please login again.'
        });
    }
};

export { authMiddleware };
