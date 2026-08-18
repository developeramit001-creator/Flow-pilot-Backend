// src/utils/jwt.js
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRY } from '../config/auth.js';
import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database.js';

// ============================================
// ACCESS TOKEN - Short lived (7 days)
// ============================================
const generateAccessToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// ============================================
// REFRESH TOKEN - Long lived (30 days)
// ============================================
const generateRefreshToken = async (userId) => {
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await query(
        `INSERT INTO refresh_tokens (user_id, token, expires_at)
         VALUES ($1, $2, $3)`,
        [userId, token, expiresAt]
    );

    return token;
};

// ============================================
// VERIFY ACCESS TOKEN
// ============================================
const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

// ============================================
// VERIFY REFRESH TOKEN (Check in DB)
// ============================================
const verifyRefreshToken = async (token) => {
    const result = await query(
        `SELECT * FROM refresh_tokens
         WHERE token = $1 AND revoked = $2 AND expires_at > NOW()`,
        [token, false]
    );
    return result.rows[0] || null;
};

// ============================================
// REVOKE REFRESH TOKEN (Logout)
// ============================================
const revokeRefreshToken = async (token) => {
    await query(
        'UPDATE refresh_tokens SET revoked = $1 WHERE token = $2',
        [true, token]
    );
};

// ============================================
// REVOKE ALL USER TOKENS (Password Change)
// ============================================
const revokeAllUserTokens = async (userId) => {
    await query(
        'UPDATE refresh_tokens SET revoked = $1 WHERE user_id = $2',
        [true, userId]
    );
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens
};
