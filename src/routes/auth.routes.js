// src/routes/auth.routes.js
import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import validator from 'validator';
import { query } from '../config/database.js';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    revokeRefreshToken,
    revokeAllUserTokens
} from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { sendVerificationEmail } from '../services/email.service.js';
import { setAuthCookies, clearAuthCookies, getAuthTokens } from '../utils/cookie.js';

// ============================================
// 1. REGISTER - Complete Error Handling
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, dob, orgName } = req.body;

        // ============================================
        // ✅ VALIDATION - Check All Fields
        // ============================================
        const missingFields = [];
        if (!name) missingFields.push('name');
        if (!email) missingFields.push('email');
        if (!password) missingFields.push('password');
        if (!dob) missingFields.push('dob');
        if (!orgName) missingFields.push('orgName');

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_FIELDS',
                message: `Required fields missing: ${missingFields.join(', ')}`,
                missing: missingFields
            });
        }

        // ============================================
        // ✅ VALIDATION - Email Format
        // ============================================
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_EMAIL',
                message: `"${email}" is not a valid email address. Please provide a valid email.`
            });
        }

        // ============================================
        // ✅ VALIDATION - Password Length
        // ============================================
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'PASSWORD_TOO_SHORT',
                message: `Password must be at least 6 characters long. Current length: ${password.length}`
            });
        }

        // ============================================
        // ✅ VALIDATION - Date of Birth (18+)
        // ============================================
        const birthDate = new Date(dob);
        if (isNaN(birthDate.getTime())) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_DATE',
                message: `"${dob}" is not a valid date. Please use YYYY-MM-DD format.`
            });
        }

        const age = (new Date() - birthDate) / (365.25 * 24 * 60 * 60 * 1000);
        if (age < 18) {
            return res.status(400).json({
                success: false,
                error: 'AGE_RESTRICTION',
                message: `You must be 18 or older to register. Your age: ${Math.floor(age)} years`
            });
        }

        // ============================================
        // ✅ CHECK - User Already Exists
        // ============================================
        const existingUser = await query('SELECT * FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'USER_ALREADY_EXISTS',
                message: `User with email "${email}" already exists. Please login or use a different email.`
            });
        }

        // ============================================
        // ✅ CHECK - Organization Slug Unique
        // ============================================
        let slug = orgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const existingOrg = await query('SELECT * FROM organizations WHERE slug = $1', [slug]);

        if (existingOrg.rows.length > 0) {
            slug = slug + '-' + Date.now().toString().slice(-6);
        }

        // ============================================
        // ✅ CREATE - User & Organization
        // ============================================
        const hashedPassword = await hashPassword(password);
        const userId = uuidv4();
        const verifyToken = uuidv4();
        const orgId = uuidv4();

        // Insert user
        await query(
            `INSERT INTO users (id, email, name, password_hash, dob, verify_token)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [userId, email, name, hashedPassword, dob, verifyToken]
        );

        // Insert organization
        await query(
            'INSERT INTO organizations (id, name, slug, created_by) VALUES ($1, $2, $3, $4)',
            [orgId, orgName, slug, userId]
        );

        // Add user as OWNER
        await query(
            `INSERT INTO org_members (organization_id, user_id, role, invited_by, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [orgId, userId, 'owner', userId, 'active']
        );

        // ============================================
        // ✅ EMAIL - Send Verification
        // ============================================
        try {
            await sendVerificationEmail(email, name, verifyToken);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // User create ho gaya hai, but email fail hui
            const accessToken = generateAccessToken({ id: userId, email });
            const refreshToken = await generateRefreshToken(userId);

            setAuthCookies(res, accessToken, refreshToken);

            return res.status(201).json({
                success: true,
                warning: 'EMAIL_SEND_FAILED',
                message: 'Account created but verification email could not be sent. Please use /resend-verification.',
                data: {
                    user: { id: userId, name, email },
                    organization: { id: orgId, name: orgName, role: 'owner' },
                },
            });
        }

        // ============================================
        // ✅ SUCCESS - Generate Tokens & Set Cookies
        // ============================================
        const accessToken = generateAccessToken({ id: userId, email });
        const refreshToken = await generateRefreshToken(userId);

        // ✅ Set HttpOnly Cookies using helper
        setAuthCookies(res, accessToken, refreshToken);

        // ✅ Response (Tokens NOT in body)
        res.status(201).json({
            success: true,
            message: 'Registration successful! Please check your email to verify your account.',
            data: {
                user: { id: userId, name, email },
                organization: { id: orgId, name: orgName, role: 'owner' },
            },
        });

    } catch (error) {
        console.error('Register error:', error);

        // ============================================
        // ❌ DATABASE ERROR HANDLING
        // ============================================

        // Unique constraint violation
        if (error.code === '23505') {
            if (error.constraint === 'users_email_key') {
                return res.status(409).json({
                    success: false,
                    error: 'EMAIL_ALREADY_EXISTS',
                    message: `Email "${email}" is already registered. Please login or use a different email.`
                });
            }
            if (error.constraint === 'organizations_slug_key') {
                return res.status(409).json({
                    success: false,
                    error: 'ORGANIZATION_EXISTS',
                    message: `Organization "${orgName}" already exists. Please choose a different name.`
                });
            }
            return res.status(409).json({
                success: false,
                error: 'DUPLICATE_ENTRY',
                message: 'Duplicate entry detected. Please check your data and try again.'
            });
        }

        // Not null violation
        if (error.code === '23502') {
            return res.status(400).json({
                success: false,
                error: 'MISSING_FIELD',
                message: `Required field is missing: ${error.column || 'unknown'}`
            });
        }

        // Foreign key violation
        if (error.code === '23503') {
            return res.status(400).json({
                success: false,
                error: 'INVALID_REFERENCE',
                message: 'Invalid reference in data. Please check your inputs.'
            });
        }

        // Generic error
        return res.status(500).json({
            success: false,
            error: 'REGISTRATION_FAILED',
            message: 'Registration failed. Please try again later.',
            timestamp: new Date().toISOString()
        });
    }
});

