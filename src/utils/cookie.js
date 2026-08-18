// src/utils/cookie.js

/**
 * Set HttpOnly Cookies for authentication
 * @param {Object} res - Express response object
 * @param {string} accessToken - JWT access token
 * @param {string} refreshToken - Refresh token
 */
export const setAuthCookies = (res, accessToken, refreshToken) => {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access Token Cookie (7 days)
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/',
    });

    // Refresh Token Cookie (30 days)
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        path: '/',
    });
};

/**
 * Clear HttpOnly Cookies (Logout)
 * @param {Object} res - Express response object
 */
export const clearAuthCookies = (res) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
};

/**
 * Get tokens from cookies
 * @param {Object} req - Express request object
 * @returns {Object} { accessToken, refreshToken }
 */
export const getAuthTokens = (req) => {
    return {
        accessToken: req.cookies?.accessToken,
        refreshToken: req.cookies?.refreshToken,
    };
};