// ============================================
// 2. VERIFY EMAIL
// ============================================
router.get('/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;

        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_TOKEN',
                message: 'Verification token is missing.'
            });
        }

        const result = await query(
            'SELECT * FROM users WHERE verify_token = $1 AND email_verified = $2',
            [token, false]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_TOKEN',
                message: 'Invalid or expired verification link. Please request a new one.'
            });
        }

        await query(
            'UPDATE users SET email_verified = $1, verify_token = NULL WHERE id = $2',
            [true, result.rows[0].id]
        );

        res.json({
            success: true,
            message: 'Email verified successfully! You can now login.',
        });

    } catch (error) {
        console.error('Verify error:', error);
        res.status(500).json({
            success: false,
            error: 'VERIFICATION_FAILED',
            message: 'Verification failed. Please try again.'
        });
    }
});

// ============================================
// 3. LOGIN
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // ✅ Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_FIELDS',
                message: 'Email and password are both required.'
            });
        }

        const result = await query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password. Please try again.'
            });
        }

        const user = result.rows[0];

        // ✅ Check email verified
        if (!user.email_verified) {
            return res.status(403).json({
                success: false,
                error: 'EMAIL_NOT_VERIFIED',
                message: 'Please verify your email before logging in. Check your inbox or request a new verification email.',
                resendUrl: '/api/auth/resend-verification'
            });
        }

        // ✅ Check password
        const isValid = await comparePassword(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'INVALID_CREDENTIALS',
                message: 'Invalid email or password. Please try again.'
            });
        }

        // ✅ Get organizations
        const orgs = await query(
            `SELECT o.id, o.name, o.slug, m.role
             FROM organizations o
             JOIN org_members m ON m.organization_id = o.id
             WHERE m.user_id = $1 AND m.status = $2`,
            [user.id, 'active']
        );

        // ============================================
        // ✅ Generate Tokens & Set Cookies
        // ============================================
        const accessToken = generateAccessToken({ id: user.id, email: user.email });
        const refreshToken = await generateRefreshToken(user.id);

        // ✅ Set cookies using helper
        setAuthCookies(res, accessToken, refreshToken);

        // ✅ Response (Tokens NOT in body)
        res.json({
            success: true,
            message: 'Login successful!',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                },
                organizations: orgs.rows,
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: 'LOGIN_FAILED',
            message: 'Login failed. Please try again later.'
        });
    }
});

// ============================================
// 4. REFRESH TOKEN
// ============================================
router.post('/refresh-token', async (req, res) => {
    try {
        // ✅ Get refresh token from cookie using helper
        const { refreshToken } = getAuthTokens(req);

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                error: 'MISSING_TOKEN',
                message: 'No refresh token provided.'
            });
        }

        const tokenData = await verifyRefreshToken(refreshToken);

        if (!tokenData) {
            return res.status(401).json({
                success: false,
                error: 'INVALID_TOKEN',
                message: 'Invalid or expired refresh token. Please login again.'
            });
        }

        const user = await query('SELECT * FROM users WHERE id = $1', [tokenData.user_id]);
        if (user.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'USER_NOT_FOUND',
                message: 'User not found. Please login again.'
            });
        }

        // Revoke old refresh token
        await revokeRefreshToken(refreshToken);

        // Generate new tokens
        const newAccessToken = generateAccessToken({
            id: user.rows[0].id,
            email: user.rows[0].email
        });
        const newRefreshToken = await generateRefreshToken(user.rows[0].id);

        // ✅ Set new cookies using helper
        setAuthCookies(res, newAccessToken, newRefreshToken);

        res.json({
            success: true,
            message: 'Token refreshed successfully!',
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            success: false,
            error: 'REFRESH_FAILED',
            message: 'Failed to refresh token. Please login again.'
        });
    }
});

// ============================================
// 5. LOGOUT
// ============================================
router.post('/logout', async (req, res) => {
    try {
        // ✅ Get refresh token from cookie using helper
        const { refreshToken } = getAuthTokens(req);

        if (refreshToken) {
            await revokeRefreshToken(refreshToken);
        }

        // ✅ Clear cookies using helper
        clearAuthCookies(res);

        res.json({
            success: true,
            message: 'Logged out successfully!',
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            error: 'LOGOUT_FAILED',
            message: 'Failed to logout. Please try again.'
        });
    }
});

// ============================================
// 6. GET CURRENT USER
// ============================================
// ============================================
// 6. GET CURRENT USER (WITH ORGANIZATION)
// ============================================
router.get('/me', async (req, res) => {
    try {
        // ✅ Get access token from cookie using helper
        const { accessToken } = getAuthTokens(req);

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                error: 'UNAUTHORIZED',
                message: 'Not authenticated.'
            });
        }

        const decoded = verifyAccessToken(accessToken);

        // ✅ Get user details
        const userResult = await query(
            `SELECT id, email, name, dob, email_verified, created_at
             FROM users WHERE id = $1`,
            [decoded.id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'USER_NOT_FOUND',
                message: 'User not found.'
            });
        }

        // ✅ Get user's organization
        const orgResult = await query(
            `SELECT o.id, o.name, o.slug, m.role
             FROM organizations o
             JOIN org_members m ON m.organization_id = o.id
             WHERE m.user_id = $1 AND m.status = $2`,
            [decoded.id, 'active']
        );

        // ✅ Response with user + organization
        res.json({
            success: true,
            data: {
                user: userResult.rows[0],
                organization: orgResult.rows[0] || null,
            },
        });

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            error: 'SERVER_ERROR',
            message: 'Failed to get user.'
        });
    }
});

// ============================================
// 7. RESEND VERIFICATION
// ============================================
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_EMAIL',
                message: 'Email is required.'
            });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_EMAIL',
                message: `"${email}" is not a valid email address.`
            });
        }

        const result = await query(
            'SELECT * FROM users WHERE email = $1 AND email_verified = $2',
            [email, false]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'USER_NOT_FOUND',
                message: `No user found with email "${email}" or already verified.`
            });
        }

        const user = result.rows[0];
        const newToken = uuidv4();

        await query(
            'UPDATE users SET verify_token = $1 WHERE id = $2',
            [newToken, user.id]
        );

        await sendVerificationEmail(email, user.name, newToken);

        res.json({
            success: true,
            message: `Verification email sent again to ${email}. Please check your inbox.`,
        });

    } catch (error) {
        console.error('Resend error:', error);
        res.status(500).json({
            success: false,
            error: 'RESEND_FAILED',
            message: 'Failed to resend verification email. Please try again.'
        });
    }
});

export default router;
